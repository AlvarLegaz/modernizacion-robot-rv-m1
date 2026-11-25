# E1 — Latencia por tramos de la cadena cliente → broker → placa → RS-232C → D/U-M1

Versión 1 (2026-11-25). Responde a PI1 (aportación A1). Requiere haber cerrado E1.0.

## Pregunta de investigación

Para una orden **sin movimiento**, ¿qué latencia introduce la cadena y cómo se reparte entre red+broker, placa (comprobaciones y cola) y línea serie+intérprete? ¿Cuál domina? ¿Es compatible con la ventana de caducidad de 500 ms (efectiva entre ≈ 400 y ≈ 600 ms, por la tolerancia de 100 ms de desfase) en LAN cableada y en Wi-Fi? Aparte, ¿cuánto tarda en ejecutarse un movimiento en función de su amplitud y de `SP`?

## Hipótesis

- H1.1: en LAN cableada, el tramo serie+intérprete es el mayor componente de la mediana de la latencia hasta `hecho`.
- H1.2: el p99 de la latencia hasta `hecho` queda por debajo de 400 ms (borde inferior de la ventana efectiva) en LAN cableada y en Wi-Fi.
- H1.3: la Wi-Fi aumenta el tramo red+broker (mediana y, sobre todo, cola de la distribución), pero no el tramo serie.

## Variables

- **Independiente principal:** enlace de red. C1 = LAN cableada; C2 = Wi-Fi. Si la placa admite Ethernet (Raspberry Pi), en C1 van por cable el cliente y la placa y en C2 los dos por Wi-Fi. Si la placa es un ESP32 sin Ethernet, la placa va siempre por Wi-Fi y solo cambia el enlace del cliente. Se decide y se anota antes de la primera muestra.
- **Secundaria (referencia, opcional):** QoS 0 en C1 (el contrato usa QoS 1; QoS 0 solo como comparación).
- **Dependientes:** ver "Tramos" abajo; además caudal (órdenes/s) y tiempo de ejecución.
- **Fijas y declaradas:** placa y su sistema, biblioteca MQTT y versión, broker (Mosquitto, versión), QoS 1, *keep alive*, baudios y formato serie medidos en E1.0, adaptador USB-RS232 y su *latency timer* (FTDI: fijarlo a 1 ms y anotarlo; por defecto es 16 ms y domina la medida), versión del contrato (0.4), periodo de sondeo de `WH` de la placa en reposo (500 ms), punto de acceso Wi-Fi y canal, PC cliente.

## Tramos y dónde se mide cada uno (un solo reloj por equipo)

No se restan nunca marcas de tiempo de equipos distintos. Se restan **duraciones**, cada una medida con el reloj monótono de un solo equipo (la deriva entre relojes, unas decenas de ppm, es despreciable en intervalos de < 1 s).

| Símbolo | Tramo | Equipo y reloj | Cálculo |
|---|---|---|---|
| L_acep | RTT cliente hasta `aceptado` | Cliente, `time.monotonic_ns()` | ack_rx(aceptado) − cmd_tx |
| L_hecho | RTT cliente hasta `hecho` | Cliente | ack_rx(hecho) − cmd_tx |
| P_acep | Proceso en la placa hasta `aceptado` | Placa, reloj monótono | ack_tx(aceptado) − cmd_rx |
| Q | Comprobaciones + espera en cola | Placa | serie_tx(inicio) − cmd_rx |
| S | Línea serie + intérprete (`SP n` + `ER` y su respuesta) | Placa | serie_rx(fin de respuesta de `ER`) − serie_tx(inicio de `SP`) |
| F | Cierre en la placa | Placa | ack_tx(hecho) − serie_rx(fin) |
| P_hecho | Total en la placa | Placa | ack_tx(hecho) − cmd_rx = Q + S + F |
| N_acep | Red + broker, ida y vuelta | Diferencia de duraciones | L_acep − P_acep |
| N_hecho | Red + broker, ida y vuelta | Diferencia de duraciones | L_hecho − P_hecho |
| S_an | Línea serie + intérprete, referencia | Analizador lógico | bit de stop del último carácter de la respuesta − bit de start del primer carácter de `SP` |

- La ida y la vuelta por separado no se pueden medir sin cruzar relojes. Solo como dato secundario se calcula la ida con relojes NTP (t_ms placa − t_ms cliente), con su incertidumbre ± `desfase_ms`, y se presenta como tal.
- S frente a S_an mide lo que añaden el sistema operativo y el adaptador USB a las marcas de la placa. Los dos registros se emparejan por la secuencia de órdenes (contenido y orden), no por la hora.
- **Cota teórica** del tramo serie: T_min = (n_tx + n_rx) · b / baudios, con b bits por carácter medidos en E1.0. Con 7E2 (b = 11) a 9600 baudios son 1,146 ms por carácter; para `SP 2⏎` + `ER⏎` + respuesta `0⏎` (10 caracteres, si E1.0 confirma el terminador) son 11,5 ms. Lo que exceda de T_min en S_an es tiempo del intérprete.

