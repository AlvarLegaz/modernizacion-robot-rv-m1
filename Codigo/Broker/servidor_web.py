#!/usr/bin/env python3
"""Servidor web del gemelo SIN Docker (sustituto de nginx).

Sirve la carpeta ``Codigo/Gemelo/`` del repositorio y, como el nginx de docker-compose,
responde en ``/hora`` con la hora del servidor (segundos epoch con milisegundos)
para que navegadores y programas estimen el desfase de su reloj.

Uso:   python servidor_web.py              (puerto 8080, todas las interfaces)
       python servidor_web.py --puerto 8081 --dir ../Gemelo

Diferencia con ``python -m http.server``: fuerza el tipo MIME ``text/javascript``
para ``.js``/``.mjs``. En algunos Windows el registro asocia ``.js`` a
``text/plain`` y el navegador se niega a cargar los módulos ES del gemelo.
"""

from __future__ import annotations

import argparse
import functools
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

DIR_GEMELO = Path(__file__).resolve().parent.parent / "Gemelo"


class Manejador(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map,
                      ".js": "text/javascript", ".mjs": "text/javascript",
                      ".json": "application/json", ".wasm": "application/wasm"}

    def do_GET(self):  # noqa: N802
        if self.path.split("?", 1)[0] == "/hora":
            cuerpo = f"{time.time():.3f}\n".encode("ascii")
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(cuerpo)))
            self.end_headers()
            self.wfile.write(cuerpo)
            return
        super().do_GET()

    def end_headers(self):
        if not self.path.startswith("/hora"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--puerto", type=int, default=8080)
    ap.add_argument("--dir", type=Path, default=DIR_GEMELO)
    ap.add_argument("--escucha", default="0.0.0.0", help="interfaz (0.0.0.0 = todas)")
    a = ap.parse_args()
    raiz = a.dir.resolve()
    if not raiz.is_dir():
        raise SystemExit(f"No existe la carpeta {raiz}")
    manejador = functools.partial(Manejador, directory=str(raiz))
    with ThreadingHTTPServer((a.escucha, a.puerto), manejador) as srv:
        print(f"Sirviendo {raiz} en http://{a.escucha}:{a.puerto}/  (Ctrl+C para parar)")
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
