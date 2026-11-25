// Prueba de la interfaz en Chrome (opcional; no forma parte de `node --test`): ENABLE conmutado, jog, STOP, WORLD, HE/MO.
// Requiere puppeteer-core instalado FUERA del repositorio y Chrome:
//   cd /tmp/deps && npm install puppeteer-core@23
//   (en gemelo/) python3 -m http.server 8765 --bind 127.0.0.1 &
//   NODE_PATH=/tmp/deps/node_modules node gemelo/herramientas/prueba_navegador.js http://127.0.0.1:8765/
'use strict';
const puppeteer = require('puppeteer-core');
const assert = require('node:assert/strict');

const URL_BASE = process.argv[2] || 'http://127.0.0.1:8765/';
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = 0;
const paso = (t) => { ok++; console.log('ok', ok, '-', t); };

(async () => {
  const nav = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const pag = await nav.newPage();
  await pag.setViewport({ width: 1180, height: 820, hasTouch: true });
  const errores = [];
  pag.on('pageerror', (e) => errores.push(String(e)));
  await pag.goto(URL_BASE + 'index.html?id=07', { waitUntil: 'load' });
  await pag.waitForFunction(() => window.gemelo && window.gemelo.ctrl);
  const est = () => pag.evaluate(() => window.gemelo.ctrl.estado());
  const alarma = () => pag.$eval('.pd-alarma', (e) => e.textContent);
  const centro = async (sel) => { const b = await (await pag.$(sel)).boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const cdp = await pag.createCDPSession();
  // CDP: touchPoints es el conjunto de dedos activos; touchEnd va vacío y suelta todos
  const toque = (type, puntos) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: puntos.map((p, i) => ({ x: p.x, y: p.y, id: p.id == null ? i : p.id })) });

  assert.match(await pag.$eval('[data-k="topic"]', (e) => e.textContent), /rvm1\/gemelo\/07\//); paso('?id=07 fija el id del gemelo');
  assert.equal((await est()).sp, 2); paso('SP 2 al conectar el pendant');

  // jog sin habilitación
  const jp1 = await centro('.pd-jogk[data-eje="0"][data-signo="1"]');
  await toque('touchStart', [jp1]); await toque('touchEnd', []);
  assert.match(await alarma(), /no habilitado/); paso('jog sin ENABLE: rechazado con alarma');
  assert.equal((await est()).q[0], 0);

  // ENABLE conmuta: una pulsación habilita, otra deshabilita (no hay que mantenerlo)
  const habilitado = async (v) => { const on = await pag.$eval('.pd-enable', (e) => e.classList.contains('on')); if (on !== v) await pag.click('.pd-enable'); };
  await pag.click('.pd-enable');
  assert.equal(await pag.$eval('.pd-enable', (e) => e.classList.contains('on')), true);
  assert.match(await pag.$eval('.pd-enable', (e) => e.textContent), /HABILITADO/); paso('ENABLE (una pulsación) habilita: LED y botón en verde con HABILITADO');
  await toque('touchStart', [jp1]); await toque('touchEnd', []);
  await espera(800);
  assert.ok(Math.abs((await est()).q[0] - 1) < 1e-6, 'J1 +1°'); paso('ENABLE habilitado + jog +J1 mueve 1° (STEP) sin mantener nada');

  // modo CONT: al deshabilitar (segunda pulsación) se para el jog
  await pag.click('.pd-fn .pd-key:nth-child(2)');               // STEP → CONT
  await toque('touchStart', [jp1]);
  await espera(900);
  const qMedio = (await est()).q[0];
  assert.ok(qMedio > 2, 'avanza en continuo: ' + qMedio);
  await pag.click('.pd-enable');                                 // deshabilita
  await espera(700);
  const q1 = (await est()).q[0];
  await espera(700);
  assert.equal((await est()).q[0], q1, 'parado tras deshabilitar');
  await toque('touchEnd', []);
  paso('CONT: deshabilitar ENABLE detiene el jog');
  await pag.click('.pd-fn .pd-key:nth-child(2)');               // vuelve a STEP

  // ESPACIO + tecla Q en escritorio
  const qAntes = (await est()).q[0];
  await pag.keyboard.press(' ');                                 // ESPACIO conmuta: habilita
  await pag.keyboard.down('q'); await pag.keyboard.up('q');
  await espera(600);
  assert.ok(Math.abs((await est()).q[0] - qAntes - 1) < 1e-6); paso('ESPACIO (habilita) + Q: jog +J1 con teclado');

  // WORLD bloqueado sin referenciar
  await pag.click('.pd-fn .pd-key:nth-child(1)');
  assert.match(await alarma(), /WORLD no disponible/); paso('WORLD bloqueado sin referenciar');

  // HOME
  await pag.click('.pd-fk .pd-fkey:nth-child(1)');
  await pag.waitForFunction(() => window.gemelo.ctrl.estado().referenciado, { timeout: 15000 });
  await espera(200);
  assert.match(await pag.$eval('.pd-barra', (e) => e.textContent), /REF OK/); paso('HOME (F1): REF OK');
  await pag.click('.pd-fn .pd-key:nth-child(1)');
  const rot = await pag.$$eval('.pd-jogk', (bs) => bs.map((b) => b.textContent));
  assert.deepEqual(rot.slice(0, 2), ['−X(J1)', '+X(J1)']);
  assert.deepEqual(rot.slice(6, 8), ['−J4art.', '+J4art.']); paso('WORLD: rótulos −X (J1) y J4/J5 "art."');

  // jog WORLD −Z 1 mm
  const z0 = (await est()).pose.z;
  const jz = await centro('.pd-jogk[data-eje="2"][data-signo="-1"]');
  await habilitado(true); await toque('touchStart', [jz]);
  await toque('touchEnd', []);
  await espera(800);
  assert.ok(Math.abs((await est()).pose.z - (z0 - 1)) < 1e-6); paso('WORLD −Z: DS 0,0,-1');

  // override: aviso desde SP 6
  for (let i = 0; i < 4; i++) await pag.click('.pd-fn .pd-key:nth-child(6)');
  assert.match(await alarma(), /Override alto \(SP 6\)/); paso('aviso de override desde SP 6');
  for (let i = 0; i < 4; i++) await pag.click('.pd-fn .pd-key:nth-child(4)');

  // HE 1, mover, MO 1 (con ENABLE)
  await pag.click('.pd-fk .pd-fkey:nth-child(5)');
  await espera(300);
  assert.equal((await est()).posiciones.length, 1); paso('HE 1 guarda el punto (lista)');
  const p1 = (await est()).pose;
  await pag.evaluate(() => window.gemelo.ctrl.enviar('DJ 1,20'));
  await espera(1500);
  await habilitado(false);
  await pag.click('.pd-fk .pd-fkey:nth-child(6)');
  assert.match(await alarma(), /MO: pendant no habilitado/); paso('MO sin ENABLE: rechazado');
  await habilitado(true); await pag.click('.pd-fk .pd-fkey:nth-child(6)');
  await espera(2500);
  assert.ok(Math.abs((await est()).pose.x - p1.x) < 1e-6); paso('MO 1 con ENABLE vuelve al punto');

  // STOP enclavado hasta RESET
  await pag.click('.pd-seta');
  assert.match(await pag.$eval('.pd-barra', (e) => e.textContent), /STOP/);
  await habilitado(false); await pag.keyboard.press(' '); await pag.keyboard.down('q'); await pag.keyboard.up('q');
  assert.match(await alarma(), /STOP activo/); paso('STOP enclavado: no deja hacer jog');
  await pag.click('.pd-fk .pd-fkey:nth-child(2)');
  assert.doesNotMatch(await pag.$eval('.pd-barra', (e) => e.textContent), /STOP/); paso('RESET libera el STOP');

  // pinza
  await pag.click('.pd-fk .pd-fkey:nth-child(4)'); await espera(800);
  assert.equal((await est()).pinza, 'cerrada'); paso('CERRAR (GC)');

  // un programa externo mueve el gemelo: el pendant lo refleja
  await pag.evaluate(() => window.gemelo.ctrl.enviar('DJ 2,-5'));
  await espera(1200);
  const xPend = await pag.$eval('.pd-pos .pd-pos-v', (e) => e.textContent);
  const xMod = (await est()).pose.x;
  assert.equal(xPend, (xMod >= 0 ? '+' : '') + xMod.toFixed(1)); paso('el pendant refleja movimientos hechos por otros');

  // registro
  const n = await pag.evaluate(() => window.gemelo.registro.cuenta());
  assert.ok(n > 5); paso('registro con ' + n + ' eventos');

  assert.deepEqual(errores, []); paso('sin errores de JavaScript');
  await nav.close();
  console.log('\n' + ok + ' comprobaciones correctas');
})().catch((e) => { console.error('FALLO:', e.message); process.exit(1); });
