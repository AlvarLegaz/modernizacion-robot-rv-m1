# Servidor MQTT del aula y servidor web del gemelo

Esta carpeta levanta, en el PC del profesor, todo lo que necesita el aula para trabajar con el gemelo digital del RV-M1:

- **Mosquitto 2.x** con dos escuchas: **1883** (MQTT/TCP, para los programas Python de los alumnos y, más adelante, la placa del robot) y **9001** (MQTT sobre WebSocket, para el gemelo y el pendant que corren en el navegador).
- **Servidor web** en el puerto **8080** que sirve la carpeta `Codigo/Gemelo/` del repositorio. Los alumnos abren `http://<IP del PC del profesor>:8080`.
- **Usuarios con contraseña y ACL por topic** según el contrato MQTT (`Docu/contrato_mqtt.md`, v0.2, apartado «Red y seguridad»). No hay acceso anónimo.

El robot real se conectará más adelante. Mientras tanto, cada alumno trabaja con su propio gemelo (`rvm1/gemelo/<id>/...`) y no puede tocar el de los demás ni el robot real.

## Contenido

| Fichero | Para qué |
|---|---|
| `crear_usuarios.py` | Crea los usuarios y contraseñas, la ACL y la configuración local; escribe `credenciales_alumnos.csv` |
| `config/mosquitto.conf` | Configuración de Mosquitto para Docker |
| `docker-compose.yml` | Mosquitto (`eclipse-mosquitto:2`) + nginx (`nginx:alpine`) |
| `nginx/default.conf` | Sirve `Codigo/Gemelo/` y la hora del servidor en `/hora` |
| `servidor_web.py` | Sustituto de nginx sin Docker (también sirve `/hora`) |
| `comprobar_reloj.py` | Mide el desfase del reloj de un equipo respecto al PC del profesor |
| `ejemplos/cliente_gemelo.py` | Ejemplo para alumnos: mover su gemelo desde Python |
| `pruebas/prueba_broker.py` | Pruebas automáticas de autenticación, ACL y WebSocket |
| `pruebas/gemelo_falso.py` | Doble de prueba mínimo del gemelo (solo para pruebas, **no** es el gemelo) |

Ficheros que genera `crear_usuarios.py` y que **no se suben** al repositorio (están en `.gitignore`): `config/passwd`, `config/acl`, `credenciales_alumnos.csv`, `credenciales_internas.csv`, `mosquitto_local.conf` y `data/`.

## Requisitos

