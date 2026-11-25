# E2 — Fidelidad del gemelo digital: coherencia con la controladora (E2a) y fidelidad física (E2b)

Versión 1 (2026-11-25). Responde a PI2 (aportación A3). Requiere E1.0 cerrado (definición de `hecho`, resolución de `WH`) y, si se calibra el modelo de tiempos del gemelo, el bloque T de E1.

## Pregunta de investigación

- **E2a (coherencia):** con la misma secuencia de órdenes enviada a `rvm1/real/01` y a `rvm1/gemelo/01`, ¿cuánto difiere la pose final del gemelo de la que devuelve `WH` (mm y grados)? ¿Coinciden los ACK (`aceptado`/`hecho`/`error`/`rechazado`)? ¿Cuánto difiere la duración entre `aceptado` y `hecho`?
- **E2s (modo sincronizado):** ¿con qué retardo refleja el gemelo una pose nueva del robot real?
- **E2b (fidelidad física):** en 8 poses, ¿cuánto difieren el gemelo y `WH` de la posición del TCP medida con una referencia externa registrada en la base del robot?

## Observación de diseño que condiciona todo E2

Con órdenes **cartesianas** (`mover_pose`, `jog_mundo`), tanto `WH` como el gemelo devuelven, salvo redondeo y límites, la pose ordenada: el error de coherencia sería casi cero por construcción y no diría nada del modelo. La diferencia aparece con órdenes **articulares** (`jog_articular`), donde la pose sale de la cinemática directa de cada uno (la de la D/U-M1 frente a la de `config_rvm1.js`). Por eso los programas y el análisis se separan por tipo de orden, y **la métrica principal de coherencia se calcula sobre los pasos articulares**. Los pasos cartesianos sirven para comprobar la semántica (ACK, límites, errores, tiempos).

## Hipótesis (umbrales fijados a priori)

- H2.1: en los pasos articulares, el RMSE de posición del TCP gemelo–`WH` es ≤ 1 mm y el error absoluto de `pitch` y `roll` ≤ 0,5° (1 mm ≈ 3 veces la repetibilidad de catálogo, 0,3 mm, y 10 veces la resolución esperada de `WH`).
- H2.2: la secuencia de estados de ACK coincide en el 100 % de los pasos, incluidos los de error.
- H2.3: la mediana del error relativo de la duración `aceptado`→`hecho` del gemelo frente al real es ≤ 10 %.
- H2.4: en E2b, el error gemelo–referencia externa no supera al error `WH`–referencia externa en más de la incertidumbre expandida de la medida (el gemelo es tan fiel como la propia controladora).

Si no se cumplen, se informa el valor medido y se ajusta la afirmación del artículo; los umbrales no se cambian a la vista de los datos.

## Variables

- **Independientes:** programa (10), tipo de paso (articular, cartesiano, pinza, velocidad, error), repetición (3); en E2b, pose (8) y modo de llegada (cartesiano o articular).
- **Dependientes:** Δx, Δy, Δz, ‖Δp‖ (mm), Δpitch, Δroll (°), coincidencia de ACK, duración `aceptado`→`hecho` de cada destino, retardo de observación (E2s), error frente a la referencia externa (E2b).
- **Controladas:** versión y parámetros del gemelo **congelados** (commit anotado; `config_rvm1.js` revisado con el plano del manual antes de E2; si se calibra el modelo de tiempos con E1-T, se hace antes y se anota), `TL` igual en robot y gemelo, `SP` ≤ 4, pinza vacía (E2a), mismo PC para el cliente y el navegador del gemelo.

## Montaje

**Precondiciones**
- Robot reparado; 10 min de calentamiento (movimientos de E1-T o similares) antes de E2b, porque las holguras cambian con la temperatura.
- Placa elegida y puente del contrato v0.4 instrumentado. E1.0 cerrado.
- NTP en placa y PC (desfase < 10 ms) para que no haya rechazos por `caducado`.
- Gemelo servido desde `broker/` (nginx o `servidor_web.py`, que da `/hora`), abierto en el PC del experimento en **modo SOMBRA** con `idReal = 01`, conectado como `profesor`.
- **Cliente doble** `codigo/experimentos/e2_cliente.py` (pendiente, `ingeniero`): lee un programa, envía cada paso a `real/01` y a `gemelo/01` (mismo `cmd` y `args`, `id` y `destino` propios), espera el `hecho`/`error`/`rechazado` de **los dos** (o 30 s) y la `posicion/mundo` siguiente de cada uno, y pasa al siguiente. Registra todo con un solo reloj (el del PC).
- Los 10 programas se escriben en `codigo/experimentos/e2_programas.json`, se prueban enteros en el gemelo (ensayo en seco; registros a `datos_simulados/E2/`) y se congelan; su SHA-256 va en la nota inicial.

