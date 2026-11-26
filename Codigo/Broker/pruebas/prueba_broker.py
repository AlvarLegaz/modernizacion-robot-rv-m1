#!/usr/bin/env python3
"""Pruebas automáticas del broker del aula: autenticación, ACL y WebSocket.

Arranca un Mosquitto LOCAL y temporal (puertos libres de 127.0.0.1, carpeta
temporal) con la configuración que genera crear_usuarios.py y 2 alumnos. No se
conecta a ningún broker externo ni al robot.

Requisitos: mosquitto 2.x en el PATH (apt install mosquitto mosquitto-clients) y
paho-mqtt 2.x.

    python -m unittest Codigo/Broker/pruebas/prueba_broker.py -v
    python Codigo/Broker/pruebas/prueba_broker.py -v
"""

from __future__ import annotations

import csv
import json
import os
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import threading
import time
import unittest
import uuid
from pathlib import Path

import paho.mqtt.client as mqtt
from paho.mqtt.enums import CallbackAPIVersion

DIR_BROKER = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(DIR_BROKER))
import crear_usuarios  # noqa: E402

MOSQUITTO = shutil.which("mosquitto") or (
    "/usr/sbin/mosquitto" if os.path.exists("/usr/sbin/mosquitto") else None)
ESPERA = 0.8  # s para dar por no entregado un mensaje


def puerto_libre() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def esperar_puerto(puerto: int, timeout: float = 5.0) -> None:
    limite = time.monotonic() + timeout
    while time.monotonic() < limite:
        try:
            with socket.create_connection(("127.0.0.1", puerto), 0.2):
                return
        except OSError:
            time.sleep(0.05)
    raise RuntimeError(f"mosquitto no escucha en {puerto}")


class Cliente:
    """Cliente paho síncrono mínimo para las pruebas (MQTT v5 para ver códigos)."""

    def __init__(self, puerto: int, usuario: str | None, contrasena: str | None,
                 transporte: str = "tcp", ruta_ws: str = "/mqtt"):
        self.mensajes: list[tuple[str, bytes, bool]] = []
        self.rc_conexion = None
        self.rc_sub: list = []
        self.rc_pub: dict[int, object] = {}
        self._ev_con = threading.Event()
        self._ev_sub = threading.Event()
        self._ev_pub = threading.Event()
        self.c = mqtt.Client(CallbackAPIVersion.VERSION2,
                             client_id=f"prueba-{uuid.uuid4().hex[:8]}",
                             protocol=mqtt.MQTTv5, transport=transporte)
        if transporte == "websockets":
            self.c.ws_set_options(path=ruta_ws)
        if usuario is not None:
            self.c.username_pw_set(usuario, contrasena)
        self.c.on_connect = self._on_connect
        self.c.on_subscribe = self._on_subscribe
        self.c.on_publish = self._on_publish
        self.c.on_message = lambda c, u, m: self.mensajes.append(
            (m.topic, m.payload, m.retain))
        self.c.connect("127.0.0.1", puerto, keepalive=10)
        self.c.loop_start()
        self._ev_con.wait(5)

    def _on_connect(self, c, u, flags, rc, props):
        self.rc_conexion = rc
        self._ev_con.set()

    def _on_subscribe(self, c, u, mid, rcs, props):
        self.rc_sub = rcs
        self._ev_sub.set()

    def _on_publish(self, c, u, mid, rc, props):
        self.rc_pub[mid] = rc
        self._ev_pub.set()

    @property
    def conectado(self) -> bool:
        return self.rc_conexion is not None and not self.rc_conexion.is_failure

    def suscribir(self, topic: str, qos: int = 1) -> bool:
        """True si el broker concede la suscripción."""
        self._ev_sub.clear()
        self.c.subscribe(topic, qos)
        self._ev_sub.wait(3)
        return bool(self.rc_sub) and not self.rc_sub[0].is_failure

    def publicar(self, topic: str, carga: str, qos: int = 1, retain: bool = False):
        info = self.c.publish(topic, carga, qos=qos, retain=retain)
        info.wait_for_publish(3)
        time.sleep(0.05)
        return self.rc_pub.get(info.mid)

    def cerrar(self):
        self.c.loop_stop()
        self.c.disconnect()


