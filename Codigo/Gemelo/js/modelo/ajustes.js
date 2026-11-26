// Ajustes del gemelo (pestaña «Configuración»): valores por defecto, validación y almacenamiento en el navegador. Sin DOM.
//   const A = ajustes.cargar(localStorage)   ajustes.guardar(localStorage, A)   ajustes.validar(obj) → ajustes completos y dentro de rango
//   pantalla: 'ambas' | 'pendant' | 'visor'   (qué se ve en esta página; ?ver= en la URL manda sobre este ajuste)
//   ejes, nave: se dibujan los ejes X/Y/Z y la nave de fondo
//   solidos: la mesa y la base no se atraviesan (el robot se detiene al tocarlas); si es false solo avisan en rojo
//   mando, zonaMuerta: mando de juego activo y zona muerta de las palancas (0,3–0,9)
//   velJog: velocidad de jog continuo por defecto (índice de CONT_SPEEDS: 0 lenta … 3 máx)
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;
  const CLAVE = 'rvm1.ajustes';
  const DEFECTOS = Object.freeze({ pantalla: 'ambas', ejes: true, nave: true, solidos: true, mando: true, zonaMuerta: 0.55, velJog: 1 });

  const num = (v, mn, mx, def) => { v = Number(v); return Number.isFinite(v) ? Math.min(mx, Math.max(mn, v)) : def; };
  const bool = (v, def) => (typeof v === 'boolean' ? v : def);

  function validar(o) {
    o = o && typeof o === 'object' ? o : {};
    return {
      pantalla: ['ambas', 'pendant', 'visor'].includes(o.pantalla) ? o.pantalla : DEFECTOS.pantalla,
      ejes: bool(o.ejes, DEFECTOS.ejes), nave: bool(o.nave, DEFECTOS.nave), solidos: bool(o.solidos, DEFECTOS.solidos), mando: bool(o.mando, DEFECTOS.mando),
      zonaMuerta: Math.round(num(o.zonaMuerta, 0.3, 0.9, DEFECTOS.zonaMuerta) * 100) / 100,
      velJog: Math.round(num(o.velJog, 0, 3, DEFECTOS.velJog))
    };
  }
  function cargar(storage) {
    try { return validar(JSON.parse(storage.getItem(CLAVE) || '{}')); } catch (e) { return validar({}); }
  }
  function guardar(storage, o) {
    try { storage.setItem(CLAVE, JSON.stringify(validar(o))); return true; } catch (e) { return false; }
  }

  const X = { DEFECTOS, CLAVE, validar, cargar, guardar };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.ajustes = X; }
})();