**Orden sin movimiento:** `velocidad` con el mismo `sp` que ya tiene el robot (`sp` = 2): no cambia el estado ni mueve nada. La placa envía `SP 2` y después `ER`, y publica `hecho` con la respuesta. No depende del resultado de E1.0, porque sin movimiento `ER` contesta en cualquier caso.

## Montaje

**Precondiciones**
- E1.0 cerrado: parámetros serie y definición de `hecho` fijados.
- Robot reparado y referenciado (`home` al empezar). Se mueve solo en el bloque T.
- Placa elegida y fija (ESP32 o Raspberry Pi), con el puente del contrato v0.4 que registra los eventos de la tabla (ver README, "Requisitos de instrumentación"). El puente pasa las pruebas automáticas del contrato antes de la sesión.
- NTP (chrony) en la placa y en el cliente contra el mismo servidor del aula; desfase < 10 ms medido con `broker/comprobar_reloj.py` al principio y al final de cada bloque. Solo hace falta para que no haya rechazos por `caducado` o `reloj`.
- Broker del aula (`broker/`) con el usuario `profesor` para el cliente y `placa_real` para la placa. Red del aula aislada; mejor un router propio sin más equipos conectados durante el ensayo. Anotar qué equipos hay en la red.
- Analizador lógico del montaje de E1.0 en la línea serie.
- Ensayo en seco completo contra el gemelo (destino `gemelo`) con el mismo script de cliente; sus registros van a `experimentos/datos_simulados/E1/` y sirven para probar el script de análisis.

**Cliente de medida:** `codigo/experimentos/e1_cliente.py` (pendiente, `ingeniero`): publica una orden, espera `hecho` (o 5 s), espera un intervalo aleatorio uniforme entre 0,5 y 1,5 s y repite. El intervalo aleatorio evita sincronizarse con las publicaciones periódicas de la placa (`actuadores` a 1 Hz, sondeo de `WH` cada 500 ms).

## Procedimiento paso a paso (lo ejecuta Álvar)

**Preparación (20 min)**
1. Encender robot, placa, broker y analizador. `home` desde el pendant con destino REAL. Comprobar `actuadores`: `conectado`, `referenciado`, `error` = 0, `desfase_ms` < 10.
2. Arrancar la captura del analizador a 200 kHz (sobra para 9600 baudios y permite capturas largas) y los registros de placa y cliente.

**Bloque L — Latencia (≈ 1 h 15 min)**
3. Orden de los sub-bloques fijada antes de empezar: C1, C2, C1, C2 (ABAB), 250 órdenes cada uno → **500 muestras por condición** (más de las 200 mínimas, para que el p99 se apoye en unas 5 muestras y no en 2).
4. En cada sub-bloque: anotar en una `nota` la condición, comprobar el enlace (cable desconectado del PC en C2; la Wi-Fi apagada en C1) y lanzar el cliente con `--n 250 --cmd velocidad --sp 2 --qos 1`.
5. Al cambiar de condición, esperar 1 min con la red estable antes de lanzar.
6. (Opcional) 200 órdenes en C1 con QoS 0 como referencia.

**Bloque C — Caudal (20 min)**
7. En C1, el cliente envía `velocidad` a ritmo fijo, sin esperar al ACK, a 2, 5, 10 y 20 órdenes/s, 30 s por ritmo, con 30 s de pausa entre ritmos. Las órdenes que esperen en cola más de 500 ms deben rechazarse como `caducado`: es el comportamiento esperado, no un fallo.

**Bloque T — Tiempo de ejecución (30 min)**
8. En C1, `jog_articular` eje 1 con θ ∈ {10°, 45°, 120°} y `sp` ∈ {2, 4}, ida y vuelta (+θ, −θ), 10 movimientos por combinación (60 en total), en orden aleatorio sorteado antes de la sesión.
9. `mover_pose` entre dos pares de poses fijas (distancias de unos 100 y 250 mm, fijadas con el pendant antes del ensayo y guardadas en la nota inicial), `sp` ∈ {2, 4}, 5 idas y vueltas por combinación (40 movimientos).
10. Cerrar registros, copiar los ficheros de la placa y del analizador a `datos_crudos/E1/`, calcular sumas y anotar incidencias.

## Seguridad

- Zona despejada (cinta a 1 m del eje de la base), nadie dentro; seta física al alcance de la mano.
- **SP máximo: 4.** Los bloques L y C no mueven el robot (`velocidad` con el mismo valor). Antes del bloque T se ejecuta la secuencia en el gemelo para comprobar que no barre la mesa.
- Si en el bloque L se observa cualquier movimiento, se pulsa la seta, se para el ensayo y se anota en `INCIDENCIAS.md`.

## Datos que se registran

Carpeta `experimentos/datos_crudos/E1/`, un trío de ficheros por sub-bloque:

