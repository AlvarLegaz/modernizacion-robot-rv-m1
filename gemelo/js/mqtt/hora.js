// Estimación del desfase del reloj local con la ruta /hora del servidor web del aula (contrato v0.3, "Relojes").
// Algoritmo de Cristian: desfase = hora_servidor + RTT/2 − hora_local (al recibir). Se hacen varias muestras y se
// queda la de menor RTT. /hora devuelve segundos epoch con milisegundos ("1764067200.123"); también se acepta ms.
//   const m = crearMedidorHora({ url: '/hora', pedir: fetch, reloj: Date.now });
//   const r = await m.medir(5)   → { desfase_ms, rtt_ms, muestras } o null si no hay /hora (p. ej. python -m http.server)
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;

  function aMs(texto) {
    const v = parseFloat(String(texto).trim());
    if (!isFinite(v) || v <= 0) return null;
    return v < 1e11 ? v * 1000 : v;          // segundos → ms
  }

  function crearMedidorHora(opc) {
    opc = opc || {};
    const url = opc.url || '/hora';
    const pedir = opc.pedir || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    const reloj = opc.reloj || (() => Date.now());

    async function muestra() {
      const t0 = reloj();
      const r = await pedir(url + (url.includes('?') ? '&' : '?') + 't=' + t0, { cache: 'no-store' });
      const t1 = reloj();
      if (!r.ok) return null;
      const srv = aMs(await r.text());
      if (srv === null) return null;
      const rtt = t1 - t0;
      return { desfase_ms: Math.round(srv + rtt / 2 - t1), rtt_ms: rtt };
    }

    async function medir(n) {
      if (!pedir) return null;
      const ms = [];
      for (let i = 0; i < (n || 5); i++) {
        try { const m = await muestra(); if (m) ms.push(m); else break; } catch (e) { break; }
      }
      if (!ms.length) return null;
      ms.sort((a, b) => a.rtt_ms - b.rtt_ms);
      return Object.assign({}, ms[0], { muestras: ms.length });
    }
    return { medir };
  }

  const X = { crearMedidorHora, aMs };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.hora = X; }
})();
