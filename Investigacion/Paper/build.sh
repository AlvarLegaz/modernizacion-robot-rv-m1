#!/usr/bin/env bash
# Compila el borrador: genera Investigacion/Paper/main.pdf
set -e
cd "$(dirname "$0")"
latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex
latexmk -c
