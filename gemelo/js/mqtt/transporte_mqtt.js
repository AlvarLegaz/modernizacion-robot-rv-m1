// Adaptador de mqtt.js (lib/mqtt.min.js en el navegador; en Node se le pasa el módulo 'mqtt') al interfaz de transporte
// que usan la pasarela y el cliente del contrato: publicar(topic, texto, { qos, retain }).
//   const t = crearTransporteMqtt({ lib, url, usuario, contrasena, voluntad, alConectar, alDesconectar, alMensaje, alError });
//   t.suscribir([topics])   t.desuscribir([topics])   t.publicar(...)   t.cerrar()   t.conectado
// El broker es opcional: sin él, el gemelo funciona en local. Nunca se publica con retain en `comandos` (lo garantiza quien llama).
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;

  function crearTransporteMqtt(opc) {
    const lib = opc.lib || (typeof window !== 'undefined' ? window.mqtt : null);
    if (!lib) throw new Error('mqtt.js no está cargado');
    const opciones = {
      clientId: opc.clientId || ('rvm1-gemelo-' + Math.random().toString(16).slice(2, 10)),
      clean: true, keepalive: 10, reconnectPeriod: 2000, connectTimeout: 6000,
      protocolVersion: 4
    };
    if (opc.usuario) opciones.username = opc.usuario;
    if (opc.contrasena) opciones.password = opc.contrasena;
    if (opc.voluntad) opciones.will = { topic: opc.voluntad.topic, payload: opc.voluntad.payload, qos: opc.voluntad.qos, retain: opc.voluntad.retain };

    const cli = lib.connect(opc.url, opciones);
    const suscritos = new Set();
    const api = { conectado: false };

    cli.on('connect', () => {
      api.conectado = true;
      if (suscritos.size) cli.subscribe([...suscritos], { qos: 1 });
      if (opc.alConectar) opc.alConectar();
    });
    cli.on('close', () => { if (api.conectado && opc.alDesconectar) opc.alDesconectar(); api.conectado = false; });
    cli.on('offline', () => { api.conectado = false; });
    cli.on('error', (e) => { if (opc.alError) opc.alError(e); });
    cli.on('message', (topic, buf) => { if (opc.alMensaje) opc.alMensaje(topic, buf.toString()); });

    api.publicar = (topic, texto, op) => {
      if (!api.conectado) return false;
      cli.publish(topic, texto, { qos: (op && op.qos) || 0, retain: !!(op && op.retain) });
      return true;
    };
    api.suscribir = (lista) => { lista.forEach((t) => suscritos.add(t)); if (api.conectado) cli.subscribe(lista, { qos: 1 }); };
    api.desuscribir = (lista) => { lista.forEach((t) => suscritos.delete(t)); if (api.conectado) cli.unsubscribe(lista); };
    // cierre ordenado: se publica 'offline' a mano (la LWT solo salta en desconexiones bruscas)
    api.cerrar = (despedida) => {
      if (despedida && api.conectado) cli.publish(despedida.topic, despedida.payload, { qos: despedida.qos, retain: despedida.retain });
      cli.end(false);
      api.conectado = false;
    };
    return api;
  }

  const X = { crearTransporteMqtt };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.transporteMqtt = X; }
})();
