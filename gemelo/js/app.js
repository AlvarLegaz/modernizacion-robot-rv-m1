// Arranque del gemelo digital: une el modelo headless (controladora + pasarela + registro + observador del real) con las dos
// vistas (3D y pendant) y la barra de conexión. Flujo: comandos → controladora → estado → (3D, pendant, MQTT). Las vistas solo leen.
//
// Modos del gemelo (barra de conexión):
//   emulador     interpreta rvm1/gemelo/<id>/comandos y publica su estado (contrato).
//   sombra       igual que emulador y, además, lee rvm1/real/<idReal>/posicion/mundo y actuadores y dibuja un robot fantasma
//                con la pose real; muestra el error gemelo–real y lo registra (E2).
//   sincronizado el modelo sigue la pose real (no emula): visualización remota del robot real. Mientras dura, el emulador
//                deja de atender comandos y publica online = "offline" en rvm1/gemelo/<id>/online.
// En ningún modo se publica en rvm1/real/... salvo los `comandos` del pendant con destino REAL (permiso de profesor).
import { crearEscena } from './render3d/escena.js';
import { crearModeloRVM1 } from './render3d/modelo_rvm1.js';
import { crearEjes } from './render3d/ejes.js';
import { crearObjetos } from './render3d/objetos.js';
import { crearPendant } from './interfaz/pendant.js';
import { crearBarra } from './interfaz/barra.js';
import { crearEnlaceLocal, crearEnlaceMqtt, crearEnlaceEspejo } from './interfaz/enlaces.js';

const R = window.RVM1;
const CFG = R.config;
const parametros = new URLSearchParams(location.search);

// ------------------------------------------------------------------ modelo headless
const ctrl = R.controladora.crearControladora({ config: CFG });
const registro = R.registro.crearRegistro({ nodo: 'gemelo', destino: 'gemelo' });
let pasarela = null, transporte = null, cliente = null, idActual = null;
let modo = 'emulador', observador = null;

// ------------------------------------------------------------------ reloj y desfase (contrato v0.3, "Relojes")
// desfase: último desfase medido con /hora (null si no hay /hora). correccion: lo que se suma al reloj del navegador
// (0 salvo que config.contrato.corregir_reloj_con_hora sea true).
let desfase = null, correccion = 0, avisadoSinHora = false;
const relojGemelo = () => Date.now() + correccion;
const medidor = R.hora.crearMedidorHora({ url: 'hora', reloj: relojGemelo });
async function medirHora() {
  const r = await medidor.medir(5);
  if (!r) {
    if (!avisadoSinHora) { avisadoSinHora = true; registro.nota({ texto: 'sin ruta /hora: desfase_ms no medido (null)', metodo: null }); }
    return;
  }
  desfase = r.desfase_ms;
  if (CFG.contrato.corregir_reloj_con_hora) correccion += r.desfase_ms;
  registro.nota({ texto: 'desfase estimado con /hora', metodo: 'Cristian (hora_servidor + RTT/2 - hora_local), menor RTT de ' + r.muestras + ' muestras',
    desfase_ms: r.desfase_ms, rtt_ms: r.rtt_ms, correccion_aplicada_ms: correccion });
}

function notaInicial(extra) {
  registro.nota(Object.assign({
    texto: 'inicio de registro del gemelo digital',
    version_codigo: 'gemelo ' + CFG.version_gemelo + ' (commit: anotar a mano si no se sirve desde git)',
    version_contrato: CFG.version_contrato,
    robot: 'gemelo', modo, navegador: navigator.userAgent,
    supuestos: CFG.supuestos,
    reloj: 'reloj del navegador (Date.now)' + (CFG.contrato.corregir_reloj_con_hora ? ' corregido con /hora' : '') + '; desfase medido con /hora si existe',
    t_mono: 'performance.now() en ns; resolución limitada por el navegador'
  }, extra || {}));
}
notaInicial({ broker: null, red: null, operador: null });

ctrl.alEvento((ev) => {
  if (ev.tipo === 'error') registro.ev('estado', { controladora: 'error', er: ev.er, motivo: ev.motivo, linea: ev.linea });
});

