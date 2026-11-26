// Mando de juego (Gamepad API) para el pendant: cada botón del mando hace lo mismo que su botón en pantalla, así que se puede usar el
// ratón, el dedo o el mando indistintamente. Sin DOM: recibe una función que lee el mando y otra que ejecuta acciones del pendant.
//   const m = crearMando({ leer, accion, alCambio });   m.tick()  (una vez por fotograma)   m.estado() → { conectado, id }
//   leer() → { id, botones:[{pressed,value}], ejes:[…] } | null            (el primer mando conectado)
//   accion(nombre, ...args)  nombres: enable, stop, reset, home, abrir, cerrar, he, mo, coord, modo, incr, sp+, sp-, punto+, jog(eje 0..4, signo ±1), jogsoltar, deshabilitar
//   alCambio(conectado, id)  al conectar o desconectar el mando
//
// Asignación (disposición «standard», la de los mandos tipo Xbox/PlayStation):
//   Start ENABLE · B STOP · Back RESET · Y HOME · LB COORD · RB STEP/CONT · LT abrir · RT cerrar · A HE n · X MO n
//   Cruceta ↑/↓ SP +/− · cruceta ←/→ J5 −/+ · clic de palanca izquierda INCR · clic de palanca derecha punto siguiente
//   Palanca izquierda: eje 1 (X/J1) con ←→ y eje 2 (Y/J2) con ↑↓ · palanca derecha: eje 3 (Z/J3) con ↑↓ y eje 4 (P/J4) con ←→
// Seguridad: si el mando se desconecta se suelta el jog y se deshabilita el pendant. Solo se mueve un eje a la vez (el de más recorrido).
(function () {
  'use strict';
  const nodo = typeof module !== 'undefined' && module.exports;

  const B = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, BACK: 8, START: 9, LS: 10, RS: 11, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 };
  const POR_BOTON = {
    [B.START]: ['enable'], [B.B]: ['stop'], [B.BACK]: ['reset'], [B.Y]: ['home'], [B.LB]: ['coord'], [B.RB]: ['modo'],
    [B.LT]: ['abrir'], [B.RT]: ['cerrar'], [B.A]: ['he'], [B.X]: ['mo'], [B.UP]: ['sp+'], [B.DOWN]: ['sp-'], [B.LS]: ['incr'], [B.RS]: ['punto+']
  };
  const UMBRAL_ON = 0.55, UMBRAL_OFF = 0.35;      // histéresis de las palancas

  function crearMando(opc) {
    const leer = opc.leer, accion = opc.accion;
    let conectado = false, id = '', previos = [], jog = null;      // jog = [eje, signo] activo por el mando

    function soltarJog() { if (jog) { accion('jogsoltar'); jog = null; } }

    function tick() {
      const g = leer();
      if (!g) {
        if (conectado) { conectado = false; soltarJog(); accion('deshabilitar'); if (opc.alCambio) opc.alCambio(false, id); }
        previos = [];
        return;
      }
      if (!conectado) { conectado = true; id = g.id || ''; previos = []; if (opc.alCambio) opc.alCambio(true, id); }
      const val = (i) => { const b = g.botones[i]; return b ? (typeof b.value === 'number' && b.value > 0 ? b.value : (b.pressed ? 1 : 0)) : 0; };

      // botones: acción en el flanco de subida (los gatillos cuentan como pulsados a partir de 0,5)
      for (const k of Object.keys(POR_BOTON)) {
        const i = +k, on = val(i) >= 0.5, antes = !!previos[i];
        previos[i] = on;
        if (on && !antes) accion(POR_BOTON[k][0]);
      }

      // jog: el eje con más recorrido de palanca (o la cruceta ←/→ para J5)
      const e = g.ejes;
      const cand = [
        [0, e[0] || 0], [1, -(e[1] || 0)], [2, -(e[3] || 0)], [3, e[2] || 0],                     // LS-x → 1, LS-y → 2, RS-y → 3, RS-x → 4 (arriba = +)
        [4, val(B.RIGHT) >= 0.5 ? 1 : val(B.LEFT) >= 0.5 ? -1 : 0]
      ];
      let mejor = null;
      for (const [eje, v] of cand) {
        const a = Math.abs(v), actual = jog && jog[0] === eje;
        if (a >= (actual ? UMBRAL_OFF : UMBRAL_ON) && (!mejor || a > Math.abs(mejor[1]))) mejor = [eje, v];
      }
      if (!mejor) { soltarJog(); return; }
      const signo = mejor[1] > 0 ? 1 : -1;
      if (jog && jog[0] === mejor[0] && jog[1] === signo) return;
      soltarJog();
      jog = [mejor[0], signo];
      accion('jog', mejor[0], signo);
    }

    return { tick, estado: () => ({ conectado, id }), soltarJog };
  }

  const X = { crearMando, BOTONES: B };
  if (nodo) module.exports = X;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.mando = X; }
})();
