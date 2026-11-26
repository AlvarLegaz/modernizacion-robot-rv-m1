---
name: busqueda-bibliografica
description: Procedimiento de búsqueda bibliográfica sistemática (estilo PRISMA simplificado) para el estado del arte del proyecto RV-M1. Usar al buscar literatura de una línea.
---

# Búsqueda bibliográfica

## Fuentes, por orden de preferencia
1. **APIs abiertas** (devuelven metadatos fiables):
   - OpenAlex: `https://api.openalex.org/works?search=<términos>&filter=from_publication_date:2018-01-01&per-page=25`
   - Crossref: `https://api.crossref.org/works?query=<términos>&rows=20`
   - Semantic Scholar: `https://api.semanticscholar.org/graph/v1/paper/search?query=<términos>&fields=title,year,authors,venue,externalIds,abstract&limit=20`
   - arXiv: `http://export.arxiv.org/api/query?search_query=all:<términos>&max_results=20`
2. **Buscador web** para editoriales (MDPI, IEEE Xplore, ScienceDirect, Springer) y repositorios de tesis.
3. Páginas de la propia revista para comprobar el resumen.

Si una API no responde (allowlist o error), anótalo en el registro y usa la siguiente fuente.

## Procedimiento
1. Escribe 3–5 cadenas de búsqueda en inglés (y 1–2 en español) combinando sinónimos: p. ej. `retrofit legacy industrial robot`, `brownfield robot IIoT MQTT`, `digital twin robotic arm MQTT`, `RS-232 gateway robot controller`.
2. Para cada búsqueda anota en `Investigacion/Estado_del_Arte/busquedas/<linea>.md`: fecha, fuente, cadena exacta, nº de resultados vistos, seleccionados.
3. **Criterios de inclusión:** revisado por pares (revista o congreso) o tesis; trata la línea; aporta arquitectura, método o resultados medidos. Preferencia 2018+.
4. **Exclusión:** solo publicitario, sin acceso a resumen, duplicado, o sin relación con manipuladores/maquinaria industrial.
5. Sigue referencias hacia atrás (bibliografía de los mejores trabajos) y hacia delante (quién los cita) para 1–2 trabajos clave.
6. Para cada trabajo seleccionado: lee al menos el resumen y, si está en abierto, metodología y resultados.

## Formato del registro
```markdown
## Búsquedas
| Fecha | Fuente | Cadena | Vistos | Seleccionados |
|---|---|---|---|---|

## Seleccionados
- clave2024 — motivo de inclusión

## Resumen de la línea
Qué hay · qué falta · implicaciones para el artículo
```
