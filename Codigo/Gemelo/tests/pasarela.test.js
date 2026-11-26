// Contrato MQTT v0.2 sobre la pasarela del gemelo, con un broker simulado en memoria y reloj controlado.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { crearControladora } = require('../js/modelo/controladora');
const { crearPasarela } = require('../js/mqtt/pasarela');
const { crearClienteContrato } = require('../js/mqtt/cliente_contrato');
const { crearRegistro } = require('../js/modelo/registro');

function banco(opc) {
  opc = opc || {};
  let ahora = 1764067200000;
  const reloj = () => ahora;
  const pub = [];                                   // { topic, msg, qos, retain }
  const retenidos = {};
  const transporte = {
    publicar(topic, texto, op) {
      pub.push({ topic, texto, msg: (() => { try { return JSON.parse(texto); } catch (e) { return texto; } })(), qos: op.qos, retain: op.retain });
      if (op.retain) retenidos[topic] = texto;
    }
  };
  const ctrl = crearControladora();
  const registro = crearRegistro({ nodo: 'gemelo', destino: 'gemelo', reloj, mono: () => ahora * 1e6 });
  const p = crearPasarela(Object.assign({ controladora: ctrl, transporte, id: '07', destino: 'gemelo', reloj, registro }, opc));
  let n = 0;
  const T = p.temas;
  const enviar = (cmd, args, extra) => {
    const m = Object.assign({ id: 'c' + (++n), ts: ahora, destino: 'gemelo', cmd, args: args || {} }, extra || {});
    p.recibir(T.comandos, JSON.stringify(m));
    return m.id;
  };
  const correr = (ms, paso) => { paso = paso || 10; for (let t = 0; t < ms; t += paso) { ahora += paso; ctrl.avanzar(paso); p.tick(); } };
  const acks = (id) => pub.filter((x) => x.topic === T.ack && x.msg.id === id).map((x) => x.msg);
  const esperar = (id, max) => { let t = 0; while (!acks(id).some((a) => ['hecho', 'error', 'rechazado'].includes(a.estado)) && t < (max || 30000)) { correr(10); t += 10; } return acks(id); };
  return { p, ctrl, pub, retenidos, enviar, correr, acks, esperar, T, registro, avanzarReloj: (ms) => { ahora += ms; }, reloj };
}

test('topics: prefijo rvm1/gemelo/<id>/', () => {
  const { T } = banco();
  assert.deepEqual(T, {
    comandos: 'rvm1/gemelo/07/comandos', ack: 'rvm1/gemelo/07/comandos/ack', actuadores: 'rvm1/gemelo/07/actuadores',
    posicion: 'rvm1/gemelo/07/posicion/mundo', online: 'rvm1/gemelo/07/online'
  });
});

test('alConectar: online retenido QoS 1; LWT offline retenido', () => {
  const b = banco();
  b.p.alConectar();
  const on = b.pub.find((x) => x.topic === b.T.online);
  assert.equal(on.texto, 'online'); assert.equal(on.retain, true); assert.equal(on.qos, 1);
  assert.deepEqual(b.p.voluntad(), { topic: b.T.online, payload: 'offline', qos: 1, retain: true });
  const act = b.pub.find((x) => x.topic === b.T.actuadores);
  assert.equal(act.retain, true); assert.equal(act.qos, 1);
});

test('ACK en dos fases: aceptado al recibir y hecho con er=0 al terminar', () => {
  const b = banco();
  const id = b.enviar('jog_articular', { eje: 1, grados: 10 });
  assert.deepEqual(b.acks(id).map((a) => a.estado), ['aceptado']);
  const a = b.esperar(id);
  assert.deepEqual(a.map((x) => x.estado), ['aceptado', 'hecho']);
  assert.equal(a[1].er, 0);
  assert.ok(a[1].ts > a[0].ts, 'hecho llega al acabar el movimiento');
  const ack = b.pub.find((x) => x.topic === b.T.ack);
  assert.equal(ack.qos, 1); assert.equal(ack.retain, false);
});

