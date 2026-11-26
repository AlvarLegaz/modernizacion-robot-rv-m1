'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { crearMando, BOTONES: B } = require('../js/interfaz/mando');

function montar() {
  let g = null;
  const acc = [], cambios = [];
  const m = crearMando({ leer: () => g, accion: (...a) => acc.push(a.join(':')), alCambio: (c, id) => cambios.push(c + ':' + id) });
  const nuevo = () => ({ id: 'Xbox', botones: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })), ejes: [0, 0, 0, 0] });
  const pulsar = (i, on) => { g.botones[i] = { pressed: on, value: on ? 1 : 0 }; };
  return { m, acc, cambios, poner: (x) => { g = x; }, nuevo, pulsar, quitar: () => { g = null; }, get g() { return g; } };
}

test('mando: cada botón hace una acción en el flanco de subida y no se repite al mantenerlo', () => {
  const t = montar(); t.poner(t.nuevo()); t.m.tick();
  t.pulsar(B.START, true); t.m.tick(); t.m.tick(); t.m.tick();
  t.pulsar(B.START, false); t.m.tick(); t.pulsar(B.START, true); t.m.tick();
  assert.deepEqual(t.acc, ['enable', 'enable']);
  for (const [b, a] of [[B.B, 'stop'], [B.Y, 'home'], [B.BACK, 'reset'], [B.LT, 'abrir'], [B.RT, 'cerrar'], [B.A, 'he'], [B.X, 'mo'], [B.LB, 'coord'], [B.RB, 'modo'], [B.UP, 'sp+'], [B.DOWN, 'sp-']]) {
    t.acc.length = 0; t.pulsar(b, true); t.m.tick(); t.pulsar(b, false); t.m.tick();
    assert.deepEqual(t.acc, [a], 'botón ' + b);
  }
});

test('mando: las palancas hacen jog de un eje a la vez, con histéresis, y al soltar lo detienen', () => {
  const t = montar(); t.poner(t.nuevo()); t.m.tick();
  t.g.ejes = [0.3, 0, 0, 0]; t.m.tick();
  assert.deepEqual(t.acc, [], 'dentro de la zona muerta');
  t.g.ejes = [0.8, 0, 0, 0]; t.m.tick(); t.m.tick();
  assert.deepEqual(t.acc, ['jog:0:1']);
  t.g.ejes = [0.5, 0, 0, 0]; t.m.tick();                              // por debajo de 0,55 pero sobre 0,35: sigue
  assert.deepEqual(t.acc, ['jog:0:1']);
  t.g.ejes = [0.9, -0.95, 0, 0]; t.m.tick();                          // la palanca hacia arriba (−) da eje 2 con signo +, y manda el de más recorrido
  assert.deepEqual(t.acc.slice(1), ['jogsoltar', 'jog:1:1']);
  t.g.ejes = [0, 0, 0, 0]; t.m.tick();
  assert.equal(t.acc[t.acc.length - 1], 'jogsoltar');
  t.acc.length = 0; t.g.ejes = [0, 0, 0, -0.9]; t.m.tick();           // palanca derecha arriba → Z+
  assert.deepEqual(t.acc, ['jog:2:1']);
  t.g.ejes = [0, 0, 0, 0]; t.m.tick(); t.acc.length = 0;
  t.pulsar(B.LEFT, true); t.m.tick();                                 // cruceta ← → J5 −
  assert.deepEqual(t.acc, ['jog:4:-1']);
});

test('mando: al desconectarse suelta el jog y deshabilita; al reconectar avisa', () => {
  const t = montar(); t.poner(t.nuevo()); t.m.tick();
  t.g.ejes = [0, 0, 0.9, 0]; t.m.tick(); t.acc.length = 0;
  t.quitar(); t.m.tick(); t.m.tick();
  assert.deepEqual(t.acc, ['jogsoltar', 'deshabilitar']);
  assert.deepEqual(t.cambios, ['true:Xbox', 'false:Xbox']);
  t.poner(t.nuevo()); t.m.tick();
  assert.equal(t.cambios[2], 'true:Xbox');
});
