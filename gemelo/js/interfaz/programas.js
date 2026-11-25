// Gestor de programas del gemelo: ventana para escribir, validar, guardar, cargar, exportar e importar programas (JSON).
// Solo interfaz: la validación, el JSON y el almacén están en js/modelo/programa.js; aquí no hay reglas del robot.
//   const g = crearGestorProgramas({ P, parsear, almacen, integrados, alUsar(prog), alAviso(texto) });
//   g.abrir()   g.actual() → { nombre, descripcion, ciclico, lineas }   g.usar(prog)
// opc.puntos() (opcional) → [{ n, pose:{x,y,z,p,r} }]: el botón «Desde puntos» escribe un programa con un MP por punto.
// Un programa es { nombre, descripcion, ciclico, lineas:[…] }. Los integrados no se pueden borrar ni sobrescribir (se guardan como copia).

export function crearGestorProgramas(opc) {
  const { P, parsear, almacen } = opc;
  const integrados = opc.integrados || [];
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  const dlg = el('dialog', 'pg');
  dlg.setAttribute('aria-label', 'Programas');
  const cab = el('div', 'pg-cab'); cab.append(el('b', '', 'Programas'));
  const cerrar = el('button', 'pg-x', '✕'); cerrar.type = 'button'; cerrar.setAttribute('aria-label', 'Cerrar'); cab.append(cerrar);

  const fila1 = el('div', 'pg-fila');
  const lblSel = el('label', '', 'Programa'); const sel = el('select'); lblSel.append(sel);
  const lblNom = el('label', '', 'Nombre'); const nombre = el('input'); nombre.type = 'text'; nombre.maxLength = 60; lblNom.append(nombre);
  fila1.append(lblSel, lblNom);

  const lblDes = el('label', '', 'Descripción'); const desc = el('input'); desc.type = 'text'; desc.maxLength = 300; lblDes.append(desc);
  const lblCic = el('label', 'pg-check'); const cic = el('input'); cic.type = 'checkbox'; lblCic.append(cic, document.createTextNode(' Repetir en bucle (cíclico)'));

  const lblTxt = el('label', '', 'Líneas (una por línea; «#» o «;» inicia un comentario)');
  const txt = el('textarea'); txt.rows = 14; txt.spellcheck = false; txt.setAttribute('autocomplete', 'off'); lblTxt.append(txt);
  const ayuda = el('div', 'pg-ayuda', 'Comandos de la controladora: NT, SP n, GO, GC, MP x,y,z,p,r, MJ q1,…,q5, DJ eje,grados, DS dx,dy,dz, TL n, HE n, MO n…');
  const msg = el('div', 'pg-msg'); msg.setAttribute('role', 'status');

  const botones = el('div', 'pg-botones');
  const b = (t, cls) => { const x = el('button', cls || '', t); x.type = 'button'; botones.append(x); return x; };
  const bNuevo = b('Nuevo'), bPuntos = b('Desde puntos'), bGuardar = b('Guardar'), bBorrar = b('Eliminar'), bVal = b('Validar');
  const bImp = b('Importar JSON…'), bExp = b('Exportar JSON'), bExpT = b('Exportar todos');
  const bUsar = b('Usar este programa', 'pg-primario');
  const fichero = el('input'); fichero.type = 'file'; fichero.accept = '.json,application/json'; fichero.hidden = true; fichero.multiple = true;

  dlg.append(cab, fila1, lblDes, lblCic, lblTxt, ayuda, msg, botones, fichero);
  document.body.appendChild(dlg);

  let nombreCargado = null;     // nombre del programa tal y como está en la lista (para saber si el editor se ha modificado)

  const esIntegrado = (n) => integrados.some((p) => p.nombre === n);
  const aviso = (t, mal) => { msg.textContent = t || ''; msg.classList.toggle('mal', !!mal); };
  const todos = () => integrados.concat(almacen.listar().filter((p) => !esIntegrado(p.nombre)));
  const leerEditor = () => ({ nombre: nombre.value.trim(), descripcion: desc.value.trim(), ciclico: cic.checked, lineas: txt.value.split(/\r?\n/) });

  function refrescarLista(seleccion) {
    sel.textContent = '';
    for (const p of todos()) { const o = el('option', '', (esIntegrado(p.nombre) ? '★ ' : '') + p.nombre); o.value = p.nombre; sel.append(o); }
    if (seleccion) sel.value = seleccion;
  }
  function mostrar(p) {
    nombre.value = p.nombre; desc.value = p.descripcion || ''; cic.checked = !!p.ciclico; txt.value = p.lineas.join('\n');
    nombreCargado = p.nombre;
    bBorrar.disabled = esIntegrado(p.nombre);
    aviso(esIntegrado(p.nombre) ? 'Programa integrado: para cambiarlo, edítalo y guárdalo con otro nombre.' : '');
  }
  function validarEditor() {
    const p = leerEditor();
    if (!p.nombre) { aviso('Falta el nombre del programa.', true); return null; }
    const v = P.validar(p.lineas, parsear);
    if (!v.ok) { aviso('Errores: ' + v.errores.slice(0, 5).map((e) => (e.n ? 'línea ' + e.n + ' «' + e.linea + '» (' + e.motivo + ')' : e.motivo)).join(' · ') + (v.errores.length > 5 ? ' · …' : ''), true); return null; }
    return Object.assign(p, { lineas: P.limpiar(p.lineas) });
  }
  function nombreLibre(base) {
    let n = base, k = 2; const usados = new Set(todos().map((p) => p.nombre));
    while (usados.has(n)) n = base + ' (' + k++ + ')';
    return n;
  }

  sel.addEventListener('change', () => { const p = todos().find((x) => x.nombre === sel.value); if (p) mostrar(p); });
  bNuevo.addEventListener('click', () => {
    mostrar({ nombre: nombreLibre('Programa nuevo'), descripcion: '', ciclico: false, lineas: ['NT', 'SP 3', 'GO', '# MP x,y,z,p,r  (mm y grados)', 'MP 300,0,150,-90,0'] });
    nombreCargado = null; sel.value = ''; bBorrar.disabled = true; aviso('Programa nuevo: escribe las líneas y pulsa Guardar.');
  });
  // Programa a partir de los puntos del pendant (HE n). Se usa MP con las coordenadas, no MO n, para que el programa
  // no dependa de la memoria de posiciones de la controladora y funcione igual en otro equipo o en el robot real.
  bPuntos.addEventListener('click', () => {
    const ps = opc.puntos ? opc.puntos() : [];
    if (!ps.length) { aviso('No hay puntos: guárdalos antes con HE en el pendant.', true); return; }
    const f = (v) => String(Math.round(v * 10) / 10);
    const lineas = ['# Generado desde los puntos del pendant. Añade GO (abrir) y GC (cerrar) donde toque.', 'NT', 'SP 3'];
    for (const p of ps) lineas.push('MP ' + [p.pose.x, p.pose.y, p.pose.z, p.pose.p, p.pose.r].map(f).join(',') + '   # punto ' + p.n);
    mostrar({ nombre: nombreLibre('Desde puntos'), descripcion: ps.length + ' puntos del pendant', ciclico: false, lineas });
    nombreCargado = null; sel.value = ''; bBorrar.disabled = true;
    aviso('Programa creado con ' + ps.length + ' puntos. Revísalo, añade la pinza y pulsa Guardar.');
  });
  bVal.addEventListener('click', () => { const p = validarEditor(); if (p) aviso('Correcto: ' + p.lineas.length + ' líneas válidas.'); });
  bGuardar.addEventListener('click', () => {
    const p = validarEditor(); if (!p) return;
    if (esIntegrado(p.nombre)) { p.nombre = nombreLibre(p.nombre + ' (copia)'); nombre.value = p.nombre; }
    if (!almacen.guardar(p)) { aviso('No se pudo guardar en este navegador (almacenamiento bloqueado o lleno). Usa «Exportar JSON» para no perderlo.', true); return; }
    refrescarLista(p.nombre); nombreCargado = p.nombre; bBorrar.disabled = false; aviso('Guardado «' + p.nombre + '» en este navegador.');
  });
  bBorrar.addEventListener('click', () => {
    const n = nombre.value.trim();
    if (!n || esIntegrado(n) || !almacen.obtener(n)) { aviso('Solo se pueden eliminar programas guardados.', true); return; }
    if (!window.confirm('¿Eliminar «' + n + '» de este navegador?')) return;
    almacen.borrar(n); refrescarLista(); const p = todos()[0]; if (p) { sel.value = p.nombre; mostrar(p); } aviso('Eliminado «' + n + '».');
  });
  bUsar.addEventListener('click', () => {
    const p = validarEditor(); if (!p) return;
    if (!opc.alUsar(p)) { aviso('No se puede cambiar de programa mientras se ejecuta otro: páralo antes.', true); return; }
    dlg.close();
  });

  // ---- exportar / importar (JSON de intercambio, formato rvm1-programa v1)
  function descargar(nombreFichero, texto) {
    const blob = new Blob([texto], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombreFichero;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  const slug = (t) => (t || 'programa').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'programa';
  bExp.addEventListener('click', () => {
    const p = validarEditor(); if (!p) return;
    descargar('programa-' + slug(p.nombre) + '.json', P.aJSON(p)); aviso('Exportado «' + p.nombre + '».');
  });
  bExpT.addEventListener('click', () => {
    const lista = todos();
    descargar('programas-rvm1.json', JSON.stringify({ formato: P.FORMATO, version: P.VERSION, programas: lista }, null, 2)); aviso('Exportados ' + lista.length + ' programas.');
  });
  bImp.addEventListener('click', () => fichero.click());
  fichero.addEventListener('change', async () => {
    const nuevos = [], errores = [];
    for (const f of fichero.files) {
      let texto; try { texto = await f.text(); } catch (e) { errores.push(f.name + ': no se pudo leer'); continue; }
      const r = P.deJSON(texto, parsear);
      nuevos.push(...r.programas); errores.push(...r.errores.map((x) => f.name + ' · ' + x));
    }
    fichero.value = '';
    let ultimo = null, copias = 0;
    for (const p of nuevos) {
      if (esIntegrado(p.nombre)) { p.nombre = nombreLibre(p.nombre + ' (importado)'); copias++; }
      if (almacen.guardar(p)) ultimo = p;
    }
    refrescarLista(ultimo && ultimo.nombre); if (ultimo) mostrar(ultimo);
    const partes = [];
    if (nuevos.length) partes.push('Importados ' + nuevos.length + (copias ? ' (' + copias + ' con otro nombre por coincidir con uno integrado)' : ''));
    if (errores.length) partes.push('Rechazados: ' + errores.slice(0, 3).join(' · ') + (errores.length > 3 ? ' · …' : ''));
    aviso(partes.join('. ') || 'No se importó nada.', errores.length > 0 && nuevos.length === 0);
  });
  cerrar.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  return {
    abrir() {
      refrescarLista(nombreCargado && todos().some((p) => p.nombre === nombreCargado) ? nombreCargado : null);
      if (!nombreCargado) { const p = todos()[0]; if (p) mostrar(p); }
      if (!dlg.open) dlg.showModal();
    },
    mostrar,
    elemento: dlg
  };
}
