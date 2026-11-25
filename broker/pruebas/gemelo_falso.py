#!/usr/bin/env python3
"""Doble de prueba MÍNIMO del gemelo, solo para probar el broker y el ejemplo
``ejemplos/cliente_gemelo.py`` sin navegador. NO es el gemelo digital (ese está en
``gemelo/``): no tiene cinemática ni tiempos realistas.

Implementa del contrato v0.2 lo justo para el ejemplo: ACK en dos fases, rechazos
``formato``, ``caducado``, ``destino`` y ``no_referenciado``, descarte de ``id``
duplicados (reenvía el ACK ya dado), ``actuadores`` y ``posicion/mundo`` retenidos y
``online`` con última voluntad.

    python gemelo_falso.py --host 127.0.0.1 --puerto 1883 --usuario alumno01 --password ...
"""

from __future__ import annotations

import argparse
import json
import threading
import time

import paho.mqtt.client as mqtt
from paho.mqtt.enums import CallbackAPIVersion

CMDS = {"home", "jog_articular", "jog_mundo", "mover_pose", "velocidad", "pinza",
        "reset", "parar"}


def ahora_ms() -> int:
    return int(time.time() * 1000)


class GemeloFalso:
    def __init__(self, a):
        self.base = f"rvm1/gemelo/{a.id}"
        self.ref = False
        self.vel = 2
        self.pinza = "desconocida"
        self.pos = {"x": 0.0, "y": 0.0, "z": 0.0, "pitch": 0.0, "roll": 0.0}
        self.acks: dict[str, list[dict]] = {}
        self.lock = threading.Lock()
        self.c = mqtt.Client(CallbackAPIVersion.VERSION2, client_id=f"gemelo-falso-{a.id}",
                             transport="websockets" if a.ws else "tcp")
        self.c.username_pw_set(a.usuario, a.password)
        self.c.will_set(f"{self.base}/online", "offline", qos=1, retain=True)
        self.c.on_connect = lambda c, u, f, rc, p: (
            c.subscribe(f"{self.base}/comandos", 1),
            c.publish(f"{self.base}/online", "online", qos=1, retain=True),
            self.publicar_estado())
        self.c.on_message = self.on_message
        self.c.connect(a.host, a.puerto, 30)

    def publicar_estado(self):
        self.c.publish(f"{self.base}/actuadores", json.dumps({
            "ts": ahora_ms(), "conectado": True, "referenciado": self.ref, "error": 0,
            "velocidad": self.vel, "pinza": self.pinza, "ocupado": False, "cola": 0,
            "desfase_ms": 0}), qos=1, retain=True)
        self.c.publish(f"{self.base}/posicion/mundo", json.dumps(
            {"ts": ahora_ms(), **self.pos, "valida": self.ref}), qos=0, retain=True)

    def ack(self, id_, estado, **extra):
        m = {"id": id_, "ts": ahora_ms(), "estado": estado, **extra}
        self.acks.setdefault(id_, []).append(m)
        self.c.publish(f"{self.base}/comandos/ack", json.dumps(m), qos=1)

    def on_message(self, c, u, msg):
        with self.lock:
            try:
                o = json.loads(msg.payload)
                id_, ts, dest, cmd = o["id"], int(o["ts"]), o["destino"], o["cmd"]
                args = o.get("args") or {}
            except (ValueError, KeyError, TypeError):
                return  # sin id no se puede contestar
            if id_ in self.acks:  # duplicado: reenviar lo ya dicho
                for m in self.acks[id_]:
                    c.publish(f"{self.base}/comandos/ack", json.dumps(m), qos=1)
                return
            if dest != "gemelo":
                return self.ack(id_, "rechazado", motivo="destino")
            if ahora_ms() - ts > 500:
                return self.ack(id_, "rechazado", motivo="caducado")
            if cmd not in CMDS or (cmd == "jog_articular" and args.get("eje") not in range(1, 6)):
                return self.ack(id_, "rechazado", motivo="formato")
            if cmd in ("jog_mundo", "mover_pose") and not self.ref:
                return self.ack(id_, "rechazado", motivo="no_referenciado")
            self.ack(id_, "aceptado")
            time.sleep(0.05)
            if cmd == "home":
                self.ref = True
                self.pos = {"x": 0.0, "y": 0.0, "z": 0.0, "pitch": 0.0, "roll": 0.0}
            elif cmd == "jog_mundo":
                for k in ("x", "y", "z"):
                    self.pos[k] += float(args.get("d" + k, 0.0))
            elif cmd == "mover_pose":
                self.pos = {k: float(args[k]) for k in self.pos}
            elif cmd == "velocidad":
                self.vel = int(args["sp"])
            elif cmd == "pinza":
                self.pinza = "abierta" if args.get("accion") == "abrir" else "cerrada"
            self.ack(id_, "hecho", er=0)
            self.publicar_estado()

    def bucle(self):
        self.c.loop_start()
        try:
            while True:
                time.sleep(0.5)
                with self.lock:
                    self.publicar_estado()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--puerto", type=int, default=1883)
    ap.add_argument("--usuario", required=True)
    ap.add_argument("--password", required=True)
    ap.add_argument("--id")
    ap.add_argument("--ws", action="store_true")
    a = ap.parse_args()
    a.id = a.id or a.usuario[-2:]
    GemeloFalso(a).bucle()
