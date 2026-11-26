'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E3 = require('../js/mqtt/estado3d');

const est = { q: [1.234567, 90, -90, -90, 0], apertura: 0.33333, tl: 107, err: 0 };
const mundo = { cubo: { x: 260.04, y: -150, z: 12.5, yaw: 0.12345, agarrado: false }, mesita: { x: 260, y: 150 } };

test('estado3d: construir, firma y leer (ida y vuelta)', () => {
  const o = E3.construir(est, mundo, { seq: 3, piezas: ['mano', 'mesa'] }, 1000);
  assert.deepEqual(o.q, [1.23, 90, -90, -90, 0]);
  const l = E3.leer(JSON.stringify(o));
  assert.deepEqual(l.col, { seq: 3, piezas: ['mano', 'mesa'] });
  assert.equal(l.cubo.x, 260);
  assert.equal(E3.firma(o), E3.firma(Object.assign({}, o, { ts: 2000 })), 'la firma ignora ts');
  assert.notEqual(E3.firma(o), E3.firma(E3.construir(Object.assign({}, est, { apertura: 1 }), mundo, { seq: 3 }, 1000)));
});

test('estado3d: rechaza datos que no son un estado válido', () => {
  const ok = JSON.parse(JSON.stringify(E3.construir(est, mundo, null, 1)));
  for (const mal of ['no json', '{}', JSON.stringify({ ...ok, v: 2 }), JSON.stringify({ ...ok, q: [1, 2, 3] }), JSON.stringify({ ...ok, q: [1, 2, 3, 4, 'x'] }),
    JSON.stringify({ ...ok, cubo: null }), JSON.stringify({ ...ok, mesita: { x: 1 } }), JSON.stringify({ ...ok, apertura: null })]) {
    assert.equal(E3.leer(mal), null, mal.slice(0, 40));
  }
  assert.deepEqual(E3.leer(JSON.stringify({ ...ok, col: undefined })).col, { seq: 0, piezas: null });
});
