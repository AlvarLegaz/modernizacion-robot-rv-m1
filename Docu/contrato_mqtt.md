# Contrato MQTT del RV-M1

Versión 0.5 (borrador)

Cambios respecto a 0.4: **latido y parada segura** (sección 5, requisito indispensable de seguridad del robot real), topic `latido`, campos de seguridad en `actuadores`, comando `stop` y motivo de rechazo `sin_latido`.

Cambios de 0.4 respecto a 0.3: modos del gemelo (emulador, sombra y sincronizado) y topics del robot real que lee.

Cambios de 0.3 respecto a 0.2: rechazo de `ts` adelantados, permisos del gemelo y medida del desfase con `/hora`.

Cambios de 0.2 respecto a 0.1: descarte de duplicados por `id`, caducidad comprobada también al ejecutar, sincronización de relojes, estado de error, red y seguridad, y alcance real de `parar` (a raíz de la revisión del estado del arte).

La placa de interfaz (ESP32 o Raspberry Pi) hace de puente entre el RS-232 del robot y el broker MQTT. La aplicación de control (SCADA, pendant, programas de alumnos, gemelo digital) **solo** habla MQTT.

**La aplicación controla el robot únicamente publicando en `comandos`.** El resto de topics (`comandos/ack`, `actuadores`, `posicion/mundo`, `online`) los publica solo la placa; para la aplicación son de lectura.

## Topics

Prefijo común: `rvm1/<destino>/<id_robot>/`

- `<destino>` indica sobre qué se trabaja: `real` (el brazo físico) o `gemelo` (el gemelo digital).
- `<id_robot>` permite tener varios robots o gemelos, por ejemplo uno por alumno: `rvm1/gemelo/07/`.

La placa del robot físico solo se suscribe a `rvm1/real/...` y el gemelo digital solo a `rvm1/gemelo/...`. Cambiar de gemelo a robot real es cambiar el destino en la aplicación; los mensajes son idénticos.

En las tablas siguientes se usa `rvm1/real/01/` como ejemplo.

| Topic | Sentido | QoS | Retain | Contenido |
|---|---|---|---|---|
| `rvm1/real/01/comandos` | cliente → placa | 1 | **no** | Orden a ejecutar |
| `rvm1/real/01/latido` | cliente → placa | 0 | **no** | Latido de la aplicación (sección 5) |
| `rvm1/real/01/comandos/ack` | placa → cliente | 1 | no | Confirmación de cada orden |
| `rvm1/real/01/actuadores` | placa → clientes | 1 | sí | Estado actual del robot |
| `rvm1/real/01/posicion/mundo` | placa → clientes | 0 | sí | Posición cartesiana del TCP |
| `rvm1/real/01/online` | placa → clientes | 1 | sí | `"online"` / `"offline"` (última voluntad, LWT) |

Los comandos **nunca** se publican con retain: un comando retenido se volvería a ejecutar al reconectar la placa.

Todos los mensajes son JSON en UTF-8. `ts` es la marca de tiempo en milisegundos (epoch).

## 1. `comandos`

```json
{
  "id": "a1b2c3",
  "ts": 1764067200000,
  "destino": "real",
  "cmd": "jog_mundo",
  "args": { "dx": 0.0, "dy": 0.0, "dz": -1.0 }
}
```

- `id`: identificador único que pone el cliente; la placa lo devuelve en el ACK.
- `destino`: `real` o `gemelo`, igual que en el topic. Si no coincide con el destino del receptor, el comando se rechaza (`destino`). Es una segunda comprobación para no mover el brazo real por error con un programa pensado para el gemelo.
- `ts`: si el comando tiene más de 500 ms de antigüedad, la placa lo rechaza (`caducado`). También se rechaza (`caducado`) un `ts` más de 100 ms **por delante** del reloj del receptor, porque un emisor con el reloj adelantado anularía la protección. La comprobación se hace **dos veces**: al recibirlo y justo antes de enviarlo por RS-232C, para que una orden que ha esperado en la cola tampoco se ejecute tarde.
- **Duplicados:** con QoS 1 un mensaje puede llegar más de una vez. La placa guarda los últimos `id` recibidos (al menos 256, o los de los últimos 10 s) y, si llega un `id` repetido, no lo ejecuta y devuelve otra vez el ACK que ya dio.

