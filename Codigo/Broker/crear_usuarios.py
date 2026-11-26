#!/usr/bin/env python3
"""Genera usuarios, contraseñas y ACL del broker MQTT del aula (contrato MQTT v0.2).

Crea en ``Codigo/Broker/config/``:

- ``passwd``: fichero de contraseñas con el formato de Mosquitto 2.
- ``acl``: lista de acceso por topic (explícita, un bloque por usuario).

y en ``Codigo/Broker/``:

- ``credenciales_alumnos.csv``: usuario, contraseña e id del gemelo de cada alumno
  (para repartir en clase).
- ``credenciales_internas.csv``: contraseñas de ``profesor`` y ``placa_real``.
- ``mosquitto_local.conf``: configuración para lanzar Mosquitto SIN Docker con las
  rutas absolutas de este equipo.

Ninguno de estos ficheros se sube al repositorio (ver ``.gitignore``).

Hash de contraseñas
-------------------
Si ``mosquitto_passwd`` está instalado se usa (``mosquitto_passwd -U``). Si no, se
calcula en Python el mismo formato que Mosquitto 2.x:

    usuario:$7$<iteraciones>$<sal en base64>$<hash en base64>

con PBKDF2-HMAC-SHA512, 101 iteraciones (valor por defecto de mosquitto_passwd 2.0),
sal aleatoria de 12 bytes y derivación de 64 bytes. La sal se codifica en base64
estándar y el PBKDF2 se aplica sobre los bytes de la sal (no sobre su texto base64).

Uso:
    python crear_usuarios.py                  # 30 alumnos (alumno01..alumno30)
    python crear_usuarios.py -n 2             # 2 alumnos
    python crear_usuarios.py -n 35 --conservar  # amplía a 35 sin cambiar las ya repartidas
"""

from __future__ import annotations

import argparse
import base64
import csv
import hashlib
import os
import secrets
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

DIR_BROKER = Path(__file__).resolve().parent

# Sílabas sin letras ambiguas (sin l/1, o/0 se evita porque los dígitos van aparte).
CONSONANTES = "bcdfgjkmnprstvz"
VOCALES = "aeiou"

ITERACIONES_PBKDF2 = 101  # las mismas que mosquitto_passwd 2.0
LONGITUD_SAL = 12

USUARIO_PROFESOR = "profesor"
USUARIO_PLACA = "placa_real"


# ---------------------------------------------------------------- contraseñas
def contrasena_legible(bloques: int = 2) -> str:
    """Contraseña tipo ``tasu-mepo-73``.

    Cada bloque son dos sílabas consonante+vocal (75^2 combinaciones). Con 2
    bloques + 2 dígitos salen unos 31,6 bits de entropía: suficiente para una red
    de aula aislada con usuarios que hay que teclear a mano. Para ``profesor`` y
    ``placa_real`` se usan más bloques.
    """
    def silaba() -> str:
        return secrets.choice(CONSONANTES) + secrets.choice(VOCALES)

    partes = [silaba() + silaba() for _ in range(bloques)]
    partes.append(f"{secrets.randbelow(100):02d}")
    return "-".join(partes)


def hash_mosquitto(contrasena: str, sal: bytes | None = None,
                   iteraciones: int = ITERACIONES_PBKDF2) -> str:
    """Hash compatible con Mosquitto 2 (``$7$``, PBKDF2-SHA512)."""
    if sal is None:
        sal = secrets.token_bytes(LONGITUD_SAL)
    derivada = hashlib.pbkdf2_hmac("sha512", contrasena.encode("utf-8"), sal,
                                   iteraciones)
    return "$7${}${}${}".format(iteraciones,
                                base64.b64encode(sal).decode("ascii"),
                                base64.b64encode(derivada).decode("ascii"))


def buscar_mosquitto_passwd() -> str | None:
    ruta = shutil.which("mosquitto_passwd")
    if ruta:
        return ruta
    if os.name == "nt":
        for base in (os.environ.get("ProgramFiles", r"C:\Program Files"),
                     os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)")):
            candidato = Path(base) / "mosquitto" / "mosquitto_passwd.exe"
            if candidato.exists():
                return str(candidato)
    return None