**Programas de E2a** (10–12 pasos cada uno; cada programa empieza con `home` y `velocidad 2`)

| Prog. | Contenido | Qué comprueba |
|---|---|---|
| P01 | `home` y lectura | Pose de origen tras `NT` |
| P02 | `jog_articular` en J1 (±10°, ±45°) | Cintura, signo y escala |
| P03 | `jog_articular` en J2 y J3 (±5° a ±20°) | Longitudes de brazo y antebrazo, ceros |
| P04 | `jog_articular` en J4 y J5 | Cabeceo absoluto (P = J2+J3+J4) y giro |
| P05 | Combinaciones de los 5 ejes (articular) | Cinemática directa completa |
| P06 | `jog_mundo` en X, Y, Z (±5 a ±30 mm) | Recta incremental `DS` |
| P07 | `mover_pose` a 4 poses repartidas | Cinemática inversa, redondeo |
| P08 | `mover_pose` con cambios de `pitch` y `roll` | Orientación |
| P09 | Mezcla articular + cartesiana con `pinza` y `velocidad` 2→4→2 | Tiempos con `SP`, pinza |
| P10 | `mover_pose` claramente inalcanzable (x = 600 mm), `reset`, `home` | Error de modo II y estados |

**Medida externa de E2b (método barato propuesto)**

*Punta y contacto.* En la pinza se sujeta una punta rígida coaxial (punzón o clavo afilado en un soporte impreso en 3D). La longitud brida–punta se mide con el calibre y se fija como `TL` en el robot y en el gemelo. El contacto con la placa de referencia se detecta con el **método del papel de fumar**: se baja en pasos de 0,1 mm, con la mano fuera, y entre paso y paso se comprueba si el papel (≈ 0,02–0,05 mm, espesor medido con el calibre en un paquete de 10 hojas) queda pisado. Tras el contacto se baja 0,2 mm más para dejar una marca en un papel fijado sobre la placa.

*Placa de referencia.* Tablero plano (MDF o aluminio) fijado a la mesa, con una escuadra de acero atornillada que define los ejes del papel (u, v). Se mide la altura de su superficie sobre el plano de apoyo de la base del robot con el calibre (sonda de profundidad), en 4 puntos, para comprobar también que está plana. Para la segunda altura se usa un bloque de altura conocida, medido con el calibre.

*Registro en la base del robot.* El eje de J1 define el origen en XY sin depender de las longitudes del modelo:
1. Con la punta a un radio de unos 250 mm, se marcan 7 contactos girando **solo J1** (`jog_articular` eje 1) a −90°, −60°, …, +90°.
2. Se ajusta una circunferencia a las 7 marcas (mínimos cuadrados geométricos): su centro es la proyección del eje de J1 y define el origen (x, y) = (0, 0).
3. La marca con J1 = 0 (comprobada con `WH`, y ≈ 0) define la dirección del eje X.
4. Para Z, la referencia es el plano de apoyo de la base. El origen de Z de `WH` se toma del manual del RV-M1; si el manual no lo deja claro, se estima como la media de las diferencias en las poses y **solo se informa de la variación de z entre poses**, declarándolo.

*Lectura de las marcas.* Coordenadas (u, v) de cada marca con el calibre desde los dos cantos de la escuadra (dos lecturas por marca, con lupa). Alternativa si se dispone: escanear la hoja a 600 ppp junto a una regla de acero para calibrar la escala.

*Orientación.* `pitch` se mide con un inclinómetro digital apoyado en una cara plana de la pinza, tras comprobar con el mismo instrumento la inclinación de la mesa. `roll` no se mide externamente; se declara.