| `cmd` | `args` | Comando RV-M1 |
|---|---|---|
| `home` | — | `NT` |
| `jog_articular` | `eje` (1–5), `grados` | `DJ eje,grados` |
| `jog_mundo` | `dx`, `dy`, `dz` (mm) | `DS dx,dy,dz` |
| `mover_pose` | `x`, `y`, `z`, `pitch`, `roll` | `MP x,y,z,p,r` |
| `velocidad` | `sp` (0–9) | `SP sp` |
| `pinza` | `accion`: `"abrir"` / `"cerrar"` | `GO` / `GC` |
| `reset` | — | `RS` |
| `stop` | — | Abre **ya** el circuito de parada eléctrica (`EXT. EMG. STOP`); no pasa por el RS-232C ni por la cola. Ver sección 5 |
| `parar` | — | Vacía la cola de la placa. **No detiene el movimiento en curso**: el RV-M1 no puede abortar un movimiento por RS-232C; la parada real es la seta física |

## 2. `comandos/ack`

Cada comando recibe **dos** ACK: uno al recibirlo y otro al terminar.

```json
{ "id": "a1b2c3", "ts": 1764067200050, "estado": "aceptado" }
```

```json
{ "id": "a1b2c3", "ts": 1764067200900, "estado": "hecho", "er": 0 }
```

| `estado` | Significado |
|---|---|
| `aceptado` | Formato correcto; se ha encolado para enviar al robot |
| `rechazado` | No se envía al robot; ver `motivo` |
| `hecho` | El robot lo ha ejecutado y `ER` devuelve 0 |
| `error` | Tras ejecutarlo, `ER` devuelve 1 (hardware) o 2 (comando) |

| `motivo` (si `rechazado`) | Causa |
|---|---|
| `destino` | El campo `destino` no coincide con el del receptor |
| `formato` | JSON inválido, `cmd` desconocido o argumentos fuera de rango |
| `caducado` | `ts` con más de 500 ms de antigüedad |
| `no_referenciado` | `jog_mundo` o `mover_pose` sin haber hecho `home` |
| `error_activo` | El robot está en error. Solo se aceptan `reset` y, después, `home`; cualquier otro comando se rechaza |
| `desconectado` | La placa no tiene comunicación con el robot |
| `reloj` | El desfase del reloj de la placa supera 100 ms |
| `sin_latido` | No hay permiso de movimiento: falta el latido de la aplicación, o hay una parada sin rearmar (sección 5) |

Ejemplo de rechazo:

```json
{ "id": "a1b2c3", "ts": 1764067200050, "estado": "rechazado", "motivo": "no_referenciado" }
```

## 3. `actuadores`

Estado del robot tal como lo ve la placa. Se publica al cambiar y, como mínimo, una vez por segundo.

```json
{
  "ts": 1764067201000,
  "conectado": true,
  "referenciado": true,
  "error": 0,
  "velocidad": 2,
  "pinza": "abierta",
  "ocupado": false,
  "cola": 0,
  "desfase_ms": 3,
  "permiso": true,
  "latido_edad_ms": 42,
  "parada": "ninguna",
  "circuito_parada": "cerrado"
}
```

| Campo | Significado |
|---|---|
| `conectado` | Hay comunicación RS-232 con la controladora |
| `referenciado` | Se ha completado `home` sin error desde el último arranque o error de modo I |
| `error` | Resultado de `ER`: 0 sin error, 1 modo I (hardware), 2 modo II (comando) |
| `velocidad` | Último `SP` enviado |
| `pinza` | Última orden de pinza: `abierta`, `cerrada` o `desconocida` |
| `ocupado` | Hay un comando enviado al robot sin terminar |
| `cola` | Comandos pendientes en la placa |
| `desfase_ms` | Desfase estimado del reloj de la placa respecto al servidor NTP |
| `permiso` | La placa tiene permiso de movimiento (latido válido y sin parada pendiente de rearme) |
| `latido_edad_ms` | Tiempo desde el último latido válido |
| `parada` | Causa de la última parada: `ninguna`, `latido` (pérdida), `remota` (`stop`), `local` (pulsador de la placa) o `placa` (fallo propio) |
| `circuito_parada` | Estado del circuito de parada leído de vuelta por la placa: `cerrado` (permite mover), `abierto` (parado) o `discrepancia` (el contacto no coincide con lo ordenado) |

