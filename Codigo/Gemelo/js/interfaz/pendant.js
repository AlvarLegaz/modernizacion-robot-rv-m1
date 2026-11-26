// Teach pendant del gemelo: mismo diseño y comportamiento que Codigo/Software_Control/rvm1_pendant.py (carcasa oscura, pantalla clara,
// barra MANUAL/COORD/STEP/SP/REF, línea de alarma, X Y Z P R, seta STOP software enclavada hasta RESET, COORD, STEP/CONT,
// INCR, −%/+%, jog −/+ con rótulos estilo FANUC, WORLD bloqueado sin referenciar, J4/J5 "art." en WORLD, SP inicial 2 y
// aviso desde SP 6). Añade HOME, RESET, pinza, puntos HE/MO y habilitación táctil (ENABLE conmutado: una pulsación habilita y otra deshabilita).
//   const p = crearPendant(contenedor);  p.ponerEnlace(enlace);  p.actualizar()  (cada fotograma)
// Solo lee el estado del enlace; nunca toca la controladora directamente.
'use strict';

export const INCREMENTS = [['PEQ', 0.1], ['MED', 1.0], ['GRA', 5.0], ['MUY', 10.0]];
export const CONT_PERIOD_MS = 200;
// Jog continuo: la tecla INCR pasa a VEL y elige la velocidad (nombre, ° por tick articular, mm por tick cartesiano).
// Con un tick cada 200 ms: 2.5/10/20/30 °/s y 5/25/50/100 mm/s (bajo los 250 mm/s de T1); SP limita además la velocidad real.
export const CONT_SPEEDS = [['LENTA', 0.5, 1.0], ['MEDIA', 2.0, 5.0], ['RÁPIDA', 4.0, 10.0], ['MÁX', 6.0, 20.0]];
export const VEL_DEFAULT = 1;
export const SP_DEFAULT = 2;
export const SP_WARN = 6;
const KEYMAP = { q: [0, +1], a: [0, -1], w: [1, +1], s: [1, -1], e: [2, +1], d: [2, -1], r: [3, +1], f: [3, -1], t: [4, +1], g: [4, -1] };

const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const fmt = (v) => (v >= 0 ? '+' : '') + v.toFixed(1);

