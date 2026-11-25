// node --test gemelo/tests
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const CFG = require('../js/modelo/config_rvm1');
const CIN = require('../js/modelo/cinematica');

const G = CFG.geometria;
const cerca = (a, b, tol, txt) => assert.ok(Math.abs(a - b) <= tol, `${txt || ''} ${a} ≠ ${b} (tol ${tol})`);

test('fk: brazo estirado en horizontal con la mano horizontal', () => {
  const p = CIN.fk([0, 0, 0, 0, 0], 0);
  cerca(p.x, G.brazo + G.antebrazo + G.cabeceo_a_brida, 1e-9, 'x');
  cerca(p.y, 0, 1e-9); cerca(p.z, G.altura_hombro, 1e-9); cerca(p.p, 0, 1e-12);
});

test('fk: el origen da la postura esperada y P = J2+J3+J4', () => {
  const p = CIN.fk(CFG.origen, G.herramienta_defecto);
  cerca(p.p, -90, 1e-9);
  cerca(p.x, G.antebrazo, 1e-9);
  cerca(p.z, G.altura_hombro + G.brazo - G.cabeceo_a_brida - G.herramienta_defecto, 1e-9);
});

test('fk: J1 gira el plano del brazo', () => {
  const p = CIN.fk([90, 0, 0, 0, 0], 0);
  cerca(p.x, 0, 1e-9); cerca(p.y, G.brazo + G.antebrazo + G.cabeceo_a_brida, 1e-9);
});

test('ik(fk(q)) = q en una rejilla de posturas dentro de límites (codo arriba)', () => {
  let n = 0;
  for (const q1 of [-140, -60, 0, 45, 140])
    for (const q2 of [10, 45, 80, 110])
      for (const q3 of [-100, -60, -20])
        for (const q4 of [-80, -30, 0, 60])
          for (const q5 of [-170, 0, 90]) {
            const q = [q1, q2, q3, q4, q5];
            const p = CIN.fk(q, 107);
            const s = CIN.ik(p, 107, q);
            assert.ok(s.ok, 'ik falla en ' + q);
            const p2 = CIN.fk(s.q, 107);
            for (const k of ['x', 'y', 'z', 'p', 'r']) cerca(p2[k], p[k], 1e-6, k);
            n++;
          }
  assert.ok(n > 500);
});

test('ik: punto fuera de alcance', () => {
  const s = CIN.ik({ x: 2000, y: 0, z: 300, p: 0, r: 0 }, 107);
  assert.equal(s.ok, false); assert.equal(s.motivo, 'fuera_de_alcance');
});

test('ik: punto alcanzable pero fuera de límites articulares (detrás de la base)', () => {
  const s = CIN.ik({ x: -300, y: -10, z: 300, p: 0, r: 0 }, 107);
  assert.equal(s.ok, false); assert.equal(s.motivo, 'limite_articular');
});

test('ik: valores no numéricos', () => {
  assert.equal(CIN.ik({ x: 'a', y: 0, z: 0, p: 0, r: 0 }).ok, false);
});

test('límites: recorridos de la ficha técnica', () => {
  const rec = CFG.ejes.map((e) => e.max - e.min);
  assert.deepEqual(rec, [300, 130, 110, 180, 360]);
  assert.deepEqual(CFG.ejes.map((e) => e.vmax), [120, 72, 109, 100, 163]);
  assert.ok(CIN.dentroDeLimites(CFG.origen));
});
