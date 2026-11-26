# Gemelo digital del Mitsubishi Movemaster EX RV-M1

Aplicación web estática que se comporta como la controladora D/U-M1 y habla el contrato MQTT (`Docu/contrato_mqtt.md`, v0.3) como `rvm1/gemelo/<id>/`. Un programa escrito para el gemelo sirve para el robot real cambiando solo el destino. En pantalla solo hay dos vistas, el modelo 3D y el teach pendant, más una barra de conexión plegable.

Sin compilación ni dependencias externas en tiempo de ejecución: JavaScript plano, three.js y mqtt.js copiados en `lib/`.

## Lanzarlo

```bash
cd gemelo
python3 -m http.server 8080
# abrir http://localhost:8080/
```

`python -m http.server` no sirve la ruta `/hora` (el desfase queda sin medir, `null`) y en algunos Windows entrega los `.js` como `text/plain`. En el aula es mejor el servidor de `Codigo/Broker/` (nginx de Docker Compose o `python Codigo/Broker/servidor_web.py`, puerto 8080), que sirve esta carpeta y `/hora`.

Parámetros de URL opcionales:

| Parámetro | Efecto |
|---|---|
| `?id=07` | Id del gemelo (manda sobre el usuario y lo recordado) |
| `?vista=az,el,dist[,x,y,z]` | Cámara inicial (rad, m) |
| `?demo=1` | Postura de demostración con dos puntos guardados (capturas) |
| `?fantasma=1` | Fantasma de ejemplo desplazado, para enseñar el modo SOMBRA sin robot (solo capturas; no son datos) |
| `?captura=1` | Conserva el búfer WebGL para las capturas headless |

## Conectarlo a un broker

El broker es opcional; sin él, el gemelo y el pendant funcionan en local.

1. Desplegar **Conexión ▾** en la barra superior.
2. URL: por defecto `ws://<host de la página>:9001` (`wss://` si la página va por HTTPS). Usuario `alumnoNN` y contraseña. El id del gemelo se deduce del usuario (`alumno07` → `07`) y se puede editar.
3. **Conectar.** La configuración se guarda en `localStorage`, salvo la contraseña, que no se guarda ni va en la URL. El `clientId` es aleatorio, así que el alumno puede conectar a la vez desde el navegador y desde Python.

Al conectar, el gemelo:

| Topic | Sentido | QoS | Retain |
|---|---|---|---|
| `rvm1/gemelo/NN/comandos` | se suscribe | 1 | — |
| `rvm1/gemelo/NN/comandos/ack` | publica | 1 | no |
| `rvm1/gemelo/NN/actuadores` | publica al cambiar y ≥ 1 Hz | 1 | sí |
| `rvm1/gemelo/NN/posicion/mundo` | publica tras cada movimiento y cada 500 ms en reposo | 0 | sí |
| `rvm1/gemelo/NN/online` | `online` al conectar; LWT `offline` | 1 | sí |

Los programas externos de los alumnos (por ejemplo Python con paho-mqtt, ver `Codigo/Broker/ejemplos/`) mueven el gemelo publicando en `comandos`. El 3D y el pendant (en modo local) reflejan esos movimientos porque leen el estado de la controladora emulada.

## Modos del gemelo

Se eligen en la barra de conexión y se ven en la barra de estado del pendant (`EMULADOR`, `SOMBRA`, `SINCRONIZADO`). Los modos 2 y 3 necesitan el broker.

| Modo | Qué hace | Topics que lee del real |
|---|---|---|
| **EMULADOR** (por defecto) | Interpreta `rvm1/gemelo/NN/comandos` y publica su estado | — |
| **SOMBRA** | Igual que EMULADOR y, además, dibuja un robot fantasma azul semitransparente con la pose real (cinemática inversa desde X, Y, Z, P, R) y muestra en el pendant el error gemelo–real (`Δ real: … mm · ΔP …° · ΔR …°`) | `rvm1/real/<idReal>/posicion/mundo`, `actuadores`, `online` |
| **SINCRONIZADO** | El modelo 3D sigue la pose real recibida, sin emular, para ver el robot real a distancia. Mientras dura, el emulador deja de atender `comandos` y publica `online = "offline"` en `rvm1/gemelo/NN/online`; el pendant (si su destino es local) pasa a solo lectura y muestra la posición real | los mismos |

