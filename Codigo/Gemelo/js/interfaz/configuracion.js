// Ventana de configuración del gemelo. Solo interfaz: los ajustes, su validación y su almacenamiento están en js/modelo/ajustes.js.
//   const c = crearConfiguracion({ ajustes, A, almacen, alCambiar(ajustes), estadoMando() });   c.abrir()
// Los cambios se aplican y se guardan al momento (alCambiar); cambiar «qué se ve» recarga la página.

export function crearConfiguracion(opc) {
  const { A, almacen } = opc;
  let aj = A.validar(opc.ajustes);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  const dlg = el('dialog', 'pg cf');
  dlg.setAttribute('aria-label', 'Configuración');
  const cab = el('div', 'pg-cab'); cab.append(el('b', '', 'Configuración'));
  const cerrar = el('button', 'pg-x', '✕'); cerrar.type = 'button'; cerrar.setAttribute('aria-label', 'Cerrar'); cab.append(cerrar);
  dlg.append(cab);

  const grupo = (titulo) => { const f = el('fieldset', 'cf-grupo'); f.append(el('legend', '', titulo)); dlg.append(f); return f; };
  const fila = (f, texto, control, ayuda) => {
    const l = el('label', 'cf-fila'); const t = el('span', '', texto); l.append(t, control); f.append(l);
    if (ayuda) f.append(el('div', 'pg-ayuda', ayuda));
    return control;
  };
  const check = (clave) => { const c = el('input'); c.type = 'checkbox'; c.dataset.clave = clave; return c; };
  const select = (clave, opciones) => { const s = el('select'); s.dataset.clave = clave; for (const [v, t] of opciones) { const o = el('option', '', t); o.value = v; s.append(o); } return s; };

  const gPantalla = grupo('Pantalla');
  const sPantalla = fila(gPantalla, 'Qué se ve en esta página', select('pantalla', [['ambas', 'Pendant y vista 3D'], ['pendant', 'Solo el pendant'], ['visor', 'Solo la vista 3D']]),
    'Para repartir el trabajo en dos equipos: uno con el pendant y otro con la vista 3D (que sigue al pendant por MQTT con el mismo id). Cambiarlo recarga la página; «?ver=» en la dirección manda sobre este ajuste.');

  const gEscena = grupo('Vista 3D');
  const cEjes = fila(gEscena, 'Ejes de coordenadas X, Y, Z', check('ejes'));
  const cNave = fila(gEscena, 'Nave de taller de fondo', check('nave'));

  const gFis = grupo('Contactos');
  const cSolidos = fila(gFis, 'La mesa y la base son sólidas', check('solidos'),
    'Activado: el robot se detiene al tocarlas y no las atraviesa. Desactivado: solo avisa en rojo y sigue. El cubo y la mesita siempre se empujan.');

  const gMando = grupo('Mando de juego');
  const cMando = fila(gMando, 'Usar el mando', check('mando'));
  const rZona = el('input'); rZona.type = 'range'; rZona.min = '0.3'; rZona.max = '0.9'; rZona.step = '0.05'; rZona.dataset.clave = 'zonaMuerta';
  const vZona = el('output', 'cf-valor'); const cZona = el('span', 'cf-rango'); cZona.append(rZona, vZona);
  fila(gMando, 'Zona muerta de las palancas', cZona, 'Cuánto hay que empujar la palanca antes de que mueva el robot. Más alto = menos sensible.');
  const estadoMando = el('div', 'pg-ayuda cf-estado');
  gMando.append(estadoMando);
  gMando.append(el('div', 'pg-ayuda', 'Start = ENABLE · B = STOP · Back = RESET · Y = HOME · LT/RT = abrir/cerrar · A/X = HE/MO · LB/RB = COORD y STEP/CONT · cruceta ↑↓ = SP. Tabla completa en el README del gemelo.'));

  const gJog = grupo('Jog');
  const sVel = fila(gJog, 'Velocidad de jog continuo por defecto', select('velJog', (opc.velocidades || ['Lenta', 'Media', 'Rápida', 'Máx']).map((t, i) => [String(i), t])),
    'Es la velocidad con la que empieza el pendant en modo CONT; se cambia al momento con la tecla VEL.');

  const pie = el('div', 'pg-botones');
  const bRest = el('button', '', 'Restablecer valores'); bRest.type = 'button';
  const bOk = el('button', 'pg-primario', 'Cerrar'); bOk.type = 'button';
  pie.append(bRest, bOk); dlg.append(pie);
  document.body.appendChild(dlg);

  function pintar() {
    sPantalla.value = aj.pantalla; cEjes.checked = aj.ejes; cNave.checked = aj.nave; cSolidos.checked = aj.solidos; cMando.checked = aj.mando;
    rZona.value = String(aj.zonaMuerta); vZona.textContent = aj.zonaMuerta.toFixed(2); sVel.value = String(aj.velJog); rZona.disabled = !aj.mando;
  }
  function leer() {
    return { pantalla: sPantalla.value, ejes: cEjes.checked, nave: cNave.checked, solidos: cSolidos.checked, mando: cMando.checked, zonaMuerta: +rZona.value, velJog: +sVel.value };
  }
  function aplicar(nuevo) {
    const antes = aj; aj = A.validar(nuevo);
    almacen && A.guardar(almacen, aj);
    pintar();
    if (opc.alCambiar) opc.alCambiar(aj, antes);
  }
  dlg.addEventListener('change', (e) => { if (e.target.dataset && e.target.dataset.clave) aplicar(leer()); });
  rZona.addEventListener('input', () => { vZona.textContent = (+rZona.value).toFixed(2); });
  bRest.addEventListener('click', () => aplicar(A.DEFECTOS));
  bOk.addEventListener('click', () => dlg.close());
  cerrar.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  return {
    abrir() {
      pintar();
      const m = opc.estadoMando ? opc.estadoMando() : null;
      estadoMando.textContent = m && m.conectado ? 'Mando detectado: ' + String(m.id).slice(0, 60) : 'Ningún mando detectado (conéctalo y pulsa un botón).';
      if (!dlg.open) dlg.showModal();
    },
    ajustes: () => aj,
    elemento: dlg
  };
}
