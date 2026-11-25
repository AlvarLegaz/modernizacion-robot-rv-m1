// Mundo de la escena de prácticas (modelo headless): cubo que se coge y se suelta, y detección de colisiones (solo advertencia).
// Sin DOM ni three.js: lo usan la app web y las pruebas de Node. No mueve el robot ni genera errores de la controladora.
//   const m = crearMundo({ config, escena, cinematica });
//   m.paso(dt_ms, estadoControladora)  → { cambio, nuevas: [{ piezas:[a,b] }], activas: ['a|b', ...] }
//   m.estado()      → { cubo: { x, y, z, agarrado, cayendo }, colisiones: ['antebrazo|mesa', ...] }
//   m.recolocar()   cubo a su sitio inicial, suelto
//   m.aperturaVisible(aperturaReal) → apertura que se dibuja (los dedos se apoyan en el cubo si está agarrado)
//   m.cadena(q, tl) → { S, E, W, T, F } puntos del brazo en mm (hombro, codo, muñeca, punta, inicio de los dedos)
// Coordenadas del robot en mm (ver config_escena.js). Colisiones: cápsulas por eslabón contra cajas y plano de la mesa.
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const RAD = Math.PI / 180;

  function crearMundo(opc) {
    const CFG = opc.config, E = opc.escena, G = CFG.geometria;
    const K = E.colision, AG = E.agarre, L = E.cubo.lado, M = E.mesita;
    const SUELO_Z = -(opc.sueloZ != null ? opc.sueloZ : 720);
    const cubo = { x: E.cubo.inicio.x, y: E.cubo.inicio.y, z: L / 2, agarrado: false, cayendo: false, vz: 0 };
    let activas = new Set();

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

    // ---------------------------------------------------------------- tests geométricos
    const muestras = (a, b) => {
      const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(1, Math.ceil(d / 4)), out = [];
      for (let i = 0; i <= n; i++) { const t = i / n; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
      return out;
    };
    const dentro = (p, c, r) => p[0] > c.x0 - r && p[0] < c.x1 + r && p[1] > c.y0 - r && p[1] < c.y1 + r && p[2] > c.z0 - r && p[2] < c.z1 + r;
    const cajaMesita = () => ({ x0: M.x - M.largo / 2, x1: M.x + M.largo / 2, y0: M.y - M.ancho / 2, y1: M.y + M.ancho / 2, z0: 0, z1: M.alto });
    const cajaCubo = () => ({ x0: cubo.x - L / 2, x1: cubo.x + L / 2, y0: cubo.y - L / 2, y1: cubo.y + L / 2, z0: cubo.z - L / 2, z1: cubo.z + L / 2 });
    const cajaBase = () => ({ x0: K.base.x_min, x1: K.base.x_max, y0: K.base.y_min, y1: K.base.y_max, z0: 0, z1: K.base.z_max });
    const solapan = (a, b, h) => a.x0 < b.x1 - h && a.x1 > b.x0 + h && a.y0 < b.y1 - h && a.y1 > b.y0 + h && a.z0 < b.z1 - h && a.z1 > b.z0 + h;
    const enMesa = (p) => p[0] > E.mesa.x_min && p[0] < E.mesa.x_max && p[1] > E.mesa.y_min && p[1] < E.mesa.y_max;

    // cápsulas del brazo: [nombre, A, B, radio]
    function capsulas(est) {
      const c = cadena(est.q, est.tl);
      return [
        ['brazo', c.S, c.E, K.radio_brazo],
        ['antebrazo', c.E, c.W, K.radio_antebrazo],
        ['mano', c.W, c.F, K.radio_mano],
        ['dedos', c.F, c.T, K.radio_dedos]
      ];
    }

    function colisiones(est) {
      const out = new Set();
      const h = K.holgura, mesita = cajaMesita(), base = cajaBase();
      const cubSuelto = !cubo.agarrado ? cajaCubo() : null;
      for (const [nombre, A, B, r] of capsulas(est)) {
        for (const p of muestras(A, B)) {
          if (p[2] - r < -h && enMesa(p)) out.add(nombre + '|mesa');
          if (dentro([p[0], p[1], p[2]], { x0: mesita.x0 + h, x1: mesita.x1 - h, y0: mesita.y0 + h, y1: mesita.y1 - h, z0: mesita.z0, z1: mesita.z1 - h }, r)) out.add(nombre + '|mesita');
          if (nombre !== 'brazo' && dentro(p, { x0: base.x0 + h, x1: base.x1 - h, y0: base.y0 + h, y1: base.y1 - h, z0: base.z0, z1: base.z1 - h }, r)) out.add(nombre + '|base');
          // el cubo suelto: no choca con los dedos (van a cogerlo)
          if (cubSuelto && nombre !== 'dedos' && dentro(p, { x0: cubSuelto.x0 + h, x1: cubSuelto.x1 - h, y0: cubSuelto.y0 + h, y1: cubSuelto.y1 - h, z0: cubSuelto.z0 + h, z1: cubSuelto.z1 - h }, r)) out.add(nombre + '|cubo');
        }
      }
      if (cubo.agarrado) {                                           // el cubo agarrado también choca (con lo que no sea su apoyo al dejarlo)
        const cb = cajaCubo();
        if (cb.z0 < -h && enMesa([cubo.x, cubo.y, 0])) out.add('cubo|mesa');
        if (solapan(cb, mesita, h)) out.add('cubo|mesita');
        if (solapan(cb, base, h)) out.add('cubo|base');
      }
      return out;
    }

    // ---------------------------------------------------------------- agarre y caída
    function apoyoZ() {                                              // altura del centro del cubo cuando descansa bajo su posición
      const dx = Math.abs(cubo.x - M.x), dy = Math.abs(cubo.y - M.y);
      if (dx <= M.largo / 2 && dy <= M.ancho / 2 && cubo.z - L / 2 >= M.alto - 6) return M.alto + L / 2;
      if (enMesa([cubo.x, cubo.y, 0])) return L / 2;
      return SUELO_Z + L / 2;
    }

    function paso(dt, est) {
      let cambio = false;
      const tcp = est && est.pose ? est.pose : null;
      if (tcp) {
        const cerrada = est.apertura <= AG.cierre_max;
        if (!cubo.agarrado && cerrada && est.pinza === 'cerrada' && !cubo.cayendo) {
          if (Math.hypot(tcp.x - cubo.x, tcp.y - cubo.y) <= AG.tolerancia_xy && Math.abs(tcp.z + AG.desfase_z - cubo.z) <= AG.tolerancia_z) {
            cubo.agarrado = true; cambio = true;
          }
        } else if (cubo.agarrado && est.apertura > AG.cierre_max) {
          cubo.agarrado = false; cubo.cayendo = true; cubo.vz = 0; cambio = true;
        }
        if (cubo.agarrado) {
          const x = tcp.x, y = tcp.y, z = tcp.z + AG.desfase_z;
          if (x !== cubo.x || y !== cubo.y || z !== cubo.z) { cubo.x = x; cubo.y = y; cubo.z = z; cambio = true; }
        }
      }
      if (cubo.cayendo) {
        const s = dt / 1000, apoyo = apoyoZ();
        cubo.vz += E.caida_mm_s2 * s;
        cubo.z -= cubo.vz * s;
        if (cubo.z <= apoyo) { cubo.z = apoyo; cubo.vz = 0; cubo.cayendo = false; }
        cambio = true;
      }
      const ahora = est ? colisiones(est) : new Set();
      const nuevas = [];
      for (const k of ahora) if (!activas.has(k)) nuevas.push({ piezas: k.split('|') });
      if (nuevas.length || ahora.size !== activas.size) cambio = true;
      activas = ahora;
      return { cambio, nuevas, activas: [...ahora] };
    }

    return {
      paso, cadena, capsulas,
      estado: () => ({ cubo: { x: cubo.x, y: cubo.y, z: cubo.z, agarrado: cubo.agarrado, cayendo: cubo.cayendo }, colisiones: [...activas] }),
      recolocar() { cubo.x = E.cubo.inicio.x; cubo.y = E.cubo.inicio.y; cubo.z = L / 2; cubo.agarrado = false; cubo.cayendo = false; cubo.vz = 0; },
      aperturaVisible: (a) => (cubo.agarrado ? Math.max(a, AG.apertura_cubo) : a)
    };
  }

  const X = { crearMundo };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.mundo = X; }
})();
