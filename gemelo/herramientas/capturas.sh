#!/bin/sh
# Capturas del diseño adaptable en Chrome headless (WebGL por software con SwiftShader).
# Uso (desde la raíz del repo):
#   (cd gemelo && python3 -m http.server 8765 --bind 127.0.0.1 &)
#   sh gemelo/herramientas/capturas.sh http://127.0.0.1:8765 gemelo/capturas
BASE=${1:-http://127.0.0.1:8765}
SAL=${2:-gemelo/capturas}
CHROME=${CHROME:-google-chrome}
mkdir -p "$SAL"
cap() {  # cap TAMAÑO NOMBRE PARAMETROS
  w=${1%x*}; h=${1#*x}
  timeout 90 "$CHROME" --headless=new --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --hide-scrollbars \
    --window-size="$w,$h" --virtual-time-budget=8000 --screenshot="$SAL/$2.png" "$BASE/index.html?captura=1&$3" >/dev/null 2>&1
  echo "$2: $?"
}
for t in 1920x1080 1180x820 820x1180 390x844; do cap "$t" "gemelo_$t" "demo=1"; done
cap 1920x1080 "gemelo_1920x1080_sombra" "demo=1&fantasma=1"
cap 1366x1024 "gemelo_1366x1024" "demo=1"
cap 1024x1366 "gemelo_1024x1366" "demo=1"