def escribir_passwd(ruta: Path, usuarios: dict[str, str], modo_hash: str) -> str:
    """Escribe el fichero de contraseñas. Devuelve el método usado."""
    herramienta = buscar_mosquitto_passwd() if modo_hash in ("auto", "mosquitto") else None
    if modo_hash == "mosquitto" and herramienta is None:
        sys.exit("ERROR: se pidió --hash mosquitto pero no se encuentra mosquitto_passwd")

    ruta.parent.mkdir(parents=True, exist_ok=True)
    if herramienta:
        # mosquitto_passwd -U convierte en el sitio un fichero usuario:contraseña en claro.
        fd, tmp = tempfile.mkstemp(prefix=".passwd_", dir=ruta.parent)
        try:
            with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as f:
                for u, p in usuarios.items():
                    f.write(f"{u}:{p}\n")
            subprocess.run([herramienta, "-U", tmp], check=True,
                           stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
            os.replace(tmp, ruta)
        finally:
            if os.path.exists(tmp):
                os.remove(tmp)
        metodo = f"mosquitto_passwd ({herramienta})"
    else:
        with open(ruta, "w", encoding="utf-8", newline="\n") as f:
            for u, p in usuarios.items():
                f.write(f"{u}:{hash_mosquitto(p)}\n")
        metodo = "Python (PBKDF2-SHA512, formato $7$ de Mosquitto 2)"
    # Legible por el usuario 'mosquitto' del contenedor (montaje de solo lectura).
    # Solo contiene hashes; las contraseñas en claro están en los CSV (0600).
    os.chmod(ruta, 0o644)
    return metodo


# ----------------------------------------------------------------------- ACL
def generar_acl(ids: list[str], observar_real: bool) -> str:
    """ACL explícita según el apartado "Red y seguridad" del contrato v0.2."""
    l = []
    l.append("# ACL del broker RV-M1 (contrato MQTT v0.2). GENERADO por crear_usuarios.py.")
    l.append("# No editar a mano: se sobrescribe al volver a ejecutar el script.")
    l.append("# Un usuario que no aparece aquí no tiene acceso a ningún topic.")
    l.append("")
    l.append(f"user {USUARIO_PROFESOR}")
    l.append("topic readwrite rvm1/#")
    l.append("topic read $SYS/#")
    l.append("")
    l.append("# Placa de interfaz del robot real: publica estado, lee comandos.")
    l.append(f"user {USUARIO_PLACA}")
    l.append("topic read rvm1/real/+/comandos")
    for t in ("comandos/ack", "actuadores", "posicion/mundo", "online"):
        l.append(f"topic write rvm1/real/+/{t}")
    l.append("")
    l.append("# Alumnos: su programa publica en comandos; su navegador ejecuta su propio")
    l.append("# gemelo y publica ack, actuadores, posicion/mundo y online.")
    if observar_real:
        l.append("# Además pueden OBSERVAR (solo lectura) el robot real: posición y estado.")
    for i in ids:
        l.append("")
        l.append(f"user alumno{i}")
        l.append(f"topic read rvm1/gemelo/{i}/#")
        for t in ("comandos", "comandos/ack", "actuadores", "posicion/mundo", "online"):
            l.append(f"topic write rvm1/gemelo/{i}/{t}")
        if observar_real:
            l.append("topic read rvm1/real/+/posicion/mundo")
            l.append("topic read rvm1/real/+/actuadores")
    l.append("")
    return "\n".join(l)


# ------------------------------------------------------- configuración local
def generar_conf_local(dir_config: Path, dir_datos: Path,
                       puerto_mqtt: int, puerto_ws: int) -> str:
    return f"""# Mosquitto SIN Docker (rutas absolutas de este equipo). GENERADO por crear_usuarios.py.
# Lanzar con:  mosquitto -c "{DIR_BROKER / 'mosquitto_local.conf'}" -v
per_listener_settings false
allow_anonymous false
password_file {dir_config / 'passwd'}
acl_file {dir_config / 'acl'}

# MQTT sobre TCP (programas Python de los alumnos, placa del robot)
listener {puerto_mqtt}
protocol mqtt

# MQTT sobre WebSocket (gemelo y pendant en el navegador)
listener {puerto_ws}
protocol websockets

set_tcp_nodelay true
max_packet_size 65536
persistence true
persistence_location {str(dir_datos) + os.sep}
log_dest stdout
log_type error
log_type warning
log_type notice
log_type information
connection_messages true
log_timestamp_format %Y-%m-%dT%H:%M:%S
"""


# --------------------------------------------------------------------- CSV
def leer_csv(ruta: Path) -> dict[str, str]:
    if not ruta.exists():
        return {}
    with open(ruta, newline="", encoding="utf-8") as f:
        return {fila["usuario"]: fila["contrasena"] for fila in csv.DictReader(f)}


def escribir_csv(ruta: Path, cabecera: list[str], filas: list[list[str]]) -> None:
    with open(ruta, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(cabecera)
        w.writerows(filas)
    try:
        os.chmod(ruta, 0o600)
    except OSError:
        pass


# -------------------------------------------------------------------- main
def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("-n", "--alumnos", type=int, default=30,
                    help="número de alumnos (por defecto 30)")
    ap.add_argument("--conservar", action="store_true",
                    help="reutiliza las contraseñas de los CSV existentes y solo crea las que falten")
    ap.add_argument("--forzar", action="store_true",
                    help="sobrescribe credenciales existentes con contraseñas nuevas")
    ap.add_argument("--sin-observar-real", action="store_true",
                    help="los alumnos NO pueden leer rvm1/real/+/posicion/mundo ni actuadores")
    ap.add_argument("--hash", choices=("auto", "mosquitto", "python"), default="auto",
                    help="cómo calcular los hashes (auto: mosquitto_passwd si existe)")
    ap.add_argument("--dir", type=Path, default=DIR_BROKER,
                    help="carpeta de salida (por defecto, la del script)")
    ap.add_argument("--puerto-mqtt", type=int, default=1883,
                    help="puerto MQTT/TCP en mosquitto_local.conf")
    ap.add_argument("--puerto-ws", type=int, default=9001,
                    help="puerto MQTT/WebSocket en mosquitto_local.conf")
    a = ap.parse_args(argv)

    if a.alumnos < 1:
        ap.error("--alumnos debe ser >= 1")
    if a.conservar and a.forzar:
        ap.error("--conservar y --forzar son incompatibles")

    base = a.dir.resolve()
    dir_config = base / "config"
    dir_datos = base / "data"
    csv_alumnos = base / "credenciales_alumnos.csv"
    csv_internas = base / "credenciales_internas.csv"

    previas = {**leer_csv(csv_alumnos), **leer_csv(csv_internas)}
    if previas and not (a.conservar or a.forzar):
        print("Ya existen credenciales repartidas en:\n  " + str(csv_alumnos) +
              "\nUsa --conservar (mantener y añadir) o --forzar (todas nuevas).",
              file=sys.stderr)
        return 2
    if a.forzar:
        previas = {}

    ancho = max(2, len(str(a.alumnos)))
    ids = [str(i).zfill(ancho) for i in range(1, a.alumnos + 1)]

    usuarios: dict[str, str] = {}
    for u, bloques in ((USUARIO_PROFESOR, 3), (USUARIO_PLACA, 4)):
        usuarios[u] = previas.get(u) or contrasena_legible(bloques)
    for i in ids:
        u = f"alumno{i}"
        usuarios[u] = previas.get(u) or contrasena_legible(2)

    dir_config.mkdir(parents=True, exist_ok=True)
    dir_datos.mkdir(parents=True, exist_ok=True)

    metodo = escribir_passwd(dir_config / "passwd", usuarios, a.hash)
    (dir_config / "acl").write_text(generar_acl(ids, not a.sin_observar_real),
                                    encoding="utf-8", newline="\n")
    os.chmod(dir_config / "acl", 0o644)
    (base / "mosquitto_local.conf").write_text(
        generar_conf_local(dir_config, dir_datos, a.puerto_mqtt, a.puerto_ws),
        encoding="utf-8")

    escribir_csv(csv_alumnos, ["usuario", "contrasena", "id_gemelo"],
                 [[f"alumno{i}", usuarios[f"alumno{i}"], i] for i in ids])
    escribir_csv(csv_internas, ["usuario", "contrasena"],
                 [[u, usuarios[u]] for u in (USUARIO_PROFESOR, USUARIO_PLACA)])

    nuevos = sum(1 for u in usuarios if u not in previas)
    print(f"Usuarios: {len(usuarios)} ({a.alumnos} alumnos, {nuevos} contraseñas nuevas)")
    print(f"Hash:     {metodo}")
    print(f"Escrito:  {dir_config / 'passwd'}")
    print(f"          {dir_config / 'acl'}")
    print(f"          {base / 'mosquitto_local.conf'}")
    print(f"          {csv_alumnos}  <- repartir a los alumnos")
    print(f"          {csv_internas}  <- profesor y placa_real (no repartir)")
    print("Si el broker ya estaba en marcha, reinícialo para que lea los cambios.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
