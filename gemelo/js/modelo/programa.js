// Preprograma cíclico del gemelo: ejecuta una lista de líneas de la controladora (NT, SP, MP, GO, GC…) una a una, esperando a que
// termine cada movimiento, y vuelve a empezar al acabar. Sin DOM: lo usan la app web y las pruebas de Node.
//   const p = crearPrograma({ controladora, lineas, ciclico: true, alCambiar });
//   p.iniciar()  p.parar()  p.tick()  (llamar a menudo: envía la siguiente línea cuando la controladora está libre)
//   p.estado() → { activo, paso, total, linea, vueltas, motivoParada }
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

  function crearPrograma(opc) {
    const ctrl = opc.controladora, lineas = opc.lineas, ciclico = opc.ciclico !== false;
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
      reiniciarVueltas() { vueltas = 0; }
    };
  }

  const X = { crearPrograma, cicloCubo };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.programa = X; }
})();