function crearPasarelaPara(id) {
  pasarela = R.pasarela.crearPasarela({
    controladora: ctrl, id, destino: 'gemelo', registro, sincronizarReferencia: true,
    reloj: relojGemelo, desfase: () => desfase,
    transporte: { publicar: (t, x, o) => { if (transporte) transporte.publicar(t, x, o); } }
  });
  idActual = id;
}

// ------------------------------------------------------------------ vistas
const vista = document.getElementById('vista3d');
// ?vista=az,el,dist[,x,y,z] (radianes, metros) para fijar la cámara inicial, p. ej. en capturas
const pv = (parametros.get('vista') || '').split(',').map(Number);
const vistaInicial = pv.length >= 3 && pv.every(isFinite) ? Object.assign({ az: pv[0], el: pv[1], dist: pv[2] }, pv.length >= 6 ? { obj: pv.slice(3, 6) } : {}) : undefined;
const escena = crearEscena(vista, { vistaInicial, preservar: parametros.has('captura'), aria: 'Modelo 3D del RV-M1. Arrastra para girar, rueda o pellizco para acercar, dos dedos o botón derecho para desplazar.' });
const robot = crearModeloRVM1(escena.escena, CFG);
const fantasma = crearModeloRVM1(escena.escena, CFG, undefined, { fantasma: true });
fantasma.visible = false;
crearEjes(escena.THREE, escena.escena, { largo: 0.3 });
// escena de prácticas: cubo y mesita (modelo headless en modelo/mundo.js; aquí solo se dibuja)
const mundo = R.mundo.crearMundo({ config: CFG, escena: R.escena });
const objetos = crearObjetos(escena.THREE, escena.escena, R.escena);
document.getElementById('btn-cubo').addEventListener('click', () => { mundo.recolocar(); escena.pedir(); });
// preprograma cargado: ciclo del cubo (js/modelo/programa.js). Corre en la controladora local, igual que un programa externo por MQTT.
const programa = R.programa.crearPrograma({ controladora: ctrl, lineas: R.programa.cicloCubo(R.escena), ciclico: true });
const btnProg = document.getElementById('btn-prog');
btnProg.addEventListener('click', () => {
  if (programa.estado().activo) { programa.parar('parado por el usuario'); return; }
  if (modo === 'sincronizado') return;
  if (pendant.estado.estop) { pendant.alarm('STOP activo: pulsa RESET (F2) antes de lanzar el ciclo.'); return; }
  if (ctrl.estado().err) ctrl.enviar('RS');
  mundo.recolocar(); programa.reiniciarVueltas(); programa.iniciar(); escena.pedir();
});
const avisoEl = document.getElementById('aviso-colision');
let avisoT = 0;
const NOMBRES = { brazo: 'el brazo', antebrazo: 'el antebrazo', mano: 'la mano', dedos: 'la pinza', cubo: 'el cubo', mesa: 'la mesa', mesita: 'la mesita', base: 'la base' };
function avisarColision(piezas) {       // solo advertencia: no detiene el robot ni genera error de la controladora
  const txt = NOMBRES[piezas[0]] + ' con ' + NOMBRES[piezas[1]];
  avisoEl.querySelector('span').textContent = txt;
  avisoEl.classList.add('on'); clearTimeout(avisoT);
  if (!parametros.has('colision')) avisoT = setTimeout(() => avisoEl.classList.remove('on'), 800);      // ?colision=1 (capturas): el aviso se queda
  pendant.alarm('COLISIÓN: ' + txt + ' (el robot no se detiene).');
  registro.ev('colision', { piezas });
}   // referencia visual X (rojo), Y (verde), Z (azul) en el origen de la base
document.getElementById('btn-vista').addEventListener('click', () => escena.vistaInicial());
const leyenda = document.getElementById('leyenda3d');

const pendant = crearPendant(document.getElementById('pendant'));
const enlaceLocal = crearEnlaceLocal(ctrl);
pendant.ponerEnlace(enlaceLocal);

const barra = crearBarra(document.getElementById('barra'), {
  alConectar: conectar,
  alDesconectar: desconectar,
  alDestino: cambiarDestino,
  alModo: cambiarModo,
  alDescargar: descargar,
  alVaciarRegistro: () => { registro.vaciar(); notaInicial(datosRed()); }
}, { idUrl: parametros.get('id') });
crearPasarelaPara(barra.config().id);
medirHora();
setInterval(medirHora, CFG.contrato.periodo_hora_ms);