- **Python 3.8+** en el PC del profesor (para `crear_usuarios.py`). No necesita paquetes extra.
- **Una de estas dos opciones:**
  - **A. Docker** (Docker Desktop en Windows, o Docker Engine con el plugin `compose` en Linux). Recomendada.
  - **B. Sin Docker:** Mosquitto 2.x instalado (Windows: instalador de <https://mosquitto.org/download/>; Linux: `sudo apt install mosquitto mosquitto-clients`).
- Los alumnos: un navegador moderno (para el gemelo) y, para programar, Python con `pip install paho-mqtt` (versión 2.x).
- Todos los equipos en la **misma red del aula**, que debe estar aislada (ver «Seguridad»).

## Puesta en marcha en 5 pasos

**1. Averigua la IP del PC del profesor** en la red del aula (`ipconfig` en Windows, `ip a` en Linux). En los ejemplos se usa `192.168.1.10`.

**2. Crea los usuarios** (por defecto 30 alumnos, `alumno01` … `alumno30`):

```bash
cd broker
python crear_usuarios.py            # o: python crear_usuarios.py -n 24
```

Escribe `credenciales_alumnos.csv` (para repartir) y `credenciales_internas.csv` (contraseñas de `profesor` y `placa_real`; no se reparten). Si `mosquitto_passwd` está instalado lo usa para calcular los hashes; si no, los calcula en Python con el mismo formato de Mosquitto 2 (PBKDF2-SHA512, `$7$101$...`).

**3. Arranca el broker y el servidor web.**

Opción A, con Docker:

```bash
docker compose up -d
docker compose logs -f mosquitto     # debe decir "Opening websockets listen socket on port 9001"
```

Opción B, sin Docker (dos consolas):

```bash
# Consola 1: broker (Windows: detén antes el servicio con "net stop mosquitto")
mosquitto -c mosquitto_local.conf -v
# Consola 2: web del gemelo
python servidor_web.py               # sirve ../gemelo en el puerto 8080
```

`mosquitto_local.conf` lo genera el paso 2 con las rutas absolutas de tu equipo. En lugar de `servidor_web.py` vale también `python -m http.server 8080` ejecutado **dentro de `Codigo/Gemelo/`**, pero no sirve `/hora` y, en algunos Windows, entrega los `.js` como `text/plain` y el navegador no carga el gemelo; `servidor_web.py` corrige ambas cosas.

**4. Abre los puertos en el cortafuegos** del PC del profesor (ver «Problemas típicos»): TCP 1883, 9001 y 8080 (y UDP 123 si haces de servidor NTP).

**5. Comprueba que funciona** (apartado «Comprobación») y reparte las credenciales.

Para pararlo: `docker compose down` (opción A) o `Ctrl+C` en las dos consolas (opción B).

## Reparto de credenciales

`credenciales_alumnos.csv` tiene tres columnas: `usuario`, `contrasena`, `id_gemelo`. Cada alumno recibe una fila: por ejemplo `alumno07`, `tasu-mepo-73`, `07`. El **id del gemelo son los dígitos del usuario**: `alumno07` solo puede trabajar en `rvm1/gemelo/07/`.

- Para ampliar la clase sin cambiar las contraseñas ya repartidas: `python crear_usuarios.py -n 35 --conservar`.
- Para regenerarlas todas (por ejemplo, curso nuevo): `python crear_usuarios.py --forzar`.
- El script no sobrescribe nada sin una de esas dos opciones.
- Tras cambiar usuarios, reinicia el broker: `docker compose restart mosquitto` (opción A) o `Ctrl+C` y volver a lanzarlo (opción B).

Las contraseñas son legibles (dos bloques de sílabas y dos cifras, unos 31 bits de entropía), pensadas para teclearlas en clase dentro de una red aislada. Las de `profesor` y `placa_real` son más largas.

## Qué puede hacer cada usuario (ACL)

| Usuario | Publica | Lee |
|---|---|---|
| `profesor` | `rvm1/#` | `rvm1/#` y `$SYS/#` |
| `alumnoNN` | `rvm1/gemelo/NN/comandos` (su programa) y, como su navegador ejecuta su gemelo, `rvm1/gemelo/NN/comandos/ack`, `.../actuadores`, `.../posicion/mundo`, `.../online` | `rvm1/gemelo/NN/#`; y **solo para observar** el robot real: `rvm1/real/+/posicion/mundo` y `rvm1/real/+/actuadores` |
| `placa_real` | `rvm1/real/+/comandos/ack`, `.../actuadores`, `.../posicion/mundo`, `.../online` | `rvm1/real/+/comandos` |

- **Solo `profesor` puede publicar en `rvm1/real/+/comandos`.** Ningún alumno puede mover el robot real, ni publicar nada en `rvm1/real/`.
- La lectura de `posicion/mundo` y `actuadores` del robot real permite a los alumnos ver en su pantalla lo que hace el brazo cuando el profesor lo mueve. Si no lo quieres, genera los usuarios con `--sin-observar-real`.
- Un alumno puede falsear los mensajes de **su propio** gemelo (ack, posición), porque su navegador es quien los publica. No afecta a nadie más.
- Mosquitto 2.0 **acepta** cualquier suscripción (también `#`), pero entrega a cada usuario solo los mensajes que su ACL le deja leer, incluidos los retenidos. Un alumno suscrito a `#` solo recibe lo suyo y lo que puede observar del robot real (comprobado en las pruebas).

## Cómo abre cada alumno su gemelo

1. Abre `http://192.168.1.10:8080` en el navegador.
2. Introduce su usuario, su contraseña y su id (`07`). El gemelo se conecta a `ws://192.168.1.10:9001` y trabaja en `rvm1/gemelo/07/`. (La forma exacta de introducir los datos, por ejemplo `http://192.168.1.10:8080/?id=07`, la define el gemelo; ver `Codigo/Gemelo/`.)
3. Con el gemelo abierto, el alumno lo mueve desde el pendant web o desde Python:

```bash
pip install paho-mqtt
python ejemplos/cliente_gemelo.py --host 192.168.1.10 --usuario alumno07
# por WebSocket, si el cortafuegos solo deja pasar el 9001:
python ejemplos/cliente_gemelo.py --host 192.168.1.10 --usuario alumno07 --ws
```

El ejemplo pide la contraseña, hace `home`, espera el ACK `hecho`, mueve en articular (`jog_articular`) y en cartesiano (`jog_mundo`, `mover_pose`), muestra `posicion/mundo` y provoca a propósito los rechazos `no_referenciado`, `caducado`, `destino`, `formato` y un `id` duplicado. Todos los mensajes siguen el JSON exacto del contrato (`id` único, `ts` en ms, `destino: "gemelo"`, QoS 1 y sin retain). Con `--registro fichero.jsonl` guarda cada mensaje enviado y recibido con el formato del registro de experimentos.

El gemelo tiene que estar **abierto en el navegador**: si no, nadie contesta a los comandos y el ejemplo avisa de que el gemelo no está `online`.

## Comprobación

Con los clientes de Mosquitto (`mosquitto_sub`/`mosquitto_pub`; en Windows están en la carpeta de instalación) y las contraseñas de `credenciales_*.csv`:

```bash
# 1. El profesor ve todo el tráfico:
mosquitto_sub -h 192.168.1.10 -u profesor -P <clave> -t 'rvm1/#' -v
# 2. En otra consola, alumno01 publica en su gemelo (debe verse en la consola 1):
mosquitto_pub -h 192.168.1.10 -u alumno01 -P <clave> -t rvm1/gemelo/01/comandos -m '{}'
# 3. alumno01 intenta publicar en el gemelo de alumno02 o en el robot real:
#    con MQTT 5 el broker contesta "Not authorized" y en la consola 1 no aparece nada.
mosquitto_pub -h 192.168.1.10 -V 5 -q 1 -u alumno01 -P <clave> -t rvm1/real/01/comandos -m '{}'
# 4. Sin usuario: "Connection Refused: not authorised".
mosquitto_pub -h 192.168.1.10 -t rvm1/gemelo/01/comandos -m '{}'
# 5. Web y hora del servidor:
curl http://192.168.1.10:8080/hora
```

Pruebas automáticas (arrancan un Mosquitto temporal en `127.0.0.1`, no usan el broker del aula):

```bash
pip install paho-mqtt
python pruebas/prueba_broker.py -v
```

## Relojes

El contrato rechaza las órdenes con **más de 500 ms de antigüedad** (`caducado`): compara el `ts` que pone el cliente con el reloj de quien la ejecuta. Y la placa del robot real rechaza **todo** con motivo `reloj` si su propio desfase supera **100 ms**.

**Qué pasa si los relojes no están en hora:**

- **Con el gemelo**, el programa del alumno y su gemelo suelen correr en el mismo PC, con el mismo reloj: el desfase no influye. Influye cuando el programa y el gemelo están en equipos distintos (por ejemplo, el profesor manda órdenes al gemelo de un alumno, o el alumno programa desde una Raspberry Pi).
- Si el equipo que **envía** va **atrasado** más de unos 500 ms respecto al que ejecuta, todas sus órdenes llegan «viejas» y se rechazan con `caducado`, aunque la red vaya bien.
- Si va **adelantado**, sus órdenes parecen venir del futuro y se aceptan, pero se pierde la protección: una orden retenida en la red o en una cola podría ejecutarse tarde sin que se detecte. (El contrato v0.2 no dice qué hacer con un `ts` futuro; está propuesto para la siguiente versión.)
- **Con el robot real**, la placa compara contra su propio reloj NTP. Si ella está desfasada más de 100 ms, rechaza todo con `reloj`; si lo están los PC de los alumnos, se aplica lo anterior.
- Las latencias entre equipos que se midan en los experimentos solo valen si los relojes están sincronizados; el registro debe anotar el método y el desfase medido.

**Comprobar el desfase** de cualquier equipo respecto al PC del profesor (no hace falta instalar nada):

```bash
python comprobar_reloj.py --http 192.168.1.10:8080   # usa /hora del servidor web
python comprobar_reloj.py --ntp 192.168.1.10         # si el PC del profesor es servidor NTP
```

En Windows también: `w32tm /stripchart /computer:192.168.1.10 /samples:5 /dataonly` (requiere servidor NTP). El navegador (el gemelo) puede estimar su desfase pidiendo `/hora`.

Si los PC del centro están en un dominio, probablemente ya se sincronizan con el controlador de dominio y basta con **comprobar** que el desfase es pequeño. Si no, usa el PC del profesor como servidor NTP del aula:

**Servidor NTP en el PC del profesor, Windows** (consola de administrador):

```bat
reg add HKLM\SYSTEM\CurrentControlSet\Services\W32Time\TimeProviders\NtpServer /v Enabled /t REG_DWORD /d 1 /f
reg add HKLM\SYSTEM\CurrentControlSet\Services\W32Time\Config /v AnnounceFlags /t REG_DWORD /d 5 /f
sc config w32time start= auto
net stop w32time & net start w32time
w32tm /config /update
netsh advfirewall firewall add rule name="NTP aula" dir=in action=allow protocol=UDP localport=123
```

Clientes Windows (administrador): `w32tm /config /manualpeerlist:"192.168.1.10,0x8" /syncfromflags:manual /update` y `w32tm /resync /force`.

**Servidor NTP en el PC del profesor, Linux (chrony):** en `/etc/chrony/chrony.conf` añade `allow 192.168.1.0/24` y `local stratum 10`; luego `sudo systemctl restart chrony` y `sudo ufw allow 123/udp`. Clientes Linux y Raspberry Pi (la futura placa): `server 192.168.1.10 iburst prefer` en su `chrony.conf`; comprobar con `chronyc tracking`.

Los contenedores Docker usan el reloj del equipo anfitrión: no hay que sincronizarlos aparte.

## Problemas típicos

| Síntoma | Causa probable y solución |
|---|---|
| Los alumnos no abren `http://IP:8080` o el gemelo no conecta | **Cortafuegos de Windows** del PC del profesor. En PowerShell de administrador: `New-NetFirewallRule -DisplayName "RV-M1 aula" -Direction Inbound -Protocol TCP -LocalPort 1883,9001,8080 -Action Allow -Profile Private,Domain`. Comprueba además que la red esté como **Privada** y no como Pública (Configuración → Red → Propiedades). En Linux: `sudo ufw allow 1883,9001,8080/tcp` |
| `Connection Refused: not authorised` | Usuario o contraseña mal copiados, o el broker no se reinició tras `crear_usuarios.py` |
| El programa conecta pero no recibe nada / no pasa nada | El `id` no coincide con el usuario (`alumno07` → `07`), o el gemelo no está abierto en el navegador |
| Todo se rechaza con `caducado` | Reloj del PC que envía atrasado (ver «Relojes»); compruébalo con `comprobar_reloj.py` |
| Rechazos con `reloj` | El receptor (placa real o gemelo) estima un desfase > 100 ms: sincroniza su reloj |
| `Address already in use` en 1883 (sin Docker, Windows) | Está corriendo el servicio de Mosquitto con la configuración por defecto: `net stop mosquitto` |
| El contenedor `rvm1-mosquitto` se para nada más arrancar | Falta `config/passwd` o `config/acl`: ejecuta `python crear_usuarios.py`. Mira `docker compose logs mosquitto` |
| Avisos «world readable permissions» o «owner is not mosquitto» (sin Docker, Linux) | Solo son avisos en Mosquitto 2.0. Para quitarlos: `sudo chown mosquitto: config/passwd config/acl && sudo chmod 600 config/passwd config/acl` (con Docker ya se hace solo dentro del contenedor) |
| El navegador no carga el gemelo con `python -m http.server` en Windows | Windows entrega `.js` como `text/plain`; usa `python servidor_web.py` |
| Rutas con espacios en `mosquitto_local.conf` | Evita espacios en la ruta del repositorio en Windows o edita la ruta a mano |

## Seguridad

- La red del aula debe estar **aislada** (contrato v0.2). El tráfico va sin cifrar: las contraseñas de MQTT viajan en claro. Si la red no está aislada hay que usar TLS (MQTT en 8883 y WSS); esta configuración **no** lo incluye todavía.
- `credenciales_*.csv` contienen las contraseñas en claro: no se suben al repositorio ni se comparten fuera del aula.
- El broker no sustituye a las seguridades del robot: la parada de emergencia real es la **seta física**.

## Despliegue en Minaya Research (plataforma pública)

El gemelo y este broker también se publican dentro de la plataforma Minaya Research (repo `minaya-plataforma`, rama `gemelo-rvm1`):

1. En el PC de la plataforma, clona o actualiza este repositorio y genera las credenciales: `cd broker && python crear_usuarios.py`.
2. En `minaya-plataforma/docker/.env` añade `RVM1_DIR=` con la ruta de este repositorio vista desde WSL (p. ej. `/mnt/c/Users/alegaz/Desktop/modernizacion-robot-rv-m1`).
3. Desde `minaya-plataforma/docker`: `docker compose up -d --build sim-rvm1 mqtt-rvm1 caddy minaya`.
4. En **Gestión** de la plataforma, da el permiso **Gemelo RV-M1** a los alumnos.
5. Los alumnos entran en `https://<dominio>/rvm1/`. El gemelo se conecta solo a `wss://<dominio>/rvm1/mqtt` con el usuario y contraseña MQTT del CSV.

Diferencias con el aula: no se publica ningún puerto (todo entra por Caddy en 443), el broker solo es accesible por WebSocket seguro y `/rvm1/hora` da la hora del servidor. Los programas en Python se conectan así:

```python
import ssl, paho.mqtt.client as mqtt
c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, transport="websockets")
c.ws_set_options(path="/rvm1/mqtt")
c.tls_set(cert_reqs=ssl.CERT_REQUIRED)
c.username_pw_set("alumno07", "CONTRASEÑA")
c.connect("minaya-research.duckdns.org", 443)
```