test('formato: JSON inválido, cmd desconocido, args fuera de rango, falta ts/destino', () => {
  const b = banco();
  b.p.recibir(b.T.comandos, '{no es json');
  assert.equal(b.pub.at(-1).msg.estado, 'rechazado'); assert.equal(b.pub.at(-1).msg.motivo, 'formato'); assert.equal(b.pub.at(-1).msg.id, null);
  for (const [cmd, args] of [['volar', {}], ['jog_articular', { eje: 6, grados: 1 }], ['jog_articular', { eje: 1.5, grados: 1 }], ['velocidad', { sp: 10 }], ['pinza', { accion: 'medio' }], ['mover_pose', { x: 1, y: 2, z: 3, pitch: 0 }]]) {
    const id = b.enviar(cmd, args);
    assert.deepEqual(b.acks(id).map((a) => a.motivo), ['formato'], cmd);
  }
  const id = b.enviar('home', {}, { ts: 'ayer' });
  assert.equal(b.acks(id)[0].motivo, 'formato');
});

test('destino: un comando para el real no se ejecuta en el gemelo', () => {
  const b = banco();
  const id = b.enviar('jog_articular', { eje: 1, grados: 10 }, { destino: 'real' });
  assert.deepEqual(b.acks(id), [{ id, ts: b.reloj(), estado: 'rechazado', motivo: 'destino' }]);
  b.correr(500);
  assert.equal(b.ctrl.estado().q[0], 0);
});

test('caducado al recibir (> 500 ms)', () => {
  const b = banco();
  const id = b.enviar('home', {}, { ts: b.reloj() - 501 });
  assert.equal(b.acks(id)[0].motivo, 'caducado');
  const id2 = b.enviar('home', {}, { ts: b.reloj() - 500 });
  assert.equal(b.acks(id2)[0].estado, 'aceptado');
});

test('caducado al ejecutar: una orden que espera en cola más de 500 ms no se ejecuta', () => {
  const b = banco();
  const id1 = b.enviar('jog_articular', { eje: 1, grados: 90 });        // dura > 500 ms a SP 4
  b.correr(100);
  const id2 = b.enviar('jog_articular', { eje: 1, grados: 10 });
  assert.equal(b.acks(id2)[0].estado, 'aceptado');
  b.esperar(id1);
  const a2 = b.esperar(id2);
  assert.deepEqual(a2.map((x) => [x.estado, x.motivo]), [['aceptado', undefined], ['rechazado', 'caducado']]);
  b.correr(1000);
  assert.ok(Math.abs(b.ctrl.estado().q[0] - 90) < 1e-9, 'solo se ejecutó la primera');
});

test('no_referenciado: jog_mundo y mover_pose antes de home; tras home se aceptan', () => {
  const b = banco();
  assert.equal(b.acks(b.enviar('jog_mundo', { dx: 0, dy: 0, dz: -5 }))[0].motivo, 'no_referenciado');
  assert.equal(b.acks(b.enviar('mover_pose', { x: 250, y: 0, z: 280, pitch: -90, roll: 0 }))[0].motivo, 'no_referenciado');
  b.esperar(b.enviar('home'));
  assert.equal(b.p.actuadores().referenciado, true);
  const id = b.enviar('jog_mundo', { dx: 0, dy: 0, dz: -5 });
  assert.equal(b.esperar(id).at(-1).estado, 'hecho');
});

test('error de modo II → ACK error er=2; error_activo hasta reset; tras reset vuelve a aceptar', () => {
  const b = banco();
  const id = b.enviar('jog_articular', { eje: 1, grados: 300 });         // fuera de límites
  assert.deepEqual(b.esperar(id).at(-1), { id, ts: b.reloj(), estado: 'error', er: 2 });
  assert.equal(b.p.actuadores().error, 2);
  assert.equal(b.acks(b.enviar('home'))[0].motivo, 'error_activo');
  assert.equal(b.esperar(b.enviar('reset')).at(-1).estado, 'hecho');
  assert.equal(b.p.actuadores().error, 0);
  assert.equal(b.esperar(b.enviar('jog_articular', { eje: 1, grados: 5 })).at(-1).estado, 'hecho');
});

