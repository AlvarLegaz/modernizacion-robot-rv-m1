// Estado para la vista 3D remota (solo gemelo): lo publica la página que emula el robot (el «pendant») y lo lee otra página en
// modo visor, que solo dibuja. Topic: rvm1/gemelo/<id>/estado3d (QoS 0, retain). No existe para el robot real.
//   construir(est, mundo, col, ts, ses) → objeto a publicar    est = ctrl.estado(), mundo = mundo.estado(), col = { seq, piezas }, ses = id de la página que publica
//   (ses permite detectar DOS páginas emulando el mismo gemelo: sus estados se alternan y el robot «da saltos»)
//   firma(obj)                      → texto para detectar cambios (ignora ts)
//   leer(texto)                     → objeto validado o null si no es un estado3d correcto
//   { v:1, ts, ses, q:[5], apertura, tl, err, cubo:{x,y,z,yaw,agarrado}, mesita:{x,y}, col:{seq,piezas} }
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const r = (v, d) => { const k = Math.pow(10, d); return Math.round(v * k) / k; };
  const fin = (v) => typeof v === 'number' && isFinite(v);

  function construir(est, mundo, col, ts, ses) {
    return {
      v: 1, ts: ts || Date.now(), ses: ses ? String(ses) : '',
      q: est.q.map((x) => r(x, 2)), apertura: r(est.apertura, 3), tl: est.tl, err: est.err,
      cubo: { x: r(mundo.cubo.x, 1), y: r(mundo.cubo.y, 1), z: r(mundo.cubo.z, 1), yaw: r(mundo.cubo.yaw, 3), agarrado: !!mundo.cubo.agarrado },
      mesita: { x: r(mundo.mesita.x, 1), y: r(mundo.mesita.y, 1) },
      col: { seq: col ? col.seq : 0, piezas: col && col.piezas ? col.piezas : null }
    };
  }
  function firma(o) { const c = Object.assign({}, o); delete c.ts; return JSON.stringify(c); }

  function leer(texto) {
    let o; try { o = JSON.parse(texto); } catch (e) { return null; }
    if (!o || o.v !== 1 || !Array.isArray(o.q) || o.q.length !== 5 || !o.q.every(fin)) return null;
    if (!fin(o.apertura) || !fin(o.tl)) return null;
    const c = o.cubo, m = o.mesita;
    if (!c || !['x', 'y', 'z', 'yaw'].every((k) => fin(c[k])) || !m || !fin(m.x) || !fin(m.y)) return null;
    const k = o.col && fin(o.col.seq) ? { seq: o.col.seq, piezas: Array.isArray(o.col.piezas) && o.col.piezas.length === 2 ? o.col.piezas.map(String) : null } : { seq: 0, piezas: null };
    return { v: 1, ts: fin(o.ts) ? o.ts : 0, ses: typeof o.ses === 'string' ? o.ses.slice(0, 16) : '', q: o.q.slice(), apertura: o.apertura, tl: o.tl, err: fin(o.err) ? o.err : 0,
      cubo: { x: c.x, y: c.y, z: c.z, yaw: c.yaw, agarrado: !!c.agarrado }, mesita: { x: m.x, y: m.y }, col: k };
  }

  const X = { construir, firma, leer };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.estado3d = X; }
})();
