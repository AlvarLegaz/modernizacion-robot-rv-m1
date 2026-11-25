# E5 — Robustez de las comunicaciones (reducido)

Versión 1 (2026-11-25). Responde a PI4 (aportación A1, hueco H7, cubierto solo en parte). Alcance reducido a propósito: tres escenarios, sin pérdidas emuladas por niveles y sin MTTF/MDT.

## Pregunta de investigación

¿Se recupera el puente sin perder ni duplicar órdenes, y sin ejecutar órdenes viejas, tras un corte del broker, una desconexión del cable serie y durante una sesión de 2 h? ¿Cuánto tarda en recuperarse?

## Hipótesis

- H5.1: tras cada corte, el puente vuelve a `online` y `conectado` sin intervención manual.
- H5.2: ninguna orden se ejecuta dos veces ni con más de 500 ms de antigüedad; las que llegan viejas tras la reconexión se rechazan como `caducado`.
- H5.3: durante la sesión de 2 h no hay órdenes perdidas, y la mediana de la latencia no deriva más allá de su IC95 % de E1.

## Variables

- **Independientes:** escenario (broker, cable serie, sesión larga); duración del corte (10 s y 60 s).
- **Dependientes:** tiempo de recuperación; órdenes perdidas, duplicadas, ejecutadas tarde y rechazadas (con motivo); fracción de tiempo en línea; estado de `actuadores` tras la recuperación; en la sesión larga, latencia por ventanas de 10 min, `desfase_ms`, memoria de la placa y `WH` en una pose de control.
- **Fijas y declaradas:** *keep alive*, `clean session` (o `clean start` en MQTT 5) y persistencia de sesión de la placa y del cliente, política de reintentos (periodo de reconexión), cola de mensajes salientes de la biblioteca del cliente cuando está desconectado, persistencia de Mosquitto (sí/no), red C1 (LAN cableada), QoS 1, versiones. Todas condicionan lo que se espera y se anotan en la nota inicial.

## Qué se espera en cada escenario (según el contrato y MQTT)

| Escenario | Esperado | Puntos que el contrato no fija (se registran, no se juzgan) |
|---|---|---|
| Corte del broker | La placa pierde la conexión, reintenta y vuelve: publica `online` y `actuadores` (retenidos). Las órdenes publicadas por el cliente durante el corte no llegan o, si su biblioteca las guarda y las envía al reconectar, llegan viejas y se rechazan como `caducado`. Ninguna se ejecuta tarde | Si la placa usa sesión persistente, qué hace el broker con las órdenes QoS 1 retenidas para ella |
| Cable serie desconectado | La placa detecta la falta de respuesta (sondeo de `WH`), publica `conectado: false` y rechaza las órdenes con `desconectado`. Al reconectar, `conectado: true` y acepta órdenes | Si `referenciado` se conserva tras la reconexión (la placa no puede saber si la D/U-M1 se apagó mientras tanto); qué ACK recibe una orden en curso cuando se desconecta el cable |
| Sesión de 2 h | Funcionamiento continuo sin pérdidas; `online` todo el tiempo | — |

## Montaje

**Precondiciones**
- Robot reparado y referenciado. E1 cerrado (sirve de referencia para la deriva de la latencia).
- Placa elegida; puente v0.4 instrumentado. NTP en placa y PC con desfase < 10 ms.
- Broker del aula en el PC del profesor; el cliente de carga corre **en el mismo PC**, de modo que el instante del corte (orden `docker compose stop/start mosquitto`) y el de la recuperación se miden con un solo reloj.
- Analizador lógico en la línea serie (testigo de órdenes ejecutadas). Para la desconexión del cable serie, el analizador se pincha **del lado de la controladora**, de forma que siga viendo la línea del robot aunque se desenchufe el cable hacia la placa.
- **Cliente de carga** `codigo/experimentos/e5_carga.py` (pendiente, `ingeniero`): envía `velocidad 2` cada 1 s y, cada 10 s, la testigo de E4 (`jog_articular` eje 5 ±2°, alternando el signo); registra `cmd_tx`, `ack_rx` y los cambios de `online`/`actuadores`. Ensayo en seco contra el gemelo a `datos_simulados/E5/`.

## Procedimiento paso a paso (lo ejecuta Álvar)

**Escenario B — Corte del broker (≈ 30 min)**
1. Cliente de carga en marcha durante todo el bloque.
2. 10 cortes en orden aleatorio sorteado antes: 5 de 10 s y 5 de 60 s, separados por 60 s de funcionamiento normal. Cada corte: `docker compose stop mosquitto` → esperar → `docker compose start mosquitto` (sin Docker: parar y relanzar `mosquitto -c ...`). El script de cortes anota los dos instantes con el reloj del PC.

