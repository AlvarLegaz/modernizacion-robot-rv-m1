#!/usr/bin/env python3
"""
Control básico del Mitsubishi Movemaster EX RV-M1 por RS-232C.

Modo articular y modo cartesiano desde el PC, con lectura de posición (WH)
y de error (ER). Requiere: pip install pyserial

AVISO: sintaxis de comandos y parámetros serie según el manual del RV-M1;
compruébalos con tu máquina. Ten siempre a mano la seta de emergencia.

Uso:
    python rvm1_control.py --port COM3
    python rvm1_control.py --port /dev/ttyUSB0 --baud 9600

Órdenes en la consola interactiva:
    nt                  homing (origen). Obligatorio tras encender.
    j <eje> <grados>    mueve un eje (1..5) un incremento en grados   -> DJ
    ja a b c d e        mueve los 5 ejes a la vez (incrementos, grados) -> MJ
    c <dx> <dy> <dz>    recta incremental en mm de la punta           -> DS
    p x y z pitch roll  ir a pose cartesiana absoluta (mm, grados)    -> MP
    wh                  leer posición actual (x, y, z, pitch, roll)
    sp <0-9>            velocidad
    tl <mm>             longitud de herramienta
    go / gc             abrir / cerrar pinza
    er                  leer estado de error
    rs                  reset de error
    raw <texto>         enviar un comando tal cual (p. ej. "raw MO 1")
    q                   salir
"""

import argparse
import sys
import time

import serial


class RVM1:
    def __init__(self, port, baud=9600, rtscts=True, timeout=2.0):
        # Formato habitual del manual: 7 bits, paridad par, 2 bits de stop.
        # Ajusta para que coincida con SW2/SW3 de la unidad de control.
        self.ser = serial.Serial(
            port=port,
            baudrate=baud,
            bytesize=serial.SEVENBITS,
            parity=serial.PARITY_EVEN,
            stopbits=serial.STOPBITS_TWO,
            rtscts=rtscts,
            timeout=timeout,
        )
        time.sleep(0.2)
        self.ser.reset_input_buffer()

    def close(self):
        self.ser.close()

    # --- bajo nivel ---------------------------------------------------------
    def send(self, cmd):
        """Envía un comando terminado en CR (SW1 bit 1 = CR)."""
        line = cmd.strip().upper() + "\r"
        self.ser.write(line.encode("ascii"))
        self.ser.flush()

    def query(self, cmd, wait=0.3):
        """Envía un comando de lectura y devuelve la respuesta en texto."""
        self.ser.reset_input_buffer()
        self.send(cmd)
        time.sleep(wait)
        resp = self.ser.read_until(b"\r").decode("ascii", errors="replace")
        return resp.strip()

    # --- estado -------------------------------------------------------------
    def error(self):
        """ER -> 0: sin error, 1: modo error I, 2: modo error II."""
        r = self.query("ER")
        try:
            return int(r)
        except ValueError:
            return r

    def where(self):
        """WH -> (x, y, z, pitch, roll) en mm y grados."""
        r = self.query("WH")
        try:
            return tuple(float(v) for v in r.split(","))
        except ValueError:
            return r

    def run(self, cmd, check=True):
        """Envía un comando de movimiento y, opcionalmente, mira si hubo error."""
        self.send(cmd)
        if check:
            time.sleep(0.5)
            e = self.error()
            if e not in (0, "0"):
                print(f"  ! Error tras '{cmd}': ER={e}  (usa 'rs' para resetear)")
                return False
        return True

    # --- modo articular -----------------------------------------------------
    def joint_step(self, joint, deg):
        return self.run(f"DJ {int(joint)},{float(deg):.1f}")

    def joints_step(self, a, b, c, d, e):
        return self.run(f"MJ {a:.1f},{b:.1f},{c:.1f},{d:.1f},{e:.1f}")

    # --- modo cartesiano ----------------------------------------------------
    def cart_step(self, dx, dy, dz):
        return self.run(f"DS {dx:.1f},{dy:.1f},{dz:.1f}")

    def move_pose(self, x, y, z, p, r):
        return self.run(f"MP {x:.1f},{y:.1f},{z:.1f},{p:.1f},{r:.1f}")


def repl(robot):
    print("RV-M1 conectado. Escribe 'nt' para hacer el origen, 'q' para salir.")
    while True:
        try:
            line = input("rv-m1> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not line:
            continue
        parts = line.split()
        op, args = parts[0].lower(), parts[1:]
        try:
            if op == "q":
                break
            elif op == "nt":
                robot.run("NT", check=False)
                print("  Homing lanzado. Espera a que termine y mira 'er'.")
            elif op == "j":
                robot.joint_step(int(args[0]), float(args[1]))
            elif op == "ja":
                robot.joints_step(*map(float, args[:5]))
            elif op == "c":
                robot.cart_step(*map(float, args[:3]))
            elif op == "p":
                robot.move_pose(*map(float, args[:5]))
            elif op == "wh":
                print(" ", robot.where())
            elif op == "sp":
                robot.run(f"SP {int(args[0])}", check=False)
            elif op == "tl":
                robot.run(f"TL {float(args[0]):.1f}", check=False)
            elif op == "go":
                robot.run("GO", check=False)
            elif op == "gc":
                robot.run("GC", check=False)
            elif op == "er":
                print("  ER =", robot.error())
            elif op == "rs":
                robot.run("RS", check=False)
            elif op == "raw":
                cmd = " ".join(args)
                if cmd.upper().startswith(("WH", "ER", "PR", "LR", "CR", "DR")):
                    print(" ", robot.query(cmd))
                else:
                    robot.run(cmd)
            else:
                print("  Orden desconocida. Mira la ayuda al principio del script.")
        except (IndexError, ValueError):
            print("  Faltan o sobran argumentos.")


def main():
    ap = argparse.ArgumentParser(description="Control del RV-M1 por RS-232C")
    ap.add_argument("--port", required=True, help="COM3, /dev/ttyUSB0...")
    ap.add_argument("--baud", type=int, default=9600)
    ap.add_argument("--no-rtscts", action="store_true",
                    help="desactiva el control de flujo RTS/CTS")
    a = ap.parse_args()

    robot = RVM1(a.port, a.baud, rtscts=not a.no_rtscts)
    try:
        repl(robot)
    finally:
        robot.close()


if __name__ == "__main__":
    sys.exit(main())
