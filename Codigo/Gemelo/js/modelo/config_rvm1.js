// Configuración ÚNICA del gemelo digital del Mitsubishi Movemaster EX RV-M1.
// Todo dato geométrico, de límites o de temporización vive aquí. El resto de módulos lo lee; nadie más define números del robot.
//
// Leyenda:
//   (manual)   dato de especificación del RV-M1 recogido en Docu/referencias.md / ficha técnica.
//   VERIFICAR  dato provisional: hay que confirmarlo con el plano del manual o midiendo el robot real.
//
// Convenio de ángulos del gemelo (elegido aquí; el de la controladora real está por confirmar, VERIFICAR):
//   J1 (cintura): giro sobre el eje vertical Z. 0° = brazo hacia +X. Positivo antihorario visto desde arriba.
//   J2 (hombro): ángulo del brazo respecto a la horizontal. 0° = horizontal, positivo hacia arriba.
//   J3 (codo):   ángulo del antebrazo respecto al brazo. 0° = alineado; negativo = el antebrazo baja (codo arriba).
//   J4 (cabeceo): ángulo de la muñeca respecto al antebrazo. El cabeceo absoluto (P de WH/MP) es J2+J3+J4.
//   J5 (giro):   giro de la mano sobre su eje. R de WH/MP = J5.
//   P = -90° significa mano apuntando hacia abajo.
(function () {
  'use strict';

  const CONFIG = {
    version_gemelo: '0.1.0',
    version_contrato: '0.3',

    // ------------------------------------------------------------------ geometría (mm)
    geometria: {
      brazo: 250,                    // (manual) longitud hombro → codo
      antebrazo: 160,                // (manual) longitud codo → eje de cabeceo
      altura_hombro: 300,            // VERIFICAR con el plano del manual: altura del eje del hombro (J2) sobre el apoyo de la base
      cabeceo_a_brida: 72,           // VERIFICAR con el plano del manual: distancia del eje de cabeceo (J4) a la brida de la mano
      herramienta_defecto: 107       // VERIFICAR con el plano del manual: longitud de herramienta por defecto (TL) de la brida a la punta de la pinza
    },

    // ------------------------------------------------------------------ ejes
    // recorrido: (manual). min/max respecto al cero del convenio de arriba: VERIFICAR con el plano del manual.
    // vmax: velocidad máxima del eje en °/s (manual).
    ejes: [
      { id: 'J1', nombre: 'cintura', recorrido: 300, min: -150, max: 150, vmax: 120 },   // VERIFICAR con el plano del manual: reparto ±150
      { id: 'J2', nombre: 'hombro', recorrido: 130, min: -10, max: 120, vmax: 72 },      // VERIFICAR con el plano del manual: reparto -10..+120 desde la horizontal
      { id: 'J3', nombre: 'codo', recorrido: 110, min: -110, max: 0, vmax: 109 },        // VERIFICAR con el plano del manual: reparto -110..0 respecto al brazo
      { id: 'J4', nombre: 'cabeceo', recorrido: 180, min: -90, max: 90, vmax: 100 },     // (manual) ±90; cero respecto al antebrazo: VERIFICAR
      { id: 'J5', nombre: 'giro', recorrido: 360, min: -180, max: 180, vmax: 163 }       // (manual) ±180
    ],
    frenos: ['J2', 'J3'],            // (manual)
    carga_max_kg: 1.2,               // (manual) incluida la pinza
    vmax_muneca_mm_s: 1000,          // (manual) velocidad máxima en la muñeca
    repetibilidad_mm: 0.3,           // (manual)

    // ------------------------------------------------------------------ origen y arranque
    // Postura tras NT (origen mecánico). VERIFICAR con el robot real (anotar WH tras NT).
    origen: [0, 90, -90, -90, 0],
    // Postura al encender el gemelo (antes de NT). Igual que el origen salvo que se diga otra cosa.
    arranque: [0, 90, -90, -90, 0],
    duracion_nt_ms: 4000,            // VERIFICAR: duración típica del homing NT

    // ------------------------------------------------------------------ velocidad
    // Fracción de la velocidad máxima para cada SP 0..9. VERIFICAR: la tabla real de SP no está confirmada (supuesto lineal).
    fraccion_sp: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    sp_defecto: 4,                   // VERIFICAR: SP de la controladora al encender (el pendant fuerza SP 2 al conectar)
    rampa_ms: 150,                   // tiempo mínimo de cada movimiento (aceleración/frenado): VERIFICAR
    pinza_ms: 400,                   // VERIFICAR: tiempo de apertura/cierre de la pinza
    paso_lineal_mm: 2,               // muestreo de la recta DS para comprobar alcance

    // ------------------------------------------------------------------ comandos
    posiciones_max: 629,             // VERIFICAR: nº de posiciones HE/PD/MO (1..629 según la bibliografía consultada)
    tl_min: 0, tl_max: 300,          // VERIFICAR: rango aceptado por TL (mm)
    // Supuestos de comportamiento (skill rvm1-comandos, "Supuestos sin verificar"). Se pueden cambiar para el experimento de fidelidad.
    supuestos: {
      er_espera_fin_movimiento: true, // S1: ER no responde hasta terminar el movimiento anterior (base del ACK "hecho")
      jog_articular_sin_nt: true,     // S2: se acepta DJ/MJ antes de NT
      he_requiere_nt: true,           // HE/MO/PD con referencia: supuesto
      ignorar_en_error: true          // en error, solo se procesan RS, ER y WH; el resto se ignora (supuesto)
    },

    // ------------------------------------------------------------------ pasarela MQTT (contrato v0.3)
    contrato: {
      caducidad_ms: 500,
      adelanto_max_ms: 100,          // v0.3: ts más de 100 ms por delante del reloj del receptor → caducado
      desfase_max_ms: 100,
      ids_recordados: 256,
      ids_ventana_ms: 10000,
      periodo_actuadores_ms: 1000,
      periodo_posicion_ms: 500,
      // Desfase con la ruta /hora del servidor web del aula (algoritmo de Cristian: hora_servidor + RTT/2 − hora_local).
      periodo_hora_ms: 30000,
      // false (por defecto, contrato literal): el gemelo usa el reloj del navegador y, si su desfase medido supera 100 ms,
      // rechaza los comandos con 'reloj'. true: corrige su reloj con el desfase medido, como haría una placa con NTP
      // (decisión pendiente del autor; ver README).
      corregir_reloj_con_hora: false
    }
  };

  const nodo = typeof module !== 'undefined' && module.exports;
  if (nodo) module.exports = CONFIG;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.config = CONFIG; }
})();