// ------------------------------------------------------------------ MQTT
let cfgBroker = null;
function datosRed() {
  const c = barra.config();
  return { broker: cfgBroker ? cfgBroker.url : null, usuario_broker: cfgBroker ? cfgBroker.usuario : null, red: 'anotar (aula aislada / otra)', operador: c.operador || null, id_gemelo: idActual, id_real: c.idReal };
}

function conectar(c) {
  if (!window.mqtt) { barra.estadoBroker('error', 'falta lib/mqtt.min.js'); return; }
  desconectar(true);
  cfgBroker = c;
  crearPasarelaPara(c.id);
  barra.estadoBroker('conectando', 'conectando…');
  try {
    transporte = R.transporteMqtt.crearTransporteMqtt({
      url: c.url, usuario: c.usuario, contrasena: c.contrasena,
      clientId: 'rvm1-gemelo-' + c.id + '-' + Math.random().toString(16).slice(2, 10),     // aleatorio: el alumno puede conectar también desde Python
      voluntad: pasarela.voluntad(),
      alConectar: () => {
        barra.estadoBroker('conectado', 'conectado · ' + c.url);
        notaInicial(datosRed());
        medirHora();
        if (modo !== 'sincronizado') { transporte.suscribir([pasarela.temas.comandos]); pasarela.alConectar(); }
        else publicarOffline();
        if (cliente) transporte.suscribir(cliente.temasLectura);
        if (observador) transporte.suscribir(observador.lista);
      },
      alDesconectar: () => { barra.estadoBroker('conectando', 'reconectando…'); pasarela.alDesconectar(); },
      alError: (e) => barra.estadoBroker('error', 'error: ' + (e && e.message ? e.message : e)),
      alMensaje: (topic, texto) => {
        if (pasarela && topic === pasarela.temas.comandos) { if (modo !== 'sincronizado') pasarela.recibir(topic, texto); }
        else if (observador && observador.lista.includes(topic)) observador.recibir(topic, texto);
        if (cliente && cliente.temasLectura.includes(topic)) cliente.recibir(topic, texto);
      }
    });
  } catch (e) {
    transporte = null;
    barra.estadoBroker('error', 'error: ' + e.message);
  }
}

function desconectar(silencioso) {
  if (modo !== 'emulador') { cambiarModo('emulador'); barra.ponerModo('emulador'); }
  if (cliente) cambiarDestino('local');
  if (transporte) { transporte.cerrar({ topic: pasarela.temas.online, payload: 'offline', qos: 1, retain: true }); transporte = null; }
  if (pasarela) pasarela.alDesconectar();
  if (!silencioso) barra.estadoBroker('desconectado', 'sin conectar');
}

function publicarOffline() { if (transporte) transporte.publicar(pasarela.temas.online, 'offline', { qos: 1, retain: true }); }

function cambiarDestino(destino, idReal) {
  if (cliente && transporte) transporte.desuscribir(cliente.temasLectura);
  cliente = null;
  if (destino === 'local' || !transporte) {
    pendant.ponerEnlace(modo === 'sincronizado' && observador ? crearEnlaceEspejo(observador) : enlaceLocal);
    barra.ponerDestino('local');
    return;
  }
  const id = destino === 'real' ? idReal : idActual;
  cliente = R.clienteContrato.crearClienteContrato({
    transporte, destino, id, reloj: relojGemelo, registro: { ev: (e, d) => registro.ev(e, Object.assign({ nodo: 'pendant', destino }, d)) }
  });
  transporte.suscribir(cliente.temasLectura);
  pendant.ponerEnlace(crearEnlaceMqtt(cliente, { transporte }));
}

