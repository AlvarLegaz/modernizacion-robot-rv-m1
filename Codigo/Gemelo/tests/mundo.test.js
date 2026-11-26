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
  c.ponerVeto((q, tl) => w.bloquea(q, tl));         // la mesa y la base son sólidas
  const avanzar = (ms) => { for (let t = 0; t < ms; t += 10) { c.avanzar(10); const r = w.paso(10, c.estado()); eventos.push(...r.nuevas); } };
  const reposo = () => { let t = 0; while ((c.estado().ocupado || c.estado().cola) && t < 120000) { avanzar(10); t += 10; } };
  const ir = (x, y, z) => { c.enviar(`MP ${x},${y},${z},-90,0`); reposo(); assert.equal(c.estado().err, 0, `MP ${x},${y},${z}: ${c.estado().motivoError}`); };
  const cmd = (l) => { c.enviar(l); reposo(); };
  c.enviar('NT'); reposo();
  return { c, w, eventos, ir, cmd, avanzar, reposo };
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

test('la mesa es sólida: el robot se queda donde toca, avisa una vez y no da error', () => {
  const m = montar();
  m.cmd('GO');
  m.ir(330, 0, 60);
  m.eventos.length = 0;
  m.c.enviar('MP 330,0,-30,-90,0'); m.reposo();
  const mesa = m.eventos.filter((e) => e.piezas[1] === 'mesa');
  assert.equal(mesa.length, 1, 'un solo aviso: ' + JSON.stringify(m.eventos));
  assert.equal(m.c.estado().err, 0, 'no genera error de la controladora');
  const z = m.c.estado().pose.z;
  assert.ok(z > -2 && z < 8, 'se queda sobre la mesa, no la atraviesa: z = ' + z);
  m.avanzar(500);
  assert.equal(m.c.estado().pose.z, z, 'sigue parado');
  m.ir(330, 0, 60); m.avanzar(300);
  m.c.enviar('MP 330,0,-30,-90,0'); m.reposo();
  assert.equal(m.eventos.filter((e) => e.piezas[1] === 'mesa').length, 2, 'vuelve a avisar al separarse y chocar otra vez');
});

test('el cubo suelto se empuja y sale despedido; la mesita se desplaza y se lleva lo que tiene encima', () => {
  const m = montar();
  m.cmd('GO');
  // pasa la mano a baja altura por el cubo, desde un lado
  m.ir(CUBO.inicio.x, CUBO.inicio.y + 90, 12);
  m.eventos.length = 0;
  const antes = m.w.estado().cubo;
  m.c.enviar(`MP ${CUBO.inicio.x},${CUBO.inicio.y - 20},12,-90,0`); m.reposo(); m.avanzar(1500);
  const d = m.w.estado().cubo;
  assert.ok(Math.hypot(d.x - antes.x, d.y - antes.y) > 20, 'el cubo se ha movido: ' + JSON.stringify([antes, d]));
  assert.ok(m.eventos.some((e) => e.piezas[1] === 'cubo'), 'avisa: ' + JSON.stringify(m.eventos));
  assert.equal(m.c.estado().err, 0);

  const n = montar();
  n.cmd('GO'); n.w.recolocar();
  n.ir(MES.x, MES.y + 120, 20);
  const m0 = n.w.estado().mesita;
  n.c.enviar(`MP ${MES.x},${MES.y - 40},20,-90,0`); n.reposo(); n.avanzar(500);
  const m1 = n.w.estado().mesita;
  assert.ok(Math.abs(m1.y - m0.y) > 20, 'la mesita se desplaza: ' + JSON.stringify([m0, m1]));
  assert.ok(n.eventos.some((e) => e.piezas[1] === 'mesita'));
});

test('el cubo que está sobre la mesita se mueve con ella y cae si se empuja fuera', () => {
  const m = montar();
  m.cmd('GO'); m.ir(CUBO.inicio.x, CUBO.inicio.y, 4.5); m.cmd('GC');
  m.ir(CUBO.inicio.x, CUBO.inicio.y, 100); m.ir(MES.x, MES.y, 100); m.ir(MES.x, MES.y, MES.alto + 4.5);
  m.cmd('GO'); m.ir(MES.x, MES.y, 120); m.avanzar(1500);
  assert.ok(Math.abs(m.w.estado().cubo.z - (MES.alto + CUBO.lado / 2)) < 0.01, 'en la mesita');
  m.ir(MES.x + 90, MES.y, 120); m.ir(MES.x + 90, MES.y, 20);
  m.c.enviar(`MP ${MES.x - 40},${MES.y},20,-90,0`); m.reposo(); m.avanzar(2500);
  const e = m.w.estado();
  assert.ok(e.mesita.x < MES.x - 5, 'la mesita ha sido desplazada: ' + JSON.stringify(e.mesita));
  assert.ok(Math.abs(e.cubo.x - e.mesita.x) < 80, 'el cubo viaja con ella o cae a su lado: ' + JSON.stringify(e));
});

