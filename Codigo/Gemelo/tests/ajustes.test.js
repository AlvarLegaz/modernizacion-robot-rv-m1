'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../js/modelo/ajustes');

test('ajustes: valores por defecto y validación con límites', () => {
  assert.deepEqual(A.validar(undefined), A.DEFECTOS);
  assert.deepEqual(A.validar('x'), A.DEFECTOS);
  const v = A.validar({ pantalla: 'otra', ejes: 'si', zonaMuerta: 5, velJog: 9.4, solidos: false, mando: false });
  assert.equal(v.pantalla, 'ambas'); assert.equal(v.ejes, true); assert.equal(v.zonaMuerta, 0.9); assert.equal(v.velJog, 3);
  assert.equal(v.solidos, false); assert.equal(v.mando, false);
  assert.equal(A.validar({ zonaMuerta: 0 }).zonaMuerta, 0.3);
  assert.equal(A.validar({ pantalla: 'visor' }).pantalla, 'visor');
});

test('ajustes: guardar y cargar; almacenamiento roto o bloqueado no rompe', () => {
  const mem = {}; const st = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = v; } };
  assert.deepEqual(A.cargar(st), A.DEFECTOS);
  assert.equal(A.guardar(st, { ...A.DEFECTOS, nave: false, velJog: 2 }), true);
  assert.deepEqual(A.cargar(st), { ...A.DEFECTOS, nave: false, velJog: 2 });
  assert.deepEqual(A.cargar({ getItem: () => '{roto', setItem() {} }), A.DEFECTOS);
  assert.equal(A.guardar({ setItem() { throw new Error('lleno'); } }, A.DEFECTOS), false);
  assert.deepEqual(A.cargar({ getItem() { throw new Error('bloqueado'); } }), A.DEFECTOS);
});