- El gemelo **nunca publica en `rvm1/real/...`**. La única excepción es el pendant con destino REAL, que publica `comandos` (solo el usuario `profesor` tiene permiso en el broker del aula).
- Si la pose real no cabe en los límites provisionales del gemelo, el fantasma se dibuja igual con la solución que menos los viola y se avisa ("fuera de límites del gemelo"). Esto sirve para corregir los límites de `config_rvm1.js`.
- En SOMBRA y SINCRONIZADO, cada `posicion/mundo` recibida del real genera un evento `pos` en el registro con la pose real (y su `ts` de la placa), la pose y las articulaciones del gemelo en ese instante y el error. Es el dato del experimento E2.

## Presentes (quién está en línea)

En **Conexión**, tras conectar el broker, el apartado **Presentes (en línea)** lista en vivo los gemelos y los robots reales que están en línea (punto verde) o sin conexión. Sale de los topics `online` retenidos (`rvm1/gemelo/<id>/online` y `rvm1/real/<id>/online`, con última voluntad `offline`) y se actualiza solo. Cada usuario ve lo que su ACL le deja leer: un alumno, su gemelo y los robots reales; `profesor`, todo.

- **Gemelo propio:** «Pendant → gemelo» manda el pendant a tu gemelo por MQTT.
- **Robot real en línea:** «Pendant → real» (con la misma confirmación de seguridad que el selector «Destino») y «Sincronizar» (la vista 3D sigue al robot real sin moverlo).
- Así se puede empezar con el gemelo y pasar al robot real después sin tocar los campos a mano. Código en `js/mqtt/presentes.js`.

## Configuración

El botón **⚙ Configuración** (arriba a la derecha) abre una ventana cuyos cambios se aplican y se guardan al momento en el navegador (`rvm1.ajustes`; botón «Restablecer valores»). Código en `js/modelo/ajustes.js` (valores, límites y almacenamiento) y `js/interfaz/configuracion.js` (ventana).

| Apartado | Ajuste |
|---|---|
| Pantalla | Qué se ve: pendant y 3D, solo el pendant o solo la vista 3D (ver «Pendant en un equipo y vista 3D en otro»). Cambiarlo recarga la página; `?ver=` en la dirección manda sobre este ajuste |
| Vista 3D | Mostrar los ejes X, Y, Z y la nave de fondo |
| Contactos | La mesa y la base son sólidas (el robot se detiene al tocarlas) o solo avisan en rojo |
| Mando de juego | Activarlo y zona muerta de las palancas (0,3–0,9); indica si hay un mando detectado |
| Jog | Velocidad de jog continuo con la que empieza el pendant (lenta, media, rápida, máx) |

## Mando de juego

El pendant también se maneja con un mando (Xbox, PlayStation u otro con disposición «standard»; lo detecta el navegador al pulsar un botón). Cada botón del mando hace **lo mismo que su botón en pantalla** y lo ilumina un instante, así que se puede alternar ratón, dedo y mando. Código en `js/interfaz/mando.js`.

| Mando | Acción | Mando | Acción |
|---|---|---|---|
| Start | ENABLE (conmuta) | LT / RT | ABRIR / CERRAR pinza |
| B | STOP | A / X | HE n / MO n |
| Back | RESET | LB / RB | COORD / STEP-CONT |
| Y | HOME | Cruceta ↑ ↓ | SP + / − |
| Cruceta ← → | Jog J5 − / + | Clic palanca izq. / der. | INCR / punto siguiente |
| Palanca izquierda | Eje 1 (←→) y eje 2 (↑↓) | Palanca derecha | Eje 3 (↑↓) y eje 4 (←→) |