test('error de modo I (detectado por el sondeo de ER): solo reset y después home', () => {
  const b = banco();
  b.esperar(b.enviar('home'));
  b.ctrl.inyectarErrorModoI('prueba');
  b.correr(1500);                                            // el sondeo periódico de ER lo descubre
  const a = b.p.actuadores();
  assert.equal(a.error, 1); assert.equal(a.referenciado, false);
  assert.equal(b.acks(b.enviar('jog_articular', { eje: 1, grados: 5 }))[0].motivo, 'error_activo');
  assert.equal(b.esperar(b.enviar('reset')).at(-1).estado, 'hecho');
  assert.equal(b.acks(b.enviar('jog_articular', { eje: 1, grados: 5 }))[0].motivo, 'error_activo', 'tras reset de modo I solo home');
  assert.equal(b.esperar(b.enviar('home')).at(-1).estado, 'hecho');
  assert.equal(b.esperar(b.enviar('jog_articular', { eje: 1, grados: 5 })).at(-1).estado, 'hecho');
});

test('los comandos en cola cuando aparece un error se rechazan con error_activo', () => {
  const b = banco();
  b.enviar('jog_articular', { eje: 1, grados: 10 });                    // en movimiento (< 500 ms para no caducar)
  const id2 = b.enviar('jog_articular', { eje: 1, grados: 300 });       // en cola; dará error
  const id3 = b.enviar('jog_articular', { eje: 2, grados: -5 });        // en cola
  b.esperar(id2);
  assert.equal(b.acks(id2).at(-1).estado, 'error');
  assert.deepEqual(b.acks(id3).map((x) => x.estado + ':' + (x.motivo || '')), ['aceptado:', 'rechazado:error_activo']);
});

test('duplicados: un id repetido no se ejecuta y se reenvía el ACK ya dado', () => {
  const b = banco();
  const m = { id: 'dup-1', ts: b.reloj(), destino: 'gemelo', cmd: 'jog_articular', args: { eje: 1, grados: 10 } };
  b.p.recibir(b.T.comandos, JSON.stringify(m));
  b.esperar('dup-1');
  m.ts = b.reloj();
  b.p.recibir(b.T.comandos, JSON.stringify(m));
  const a = b.acks('dup-1');
  assert.deepEqual(a.map((x) => x.estado), ['aceptado', 'hecho', 'hecho']);
  assert.deepEqual(a[2], a[1], 'mismo ACK');
  b.correr(1000);
  assert.ok(Math.abs(b.ctrl.estado().q[0] - 10) < 1e-9, 'no se movió dos veces');
});

test('duplicados: se recuerdan al menos 256 ids', () => {
  const b = banco();
  for (let i = 0; i < 300; i++) b.p.recibir(b.T.comandos, JSON.stringify({ id: 'v' + i, ts: b.reloj(), destino: 'real', cmd: 'home', args: {} }));
  b.avanzarReloj(11000);
  for (let i = 0; i < 300; i++) b.p.recibir(b.T.comandos, JSON.stringify({ id: 'w' + i, ts: b.reloj(), destino: 'real', cmd: 'home', args: {} }));
  const antes = b.pub.length;
  b.p.recibir(b.T.comandos, JSON.stringify({ id: 'w10', ts: b.reloj(), destino: 'gemelo', cmd: 'home', args: {} }));
  assert.equal(b.pub.length, antes + 1);
  assert.equal(b.pub.at(-1).msg.motivo, 'destino', 'reenvía el ACK antiguo: era un duplicado');
});

