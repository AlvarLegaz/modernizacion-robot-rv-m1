#!/usr/bin/env python3
"""Ejemplo para alumnos: mover SU gemelo digital del RV-M1 por MQTT (contrato v0.2).

Requisitos:  pip install paho-mqtt     (versión 2.x)
Antes:       abre tu gemelo en el navegador (http://<IP del profesor>:8080) con tu id.

Uso:
    python cliente_gemelo.py --host 192.168.1.10 --usuario alumno07
    python cliente_gemelo.py --host 192.168.1.10 --usuario alumno07 --ws   # por WebSocket
La contraseña se pide por teclado (o variable de entorno RVM1_PASSWORD).

Qué hace:
  1. Se conecta con tu usuario y se suscribe a ack, posicion/mundo, actuadores y online.
  2. Prueba un jog cartesiano antes de 'home' (si el gemelo no está referenciado,
     debe rechazarse con motivo 'no_referenciado').
  3. 'home' y espera el ACK 'hecho'.
  4. Mueve en articular (jog_articular) y en cartesiano (jog_mundo y mover_pose).
  5. Muestra la posición leída en posicion/mundo.
  6. Provoca rechazos a propósito: caducado, destino, formato y un id duplicado.

Este programa SOLO habla con el gemelo (destino "gemelo"). No tiene opción para
el robot real, y el broker tampoco te dejaría publicar en rvm1/real/.
"""

from __future__ import annotations

import argparse
import getpass
import json
import os
import re
import sys
import threading
import time
import uuid

try:
    import paho.mqtt.client as mqtt
    from paho.mqtt.enums import CallbackAPIVersion
except ImportError:  # pragma: no cover
    sys.exit("Falta paho-mqtt 2.x:  pip install paho-mqtt")

DESTINO = "gemelo"            # fijo a propósito
ESTADOS_FINALES = {"hecho", "error", "rechazado"}


def ahora_ms() -> int:
    return int(time.time() * 1000)


