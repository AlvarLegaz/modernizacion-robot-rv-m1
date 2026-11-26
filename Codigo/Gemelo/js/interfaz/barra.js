// Barra mínima de conexión, plegable. Plegada: una línea con el estado. Desplegada: un panel superpuesto (no empuja la
// página, así no aparece desplazamiento). Recuerda la configuración en localStorage salvo la contraseña.
//   const b = crearBarra(contenedor, { alConectar(cfg), alDesconectar(), alDestino(destino, idReal), alModo(modo, idReal), alDescargar(desc, operador), alVaciarRegistro() }, { idUrl });
//   b.estadoBroker(estado, texto)   b.cuentaRegistro(n)   b.config()   b.ponerDestino(d)
'use strict';

const CLAVE = 'rvm1.gemelo.conexion';
const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE) || '{}') || {}; } catch (e) { return {}; } };
const escribir = (o) => { try { localStorage.setItem(CLAVE, JSON.stringify(o)); } catch (e) { /* modo privado o sin almacenamiento */ } };

// alumno07 → 07; profe → null
export function idDeUsuario(u) { const m = /(\d+)$/.exec(String(u || '').trim()); return m ? m[1] : null; }

// En el aula (http): ws://<host>:9001. Publicado tras un proxy HTTPS (p. ej. la plataforma Minaya Research en /rvm1/):
// wss://<host>/<ruta de la página>mqtt, que el proxy reenvía al WebSocket de Mosquitto. Se puede forzar con ?broker=URL.
export function urlPorDefecto() {
  if (typeof location === 'undefined') return 'ws://localhost:9001';
  try {
    const forzada = new URLSearchParams(location.search).get('broker');
    if (forzada) return forzada;
  } catch (e) { /* sin URLSearchParams */ }
  if (location.protocol === 'https:') {
    const dir = location.pathname.replace(/[^/]*$/, '');
    return 'wss://' + location.host + dir + 'mqtt';
  }
  return 'ws://' + (location.hostname || 'localhost') + ':9001';
}

