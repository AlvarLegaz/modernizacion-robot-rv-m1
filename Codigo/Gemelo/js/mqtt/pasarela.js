// Pasarela MQTT del gemelo: implementa el contrato Docu/contrato_mqtt.md v0.3 sobre la controladora emulada,
// hablando con ella SOLO por su interfaz de texto (como la placa real por RS-232C). Así la lógica es la misma que la de la placa.
//
//   const p = crearPasarela({ controladora, transporte, id: '07', destino: 'gemelo', reloj, registro, desfase });
//   transporte.publicar(topic, textoJSON, { qos, retain })     lo aporta quien la usa (mqtt.js, cliente simulado en los tests…)
//   p.temas                       { comandos, ack, actuadores, posicion, online }
//   p.alConectar()                tras conectar al broker: publica online (retain), actuadores y posición
//   p.recibir(topic, texto)       mensaje llegado al topic de comandos
//   p.tick()                      llamar a menudo (p. ej. cada fotograma): procesa la cola y las publicaciones periódicas
//   p.actuadores()                último estado publicado/calculado
//
// Notas de interpretación del contrato (ver README, "Decisiones sobre el contrato"):
//   - error_activo: tras ER=1 (modo I) solo se acepta reset y luego home; tras ER=2 (modo II) basta reset.
//   - parar: vacía la cola sin ACK para los comandos descartados (el contrato no define motivo); su propio ACK final es
//     'hecho' sin campo er, porque no se consulta ER (ER esperaría al fin del movimiento en curso).
//   - desfase_ms: null si no se ha medido (el gemelo usa el reloj del navegador); 'reloj' solo se aplica con un desfase numérico.
//   - sincronizarReferencia (solo gemelo): ver sincronizar().
//   - velocidad: null hasta el primer 'velocidad' recibido (último SP enviado).
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const CFG0 = nodo ? require('../modelo/config_rvm1') : window.RVM1.config;

  const CMDS = ['home', 'jog_articular', 'jog_mundo', 'mover_pose', 'velocidad', 'pinza', 'reset', 'parar'];
  const fin = (v) => typeof v === 'number' && isFinite(v);
  const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);

  // Validación de formato y rangos. Devuelve el texto RV-M1 o null si no vale.
  function traducir(cmd, args) {
    const a = args && typeof args === 'object' && !Array.isArray(args) ? args : {};
    switch (cmd) {
      case 'home': return 'NT';
      case 'reset': return 'RS';
      case 'parar': return '';
      case 'jog_articular':
        if (!Number.isInteger(a.eje) || a.eje < 1 || a.eje > 5 || !fin(a.grados) || Math.abs(a.grados) > 360) return null;
        return 'DJ ' + a.eje + ',' + f1(a.grados);
      case 'jog_mundo': {
        const d = ['dx', 'dy', 'dz'].map((k) => (a[k] === undefined ? 0 : a[k]));
        if (!d.every(fin) || d.some((v) => Math.abs(v) > 1000)) return null;
        return 'DS ' + d.map(f1).join(',');
      }
      case 'mover_pose': {
        const v = ['x', 'y', 'z', 'pitch', 'roll'].map((k) => a[k]);
        if (!v.every(fin) || v.slice(0, 3).some((x) => Math.abs(x) > 2000) || v.slice(3).some((x) => Math.abs(x) > 360)) return null;
        return 'MP ' + v.map(f1).join(',');
      }
      case 'velocidad':
        if (!Number.isInteger(a.sp) || a.sp < 0 || a.sp > 9) return null;
        return 'SP ' + a.sp;
      case 'pinza':
        if (a.accion === 'abrir') return 'GO';
        if (a.accion === 'cerrar') return 'GC';
        return null;
      default: return null;
    }
  }

  function crearPasarela(opc) {
    const CFG = opc.config || CFG0, K = CFG.contrato;
    const ctrl = opc.controladora;
    const destino = opc.destino || 'gemelo';
    const id = String(opc.id || '01');
    const reloj = opc.reloj || (() => Date.now());
    const reg = opc.registro || null;
    const desfase = opc.desfase || (() => null);
    const tr = opc.transporte || { publicar() {} };
    const base = 'rvm1/' + destino + '/' + id + '/';
    const temas = { comandos: base + 'comandos', ack: base + 'comandos/ack', actuadores: base + 'actuadores', posicion: base + 'posicion/mundo', online: base + 'online' };

    const vistos = new Map();         // id → { t, ack }
    let cola = [];                    // { id, ts, cmd, args, linea }
    let enCurso = null;               // comando enviado a la controladora sin terminar
    let consulta = null;              // consulta periódica pendiente ('WH' | 'ER')
    const est = { conectado: true, referenciado: false, error: 0, velocidad: null, pinza: 'desconocida', requiereHome: false, ultimaPos: null };
    let ultActJSON = '', tAct = -Infinity, tPos = -Infinity, tEr = -Infinity;
    let enLinea = false;

    const log = (evento, datos) => { if (reg) reg.ev(evento, datos); };

    function publicar(topic, obj, op) {
      const texto = typeof obj === 'string' ? obj : JSON.stringify(obj);
      try { tr.publicar(topic, texto, op); } catch (e) { /* sin broker: el gemelo sigue en local */ }
    }

    // ------------------------------------------------------------ ACK
    function ack(idc, estado, extra) {
      const m = Object.assign({ id: idc, ts: reloj(), estado }, extra || {});
      if (idc !== null && idc !== undefined && vistos.has(idc)) vistos.get(idc).ack = m;
      publicar(temas.ack, m, { qos: 1, retain: false });
      log('ack_tx', { id: idc, estado, motivo: m.motivo, er: m.er });
      return m;
    }
    function recordar(idc) {
      const t = reloj();
      vistos.set(idc, { t, ack: null });
      if (vistos.size > K.ids_recordados) {
        for (const [k, v] of vistos) {
          if (vistos.size <= K.ids_recordados) break;
          if (t - v.t > K.ids_ventana_ms) vistos.delete(k); else break;   // se conservan los de los últimos 10 s aunque sean más de 256
        }
      }
    }

    // v0.2: más de 500 ms de antigüedad; v0.3: también más de 100 ms por delante del reloj del receptor
    const caducado = (ts) => { const d = reloj() - ts; return d > K.caducidad_ms || -d > K.adelanto_max_ms; };

    // ------------------------------------------------------------ recepción
    function recibir(topic, texto) {
      if (topic !== temas.comandos) return;
      let m;
      try { m = JSON.parse(String(texto)); } catch (e) { m = undefined; }
      if (!m || typeof m !== 'object' || Array.isArray(m)) {
        log('cmd_rx', { id: null, crudo: String(texto).slice(0, 500) });
        return ack(null, 'rechazado', { motivo: 'formato' });
      }
      const idc = m.id;
      log('cmd_rx', { id: idc === undefined ? null : idc, cmd: m.cmd, args: m.args, ts_cliente: m.ts, destino_msg: m.destino });
      if ((typeof idc !== 'string' || !idc) && !Number.isInteger(idc)) return ack(null, 'rechazado', { motivo: 'formato' });

      // duplicado: no se ejecuta, se reenvía el último ACK dado
      if (vistos.has(idc)) {
        const v = vistos.get(idc);
        if (v.ack) { publicar(temas.ack, v.ack, { qos: 1, retain: false }); log('ack_tx', { id: idc, estado: v.ack.estado, motivo: v.ack.motivo, er: v.ack.er, duplicado: true }); }
        return v.ack;
      }
      recordar(idc);

      const linea = CMDS.includes(m.cmd) ? traducir(m.cmd, m.args) : null;
      if (linea === null || !fin(m.ts) || typeof m.destino !== 'string') return ack(idc, 'rechazado', { motivo: 'formato' });
      if (m.destino !== destino) return ack(idc, 'rechazado', { motivo: 'destino' });
      if (caducado(m.ts)) return ack(idc, 'rechazado', { motivo: 'caducado' });
      const df = desfase();
      if (fin(df) && Math.abs(df) > K.desfase_max_ms) return ack(idc, 'rechazado', { motivo: 'reloj' });
      if (!est.conectado) return ack(idc, 'rechazado', { motivo: 'desconectado' });
      if (est.error !== 0 && m.cmd !== 'reset') return ack(idc, 'rechazado', { motivo: 'error_activo' });
      if (est.requiereHome && !['home', 'reset'].includes(m.cmd)) return ack(idc, 'rechazado', { motivo: 'error_activo' });
      if ((m.cmd === 'jog_mundo' || m.cmd === 'mover_pose') && !est.referenciado) return ack(idc, 'rechazado', { motivo: 'no_referenciado' });

      ack(idc, 'aceptado');
      if (m.cmd === 'parar') {
        const descartados = cola.map((c) => c.id);
        cola = [];
        log('estado', { nota: 'parar: cola vaciada', descartados });
        ack(idc, 'hecho');
        publicarActuadores(true);
        return;
      }
      cola.push({ id: idc, ts: m.ts, cmd: m.cmd, args: m.args, linea });
      publicarActuadores(true);
      procesar();
    }

    // ------------------------------------------------------------ ejecución (una orden cada vez, como por RS-232C)
    function enviarSerie(linea, cb) {
      log('serie_tx', { linea });
      const ok = ctrl.enviar(linea, cb ? (resp) => { log('serie_rx', { linea, texto: resp }); cb(resp); } : undefined);
      if (!ok && est.conectado) { est.conectado = false; publicarActuadores(true); }
      if (ok && !est.conectado) { est.conectado = true; publicarActuadores(true); }
      return ok;
    }

    function procesar() {
      while (!enCurso && !consulta && cola.length) {
        const c = cola.shift();
        if (caducado(c.ts)) { ack(c.id, 'rechazado', { motivo: 'caducado' }); continue; }
        if (est.error !== 0 && c.cmd !== 'reset') { ack(c.id, 'rechazado', { motivo: 'error_activo' }); continue; }
        if (est.requiereHome && !['home', 'reset'].includes(c.cmd)) { ack(c.id, 'rechazado', { motivo: 'error_activo' }); continue; }
        if (c.cmd === 'velocidad') est.velocidad = c.args.sp;
        if (c.cmd === 'pinza') est.pinza = c.args.accion === 'abrir' ? 'abierta' : 'cerrada';
        enCurso = c;
        publicarActuadores(true);
        if (!enviarSerie(c.linea)) { enCurso = null; ack(c.id, 'rechazado', { motivo: 'desconectado' }); continue; }
        enviarSerie('ER', (r) => terminar(c, r));
      }
    }

    function terminar(c, resp) {
      const er = parseInt(resp, 10);
      const erPrevio = est.error;
      ponerError(isNaN(er) ? 2 : er);
      if (est.error === 0) {
        if (c.cmd === 'home') { est.referenciado = true; est.requiereHome = false; }
        if (c.cmd === 'reset' && erPrevio === 1) est.requiereHome = true;
        ack(c.id, 'hecho', { er: 0 });
      } else {
        ack(c.id, 'error', { er: est.error });
      }
      enCurso = null;
      // posición tras cada movimiento
      leerPosicion();
      publicarActuadores(true);
    }

    function ponerError(er) {
      if (er !== 0 && est.error === 0) {
        // se descartan los pendientes: con el robot en error no se ejecutan
        const pend = cola; cola = [];
        for (const c of pend) ack(c.id, 'rechazado', { motivo: 'error_activo' });
      }
      if (er === 1) { est.referenciado = false; est.requiereHome = true; }
      est.error = er;
    }

    function leerPosicion() {
      consulta = 'WH';
      const ok = enviarSerie('WH', (r) => {
        consulta = null;
        const v = String(r).split(',').map(parseFloat);
        if (v.length === 5 && v.every(fin)) {
          est.ultimaPos = { ts: reloj(), x: v[0], y: v[1], z: v[2], pitch: v[3], roll: v[4], valida: est.referenciado };
          publicar(temas.posicion, est.ultimaPos, { qos: 0, retain: true });
          log('pos', est.ultimaPos);
        }
        tPos = reloj();
        procesar();
      });
      if (!ok) consulta = null;
    }
    function leerError() {
      consulta = 'ER';
      const ok = enviarSerie('ER', (r) => {
        consulta = null;
        const er = parseInt(r, 10);
        if (!isNaN(er) && er !== est.error) { ponerError(er); publicarActuadores(true); }
        tEr = reloj();
        procesar();
      });
      if (!ok) consulta = null;
    }

    // ------------------------------------------------------------ publicaciones
    function actuadores() {
      return {
        ts: reloj(), conectado: est.conectado, referenciado: est.referenciado, error: est.error,
        velocidad: est.velocidad, pinza: est.pinza, ocupado: !!enCurso, cola: cola.length, desfase_ms: fin(desfase()) ? desfase() : null
      };
    }
    function publicarActuadores(soloSiCambia) {
      const a = actuadores();
      const sinTs = JSON.stringify(Object.assign({}, a, { ts: 0 }));
      if (soloSiCambia && sinTs === ultActJSON) return;
      ultActJSON = sinTs; tAct = reloj();
      publicar(temas.actuadores, a, { qos: 1, retain: true });
      log('estado', { actuadores: a });
    }

    // Solo gemelo (opc.sincronizarReferencia): si el pendant local hace NT directamente sobre la controladora,
    // la pasarela adopta su estado de referencia. En la placa real no aplica: pendant por RS-232 y placa no conviven.
    function sincronizar() {
      if (!opc.sincronizarReferencia || !ctrl.estado) return;
      const e = ctrl.estado();
      if (e.referenciado !== est.referenciado && !enCurso) {
        est.referenciado = e.referenciado;
        if (e.referenciado && e.err === 0) est.requiereHome = false;
        publicarActuadores(true);
      }
    }

    function tick() {
      const t = reloj();
      sincronizar();
      if (!enCurso && !consulta) {
        if (cola.length) procesar();
        else if (t - tPos >= K.periodo_posicion_ms) leerPosicion();
        else if (t - tEr >= K.periodo_actuadores_ms) leerError();
      }
      if (t - tAct >= K.periodo_actuadores_ms) publicarActuadores(false);
    }

    function alConectar() {
      enLinea = true;
      publicar(temas.online, 'online', { qos: 1, retain: true });
      ultActJSON = '';
      publicarActuadores(false);
      if (est.ultimaPos) publicar(temas.posicion, Object.assign({}, est.ultimaPos, { ts: reloj() }), { qos: 0, retain: true });
    }
    function alDesconectar() { enLinea = false; }

    return {
      temas, destino, id, recibir, tick, alConectar, alDesconectar, actuadores,
      get enLinea() { return enLinea; },
      get cola() { return cola.length; },
      get ocupado() { return !!enCurso; },
      ultimaPosicion: () => est.ultimaPos,
      // mensaje de LWT para el adaptador MQTT
      voluntad: () => ({ topic: temas.online, payload: 'offline', qos: 1, retain: true })
    };
  }

  const X = { crearPasarela, traducir, CMDS };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.pasarela = X; }
})();
