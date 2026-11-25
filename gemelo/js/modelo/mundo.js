// Mundo de la escena de prácticas (modelo headless): cubo, mesita, contactos y colisiones. Sin DOM ni three.js:
// lo usan la app web y las pruebas de Node.
//
//   const m = crearMundo({ config, escena });
//   ctrl.ponerVeto((q, tl) => m.bloquea(q, tl));           // la mesa y la base son sólidas: el robot no las atraviesa
//   m.paso(dt_ms, estadoControladora)  → { cambio, nuevas: [{ piezas:[a,b] }], activas: ['a|b', ...] }
//   m.estado()      → { cubo:{ x, y, z, yaw, agarrado, cayendo }, mesita:{ x, y }, colisiones:[…] }
//   m.recolocar()   cubo y mesita a su sitio inicial
//   m.aperturaVisible(aperturaReal)
//   m.cadena(q, tl) → { S, E, W, T, F } puntos del brazo en mm
//
// Comportamiento al tocar (coordenadas del robot, mm):
//   · mesa y base: sólidas. El robot se queda donde toca (no las atraviesa), se avisa en rojo y no hay error de la controladora.
//   · cubo suelto: el brazo lo empuja y, si va con algo de velocidad, sale despedido y desliza; si pierde el apoyo, cae.
//   · mesita: el brazo (o el cubo que lleva) la desplaza mientras empuja; el cubo que tiene encima se mueve con ella.
//   · los dedos pasan junto al cubo sin tocarlo cuando van centrados para cogerlo.
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const RAD = Math.PI / 180;

  function crearMundo(opc) {
    const CFG = opc.config, E = opc.escena, G = CFG.geometria;
    const K = E.colision, AG = E.agarre, L = E.cubo.lado, M = E.mesita;
    const SUELO_Z = -(opc.sueloZ != null ? opc.sueloZ : 720);
    const cubo = { x: E.cubo.inicio.x, y: E.cubo.inicio.y, z: L / 2, yaw: 0, vx: 0, vy: 0, agarrado: false, cayendo: false, vz: 0 };
    const mes = { x: M.x, y: M.y };
    let activas = new Set(), bloqueadas = new Set();
    const h = K.holgura;

    // ---------------------------------------------------------------- geometría del brazo
    function cadena(q, tl) {
      const u = [Math.cos(q[0] * RAD), Math.sin(q[0] * RAD)];
      const punto = (base, ang, largo) => { const c = Math.cos(ang * RAD) * largo, s = Math.sin(ang * RAD) * largo; return [base[0] + u[0] * c, base[1] + u[1] * c, base[2] + s]; };
      const S = [0, 0, G.altura_hombro];
      const Eb = punto(S, q[1], G.brazo);
      const W = punto(Eb, q[1] + q[2], G.antebrazo);
      const p = q[1] + q[2] + q[3];
      const lm = G.cabeceo_a_brida + (typeof tl === 'number' ? tl : G.herramienta_defecto);
      const T = punto(W, p, lm);
      const F = punto(W, p, Math.max(0, lm - K.largo_dedos));
      return { S, E: Eb, W, T, F };
    }
    function capsulas(est) {
      const c = cadena(est.q, est.tl);
      return [['brazo', c.S, c.E, K.radio_brazo], ['antebrazo', c.E, c.W, K.radio_antebrazo], ['mano', c.W, c.F, K.radio_mano], ['dedos', c.F, c.T, K.radio_dedos]];
    }

    // ---------------------------------------------------------------- tests geométricos
    const muestras = (a, b) => {
      const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(1, Math.ceil(d / 4)), out = [];
      for (let i = 0; i <= n; i++) { const t = i / n; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
      return out;
    };
    // caja reducida en h (el contacto de superficie no cuenta) y hueco r de la cápsula
    const dentro = (p, c, r) => p[0] > c.x0 + h - r && p[0] < c.x1 - h + r && p[1] > c.y0 + h - r && p[1] < c.y1 - h + r && p[2] > c.z0 + h - r && p[2] < c.z1 - h + r;
    const cajaMesita = () => ({ x0: mes.x - M.largo / 2, x1: mes.x + M.largo / 2, y0: mes.y - M.ancho / 2, y1: mes.y + M.ancho / 2, z0: 0, z1: M.alto });
    const cajaCuboEn = (x, y, z) => ({ x0: x - L / 2, x1: x + L / 2, y0: y - L / 2, y1: y + L / 2, z0: z - L / 2, z1: z + L / 2 });
    const cajaCubo = () => cajaCuboEn(cubo.x, cubo.y, cubo.z);
    const cajaBase = () => ({ x0: K.base.x_min, x1: K.base.x_max, y0: K.base.y_min, y1: K.base.y_max, z0: 0, z1: K.base.z_max });
    const solapan = (a, b) => a.x0 < b.x1 - h && a.x1 > b.x0 + h && a.y0 < b.y1 - h && a.y1 > b.y0 + h && a.z0 < b.z1 - h && a.z1 > b.z0 + h;
    const enMesa = (p) => p[0] > E.mesa.x_min && p[0] < E.mesa.x_max && p[1] > E.mesa.y_min && p[1] < E.mesa.y_max;

    // los dedos van centrados sobre el cubo (zona de agarre): no lo tocan
    // (solo si bajan o suben casi en vertical: si barren de lado, los dedos sí empujan el cubo)
    let velH = 0, tcpPrev = null;
    const dedosAlineados = (T) => velH < 40 && Math.hypot(T[0] - cubo.x, T[1] - cubo.y) <= 2 * AG.tolerancia_xy;

    // ---------------------------------------------------------------- sólidos fijos: mesa y base
    // Devuelve el conjunto de pares 'pieza|mesa' / 'pieza|base' que ocupa la postura q (con el cubo agarrado, que va con la mano).
    function fijas(q, tl, conCubo) {
      const out = new Set(), base = cajaBase();
      const c = { q, tl };
      for (const [nombre, A, B, r] of capsulas(c)) {
        for (const p of muestras(A, B)) {
          if (p[2] - r < -h && enMesa(p)) out.add(nombre + '|mesa');
          if (nombre !== 'brazo' && dentro(p, base, r)) out.add(nombre + '|base');
        }
      }
      if (conCubo) {
        const T = cadena(q, tl).T, cb = cajaCuboEn(T[0], T[1], T[2] + AG.desfase_z);
        if (cb.z0 < -h && enMesa([T[0], T[1], 0])) out.add('cubo|mesa');
        if (solapan(cb, base)) out.add('cubo|base');
      }
      return out;
    }
    // Veto para la controladora: ¿esta postura atraviesa la mesa o la base? Anota el par para avisar en rojo.
    function bloquea(q, tl) {
      const f = fijas(q, tl, cubo.agarrado);
      for (const k of f) bloqueadas.add(k);
      return f.size > 0;
    }

    // ---------------------------------------------------------------- empujes
    // Desplazamiento horizontal [dx, dy] que hay que dar a la caja c para sacarla de las cápsulas (y de la caja extra, si hay).
    function empuje(caps, c) {
      const cx = (c.x0 + c.x1) / 2, cy = (c.y0 + c.y1) / 2;
      let dx = 0, dy = 0, px = 0, py = 0;
      for (const [nombre, A, B, r] of caps) {
        for (const p of muestras(A, B)) {
          if (nombre === 'dedos' && c.esCubo && dedosAlineados(B)) continue;
          if (!dentro(p, c, r)) continue;
          const ox = p[0] < cx ? (p[0] + r) - (c.x0 + h) : (c.x1 - h) - (p[0] - r);
          const oy = p[1] < cy ? (p[1] + r) - (c.y0 + h) : (c.y1 - h) - (p[1] - r);
          if (ox <= oy) { const v = (p[0] < cx ? 1 : -1) * ox; if (Math.abs(v) > Math.abs(dx)) { dx = v; px = p[0]; py = p[1]; } }
          else { const v = (p[1] < cy ? 1 : -1) * oy; if (Math.abs(v) > Math.abs(dy)) { dy = v; px = p[0]; py = p[1]; } }
        }
      }
      const tope = 40, n = Math.hypot(dx, dy);
      if (n > tope) { dx *= tope / n; dy *= tope / n; }
      return { dx, dy, px, py };
    }
    const cajaPorCubo = () => { const c = cajaCubo(); c.esCubo = true; return c; };

    // ---------------------------------------------------------------- agarre, caída, contactos
    function apoyoZ() {                                              // altura del centro del cubo cuando descansa bajo su posición
      const dx = Math.abs(cubo.x - mes.x), dy = Math.abs(cubo.y - mes.y);
      if (dx <= M.largo / 2 && dy <= M.ancho / 2 && cubo.z - L / 2 >= M.alto - 6) return M.alto + L / 2;
      if (enMesa([cubo.x, cubo.y, 0])) return L / 2;
      return SUELO_Z + L / 2;
    }
    const sobreMesita = () => !cubo.agarrado && Math.abs(cubo.x - mes.x) <= M.largo / 2 && Math.abs(cubo.y - mes.y) <= M.ancho / 2 && Math.abs(cubo.z - (M.alto + L / 2)) < 1;

    function paso(dt, est) {
      let cambio = false;
      const s = dt / 1000;
      const tcp = est && est.pose ? est.pose : null;
      velH = tcp && tcpPrev ? Math.hypot(tcp.x - tcpPrev[0], tcp.y - tcpPrev[1]) / Math.max(s, 0.001) : 0;
      tcpPrev = tcp ? [tcp.x, tcp.y] : null;
      // --- agarre y suelta
      if (tcp) {
        const cerrada = est.apertura <= AG.cierre_max;
        if (!cubo.agarrado && cerrada && est.pinza === 'cerrada' && !cubo.cayendo) {
          if (Math.hypot(tcp.x - cubo.x, tcp.y - cubo.y) <= AG.tolerancia_xy && Math.abs(tcp.z + AG.desfase_z - cubo.z) <= AG.tolerancia_z) {
            cubo.agarrado = true; cubo.vx = cubo.vy = 0; cambio = true;
          }
        } else if (cubo.agarrado && est.apertura > AG.cierre_max) {
          cubo.agarrado = false; cubo.cayendo = true; cubo.vz = 0; cambio = true;
        }
        if (cubo.agarrado) {
          const x = tcp.x, y = tcp.y, z = tcp.z + AG.desfase_z;
          if (x !== cubo.x || y !== cubo.y || z !== cubo.z) { cubo.x = x; cubo.y = y; cubo.z = z; cambio = true; }
        }
      }
      // --- avisos de contacto (antes de resolver los empujes: el contacto cuenta aunque se resuelva en el acto)
      const ahora = new Set(bloqueadas); bloqueadas = new Set();
      const mesita = cajaMesita();
      if (est) {
        const caps = capsulas(est);
        for (const [nombre, A, B, r] of caps) {
          for (const p of muestras(A, B)) {
            if (dentro(p, mesita, r)) ahora.add(nombre + '|mesita');
            if (!cubo.agarrado && !(nombre === 'dedos' && dedosAlineados(B)) && dentro(p, cajaCubo(), r)) ahora.add(nombre + '|cubo');
          }
        }
        if (cubo.agarrado && solapan(cajaCubo(), mesita)) ahora.add('cubo|mesita');
        if (cubo.agarrado && solapan(cajaCubo(), cajaBase())) ahora.add('cubo|base');

        // --- el brazo (y el cubo que lleva) empuja la mesita; el cubo que tiene encima va con ella
        const empujadores = caps.slice();
        const dm = empuje(empujadores, mesita);
        let { dx, dy } = dm;
        if (cubo.agarrado) { const e2 = empuje([['cubo', [cubo.x, cubo.y, cubo.z], [cubo.x, cubo.y, cubo.z], L / 2 + 0.01]], mesita); if (Math.abs(e2.dx) > Math.abs(dx)) dx = e2.dx; if (Math.abs(e2.dy) > Math.abs(dy)) dy = e2.dy; }
        if (dx || dy) {
          const nx = Math.max(E.mesa.x_min + M.largo / 2, Math.min(E.mesa.x_max - M.largo / 2, mes.x + dx));
          const ny = Math.max(E.mesa.y_min + M.ancho / 2, Math.min(E.mesa.y_max - M.ancho / 2, mes.y + dy));
          const llevaCubo = sobreMesita();
          const rx = nx - mes.x, ry = ny - mes.y;
          mes.x = nx; mes.y = ny;
          if (llevaCubo) { cubo.x += rx; cubo.y += ry; }
          cambio = true;
        }
        // --- el brazo empuja el cubo suelto
        if (!cubo.agarrado) {
          const dc = empuje(caps, cajaPorCubo());
          if (dc.dx || dc.dy) {
            cubo.x += dc.dx; cubo.y += dc.dy;
            const n = Math.hypot(dc.dx, dc.dy), vel = Math.min(900, n / Math.max(s, 0.001));
            cubo.vx = dc.dx / n * vel; cubo.vy = dc.dy / n * vel;          // sale despedido en la dirección del empujón
            const lat = ((dc.dx / n) * (cubo.y - dc.py) - (dc.dy / n) * (cubo.x - dc.px)) / (L / 2);
            cubo.yaw += Math.max(-1, Math.min(1, lat)) * n / L * 1.2;       // y gira según dónde le den
            cambio = true;
          }
        }
      }
      // --- el cubo suelto desliza (rozamiento) y no atraviesa la mesita
      if (!cubo.agarrado && !cubo.cayendo && (cubo.vx || cubo.vy)) {
        const v = Math.hypot(cubo.vx, cubo.vy), nv = Math.max(0, v - 2500 * s);
        cubo.x += cubo.vx * s; cubo.y += cubo.vy * s;
        if (nv < 5) { cubo.vx = cubo.vy = 0; } else { cubo.vx *= nv / v; cubo.vy *= nv / v; }
        cambio = true;
      }
      if (!cubo.agarrado && !cubo.cayendo && cubo.z - L / 2 < M.alto - 3) {      // cubo a nivel de mesa contra la mesita
        const cb = cajaCubo(), mc = cajaMesita();
        if (cb.x0 < mc.x1 && cb.x1 > mc.x0 && cb.y0 < mc.y1 && cb.y1 > mc.y0) {
          const ox = cubo.x < mes.x ? cb.x1 - mc.x0 : mc.x1 - cb.x0, oy = cubo.y < mes.y ? cb.y1 - mc.y0 : mc.y1 - cb.y0;
          if (ox <= oy) cubo.x += (cubo.x < mes.x ? -1 : 1) * ox; else cubo.y += (cubo.y < mes.y ? -1 : 1) * oy;
          cubo.vx = cubo.vy = 0; cambio = true;
        }
      }
      // --- pierde el apoyo: cae
      if (!cubo.agarrado && !cubo.cayendo && cubo.z - apoyoZ() > 0.5) { cubo.cayendo = true; cubo.vz = 0; cambio = true; }
      if (cubo.cayendo) {
        const apoyo = apoyoZ();
        cubo.vz += E.caida_mm_s2 * s;
        cubo.z -= cubo.vz * s;
        if (cubo.z <= apoyo) { cubo.z = apoyo; cubo.vz = 0; cubo.cayendo = false; }
        cambio = true;
      }
      // --- pares nuevos desde el último paso (el contacto sostenido no se repite)
      const nuevas = [];
      for (const k of ahora) if (!activas.has(k)) nuevas.push({ piezas: k.split('|') });
      if (nuevas.length || ahora.size !== activas.size) cambio = true;
      activas = ahora;
      return { cambio, nuevas, activas: [...ahora] };
    }

    return {
      paso, cadena, capsulas, bloquea,
      estado: () => ({ cubo: { x: cubo.x, y: cubo.y, z: cubo.z, yaw: cubo.yaw, agarrado: cubo.agarrado, cayendo: cubo.cayendo }, mesita: { x: mes.x, y: mes.y }, colisiones: [...activas] }),
      recolocar() {
        cubo.x = E.cubo.inicio.x; cubo.y = E.cubo.inicio.y; cubo.z = L / 2; cubo.yaw = 0; cubo.vx = cubo.vy = 0; cubo.agarrado = false; cubo.cayendo = false; cubo.vz = 0;
        mes.x = M.x; mes.y = M.y;
      },
      aperturaVisible: (a) => (cubo.agarrado ? Math.max(a, AG.apertura_cubo) : a)
    };
  }

  const X = { crearMundo };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.mundo = X; }
})();
