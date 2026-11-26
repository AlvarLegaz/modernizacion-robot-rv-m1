'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { crearObservadorReal } = require('../js/mqtt/observador_real');
const { crearControladora } = require('../js/modelo/controladora');
const { crearRegistro } = require('../js/modelo/registro');
const CIN = require('../js/modelo/cinematica');

test('solo lee topics de rvm1/real/<id>/ (posicion, actuadores, online)', () => {
  const o = crearObservadorReal({ idReal: '01' });
  assert.deepEqual(o.lista, ['rvm1/real/01/posicion/mundo', 'rvm1/real/01/actuadores', 'rvm1/real/01/online']);
  assert.equal(Object.keys(o).includes('publicar'), false);
});

test('pose real → q por cinemática inversa; error gemelo–real y registro E2', () => {
  let t = 1000;
  const ctrl = crearControladora();
  ctrl.enviar('NT'); ctrl.avanzar(10000);
  const reg = crearRegistro({ reloj: () => t, mono: () => t * 1e6 });
  const o = crearObservadorReal({ idReal: '01', reloj: () => t, registro: reg, estadoGemelo: () => ctrl.estado(), modo: () => 'sombra' });
  const qReal = [10, 70, -95, -65, 5];
  const p = CIN.fk(qReal, ctrl.estado().tl);
  o.recibir('rvm1/real/01/posicion/mundo', JSON.stringify({ ts: 999, x: p.x, y: p.y, z: p.z, pitch: p.p, roll: p.r, valida: true }));
  const e = o.estado();
  assert.equal(e.ikOk, true); assert.equal(e.fueraDeLimites, false);
  e.q.forEach((v, i) => assert.ok(Math.abs(v - qReal[i]) < 1e-6));
  const err = o.errorFrente(ctrl.estado());
  const g = ctrl.estado().pose;
  assert.ok(Math.abs(err.dpos_mm - Math.hypot(g.x - p.x, g.y - p.y, g.z - p.z)) < 1e-9);
  const ev = reg.lineas().filter((x) => x.evento === 'pos');
  assert.equal(ev.length, 1);
  assert.equal(ev[0].destino, 'real'); assert.equal(ev[0].modo, 'sombra');
  assert.equal(ev[0].real.valida, true); assert.ok(ev[0].gemelo); assert.ok(ev[0].error);
});

test('pose real fuera de los límites provisionales: se dibuja igualmente y se marca', () => {
  const o = crearObservadorReal({ idReal: '01' });
  const p = CIN.fk([0, 20, -130, 20, 0], 107);         // J3 = -130 fuera de -110..0
  o.recibir('rvm1/real/01/posicion/mundo', JSON.stringify({ ts: 1, x: p.x, y: p.y, z: p.z, pitch: p.p, roll: p.r, valida: true }));
  assert.equal(o.estado().ikOk, true);
  assert.equal(o.estado().fueraDeLimites, true);
});

test('mensajes inválidos se ignoran', () => {
  const o = crearObservadorReal({ idReal: '01' });
  o.recibir('rvm1/real/01/posicion/mundo', '{malo');
  o.recibir('rvm1/real/01/posicion/mundo', JSON.stringify({ x: 1 }));
  assert.equal(o.estado().pose, null);
  o.recibir('rvm1/real/01/online', 'offline');
  assert.equal(o.estado().online, 'offline');
});