test('la base es sólida: el robot no entra en ella y se avisa', () => {
  const CIN = require('../js/modelo/cinematica');
  const w = crearMundo({ config: CFG, escena: ESC });
  const sol = CIN.ik({ x: 80, y: 0, z: 100, p: -30, r: 0 }, CFG.geometria.herramienta_defecto, CFG.origen, { sinLimites: true });
  assert.ok(sol.q, 'solución sin límites');
  assert.equal(w.bloquea(sol.q, CFG.geometria.herramienta_defecto), true, 'la postura atraviesa la base');
  const r = w.paso(10, { q: sol.q, tl: CFG.geometria.herramienta_defecto, apertura: 1, pinza: 'abierta', pose: CIN.fk(sol.q, CFG.geometria.herramienta_defecto) });
  assert.ok(r.nuevas.some((e) => e.piezas[1] === 'base'), JSON.stringify(r));
});

test('programas: limpiar, validar, JSON de intercambio y almacén', () => {
  const P = require('../js/modelo/programa');
  const { parsear } = require('../js/modelo/controladora');
  assert.deepEqual(P.limpiar('NT\n\n# comentario\nSP 5 ; velocidad\n  GO  \r\n'), ['NT', 'SP 5', 'GO']);
  assert.equal(P.validar('NT\nGO', parsear).ok, true);
  const v = P.validar('NT\nXX 1\n# nada\nSP 99x', parsear);
  assert.deepEqual(v.errores.map((e) => e.n), [2, 4]);
  assert.equal(P.validar('# solo comentarios', parsear).ok, false);

  const prog = { nombre: 'Prueba', descripcion: 'd', ciclico: false, lineas: ['NT', 'GO'] };
  const json = P.aJSON(prog);
  const d = JSON.parse(json);
  assert.equal(d.formato, 'rvm1-programa'); assert.equal(d.version, 1);
  const r = P.deJSON(json, parsear);
  assert.deepEqual(r.errores, []); assert.deepEqual(r.programas, [prog]);
  assert.equal(P.deJSON('{no json', parsear).programas.length, 0);
  assert.match(P.deJSON('{"nombre":"x"}', parsear).errores[0], /falta/);
  assert.match(P.deJSON(JSON.stringify({ nombre: 'M', lineas: ['NT', 'FOO 1'] }), parsear).errores[0], /línea 2/);
  assert.match(P.deJSON(JSON.stringify({ formato: 'otro', nombre: 'M', lineas: ['NT'] }), parsear).errores[0], /formato/);
  const lote = P.deJSON(JSON.stringify({ programas: [prog, { nombre: 'B', lineas: 'NT\nGC' }] }), parsear);
  assert.equal(lote.programas.length, 2); assert.equal(lote.programas[1].ciclico, true); assert.deepEqual(lote.programas[1].lineas, ['NT', 'GC']);

  const mem = {}; const st = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = v; } };
  const al = P.crearAlmacen(st);
  assert.equal(al.listar().length, 0);
  al.guardar(prog); al.guardar({ nombre: 'B', lineas: ['NT'] }); al.guardar(Object.assign({}, prog, { lineas: ['NT', 'GC'] }));
  assert.equal(al.listar().length, 2); assert.deepEqual(al.obtener('Prueba').lineas, ['NT', 'GC']);
  al.borrar('B'); assert.equal(al.listar().length, 1);
  assert.equal(P.crearAlmacen({ getItem: () => '{roto', setItem() {} }).listar().length, 0, 'JSON roto en el almacén: lista vacía');
});

test('preprograma cíclico: coge el cubo, lo deja en la mesita, vuelve al origen y lo devuelve a la mesa, sin colisiones ni errores', () => {
  const { crearPrograma, cicloCubo } = require('../js/modelo/programa');
  const c = crearControladora();
  const w = crearMundo({ config: CFG, escena: ESC });
  c.ponerVeto((q, tl) => w.bloquea(q, tl));
  const p = crearPrograma({ controladora: c, lineas: cicloCubo(ESC) });
  const colisiones = [];
  p.iniciar();
  let t = 0, enMesita = false;
  while (p.estado().vueltas < 2 && p.estado().activo && t < 600000) {
    p.tick(); c.avanzar(10); const r = w.paso(10, c.estado()); colisiones.push(...r.nuevas);
    const q = w.estado().cubo;
    if (!q.agarrado && !q.cayendo && Math.abs(q.z - (MES.alto + CUBO.lado / 2)) < 0.01) enMesita = true;
    t += 10;
  }
  assert.equal(p.estado().motivoParada, null, 'no se detuvo: ' + p.estado().motivoParada);
  assert.equal(p.estado().vueltas, 2, 'dos vueltas completas');
  assert.ok(enMesita, 'el cubo se dejó en la mesita');
  const f = w.estado().cubo;
  assert.ok(Math.abs(f.x - CUBO.inicio.x) < 1 && Math.abs(f.y - CUBO.inicio.y) < 1 && Math.abs(f.z - CUBO.lado / 2) < 0.01, 'termina en su sitio: ' + JSON.stringify(f));
  assert.equal(colisiones.length, 0, JSON.stringify(colisiones));
  assert.equal(c.estado().err, 0);
});