test('parar vacía la cola pero no detiene el movimiento en curso', () => {
  const b = banco();
  const id1 = b.enviar('jog_articular', { eje: 1, grados: 60 });
  const id2 = b.enviar('jog_articular', { eje: 1, grados: 10 });
  const id3 = b.enviar('jog_articular', { eje: 1, grados: 10 });
  b.correr(50);
  const ip = b.enviar('parar');
  assert.deepEqual(b.acks(ip).map((x) => x.estado), ['aceptado', 'hecho']);
  assert.equal(b.esperar(id1).at(-1).estado, 'hecho');
  b.correr(2000);
  assert.ok(Math.abs(b.ctrl.estado().q[0] - 60) < 1e-9);
  assert.deepEqual(b.acks(id2).map((x) => x.estado), ['aceptado']);
  assert.deepEqual(b.acks(id3).map((x) => x.estado), ['aceptado']);
});

test('reloj: con desfase medido > 100 ms se rechaza todo; sin medir (null) no se aplica', () => {
  let df = 150;
  const b = banco({ desfase: () => df });
  assert.equal(b.acks(b.enviar('home'))[0].motivo, 'reloj');
  df = 20;
  assert.equal(b.acks(b.enviar('home'))[0].estado, 'aceptado');
  assert.equal(b.p.actuadores().desfase_ms, 20);
  const b2 = banco();
  assert.equal(b2.p.actuadores().desfase_ms, null);
});

test('desconectado: con el cable RS-232 suelto se rechaza y actuadores lo indica', () => {
  const b = banco();
  b.ctrl.ponerConectado(false);
  b.correr(600);                                     // el sondeo de WH falla
  assert.equal(b.p.actuadores().conectado, false);
  assert.equal(b.acks(b.enviar('home'))[0].motivo, 'desconectado');
  b.ctrl.ponerConectado(true);
  b.correr(600);
  assert.equal(b.p.actuadores().conectado, true);
});

test('actuadores: retain, ≥ 1 Hz y al cambiar; campos del contrato', () => {
  const b = banco();
  b.correr(5000);
  const act = b.pub.filter((x) => x.topic === b.T.actuadores);
  assert.ok(act.length >= 5, 'al menos 1 por segundo: ' + act.length);
  assert.ok(act.every((x) => x.retain && x.qos === 1));
  for (let i = 1; i < act.length; i++) assert.ok(act[i].msg.ts - act[i - 1].msg.ts <= 1000);
  assert.deepEqual(Object.keys(act.at(-1).msg).sort(), ['cola', 'conectado', 'desfase_ms', 'error', 'ocupado', 'pinza', 'referenciado', 'ts', 'velocidad'].sort());
  const n = act.length;
  b.enviar('velocidad', { sp: 7 });
  const nuevos = b.pub.filter((x) => x.topic === b.T.actuadores).slice(n);
  assert.ok(nuevos.length >= 1, 'publica al cambiar');
  b.correr(100);
  assert.equal(b.p.actuadores().velocidad, 7);
  b.esperar(b.enviar('pinza', { accion: 'cerrar' }));
  assert.equal(b.p.actuadores().pinza, 'cerrada');
});

test('ocupado y cola en actuadores mientras hay comandos', () => {
  const b = banco();
  b.enviar('jog_articular', { eje: 1, grados: 60 });
  b.enviar('jog_articular', { eje: 1, grados: 10 });
  const a = b.p.actuadores();
  assert.equal(a.ocupado, true); assert.equal(a.cola, 1);
});

test('posicion/mundo: retain QoS 0, cada 500 ms en reposo, tras cada movimiento y valida=false sin referenciar', () => {
  const b = banco();
  b.correr(3000);
  const pos = b.pub.filter((x) => x.topic === b.T.posicion);
  assert.ok(pos.length >= 5 && pos.length <= 7, 'unas 2 por segundo: ' + pos.length);
  assert.ok(pos.every((x) => x.retain === true && x.qos === 0));
  assert.equal(pos.at(-1).msg.valida, false);
  assert.deepEqual(Object.keys(pos.at(-1).msg).sort(), ['pitch', 'roll', 'ts', 'valida', 'x', 'y', 'z']);
  const id = b.enviar('home');
  b.esperar(id);
  b.correr(20);
  const ult = b.pub.filter((x) => x.topic === b.T.posicion).at(-1).msg;
  assert.equal(ult.valida, true);
  assert.ok(Math.abs(ult.ts - b.acks(id).at(-1).ts) <= 20, 'se publica justo tras el movimiento');
});