La controladora del RV-M1 no informa del estado de cada motor (corriente, temperatura, ángulo), así que `actuadores` describe el estado del robot en conjunto.

## 4. `posicion/mundo`

Posición cartesiana del TCP leída con `WH`. Se publica tras cada movimiento y, en reposo, cada 500 ms.

```json
{
  "ts": 1764067201000,
  "x": 251.0, "y": 0.0, "z": 299.0,
  "pitch": -90.0, "roll": 0.0,
  "valida": true
}
```

- `x`, `y`, `z` en mm; `pitch` y `roll` en grados.
- `valida` es `false` mientras el robot no esté referenciado: sin `home` la posición no es fiable.

## Modos del gemelo

El gemelo funciona en uno de tres modos, que se muestra siempre en su pantalla y en `actuadores` (campo `modo`):

| Modo | Qué hace | Topics que lee del robot real |
|---|---|---|
| `emulador` | Interpreta los comandos de `rvm1/gemelo/<id>/comandos` como la controladora D/U-M1 y publica su propio estado. No depende del robot real. Es el modo de formación del alumnado. | ninguno |
| `sombra` | Igual que `emulador`, y además dibuja la pose del robot real y calcula el error gemelo–real (mm y grados). Sirve para medir la fidelidad del emulador con el mismo programa enviado a los dos destinos. | `rvm1/real/<idReal>/posicion/mundo`, `rvm1/real/<idReal>/actuadores` |
| `sincronizado` | No emula: su pose sigue a la del robot real recibida por MQTT. Sirve para ver el robot real a distancia. | los mismos que `sombra` |

El gemelo **nunca publica en `rvm1/real/...`**. En los modos `sombra` y `sincronizado` registra cada pose real y la propia con marca de tiempo (formato de `registro-experimentos`) para el experimento E2.

## Extensión solo del gemelo: `estado3d`

`rvm1/gemelo/<id>/estado3d` (QoS 0, retain) lo publica la página que emula el robot para que otra página, en modo visor, dibuje el modelo 3D: `{ "v":1, "ts", "q":[5], "apertura", "tl", "err", "cubo":{…}, "mesita":{…}, "col":{ "seq", "piezas" } }`. No existe para el robot real (que no informa de los ángulos de sus ejes) y no forma parte del contrato que debe cumplir la placa. Permiso de escritura: solo el alumno de ese gemelo y `profesor`.

## Relojes

La caducidad compara el `ts` del cliente con el reloj de la placa, así que todos los equipos deben estar sincronizados por NTP con el mismo servidor de la red del aula. La placa publica en `actuadores` el campo `desfase_ms` (desfase estimado respecto al servidor NTP) y los experimentos lo registran. Si el desfase supera 100 ms, la placa rechaza todos los comandos con motivo `reloj`.

## 5. Latido y parada segura (requisito indispensable para el robot real)

**Principio:** el robot solo puede moverse mientras la placa recibe latidos válidos de la aplicación. La parada no depende de que llegue un mensaje «parar»: la **ausencia** de latido la provoca. Una orden `stop` explícita es un atajo más rápido, pero la garantía la da el latido. Esto es una función de seguridad **del sistema que se diseña y se mide**; **no está certificada** (ISO 13849 / IEC 62061) y **no sustituye a las setas físicas**, que siguen siendo la parada de emergencia real.

### Latido

- Topic `rvm1/real/<id>/latido`, QoS 0, sin retain, solo para el destino `real` (el gemelo lo admite igual para que el alumnado practique).
- Contenido: `{ "seq": 1234, "ts": 1764067200000, "sesion": "a1b2c3" }`. `seq` crece de uno en uno; `sesion` identifica la sesión de mando.
- Periodo de la aplicación: `T_latido` = 100 ms (parámetro; el valor definitivo sale de la latencia medida).
- Solo un emisor puede mandar: la ACL del broker permite publicar en `latido` únicamente al usuario con permiso de mando del robot real (`profesor`). Una segunda sesión con otro `sesion` activo no suma.

### Permiso de movimiento (lo decide la placa)

