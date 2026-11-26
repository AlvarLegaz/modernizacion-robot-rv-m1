# E4 — Salvaguardas del contrato por inyección de fallos

Versión 1 (2026-11-25). Responde a PI3 (aportación A2). Requiere E1.0 y E1 (el margen de la zona frontera se calcula con la latencia de E1).

## Pregunta de investigación

¿Rechaza el puente cada orden no válida con el motivo correcto y **sin mover el robot**? ¿Cuál es la cota superior al 95 % de la tasa de fallo en las reglas que dependen del tiempo? ¿Cuántas órdenes válidas rechaza por error? ¿Cuánto tarda en publicarse `offline` al cortar la placa?

## Hipótesis

- H4.1: ninguna orden no válida produce un movimiento (ni bytes de movimiento en la línea serie ni cambio de `WH`).
- H4.2: todas las órdenes de la zona "no válida" se rechazan; las de la zona "válida" se aceptan.
- H4.3: `offline` se publica en todos los cortes, en un tiempo ≤ 1,5 × *keep alive* + 1 s.

## Variables

- **Independientes:** regla del contrato (tabla de abajo) y, en las reglas temporales, la magnitud inyectada (antigüedad, adelanto, retardo del duplicado, desfase, instante del corte), aleatorizada y estratificada.
- **Dependientes:** estado y motivo del ACK; movimiento (sí/no) según el analizador y `WH`; tiempo hasta `offline`; tiempo de detección del desfase.
- **Fijas y declaradas:** contrato 0.4 (ventana 500 ms, tolerancia de adelanto 100 ms, tolerancia de desfase 100 ms, memoria de `id` ≥ 256 o 10 s), *keep alive* de la placa (fijar, p. ej., 5 s, y anotarlo; menor N7), red C1 (LAN cableada), QoS 1, versiones.
- **Orden "testigo" que movería el robot si se aceptara:** `jog_articular` eje 5 (giro de la muñeca) de ±2°, alternando el signo para que la suma sea nula. Es pequeña, segura y deja rastro inequívoco: `DJ 5,...` en la línea serie y cambio de `roll` en `WH`.

## Reglas y número de repeticiones

La regla de tres (con 0 fallos en N ensayos independientes, la cota superior al 95 % de la tasa de fallo es 1 − 0,05^(1/N) ≈ 3/N) **solo tiene sentido cuando el resultado puede variar entre ensayos**, es decir, en las reglas que dependen del tiempo (menor N2 de la revisión). Las comprobaciones deterministas (misma entrada → misma salida) se verifican con pruebas automáticas del código y con pocos ensayos en el robot, que confirman la integración en la placa real; repetirlas 30 veces no aporta información.

**Deterministas (D): pruebas automáticas + 5 ensayos con el robot por variante**

| Id | Regla | Inyección | Esperado |
|---|---|---|---|
| D1 | Destino cruzado | Topic `rvm1/real/01/comandos`, payload `"destino": "gemelo"` | `rechazado/destino`, sin movimiento |
| D2 | Destino cruzado por permisos | `alumno01` publica en `rvm1/real/01/comandos` | El broker no lo entrega: no hay `cmd_rx` en la placa |
| D3 | Sin referenciar | Tras apagar y encender la D/U-M1 (sin `home`): `jog_mundo` y `mover_pose` | `rechazado/no_referenciado` |
| D4 | Error activo | Provocar ER = 2 con un `mover_pose` inalcanzable (el de P10 de E2); después, la testigo | `rechazado/error_activo`; tras `reset`, la testigo se acepta |
| D5 | Formato | JSON roto, `cmd` desconocido, `eje` = 7, `sp` = 12 | `rechazado/formato` |
| D6 | Adelanto grande | `ts` = ahora + 1000 ms | `rechazado/caducado` |
| D7 | Caducado grande | `ts` = ahora − 2000 ms | `rechazado/caducado` |
| D8 | Comando retenido | `profesor` publica la testigo con retain; se reinicia la placa | Al resuscribirse la recibe vieja: `rechazado/caducado`, sin movimiento. Se borra el retenido al acabar |

5 ensayos por variante (≈ 60 en total). Si falla uno, se para, se corrige el código, se repiten las pruebas automáticas y **todos** los ensayos de esa regla, y se anota en `INCIDENCIAS.md`.