*Presupuesto de incertidumbre (se estima en la sesión, antes de medir las 8 poses):*

| Componente | Cómo se estima | Tipo |
|---|---|---|
| Lectura del calibre | especificación del fabricante (p. ej. ±0,03 mm) | B |
| Centro de la marca | desviación de 5 lecturas repetidas de una misma marca | A |
| Excentricidad de la punta | 4 marcas en la misma pose con `roll` 0/90/180/270°: radio de la circunferencia | A |
| Centro del eje de J1 | error típico del ajuste de la circunferencia (residuos) | A |
| Dirección del eje X | dispersión angular, propagada al radio de cada pose | A |
| Detección del contacto (Z) | paso de 0,1 mm (distribución rectangular) + espesor del papel | B |
| Altura de la placa | desviación de las 4 medidas del calibre | A |
| Inclinómetro | especificación (p. ej. ±0,2°) + nivel de la mesa | B |

Incertidumbre típica combinada por suma cuadrática, expandida con k = 2 (U95). **Condición de validez fijada a priori:** U95 ≤ 1 mm en XY y ≤ 0,5 mm en Z. Si no se alcanza, E2b se informa como cota ("el error es menor que U95") y no como medida.

*Alternativa (no principal):* cámara cenital con marcadores ArUco en la pinza y en la base. Más rápida, pero la calibración de la cámara y el error en profundidad la hacen menos fiable que el contacto para resolver errores de 1 mm con material del aula.

**Poses de E2b (8):** con la punta vertical (`pitch` = −90°), repartidas a 3 radios (≈ 200, 280 y 350 mm) y a ambos lados de X, en dos alturas (placa y bloque). 4 se alcanzan con `mover_pose` y 4 con secuencias de `jog_articular` desde `home` (solo el último tramo de acercamiento, ≤ 10 mm, es cartesiano). 2 de las 8 se repiten además con `pitch` = −45° y 0° para el inclinómetro, sin marcar. Cada pose, 3 veces, llegando siempre desde la misma dirección (desde arriba) para no mezclar holguras.

## Procedimiento paso a paso (lo ejecuta Álvar)

**E2a — Coherencia (≈ 1 h 30 min)**
1. Arrancar broker, placa, gemelo (SOMBRA, registro activado) y analizador (como testigo de la línea serie). `home` en los dos destinos.
2. Ejecutar los 10 programas × 3 repeticiones con el cliente doble. Orden de los programas aleatorio en cada repetición (sorteo anotado antes). Entre programas, nada: cada uno empieza con `home`.
3. Durante E2a **no** hay otros clientes conectados al bus (para no contaminar los tiempos, menor N6 de la revisión).
4. Al terminar, descargar el registro del gemelo (barra de conexión → Registro → Descargar) y copiar los de la placa y del cliente.

**Bloque multicliente (demostración de A3 (d), 15 min, aparte)**
5. Conectar dos gemelos más en otros navegadores (usuarios `alumnoNN`, modo SOMBRA del real) y un observador `mosquitto_sub -t 'rvm1/#'` como `profesor`. Repetir P07 tres veces. Se comprueba que los gemelos de alumnos no reciben órdenes del real ni pueden publicar en él (ACL) y se comparan los tiempos con E2a de forma descriptiva.

**E2s — Modo sincronizado (20 min)**
6. Gemelo en modo SINCRONIZADO en el mismo PC que el cliente. 20 movimientos de `jog_articular` (±10° en J1) al real. Para cada uno, el registro da en el reloj de pared del PC el `hecho` recibido por el cliente y la primera `pos` del gemelo con la pose nueva.
7. (Opcional, solo si existe la *teaching box* física de la D/U-M1 y se puede usar con la placa conectada) 5 movimientos desde la *teaching box*: se comprueba si el gemelo los refleja y cuándo (la placa solo los ve en su sondeo de `WH`).

