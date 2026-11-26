// Prueba de extremo a extremo del gemelo con un Mosquitto LOCAL (nunca contra un broker de producción ni el robot real).
// Abre el gemelo en Chrome, lo conecta al broker por WebSocket y, desde Node, hace de "programa del alumno" por TCP.
// También simula la placa real publicando posicion/mundo en rvm1/real/01/ SOLO en este broker local, para los modos.
//
// Requisitos (fuera del repo): npm install puppeteer-core@23 mqtt@5 en /tmp/deps; mosquitto local:
//   listener 18830 127.0.0.1 / listener 19001 127.0.0.1 + protocol websockets / allow_anonymous true
//   NODE_PATH=/tmp/deps/node_modules node Codigo/Gemelo/herramientas/prueba_mosquitto.js http://127.0.0.1:8765/ ws://127.0.0.1:19001 mqtt://127.0.0.1:18830
'use strict';
const puppeteer = require('puppeteer-core');
const mqtt = require('mqtt');
const assert = require('node:assert/strict');

const [URL_WEB = 'http://127.0.0.1:8765/', URL_WS = 'ws://127.0.0.1:19001', URL_TCP = 'mqtt://127.0.0.1:18830'] = process.argv.slice(2);
for (const u of [URL_WS, URL_TCP]) if (!/127\.0\.0\.1|localhost/.test(u)) { console.error('Solo se permite un broker local.'); process.exit(2); }
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = 0;
const paso = (t) => { ok++; console.log('ok', ok, '-', t); };