**Dependientes del tiempo (T): N ≥ 30 en la zona que se evalúa, instantes aleatorizados**

Zonas: con m = |desfase|_máx + p99(N_acep de E1 en C1), calculado al terminar E1 y antes de empezar E4 (se fija la fórmula ahora y el número entonces), una orden está en zona **no válida** si su edad nominal supera 500 + m ms, en zona **válida** si es menor que 500 − m ms, y en zona **frontera** entre ambas. En la frontera la decisión depende de la latencia y del desfase de ese instante: se informa de forma descriptiva, no cuenta como fallo.

| Id | Regla | Inyección | N | Esperado |
|---|---|---|---|---|
| T1 | Caducado al recibir | `ts` = ahora − Δ; Δ estratificado: 40 en zona válida, 40 en frontera, 40 en no válida (uniforme dentro de cada estrato), orden aleatorio | 120 | No válida → `caducado`; válida → aceptada |
| T2 | Caducado en la cola | `jog_articular` eje 1 de +60° a SP 2 (largo); la testigo, con `ts` fresco, se envía a un instante u aleatorio durante el movimiento, de modo que espere en la cola: 40 con espera prevista > 500 + m, 20 en frontera, 20 con < 500 − m | 80 | Espera larga → `rechazado/caducado` en la **segunda** comprobación (antes del RS-232); corta → se ejecuta. La vuelta (−60°) se hace en el ensayo siguiente |
| T3 | `ts` adelantado | `ts` = ahora + Δ; 40 con Δ < 100 − m, 40 en frontera, 40 con Δ > 100 + m | 120 | Adelanto grande → `caducado`; pequeño → aceptada |
| T4 | Duplicado (QoS 1 "al menos una vez") | La testigo se reenvía con el mismo payload (mismo `id` y `ts`) a un retardo aleatorio: 40 entre 0 y 450 ms (mientras la original está en cola o en ejecución) y 10 entre 2 y 9 s | 50 | El robot gira **una sola vez** por `id`; el duplicado recibe otra vez el ACK ya dado (o `caducado` si ha envejecido: el contrato no fija el orden de las comprobaciones, menor N12; se registra cuál) |
| T5 | Reloj desfasado | En la placa: se para la sincronización y se desplaza su reloj Δ aleatorio en ±[150, 400] ms. Cuando `actuadores` publica `desfase_ms` > 100, se envían 5 testigos; se restaura el reloj y, con `desfase_ms` < 100, 5 testigos de control | 30 ciclos (150 + 150 órdenes) | Con desfase > 100: `rechazado/reloj` (si sale `caducado` se cuenta como rechazo con otro motivo). Con desfase restaurado: aceptadas |
| T6 | Última voluntad (LWT) | Corte de alimentación de la placa con el relé USB a un instante aleatorio (entre 5 y 30 s tras el último arranque completo), con el robot parado; después se vuelve a alimentar | 30 | `online` = `offline` en ≤ 1,5 × *keep alive* + 1 s; sin movimiento; al volver, `online` y sin ejecutar nada pendiente |
| T6b | LWT con proceso terminado | `kill -9` del proceso del puente (solo Raspberry Pi) | 5 | `offline` casi inmediato (el sistema cierra la conexión TCP) |

Notas:
- **T5 depende de la placa.** En una Raspberry Pi con chrony: `systemctl stop chrony` y `date -s @<epoch ± Δ>`; el estimador de `desfase_ms` de la placa tiene que medir contra el servidor NTP del aula o `/hora` (no contra su propio reloj ya corregido). En un ESP32 hace falta un método equivalente que fije `ingeniero` y se declare. El intervalo entre el desplazamiento del reloj y la detección es una ventana en la que las órdenes se aceptan con el reloj mal: se mide y se informa aparte. **No cuenta como fallo de la regla**, pero es una limitación que se declara.
- **T4** no reproduce una retransmisión real del protocolo MQTT (forzarla exige cortar la red de la placa en el instante justo). El reenvío del mismo payload es equivalente desde el punto de vista del receptor; se declara como limitación.
- **T2** depende de E1.0: si S1 no se cumple y `hecho` se redefine, la cola se vacía de otra forma y este ensayo se ajusta antes de ejecutarlo.
- No se ensaya "red cargada": la carga solo cambia la latencia, y su efecto ya está cubierto por la aleatorización en la zona frontera y por la Wi-Fi de E1.
- `desconectado` (cable serie) se ensaya en E5.

