---
name: rubrica-revision
description: Rúbrica de revisión del proyecto RV-M1 para estado del arte, protocolos y artículo, con formato de informe. Usar en el agente revisor.
---

# Rúbrica de revisión

Puntúa de 1 (inaceptable) a 5 (excelente) y justifica cada nota con ejemplos concretos (sección, párrafo).

| Criterio | Qué se mira |
|---|---|
| Novedad | ¿La aportación se distingue de los trabajos de la matriz? ¿Hay trabajos previos que la invaliden? |
| Cobertura del estado del arte | ¿Faltan líneas, trabajos clave o recientes? ¿Se comparan enfoques o solo se enumeran artículos? |
| Rigor metodológico | ¿Los experimentos responden a las preguntas? ¿Muestras suficientes? ¿Amenazas a la validez? |
| Trazabilidad | ¿Cada afirmación tiene cita o dato? ¿Las cifras coinciden con las fuentes y con `analisis/`? |
| Reproducibilidad | ¿Código, versiones, contrato y datos permiten repetirlo? |
| Claridad | Estructura, terminología constante, figuras y tablas útiles |
| Adecuación a la revista | Alcance, extensión y formato |

Enfoques posibles (el orquestador indica cuáles): **novedad**, **método**, **claridad**, **reproducibilidad**. Si se piden varios revisores, cada uno se centra en su enfoque.

## Informe (`revisiones/revision_<documento>_vN.md`)
```markdown
# Revisión de <documento> — vN
## Resumen del documento (3–4 líneas)
## Puntuaciones
| Criterio | Nota | Justificación |
## Problemas mayores
1. Dónde · Problema · Cambio propuesto
## Problemas menores
## Comprobaciones hechas (búsquedas, cifras contrastadas)
## Recomendación: aceptar | revisión menor | revisión mayor | rechazar — motivo
```
