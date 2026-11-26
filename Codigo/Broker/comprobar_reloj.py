#!/usr/bin/env python3
"""Mide el desfase del reloj de este equipo respecto al PC del profesor.

Dos métodos (no requieren instalar nada):

  --http IP[:puerto]  Pide /hora al servidor web del gemelo (nginx o servidor_web.py)
                      y aplica el algoritmo de Cristian: desfase = t_srv + RTT/2 - t_local.
  --ntp  IP           Consulta SNTP (UDP 123) al servidor NTP del aula.

Se toman varias muestras y se usa la de menor RTT (la más fiable).

    python comprobar_reloj.py --http 192.168.1.10:8080
    python comprobar_reloj.py --ntp 192.168.1.10

Umbrales del contrato MQTT v0.2: la placa rechaza todo con motivo 'reloj' si su
desfase supera 100 ms, y cualquier orden con más de 500 ms de antigüedad se
rechaza como 'caducado'.
"""

from __future__ import annotations

import argparse
import socket
import struct
import sys
import time
import urllib.request

DELTA_NTP = 2208988800  # segundos entre 1900-01-01 y 1970-01-01


def muestra_http(url: str, timeout: float) -> tuple[float, float]:
    t0 = time.time()
    with urllib.request.urlopen(url, timeout=timeout) as r:
        t_srv = float(r.read().decode("ascii").strip())
    t1 = time.time()
    rtt = t1 - t0
    return (t_srv + rtt / 2 - t1) * 1000, rtt * 1000


def muestra_ntp(host: str, timeout: float) -> tuple[float, float]:
    paquete = bytearray(48)
    paquete[0] = 0x23  # LI=0, VN=4, modo 3 (cliente)
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.settimeout(timeout)
        t1 = time.time()
        s.sendto(paquete, (host, 123))
        datos, _ = s.recvfrom(48)
        t4 = time.time()

    def ts(off: int) -> float:
        seg, frac = struct.unpack("!II", datos[off:off + 8])
        return seg - DELTA_NTP + frac / 2**32

    t2, t3 = ts(32), ts(40)
    desfase = ((t2 - t1) + (t3 - t4)) / 2
    rtt = (t4 - t1) - (t3 - t2)
    return desfase * 1000, rtt * 1000


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--http", help="IP[:puerto] del servidor web del gemelo (puerto 8080 por defecto)")
    g.add_argument("--ntp", help="IP del servidor NTP del aula")
    ap.add_argument("-n", "--muestras", type=int, default=8)
    ap.add_argument("--timeout", type=float, default=2.0)
    a = ap.parse_args()

    if a.http:
        destino = a.http if ":" in a.http else a.http + ":8080"
        url = f"http://{destino}/hora"
        medir = lambda: muestra_http(url, a.timeout)  # noqa: E731
        print(f"Midiendo contra {url}")
    else:
        medir = lambda: muestra_ntp(a.ntp, a.timeout)  # noqa: E731
        print(f"Midiendo contra NTP {a.ntp}:123")

    muestras = []
    for _ in range(a.muestras):
        try:
            muestras.append(medir())
        except (OSError, ValueError) as e:
            print(f"  fallo: {e}")
        time.sleep(0.2)
    if not muestras:
        print("No se ha obtenido ninguna muestra (¿IP, puerto, cortafuegos?).")
        return 2

    desfase, rtt = min(muestras, key=lambda m: m[1])
    print(f"Desfase de ESTE equipo respecto al servidor: {desfase:+.1f} ms "
          f"(RTT {rtt:.1f} ms, incertidumbre ~ ±{rtt / 2:.1f} ms)")
    print("  (positivo: este reloj va atrasado; negativo: va adelantado)")
    if abs(desfase) <= 100:
        print("OK: dentro del límite de 100 ms del contrato.")
        return 0
    if abs(desfase) <= 500:
        print("AVISO: más de 100 ms. Una placa con este desfase rechazaría todo con 'reloj';"
              " y se reduce el margen de 500 ms antes de 'caducado'. Sincroniza el reloj.")
        return 1
    print("MAL: más de 500 ms. Las órdenes de este equipo llegarán 'caducadas' (o se "
          "aceptarán tarde si va adelantado). Sincroniza el reloj antes de seguir.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