**Controles (órdenes válidas):** las órdenes de zona válida de T1, T2, T3 y T5 más 50 testigos válidas intercaladas al azar a lo largo de la sesión. Miden los falsos rechazos.

## Montaje

**Precondiciones**
- Robot reparado y referenciado (salvo D3). E1.0 y E1 cerrados; m calculado y anotado en la nota inicial.
- Placa elegida; puente del contrato v0.4 instrumentado. Las pruebas automáticas de la pasarela (las de `Codigo/Gemelo/tests` adaptadas a la placa, o las de la placa) pasan en el mismo commit que se ensaya.
- NTP (chrony) en placa y PC, desfase < 10 ms al empezar (salvo durante T5).
- Analizador lógico en la línea serie durante **toda** la sesión (captura continua a 200 kHz, en tramos de 30 min), para detectar cualquier orden de movimiento (`NT`, `DJ`, `DS`, `MJ`, `MP`, `MO`, `GO`, `GC`) que salga hacia el robot.
- Relé USB en la alimentación de la placa (T6), manejado desde el PC del inyector.
- **Inyector** `Codigo/Software_Control/experimentos/e4_inyector.py` (pendiente, `ingeniero`): genera los casos de cada regla con semilla fija, los baraja, los envía como `profesor` (o `alumno01` en D2), registra `cmd_tx` con la edad o el adelanto nominal y la zona, espera el ACK y lee la `posicion/mundo` antes y después. Ensayo en seco completo contra el gemelo (registros a `datos_simulados/E4/`).

## Procedimiento paso a paso (lo ejecuta Álvar)

1. **Preparación (20 min).** Arrancar todo, captura del analizador, `home`, comprobar `actuadores`. Anotar en la nota inicial m, *keep alive*, semilla y versiones.
2. **D1, D2, D5, D6, D7 (20 min).** Inyector en modo determinista, 5 por variante.
3. **D4 (10 min).** 5 ciclos: pose inalcanzable → ER = 2 → testigo (rechazada) → `reset` → testigo (aceptada).
4. **T1, T3 (20 min).** Inyector, 240 órdenes barajadas, intervalo aleatorio de 1 a 2 s entre órdenes.
5. **T2 (20 min).** 80 ensayos; el inyector calcula u para cada estrato con la duración del movimiento medida en E1-T.
6. **T4 (15 min).** 50 ensayos.
7. **T5 (≈ 45 min).** 30 ciclos. Por ciclo: desplazar el reloj por SSH (el comando anota el instante en el registro de la placa) → esperar `desfase_ms` > 100 → 5 testigos → restaurar chrony y forzar la corrección → esperar `desfase_ms` < 100 → 5 testigos.
8. **D8 y D3 (20 min).** D8: retenido + reinicio de la placa, 5 veces. D3: apagar y encender la D/U-M1 5 veces, sin `home`, y enviar `jog_mundo` y `mover_pose`. Al final, `home`.
9. **T6 y T6b (≈ 50 min).** 30 cortes con el relé (esperar el arranque completo y `online` entre cortes) y 5 `kill -9`.
10. Cerrar capturas y registros, sumas SHA-256, incidencias.

## Seguridad

- Zona despejada (cinta a 1 m), seta física al alcance de la mano.
- **SP máximo: 2** en toda la sesión (la testigo y los movimientos de T2 son a SP 2).
- Si alguna orden no válida mueve el robot: seta, fin de la sesión, nada se reanuda hasta corregirlo y repetir las pruebas automáticas. Se anota en `INCIDENCIAS.md` y **se informa en el artículo**.
- D3: al encender sin referenciar, ninguna orden de movimiento debe salir; aun así, la mano en la seta.
- D4: la pose inalcanzable se valida antes en el gemelo.
- T6: el relé solo corta la alimentación de la placa, nunca la de la controladora ni la del robot.

## Datos que se registran

