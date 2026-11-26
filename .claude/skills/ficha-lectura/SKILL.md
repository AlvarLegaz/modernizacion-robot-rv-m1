---
name: ficha-lectura
description: Plantilla de ficha de lectura para cada trabajo del estado del arte del proyecto RV-M1. Usar al analizar un artículo seleccionado.
---

# Ficha de lectura

Un fichero por trabajo: `Investigacion/Estado_del_Arte/fichas/<clave>.md`, donde `<clave>` es la misma clave BibTeX (apellidoPrimerAutor + año + palabra, p. ej. `mendonca2025retrofit`).

```markdown
# <Título>

- **Clave:** <clave>
- **Referencia:** Autores (año). Título. Revista/Congreso, vol(núm), páginas.
- **DOI/URL:** 
- **Tipo:** revista | congreso | tesis | preprint
- **Leído:** resumen | texto completo
- **Línea:** <línea de búsqueda>

## Problema que aborda
## Solución / arquitectura
- Equipo o robot:
- ¿Mantiene la controladora original? sí | no | parcial
- Comunicación / protocolo (MQTT, OPC UA, ROS, RS-232, …):
- Gemelo digital: no | visualización | cinemático | dinámico | sincronizado bidireccional
- Seguridad en la capa de comunicación:
## Evaluación
- Métricas medidas (latencia, error de posición, repetibilidad, …) y valores:
- Tamaño de la muestra / repeticiones:
## Limitaciones (declaradas y observadas)
## Relación con nuestro trabajo
- Qué aprovechamos:
- En qué nos diferenciamos:
## Citas textuales útiles (máx. 1, < 15 palabras, con página)
```

Reglas: **antes de escribir, comprueba si la ficha ya existe** (otro agente puede haberla creado en paralelo). Si existe, no la sobrescribas: añade al final una sección `## Notas desde la línea <tu línea>` con lo nuevo. Escribe con tus palabras; solo datos que aparezcan en la fuente; si un campo no aparece, pon "no indicado".