(async () => {
  // ---- "programa del alumno" (TCP)
  const cli = mqtt.connect(URL_TCP, { clientId: 'prueba-alumno-' + Date.now() });
  await new Promise((r) => cli.on('connect', r));
  const msgs = [];
  cli.on('message', (t, b, p) => { let d; try { d = JSON.parse(b.toString()); } catch (e) { d = b.toString(); } msgs.push({ t, d, retain: p.retain, qos: p.qos }); });
  await new Promise((r) => cli.subscribe(['rvm1/gemelo/07/#', 'rvm1/real/#'], { qos: 1 }, r));
  // limpieza de retenidos de ejecuciones anteriores
  for (const t of ['online', 'actuadores', 'posicion/mundo']) { cli.publish('rvm1/gemelo/07/' + t, '', { retain: true }); cli.publish('rvm1/real/01/' + t, '', { retain: true }); }
  await espera(300); msgs.length = 0;
  let n = 0;
  const orden = (cmd, args, extra) => { const id = 'al-' + (++n); cli.publish('rvm1/gemelo/07/comandos', JSON.stringify(Object.assign({ id, ts: Date.now(), destino: 'gemelo', cmd, args: args || {} }, extra || {})), { qos: 1 }); return id; };
  const acks = (id) => msgs.filter((m) => m.t === 'rvm1/gemelo/07/comandos/ack' && m.d.id === id).map((m) => m.d);
  const esperaAck = async (id, est, max) => { for (let t = 0; t < (max || 15000); t += 50) { if (acks(id).some((a) => a.estado === est)) return acks(id); await espera(50); } throw new Error('sin ACK ' + est + ' para ' + id + ': ' + JSON.stringify(acks(id))); };

  // ---- gemelo en el navegador
  const nav = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const pag = await nav.newPage();
  const errores = []; pag.on('pageerror', (e) => errores.push(String(e)));
  pag.on('dialog', (d) => d.accept());
  await pag.setViewport({ width: 1366, height: 1024 });
  await pag.goto(URL_WEB + 'index.html', { waitUntil: 'load' });
  await pag.waitForFunction(() => window.gemelo);
  await pag.click('.bc-plegar');
  await pag.$eval('[data-c="url"]', (e, v) => { e.value = v; e.dispatchEvent(new Event('change')); }, URL_WS);
  await pag.type('[data-c="usuario"]', 'alumno07');
  assert.equal(await pag.$eval('[data-c="id"]', (e) => e.value), '07'); paso('id deducido del usuario: alumno07 → 07');
  await pag.click('[data-a="conectar"]');
  await pag.waitForFunction(() => /conectado/.test(document.querySelector('[data-k="broker"]').textContent) && !/reconect/.test(document.querySelector('[data-k="broker"]').textContent), { timeout: 10000 });
  await espera(1500);
  const recordado = await pag.evaluate(() => localStorage.getItem('rvm1.gemelo.conexion'));
  assert.ok(recordado.includes('alumno07') && !/contrasena|password/i.test(recordado)); paso('conexión recordada en localStorage sin contraseña');

  const on = msgs.find((m) => m.t === 'rvm1/gemelo/07/online');
  assert.equal(on.d, 'online'); paso('online = "online" (retain)');
  const act = msgs.filter((m) => m.t === 'rvm1/gemelo/07/actuadores');
  assert.ok(act.length >= 1 && act.every((m) => m.qos === 1)); paso('actuadores publicados (QoS 1)');
  const pos = msgs.filter((m) => m.t === 'rvm1/gemelo/07/posicion/mundo');
  assert.ok(pos.length >= 2 && pos.at(-1).d.valida === false); paso('posicion/mundo cada 500 ms, valida=false sin home');

  // ---- comandos del alumno
  let id = orden('jog_mundo', { dx: 0, dy: 0, dz: -5 });
  assert.equal((await esperaAck(id, 'rechazado'))[0].motivo, 'no_referenciado'); paso('jog_mundo sin home → rechazado no_referenciado');
  id = orden('home');
  await esperaAck(id, 'hecho', 20000); paso('home: aceptado → hecho');
  id = orden('jog_mundo', { dx: 0, dy: 0, dz: -10 });
  const a = await esperaAck(id, 'hecho');
  assert.deepEqual(a.map((x) => x.estado), ['aceptado', 'hecho']); assert.equal(a[1].er, 0); paso('jog_mundo: ACK en dos fases, er=0');
  await espera(700);
  const ultPos = msgs.filter((m) => m.t === 'rvm1/gemelo/07/posicion/mundo').at(-1).d;
  assert.equal(ultPos.valida, true);
  const zPend = await pag.$$eval('.pd-pos .pd-pos-v', (v) => v[2].textContent);
  assert.equal(zPend, (ultPos.z >= 0 ? '+' : '') + ultPos.z.toFixed(1)); paso('el pendant (local) refleja el movimiento hecho por el programa externo');
  const dup = { id: 'dup-x', ts: Date.now(), destino: 'gemelo', cmd: 'jog_articular', args: { eje: 1, grados: 5 } };
  cli.publish('rvm1/gemelo/07/comandos', JSON.stringify(dup), { qos: 1 });
  await esperaAck('dup-x', 'hecho');
  const q1 = await pag.evaluate(() => window.gemelo.ctrl.estado().q[0]);
  cli.publish('rvm1/gemelo/07/comandos', JSON.stringify(Object.assign(dup, { ts: Date.now() })), { qos: 1 });
  await espera(1200);
  assert.equal(await pag.evaluate(() => window.gemelo.ctrl.estado().q[0]), q1);
  assert.deepEqual(acks('dup-x').map((x) => x.estado), ['aceptado', 'hecho', 'hecho']); paso('duplicado: no se ejecuta, se reenvía el ACK');
  id = orden('home', {}, { destino: 'real' });
  assert.equal((await esperaAck(id, 'rechazado'))[0].motivo, 'destino'); paso('destino real en topic del gemelo → rechazado destino');
  id = orden('home', {}, { ts: Date.now() + 1000 });
  assert.equal((await esperaAck(id, 'rechazado'))[0].motivo, 'caducado'); paso('v0.3: ts adelantado → caducado');

  // ---- pendant por MQTT al gemelo
  await pag.select('[data-c="destino"]', 'gemelo');
  await espera(500);
  const antes = msgs.length;
  await pag.click('.pd-fk .pd-fkey:nth-child(4)');                       // CERRAR
  await espera(1500);
  const cmdPend = msgs.slice(antes).find((m) => m.t === 'rvm1/gemelo/07/comandos' && m.d.cmd === 'pinza');
  assert.ok(cmdPend && cmdPend.retain === false && cmdPend.qos === 1); paso('pendant → MQTT gemelo: comando pinza publicado (QoS 1, sin retain)');
  assert.equal(acks(cmdPend.d.id).at(-1).estado, 'hecho'); paso('el gemelo de la propia página lo ejecuta (ACK hecho)');
  await pag.select('[data-c="destino"]', 'local');

  // ---- modo SOMBRA (la "placa real" la simula este script, SOLO en el broker local)
  const pubReal = (q) => cli.publish('rvm1/real/01/posicion/mundo', JSON.stringify(Object.assign({ ts: Date.now(), valida: true }, q)), { qos: 0, retain: true });
  await pag.select('[data-c="modo"]', 'sombra');
  await espera(300);
  const g = await pag.evaluate(() => window.gemelo.ctrl.estado().pose);
  pubReal({ x: g.x + 3, y: g.y, z: g.z + 4, pitch: g.p, roll: g.r });
  cli.publish('rvm1/real/01/actuadores', JSON.stringify({ ts: Date.now(), conectado: true, referenciado: true, error: 0, velocidad: 2, pinza: 'abierta', ocupado: false, cola: 0, desfase_ms: 3 }), { qos: 1, retain: true });
  cli.publish('rvm1/real/01/online', 'online', { qos: 1, retain: true });
  await espera(800);
  const lineaModo = await pag.$eval('.pd-modo', (e) => e.textContent);
  assert.match(lineaModo, /Δ real: 5\.0 mm/); paso('SOMBRA: error gemelo–real en el pendant (' + lineaModo + ')');
  assert.equal(await pag.$eval('.pd-barra', (e) => /SOMBRA/.test(e.textContent)), true);
  const regPos = await pag.evaluate(() => window.gemelo.registro.lineas().filter((l) => l.evento === 'pos' && l.destino === 'real'));
  assert.ok(regPos.length >= 1 && regPos[0].real && regPos[0].gemelo && Math.abs(regPos[0].error.dpos_mm - 5) < 0.05); paso('SOMBRA: el JSONL guarda pose real, pose del gemelo y error');
  id = orden('jog_articular', { eje: 1, grados: 2 });
  await esperaAck(id, 'hecho'); paso('SOMBRA: el emulador sigue atendiendo comandos');

  // ---- modo SINCRONIZADO
  await pag.select('[data-c="modo"]', 'sincronizado');
  await espera(600);
  assert.equal(msgs.filter((m) => m.t === 'rvm1/gemelo/07/online').at(-1).d, 'offline'); paso('SINCRONIZADO: el emulador se anuncia offline');
  pubReal({ x: 200, y: 50, z: 300, pitch: -90, roll: 10 });
  await espera(800);
  const ley = await pag.$eval('#leyenda3d', (e) => e.textContent);
  assert.match(ley, /^REAL J/); paso('SINCRONIZADO: el 3D sigue la pose real (' + ley + ')');
  const xp = await pag.$$eval('.pd-pos .pd-pos-v', (v) => v.map((x) => x.textContent));
  assert.deepEqual(xp.slice(0, 3), ['+200.0', '+50.0', '+300.0']); paso('SINCRONIZADO: el pendant muestra la posición real (solo lectura)');
  const antes2 = msgs.length;
  id = orden('jog_articular', { eje: 1, grados: 2 });
  await espera(800);
  assert.equal(msgs.slice(antes2).filter((m) => m.t.endsWith('/ack')).length, 0); paso('SINCRONIZADO: no se atienden comandos del gemelo');
  await pag.select('[data-c="modo"]', 'emulador');
  await espera(800);
  assert.equal(msgs.filter((m) => m.t === 'rvm1/gemelo/07/online').at(-1).d, 'online'); paso('vuelta a EMULADOR: online');

  // ---- nunca publica en rvm1/real salvo comandos (que aquí no se han enviado)
  const realDesdeGemelo = msgs.filter((m) => m.t.startsWith('rvm1/real/') && m.t.endsWith('/comandos'));
  assert.equal(realDesdeGemelo.length, 0); paso('el gemelo no ha publicado comandos en rvm1/real/ (el estado "real" lo simula este script)');

  // ---- LWT: cierre brusco del navegador
  const proc = nav.process();
  proc.kill('SIGKILL');
  let off = null;
  for (let t = 0; t < 30000 && !off; t += 250) { await espera(250); off = msgs.filter((m) => m.t === 'rvm1/gemelo/07/online').at(-1); if (off && off.d !== 'offline') off = null; }
  assert.ok(off, 'LWT offline'); paso('LWT: al matar el navegador el broker publica online = "offline"');

  assert.deepEqual(errores, []); paso('sin errores de JavaScript');
  for (const t of ['online', 'actuadores', 'posicion/mundo']) { cli.publish('rvm1/gemelo/07/' + t, '', { retain: true }); cli.publish('rvm1/real/01/' + t, '', { retain: true }); }
  await espera(200);
  cli.end();
  console.log('\n' + ok + ' comprobaciones correctas');
  process.exit(0);
})().catch((e) => { console.error('FALLO:', e.message); process.exit(1); });
