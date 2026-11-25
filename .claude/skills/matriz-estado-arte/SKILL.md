---
name: matriz-estado-arte
description: Cómo construir la matriz comparativa y el documento de estado del arte a partir de las fichas. Usar en la fase de síntesis.
---

# Matriz y estado del arte

## 1. Matriz (`investigacion/matriz.md`)
Una fila por trabajo (todas las fichas). Columnas fijas:

| Clave | Año | Equipo | Controladora original | Protocolo | Gemelo digital | Seguridad en comunicación | Métricas medidas | Uso educativo | Código abierto |
|---|---|---|---|---|---|---|---|---|---|

Valores cortos y homogéneos (sí/no/parcial, nombre del protocolo, tipo de gemelo). Al final, una fila "**Este trabajo**" con lo que proponemos.

## 2. Documento (`investigacion/estado_del_arte.md`)
1. **Introducción** (contexto: equipos heredados, Industria 4.0, coste de sustituir controladoras).
2. **Una sección por línea**, organizada por enfoques, no por artículos. Cada párrafo agrupa varios trabajos y los compara.
3. **Síntesis**: tendencias, carencias comunes (remite a `huecos.md`).
4. **Posicionamiento del artículo**: en qué se diferencia, apoyado en la matriz.

Reglas: cada afirmación sobre un trabajo lleva su clave `[@clave]`; no se cita nada que no tenga ficha.
