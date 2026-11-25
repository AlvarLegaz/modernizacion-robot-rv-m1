// Cliente del contrato MQTT v0.3 (lado aplicación): SOLO publica en `comandos` y lee ack, actuadores, posicion/mundo y online.
// Lo usa el pendant cuando trabaja por MQTT (destino gemelo o real).
//   const c = crearClienteContrato({ transporte, destino: 'real'|'gemelo', id: '07', reloj, registro });
//   c.temasLectura          topics a los que hay que suscribirse
//   c.enviar(cmd, args)     → id del comando (QoS 1, nunca retain)
//   c.recibir(topic, texto) entrada de mensajes del broker
//   c.pendientes()          comandos sin ACK final
//   c.actuadores / c.posicion / c.online      últimos valores recibidos
//   c.alCambio(fn)          fn({ tipo: 'ack'|'actuadores'|'posicion'|'online', datos, comando })
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const FINALES = ['hecho', 'error', 'rechazado'];

  function crearClienteContrato(opc) {
    const destino = opc.destino, id = String(opc.id);
    const reloj = opc.reloj || (() => Date.now());
    const reg = opc.registro || null;
    const tr = opc.transporte;
    const base = 'rvm1/' + destino + '/' + id + '/';
    const temas = { comandos: base + 'comandos', ack: base + 'comandos/ack', actuadores: base + 'actuadores', posicion: base + 'posicion/mundo', online: base + 'online' };
    const enVuelo = new Map();     // id → { cmd, args, estado, t }
    const oyentes = [];
    let n = 0;
    const prefijo = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    const api = { temas, temasLectura: [temas.ack, temas.actuadores, temas.posicion, temas.online], actuadores: null, posicion: null, online: null, destino, id };
    const emitir = (ev) => oyentes.forEach((f) => f(ev));

    api.enviar = function (cmd, args) {
      const idc = prefijo + '-' + (++n).toString(36);
      const m = { id: idc, ts: reloj(), destino, cmd, args: args || {} };
      enVuelo.set(idc, { cmd, args: m.args, estado: 'enviado', t: m.ts });
      if (reg) reg.ev('cmd_tx', { id: idc, cmd, args: m.args, destino_msg: destino });
      tr.publicar(temas.comandos, JSON.stringify(m), { qos: 1, retain: false });
      return idc;
    };

    api.recibir = function (topic, texto) {
      let d;
      if (topic === temas.online) { api.online = String(texto); emitir({ tipo: 'online', datos: api.online }); return; }
      try { d = JSON.parse(String(texto)); } catch (e) { return; }
      if (topic === temas.ack) {
        const c = d && enVuelo.get(d.id);
        if (reg) reg.ev('ack_rx', { id: d.id, estado: d.estado, motivo: d.motivo, er: d.er, ts_ack: d.ts });
        if (c) { c.estado = d.estado; if (FINALES.includes(d.estado)) enVuelo.delete(d.id); }
        emitir({ tipo: 'ack', datos: d, comando: c || null });
      } else if (topic === temas.actuadores) { api.actuadores = d; emitir({ tipo: 'actuadores', datos: d }); }
      else if (topic === temas.posicion) { api.posicion = d; emitir({ tipo: 'posicion', datos: d }); }
    };

    api.pendientes = () => {
      // se olvidan los que llevan mucho sin respuesta (p. ej. descartados por 'parar', que no reciben ACK final)
      const t = reloj();
      for (const [k, v] of enVuelo) if (t - v.t > 30000) enVuelo.delete(k);
      return enVuelo.size;
    };
    api.olvidarPendientes = () => enVuelo.clear();
    api.alCambio = (fn) => { oyentes.push(fn); };
    return api;
  }

  const X = { crearClienteContrato };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.clienteContrato = X; }
})();