**Escenario S — Cable serie (≈ 30 min)**
3. Cliente de carga en marcha.
4. 10 desconexiones, con el robot **parado**: 5 de 10 s y 5 de 60 s, en orden aleatorio. Se desenchufa el conector entre la placa (o su adaptador USB-RS232) y la Y del analizador, y se vuelve a enchufar. Álvar pulsa una tecla en el script de cortes al desenchufar y al enchufar (incertidumbre de unos 0,5 s, que se declara; el instante útil, la detección por la placa, sale de su propio registro).
5. (Exploratorio, 2 ensayos) Desconexión durante un `jog_articular` eje 1 de 45° a SP 2: se registra qué ACK recibe la orden en curso y en qué estado queda `actuadores`. No entra en las cifras principales.

**Escenario L — Sesión larga (2 h 15 min)**
6. Cliente de carga durante 2 h. Cada 10 min, el cliente envía además un `mover_pose` a una pose de control fija (la de `home` desplazada 50 mm en Z) y registra su `WH`.
7. La placa registra cada minuto un evento `estado` con su memoria en uso, temperatura de la CPU (si la da) y `desfase_ms`.
8. Al terminar, `home`, cerrar registros, sumas SHA-256, incidencias.

## Seguridad

- Zona despejada (cinta a 1 m), seta física al alcance de la mano. En la sesión de 2 h, **el operador no se ausenta**: si tiene que irse, se para el ensayo (se anota la pausa en `INCIDENCIAS.md` y se descuenta del tiempo).
- **SP máximo: 2.**
- El cable serie solo se desconecta con el robot parado (salvo los 2 ensayos exploratorios, con la mano en la seta).
- No se corta nunca la alimentación de la controladora en este experimento.

## Datos que se registran

Carpeta `experimentos/datos_crudos/E5/`:
- `AAAAMMDD-HHMMSS_real_E5-<B|S|L>-cliente.jsonl`: `cmd_tx`, `ack_rx`, `estado` (cambios de `online`, `conectado`, `referenciado`), `pos`; en B y S, `nota` con el inicio y el fin de cada corte y su duración nominal.
- `..._E5-<B|S|L>-placa.jsonl`: `cmd_rx`, `ack_tx`, `serie_tx`, `serie_rx`, `estado` (conexión al broker, `conectado`, memoria, `desfase_ms`), `nota` con cada reconexión.
- `..._E5-<B|S|L>-analizador.sr` (en L, en tramos de 30 min).
- Nota inicial con *keep alive*, sesión limpia o persistente, reintentos, persistencia del broker y el resto de campos de `registro-experimentos`.

## Análisis previsto (`analisis/analizar_E5.py`)

- **Clasificación de cada orden** (por `id`, cruzando cliente, placa y analizador): ejecutada una vez, ejecutada más de una vez (duplicada), ejecutada tarde (edad > 500 ms al escribir en el RS-232, según la placa), rechazada (por motivo), perdida (sin ACK ni `cmd_rx` y enviada con el broker disponible) o no enviada (la biblioteca la rechazó con el broker caído). Las órdenes enviadas durante un corte se cuentan aparte y no se tratan como perdidas.
- **Tiempo de recuperación** (B): desde `start` del broker hasta (i) `online` recibido de la placa y (ii) primer `hecho` de una orden nueva; reloj del PC. (S): desde la reconexión del cable (detección en la placa) hasta `conectado: true` y primer `hecho`. Con n = 5 por duración se dan **todos los valores**, la mediana y el máximo; no se hacen pruebas.
- **Fracción de tiempo en línea** (L): tiempo con `online` y `conectado` / tiempo total, descontando pausas anotadas.
- **Deriva** (L): mediana y p95 de L_hecho por ventana de 10 min con IC95 % bootstrap, comparadas con el IC de E1-C1; `desfase_ms` y memoria frente al tiempo; desviación de `WH` en la pose de control (escala del robot, no del puente).
- **Proporciones** (duplicadas, tarde, perdidas): n/N con IC95 % de Wilson y, si son 0, cota superior al 95 % (con la advertencia de que las órdenes de una misma sesión no son del todo independientes).
- **Salidas:** `analisis/resultados/E5_ordenes.csv`, `E5_recuperacion.csv`, `E5_sesion_larga.csv`; figura de trabajo `analisis/figuras/E5_sesion_larga.pdf` (latencia y `desfase_ms` frente al tiempo), que no va al artículo salvo que sobre espacio.

## Criterio de éxito

- 0 órdenes duplicadas y 0 ejecutadas tarde en los tres escenarios (H5.2).
- Recuperación automática en 10/10 cortes de broker y 10/10 desconexiones del cable (H5.1).
- 0 órdenes perdidas con el broker disponible y deriva de la mediana dentro del IC de E1 en la sesión larga (H5.3).

## Amenazas a la validez

n = 5 por condición: el resultado es descriptivo. Una sola sesión larga, en un día y una red. Los instantes del escenario S se marcan a mano. No se emulan pérdidas de paquetes ni se mide disponibilidad (MTTF/MDT).

## Salida para el artículo

Un párrafo en la sección 4 (sin figura) y, si cabe, dos filas al final de la tabla E4.

**Duración estimada:** 3 h 30 min.