**E2b — Fidelidad física (≈ 3 h 30 min)**
8. Montar la placa de referencia, medir su altura y la del bloque, fijar el papel y la escuadra. Fotografiar el montaje.
9. Medir el espesor del papel de fumar y la longitud de la punta; fijar `TL` en los dos destinos.
10. Estimar la excentricidad de la punta (4 marcas con `roll` 0/90/180/270°) y la repetibilidad de lectura (5 lecturas de una marca).
11. Registro: 7 marcas girando J1. Anotar el `WH` de cada contacto.
12. Para cada una de las 8 poses × 3 repeticiones: aproximación a 10 mm por encima con el cliente doble; bajada en pasos (5 mm, 1 mm y luego 0,1 mm) enviados a los dos destinos, con la prueba del papel **solo con el robot parado** (tras `hecho`); al pisar el papel, anotar el `WH` y bajar 0,2 mm para marcar; subir 10 mm. Numerar la marca a lápiz.
13. Las 2 poses de orientación: inclinómetro en la cara de la pinza, 3 lecturas.
14. Retirar el papel y medir (u, v) de todas las marcas con el calibre, dos veces cada una, en la hoja de medidas.
15. Escanear o fotografiar la hoja marcada; guardar con los registros.

## Seguridad

- Zona despejada (cinta a 1 m del eje de la base); seta física al alcance de la mano en todo momento.
- **SP máximo: 4 en E2a; SP 2 en E2b y en cualquier acercamiento a la placa de referencia.**
- Cada programa se ejecuta antes entero en el gemelo; la primera ejecución en el real se hace a SP 2 con la mano en la seta.
- P10: la pose inalcanzable se comprueba antes en el gemelo; si el robot real se mueve al recibirla, seta y fin del ensayo.
- E2b: la mano solo entra en la zona con el robot parado y tras `hecho`; nunca durante un movimiento. Pasos ≤ 0,1 mm cerca del contacto; la punta no debe flexar (si se nota flexión, se para).

## Datos que se registran

Carpeta `experimentos/datos_crudos/E2/`:

- `AAAAMMDD-HHMMSS_real_E2a-cliente.jsonl`: `cmd_tx` y `ack_rx` de los dos destinos, `pos` recibidas de los dos, y una `nota` por paso con programa, repetición, número de paso y tipo.
- `AAAAMMDD-HHMMSS_real_E2a-placa.jsonl` (eventos de la placa) y `..._analizador.sr`.
- `AAAAMMDD-HHMMSS_gemelo_E2a-sombra.jsonl`: registro del gemelo (`cmd_rx`, `ack_tx`, `serie_tx`/`serie_rx` de la controladora emulada, `pos` propias y `pos` del real con el error calculado en línea). **Se guarda en `datos_crudos/` porque es el registro del objeto bajo ensayo durante la sesión con el robot real**; los valores del gemelo llevan `nodo: "gemelo"` y nunca se presentan como medidas del robot.
- Ídem para el bloque multicliente (`..._E2a-multi-...`) y E2s (`..._E2s-...`).
- E2b: los mismos registros de cliente, placa y gemelo, más `AAAAMMDD-HHMMSS_externa_E2b-medidas.csv` (hoja de medidas manuales: marca, pose, repetición, u1, v1, u2, v2, altura, inclinómetro, observaciones), escaneo de la hoja y fotos del montaje. El CSV es una excepción al formato JSONL de la skill, porque se rellena a mano; es dato crudo e inmutable igual que los demás.
- Nota inicial en cada fichero: commit, versión del gemelo y SHA-256 de `config_rvm1.js` y de `e2_programas.json`, contrato 0.4, broker, red, placa, `TL`, resolución de `WH` (de E1.0), operador, semilla del sorteo; en E2b, además, instrumentos (marca, modelo, resolución) y espesor del papel.

## Análisis previsto (`analisis/analizar_E2.py`)

**E2a.**
- Unidad de análisis: el paso. Pose real = la `posicion/mundo` del real publicada tras su `hecho`; pose del gemelo = la suya tras su `hecho` (las dos registradas por el cliente). El error que el gemelo calcula en línea se usa solo como comprobación cruzada.
- Por paso: Δx, Δy, Δz, ‖Δp‖, Δpitch y Δroll (diferencias angulares envueltas a ±180°).
- Resumen separado por tipo de paso (articular / cartesiano): media y desviación típica por eje (sesgo, que apunta a errores de parámetros), RMSE, mediana y máximo de ‖Δp‖. **IC95 % por bootstrap por conglomerados (se remuestrean programas, B = 10 000)**, porque los pasos de un programa no son independientes. Errores por debajo de la resolución de `WH` se dan como "≤ resolución".
- Coincidencia de ACK: proporción de pasos con el mismo estado (y el mismo `er`) con IC95 % de Wilson; lista de discrepancias.
- Tiempos: T = `hecho` − `aceptado` de cada destino en el reloj del cliente; error relativo (T_gem − T_real) / T_real por paso de movimiento: mediana, p95 y máximo de su valor absoluto, por `SP`.
- Variabilidad del real entre repeticiones (desviación de `WH` en el mismo paso) como escala de referencia.
- Multicliente: tabla descriptiva (secuencias de ACK idénticas, tiempos frente a E2a); no entra en las cifras de E2a.