Las palancas hacen jog de un solo eje a la vez (el de más recorrido); con una zona muerta y una histéresis para evitar saltos. En STEP da un paso por cada empujón y en CONT avanza mientras se mantiene la palanca. **Seguridad:** hace falta ENABLE como con el ratón, y si el mando se desconecta se suelta el jog y se deshabilita el pendant. Con destino REAL valen las mismas precauciones que en el resto del pendant.

## Pendant en un equipo y vista 3D en otro

Con el broker conectado, la misma página se puede abrir en dos equipos con el mismo id de gemelo:

- **Equipo del pendant:** `…/?ver=pendant&id=07`. Solo se ve el pendant (y los botones de práctica). Sigue emulando el robot y publica `rvm1/gemelo/07/estado3d`.
- **Equipo de la vista 3D:** `…/?ver=visor&id=07`. Solo se ve el modelo 3D, incluidos el cubo, la mesita y el aviso rojo de colisión. Entra con el mismo usuario en «Conexión»; solo lee y **no publica nada** (no hay pendant, ni comandos ni estado).

`estado3d` es un topic **solo del gemelo** (QoS 0, retain, como mucho cada 60 ms al moverse y una vez por segundo parado): ángulos, apertura de la pinza, TL, error, cubo, mesita y último aviso de colisión. Código en `js/mqtt/estado3d.js`. El broker del aula lo permite en la ACL del alumno (`Codigo/Broker/crear_usuarios.py`; tras cambiarlo, `python crear_usuarios.py --conservar` y reiniciar el broker). Si el visor deja de recibir datos durante más de 3 s lo indica en pantalla. Sin `?ver=` la página se comporta como siempre (pendant y 3D juntos).

## Escena de prácticas: cubo, mesita y colisiones

Sobre la mesa hay un **cubo naranja de 25 mm** y una **mesita azul de 100 × 100 × 40 mm**, alcanzables con la pinza vertical (P = −90°). Posiciones y tolerancias en `js/modelo/config_escena.js` (coordenadas del robot en mm, Z = 0 en la cara superior de la mesa: cubo en X 260, Y −150; mesita en X 260, Y 150). El estado vive en el modelo headless `js/modelo/mundo.js`, así que funciona igual por MQTT desde Python; `js/render3d/objetos.js` solo lo dibuja.

- **Coger:** `GC` (o `MO n,C`) con el TCP a menos de 10 mm del centro del cubo en el plano y ±12 mm en vertical (el TCP queda 8 mm por debajo del centro del cubo): el cubo queda sujeto y se mueve con la pinza.
- **Soltar:** `GO` y el cubo cae sobre lo que tenga debajo (mesa, mesita o el suelo si está fuera de la mesa).
- **Recolocar:** botón «Recolocar objetos» (cubo y mesita) en la vista 3D (`window.gemelo.mundo.recolocar()`).
- **Contactos.** Cápsulas por eslabón (brazo, antebrazo, mano, dedos) y el cubo agarrado contra la mesa, la base, la mesita y el cubo suelto:
  - **Mesa y base: sólidas.** El robot no las atraviesa: se queda donde toca, el movimiento en curso se cancela, la vista 3D se tiñe de rojo 0,8 s con el rótulo **COLISIÓN** y sale en la alarma del pendant. No genera error de la controladora (se puede salir con jog) y se anota en el JSONL como evento `colision`. Un programa en ejecución se detiene. Por MQTT el movimiento termina con ACK `hecho` en la posición alcanzada.
  - **Cubo suelto:** lo empuja el brazo; si va con velocidad sale despedido, desliza y gira según dónde le den, y cae si pierde el apoyo. Los dedos pasan sin tocarlo solo cuando bajan o suben centrados sobre él (para cogerlo).
  - **Mesita:** el brazo, o el cubo que lleva, la desplaza mientras empuja; el cubo que tiene encima se mueve con ella.
  - El aviso no se repite mientras siga el contacto: vuelve a avisar al separarse y chocar otra vez.