- `AAAAMMDD-HHMMSS_real_E1-<L|C|T>-<C1|C2>-cliente.jsonl`: `cmd_tx`, `ack_rx` (con `estado`, `motivo`).
- `AAAAMMDD-HHMMSS_real_E1-<...>-placa.jsonl`: `cmd_rx`, `ack_tx`, `serie_tx` (con `fase`: `inicio`/`fin`, y `origen`: `orden` o `sondeo` para distinguir los `WH` periódicos), `serie_rx`, `estado` (cola, `desfase_ms`).
- `AAAAMMDD-HHMMSS_real_E1-<...>-analizador.sr`.

Cada `.jsonl` empieza con una `nota`: commit, contrato 0.4, broker y versión, red (C1/C2, AP, canal), placa, adaptador y *latency timer*, QoS, *keep alive*, método de sincronización (chrony) y desfase medido, robot, operador, semilla del sorteo. Los eventos llevan `t_ms` y `t_mono_ns`.

## Análisis previsto (`analisis/analizar_E1.py`)

**Limpieza (reglas fijadas antes de ver los datos):**
- Se descartan las 10 primeras órdenes de cada sub-bloque (calentamiento: ARP, sesiones, cachés). Se informa de ellas aparte.
- Órdenes rechazadas o sin `hecho` en 5 s: no entran en la latencia; se cuentan y se informa de su número y motivo. No se imputan.
- Emparejamiento cliente–placa por `id`. Si falta el evento de un lado, la orden sale de los tramos que lo necesitan y se cuenta.

**Estadística por tramo y condición:** n, mediana, p95, p99, máximo. IC95 % por bootstrap percentil (B = 10 000, semilla fija) para mediana y p95; el IC del p99 se da con la advertencia de que es poco preciso con n = 500. Si la autocorrelación de orden 1 de una serie supera 0,1, se usa bootstrap por bloques móviles (bloques de 10).

**Contribuciones:** proporción de la mediana de L_hecho que corresponde a N_hecho, Q, S y F (H1.1). Mediana de S_an − T_min (tiempo del intérprete) y de S − S_an (lo que añade la placa). Se estratifica Q según coincida o no con un sondeo de `WH` de la placa en curso.

**Ventana de caducidad:** fracción de órdenes con L_hecho > 400 ms y > 500 ms, con IC95 % de Wilson (H1.2). Como cota de la edad de una orden al ser comprobada: N_acep + Q + |desfase_ms| (la ida es menor que N_acep); fracción por encima de 400 ms.

**Comparación C1–C2:** Mann-Whitney bilateral para L_acep, L_hecho, N_hecho y S; tamaño del efecto con δ de Cliff e IC95 % bootstrap; corrección de Holm para las 4 pruebas. H1.3 se apoya si N_hecho difiere y S no (|δ| < 0,147, umbral de efecto despreciable).

**Caudal:** por ritmo ofrecido, órdenes `hecho` por segundo, longitud de cola (de `actuadores`) y fracción de `caducado`. Caudal máximo sostenido = mayor ritmo sin `caducado` y con cola estable. Contraste con la cota 1 / mediana(S).

**Tiempo de ejecución:** T_ej = instante de la respuesta de `ER` − fin de la escritura de la orden (placa y analizador). Por combinación: mediana, mínimo y máximo. Ajuste lineal descriptivo T_ej = a + b·θ por `SP` (sin inferencia). Estos datos se pueden usar para calibrar el modelo de tiempos del gemelo **antes** de E2; en ese caso E2a usa programas distintos de los del bloque T.

**Figura (artículo, una columna):** `analisis/figuras/E1_ecdf.pdf`. ECDF de L_hecho y de sus tramos (N_hecho, Q, S) con eje x logarítmico en ms, un panel por condición o colores por tramo y trazo por condición (paleta Okabe-Ito), líneas verticales en T_min y en 400 y 500 ms. Sin título dentro; fuente 8 pt.

**Tablas:** `analisis/resultados/E1_tramos.csv` (todos los percentiles e IC), `E1_comparacion.csv`, `E1_caudal.csv`, `E1_ejecucion.csv`. En el artículo, las cifras clave en el texto y en el pie de la figura.

## Criterio de éxito

- **Del experimento (validez):** ≥ 200 muestras válidas por condición tras la limpieza (objetivo 500), desfase < 10 ms en todos los controles, S y S_an emparejados en ≥ 95 % de las órdenes.
- **De la hipótesis de compatibilidad (H1.2):** p99 de L_hecho < 400 ms en C1 y en C2. Si no se cumple en C2, el resultado se informa tal cual y se discute qué implica para la ventana de 500 ms en Wi-Fi (no se cambia la ventana a la vista de los datos).

## Amenazas a la validez

Una sola red, una placa y un broker; el *latency timer* del adaptador y el sondeo de `WH` cambian S y Q; con Wi-Fi, el tráfico de otras redes del centro no se controla (se anota el canal y la hora).

## Salida para el artículo

Figura E1 (ECDF por tramos) y unas líneas con las medianas, p95, p99, el caudal y el tiempo de ejecución.

**Duración estimada:** 3 h.
