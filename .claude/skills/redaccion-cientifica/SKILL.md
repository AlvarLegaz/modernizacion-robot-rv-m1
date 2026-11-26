---
name: redaccion-cientifica
description: Guía de redacción del artículo técnico del proyecto RV-M1 (estructura, estilo, trazabilidad de afirmaciones). Usar al escribir o reescribir el manuscrito.
---

# Redacción científica

## Estructura (5 secciones, acordada con el autor; no añadir más sin su visto bueno)
Ficheros en `Investigacion/Paper/secciones/`:
- `00_abstract.tex` — resumen y palabras clave (se escribe al final).
1. `01_introduction.tex` — contexto, estado del arte resumido por enfoques con la tabla comparativa, hueco, aportaciones y preguntas de investigación.
2. `02_modernisation.tex` — proceso de modernización: el robot, reparación y puesta en marcha, control desde PC por RS-232C, pendant de software, placa de interfaz y gemelo digital.
3. `03_mqtt.tex` — protocolo de comunicación MQTT: topics real/gemelo, comandos y ACK, estado y posición, seguridades.
4. `04_experiments.tex` — experimentos y resultados: montaje, resultados (solo de `Investigacion/Experimentos/analisis/`) y discusión.
5. `05_conclusions.tex` — conclusiones y trabajo futuro.
- `99_declarations.tex` — disponibilidad de código y datos, uso de IA, financiación, conflictos.

## Extensión máxima: 8–9 páginas (límite fijado por el autor)
Presupuesto orientativo (≈ 5000 palabras de texto + 6–7 figuras/tablas + ≈ 30 referencias). Comprobar las páginas reales al compilar con la plantilla de la revista y recortar texto, nunca reducir márgenes ni letra.
| Sección | Palabras | Figuras/tablas |
|---|---|---|
| Resumen | 200 | — |
| 1. Introducción (incluye estado del arte y tabla comparativa) | 1100–1300 | 1 tabla |
| 2. Proceso de modernización | 1000–1200 | 2 (arquitectura, pendant) |
| 3. Protocolo MQTT | 800–1000 | 1 (topics/secuencia de ACK) |
| 4. Experimentos y resultados | 1300–1500 | 2–3 |
| 5. Conclusiones | 250–300 | — |
No se citan los 41 trabajos del estado del arte: solo los necesarios para posicionar el artículo (≈ 25–35).

## Estilo
- Frases cortas, voz activa, presente para el sistema y pasado para los experimentos.
- Cada aportación del principio debe tener su evidencia en Resultados.
- No exagerar: "reduce", "permite" solo si está medido. Nada de "por primera vez" sin comprobarlo con el investigador.
- Términos constantes en todo el texto (definir una vez: gemelo digital, puente, contrato).
- En LaTeX: `\citep{clave}`/`\citet{clave}` para citas y `\FALTA{…}` para huecos de información (definido en `Investigacion/Paper/main.tex`).
- El estilo concreto (persona, longitud de frase, cómo presentar aportaciones) lo marca la skill `estilo-autor`, que tiene prioridad sobre estas pautas generales.
