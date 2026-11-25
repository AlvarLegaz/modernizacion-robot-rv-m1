// Observador del robot real para los modos SOMBRA y SINCRONIZADO del gemelo.
// SOLO LEE rvm1/real/<idReal>/posicion/mundo, /actuadores y /online; nunca publica en rvm1/real.
//   const o = crearObservadorReal({ idReal: '01', reloj, registro, estadoGemelo: () => ctrl.estado(), modo: () => 'sombra' });
//   o.temas              topics a suscribir
//   o.recibir(t, texto)  mensajes del broker
//   o.estado()           { pose, valida, q, fueraDeLimites, ikOk, actuadores, online, t_rx, edad_ms, error }
//   o.errorFrente(e)     error gemelo–real: { dpos_mm, dp_deg, dr_deg } (null si no hay pose real)
// Cada posicion/mundo recibida se registra (evento 'pos') con la pose real y la del gemelo en ese instante (experimento E2).
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const CIN = nodo ? require('../modelo/cinematica') : window.RVM1.cinematica;
  const fin = (v) => typeof v === 'number' && isFinite(v);
  const dAng = (a, b) => { let d = (a - b) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };

  function crearObservadorReal(opc) {
    const id = String(opc.idReal || '01');
    const reloj = opc.reloj || (() => Date.now());
    const reg = opc.registro || null;
    const base = 'rvm1/real/' + id + '/';
    const temas = { posicion: base + 'posicion/mundo', actuadores: base + 'actuadores', online: base + 'online' };
    const st = { pose: null, valida: false, q: null, ikOk: false, fueraDeLimites: false, actuadores: null, online: null, t_rx: null, ts_placa: null };

    function errorFrente(eg) {
      if (!st.pose || !eg) return null;
      const g = eg.pose, r = st.pose;
      return {
        dpos_mm: Math.hypot(g.x - r.x, g.y - r.y, g.z - r.z),
        dx: g.x - r.x, dy: g.y - r.y, dz: g.z - r.z,
        dp_deg: dAng(g.p, r.p), dr_deg: dAng(g.r, r.r)
      };
    }

    function recibir(topic, texto) {
      if (topic === temas.online) { st.online = String(texto); if (reg) reg.ev('estado', { nodo: 'gemelo', destino: 'real', real_online: st.online }); return; }
      let d; try { d = JSON.parse(String(texto)); } catch (e) { return; }
      if (!d || typeof d !== 'object') return;
      if (topic === temas.actuadores) {
        st.actuadores = d;
        if (reg) reg.ev('estado', { nodo: 'gemelo', destino: 'real', actuadores_real: d });
        return;
      }
      if (topic !== temas.posicion) return;
      if (!['x', 'y', 'z', 'pitch', 'roll'].every((k) => fin(d[k]))) return;
      st.pose = { x: d.x, y: d.y, z: d.z, p: d.pitch, r: d.roll };
      st.valida = !!d.valida; st.t_rx = reloj(); st.ts_placa = fin(d.ts) ? d.ts : null;
      const eg = opc.estadoGemelo ? opc.estadoGemelo() : null;
      const tl = eg ? eg.tl : undefined;
      const sol = CIN.ik(st.pose, tl, st.q || (eg ? eg.q : undefined), { sinLimites: true });
      st.ikOk = sol.ok; st.fueraDeLimites = !!sol.fueraDeLimites;
      if (sol.ok) st.q = sol.q;
      if (reg) {
        const err = errorFrente(eg);
        reg.ev('pos', {
          nodo: 'gemelo', destino: 'real', modo: opc.modo ? opc.modo() : null, fuente: temas.posicion,
          real: { ts_placa: st.ts_placa, x: d.x, y: d.y, z: d.z, pitch: d.pitch, roll: d.roll, valida: st.valida, q_ik: st.q, ik_ok: st.ikOk, fuera_de_limites_gemelo: st.fueraDeLimites },
          gemelo: eg ? { x: eg.pose.x, y: eg.pose.y, z: eg.pose.z, pitch: eg.pose.p, roll: eg.pose.r, q: eg.q, referenciado: eg.referenciado, ocupado: eg.ocupado } : null,
          error: err
        });
      }
    }

    return {
      temas, idReal: id, recibir, errorFrente,
      lista: [temas.posicion, temas.actuadores, temas.online],
      estado: () => Object.assign({}, st, { edad_ms: st.t_rx === null ? null : reloj() - st.t_rx })
    };
  }

  const X = { crearObservadorReal };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.observadorReal = X; }
})();