export function crearPendant(raiz) {
  // ------------------------------------------------ estado de máquina (como en rvm1_pendant.py)
  const st = {
    coord: 'JOINT', jogmode: 'STEP', incrIdx: 1, velIdx: VEL_DEFAULT, sp: SP_DEFAULT, estop: false,
    habilitado: false, jog: null, jogPuntero: null, contTimer: null,
    lastEr: null, homed: false, punto: 1, alarma: ''
  };
  let enlace = null;
  let infoModo = { etiqueta: 'EMULADOR', linea: '', clase: '' };

  // ------------------------------------------------ construcción
  raiz.innerHTML = '';
  const caja = h('div', 'pd'); raiz.appendChild(caja);
  caja.setAttribute('role', 'group'); caja.setAttribute('aria-label', 'Teach pendant');

  const cab = h('div', 'pd-cab');
  cab.append(h('span', 'pd-marca', 'MOVEMASTER'), h('span', 'pd-modelo', 'RV-M1 · TEACH PENDANT'));
  const led = h('span', 'pd-led'); led.append(h('span', 'pd-led-txt', 'ENABLE'), h('i'));
  cab.appendChild(led);
  caja.appendChild(cab);

  const avisoReal = h('div', 'pd-real', 'DESTINO: ROBOT REAL por MQTT · la parada de emergencia es la SETA FÍSICA');
  avisoReal.hidden = true;
  caja.appendChild(avisoReal);

  const cuerpo = h('div', 'pd-cuerpo'); caja.appendChild(cuerpo);

  // ---- pantalla
  const bisel = h('div', 'pd-bisel'); cuerpo.appendChild(bisel);
  const scr = h('div', 'pd-scr'); bisel.appendChild(scr);
  const barra = h('div', 'pd-barra'); scr.appendChild(barra);
  const seg = (t, cls) => { const s = h('span', 'pd-seg' + (cls ? ' ' + cls : ''), t); barra.appendChild(s); return s; };
  const sMode = seg('MANUAL'), sCoord = seg('JOINT'), sJog = seg('STEP 1'), sOvr = seg('SP 2'), sRef = seg('NO REF'), sGem = seg('EMULADOR'), sConn = seg('OFFLINE', 'pd-seg-der');
  const alarmaEl = h('div', 'pd-alarma'); alarmaEl.setAttribute('role', 'status'); alarmaEl.setAttribute('aria-live', 'polite'); scr.appendChild(alarmaEl);

  const card = h('div', 'pd-card'); scr.appendChild(card);
  const posTit = h('div', 'pd-card-tit', 'Posición TCP  ·  WORLD'); card.appendChild(posTit);
  const rejilla = h('div', 'pd-pos'); card.appendChild(rejilla);
  const posVals = ['X', 'Y', 'Z', 'P', 'R'].map((n, i) => {
    const c = h('div', 'pd-pos-c' + (i >= 3 ? ' pd-ang' : ''));
    const et = h('span', 'pd-pos-n', n); et.appendChild(h('small', null, i < 3 ? 'mm' : '°'));
    const v = h('span', 'pd-pos-v', '----.-'); c.append(et, v);
    rejilla.appendChild(c); return v;
  });
  const modoEl = h('div', 'pd-modo'); scr.appendChild(modoEl);
  const nota = h('div', 'pd-nota'); scr.appendChild(nota);

  // puntos HE / MO
  const pts = h('div', 'pd-pts'); scr.appendChild(pts);
  const ptsCab = h('div', 'pd-pts-cab'); pts.appendChild(ptsCab);
  ptsCab.append(h('span', 'pd-pts-tit', 'PUNTOS'));
  const menos = h('button', 'pd-mini', '−'), mas = h('button', 'pd-mini', '+');
  const nEl = h('span', 'pd-pts-n', '1');
  menos.setAttribute('aria-label', 'Punto anterior'); mas.setAttribute('aria-label', 'Punto siguiente');
  ptsCab.append(menos, nEl, mas);
  const lista = h('ul', 'pd-pts-lista'); pts.appendChild(lista);

  const logbox = h('div', 'pd-log'); scr.appendChild(logbox);

  // ---- teclas físicas
  const lado = h('div', 'pd-lado'); cuerpo.appendChild(lado);
  const setaZona = h('div', 'pd-seta-zona'); lado.appendChild(setaZona);
  const seta = h('button', 'pd-seta'); seta.append(h('span', 'pd-seta-cap', 'STOP'));
  seta.setAttribute('aria-label', 'STOP software (enclavado hasta RESET)');
  setaZona.append(seta, h('span', 'pd-seta-txt', 'solo software'));

  const fn = h('div', 'pd-fn'); lado.appendChild(fn);
  const key = (txt, cls) => { const b = h('button', 'pd-key' + (cls ? ' ' + cls : '')); b.innerHTML = txt; return b; };
  const kCoord = key('COORD<br>JOINT'), kMode = key('STEP'), kIncr = key('INCR<br>1');
  const kMenos = key('−%'), ovrLbl = h('span', 'pd-ovr', 'SP 2'), kMas = key('+%');
  fn.append(kCoord, kMode, kIncr, kMenos, ovrLbl, kMas);

  const jogZona = h('div', 'pd-jog'); lado.appendChild(jogZona);
  const jogKeys = [];
  for (let i = 0; i < 5; i++) {
    const fila = [];
    for (const s of [-1, +1]) {
      const b = key('', 'pd-jogk'); b.dataset.eje = i; b.dataset.signo = s;
      jogZona.appendChild(b); fila.push(b);
    }
    jogKeys.push(fila);
  }
  const kEnable = h('button', 'pd-enable'); kEnable.innerHTML = '<b>ENABLE</b><small>pulsar para habilitar</small>';
  kEnable.setAttribute('aria-label', 'Habilitación: pulsar para habilitar o deshabilitar el jog');
  kEnable.setAttribute('aria-pressed', 'false');
  lado.appendChild(kEnable);

  // ---- softkeys físicas bajo la pantalla
  const fk = h('div', 'pd-fk'); caja.appendChild(fk);
  const fkey = (n, t) => { const b = h('button', 'pd-key pd-fkey'); b.innerHTML = '<small>F' + n + '</small>' + t; fk.appendChild(b); return b; };
  const fHome = fkey(1, 'HOME'), fReset = fkey(2, 'RESET'), fGo = fkey(3, 'ABRIR'), fGc = fkey(4, 'CERRAR'), fHe = fkey(5, 'HE 1'), fMo = fkey(6, 'MO 1');

  caja.appendChild(h('div', 'pd-ayuda', 'ENABLE (o ESPACIO) = habilitar / deshabilitar · Jog teclado: Q/A W/S E/D R/F T/G · La parada de emergencia real es la seta física.'));

  // ------------------------------------------------ utilidades
  function log(msg) {
    const l = h('div', null, msg); logbox.appendChild(l);
    while (logbox.childNodes.length > 80) logbox.removeChild(logbox.firstChild);
    logbox.scrollTop = logbox.scrollHeight;
  }
  function alarm(msg) {
    st.alarma = msg || '';
    alarmaEl.textContent = st.alarma;
    if (msg) log('ALARMA  ' + msg);
  }
  const enabled = () => st.habilitado;
  const needLink = () => { if (!enlace) { alarm('Sin conexión.'); return false; } return true; };

  // ------------------------------------------------ funciones (equivalentes a rvm1_pendant.py)
  function setSp(sp, quiet) {
    st.sp = Math.max(0, Math.min(9, sp));
    if (enlace) { enlace.velocidad(st.sp); if (!quiet) log('> SP ' + st.sp); }
    refrescar();
  }
  function override(d) {
    setSp(st.sp + d);
    if (st.sp >= SP_WARN) alarm('Override alto (SP ' + st.sp + ') en modo manual.');
    else if (st.alarma.startsWith('Override')) alarm('');
  }
  function home() {
    if (!needLink()) return;
    if (st.estop) { alarm('STOP activo: pulsa RESET (F2).'); return; }
    // Como en la D/U-M1: en error la controladora ignora todo salvo RS, ER y WH, así que NT no haría nada.
    const er = enlace.estado().error;
    if (er) { alarm('HOME ignorado: hay ERROR MODO ' + (er === 1 ? 'I' : 'II') + '. Pulsa RESET (F2) y luego HOME (F1).'); return; }
    log('> NT  (homing)');
    enlace.home();
  }
  function reset() {
    st.estop = false;
    if (enlace) { enlace.reset(); log('> RS'); }
    alarm('');
    refrescar();
  }
  function estop() {
    st.estop = true;
    setEnable(false);
    jogRelease();
    if (enlace) enlace.vaciar();
    setSp(SP_DEFAULT, true);
    st.velIdx = VEL_DEFAULT;
    alarm('STOP software: envíos detenidos. RESET (F2) para seguir.');
    refrescar();
  }
  function cycleCoord() {
    if (st.coord === 'JOINT') {
      if (!st.homed) { alarm(st.lastEr ? 'WORLD no disponible: pulsa RESET (F2) y luego HOME (F1).' : 'WORLD no disponible: pulsa HOME (F1) para referenciar.'); return; }
      st.coord = 'WORLD';
    } else st.coord = 'JOINT';
    alarm(''); refrescar();
  }
  function pinza(a) {
    if (!needLink()) return;
    if (st.estop) { alarm('STOP activo: pulsa RESET (F2).'); return; }
    log(a === 'abrir' ? '> GO' : '> GC'); enlace.pinza(a);
  }
  function guardarPunto() {
    if (!needLink()) return;
    if (st.estop) { alarm('STOP activo: pulsa RESET (F2).'); return; }
    if (!st.homed) { alarm('HE requiere robot referenciado (HOME).'); return; }
    log('> HE ' + st.punto); enlace.guardarPunto(st.punto);
  }
  function irAPunto() {
    if (!needLink()) return;
    if (st.estop) { alarm('STOP activo: pulsa RESET (F2).'); return; }
    if (!enabled()) { alarm('MO: pendant no habilitado (pulsa ENABLE o ESPACIO).'); return; }
    if (!st.homed) { alarm('MO requiere robot referenciado (HOME).'); return; }
    log('> MO ' + st.punto); enlace.irAPunto(st.punto);
  }

  // ------------------------------------------------ jog
  function jogAllowed() {
    if (st.estop) { alarm('STOP activo: pulsa RESET (F2).'); return false; }
    if (!enabled()) { alarm('JOG: pendant no habilitado (pulsa ENABLE o ESPACIO).'); return false; }
    if (!needLink()) return false;
    if (st.coord === 'WORLD' && !st.homed) { alarm('WORLD requiere robot referenciado.'); return false; }
    return true;
  }
  function jogSend(axis, sign, size) {
    const d = sign * size;
    if (st.coord === 'JOINT' || axis >= 3) { enlace.jogArticular(axis + 1, d); return 'DJ ' + (axis + 1) + ',' + d.toFixed(1); }
    const v = [0, 0, 0]; v[axis] = d;
    enlace.jogMundo(v[0], v[1], v[2]);
    return 'DS ' + v.map((x) => x.toFixed(1)).join(',');
  }
  function jogPress(axis, sign) {
    if (!jogAllowed()) return false;
    if (st.alarma.startsWith('JOG')) alarm('');
    st.jog = [axis, sign];
    flash(axis, sign, true);
    if (st.jogmode === 'STEP') log('> ' + jogSend(axis, sign, INCREMENTS[st.incrIdx][1]));
    else { contTick(); st.contTimer = setInterval(contTick, CONT_PERIOD_MS); }
    return true;
  }
  function contTick() {
    if (!st.jog || !enabled() || st.estop || !enlace) return;
    if (enlace.estado().pendientes <= 1) {
      const [ax, s] = st.jog;
      log('> ' + jogSend(ax, s, contStep(ax)));
    }
  }
  function contStep(ax) {
    const [, deg, mm] = CONT_SPEEDS[st.velIdx];
    return st.coord === 'WORLD' && ax < 3 ? mm : deg;
  }
  function velTexto() {
    const [, deg, mm] = CONT_SPEEDS[st.velIdx], k = 1000 / CONT_PERIOD_MS;
    return st.coord === 'WORLD' ? (mm * k) + ' mm/s' : (deg * k) + ' °/s';
  }
  function jogRelease() {
    if (st.contTimer) { clearInterval(st.contTimer); st.contTimer = null; }
    if (st.jog) {
      const [ax, s] = st.jog;
      flash(ax, s, false);
      if (st.jogmode === 'CONT' && enlace) enlace.vaciar();
    }
    st.jog = null; st.jogPuntero = null;
  }
  function flash(axis, sign, on) { jogKeys[axis][sign < 0 ? 0 : 1].classList.toggle('pulsada', on); }

  // ENABLE conmuta (simplificación didáctica: en un pendant real el dispositivo de habilitación es de tres posiciones y se mantiene pulsado)
  function setEnable(on) {
    if (on !== undefined) st.habilitado = !!on;
    const h = st.habilitado;
    if (!h) jogRelease();
    led.classList.toggle('on', h);
    kEnable.classList.toggle('on', h);
    kEnable.setAttribute('aria-pressed', h ? 'true' : 'false');
    kEnable.querySelector('b').textContent = h ? 'HABILITADO' : 'ENABLE';
    kEnable.querySelector('small').textContent = h ? 'pulsar para deshabilitar' : 'pulsar para habilitar';
  }

  // ------------------------------------------------ eventos (Pointer Events multitáctil)
  const sinMenu = (el) => el.addEventListener('contextmenu', (e) => e.preventDefault());
  caja.querySelectorAll('button').forEach(sinMenu);

  kEnable.addEventListener('click', () => setEnable(!st.habilitado));

  jogZona.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.pd-jogk'); if (!b) return;
    e.preventDefault();
    if (st.jog) return;                                   // un único jog a la vez
    try { b.setPointerCapture(e.pointerId); } catch (x) { /* */ }
    if (jogPress(+b.dataset.eje, +b.dataset.signo)) st.jogPuntero = e.pointerId;
  });
  const jogUp = (e) => { if (st.jogPuntero === e.pointerId) jogRelease(); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => jogZona.addEventListener(t, jogUp, true));

  seta.addEventListener('pointerdown', (e) => { e.preventDefault(); estop(); });
  kCoord.addEventListener('click', cycleCoord);
  kMode.addEventListener('click', () => { st.jogmode = st.jogmode === 'STEP' ? 'CONT' : 'STEP'; refrescar(); });
  kIncr.addEventListener('click', () => {           // STEP: tamaño del paso; CONT: velocidad de jog
    if (st.jogmode === 'STEP') st.incrIdx = (st.incrIdx + 1) % INCREMENTS.length;
    else st.velIdx = (st.velIdx + 1) % CONT_SPEEDS.length;
    refrescar();
  });
  kMenos.addEventListener('click', () => override(-1));
  kMas.addEventListener('click', () => override(+1));
  fHome.addEventListener('click', home);
  fReset.addEventListener('click', reset);
  fGo.addEventListener('click', () => pinza('abrir'));
  fGc.addEventListener('click', () => pinza('cerrar'));
  fHe.addEventListener('click', guardarPunto);
  fMo.addEventListener('click', irAPunto);
  menos.addEventListener('click', () => { st.punto = Math.max(1, st.punto - 1); refrescar(); });
  mas.addEventListener('click', () => { st.punto = Math.min(629, st.punto + 1); refrescar(); });
  lista.addEventListener('click', (e) => { const li = e.target.closest('li[data-n]'); if (li) { st.punto = +li.dataset.n; refrescar(); } });

  // teclado: ESPACIO = habilitación; Q/A … T/G = jog. e.repeat filtra la autorrepetición.
  const enCampo = (e) => e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA');
  window.addEventListener('keydown', (e) => {
    if (enCampo(e)) return;
    const k = e.key.toLowerCase();
    if (k === ' ') { e.preventDefault(); if (!e.repeat) setEnable(!st.habilitado); return; }
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (KEYMAP[k] && !st.jog) { const [ax, s] = KEYMAP[k]; if (jogPress(ax, s)) st.jogPuntero = 'tecla:' + k; }
  });
  window.addEventListener('keyup', (e) => {
    if (enCampo(e)) return;
    const k = e.key.toLowerCase();
    if (k === ' ') { e.preventDefault(); return; }
    if (st.jogPuntero === 'tecla:' + k) jogRelease();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) setEnable(false); });   // al ocultar la página se deshabilita

  // ------------------------------------------------ refresco de pantalla (solo si cambia)
  const ultimo = {};
  const poner = (el, prop, val, k) => { if (ultimo[k] !== val) { ultimo[k] = val; el[prop] = val; } };
  const clase = (el, c, on) => { if (el.classList.contains(c) !== !!on) el.classList.toggle(c, !!on); };

  function refrescar() {
    const e = enlace ? enlace.estado() : null;
    const inc = INCREMENTS[st.incrIdx][1];
    poner(sCoord, 'textContent', st.coord, 'sc');
    poner(sJog, 'textContent', st.jogmode === 'STEP' ? 'STEP ' + inc : 'CONT ' + velTexto(), 'sj');
    const warn = st.sp >= SP_WARN;
    poner(sOvr, 'textContent', 'SP ' + st.sp, 'so'); clase(sOvr, 'ambar', warn);
    poner(ovrLbl, 'textContent', 'SP ' + st.sp, 'ol'); clase(ovrLbl, 'ambar', warn);
    poner(sRef, 'textContent', st.homed ? 'REF OK' : 'NO REF', 'sr'); clase(sRef, 'verde', st.homed); clase(sRef, 'rojo', !st.homed);
    const on = !!(e && e.conectado);
    if (!on && st.habilitado) setEnable(false);                 // al perder la conexión se deshabilita
    poner(sConn, 'textContent', enlace ? (on ? enlace.etiqueta : enlace.etiqueta + ' ?') : 'OFFLINE', 'sn');
    clase(sConn, 'verde', on && enlace.destino !== 'real'); clase(sConn, 'rojo', on && enlace.destino === 'real'); clase(sConn, 'gris', !on);
    poner(sGem, 'textContent', infoModo.etiqueta, 'sg');
    clase(sGem, 'ambar', infoModo.etiqueta !== 'EMULADOR');
    poner(modoEl, 'textContent', infoModo.linea || '', 'ml');
    clase(modoEl, 'vacio', !infoModo.linea); clase(modoEl, 'rojo', infoModo.clase === 'rojo');
    poner(sMode, 'textContent', st.estop ? 'STOP' : 'MANUAL', 'sm'); clase(sMode, 'rojo', st.estop);
    clase(seta, 'enclavada', st.estop);
    avisoReal.hidden = !(enlace && enlace.destino === 'real');
    clase(caja, 'modo-real', !!(enlace && enlace.destino === 'real'));

    poner(kCoord, 'innerHTML', 'COORD<br>' + st.coord, 'kc');
    clase(kCoord, 'bloq', st.coord === 'JOINT' && !st.homed);
    poner(kMode, 'innerHTML', st.jogmode === 'STEP' ? 'STEP' : 'CONT', 'km');
    poner(kIncr, 'innerHTML', st.jogmode === 'STEP' ? 'INCR<br>' + inc : 'VEL<br>' + velTexto(), 'ki');

    for (let i = 0; i < 5; i++) {
      const j = 'J' + (i + 1);
      let txt, art = false;
      if (st.coord === 'JOINT') txt = ['−' + j, '+' + j];
      else if (i < 3) { const ax = 'XYZ'[i]; txt = ['−' + ax + '<small>(' + j + ')</small>', '+' + ax + '<small>(' + j + ')</small>']; }
      else { txt = ['−' + j + '<small>art.</small>', '+' + j + '<small>art.</small>']; art = true; }
      jogKeys[i].forEach((b, k) => { poner(b, 'innerHTML', txt[k], 'j' + i + k); clase(b, 'art', art); });
    }

    // posición
    for (let i = 0; i < 5; i++) {
      const v = e && e.pose ? fmt(e.pose['xyzpr'[i]]) : '----.-';
      poner(posVals[i], 'textContent', v, 'p' + i);
    }
    clase(card, 'invalida', !(e && e.valida));
    let n, nc = '';
    if (!st.homed) { n = 'Robot NO referenciado: haz HOME (F1). Solo se permite jog JOINT; la posición no es válida.'; nc = 'rojo'; }
    else if (st.coord === 'JOINT') n = 'El RV-M1 solo informa de la posición cartesiana del TCP (WH); no da ángulos articulares.';
    else n = 'WORLD: X, Y, Z en línea recta (DS). J4 y J5 se mueven como ejes: el RV-M1 no reorienta alrededor del TCP.';
    poner(nota, 'textContent', n, 'nota'); clase(nota, 'rojo', nc === 'rojo');

    // puntos
    poner(nEl, 'textContent', String(st.punto), 'pn');
    poner(fHe, 'innerHTML', '<small>F5</small>HE ' + st.punto, 'fhe');
    poner(fMo, 'innerHTML', '<small>F6</small>MO ' + st.punto, 'fmo');
    const ps = e ? e.puntos : [];
    const firma = JSON.stringify(ps) + '|' + st.punto;
    if (ultimo.lista !== firma) {
      ultimo.lista = firma;
      lista.innerHTML = '';
      if (!ps.length) lista.appendChild(h('li', 'vacio', 'Sin puntos. HE n guarda la posición actual.'));
      for (const p of ps) {
        const li = h('li', p.n === st.punto ? 'sel' : '');
        li.dataset.n = p.n;
        li.textContent = String(p.n).padStart(3, ' ') + '  ' + [p.pose.x, p.pose.y, p.pose.z, p.pose.p, p.pose.r].map(fmt).join(' ') + (p.pinza === 'cerrada' ? '  CERR' : p.pinza === 'abierta' ? '  ABIE' : '');
        lista.appendChild(li);
      }
    }
  }

  // ------------------------------------------------ ciclo: refleja el estado del enlace (también movimientos externos)
  function actualizar() {
    if (enlace) {
      const e = enlace.estado();
      const homed = !!e.referenciado;
      if (homed !== st.homed) {
        st.homed = homed;
        if (homed) { log('Referenciado.'); if (st.alarma.startsWith('Homing') || st.alarma.startsWith('Robot')) alarm(''); }
        else if (st.coord === 'WORLD') { st.coord = 'JOINT'; }
      }
      if (e.error !== st.lastEr) {
        st.lastEr = e.error;
        if (e.error === 1) alarm('ERROR MODO I (hardware): revisa LED interno y pulsa RESET.');
        else if (e.error === 2) alarm('ERROR MODO II (comando no ejecutable). RESET (F2).' + (e.motivoError ? ' [' + e.motivoError + ']' : ''));
        else if (st.alarma.startsWith('ERROR')) alarm('');
      }
    }
    refrescar();
  }

  function ponerEnlace(nuevo) {
    jogRelease();
    if (enlace) enlace.cerrar();
    enlace = nuevo;
    st.coord = 'JOINT'; st.lastEr = null; st.homed = false;
    if (enlace) {
      enlace.alAviso((t, nivel) => { if (nivel === 'info') log(t); else alarm(t); });
      setSp(SP_DEFAULT, true);
      alarm('');
      log('Conectado (' + enlace.etiqueta + '). Velocidad SP 2. Haz HOME (F1) para referenciar.');
    }
    refrescar();
  }

  refrescar();
  // modo del gemelo (EMULADOR / SOMBRA / SINCRONIZADO) y línea de error gemelo–real; lo fija app.js
  function ponerInfoModo(i) { infoModo = Object.assign({ etiqueta: 'EMULADOR', linea: '', clase: '' }, i || {}); }

  return { ponerEnlace, ponerInfoModo, actualizar, log, alarm, get estado() { return st; }, puntos: () => (enlace ? enlace.estado().puntos : []) };
}
