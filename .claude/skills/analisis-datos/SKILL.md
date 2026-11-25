---
name: analisis-datos
description: Normas para analizar los datos experimentales del proyecto RV-M1 con Python (pandas, numpy, scipy, matplotlib) de forma reproducible. Usar al escribir scripts de análisis y figuras.
---

# Análisis de datos

- Scripts en `analisis/` (`analizar_E1.py`, …). Leen de `experimentos/datos_crudos/` y escriben en `analisis/resultados/` (tablas CSV) y `analisis/figuras/` (PDF vectorial + PNG 300 ppp).
- Un `analisis/README.md` indica cómo regenerarlo todo y las versiones de librerías (`requirements.txt`).
- Si se procesan muchos ficheros, barra de progreso con `tqdm`.
- Estadística:
  - latencias: mediana, p95, p99, máximo; histograma o ECDF; no solo la media;
  - errores de posición: media, desviación típica, RMSE e IC95 % (bootstrap si la distribución no es normal);
  - proporciones (éxitos, rechazos): porcentaje con IC95 % de Wilson;
  - comparaciones entre condiciones: prueba no paramétrica (Mann-Whitney / Wilcoxon) y tamaño del efecto.
- Figuras: ejes con unidades, fuente legible a una columna (8–9 pt), sin títulos dentro de la figura (van en el pie), paleta apta para daltónicos.
- Documenta datos descartados y por qué. Nunca se rellenan huecos con valores inventados.