Carpeta `Investigacion/Experimentos/datos_crudos/E4/`:
- `AAAAMMDD-HHMMSS_real_E4-<regla>-inyector.jsonl`: `cmd_tx` con `args`, más campos `caso`, `zona`, `edad_nominal_ms` o `adelanto_nominal_ms`, `retardo_dup_ms`, `u_ms`; `ack_rx`; `pos` antes y después de cada caso; en T6, `nota` con el instante del corte (reloj del PC) y `estado` al recibir `offline`/`online`.
- `..._E4-<regla>-placa.jsonl`: `cmd_rx` (con la edad que calcula la placa en cada comprobación), `ack_tx`, `serie_tx`, `serie_rx`, `estado` (`desfase_ms`, cola); en T5, `nota` con el desplazamiento aplicado.
- `..._E4-<tramo>-analizador.sr`.
- Nota inicial en cada fichero según `registro-experimentos`, más m, *keep alive* y la semilla.

## Análisis previsto (`Investigacion/Experimentos/analisis/analizar_E4.py`)

- **Movimiento indebido (H4.1):** para cada orden no válida, se busca en la captura del analizador, entre su `cmd_tx` y los 5 s siguientes, cualquier orden de movimiento hacia el robot que no pertenezca a una orden válida (el emparejamiento con los registros se hace por la secuencia de bytes, sin cruzar relojes); y se compara `WH` antes y después (cambio mayor que la resolución de `WH`). Movimiento indebido = cualquiera de los dos.
- **Por regla y zona:** N, rechazos con el motivo correcto, rechazos con otro motivo, aceptaciones indebidas, movimientos indebidos. Proporciones con IC95 % de Wilson. Para los fallos de las reglas T, cota superior unilateral al 95 % exacta (Clopper-Pearson; con 0 fallos, 1 − 0,05^(1/N)). Para las reglas D no se da cota: se informa "n/n" y que hay pruebas automáticas.
- **Consistencia interna:** en T1–T3 se comprueba en cada orden que la decisión de la placa concuerda con la edad que ella misma calculó (es determinista; cualquier discrepancia es un error de implementación).
- **Zona frontera (T1, T3):** proporción de rechazos frente a la edad nominal; regresión logística descriptiva para estimar el umbral efectivo (50 %) con IC bootstrap. Se compara con la ventana efectiva de 400–600 ms (menor N3).
- **Falsos rechazos:** órdenes de zona válida y controles rechazados / total, con IC de Wilson y cota al 95 % si son 0.
- **T4:** número de `DJ 5` en la línea por `id` (esperado: 1) y ACK devuelto al duplicado.
- **T5:** tiempo de detección (desplazamiento → primer `desfase_ms` > 100, reloj de la placa): mediana y máximo; órdenes aceptadas en la ventana de detección (se informan aparte).
- **T6:** tiempo hasta `offline` = recepción de `offline` − orden al relé, ambos en el reloj del PC: mediana, p95, máximo; comparación con 1,5 × *keep alive*. Tiempo hasta volver a `online` (incluye el arranque de la placa).
- **Tabla del artículo:** `Investigacion/Experimentos/analisis/resultados/E4_tabla.csv` → una fila por regla: N, rechazo correcto (n/N), movimientos indebidos, cota superior 95 % (solo T), falsos rechazos; una fila para LWT con mediana y máximo. Tablas de detalle: `E4_casos.csv`, `E4_frontera.csv`, `E4_lwt.csv`.
- **Datos descartados:** casos en que el inyector no pudo enviar o no llegó ACK por un fallo ajeno a la regla (p. ej. caída de la red) se excluyen con su motivo y se cuentan.

## Criterio de éxito

- **Principal:** **ninguna orden no válida mueve el robot** (0 movimientos indebidos en todas las reglas).
- Todas las órdenes de zona no válida rechazadas (se informa la cota al 95 % de las reglas T: con 0 fallos, ≈ 7,2 % con N = 40 y ≈ 2,5 % con N = 120).
- Falsos rechazos en zona válida: se informan; objetivo 0.
- LWT: 30/30 `offline` publicados en ≤ 1,5 × *keep alive* + 1 s.

## Amenazas a la validez

Se prueban las salvaguardas implementadas, no la seguridad funcional del robot, que sigue en la controladora y la seta física. `parar` no detiene un movimiento en curso, así que no se incluye como salvaguarda. Duplicados sin retransmisión real de QoS 1 (T4). La ventana de detección de T5 depende del periodo del estimador de desfase.

## Salida para el artículo

La tabla E4 (una fila por regla, con LWT) y unas líneas sobre la zona frontera y la ventana de T5.

**Duración estimada:** 4 h (en una sesión larga o en dos).