export function crearBarra(raiz, cb, opc) {
  opc = opc || {};
  const g = leer();
  const cfg = {
    url: g.url || urlPorDefecto(), usuario: g.usuario || '', id: g.id || idDeUsuario(g.usuario) || '01', idManual: !!g.idManual,
    destino: 'local', modo: 'emulador', idReal: g.idReal || '01', operador: g.operador || '', descripcion: g.descripcion || 'sesion'
  };
  // ?id=07 en la URL manda sobre lo recordado y sobre el usuario
  if (opc.idUrl) { cfg.id = String(opc.idUrl).replace(/[^A-Za-z0-9_-]/g, '') || cfg.id; cfg.idManual = true; }
  // el destino 'real' nunca se recupera solo al recargar: siempre se arranca en local

  raiz.innerHTML = `
    <div class="bc-linea">
      <span class="bc-titulo">RV-M1 · gemelo digital</span>
      <span class="bc-chip" data-k="broker">broker: sin conectar</span>
      <span class="bc-chip" data-k="topic"></span>
      <span class="bc-chip" data-k="pendant"></span>
      <button class="bc-plegar" aria-expanded="false" aria-controls="bc-panel">Conexión ▾</button>
    </div>
    <div class="bc-panel" id="bc-panel" hidden>
      <fieldset><legend>Broker MQTT (opcional)</legend>
        <label>URL <input data-c="url" type="text" spellcheck="false" autocomplete="off" placeholder="ws://host:9001"></label>
        <label>Usuario MQTT (alumnoNN, no el de Minaya) <input data-c="usuario" type="text" spellcheck="false" autocomplete="username"></label>
        <label>Contraseña <input data-c="contrasena" type="password" autocomplete="current-password"></label>
        <label>Id gemelo <input data-c="id" type="text" inputmode="numeric" maxlength="8" spellcheck="false"></label>
        <label>Modo del gemelo
          <select data-c="modo">
            <option value="emulador">EMULADOR (interpreta sus comandos)</option>
            <option value="sombra">SOMBRA (emula + fantasma del robot real)</option>
            <option value="sincronizado">SINCRONIZADO (sigue al robot real)</option>
          </select></label>
        <div class="bc-botones"><button data-a="conectar" class="bc-prim">Conectar</button></div>
        <p class="bc-ayuda" data-k="ayuda"></p>
      </fieldset>
      <fieldset><legend>Presentes (en línea)</legend>
        <div class="bc-presentes" data-k="presentes"><span class="bc-vacio">Conecta el broker para ver quién está en línea.</span></div>
        <p class="bc-ayuda">Elige a qué conectar el pendant: tu gemelo ahora o, más adelante, el robot real.</p>
      </fieldset>
      <fieldset><legend>Pendant y robot real</legend>
        <label>Destino
          <select data-c="destino">
            <option value="local">Local (gemelo de esta página, sin broker)</option>
            <option value="gemelo">MQTT → rvm1/gemelo/&lt;id&gt;</option>
            <option value="real">MQTT → ROBOT REAL</option>
          </select></label>
        <label>Id robot real (pendant REAL y modos SOMBRA/SINCRONIZADO) <input data-c="idReal" type="text" maxlength="8" spellcheck="false"></label>
      </fieldset>
      <fieldset><legend>Registro (JSONL)</legend>
        <label>Descripción <input data-c="descripcion" type="text" spellcheck="false"></label>
        <label>Operador <input data-c="operador" type="text" spellcheck="false"></label>
        <div class="bc-botones"><button data-a="descargar">Descargar <span data-k="n">0</span> eventos</button><button data-a="vaciar">Vaciar</button></div>
      </fieldset>
    </div>`;

  const $ = (s) => raiz.querySelector(s);
  const campos = {};
  raiz.querySelectorAll('[data-c]').forEach((el) => { campos[el.dataset.c] = el; });
  const chip = (k) => raiz.querySelector('[data-k="' + k + '"]');
  campos.url.value = cfg.url; campos.usuario.value = cfg.usuario; campos.id.value = cfg.id;
  campos.destino.value = cfg.destino; campos.modo.value = cfg.modo; campos.idReal.value = cfg.idReal; campos.operador.value = cfg.operador; campos.descripcion.value = cfg.descripcion;

  const persistir = () => escribir({ url: cfg.url, usuario: cfg.usuario, id: cfg.id, idManual: cfg.idManual, idReal: cfg.idReal, operador: cfg.operador, descripcion: cfg.descripcion });
  let conectado = false;

  function pintarChips() {
    chip('topic').textContent = 'rvm1/gemelo/' + cfg.id + '/' + (cfg.modo === 'emulador' ? '' : cfg.modo === 'sombra' ? ' · SOMBRA de real/' + cfg.idReal : ' · SINCRONIZADO con real/' + cfg.idReal);
    const p = chip('pendant');
    p.textContent = 'pendant: ' + (cfg.destino === 'local' ? 'local' : cfg.destino === 'real' ? 'REAL ' + cfg.idReal : 'MQTT gemelo');
    p.classList.toggle('peligro', cfg.destino === 'real');
    chip('ayuda').textContent = 'El gemelo atiende rvm1/gemelo/' + cfg.id + '/comandos y publica ack, actuadores, posicion/mundo y online. Sin broker funciona en local.';
  }

  campos.modo.addEventListener('change', () => {
    const m = campos.modo.value;
    if (m !== 'emulador' && !conectado) { alert('Los modos SOMBRA y SINCRONIZADO leen el robot real por MQTT: conecta antes el broker.'); campos.modo.value = cfg.modo; return; }
    cfg.modo = m; pintarChips();
    if (cb.alModo) cb.alModo(m, cfg.idReal);
  });

  const plegar = $('.bc-plegar'), panel = $('.bc-panel');
  plegar.addEventListener('click', () => {
    const abrir = panel.hidden;
    panel.hidden = !abrir;
    plegar.setAttribute('aria-expanded', String(abrir));
    plegar.textContent = abrir ? 'Conexión ▴' : 'Conexión ▾';
  });

  campos.usuario.addEventListener('input', () => {
    cfg.usuario = campos.usuario.value.trim();
    const d = idDeUsuario(cfg.usuario);
    if (d && !cfg.idManual) { cfg.id = d; campos.id.value = d; }
    persistir(); pintarChips();
  });
  campos.id.addEventListener('input', () => {
    cfg.id = campos.id.value.trim().replace(/[^A-Za-z0-9_-]/g, '') || '01';
    cfg.idManual = cfg.id !== idDeUsuario(cfg.usuario);
    persistir(); pintarChips();
  });
  campos.url.addEventListener('change', () => { cfg.url = campos.url.value.trim(); persistir(); });
  campos.idReal.addEventListener('change', () => { cfg.idReal = campos.idReal.value.trim() || '01'; persistir(); pintarChips(); if (cfg.destino === 'real' && cb.alDestino) cb.alDestino('real', cfg.idReal); if (cfg.modo !== 'emulador' && cb.alModo) cb.alModo(cfg.modo, cfg.idReal); });
  campos.operador.addEventListener('change', () => { cfg.operador = campos.operador.value.trim(); persistir(); });
  campos.descripcion.addEventListener('change', () => { cfg.descripcion = campos.descripcion.value.trim() || 'sesion'; persistir(); });

  campos.destino.addEventListener('change', () => {
    const d = campos.destino.value;
    if (d !== 'local' && !conectado) { alert('Primero conecta el broker MQTT.'); campos.destino.value = cfg.destino; return; }
    if (d === 'real' && !confirm('El pendant va a mandar órdenes al ROBOT REAL (rvm1/real/' + cfg.idReal + '/).\n\nEl STOP de pantalla es solo software: la parada de emergencia es la seta física.\n\n¿Continuar?')) { campos.destino.value = cfg.destino; return; }
    cfg.destino = d; pintarChips();
    if (cb.alDestino) cb.alDestino(d, cfg.idReal);
  });

  $('[data-a="conectar"]').addEventListener('click', () => {
    if (conectado) { if (cb.alDesconectar) cb.alDesconectar(); return; }
    cfg.url = campos.url.value.trim(); persistir();
    if (cb.alConectar) cb.alConectar({ url: cfg.url, usuario: cfg.usuario, contrasena: campos.contrasena.value, id: cfg.id });
  });
  $('[data-a="descargar"]').addEventListener('click', () => { if (cb.alDescargar) cb.alDescargar(cfg.descripcion, cfg.operador); });
  $('[data-a="vaciar"]').addEventListener('click', () => { if (confirm('¿Vaciar el registro de eventos?') && cb.alVaciarRegistro) cb.alVaciarRegistro(); });

  // acciones de la lista de presentes: ponen el valor en el selector y lanzan su 'change' (mismas comprobaciones que a mano)
  function elegir(destino, idReal) {
    if (idReal) { cfg.idReal = idReal; campos.idReal.value = idReal; persistir(); }
    campos.destino.value = destino; campos.destino.dispatchEvent(new Event('change'));
  }
  function elegirModo(modo, idReal) {
    if (idReal) { cfg.idReal = idReal; campos.idReal.value = idReal; persistir(); }
    campos.modo.value = modo; campos.modo.dispatchEvent(new Event('change'));
  }

  pintarChips();

  return {
    config: () => Object.assign({}, cfg),
    estadoBroker(estado, texto) {
      conectado = estado === 'conectado';
      const c = chip('broker');
      c.textContent = 'broker: ' + (texto || estado);
      c.className = 'bc-chip ' + (estado === 'conectado' ? 'ok' : estado === 'error' ? 'peligro' : estado === 'conectando' ? 'aviso' : '');
      $('[data-a="conectar"]').textContent = (estado === 'conectado' || estado === 'conectando') ? 'Desconectar' : 'Conectar';
      if (estado === 'conectando') conectado = true;     // permite cancelar
      ['url', 'usuario', 'contrasena', 'id'].forEach((k) => { campos[k].disabled = estado === 'conectado' || estado === 'conectando'; });
    },
    // Lista de presentes: [{ destino:'gemelo'|'real', id, estado:'online'|'offline', propio }]. Los botones reutilizan los selectores de abajo
    // (con sus avisos y confirmaciones), así que elegir el robot real pide la misma confirmación que hacerlo a mano.
    presentes(lista) {
      const cont = chip('presentes');
      cont.textContent = '';
      if (!lista.length) { const v = document.createElement('span'); v.className = 'bc-vacio'; v.textContent = conectado ? 'Nadie en línea todavía.' : 'Conecta el broker para ver quién está en línea.'; cont.append(v); return; }
      const boton = (txt, fn) => { const x = document.createElement('button'); x.type = 'button'; x.textContent = txt; x.addEventListener('click', fn); return x; };
      for (const p of lista) {
        const f = document.createElement('div'); f.className = 'bc-pres ' + p.estado;
        const punto = document.createElement('i'); punto.title = p.estado;
        const t = document.createElement('span');
        t.textContent = (p.destino === 'real' ? 'ROBOT REAL ' : 'Gemelo ') + p.id + (p.propio ? ' (este)' : '') + ' · ' + (p.estado === 'online' ? 'en línea' : 'sin conexión');
        f.append(punto, t);
        if (p.estado === 'online') {
          if (p.destino === 'real') {
            f.append(boton('Pendant → real', () => elegir('real', p.id)), boton('Sincronizar', () => elegirModo('sincronizado', p.id)));
          } else if (p.propio) {
            f.append(boton('Pendant → gemelo', () => elegir('gemelo', null)));
          }
        }
        cont.append(f);
      }
    },
    ponerDestino(d) { cfg.destino = d; campos.destino.value = d; pintarChips(); },
    ponerModo(m) { cfg.modo = m; campos.modo.value = m; pintarChips(); },
    cuentaRegistro(n) { chip('n').textContent = String(n); }
  };
}
