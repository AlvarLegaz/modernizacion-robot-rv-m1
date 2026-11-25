'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { crearMedidorHora, aMs } = require('../js/mqtt/hora');

test('aMs: segundos con milisegundos (nginx $msec) o milisegundos', () => {
  assert.equal(aMs('1764067200.123\n'), 1764067200123);
  assert.equal(aMs('1764067200123'), 1764067200123);
  assert.equal(aMs('hola'), null);
});

test('Cristian: desfase = servidor + RTT/2 − local, con la muestra de menor RTT', async () => {
  let ahora = 1764067200000;
  const rtts = [40, 10, 30];
  let i = 0;
  const pedir = async () => {
    const rtt = rtts[i++ % rtts.length];
    ahora += rtt / 2;
    const srv = ahora + 250;                     // el servidor va 250 ms por delante
    ahora += rtt / 2;
    return { ok: true, text: async () => (srv / 1000).toFixed(3) };
  };
  const r = await crearMedidorHora({ pedir, reloj: () => ahora }).medir(3);
  assert.equal(r.rtt_ms, 10);
  assert.equal(r.desfase_ms, 250);
  assert.equal(r.muestras, 3);
});

test('sin /hora (404) → null', async () => {
  const r = await crearMedidorHora({ pedir: async () => ({ ok: false }) }).medir(3);
  assert.equal(r, null);
});
