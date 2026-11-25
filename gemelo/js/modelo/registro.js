// Registro de eventos según la skill registro-experimentos: una línea JSON por evento (JSONL).
//   const reg = crearRegistro({ nodo: 'gemelo', destino: 'gemelo', reloj, mono, max });
//   reg.nota({ ... })                          evento 'nota' (al inicio: versión, contrato, broker, red, robot, operador)
//   reg.ev('cmd_rx', { id, cmd, args })        cualquier evento: cmd_tx, cmd_rx, ack_tx, ack_rx, serie_tx, serie_rx, pos, estado, nota
//   reg.jsonl()  → texto      reg.lineas()  → array      reg.nombreFichero('fidelidad')  → AAAAMMDD-HHMMSS_gemelo_fidelidad.jsonl
//   reg.vaciar()
// t_ms: reloj de pared (epoch ms). t_mono_ns: reloj monotónico del nodo en ns (en el navegador, performance.now()·1e6;
// su resolución real la limita el navegador, normalmente 5–100 µs).
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const EVENTOS = ['cmd_tx', 'cmd_rx', 'ack_tx', 'ack_rx', 'serie_tx', 'serie_rx', 'pos', 'estado', 'nota'];

  function monoPorDefecto() {
    if (typeof performance !== 'undefined' && performance.now) return Math.round(performance.now() * 1e6);
    if (typeof process !== 'undefined' && process.hrtime) { const [s, n] = process.hrtime(); return s * 1e9 + n; }
    return 0;
  }

  function crearRegistro(opc) {
    opc = opc || {};
    const reloj = opc.reloj || (() => Date.now());
    const mono = opc.mono || monoPorDefecto;
    const max = opc.max || 500000;
    let filas = [], descartadas = 0;
    const oyentes = [];

    function ev(evento, datos) {
      if (!EVENTOS.includes(evento)) throw new Error('evento no válido: ' + evento);
      const f = Object.assign({ t_ms: reloj(), t_mono_ns: mono(), nodo: opc.nodo || 'gemelo', destino: opc.destino || 'gemelo', evento }, datos || {});
      if (filas.length >= max) { filas.shift(); descartadas++; }
      filas.push(f);
      for (const o of oyentes) o(f);
      return f;
    }

    function dosCifras(n) { return String(n).padStart(2, '0'); }

    return {
      ev,
      nota: (datos) => ev('nota', datos),
      lineas: () => filas.slice(),
      jsonl: () => filas.map((f) => JSON.stringify(f)).join('\n') + (filas.length ? '\n' : ''),
      cuenta: () => filas.length,
      descartadas: () => descartadas,
      vaciar() { filas = []; descartadas = 0; },
      alEvento(fn) { oyentes.push(fn); },
      nombreFichero(descripcion) {
        const d = new Date(reloj());
        const sello = '' + d.getFullYear() + dosCifras(d.getMonth() + 1) + dosCifras(d.getDate()) + '-' + dosCifras(d.getHours()) + dosCifras(d.getMinutes()) + dosCifras(d.getSeconds());
        const desc = String(descripcion || 'sesion').replace(/[^A-Za-z0-9_-]+/g, '-');
        return sello + '_' + (opc.destino || 'gemelo') + '_' + desc + '.jsonl';
      }
    };
  }

  const X = { crearRegistro, EVENTOS };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.registro = X; }
})();