Parámetros de URL para capturas: `?practica=1` (cubo dejado sobre la mesita) y `?colision=1` (aviso fijo tras bajar la mano contra la mesa).

### Programas: ejecutar, escribir, guardar, importar y exportar

El botón **▶ …** (arriba a la izquierda de la vista 3D) ejecuta el programa cargado y **Programas…** abre la ventana de gestión. Un programa es una lista de líneas del lenguaje de la controladora (`NT`, `SP n`, `GO`, `GC`, `MP x,y,z,p,r`, `MJ`, `DJ`, `DS`, `TL`, `HE`, `MO`…) que van a la misma controladora que los comandos del pendant o de MQTT. Las líneas vacías y los comentarios (`#` o `;` hasta el final de la línea) se ignoran.

- **Integrado: «Ciclo del cubo».** Recoloca el cubo y, en bucle: `NT`, `SP 5`, `GO`; coge el cubo de la mesa y lo deja en la mesita; `NT` (origen de referencia); lo coge de la mesita y lo deja en su sitio de la mesa; `NT`. No se puede borrar ni sobrescribir: se edita y se guarda con otro nombre.
- **Escribir y guardar.** *Nuevo*, escribir las líneas, *Validar* (comprueba cada línea con el analizador de la controladora y señala la que falla) y *Guardar*. Los programas se guardan en el navegador (`localStorage`, clave `rvm1.programas`): no viajan entre equipos; para eso está el JSON.
- **Desde puntos.** Escribe un programa con un `MP x,y,z,p,r` por cada punto guardado con HE en el pendant (no usa `MO n`, para que funcione en otro equipo o en el robot real). Hay que añadir a mano `GO`/`GC` donde toque abrir o cerrar la pinza.
- **Puntos.** Los puntos HE del emulador se guardan en el navegador (`rvm1.puntos.emulador`) y se restauran al abrir con `PD`, así que no se pierden al recargar.
- **Cargar.** Se elige en la lista y *Usar este programa* lo deja listo para el botón ▶. El último usado se recuerda en ese navegador.
- **Exportar / importar JSON.** *Exportar JSON* baja el programa del editor (`programa-<nombre>.json`) y *Exportar todos* baja la lista completa (`programas-rvm1.json`). *Importar JSON…* admite uno o varios ficheros, con un programa, una lista o `{programas:[…]}`; rechaza con el motivo los que no validan y renombra los que coinciden con uno integrado.
- **Puntos con estado de pinza.** Cada punto `HE n` guarda también si la pinza estaba abierta o cerrada (la lista del pendant lo muestra: `ABIE` / `CERR`), se restaura al recargar (`PD n,x,y,z,p,r[,O|C]`, el último valor es opcional) y el botón *Desde puntos* escribe un `GO` o `GC` cuando cambia. «Ir al punto» (F6) manda `MO n,O` o `MO n,C` para dejar la pinza como estaba. Los puntos guardados antes de esta versión no tienen estado y se tratan como desconocido.
- **Se detiene** con el mismo botón, con STOP del pendant o si la controladora da error (la alarma del pendant dice cuál). Un programa no cíclico acaba solo.

Formato de intercambio (`formato: "rvm1-programa"`, `version: 1`):

```json
{
  "formato": "rvm1-programa",
  "version": 1,
  "nombre": "Mi prueba",
  "descripcion": "Dos puntos y vuelta al origen",
  "ciclico": false,
  "lineas": ["NT", "SP 9", "MP 300,0,150,-90,0", "MP 300,100,150,-90,0", "NT"]
}
```

Código: `js/modelo/programa.js` (ejecución, validación, JSON y almacén, sin DOM) y `js/interfaz/programas.js` (ventana). Pruebas en `tests/mundo.test.js`. Con `?gestor=1` la página abre la ventana (capturas).

## Modelo 3D