function cambiarModo(nuevo, idReal) {
  const anterior = modo;
  if (observador && transporte) {
    // no se desuscriben los topics que siga necesitando el pendant (destino REAL con el mismo id)
    const enUso = cliente ? cliente.temasLectura : [];
    transporte.desuscribir(observador.lista.filter((t) => !enUso.includes(t)));
  }
  observador = null;
  modo = nuevo;
  if (nuevo !== 'emulador') {
    observador = R.observadorReal.crearObservadorReal({
      idReal: idReal || barra.config().idReal, reloj: relojGemelo, registro, estadoGemelo: () => ctrl.estado(), modo: () => modo
    });
    if (transporte) transporte.suscribir(observador.lista);
  }
  // el emulador deja de atender comandos en SINCRONIZADO y vuelve a hacerlo al salir
  if (transporte && nuevo === 'sincronizado' && anterior !== 'sincronizado') { transporte.desuscribir([pasarela.temas.comandos]); publicarOffline(); }
  if (transporte && anterior === 'sincronizado' && nuevo !== 'sincronizado') { transporte.suscribir([pasarela.temas.comandos]); pasarela.alConectar(); }
  if (!cliente) pendant.ponerEnlace(nuevo === 'sincronizado' && observador ? crearEnlaceEspejo(observador) : enlaceLocal);
  fantasma.visible = false;
  registro.nota({ texto: 'cambio de modo del gemelo', modo: nuevo, modo_anterior: anterior, id_real: observador ? observador.idReal : null });
}