@unittest.skipIf(MOSQUITTO is None, "mosquitto no está instalado")
class PruebaBroker(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.tmp = Path(tempfile.mkdtemp(prefix="rvm1_broker_"))
        cls.p_mqtt, cls.p_ws = puerto_libre(), puerto_libre()
        # Hash en Python (así se prueba que es compatible con Mosquitto 2).
        rc = crear_usuarios.main(["-n", "2", "--dir", str(cls.tmp), "--hash", "python",
                                  "--puerto-mqtt", str(cls.p_mqtt),
                                  "--puerto-ws", str(cls.p_ws)])
        assert rc == 0
        conf = cls.tmp / "mosquitto_local.conf"
        # Solo para la prueba: escuchar únicamente en 127.0.0.1.
        texto = conf.read_text().replace(f"listener {cls.p_mqtt}\n",
                                         f"listener {cls.p_mqtt} 127.0.0.1\n")
        texto = texto.replace(f"listener {cls.p_ws}\n", f"listener {cls.p_ws} 127.0.0.1\n")
        conf.write_text(texto)
        if hasattr(os, "geteuid") and os.geteuid() == 0:
            # Mosquitto lanzado como root baja a usuario 'mosquitto': que pueda leer/escribir.
            os.chmod(cls.tmp, 0o755)
            os.chmod(cls.tmp / "data", 0o777)
        cls.log = open(cls.tmp / "mosquitto.log", "w")
        cls.proc = subprocess.Popen([MOSQUITTO, "-c", str(conf)],
                                    stdout=cls.log, stderr=subprocess.STDOUT)
        esperar_puerto(cls.p_mqtt)
        esperar_puerto(cls.p_ws)
        cred = {}
        for nombre in ("credenciales_alumnos.csv", "credenciales_internas.csv"):
            with open(cls.tmp / nombre, newline="") as f:
                cred.update({r["usuario"]: r["contrasena"] for r in csv.DictReader(f)})
        cls.cred = cred
        cls.observador = Cliente(cls.p_mqtt, "profesor", cred["profesor"])
        assert cls.observador.conectado
        assert cls.observador.suscribir("rvm1/#")

    @classmethod
    def tearDownClass(cls):
        cls.observador.cerrar()
        cls.proc.send_signal(signal.SIGTERM)
        cls.proc.wait(5)
        cls.log.close()
        if os.environ.get("CONSERVAR_TMP"):
            print(f"\nCarpeta de prueba conservada: {cls.tmp}")
        else:
            shutil.rmtree(cls.tmp, ignore_errors=True)

    # ------------------------------------------------------------ utilidades
    def cliente(self, usuario, transporte="tcp", ruta_ws="/mqtt", contrasena=None):
        puerto = self.p_ws if transporte == "websockets" else self.p_mqtt
        c = Cliente(puerto, usuario,
                    contrasena if contrasena is not None else self.cred.get(usuario),
                    transporte, ruta_ws)
        self.addCleanup(c.cerrar)
        return c

    def llega_al_observador(self, cliente: Cliente, topic: str, retain=False) -> bool:
        marca = uuid.uuid4().hex
        cliente.publicar(topic, json.dumps({"marca": marca}), retain=retain)
        limite = time.monotonic() + ESPERA
        while time.monotonic() < limite:
            if any(t == topic and marca.encode() in p for t, p, _ in self.observador.mensajes):
                return True
            time.sleep(0.02)
        return False

    # ---------------------------------------------------------- autenticación
    def test_anonimo_rechazado(self):
        c = self.cliente(None)
        self.assertFalse(c.conectado)

    def test_contrasena_incorrecta_rechazada(self):
        c = self.cliente("alumno01", contrasena="no-es-esta-00")
        self.assertFalse(c.conectado)

    def test_usuario_inexistente_rechazado(self):
        c = self.cliente("alumno03", contrasena="lo-que-sea-11")
        self.assertFalse(c.conectado)

    # ------------------------------------------------------------------ ACL
    def test_alumno_publica_en_su_gemelo(self):
        c = self.cliente("alumno01")
        self.assertTrue(c.conectado)
        for sufijo in ("comandos", "comandos/ack", "actuadores", "posicion/mundo", "online"):
            with self.subTest(sufijo=sufijo):
                self.assertTrue(self.llega_al_observador(c, f"rvm1/gemelo/01/{sufijo}"))

    def test_alumno_no_publica_fuera_de_lo_permitido(self):
        c = self.cliente("alumno01")
        prohibidos = ["rvm1/gemelo/02/comandos", "rvm1/gemelo/02/posicion/mundo",
                      "rvm1/real/01/comandos", "rvm1/real/01/posicion/mundo",
                      "rvm1/real/01/actuadores", "rvm1/gemelo/01/otro",
                      "rvm1/gemelo/01", "rvm1/gemelo/01/comandos/ack/x"]
        for topic in prohibidos:
            with self.subTest(topic=topic):
                self.assertFalse(self.llega_al_observador(c, topic))

    def test_codigo_mqtt5_no_autorizado(self):
        c = self.cliente("alumno01")
        rc = c.publicar("rvm1/real/01/comandos", "{}", qos=1)
        self.assertIsNotNone(rc)
        self.assertTrue(rc.is_failure, f"PUBACK esperado de fallo, llegó {rc}")

    def test_alumno_suscrito_a_todo_solo_recibe_lo_suyo(self):
        """Mosquitto 2.0 con acl_file CONCEDE cualquier SUBSCRIBE (no comprueba la
        suscripción) y filtra cada mensaje al entregarlo con la regla 'read'.
        Lo que importa es que no llegue nada ajeno, tampoco los retenidos."""
        prof = self.cliente("profesor")
        prof.publicar("rvm1/gemelo/02/actuadores", '{"retenido_ajeno": 1}', retain=True)
        prof.publicar("rvm1/real/07/comandos/ack", '{"retenido_real": 1}', retain=True)
        espia = self.cliente("alumno01")
        espia.suscribir("#")
        espia.suscribir("rvm1/#")
        time.sleep(0.3)
        prof.publicar("rvm1/gemelo/02/comandos", '{"ajeno": 1}')
        prof.publicar("rvm1/real/01/comandos", '{"real": 1}')
        prof.publicar("rvm1/real/01/comandos/ack", '{"real": 1}')
        prof.publicar("rvm1/real/01/online", "online")
        prof.publicar("rvm1/real/01/posicion/mundo", '{"x": 1}')   # permitido (observar)
        prof.publicar("rvm1/gemelo/01/comandos", '{"propio": 1}')  # permitido
        time.sleep(ESPERA)
        recibidos = {t for t, _, _ in espia.mensajes}
        self.assertEqual(recibidos, {"rvm1/real/01/posicion/mundo",
                                     "rvm1/gemelo/01/comandos"})
        # limpiar retenidos
        prof.publicar("rvm1/gemelo/02/actuadores", "", retain=True)
        prof.publicar("rvm1/real/07/comandos/ack", "", retain=True)

    def test_alumno_recibe_su_gemelo_y_no_el_ajeno(self):
        a1 = self.cliente("alumno01")
        a1.suscribir("rvm1/gemelo/01/#")
        prof = self.cliente("profesor")
        prof.publicar("rvm1/gemelo/01/comandos/ack", '{"propio": 1}')
        prof.publicar("rvm1/gemelo/02/comandos/ack", '{"ajeno": 1}')
        time.sleep(ESPERA)
        topics = [t for t, _, _ in a1.mensajes]
        self.assertIn("rvm1/gemelo/01/comandos/ack", topics)
        self.assertNotIn("rvm1/gemelo/02/comandos/ack", topics)

    def test_alumno_observa_robot_real(self):
        a1 = self.cliente("alumno01")
        a1.suscribir("rvm1/real/+/posicion/mundo")
        placa = self.cliente("placa_real")
        placa.publicar("rvm1/real/01/posicion/mundo", '{"x": 1}', qos=0)
        time.sleep(ESPERA)
        self.assertIn("rvm1/real/01/posicion/mundo", [t for t, _, _ in a1.mensajes])

    def test_retenidos_del_gemelo(self):
        a2 = self.cliente("alumno02")
        a2.publicar("rvm1/gemelo/02/actuadores", '{"retenido": 1}', retain=True)
        otro = self.cliente("alumno02")
        otro.suscribir("rvm1/gemelo/02/actuadores")
        time.sleep(0.4)
        self.assertTrue(any(r for t, _, r in otro.mensajes
                            if t == "rvm1/gemelo/02/actuadores"))

    def test_lwt_online_del_gemelo(self):
        """El navegador del alumno usa 'online' como última voluntad: debe poder."""
        exe = shutil.which("mosquitto_sub")
        if not exe:
            self.skipTest("mosquitto_sub no disponible")
        p = subprocess.Popen([exe, "-h", "127.0.0.1", "-p", str(self.p_mqtt),
                              "-u", "alumno02", "-P", self.cred["alumno02"],
                              "-t", "rvm1/gemelo/02/comandos", "-k", "5",
                              "--will-topic", "rvm1/gemelo/02/online",
                              "--will-payload", "offline-lwt", "--will-retain",
                              "--will-qos", "1"],
                             stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(0.5)
        p.kill()  # corte brusco: el broker publica la última voluntad
        p.wait()
        limite = time.monotonic() + 3
        while time.monotonic() < limite:
            if any(t == "rvm1/gemelo/02/online" and p_ == b"offline-lwt"
                   for t, p_, _ in self.observador.mensajes):
                break
            time.sleep(0.05)
        else:
            self.fail("no llegó la última voluntad del gemelo")

    def test_placa_real(self):
        placa = self.cliente("placa_real")
        for sufijo in ("comandos/ack", "actuadores", "posicion/mundo", "online"):
            with self.subTest(publica=sufijo):
                self.assertTrue(self.llega_al_observador(placa, f"rvm1/real/01/{sufijo}"))
        for topic in ("rvm1/real/01/comandos", "rvm1/gemelo/01/comandos",
                      "rvm1/gemelo/01/posicion/mundo"):
            with self.subTest(prohibido=topic):
                self.assertFalse(self.llega_al_observador(placa, topic))
        self.assertTrue(placa.suscribir("rvm1/real/+/comandos"))
        placa.suscribir("rvm1/gemelo/#")  # concedida, pero no debe recibir nada
        prof = self.cliente("profesor")
        prof.publicar("rvm1/real/01/comandos", '{"del": "profesor"}')
        prof.publicar("rvm1/gemelo/01/comandos", '{"del": "profesor"}')
        time.sleep(ESPERA)
        topics = [t for t, _, _ in placa.mensajes]
        self.assertIn("rvm1/real/01/comandos", topics)
        self.assertNotIn("rvm1/gemelo/01/comandos", topics)

    def test_profesor_publica_en_todo_rvm1(self):
        prof = self.cliente("profesor")
        for topic in ("rvm1/real/01/comandos", "rvm1/gemelo/02/comandos",
                      "rvm1/gemelo/01/posicion/mundo"):
            with self.subTest(topic=topic):
                self.assertTrue(self.llega_al_observador(prof, topic))

    # ------------------------------------------------------------- WebSocket
    def test_websocket(self):
        for ruta in ("/mqtt", "/"):
            with self.subTest(ruta=ruta):
                c = self.cliente("alumno01", transporte="websockets", ruta_ws=ruta)
                self.assertTrue(c.conectado)
                self.assertTrue(c.suscribir("rvm1/gemelo/01/#"))
                c.suscribir("rvm1/gemelo/02/#")
                self.assertTrue(self.llega_al_observador(c, "rvm1/gemelo/01/comandos"))
                self.assertFalse(self.llega_al_observador(c, "rvm1/real/01/comandos"))
                self.assertFalse(self.llega_al_observador(c, "rvm1/gemelo/02/comandos"))
                prof = self.cliente("profesor")
                prof.publicar("rvm1/gemelo/02/comandos/ack", '{"ajeno": 1}')
                prof.publicar("rvm1/gemelo/01/comandos/ack", '{"propio": 1}')
                time.sleep(ESPERA)
                topics = {t for t, _, _ in c.mensajes}
                self.assertIn("rvm1/gemelo/01/comandos/ack", topics)
                self.assertNotIn("rvm1/gemelo/02/comandos/ack", topics)

    def test_websocket_sin_credenciales(self):
        c = self.cliente(None, transporte="websockets")
        self.assertFalse(c.conectado)


class PruebaHash(unittest.TestCase):
    def test_formato(self):
        h = crear_usuarios.hash_mosquitto("secreto", sal=b"\x00" * 12)
        partes = h.split("$")
        self.assertEqual(partes[1:3], ["7", "101"])
        self.assertEqual(partes[3], "AAAAAAAAAAAAAAAA")

    @unittest.skipIf(shutil.which("mosquitto_passwd") is None, "sin mosquitto_passwd")
    def test_igual_que_mosquitto_passwd(self):
        import base64
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "pw"
            subprocess.run(["mosquitto_passwd", "-c", "-b", str(f), "u", "clave-de-prueba"],
                           check=True)
            _, h = f.read_text().strip().split(":", 1)
        sal = base64.b64decode(h.split("$")[3])
        self.assertEqual(crear_usuarios.hash_mosquitto("clave-de-prueba", sal=sal), h)

    def test_contrasena_legible(self):
        p = crear_usuarios.contrasena_legible(2)
        self.assertRegex(p, r"^[a-z]{4}-[a-z]{4}-\d\d$")


if __name__ == "__main__":
    unittest.main()