Procedural en three.js, con el aspecto parametrizado en `ASPECTO` (`js/render3d/modelo_rvm1.js`), a partir de fotos del robot real (no se suben al repositorio): carcasas marfil amarillento satinado, base en dos niveles (placa y pedestal con cajetín trasero de conectores), anillo de la cintura gris oscuro, tambor lateral en el hombro, cable rizado negro, pinza negra tipo caja y rótulos de texto plano «MOVEMASTER EX» y «MITSUBISHI» (sin logotipos). Las longitudes cinemáticas salen de `config_rvm1.js`. La nave de taller de fondo está en `js/render3d/nave.js` y los ejes X/Y/Z en `js/render3d/ejes.js`.

## Teach pendant

Mismo diseño y comportamiento que `Codigo/Software_Control/rvm1_pendant.py`: barra MANUAL/STOP · JOINT/WORLD · STEP/CONT · SP · REF, línea de alarma, X Y Z P R, seta STOP software enclavada hasta RESET, COORD, STEP/CONT, INCR, −%/+%, jog con rótulos `−X (J1)`, WORLD bloqueado sin referenciar, J4/J5 `art.` en WORLD, SP 2 al conectar y aviso de override desde SP 6. Se añade:

- **F1 HOME, F2 RESET, F3 ABRIR, F4 CERRAR, F5 HE n, F6 MO n** y la lista de puntos (−/+ para elegir n o tocar la línea).
- **Habilitación (ENABLE conmutado):** simplificación didáctica. Se pulsa una vez (botón táctil o barra espaciadora) para habilitar —LED y botón en verde con «HABILITADO»— y otra para deshabilitar; no hay que mantenerlo. Se deshabilita solo con STOP, al perder la conexión y al ocultar la página o cambiar de pestaña. **En un pendant real el dispositivo de habilitación es de tres posiciones y se mantiene pulsado.** MO también exige habilitación; HOME no (como en el pendant Python).
- **Jog:** incrementos STEP de 0,1, 1, 5 y 10 (PEQ/MED/GRA/MUY). En CONT, X/Y/Z avanzan 5 mm por tick (200 ms) y los ejes articulares 2°.
- **Destino** (barra de conexión): *Local* (texto RV-M1 directo a la controladora emulada, como el pendant Python por RS-232C), *MQTT gemelo* (contrato) o *MQTT REAL* (pide confirmación, marca el pendant en rojo y muestra un aviso permanente).
- Con destino MQTT, el contrato no tiene HE/MO: los puntos se guardan en el propio pendant (`localStorage`) con la última `posicion/mundo` válida y "ir" se hace con `mover_pose`. Si se quiere HE/MO real por MQTT, hay que añadir dos comandos al contrato (propuesta abajo).

El STOP de pantalla solo deja de enviar órdenes: en local vacía la cola del pendant y con MQTT envía `parar`. **La parada de emergencia real es la seta física.**

## Registro (JSONL) para el experimento E2

Barra de conexión → **Registro** → *Descargar*. Genera `AAAAMMDD-HHMMSS_gemelo_<descripcion>.jsonl` con el formato de la skill `registro-experimentos` (`t_ms`, `t_mono_ns`, `nodo`, `destino`, `evento`):

- `nota` al inicio y al conectar: versión del gemelo y del contrato, supuestos activos, broker, usuario, operador, modo; además, cada medida del desfase con `/hora` (método, desfase, RTT).
- `cmd_rx`, `ack_tx`, `serie_tx`, `serie_rx`, `pos` y `estado` de la pasarela; `cmd_tx` y `ack_rx` del pendant cuando usa MQTT (`nodo: "pendant"`).
- `pos` con `destino: "real"` en los modos SOMBRA y SINCRONIZADO (ver arriba).

`t_mono_ns` sale de `performance.now()`, cuya resolución la limita el navegador. Los registros del gemelo son simulados: dónde guardarlos (`datos_crudos/` del E2 junto al registro del real, o `datos_simulados/`) lo fija el protocolo del experimento. El campo "commit" hay que anotarlo a mano.