function descargar(desc, operador) {
  if (operador) registro.nota({ texto: 'descarga del registro', operador });
  const blob = new Blob([registro.jsonl()], { type: 'application/x-ndjson' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = registro.nombreFichero(desc);
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ------------------------------------------------------------------ bucles
// Simulación con setInterval (sigue en segundo plano, aunque el navegador lo ralentice); render con requestAnimationFrame.
let tPrev = performance.now();
setInterval(() => {
  const t = performance.now();
  const dt = Math.min(1000, t - tPrev); tPrev = t;
  ctrl.avanzar(dt);
  if (pasarela && modo !== 'sincronizado') pasarela.tick();
  if (programa.estado().activo) { if (pendant.estado.estop || modo === 'sincronizado') programa.parar('STOP o modo sincronizado'); else programa.tick(); }
  if (modo !== 'sincronizado') for (const c of mundo.paso(dt, ctrl.estado()).nuevas) avisarColision(c.piezas);
}, 15);

const aperturaReal = (o) => (o.actuadores && o.actuadores.pinza === 'cerrada' ? 0 : 1);
const f1 = (v) => (v >= 0 ? '+' : '') + v.toFixed(1);
let nPrev = -1;
escena.alAntesDeRender(() => {
  const e = ctrl.estado();
  const o = observador ? observador.estado() : null;
  let info = { etiqueta: 'EMULADOR', linea: '' };
  if (modo === 'sincronizado') {
    // el modelo principal sigue la pose real; sin pose real se queda donde estaba
    if (o && o.q) { if (robot.actualizar({ q: o.q, apertura: aperturaReal(o), tl: e.tl, err: o.actuadores ? o.actuadores.error : 0 })) escena.pedir(); }
    info = { etiqueta: 'SINCRONIZADO', linea: !o || !o.pose ? 'Esperando posicion/mundo de rvm1/real/' + (o ? observador.idReal : '?') + '…'
      : 'REAL ' + observador.idReal + (o.valida ? '' : ' (sin NT)') + (o.fueraDeLimites ? ' · fuera de límites del gemelo' : '') + ' · hace ' + Math.round(o.edad_ms) + ' ms',
    clase: o && o.pose && !o.fueraDeLimites ? '' : 'rojo' };
  } else {
    if (robot.actualizar(Object.assign({}, e, { apertura: mundo.aperturaVisible(e.apertura) }))) escena.pedir();
    if (modo === 'sombra') {
      const vis = !!(o && o.q);
      if (fantasma.visible !== vis) { fantasma.visible = vis; escena.pedir(); }
      if (vis && fantasma.actualizar({ q: o.q, apertura: aperturaReal(o), tl: e.tl, err: 0 })) escena.pedir();
      const d = o ? observador.errorFrente(e) : null;
      info = { etiqueta: 'SOMBRA', linea: d ? 'Δ real: ' + d.dpos_mm.toFixed(1) + ' mm · ΔP ' + f1(d.dp_deg) + '° · ΔR ' + f1(d.dr_deg) + '°' + (o.valida ? '' : ' · real sin NT') + (o.fueraDeLimites ? ' · real fuera de límites del gemelo' : '')
        : 'SOMBRA: esperando posicion/mundo de rvm1/real/' + (observador ? observador.idReal : '?') + '…',
      clase: d && !o.fueraDeLimites ? '' : 'rojo' };
    }
  }
  if (objetos.actualizar(mundo.estado())) escena.pedir();
  { const ps = programa.estado(), t = ps.activo ? '■ Parar ciclo · vuelta ' + (ps.vueltas + 1) + ' · ' + ps.linea : '▶ Ciclo del cubo';
    if (btnProg.textContent !== t) { btnProg.textContent = t; btnProg.classList.toggle('on', ps.activo); } }
  pendant.ponerInfoModo(info);
  pendant.actualizar();
  const q = modo === 'sincronizado' && o && o.q ? o.q : e.q;
  const txt = (modo === 'sincronizado' ? 'REAL ' : '') + 'J ' + q.map((v) => v.toFixed(1)).join('  ') + (modo !== 'sincronizado' && e.err ? '   ER=' + e.err : '') + (modo !== 'sincronizado' && !e.referenciado ? '   sin NT' : '');
  if (leyenda.textContent !== txt) leyenda.textContent = txt;
  const n = registro.cuenta();
  if (n !== nPrev) { nPrev = n; barra.cuentaRegistro(n); }
});

// ------------------------------------------------------------------ demostración para capturas (?demo=1): postura de trabajo
if (parametros.has('demo')) {
  ['NT', 'SP 9'].forEach((l) => ctrl.enviar(l));
  ctrl.avanzar(10000);
  ['MJ 40,-25,10,15,30', 'GC', 'HE 1'].forEach((l) => ctrl.enviar(l));
  ctrl.avanzar(10000);
  ['MJ -60,5,-10,0,0', 'HE 2', 'MJ 30,0,0,0,0', 'SP 2'].forEach((l) => ctrl.enviar(l));
  ctrl.avanzar(10000);
}
// ?practica=1 (capturas): el cubo en la pinza sobre la mesita; ?colision=1: además, la mano baja contra la mesa (aviso fijo)
if (parametros.has('practica') || parametros.has('colision')) {
  ['NT', 'SP 9', 'GO', 'MP 260,-150,90,-90,0', 'MP 260,-150,4.5,-90,0', 'GC', 'MP 260,-150,100,-90,0', 'MP 260,150,100,-90,0'].forEach((l) => ctrl.enviar(l));
  if (parametros.has('colision')) ['MP 330,0,60,-90,0', 'MP 330,0,-40,-90,0'].forEach((l) => ctrl.enviar(l));
  else ['MP 260,150,44.5,-90,0'].forEach((l) => ctrl.enviar(l));
  for (let i = 0; i < 3000; i++) { ctrl.avanzar(10); for (const c of mundo.paso(10, ctrl.estado()).nuevas) avisarColision(c.piezas); }
}
// ?fantasma=1 (solo capturas): fantasma desplazado para enseñar el modo SOMBRA sin robot real
if (parametros.has('fantasma')) {
  const obs = R.observadorReal.crearObservadorReal({ idReal: '01', estadoGemelo: () => ctrl.estado(), modo: () => 'sombra' });
  const p = R.cinematica.fk(ctrl.estado().q.map((v, i) => v + [12, -6, 8, -4, 0][i]), ctrl.estado().tl);
  obs.recibir('rvm1/real/01/posicion/mundo', JSON.stringify({ ts: Date.now(), x: p.x, y: p.y, z: p.z, pitch: p.p, roll: p.r, valida: true }));
  observador = obs; modo = 'sombra';
}

// para depurar desde la consola
window.gemelo = { ctrl, mundo, programa, registro, get pasarela() { return pasarela; }, get observador() { return observador; }, pendant, escena };

// ?medir=1 (pruebas de diseño): anota en <body data-medida> si la página o el pendant desbordan
if (parametros.has('medir')) {
  setTimeout(() => {
    const de = document.documentElement;
    const desb = [...document.querySelectorAll('.pd, .pd-cuerpo, .pd-lado, .pd-scr, .pd-fk, #principal, #vista3d')]
      .filter((el) => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)
      .map((el) => el.className || el.id);
    const pequenas = [...document.querySelectorAll('.pd button, .barra .bc-plegar, .btn-vista')].filter((b) => b.offsetParent && (b.offsetHeight < 44 || b.offsetWidth < 44)).map((b) => b.textContent.trim());
    document.body.dataset.medida = JSON.stringify({ ventana: [innerWidth, innerHeight], pagina: [de.scrollWidth, de.scrollHeight], desbordan: desb, teclas_menores_44: pequenas });
  }, 1500);
}
