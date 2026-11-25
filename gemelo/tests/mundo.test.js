'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const CFG = require('../js/modelo/config_rvm1');
const ESC = require('../js/modelo/config_escena');
const { crearControladora } = require('../js/modelo/controladora');
const { crearMundo } = require('../js/modelo/mundo');

function montar() {
  const c = crearControladora();
  const w = crearMundo({ config: CFG, escena: ESC });
  const eventos = [];
  const avanzar = (ms) => { for (let t = 0; t < ms; t += 10) { c.avanzar(10); const r = w.paso(10, c.estado()); eventos.push(...r.nuevas); } };
  const reposo = () => { let t = 0; while ((c.estado().ocupado || c.estado().cola) && t < 120000) { avanzar(10); t += 10; } };
  const ir = (x, y, z) => { c.enviar(`MP ${x},${y},${z},-90,0`); reposo(); assert.equal(c.estado().err, 0, `MP ${x},${y},${z}: ${c.estado().motivoError}`); };
  const cmd = (l) => { c.enviar(l); reposo(); };
  c.enviar('NT'); reposo();
  return { c, w, eventos, ir, cmd, avanzar };
}
const { cubo: CUBO, mesita: MES } = ESC;

test('coger y dejar el cubo sobre la mesita sin colisiones', () => {
  const m = montar();
  m.cmd('GO');
  m.ir(CUBO.inicio.x, CUBO.inicio.y, 90);
  m.ir(CUBO.inicio.x, CUBO.inicio.y, 4.5);
  assert.equal(m.w.estado().cubo.agarrado, false);
  m.cmd('GC');
  assert.equal(m.w.estado().cubo.agarrado, true, 'el cubo queda sujeto');
  m.ir(CUBO.inicio.x, CUBO.inicio.y, 100);
  assert.ok(m.w.estado().cubo.z > 100, 'el cubo sube con la pinza');
  m.ir(MES.x, MES.y, 100);
  const e = m.w.estado().cubo;
  assert.ok(Math.abs(e.x - MES.x) < 1 && Math.abs(e.y - MES.y) < 1, 'el cubo viaja con la pinza');
  m.ir(MES.x, MES.y, MES.alto + 4.5);
  m.cmd('GO');
  m.avanzar(2000);
  const f = m.w.estado().cubo;
  assert.equal(f.agarrado, false);
  assert.ok(Math.abs(f.z - (MES.alto + CUBO.lado / 2)) < 0.01, 'cae sobre la mesita: z = ' + f.z);
  assert.equal(m.eventos.length, 0, 'sin colisiones: ' + JSON.stringify(m.eventos));
});

test('al abrir fuera de la mesita el cubo cae a la mesa', () => {
  const m = montar();
  m.cmd('GO'); m.ir(CUBO.inicio.x, CUBO.inicio.y, 4.5); m.cmd('GC');
  m.ir(CUBO.inicio.x, CUBO.inicio.y, 80); m.ir(330, 0, 80);
  m.cmd('GO'); m.avanzar(2000);
  assert.ok(Math.abs(m.w.estado().cubo.z - CUBO.lado / 2) < 0.01);
});

test('cerrar la pinza lejos del cubo no lo agarra; recolocar lo devuelve', () => {
  const m = montar();
  m.cmd('GO'); m.ir(330, 60, 60); m.cmd('GC');
  assert.equal(m.w.estado().cubo.agarrado, false);
  m.w.recolocar();
  assert.equal(m.w.estado().cubo.x, CUBO.inicio.x);
});

test('colisión con la mesa: avisa una vez y no se repite mientras siga el contacto', () => {
  const m = montar();
  m.cmd('GO');
  m.ir(330, 0, 60);
  m.eventos.length = 0;
  m.c.enviar('MP 330,0,-30,-90,0'); m.avanzar(3000);
  const mesa = m.eventos.filter((e) => e.piezas[1] === 'mesa');
  assert.equal(mesa.length, 1, 'un solo aviso: ' + JSON.stringify(m.eventos));
  assert.equal(m.c.estado().err, 0, 'no genera error de la controladora');
  m.ir(330, 0, 60); m.avanzar(500);
  m.c.enviar('MP 330,0,-30,-90,0'); m.avanzar(3000);
  assert.equal(m.eventos.filter((e) => e.piezas[1] === 'mesa').length, 2, 'vuelve a avisar al separarse y chocar');
});

test('colisión con la mesita y con el cubo suelto', () => {
  const m = montar();
  m.cmd('GO');
  m.ir(MES.x, MES.y, 150);
  m.eventos.length = 0;
  m.c.enviar(`MP ${MES.x},${MES.y},${MES.alto - 10},-90,0`); m.avanzar(3000);
  assert.ok(m.eventos.some((e) => e.piezas[1] === 'mesita'), JSON.stringify(m.eventos));
  const n = montar();
  n.cmd('GO'); n.ir(CUBO.inicio.x, CUBO.inicio.y, 90); n.eventos.length = 0;
  n.c.enviar(`MP ${CUBO.inicio.x},${CUBO.inicio.y},-15,-90,0`); n.avanzar(3000);
  assert.ok(n.eventos.some((e) => e.piezas[1] === 'mesa'), JSON.stringify(n.eventos));
});

test('la pinza contra la base avisa (estado sintético dentro del pedestal)', () => {
  const CIN = require('../js/modelo/cinematica');
  const w = crearMundo({ config: CFG, escena: ESC });
  const sol = CIN.ik({ x: 80, y: 0, z: 100, p: -30, r: 0 }, CFG.geometria.herramienta_defecto, CFG.origen, { sinLimites: true });
  assert.ok(sol.q, 'solución sin límites');
  const r = w.paso(10, { q: sol.q, tl: CFG.geometria.herramienta_defecto, apertura: 1, pinza: 'abierta', pose: CIN.fk(sol.q, CFG.geometria.herramienta_defecto) });
  assert.ok(r.nuevas.some((e) => e.piezas[1] === 'base'), JSON.stringify(r));
});
