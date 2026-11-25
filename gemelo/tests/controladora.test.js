'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const CFG = require('../js/modelo/config_rvm1');
const { crearControladora, parsear } = require('../js/modelo/controladora');
const CIN = require('../js/modelo/cinematica');

const cerca = (a, b, tol, txt) => assert.ok(Math.abs(a - b) <= tol, `${txt || ''} ${a} ≠ ${b}`);
function correr(c, ms, paso) { paso = paso || 10; for (let t = 0; t < ms; t += paso) c.avanzar(paso); }
function hastaReposo(c, max) { let t = 0; while ((c.estado().ocupado || c.estado().cola) && t < (max || 60000)) { c.avanzar(10); t += 10; } return t; }
function referenciar(c) { c.enviar('NT'); hastaReposo(c); assert.equal(c.estado().referenciado, true); }
function er(c) { let r = null; c.enviar('ER', (x) => { r = x; }); hastaReposo(c); return r; }

test('parsear: sintaxis aceptada y rechazada', () => {
  assert.deepEqual(parsear('dj 1,10').args, [1, 10]);
  assert.deepEqual(parsear('DJ 1, -2.5').args, [1, -2.5]);
  assert.deepEqual(parsear('MO 3,C').args, [3, 'C']);
  assert.deepEqual(parsear('SP 4,H').args, [4, 'H']);
  assert.equal(parsear('SP4').ok, true);
  assert.equal(parsear('DJ 1.5,10').ok, false);
  assert.equal(parsear('DJ 1').ok, false);
  assert.equal(parsear('XX').ok, false);
  assert.equal(parsear('NT 1').ok, false);
  assert.equal(parsear('').ok, false);
});

test('arranque: sin referenciar, ER=0, SP por defecto', () => {
  const c = crearControladora();
  const e = c.estado();
  assert.equal(e.referenciado, false); assert.equal(e.err, 0); assert.equal(e.sp, CFG.sp_defecto);
});

test('NT referencia y lleva al origen en el tiempo configurado', () => {
  const c = crearControladora();
  c.enviar('DJ 1,30'); hastaReposo(c);
  c.enviar('NT');
  correr(c, 100);
  assert.equal(c.estado().referenciado, false, 'aún no ha terminado');
  const t = hastaReposo(c);
  assert.ok(t + 100 >= CFG.duracion_nt_ms - 20);
  assert.equal(c.estado().referenciado, true);
  c.estado().q.forEach((v, i) => cerca(v, CFG.origen[i], 1e-9));
});

test('DJ mueve un eje interpolado en el tiempo y respeta la velocidad del eje', () => {
  const c = crearControladora();
  c.enviar('SP 9');
  c.enviar('DJ 1,60');
  const q0 = CFG.arranque[0];
  correr(c, 50);
  const medio = c.estado().q[0];
  assert.ok(medio > q0 && medio < q0 + 60, 'interpolado');
  const t = hastaReposo(c) + 50;
  cerca(c.estado().q[0], q0 + 60, 1e-9);
  // 60° a 120 °/s = 0,5 s de media; con perfil coseno, pico = 120 °/s → 0,5·π/2 s
  cerca(t, 500 * Math.PI / 2, 15, 'duración');
});

test('SP cambia la duración: SP 0 es 10 veces más lento que SP 9 (tabla provisional)', () => {
  const dur = (sp) => { const c = crearControladora(); c.enviar('SP ' + sp); c.enviar('DJ 5,90'); return hastaReposo(c); };
  cerca(dur(0) / dur(9), 10, 0.2);
});

test('DJ fuera de límites → error de modo II y no se mueve', () => {
  const c = crearControladora();
  c.enviar('DJ 1,400');
  hastaReposo(c);
  assert.equal(c.estado().err, 2);
  assert.equal(c.estado().motivoError, 'limite_articular');
  cerca(c.estado().q[0], CFG.arranque[0], 1e-12);
});

test('comando no válido → modo II; en error se ignoran los movimientos hasta RS (S5)', () => {
  const c = crearControladora();
  c.enviar('ZZ 1');
  assert.equal(er(c), '2');
  c.enviar('DJ 1,10'); hastaReposo(c);
  cerca(c.estado().q[0], CFG.arranque[0], 1e-12, 'ignorado en error');
  c.enviar('RS');
  assert.equal(er(c), '0');
  c.enviar('DJ 1,10'); hastaReposo(c);
  cerca(c.estado().q[0], CFG.arranque[0] + 10, 1e-9);
});

test('cartesiano sin referenciar → modo II (DS y MP)', () => {
  for (const l of ['DS 0,0,-10', 'MP 250,0,300,-90,0']) {
    const c = crearControladora();
    c.enviar(l);
    assert.equal(er(c), '2', l);
    assert.equal(c.estado().motivoError, 'no_referenciado');
  }
});

test('S2: DJ antes de NT se acepta (supuesto configurable)', () => {
  const c = crearControladora();
  c.enviar('DJ 2,-5'); hastaReposo(c);
  assert.equal(c.estado().err, 0);
  const cfg = JSON.parse(JSON.stringify(CFG)); cfg.supuestos.jog_articular_sin_nt = false;
  const c2 = crearControladora({ config: cfg });
  c2.enviar('DJ 2,-5'); hastaReposo(c2);
  assert.equal(c2.estado().err, 2);
});