**E2s.** Retardo = t(primera `pos` del gemelo con la pose nueva) − t(`hecho` recibido por el cliente), en el reloj de pared del mismo PC: mediana, p95 y máximo (n = 20). Se compara con el periodo de publicación de `posicion/mundo` (500 ms en reposo).

**E2b.**
- Registro: ajuste de la circunferencia a las 7 marcas de J1 (centro, radio y residuos), transformación (u, v) → (x, y) con el centro y la marca de J1 = 0.
- Por pose y repetición: p_ext (x, y desde la marca; z = altura de la placa o del bloque + espesor del papel), p_WH y p_gem.
- Errores e_WH = p_WH − p_ext y e_gem = p_gem − p_ext en XY, Z y 3D; `pitch` frente al inclinómetro. Por pose, media de las 3 repeticiones; sobre las 8 poses, media, desviación, RMSE y máximo, cada uno con su U95. Con n = 8 no se hacen pruebas: H2.4 se evalúa comparando la diferencia de medianas |e_gem| − |e_WH| con U95. Separado por modo de llegada (cartesiano/articular).
- Incertidumbre: tabla del presupuesto con los valores obtenidos; combinación por propagación y, como comprobación, Monte Carlo (10 000 muestras) sobre la cadena completa (lecturas → circunferencia → transformación).

**Figura (artículo, una columna, dos paneles):** `analisis/figuras/E2_fidelidad.pdf`. (a) E2a: ‖Δp‖ por programa (puntos de cada paso y mediana), articulares y cartesianos con distinto marcador, línea en 1 mm y en la resolución de `WH`. (b) E2b: |e_WH| y |e_gem| por pose con barras de U95. Paleta Okabe-Ito, 8 pt, sin título.

**Tablas:** `analisis/resultados/E2a_pasos.csv`, `E2a_resumen.csv`, `E2a_ack.csv`, `E2a_tiempos.csv`, `E2s_retardo.csv`, `E2b_registro.csv`, `E2b_errores.csv`, `E2b_incertidumbre.csv`.

**Datos descartados:** pasos sin `hecho` de alguno de los dos destinos, o sin `posicion/mundo` posterior, salen del cálculo de errores y se cuentan. Repeticiones con incidencias anotadas (por ejemplo, marca doble o papel movido) se excluyen con su motivo.

**Si se recalibra el gemelo con estos datos** (por ejemplo, ajustando longitudes con E2a): es un análisis exploratorio aparte, con validación cruzada dejando fuera un programa cada vez, y nunca sustituye a las cifras con los parámetros congelados.

## Criterio de éxito

- **Validez:** 10 programas × 3 repeticiones completos (≥ 90 % de los pasos con ambas poses); en E2b, U95 dentro de los límites fijados y las 8 poses × 3 repeticiones medidas.
- **Hipótesis:** H2.1–H2.4 según los umbrales de arriba. El resultado se informa se cumplan o no.

## Amenazas a la validez

`WH` es la pose que calcula la controladora, no la física (de ahí E2b); un solo robot con holguras que cambian entre sesiones (se repite P01 al principio y al final de cada sesión como control); E2b no es un ensayo de exactitud de pose según ISO 9283 y no se presenta como tal; `roll` sin referencia externa.

## Salida para el artículo

Figura E2 (paneles a y b) y un párrafo con ACK, tiempos, E2s y multicliente.

**Duración estimada:** E2a + multicliente + E2s ≈ 2 h 30 min; E2b ≈ 3 h 30 min. Total ≈ 6 h, en dos sesiones.
