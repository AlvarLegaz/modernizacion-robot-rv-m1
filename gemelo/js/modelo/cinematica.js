// Cinemática directa e inversa del RV-M1 (5 GDL). Ángulos en grados, longitudes en mm. Sin estado.
//   fk(q, tl)            → { x, y, z, p, r }           q = [J1..J5], tl = longitud de herramienta (TL)
//   ik(pose, tl, qRef, op) → { ok, q, motivo, fueraDeLimites }   pose = { x, y, z, p, r }; qRef = postura actual (J1 indeterminado y elección)
//                          op.sinLimites: devuelve la solución aunque viole los límites (para dibujar el robot real; fueraDeLimites = true)
//   dentroDeLimites(q)   → bool
//   muneca(q)            → { x, y, z } centro del eje de cabeceo (para el render y las pruebas)
// Convenio de ejes: ver config_rvm1.js. Cadena: J1 sobre Z, J2/J3/J4 sobre el eje horizontal del plano del brazo, J5 sobre el eje de la mano.
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const CFG = nodo ? require('./config_rvm1') : window.RVM1.config;
  const G = CFG.geometria, EJES = CFG.ejes;
  const RAD = Math.PI / 180, GRA = 180 / Math.PI, EPS = 1e-6;
  const fin = (v) => typeof v === 'number' && isFinite(v);

  const alcanceMano = (tl) => G.cabeceo_a_brida + (fin(tl) ? tl : G.herramienta_defecto);
  const envolver180 = (a) => { a = ((a + 180) % 360 + 360) % 360 - 180; return a === -180 ? 180 : a; };

  function muneca(q) {
    const a2 = q[1] * RAD, a23 = (q[1] + q[2]) * RAD;
    const r = G.brazo * Math.cos(a2) + G.antebrazo * Math.cos(a23);
    const z = G.altura_hombro + G.brazo * Math.sin(a2) + G.antebrazo * Math.sin(a23);
    return { x: r * Math.cos(q[0] * RAD), y: r * Math.sin(q[0] * RAD), z, r };
  }

  function fk(q, tl) {
    const w = muneca(q), L = alcanceMano(tl);
    const p = q[1] + q[2] + q[3];
    const r = w.r + L * Math.cos(p * RAD);
    return {
      x: r * Math.cos(q[0] * RAD), y: r * Math.sin(q[0] * RAD),
      z: w.z + L * Math.sin(p * RAD),
      p, r: q[4]
    };
  }

  function dentroDeLimites(q) {
    return q.every((v, i) => fin(v) && v >= EJES[i].min - 1e-7 && v <= EJES[i].max + 1e-7);
  }

  function ik(pose, tl, qRef, op) {
    if (!pose || !['x', 'y', 'z', 'p', 'r'].every((k) => fin(pose[k]))) return { ok: false, q: null, motivo: 'valor_invalido' };
    const ref = Array.isArray(qRef) ? qRef : CFG.origen;
    const L = alcanceMano(tl);
    const rr = Math.hypot(pose.x, pose.y);
    const a = G.brazo, b = G.antebrazo;
    const candidatas = [], todas = [];
    let alcanzable = false;
    // Dos planos posibles para J1: hacia el punto (r > 0) o de espaldas con el brazo volcado sobre el hombro (r < 0).
    // Sobre el eje de la base, J1 está indeterminado: se conserva el actual.
    const q1a = rr < 1e-3 ? ref[0] : Math.atan2(pose.y, pose.x) * GRA;
    for (const [q1, rs] of [[q1a, rr], [envolver180(q1a + 180), -rr]]) {
      const rw = rs - L * Math.cos(pose.p * RAD);
      const zw = pose.z - G.altura_hombro - L * Math.sin(pose.p * RAD);
      const D = (rw * rw + zw * zw - a * a - b * b) / (2 * a * b);
      if (D > 1 + EPS || D < -1 - EPS) continue;
      alcanzable = true;
      const Dc = Math.max(-1, Math.min(1, D));
      const s = Math.sqrt(1 - Dc * Dc);
      for (const sg of [-1, 1]) {           // -1: codo arriba (J3 < 0), la habitual del RV-M1
        const q3 = Math.atan2(sg * s, Dc) * GRA;
        const q2 = envolver180((Math.atan2(zw, rw) - Math.atan2(b * sg * s, a + b * Dc)) * GRA);
        const q4 = envolver180(pose.p - q2 - q3);
        const q = [envolver180(q1), q2, q3, q4, envolver180(pose.r)];
        todas.push(q);
        if (dentroDeLimites(q)) candidatas.push(q);
      }
    }
    if (!alcanzable) return { ok: false, q: null, motivo: 'fuera_de_alcance' };
    // la más cercana a la postura de referencia
    const dist = (q) => q.reduce((s2, v, i) => s2 + Math.abs(v - ref[i]), 0);
    if (!candidatas.length) {
      if (op && op.sinLimites && todas.length) {
        // la que menos viola los límites (prefiere codo arriba)
        const exceso = (q) => q.reduce((e, v, i) => e + Math.max(0, EJES[i].min - v, v - EJES[i].max), 0);
        todas.sort((u, v) => exceso(u) - exceso(v) || dist(u) - dist(v));
        return { ok: true, q: todas[0], motivo: 'limite_articular', fueraDeLimites: true };
      }
      return { ok: false, q: null, motivo: 'limite_articular' };
    }
    candidatas.sort((u, v) => dist(u) - dist(v));
    return { ok: true, q: candidatas[0], motivo: null, fueraDeLimites: false };
  }

  const X = { fk, ik, muneca, dentroDeLimites, alcanceMano, envolver180 };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.cinematica = X; }
})();