- **Se concede** tras `N_ini` = 3 latidos válidos consecutivos (`seq` creciente, `ts` dentro de la ventana de caducidad) y sin parada pendiente de rearme.
- **Se pierde** si pasan más de `T_timeout` = 3 × `T_latido` (300 ms, a confirmar con la medida) sin un latido válido, si el `seq` retrocede o salta de forma incoherente, o si hay parada.
- **Sin permiso:** la placa rechaza los comandos que mueven el robot (`home`, `jog_*`, `mover_pose`, `pinza`) con el motivo `sin_latido`. `velocidad`, `reset` y las consultas siguen disponibles.

### Parada

Al perder el permiso **con el robot en movimiento o con movimiento permitido**, y al recibir `stop`, la placa **abre el circuito de parada eléctrica** (`EXT. EMG. STOP` de la D/U-M1) y publica `parada` y `circuito_parada` en `actuadores`. La orden `stop` se atiende en la placa sin pasar por la cola RS-232C. `parar` (vaciar la cola) se mantiene y no sustituye a `stop`.

**Rearme manual:** tras una parada el circuito **no se cierra solo**. Hace falta una acción local deliberada en la placa (pulsador de rearme) y después latidos válidos otra vez. El rearme desde la aplicación no existe. Después hay que referenciar el robot (`home`) si la controladora lo exige.

### Requisitos de la placa (fallo seguro)

1. El circuito de parada es **normalmente abierto sin energía**: solo permite mover mientras el ESP32 lo mantiene activo (relé o optoacoplador «energizado para permitir»). Sin alimentación, sin firmware o sin latido, el robot está parado.
2. **Watchdog hardware** y detector de caída de tensión del ESP32 que abren el circuito sin depender del código.
3. **Lectura de vuelta** del contacto (interfaz «supervisada»): si no coincide con lo ordenado, `circuito_parada = discrepancia` y no se concede permiso. Prueba del circuito al arrancar y de forma periódica.
4. La decisión de cortar **no depende del broker**: si falla el broker, la red o la aplicación, deja de llegar el latido y la placa corta por sí misma.
5. **Pulsador de parada local** en la placa, independiente del WiFi.
6. Las setas físicas de la controladora y de la teaching box siguen **en serie e independientes** de todo lo anterior.

### Presupuesto de tiempo

`t_parada_max = T_timeout + t_placa + t_rele + t_frenado`

`t_frenado` es el tiempo y el recorrido del RV-M1 desde que se abre `EXT. EMG. STOP` hasta que se detiene (frenos de J2 y J3): **dato por medir en el robot real**. Los demás términos se miden en la placa. El valor de `T_timeout` se elige con la latencia de latido medida (percentil 99 y máximo, con la red cargada) más un margen, no a ojo.

### Condiciones de uso mientras no haya certificación

Persona con la mano junto a la seta en toda sesión con el robot real, celda acotada, velocidad reducida (`SP` bajo) y red WiFi dedicada (SSID propio, sin roaming) con el broker en la misma LAN.

### Validación (experimentos)

- Distribución de la latencia del latido y de `stop` (percentiles 50/95/99 y máximo), con y sin carga de red.
- Inyección de fallos: cortar el WiFi, matar el broker, cerrar la aplicación y quitar la alimentación a la placa; en cada caso, medir el tiempo hasta que el circuito se abre y comprobar que **ningún fallo lo deja cerrado**.
- Comprobar el rearme: no se produce por sí solo.
- Registrar todo en JSONL con el método de medida de los relojes.

## Red y seguridad

Permisos en el broker del aula (`Codigo/Broker/`): cada `alumnoNN` solo publica en `rvm1/gemelo/NN/...`; como su navegador ejecuta su propio gemelo, publica también los topics de estado de ese gemelo (`comandos/ack`, `actuadores`, `posicion/mundo`, `online`). Solo `placa_real` publica el estado de `rvm1/real/...` y solo `profesor` puede mandar `comandos` al robot real. Si no hay NTP, el desfase se puede estimar con la ruta `/hora` del servidor web del aula (hora del servidor en ms).


El broker funciona en una red de aula aislada. Como mínimo, el broker exige usuario y contraseña y listas de acceso por topic: solo la placa publica en `rvm1/real/#` salvo `comandos`, y solo los usuarios autorizados publican en `rvm1/real/+/comandos`. Si la red no está aislada, se usa TLS (MQTT sobre puerto 8883, o WSS para clientes web).

## Supuestos por verificar con el robot

- Que la controladora no responde a `ER` hasta terminar el movimiento anterior. En eso se basa el ACK `hecho`.
- Los rangos válidos de cada argumento.