## Relojes (contrato v0.3)

- Caducidad: se rechaza (`caducado`) un `ts` con más de 500 ms de antigüedad o más de 100 ms por delante del reloj del gemelo, al recibir y al ejecutar.
- `desfase_ms` se estima cada 30 s con `/hora` (algoritmo de Cristian, menor RTT de 5 muestras; `/hora` devuelve segundos con milisegundos y también se aceptan ms). Sin `/hora` se publica `null` y no se aplica el rechazo `reloj`.
- Si el reloj del PC está desfasado más de 100 ms, el gemelo rechaza todo con `reloj`, como la placa. `contrato.corregir_reloj_con_hora` (en `config_rvm1.js`, `false` por defecto) hace que el gemelo corrija su reloj con `/hora`, como haría una placa con NTP. **Decisión pendiente del autor.**

## Estructura

```
Codigo/Gemelo/
  index.html, css/gemelo.css
  lib/                 three.module.min.js (0.169.0), mqtt.min.js (5.16.1) y sus licencias
  js/modelo/           HEADLESS (Node y navegador): config_rvm1.js (todos los datos del robot), cinematica.js,
                       controladora.js (emulador D/U-M1), registro.js
  js/mqtt/             pasarela.js (contrato, lado placa), cliente_contrato.js (lado aplicación), transporte_mqtt.js,
                       hora.js (desfase con /hora), observador_real.js (modos SOMBRA/SINCRONIZADO)
  js/render3d/         escena.js (luces, mesa, cámara orbital ratón/táctil), modelo_rvm1.js (RV-M1 procedural)
  js/interfaz/         pendant.js, enlaces.js (local / MQTT / espejo), barra.js
  js/app.js            une modelo → estado → vistas (las vistas solo leen)
  tests/               node --test Codigo/Gemelo/tests
  herramientas/        capturas.sh, prueba_navegador.js, prueba_mosquitto.js (opcionales)
  capturas/            capturas del diseño en 1920×1080, 1366×1024, 1180×820, 1024×1366, 820×1180 y 390×844
```

La pasarela habla con la controladora emulada **solo por su interfaz de texto** (`NT`, `DJ`, `ER`, `WH`…), como la placa real por RS-232C, así que su lógica se puede llevar a la placa.

## Pruebas

```bash
node --test Codigo/Gemelo/tests                  # 60 pruebas: cinemática, controladora, pasarela (contrato), hora, observador
```

Opcionales, con dependencias instaladas fuera del repositorio:

```bash
mkdir -p /tmp/deps && (cd /tmp/deps && npm init -y && npm install puppeteer-core@23 mqtt@5)
(cd gemelo && python3 -m http.server 8765 --bind 127.0.0.1 &)
NODE_PATH=/tmp/deps/node_modules node Codigo/Gemelo/herramientas/prueba_navegador.js http://127.0.0.1:8765/
# con un mosquitto LOCAL (listener 18830 y listener 19001 websockets, anónimo, solo 127.0.0.1):
NODE_PATH=/tmp/deps/node_modules node Codigo/Gemelo/herramientas/prueba_mosquitto.js http://127.0.0.1:8765/ ws://127.0.0.1:19001 mqtt://127.0.0.1:18830
sh Codigo/Gemelo/herramientas/capturas.sh http://127.0.0.1:8765 Codigo/Gemelo/capturas
```

`prueba_mosquitto.js` se niega a ejecutarse contra un broker que no sea `127.0.0.1`/`localhost`.

## Datos del robot por verificar

Todos están en `js/modelo/config_rvm1.js`, marcados con `VERIFICAR con el plano del manual`:

| Dato | Valor provisional |
|---|---|
| Altura del eje del hombro (J2) sobre la base | 300 mm |
| Eje de cabeceo (J4) → brida | 72 mm |
| Longitud de herramienta por defecto (TL) | 107 mm |
| Límites respecto al cero: J1 / J2 / J3 / J4 / J5 | ±150 / −10…+120 / −110…0 / ±90 / ±180 ° |
| Convenio de signos y ceros de cada eje (y si P es absoluto y R = J5) | el descrito en la cabecera del fichero |
| Postura del origen tras `NT` | J = (0, 90, −90, −90, 0) |
| Duración de `NT`, tabla SP 0–9, tiempo de pinza, nº de posiciones (629), rango de `TL` | 4 s, lineal 10–100 %, 0,4 s, 629, 0–300 mm |

Con los límites provisionales, el codo (−110°) no deja llegar con la mano vertical a puntos bajos y cercanos; si el robot real sí llega, los límites o los ceros están mal. En el modo SOMBRA se ve enseguida: el aviso "fuera de límites del gemelo" lo indica.

Datos seguros (manual): brazo 250 mm, antebrazo 160 mm, recorridos 300/130/110/180/360°, velocidades 120/72/109/100/163 °/s, frenos en J2 y J3, carga 1,2 kg, 1000 mm/s en la muñeca.

**Aspecto 3D:** anchos, carcasas, posición de motores y colores están en `ASPECTO` (`js/render3d/modelo_rvm1.js`), separados de la cinemática, para afinarlos con fotos y medidas del robot.

## Comportamiento de la controladora: supuestos

Configurables en `config_rvm1.js → supuestos`; ninguno está verificado con el robot:

1. **S1** `ER` (y `WH`) se atienden en orden: no responden hasta terminar el movimiento anterior. Es la base del ACK `hecho`.
2. **S2** `DJ`/`MJ` se aceptan antes de `NT`.
3. **S3** Sintaxis y rangos de argumentos (`DJ 1,10`, `MO n[,O|C]`, `SP n[,H|L]`…).
4. **S4** No hay forma de abortar un movimiento por RS-232C.
5. **S5** En error, solo se procesan `RS`, `ER` y `WH`; el resto se ignora.
6. **S6** Un punto inalcanzable (MP, MO, DS, DJ fuera de límites) da error de modo II y el robot no se mueve. En `DS`, la recta entera se comprueba antes de empezar.
7. `HE`/`MO` exigen `NT`. Errores de modo I solo por avería inyectada (`gemelo.ctrl.inyectarErrorModoI()` en la consola): corta el movimiento, aplica frenos y pierde la referencia.

## Decisiones sobre el contrato (para la sesión principal)

Interpretaciones tomadas sin cambiar el contrato:

- `error_activo`: tras ER=1 solo se acepta `reset` y después `home`; tras ER=2 basta `reset`. Los comandos en cola cuando aparece un error se rechazan con `error_activo`.
- `parar`: vacía la cola **sin enviar ACK** de los descartados (el contrato no da motivo) y su propio ACK final es `hecho` sin `er`, porque `ER` esperaría al final del movimiento en curso.
- `velocidad` en `actuadores` es `null` hasta el primer `velocidad` recibido.
- `desfase_ms` es `null` si no se ha podido medir.
- Solo gemelo: si el pendant local hace `NT` directamente sobre la controladora, la pasarela adopta el estado de referencia (en la placa real no aplica).

Propuestas para la próxima versión del contrato (no aplicadas):

1. Motivo `cancelado` para los comandos descartados por `parar`.
2. Comandos `guardar_punto {n}` (`HE n`) e `ir_punto {n}` (`MO n`).
3. Permitir `desfase_ms: null` ("no medido") explícitamente.
4. En la sección "Modos del gemelo" (v0.4): que en SINCRONIZADO el gemelo publique `online = "offline"`, como hace esta implementación.

## Licencias de `lib/`

- `three.module.min.js`: three.js 0.169.0, licencia MIT (`lib/LICENSE.three`).
- `mqtt.min.js`: MQTT.js 5.16.1, licencia MIT (`lib/LICENSE.mqtt.md`).

Copiados de los paquetes npm `three@0.169` y `mqtt@5` (instalados en un directorio temporal fuera del repositorio).
