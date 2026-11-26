'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { crearPresentes } = require('../js/mqtt/presentes');

test('presentes: lista de gemelos y robots reales en línea, con orden y marca de «propio»', () => {
  const p = crearPresentes();
  assert.equal(p.actualizar('rvm1/gemelo/07/online', 'online'), true);
  assert.equal(p.actualizar('rvm1/gemelo/07/online', 'online'), false, 'sin cambios');
  assert.equal(p.actualizar('rvm1/real/01/online', 'online'), true);
  assert.equal(p.actualizar('rvm1/gemelo/03/online', 'offline'), true);
  assert.equal(p.actualizar('rvm1/gemelo/07/comandos', 'x'), false, 'otros topics se ignoran');
  assert.equal(p.actualizar('rvm1/otro/07/online', 'online'), false);
  const l = p.lista({ destino: 'gemelo', id: '07' });
  assert.deepEqual(l.map((x) => x.destino + '/' + x.id + ':' + x.estado), ['real/01:online', 'gemelo/07:online', 'gemelo/03:offline']);
  assert.equal(l.find((x) => x.id === '07').propio, true);
  assert.equal(l.find((x) => x.destino === 'real').propio, false);
  assert.equal(p.actualizar('rvm1/real/01/online', '"offline"'), true, 'acepta el texto entre comillas');
  assert.equal(p.lista(null)[0].estado === 'offline' || p.lista(null)[0].destino === 'gemelo', true);
  p.limpiar(); assert.deepEqual(p.lista(), []);
});