class ClienteGemelo:
    def __init__(self, host: str, puerto: int, usuario: str, contrasena: str,
                 id_robot: str, websocket: bool = False, ruta_registro: str | None = None):
        self.base = f"rvm1/{DESTINO}/{id_robot}"
        self.id_robot = id_robot
        self._cond = threading.Condition()
        self._acks: dict[str, list[dict]] = {}
        self.posicion: dict | None = None
        self.actuadores: dict | None = None
        self.online: str | None = None
        self._conectado = threading.Event()
        self._rc_conexion = None
        self._registro = open(ruta_registro, "a", encoding="utf-8") if ruta_registro else None

        self.c = mqtt.Client(
            callback_api_version=CallbackAPIVersion.VERSION2,
            client_id=f"{usuario}-py-{uuid.uuid4().hex[:6]}",
            transport="websockets" if websocket else "tcp",
            protocol=mqtt.MQTTv311,
        )
        self.c.username_pw_set(usuario, contrasena)
        self.c.on_connect = self._on_connect
        self.c.on_message = self._on_message
        self.c.on_subscribe = self._on_subscribe
        self._log("nota", texto="inicio cliente_gemelo", contrato="0.2",
                  broker=f"{host}:{puerto}", transporte="ws" if websocket else "tcp",
                  usuario=usuario)
        self.c.connect(host, puerto, keepalive=30)
        self.c.loop_start()

    # ------------------------------------------------------------ registro
    def _log(self, evento: str, **campos) -> None:
        """Registro opcional en JSONL con el formato de registro-experimentos."""
        if not self._registro:
            return
        linea = {"t_ms": ahora_ms(), "t_mono_ns": time.monotonic_ns(),
                 "nodo": "cliente_alumno", "destino": DESTINO, "evento": evento, **campos}
        self._registro.write(json.dumps(linea, ensure_ascii=False) + "\n")
        self._registro.flush()

    # ----------------------------------------------------------- callbacks
    def _on_connect(self, client, userdata, flags, reason_code, properties):
        self._rc_conexion = reason_code
        if reason_code.is_failure:
            print(f"[!] Conexión rechazada por el broker: {reason_code} "
                  "(¿usuario o contraseña incorrectos?)")
        else:
            client.subscribe([(f"{self.base}/comandos/ack", 1),
                              (f"{self.base}/posicion/mundo", 0),
                              (f"{self.base}/actuadores", 1),
                              (f"{self.base}/online", 1)])
        self._conectado.set()

    def _on_subscribe(self, client, userdata, mid, reason_codes, properties):
        if any(rc.is_failure for rc in reason_codes):
            print("[!] El broker ha denegado alguna suscripción: revisa que tu --id "
                  "coincida con tu usuario (alumno07 -> id 07).")

    def _on_message(self, client, userdata, msg):
        try:
            datos = json.loads(msg.payload.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            datos = msg.payload.decode("utf-8", "replace")
        sufijo = msg.topic[len(self.base) + 1:]
        if sufijo == "comandos/ack" and isinstance(datos, dict):
            self._log("ack_rx", **datos)
            with self._cond:
                self._acks.setdefault(datos.get("id"), []).append(datos)
                self._cond.notify_all()
        elif sufijo == "posicion/mundo" and isinstance(datos, dict):
            self.posicion = datos
            self._log("pos", **datos)
        elif sufijo == "actuadores" and isinstance(datos, dict):
            self.actuadores = datos
            self._log("estado", **datos)
        elif sufijo == "online":
            self.online = datos if isinstance(datos, str) else str(datos)

    # -------------------------------------------------------------- envío
    def enviar(self, cmd: str, args: dict | None = None, *, id_cmd: str | None = None,
               ts: int | None = None, destino: str = DESTINO) -> str:
        """Publica un comando con el JSON exacto del contrato. Devuelve su id."""
        id_cmd = id_cmd or uuid.uuid4().hex[:12]
        orden = {"id": id_cmd, "ts": ahora_ms() if ts is None else ts,
                 "destino": destino, "cmd": cmd, "args": args or {}}
        # QoS 1 y NUNCA retain (contrato, apartado Topics).
        self.c.publish(f"{self.base}/comandos", json.dumps(orden), qos=1, retain=False)
        self._log("cmd_tx", id=id_cmd, cmd=cmd, args=orden["args"], ts=orden["ts"],
                  destino_json=destino)
        print(f"  -> {cmd} {orden['args']}  (id {id_cmd})")
        return id_cmd

    def esperar(self, id_cmd: str, timeout: float = 30.0, n_minimo: int = 1,
                desde: int = 0) -> dict | None:
        """Espera a un ACK final (hecho/error/rechazado). Imprime cada ACK nuevo.

        ``n_minimo``: cuántos ACK finales hacen falta (2 para ver un duplicado).
        ``desde``: cuántos ACK de este id ya se mostraron antes.
        """
        vistos = desde
        limite = time.monotonic() + timeout
        with self._cond:
            while True:
                lista = self._acks.get(id_cmd, [])
                for ack in lista[vistos:]:
                    print(f"  <- {formatear_ack(ack)}")
                vistos = len(lista)
                finales = [a for a in lista if a.get("estado") in ESTADOS_FINALES]
                if len(finales) >= n_minimo:
                    return finales[-1]
                resto = limite - time.monotonic()
                if resto <= 0:
                    print(f"  [!] Sin ACK final para {id_cmd} en {timeout:.0f} s")
                    return None
                self._cond.wait(resto)

    def orden(self, cmd: str, args: dict | None = None, timeout: float = 30.0, **kw):
        return self.esperar(self.enviar(cmd, args, **kw), timeout)

    def cerrar(self) -> None:
        self.c.loop_stop()
        self.c.disconnect()
        if self._registro:
            self._registro.close()


def formatear_ack(ack: dict) -> str:
    texto = f"ACK {ack.get('estado')}"
    if "motivo" in ack:
        texto += f" (motivo: {ack['motivo']})"
    if "er" in ack:
        texto += f" er={ack['er']}"
    return texto


def mostrar_posicion(p: dict | None) -> None:
    if not p:
        print("  posicion/mundo: (sin datos todavía)")
        return
    print("  posicion/mundo: x={x:.1f} y={y:.1f} z={z:.1f} mm  pitch={pitch:.1f} "
          "roll={roll:.1f} grados  valida={valida}".format(**{
              k: p.get(k, float("nan")) for k in ("x", "y", "z", "pitch", "roll", "valida")}))


def demo(cli: ClienteGemelo) -> None:
    print("\n1) Jog cartesiano ANTES de home (si el gemelo no está referenciado, "
          "se rechaza con 'no_referenciado'):")
    cli.orden("jog_mundo", {"dx": 0.0, "dy": 0.0, "dz": -5.0})

    print("\n2) Velocidad y home:")
    cli.orden("velocidad", {"sp": 5})
    ack = cli.orden("home", timeout=90)
    if not ack or ack.get("estado") != "hecho":
        print("  [!] home no ha terminado en 'hecho'; el resto de movimientos se rechazará.")
    time.sleep(0.6)
    mostrar_posicion(cli.posicion)

    print("\n3) Movimientos articulares (jog_articular):")
    cli.orden("jog_articular", {"eje": 1, "grados": 20.0})
    cli.orden("jog_articular", {"eje": 3, "grados": -10.0})
    time.sleep(0.6)
    mostrar_posicion(cli.posicion)

    print("\n4) Movimientos cartesianos (jog_mundo y mover_pose):")
    cli.orden("jog_mundo", {"dx": 0.0, "dy": 0.0, "dz": -20.0})
    time.sleep(0.6)
    p = cli.posicion
    if p and p.get("valida"):
        # Ir a la posición actual elevada 20 mm (no inventamos coordenadas absolutas).
        cli.orden("mover_pose", {"x": p["x"], "y": p["y"], "z": p["z"] + 20.0,
                                 "pitch": p["pitch"], "roll": p["roll"]})
    else:
        print("  (posición no válida: se omite mover_pose)")
    cli.orden("pinza", {"accion": "abrir"})
    cli.orden("pinza", {"accion": "cerrar"})
    time.sleep(0.6)
    mostrar_posicion(cli.posicion)

    print("\n5) Rechazos provocados a propósito:")
    print(" a) Orden con 2 s de antigüedad -> 'caducado'")
    cli.orden("jog_articular", {"eje": 1, "grados": 1.0}, ts=ahora_ms() - 2000)
    print(" b) Campo destino 'real' en el topic del gemelo -> 'destino'")
    cli.orden("jog_articular", {"eje": 1, "grados": 1.0}, destino="real")
    print(" c) Comando desconocido -> 'formato'")
    cli.orden("bailar", {})
    print(" d) Eje fuera de rango -> 'formato'")
    cli.orden("jog_articular", {"eje": 9, "grados": 1.0})
    print(" e) Id repetido: no se ejecuta otra vez; el gemelo reenvía el ACK ya dado")
    id_rep = uuid.uuid4().hex[:12]
    cli.orden("jog_articular", {"eje": 5, "grados": 5.0}, id_cmd=id_rep)
    ya_vistos = len(cli._acks.get(id_rep, []))
    cli.enviar("jog_articular", {"eje": 5, "grados": 5.0}, id_cmd=id_rep)
    cli.esperar(id_rep, timeout=5, n_minimo=2, desde=ya_vistos)

    if cli.actuadores:
        a = cli.actuadores
        print(f"\nactuadores: referenciado={a.get('referenciado')} error={a.get('error')} "
              f"velocidad={a.get('velocidad')} pinza={a.get('pinza')} "
              f"desfase_ms={a.get('desfase_ms')}")


def main() -> int:
    ap = argparse.ArgumentParser(description="Ejemplo de cliente MQTT del gemelo RV-M1")
    ap.add_argument("--host", default="localhost", help="IP del PC del profesor")
    ap.add_argument("--puerto", type=int, help="1883 (TCP) o 9001 (WebSocket) por defecto")
    ap.add_argument("--usuario", required=True, help="p. ej. alumno07")
    ap.add_argument("--password", help="si no se da, se usa RVM1_PASSWORD o se pregunta")
    ap.add_argument("--id", help="id del gemelo (por defecto, los dígitos del usuario)")
    ap.add_argument("--ws", action="store_true", help="conectar por WebSocket (puerto 9001)")
    ap.add_argument("--registro", help="fichero .jsonl donde registrar mensajes (opcional)")
    a = ap.parse_args()

    id_robot = a.id
    if id_robot is None:
        m = re.search(r"(\d+)$", a.usuario)
        if not m:
            ap.error("no se puede deducir el id del usuario; usa --id")
        id_robot = m.group(1)
    contrasena = a.password or os.environ.get("RVM1_PASSWORD") or \
        getpass.getpass(f"Contraseña de {a.usuario}: ")
    puerto = a.puerto or (9001 if a.ws else 1883)

    print(f"Conectando a {a.host}:{puerto} ({'WebSocket' if a.ws else 'TCP'}) "
          f"como {a.usuario}, gemelo rvm1/{DESTINO}/{id_robot}/")
    try:
        cli = ClienteGemelo(a.host, puerto, a.usuario, contrasena, id_robot, a.ws, a.registro)
    except OSError as e:
        print(f"[!] No se puede conectar con {a.host}:{puerto}: {e}\n"
              "    ¿IP correcta? ¿broker arrancado? ¿cortafuegos del PC del profesor?")
        return 1
    if not cli._conectado.wait(10) or (cli._rc_conexion and cli._rc_conexion.is_failure):
        cli.cerrar()
        return 1

    time.sleep(1.0)  # dar tiempo a recibir los mensajes retenidos
    if cli.online != "online":
        print(f"[!] Tu gemelo no aparece en línea (online={cli.online!r}). "
              "Ábrelo en el navegador con tu id; sin él nadie responderá a los comandos.")
    try:
        demo(cli)
    except KeyboardInterrupt:
        print("\nInterrumpido.")
    finally:
        cli.cerrar()
    return 0


if __name__ == "__main__":
    sys.exit(main())