test('comandos nunca retenidos por el cliente del contrato', () => {
  const salida = [];
  const c = crearClienteContrato({ transporte: { publicar: (t, x, o) => salida.push({ t, o }) }, destino: 'real', id: '01' });
  c.enviar('home');
  assert.deepEqual(salida[0], { t: 'rvm1/real/01/comandos', o: { qos: 1, retain: false } });
});

test('cliente ↔ pasarela por un bus en memoria: el cliente sigue los ACK y el estado', () => {
  let ahora = 1764067200000; const reloj = () => ahora;
  const ctrl = crearControladora();
  let p, c;
  const bus = { publicar: (t, x) => { if (t.endsWith('/comandos')) p.recibir(t, x); else c.recibir(t, x); } };
  p = crearPasarela({ controladora: ctrl, transporte: bus, id: '03', reloj });
  c = crearClienteContrato({ transporte: bus, destino: 'gemelo', id: '03', reloj });
  const visto = [];
  c.alCambio((e) => { if (e.tipo === 'ack') visto.push(e.datos.estado); });
  c.enviar('home');
  assert.equal(c.pendientes(), 1);
  for (let t = 0; t < 6000; t += 10) { ahora += 10; ctrl.avanzar(10); p.tick(); }
  assert.deepEqual(visto.slice(0, 2), ['aceptado', 'hecho']);
  assert.equal(c.pendientes(), 0);
  assert.equal(c.actuadores.referenciado, true);
  assert.equal(c.posicion.valida, true);
});

test('registro: cada mensaje recibido/enviado y cada línea serie queda en el JSONL', () => {
  const b = banco();
  b.registro.nota({ version_contrato: '0.2' });
  const id = b.enviar('jog_articular', { eje: 1, grados: 5 });
  b.esperar(id);
  const L = b.registro.lineas();
  const tipos = new Set(L.map((x) => x.evento));
  for (const e of ['nota', 'cmd_rx', 'ack_tx', 'serie_tx', 'serie_rx', 'pos', 'estado']) assert.ok(tipos.has(e), e);
  for (const f of L) { assert.equal(typeof f.t_ms, 'number'); assert.equal(typeof f.t_mono_ns, 'number'); assert.equal(f.nodo, 'gemelo'); assert.equal(f.destino, 'gemelo'); }
  assert.ok(L.some((x) => x.evento === 'serie_tx' && x.linea === 'DJ 1,5.0'));
  assert.ok(L.some((x) => x.evento === 'serie_rx' && x.linea === 'ER' && x.texto === '0'));
  const jsonl = b.registro.jsonl().trim().split('\n');
  assert.equal(jsonl.length, L.length);
  jsonl.forEach((l) => JSON.parse(l));
  assert.match(b.registro.nombreFichero('fidelidad E2'), /^\d{8}-\d{6}_gemelo_fidelidad-E2\.jsonl$/);
});

test('sincronizarReferencia (solo gemelo): un NT hecho fuera de la pasarela se refleja en actuadores', () => {
  const b = banco({ sincronizarReferencia: true });
  b.ctrl.enviar('NT');
  b.correr(5000);
  assert.equal(b.p.actuadores().referenciado, true);
});

test('v0.3: un ts más de 100 ms por delante del reloj del receptor se rechaza como caducado', () => {
  const b = banco();
  assert.equal(b.acks(b.enviar('home', {}, { ts: b.reloj() + 101 }))[0].motivo, 'caducado');
  assert.equal(b.acks(b.enviar('home', {}, { ts: b.reloj() + 100 }))[0].estado, 'aceptado');
});
