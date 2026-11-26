# E3 — Demostración funcional: coger y dejar, primero en el gemelo y después en el robot real

Versión 1 (2026-11-25). **No es un experimento con pregunta de investigación** (`Investigacion/Estado_del_Arte/huecos.md`, H6): la pose final la decide la D/U-M1 y no depende del canal, así que medirla caracterizaría el robot, no el puente. Se hace para mostrar el flujo de trabajo completo y para el material gráfico del artículo.

## Pregunta de investigación

Ninguna. Objetivo: mostrar que un mismo programa de coger y dejar, escrito contra el contrato MQTT, se prueba en el gemelo y se ejecuta en el robot real **cambiando solo el destino**.

## Hipótesis

No aplica. Se espera que el programa termine sin rechazos en el gemelo y en el real, y que el objeto acabe en la zona de destino.

## Variables

- **Independiente:** destino (`gemelo`, `real`).
- **Registradas:** éxito por ciclo, tiempo de ciclo, secuencia de ACK.
- **Fijas:** programa (congelado, SHA-256 en la nota), objeto, posiciones A y B, `SP` 3, `TL`.

## Montaje

**Precondiciones**
- Robot reparado y referenciado; placa con el puente v0.4; NTP con desfase < 10 ms; broker del aula.
- Gemelo abierto en modo EMULADOR (para la primera parte) o SOMBRA (para la parte real, si se quiere grabar el fantasma en pantalla).

**Material**
- Objeto: cubo de 30 mm impreso en 3D (o de madera), < 100 g (la carga admisible del RV-M1 es 1,2 kg con la pinza).
- Hoja en la mesa con dos cuadrados dibujados, A y B (35 × 35 mm), separados unos 200 mm, y un cuadrado de tolerancia de ±5 mm alrededor del centro de B.
- Móvil para vídeo y fotos.

**Programa** `Codigo/Software_Control/experimentos/e3_pick_place.py` (pendiente, `ingeniero`): `home` → `velocidad 3` → `pinza abrir` → `mover_pose` sobre A (+50 mm) → bajar a A → `pinza cerrar` → subir → `mover_pose` sobre B (+50 mm) → bajar → `pinza abrir` → subir → `mover_pose` sobre A (+50 mm). El ciclo siguiente lleva el cubo de B a A, para no tener que reponerlo a mano. El destino es un argumento (`--destino gemelo|real`); el resto del código no cambia. Las poses de A y B se enseñan antes con el pendant y se escriben en el programa.

## Procedimiento paso a paso (lo ejecuta Álvar)

1. **Gemelo (15 min).** Ejecutar 5 ciclos con `--destino gemelo`. Comprobar que todos los pasos reciben `aceptado` y `hecho`. Registros a `Investigacion/Experimentos/datos_simulados/E3/` (son del gemelo solo, sin robot).
2. **Primer ciclo real (10 min).** `--destino real`, `SP 2`, mano en la seta, sin objeto: comprobar que la trayectoria no roza la mesa. Luego un ciclo con objeto.
3. **Ciclos reales (30 min).** 30 ciclos seguidos a SP 3 (si alguno falla, se anota y se recoloca el cubo a mano antes del siguiente). Vídeo de al menos 3 ciclos.
4. **Captura para el artículo (15 min).** Foto o vídeo del gemelo y del robot real ejecutando el mismo paso (opcional: gemelo en SOMBRA con el fantasma del real).

## Seguridad

- Zona despejada (cinta a 1 m), seta física al alcance de la mano.
- **SP máximo: 3** (primer ciclo a SP 2, sin objeto).
- Las manos solo entran a recolocar el objeto con el robot parado y el programa detenido.
- Objeto ligero y sin aristas; nada más sobre la mesa dentro del alcance.

## Datos que se registran

- `Investigacion/Experimentos/datos_crudos/E3/AAAAMMDD-HHMMSS_real_E3-cliente.jsonl` y `..._E3-placa.jsonl`: `cmd_tx`, `ack_rx`, `pos`, y una `nota` por ciclo con el resultado observado (`exito: true/false` y causa si falla: no cogido, caído, fuera de tolerancia).
- `Investigacion/Experimentos/datos_simulados/E3/...`: los 5 ciclos del gemelo.
- Vídeos y fotos con su SHA-256.
- Nota inicial según `registro-experimentos`, más SHA-256 del programa y descripción del objeto.

**Criterio de éxito de un ciclo, fijado antes:** el objeto se coge, no cae y queda dentro del cuadrado de tolerancia de B (o de A, en los ciclos de vuelta), apoyado sobre una cara; todos los pasos reciben `hecho`.

## Análisis previsto (`Investigacion/Experimentos/analisis/analizar_E3.py`)

- Tasa de éxito n/30 con IC95 % de Wilson.
- Tiempo de ciclo (primer `cmd_tx` → último `hecho`, reloj del cliente): mediana, mínimo y máximo.
- Secuencia de ACK del gemelo frente a la del real (idéntica o no).
- Tabla `Investigacion/Experimentos/analisis/resultados/E3_ciclos.csv`. Sin figura de resultados.

**Lo que no se afirma:** precisión ni repetibilidad del robot; la tolerancia de ±5 mm solo define "éxito" para la demostración.

## Criterio de éxito

Demostración lograda si el mismo programa, sin más cambio que el destino, completa los 5 ciclos en el gemelo y los ciclos del real sin rechazos. Se informa la tasa de éxito que salga.

## Salida para el artículo

Dos o tres líneas en la sección 4 (tasa de éxito, tiempo de ciclo, programa sin cambios) y, si hay espacio, la foto en la sección 2.

**Duración estimada:** 1 h 30 min.
