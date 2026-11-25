// Configuración de la ESCENA de prácticas del gemelo: cubo, mesita y volúmenes de colisión. Sin lógica.
// Coordenadas del robot (mm): origen en el eje J1 al nivel de la mesa de trabajo; Z hacia arriba (la cara superior de la mesa es Z = 0).
// Posiciones alcanzables con la pinza vertical (P = -90°, comprobado con la cinemática inversa a Z desde 4,5 hasta 200 mm).
(function () {
  'use strict';

  const ESCENA = {
    version: '0.1.0',
    cubo: { lado: 25, inicio: { x: 260, y: -150 }, color: 0xff5a1f },          // cubo naranja de 25 mm sobre la mesa
    mesita: { largo: 100, ancho: 100, alto: 40, x: 260, y: 150, color: 0x3d6fb4 }, // mesita baja de 100 × 100 × 40 mm
    // La mesa de trabajo (cara superior en Z = 0). Debe coincidir con la mesa de render3d/escena.js (centrada en x = 150 mm).
    mesa: { x_min: -450, x_max: 750, y_min: -400, y_max: 400 },
    // Agarre: al cerrar la pinza (apertura ≤ cierre_max) con el cubo entre los dedos queda sujeto.
    agarre: {
      tolerancia_xy: 10,       // mm entre el TCP y el centro del cubo, en el plano
      tolerancia_z: 12,        // mm de desviación vertical admitida
      desfase_z: 8,            // el centro del cubo agarrado queda 8 mm por encima del TCP (la punta de los dedos)
      cierre_max: 0.5,         // apertura (0 cerrada … 1 abierta) por debajo de la cual se considera «cerrada»
      apertura_cubo: 0.33      // apertura a la que los dedos quedan apoyados en el cubo (para dibujar)
    },
    caida_mm_s2: 9810,         // caída libre simple al soltar
    // Volúmenes envolventes (mm). La mano se divide en cuerpo y dedos; los dedos no chocan con el cubo que van a coger.
    colision: {
      radio_brazo: 42, radio_antebrazo: 30, radio_mano: 24, radio_dedos: 4, largo_dedos: 55,
      holgura: 1,              // mm de penetración tolerada (contacto sin chocar)
      base: { x_min: -95, x_max: 95, y_min: -95, y_max: 95, z_max: 125 }   // pedestal de la base
    }
  };

  const nodo = typeof module !== 'undefined' && module.exports;
  if (nodo) module.exports = ESCENA;
  else { window.RVM1 = window.RVM1 || {}; window.RVM1.escena = ESCENA; }
})();
