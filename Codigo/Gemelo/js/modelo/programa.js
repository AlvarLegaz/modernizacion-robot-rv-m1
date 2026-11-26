// Preprograma cíclico del gemelo: ejecuta una lista de líneas de la controladora (NT, SP, MP, GO, GC…) una a una, esperando a que
// termine cada movimiento, y vuelve a empezar al acabar. Sin DOM: lo usan la app web y las pruebas de Node.
//   const p = crearPrograma({ controladora, lineas, ciclico: true, alCambiar });
//   p.iniciar()  p.parar()  p.tick()  (llamar a menudo: envía la siguiente línea cuando la controladora está libre)
//   p.estado() → { activo, paso, total, linea, vueltas, motivoParada }
//   limpiar(texto|lineas) → líneas útiles (sin vacías ni comentarios: «# …» o «; …»)
//   validar(lineas, parsear) → { ok, errores: [{ n, linea, motivo }] }        (n = nº de línea, desde 1, del texto original)
//   aJSON(prog) / deJSON(texto) → formato de intercambio { formato:'rvm1-programa', version:1, nombre, descripcion, ciclico, lineas }
//   crearAlmacen(storage) → { listar, obtener, guardar, borrar }   (localStorage del navegador; en pruebas, un objeto con getItem/setItem)
//   cicloCubo(escena) → líneas del ciclo «coger el cubo, dejarlo en la mesita, volver al origen, cogerlo y dejarlo en la mesa, volver al origen»
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;

  function cicloCubo(E, opc) {
    const o = Object.assign({ sp: 5, altura_segura: 100, z_agarre: 4.5 }, opc || {});
    const c = E.cubo.inicio, m = E.mesita, zs = o.altura_segura, za = o.z_agarre, zm = m.alto + o.z_agarre;
    const mp = (x, y, z) => `MP ${x},${y},${z},-90,0`;
    return [
      'NT', 'SP ' + o.sp, 'GO',
      // 1) coger el cubo de la mesa y dejarlo en la mesita
      mp(c.x, c.y, zs), mp(c.x, c.y, za), 'GC', mp(c.x, c.y, zs),
      mp(m.x, m.y, zs), mp(m.x, m.y, zm), 'GO', mp(m.x, m.y, zs),
      'NT',                                                   // volver al origen de referencia
      // 2) coger el cubo de la mesita y dejarlo otra vez en la mesa
      'GO', mp(m.x, m.y, zs), mp(m.x, m.y, zm), 'GC', mp(m.x, m.y, zs),
      mp(c.x, c.y, zs), mp(c.x, c.y, za), 'GO', mp(c.x, c.y, zs),
      'NT'
    ];
  }

  // ------------------------------------------------------------------ texto y validación
  const comoLineas = (t) => (Array.isArray(t) ? t : String(t == null ? '' : t).split(/\r?\n/)).map((x) => String(x));
  function limpiar(t) {
    return comoLineas(t).map((x) => x.replace(/\s*[#;].*$/, '').trim()).filter((x) => x.length > 0);
  }
  function validar(t, parsear) {
    const errores = [];
    let util = 0;
    comoLineas(t).forEach((crudo, k) => {
      const x = crudo.replace(/\s*[#;].*$/, '').trim();
      if (!x) return;
      util++;
      const r = parsear(x);
      if (!r.ok) errores.push({ n: k + 1, linea: x, motivo: r.motivo || 'sintaxis' });
    });
    if (util === 0) errores.push({ n: 0, linea: '', motivo: 'programa vacío' });
    return { ok: errores.length === 0, errores };
  }

  // ------------------------------------------------------------------ formato de intercambio (JSON)
  const FORMATO = 'rvm1-programa', VERSION = 1;
  function normalizar(p) {
    if (!p || typeof p !== 'object') return null;
    const lineas = Array.isArray(p.lineas) ? p.lineas.map(String) : (typeof p.lineas === 'string' ? comoLineas(p.lineas) : null);
    const nombre = typeof p.nombre === 'string' ? p.nombre.trim().slice(0, 60) : '';
    if (!lineas || !nombre) return null;
    return { nombre, descripcion: typeof p.descripcion === 'string' ? p.descripcion.slice(0, 300) : '', ciclico: p.ciclico === undefined ? true : (p.ciclico === true || p.ciclico === 'true'), lineas };
  }
  function aJSON(p) {
    const n = normalizar(p);
    if (!n) throw new Error('programa no válido');
    return JSON.stringify(Object.assign({ formato: FORMATO, version: VERSION }, n), null, 2);
  }
  // Acepta un programa, {programas:[…]} o una lista. Devuelve { programas, errores:[texto] }.
  function deJSON(texto, parsear) {
    let d;
    try { d = JSON.parse(texto); } catch (e) { return { programas: [], errores: ['no es un JSON válido: ' + e.message] }; }
    const lista = Array.isArray(d) ? d : (d && Array.isArray(d.programas) ? d.programas : [d]);
    const programas = [], errores = [];
    lista.forEach((x, i) => {
      if (x && typeof x === 'object' && x.formato !== undefined && x.formato !== FORMATO) { errores.push('programa ' + (i + 1) + ': formato «' + x.formato + '» desconocido'); return; }
      if (x && typeof x === 'object' && x.version !== undefined && x.version > VERSION) { errores.push('programa ' + (i + 1) + ': versión ' + x.version + ' más nueva que la que entiende el gemelo'); return; }
      const n = normalizar(x);
      if (!n) { errores.push('programa ' + (i + 1) + ': falta «nombre» o «lineas»'); return; }
      if (parsear) {
        const v = validar(n.lineas, parsear);
        if (!v.ok) { errores.push('«' + n.nombre + '»: ' + v.errores.slice(0, 3).map((e) => (e.n ? 'línea ' + e.n + ' «' + e.linea + '» (' + e.motivo + ')' : e.motivo)).join('; ')); return; }
      }
      programas.push(n);
    });
    return { programas, errores };
  }

  // ------------------------------------------------------------------ almacén de programas del usuario
  function crearAlmacen(storage, clave) {
    const K = clave || 'rvm1.programas';
    const leer = () => { try { const d = JSON.parse(storage.getItem(K) || '[]'); return Array.isArray(d) ? d.map(normalizar).filter(Boolean) : []; } catch (e) { return []; } };
    const escribir = (l) => { try { storage.setItem(K, JSON.stringify(l)); return true; } catch (e) { return false; } };
    return {
      listar: () => leer(),
      obtener: (nombre) => leer().find((p) => p.nombre === nombre) || null,
      guardar(p) { const n = normalizar(p); if (!n) return false; const l = leer(); const i = l.findIndex((x) => x.nombre === n.nombre); if (i >= 0) l[i] = n; else l.push(n); return escribir(l); },
      borrar(nombre) { return escribir(leer().filter((p) => p.nombre !== nombre)); }
    };
  }

  function crearPrograma(opc) {
    const ctrl = opc.controladora; let lineas = limpiar(opc.lineas), ciclico = opc.ciclico !== false;
    let activo = false, i = 0, vueltas = 0, esperando = false, motivo = null;
    const avisar = () => { if (opc.alCambiar) opc.alCambiar(); };
    return {
      iniciar() { activo = true; i = 0; esperando = false; motivo = null; vueltas = vueltas || 0; avisar(); },
      parar(m) { if (!activo) return; activo = false; motivo = m || 'parado'; avisar(); },
      tick() {
        if (!activo) return;
        const e = ctrl.estado();
        if (e.err !== 0) { this.parar('error ER=' + e.err + (e.motivoError ? ' (' + e.motivoError + ')' : '')); return; }
        if (e.ocupado || e.cola) return;                         // la línea anterior aún se está ejecutando
        if (esperando) { esperando = false; }
        if (i >= lineas.length) {
          vueltas++;
          if (!ciclico) { activo = false; motivo = 'terminado'; avisar(); return; }
          i = 0;
        }
        ctrl.enviar(lineas[i]); i++; esperando = true; avisar();
      },
      estado: () => ({ activo, paso: i, total: lineas.length, linea: i > 0 ? lineas[i - 1] : '', vueltas, motivoParada: motivo }),
      lineas: () => lineas.slice(),
      cargar(nuevas, cicl) { if (activo) return false; lineas = limpiar(nuevas); ciclico = cicl !== false; i = 0; vueltas = 0; motivo = null; avisar(); return true; },
      get ciclico() { return ciclico; },
      reiniciarVueltas() { vueltas = 0; }
    };
  }

  const X = { crearPrograma, cicloCubo, limpiar, validar, aJSON, deJSON, crearAlmacen, FORMATO, VERSION };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.programa = X; }
})();
