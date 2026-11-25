// Emulador de la controladora D/U-M1 del RV-M1: recibe líneas de texto como por el RS-232C y las ejecuta en orden.
// Headless y determinista: el tiempo solo avanza con avanzar(dt_ms). No usa Date ni temporizadores.
//
//   const c = crearControladora({ config });
//   c.enviar('DJ 1,10', resp => ...)   encola una línea (como escribirla por el puerto serie). resp(texto) solo para WH y ER.
//   c.avanzar(16)                      avanza la simulación 16 ms
//   c.estado()                         instantánea: q, pose, err, referenciado, sp, tl, pinza, ocupado, cola, posiciones...
//   c.alEvento(fn)                     fn({ tipo: 'rx'|'tx'|'error'|'mov_inicio'|'mov_fin'|'ignorado', ... })
//   c.inyectarErrorModoI(texto)        avería de formación: error de hardware (corte de potencia, frenos J2/J3)
//   c.ponerConectado(bool)             simula cable RS-232 desconectado (las líneas se pierden)
//   c.reiniciar()                      apagar y encender la controladora
//
// SUPUESTOS (skill rvm1-comandos, sin verificar con el robot; configurables en config.supuestos):
//   S1  ER (y WH) se atienden en orden, así que no responden hasta acabar el movimiento anterior.
//   S2  DJ/MJ se aceptan antes de NT.
//   S3  Sintaxis y rangos de argumentos: los de este fichero (ver parsear()).
//   S4  No hay orden para abortar un movimiento: la parada real es la seta física.
//   S5  En error, solo se procesan RS, ER y WH; el resto de líneas se ignoran.
//   S6  Un punto inalcanzable (MP, MO, DS, DJ fuera de límites) da error de modo II y el robot no se mueve.
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const CFG0 = nodo ? require('./config_rvm1') : window.RVM1.config;
  const CIN = nodo ? require('./cinematica') : window.RVM1.cinematica;

  const NUM = /^[+-]?(\d+\.?\d*|\.\d+)$/;
  const ENT = /^[+-]?\d+$/;
  const perfil = (u) => (1 - Math.cos(Math.PI * Math.min(1, Math.max(0, u)))) / 2;   // arranque y frenado suaves
  const FACTOR_PICO = Math.PI / 2;                                                      // pico de velocidad del perfil coseno / media

  // ---------------------------------------------------------------- análisis de una línea
  // Devuelve { ok, op, args } o { ok:false, motivo }.
  function parsear(linea) {
    const t = String(linea == null ? '' : linea).trim().toUpperCase();
    const m = /^([A-Z]{2})\s*(.*)$/.exec(t);
    if (!m) return { ok: false, motivo: 'sintaxis' };
    const op = m[1], resto = m[2].trim();
    const partes = resto === '' ? [] : resto.split(',').map((s) => s.trim());
    const nums = (n, enteros) => {
      if (partes.length !== n) return null;
      const out = [];
      for (let i = 0; i < n; i++) {
        if (!(enteros && enteros[i] ? ENT : NUM).test(partes[i])) return null;
        out.push(parseFloat(partes[i]));
      }
      return out;
    };
    let a = null;
    switch (op) {
      case 'NT': case 'GO': case 'GC': case 'WH': case 'ER': case 'RS':
        return partes.length === 0 ? { ok: true, op, args: [] } : { ok: false, motivo: 'argumentos' };
      case 'DJ': a = nums(2, [true, false]); break;
      case 'MJ': a = nums(5); break;
      case 'DS': a = nums(3); break;
      case 'MP': a = nums(5); break;
      case 'PD': {                      // PD n,x,y,z,p,r[,O|C]: el 7.º valor (opcional) es el estado de la pinza guardado con el punto
        const ex = partes.length === 7 && ['O', 'C'].includes(partes[6]) ? partes.pop() : null;
        a = nums(6, [true]); if (a && ex) a.push(ex);
        break;
      }
      case 'HE': a = nums(1, [true]); break;
      case 'TL': a = nums(1); break;
      case 'MO': case 'SP': {
        // MO n[,O|C]   SP n[,H|L]
        const extra = op === 'MO' ? ['O', 'C'] : ['H', 'L'];
        if (partes.length === 2 && extra.includes(partes[1])) {
          return ENT.test(partes[0]) ? { ok: true, op, args: [parseInt(partes[0], 10), partes[1]] } : { ok: false, motivo: 'argumentos' };
        }
        a = nums(1, [true]); break;
      }
      default: return { ok: false, motivo: 'comando_desconocido' };
    }
    return a ? { ok: true, op, args: a } : { ok: false, motivo: 'argumentos' };
  }

  function crearControladora(opc) {
    opc = opc || {};
    const CFG = opc.config || CFG0;
    const EJES = CFG.ejes, SUP = CFG.supuestos;
    const oyentes = [];
    const emitir = (ev) => { for (const f of oyentes) { try { f(ev); } catch (e) { /* un oyente roto no para la máquina */ } } };

    let s;              // estado interno
    function encender() {
      s = {
        q: CFG.arranque.slice(),
        tl: CFG.geometria.herramienta_defecto,
        sp: CFG.sp_defecto,
        err: 0, motivoError: null, lineaError: null,
        referenciado: false,
        pinzaOrden: 'desconocida',     // última orden: abierta | cerrada | desconocida
        apertura: 1,                   // 0 cerrada … 1 abierta (lo que se ve)
        posiciones: {},                // n → { pose, q }
        entrada: [],                   // líneas pendientes (búfer del puerto)
        accion: null,                  // acción en curso
        conectado: true,
        tiempo_ms: 0,
        frenos: false
      };
    }
    encender();

    const pose = () => CIN.fk(s.q, s.tl);
    const fraccion = () => CFG.fraccion_sp[s.sp];
    const fmt = (v) => (v >= 0 ? '+' : '') + v.toFixed(1);

    function error(er, motivo, linea) {
      s.err = er; s.motivoError = motivo; s.lineaError = linea || null;
      if (er === 1) { s.referenciado = false; s.frenos = true; s.accion = null; s.entrada = []; }
      emitir({ tipo: 'error', er, motivo, linea: linea || null });
    }

    // ---------------------------------------------------------------- planificación
    function duracionArticular(q0, q1, f) {
      let t = 0;
      for (let i = 0; i < 5; i++) t = Math.max(t, Math.abs(q1[i] - q0[i]) / (EJES[i].vmax * f));
      return Math.max(CFG.rampa_ms, t * 1000 * FACTOR_PICO);
    }
    function iniciarArticular(qDestino, linea, extra) {
      const q0 = s.q.slice();
      const dur = extra && extra.dur ? Math.max(extra.dur, duracionArticular(q0, qDestino, fraccion())) : duracionArticular(q0, qDestino, fraccion());
      s.accion = { tipo: 'articular', q0, q1: qDestino.slice(), dur, t: 0, linea, alFinal: extra && extra.alFinal };
      emitir({ tipo: 'mov_inicio', linea, interpolacion: 'articular', dur_ms: dur });
    }
    function iniciarLineal(destino, linea) {
      const p0 = pose();
      const d = Math.hypot(destino.x - p0.x, destino.y - p0.y, destino.z - p0.z);
      const n = Math.max(1, Math.ceil(d / CFG.paso_lineal_mm));
      const camino = [s.q.slice()];
      let qRef = s.q;
      for (let k = 1; k <= n; k++) {
        const u = k / n;
        const pk = { x: p0.x + (destino.x - p0.x) * u, y: p0.y + (destino.y - p0.y) * u, z: p0.z + (destino.z - p0.z) * u, p: p0.p, r: p0.r };
        // El cabeceo (P) no se mantiene a rajatabla: si con P fijo algún eje se sale de su recorrido (p. ej. el origen deja J4 en su tope),
        // se prueba con P ligeramente distinto (hasta ±20°), como hace la controladora real al mover en cartesiano.
        let sol = CIN.ik(pk, s.tl, qRef);
        for (let dp = 1; !sol.ok && sol.motivo === 'limite_articular' && dp <= 20; dp++) {
          for (const sg of [1, -1]) {
            const alt = CIN.ik({ ...pk, p: pk.p + sg * dp }, s.tl, qRef);
            if (alt.ok) { sol = alt; break; }
          }
        }
        if (!sol.ok) return { ok: false, motivo: 'recta_' + sol.motivo };
        // salto brusco de configuración a mitad de recta: no es una recta realizable
        if (sol.q.some((v, i) => Math.abs(v - qRef[i]) > 20)) return { ok: false, motivo: 'recta_discontinua' };
        camino.push(sol.q); qRef = sol.q;
      }
      // tiempo: el mayor entre la velocidad lineal y la de cada eje a lo largo del camino
      const f = fraccion();
      let tEjes = 0;
      for (let k = 1; k < camino.length; k++) {
        let tk = 0;
        for (let i = 0; i < 5; i++) tk = Math.max(tk, Math.abs(camino[k][i] - camino[k - 1][i]) / (EJES[i].vmax * f));
        tEjes += tk;
      }
      const tLin = d / (CFG.vmax_muneca_mm_s * f);
      const dur = Math.max(CFG.rampa_ms, Math.max(tLin, tEjes) * 1000 * FACTOR_PICO);
      s.accion = { tipo: 'lineal', p0, p1: destino, camino, dur, t: 0, linea };
      emitir({ tipo: 'mov_inicio', linea, interpolacion: 'lineal', dur_ms: dur });
      return { ok: true };
    }

    // ---------------------------------------------------------------- ejecución de una línea
    function ejecutar(item) {
      const { linea, cb } = item;
      emitir({ tipo: 'rx', linea });
      const r = parsear(linea);
      const op = r.ok ? r.op : null;

      // S5: en error solo RS, ER, WH
      if (s.err !== 0 && SUP.ignorar_en_error && !['RS', 'ER', 'WH'].includes(op)) { emitir({ tipo: 'ignorado', linea, motivo: 'en_error' }); return; }
      if (!r.ok) { error(2, r.motivo, linea); return; }
      const a = r.args;
      const exigirRef = () => { if (!s.referenciado) { error(2, 'no_referenciado', linea); return false; } return true; };

      switch (op) {
        case 'WH': { const p = pose(); responder(cb, [p.x, p.y, p.z, p.p, p.r].map(fmt).join(','), linea); return; }
        case 'ER': responder(cb, String(s.err), linea); return;
        case 'RS': s.err = 0; s.motivoError = null; s.lineaError = null; s.frenos = false; return;
        case 'NT':
          iniciarArticular(CFG.origen, linea, { dur: CFG.duracion_nt_ms, alFinal: () => { s.referenciado = true; } });
          return;
        case 'SP':
          if (a[0] < 0 || a[0] > 9) { error(2, 'rango_sp', linea); return; }
          s.sp = a[0]; return;
        case 'TL':
          if (a[0] < CFG.tl_min || a[0] > CFG.tl_max) { error(2, 'rango_tl', linea); return; }
          s.tl = a[0]; return;
        case 'GO': case 'GC': {
          const hasta = op === 'GO' ? 1 : 0;
          s.pinzaOrden = op === 'GO' ? 'abierta' : 'cerrada';
          s.accion = { tipo: 'pinza', desde: s.apertura, hasta, dur: CFG.pinza_ms, t: 0, linea };
          return;
        }
        case 'DJ': {
          if (!SUP.jog_articular_sin_nt && !exigirRef()) return;
          const j = a[0];
          if (j < 1 || j > 5) { error(2, 'eje', linea); return; }
          const q = s.q.slice(); q[j - 1] += a[1];
          if (!CIN.dentroDeLimites(q)) { error(2, 'limite_articular', linea); return; }
          iniciarArticular(q, linea); return;
        }
        case 'MJ': {
          if (!SUP.jog_articular_sin_nt && !exigirRef()) return;
          const q = s.q.map((v, i) => v + a[i]);
          if (!CIN.dentroDeLimites(q)) { error(2, 'limite_articular', linea); return; }
          iniciarArticular(q, linea); return;
        }
        case 'DS': {
          if (!exigirRef()) return;
          const p = pose();
          const res = iniciarLineal({ x: p.x + a[0], y: p.y + a[1], z: p.z + a[2], p: p.p, r: p.r }, linea);
          if (!res.ok) error(2, res.motivo, linea);
          return;
        }
        case 'MP': {
          if (!exigirRef()) return;
          const sol = CIN.ik({ x: a[0], y: a[1], z: a[2], p: a[3], r: a[4] }, s.tl, s.q);
          if (!sol.ok) { error(2, sol.motivo, linea); return; }
          iniciarArticular(sol.q, linea); return;
        }
        case 'HE': {
          if (SUP.he_requiere_nt && !exigirRef()) return;
          if (a[0] < 1 || a[0] > CFG.posiciones_max) { error(2, 'posicion_fuera_de_rango', linea); return; }
          s.posiciones[a[0]] = { pose: pose(), q: s.q.slice(), pinza: s.pinzaOrden };      // el punto recuerda si la pinza estaba abierta o cerrada
          return;
        }
        case 'PD': {
          if (a[0] < 1 || a[0] > CFG.posiciones_max) { error(2, 'posicion_fuera_de_rango', linea); return; }
          s.posiciones[a[0]] = { pose: { x: a[1], y: a[2], z: a[3], p: a[4], r: a[5] }, q: null, pinza: a[6] === 'O' ? 'abierta' : a[6] === 'C' ? 'cerrada' : 'desconocida' };
          return;
        }
        case 'MO': {
          if (SUP.he_requiere_nt && !exigirRef()) return;
          const pt = s.posiciones[a[0]];
          if (!pt) { error(2, 'posicion_no_definida', linea); return; }
          const sol = CIN.ik(pt.pose, s.tl, s.q);
          if (!sol.ok) { error(2, sol.motivo, linea); return; }
          const pinza = a[1];
          iniciarArticular(sol.q, linea, pinza ? {
            alFinal: () => { s.pinzaOrden = pinza === 'O' ? 'abierta' : 'cerrada'; s.apertura = pinza === 'O' ? 1 : 0; }
          } : null);
          return;
        }
      }
    }

    function responder(cb, texto, linea) {
      emitir({ tipo: 'tx', texto, linea });
      if (cb) cb(texto);
    }

    // ---------------------------------------------------------------- bucle de tiempo
    // Veto de contacto (opcional): veto(q, tl) → true si esa postura atraviesa algo sólido (mesa, base…). Si el movimiento
    // llegaría a ella, el robot se queda en la última postura libre, se cancela el movimiento en curso (sin error de la
    // controladora) y se emite mov_fin con bloqueado:true. Las líneas ya en cola siguen su curso.
    let veto = null;
    function ultimaLibre(q0, q1) {                        // bisección entre una postura libre (q0) y otra vetada (q1)
      let lo = 0, hi = 1;
      for (let k = 0; k < 8; k++) {
        const m = (lo + hi) / 2, qm = q0.map((v, i) => v + (q1[i] - v) * m);
        if (veto(qm, s.tl)) hi = m; else lo = m;
      }
      return q0.map((v, i) => v + (q1[i] - v) * lo);
    }
    function avanzarAccion(dt) {
      const ac = s.accion;
      const resto = ac.t + dt - ac.dur;
      ac.t = Math.min(ac.dur, ac.t + dt);
      const u = perfil(ac.t / ac.dur);
      const q0 = s.q.slice();
      if (ac.tipo === 'articular') {
        for (let i = 0; i < 5; i++) s.q[i] = ac.q0[i] + (ac.q1[i] - ac.q0[i]) * u;
      } else if (ac.tipo === 'lineal') {
        const n = ac.camino.length - 1, x = u * n, k = Math.min(n - 1, Math.floor(x)), w = x - k;
        for (let i = 0; i < 5; i++) s.q[i] = ac.camino[k][i] + (ac.camino[k + 1][i] - ac.camino[k][i]) * w;
      } else if (ac.tipo === 'pinza') {
        s.apertura = ac.desde + (ac.hasta - ac.desde) * u;
      }
      if (veto && ac.tipo !== 'pinza' && veto(s.q, s.tl)) {
        s.q = ultimaLibre(q0, s.q);
        s.accion = null;
        emitir({ tipo: 'mov_fin', linea: ac.linea, bloqueado: true });
        return 0;
      }
      if (ac.t >= ac.dur) {
        if (ac.tipo === 'articular') s.q = ac.q1.slice();
        if (ac.tipo === 'lineal') s.q = ac.camino[ac.camino.length - 1].slice();
        s.accion = null;
        if (ac.alFinal) ac.alFinal();
        if (ac.tipo !== 'pinza') emitir({ tipo: 'mov_fin', linea: ac.linea });
        return Math.max(0, resto);
      }
      return 0;
    }

    function avanzar(dt_ms) {
      let dt = Math.max(0, +dt_ms || 0);
      s.tiempo_ms += dt;
      let guarda = 0;
      // procesa líneas inmediatas y movimientos mientras quede tiempo
      while (guarda++ < 10000) {
        if (s.accion) {
          dt = avanzarAccion(dt);
          if (s.accion) return;          // aún moviéndose: se gastó el tiempo
          continue;
        }
        if (!s.entrada.length) return;
        ejecutar(s.entrada.shift());
      }
    }

    function enviar(linea, cb) {
      if (!s.conectado) return false;    // la línea se pierde en el cable
      const op = String(linea || '').trim().toUpperCase().slice(0, 2);
      // si S1 es falso, las consultas se responden en el acto (sin esperar al movimiento)
      if (!SUP.er_espera_fin_movimiento && (op === 'ER' || op === 'WH')) { ejecutar({ linea, cb }); return true; }
      s.entrada.push({ linea, cb });
      // sin movimiento en curso, lo inmediato se ejecuta ya (sin esperar a avanzar)
      if (!s.accion) avanzar(0);
      return true;
    }

    function estado() {
      const p = pose();
      return {
        q: s.q.slice(), pose: p, tl: s.tl, sp: s.sp,
        err: s.err, motivoError: s.motivoError, lineaError: s.lineaError,
        referenciado: s.referenciado, frenos: s.frenos,
        pinza: s.pinzaOrden, apertura: s.apertura,
        ocupado: !!s.accion, cola: s.entrada.length,
        moviendo: !!(s.accion && s.accion.tipo !== 'pinza'),
        posiciones: Object.keys(s.posiciones).map(Number).sort((u, v) => u - v).map((n) => ({ n, pose: Object.assign({}, s.posiciones[n].pose), pinza: s.posiciones[n].pinza || 'desconocida' })),
        conectado: s.conectado, tiempo_ms: s.tiempo_ms
      };
    }

    return {
      enviar, avanzar, estado,
      ponerVeto(fn) { veto = typeof fn === 'function' ? fn : null; },
      alEvento(fn) { oyentes.push(fn); return () => { const i = oyentes.indexOf(fn); if (i >= 0) oyentes.splice(i, 1); }; },
      inyectarErrorModoI(texto) { error(1, texto || 'averia_inyectada', null); },
      ponerConectado(v) { s.conectado = !!v; },
      reiniciar() { encender(); emitir({ tipo: 'reinicio' }); },
      config: CFG
    };
  }

  const X = { crearControladora, parsear };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.controladora = X; }
})();
