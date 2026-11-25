# Encargo: gemelo digital v2 (para los agentes en local)

Fecha: 25/11/2026. Encargo de Álvar para el agente `ingeniero`, trabajando en `gemelo/`. Lee antes `CLAUDE.md`, `gemelo/README.md` y `docu/contrato_mqtt.md` (v0.4).

Estado de partida: el gemelo v1 funciona (60 pruebas en `node --test gemelo/tests`). Nada de lo siguiente está empezado en `gemelo/`; el pendant de PC (`codigo/rvm1_pendant.py`) ya tiene hechos los puntos 2 y 3.

## 1. Modelo 3D parecido al RV-M1 real

Referencia: dos fotos del robot que tiene Álvar. Usar como referencia de **colores la amarillenta**, que resalta más con el fondo. Las fotos no se suben al repositorio público.

- **Base en dos niveles:** placa inferior cuadrada y, encima, pedestal prismático alto con un cajetín lateral trasero de conectores. Arriba del pedestal, el anillo de la cintura en gris oscuro.
- **Hombro:** carcasa alargada horizontal que se prolonga hacia atrás, con una tapa lateral redonda grande (tambor) en el eje del hombro. Detrás baja un **cable rizado negro** en espiral hasta la base.
- **Brazo:** caja rectangular con cantos redondeados, inclinada hacia arriba hasta el codo, que es una articulación redondeada.
- **Antebrazo:** más estrecho, sale del codo hacia delante, con tapa redondeada en el codo.
- **Muñeca y pinza:** cabeceo y giro al final del antebrazo, y pinza negra tipo caja con dos dedos paralelos.
- **Colores:** carcasas marfil o crema amarillento cálido; base y pedestal beige grisáceo algo más oscuro; anillos y tornillería gris oscuro; pinza y cable negros. Material satinado, no brillante.
- **Rótulos:** "MOVEMASTER EX" a lo largo del lateral del brazo, cerca del codo; "MITSUBISHI" pequeño en el cuerpo del hombro, junto a la tapa redonda. Van como **texto plano en tipografía neutra** (oscuro, EX en azul, MITSUBISHI en rojo), sin reproducir logotipos estilizados (ni los tres diamantes ni el "EX" estilizado).
- **Proporciones:** las cinemáticas de `config_rvm1.js` (los ejes de giro deben coincidir). Todo procedural en three.js, con el aspecto parametrizado en `ASPECTO`.
- **Verificación:** regenerar `gemelo/capturas/` y añadir `gemelo_robot_detalle.png` desde un ángulo parecido al de las fotos.

## 2. ENABLE como conmutador (simplificación didáctica)

- **Funcionamiento:** se pulsa **una vez** para habilitar y otra para deshabilitar, con el botón táctil o con la barra espaciadora. No hay que mantenerlo pulsado.
- **Indicador visible:** LED y botón en verde con el texto "HABILITADO".
- **Cuándo se deshabilita solo:** con STOP, al perder la conexión o al ocultar la página o cambiar de pestaña.
- **Documentación:** actualizar rótulos, ayuda del pie, README y pruebas. Indicar en el README que en un pendant real el dispositivo de habilitación es de tres posiciones y se mantiene pulsado.

## 3. Jog cartesiano más rápido

- **CONT en WORLD:** avance por tick en X/Y/Z unas 2,5 veces mayor (de 2 a 5 mm con el mismo periodo, escalado con SP). En PC ya está con `CONT_STEP_WORLD = 5.0`.
- **STEP:** añadir un incremento de 10 mm.
- **Límites:** sin superar los 1000 mm/s de la muñeca y sin saltos en la interpolación lineal.

## 4. Cubo, mesita, coger y dejar

- **Escena:** un cubo pequeño (unos 25 mm, color llamativo) sobre la mesa y una mesita baja (unos 100 × 100 × 40 mm) en otro punto. Los dos alcanzables con la pinza vertical, con las posiciones en un fichero de configuración de la escena.
- **Coger y soltar:**
  - Si se cierra la pinza (GC) con el cubo entre los dedos (con una tolerancia razonable), el cubo queda sujeto y se mueve con ella.
  - Al abrir (GO) cae sobre lo que tenga debajo, mesa o mesita, con una caída simple.
  - Hace falta un botón o comando para recolocar el cubo.
- **Modelo headless:** el estado del cubo (posición y si está agarrado) forma parte del modelo, para que funcione igual por MQTT desde Python.

## 5. Detección de colisiones (solo advertencia)

- **Cómo se detecta:** con volúmenes envolventes (cápsulas o cajas) por eslabón, la pinza y el cubo agarrado.
- **Contra qué:** la mesa, la mesita, el cubo suelto (salvo los dedos al cogerlo) y, si es sencillo, el antebrazo o la pinza contra la base.
- **Aviso:**
  - La vista 3D se tiñe de **rojo** un momento (0,5–1 s) con un rótulo grande **"COLISIÓN"**.
  - También sale en la línea de alarma del pendant.
  - **No detiene el robot** ni genera error de la controladora.
  - No se repite mientras siga en contacto: vuelve a avisar al separarse y volver a chocar.
- **Registro:** se anota en el JSONL como evento `colision`, con las piezas que chocaron.

## Entrega

- `node --test gemelo/tests` debe seguir pasando, con pruebas nuevas para el agarre y las colisiones.
- Capturas nuevas en `gemelo/capturas/` (escena con cubo y mesita, y aviso de colisión).
- Después: commit y push a `master`. Para redesplegar en Minaya Research basta con actualizar el repositorio en el PC, porque el contenedor `sim-rvm1` monta `gemelo/` en solo lectura. Si el navegador guarda la versión antigua en caché, recargar con Ctrl+F5.