test('DS: recta incremental; la punta sigue una línea y conserva P y R', () => {
  const c = crearControladora(); referenciar(c);
  c.enviar('MP 220,0,300,-90,0'); hastaReposo(c);
  const p0 = c.estado().pose;
  c.enviar('DS 40,30,-50');
  let maxDesv = 0;
  for (let k = 0; k < 400 && c.estado().ocupado; k++) {
    c.avanzar(5);
    const p = c.estado().pose;
    // distancia del punto a la recta p0 → p0+d
    const d = [40, 30, -50], L = Math.hypot(...d);
    const v = [p.x - p0.x, p.y - p0.y, p.z - p0.z];
    const proy = (v[0] * d[0] + v[1] * d[1] + v[2] * d[2]) / L;
    const perp = Math.sqrt(Math.max(0, v[0] ** 2 + v[1] ** 2 + v[2] ** 2 - proy * proy));
    maxDesv = Math.max(maxDesv, perp);
    cerca(p.p, p0.p, 1e-6, 'pitch constante');
  }
  hastaReposo(c);
  const p1 = c.estado().pose;
  cerca(p1.x, p0.x + 40, 1e-6); cerca(p1.y, p0.y + 30, 1e-6); cerca(p1.z, p0.z - 50, 1e-6);
  assert.ok(maxDesv < 0.5, 'desviación de la recta ' + maxDesv);
});

test('MP inalcanzable → modo II sin moverse', () => {
  const c = crearControladora(); referenciar(c);
  const q = c.estado().q;
  c.enviar('MP 900,0,300,0,0');
  assert.equal(er(c), '2');
  assert.deepEqual(c.estado().q, q);
});

test('MP alcanza la pose pedida y WH la devuelve con el formato +x.x', () => {
  const c = crearControladora(); referenciar(c);
  c.enviar('MP 220,-80,250,-90,30'); hastaReposo(c);
  let r; c.enviar('WH', (x) => { r = x; }); hastaReposo(c);
  assert.equal(r, '+220.0,-80.0,+250.0,-90.0,+30.0');
});

test('S1: ER no responde hasta acabar el movimiento anterior', () => {
  const c = crearControladora();
  let r = null, tResp = null, t = 0;
  c.enviar('DJ 1,50');
  c.enviar('ER', (x) => { r = x; tResp = t; });
  while (r === null && t < 10000) { c.avanzar(10); t += 10; }
  assert.equal(r, '0');
  assert.equal(c.estado().ocupado, false);
  assert.ok(tResp > 100);
});

test('HE / MO: guarda y vuelve a una posición; MO a una posición no definida → modo II', () => {
  const c = crearControladora(); referenciar(c);
  c.enviar('MP 220,-80,250,-90,10'); hastaReposo(c);
  c.enviar('HE 5');
  c.enviar('MP 250,50,300,-70,0'); hastaReposo(c);
  c.enviar('MO 5'); hastaReposo(c);
  const p = c.estado().pose;
  cerca(p.x, 220, 1e-6); cerca(p.y, -80, 1e-6); cerca(p.z, 250, 1e-6);
  assert.deepEqual(c.estado().posiciones.map((x) => x.n), [5]);
  c.enviar('MO 6');
  assert.equal(er(c), '2');
});

test('PD + MO con pinza: MO n,C cierra al llegar', () => {
  const c = crearControladora(); referenciar(c);
  c.enviar('PD 2,250,0,280,-90,0');
  c.enviar('MO 2,C'); hastaReposo(c);
  assert.equal(c.estado().pinza, 'cerrada');
  cerca(c.estado().pose.z, 280, 1e-6);
});

test('GO / GC: la pinza se anima y queda en la orden dada', () => {
  const c = crearControladora();
  c.enviar('GC'); c.avanzar(CFG.pinza_ms / 2);
  const a = c.estado().apertura; assert.ok(a > 0 && a < 1);
  hastaReposo(c);
  assert.equal(c.estado().apertura, 0); assert.equal(c.estado().pinza, 'cerrada');
});

test('TL cambia la punta sin mover los ejes', () => {
  const c = crearControladora(); referenciar(c);
  const z0 = c.estado().pose.z;
  c.enviar('TL 50');
  cerca(c.estado().pose.z, z0 + (CFG.geometria.herramienta_defecto - 50), 1e-9);
  c.enviar('TL 900');
  assert.equal(er(c), '2');
});

test('error de modo I inyectado: pierde la referencia, frenos, vacía la entrada; RS y NT lo recuperan', () => {
  const c = crearControladora(); referenciar(c);
  c.enviar('DJ 1,40');
  c.enviar('DJ 1,40');
  c.avanzar(30);
  c.inyectarErrorModoI('prueba');
  const e = c.estado();
  assert.equal(e.err, 1); assert.equal(e.referenciado, false); assert.equal(e.frenos, true);
  assert.equal(e.ocupado, false); assert.equal(e.cola, 0);
  c.enviar('RS'); referenciar(c);
  assert.equal(c.estado().err, 0);
});

test('cable desconectado: las líneas se pierden', () => {
  const c = crearControladora();
  c.ponerConectado(false);
  assert.equal(c.enviar('DJ 1,10'), false);
});

test('determinismo: misma secuencia → mismo resultado', () => {
  const run = () => { const c = crearControladora(); ['NT', 'SP 7', 'DJ 2,-20', 'DS 10,20,30', 'MJ 5,5,5,5,5'].forEach((l) => c.enviar(l)); hastaReposo(c); return JSON.stringify(c.estado()); };
  assert.equal(run(), run());
});

test('fk de la postura final coincide con WH', () => {
  const c = crearControladora(); referenciar(c);
  const e = c.estado();
  const p = CIN.fk(e.q, e.tl);
  assert.deepEqual(p, e.pose);
});
