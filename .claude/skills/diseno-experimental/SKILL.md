---
name: diseno-experimental
description: Experimentos de validación del proyecto RV-M1 y plantilla de protocolo. Usar al diseñar o revisar los protocolos de experimentos.
---

# Diseño experimental

## Experimentos previstos (ajustar a las preguntas de `Investigacion/Estado_del_Arte/huecos.md`)
| Id | Qué mide | Métrica principal | Mínimo de repeticiones |
|---|---|---|---|
| E1 | Latencia de extremo a extremo (cliente→ACK aceptado, cliente→ACK hecho) | mediana, p95, p99 (ms) | ≥ 200 comandos por condición |
| E2 | Fidelidad del gemelo frente al robot real con el mismo programa | error de posición X,Y,Z (mm) y orientación (°) | ≥ 10 programas × 3 repeticiones |
| E3 | Repetibilidad de coger y dejar | tasa de éxito, desviación de la posición final | ≥ 20 ciclos |
| E4 | Seguridades del contrato (caducados, destino erróneo, sin referenciar) | % de rechazos correctos, falsos rechazos | ≥ 100 casos por regla, con red cargada y sin cargar |
| E5 | Robustez de comunicaciones (reconexión, pérdida de broker) | tiempo de recuperación, comandos perdidos/duplicados | ≥ 20 cortes |

## Plantilla de protocolo (`Investigacion/Experimentos/protocolos/Ex_<nombre>.md`)
```markdown
# Ex — <nombre>
## Pregunta de investigación
## Hipótesis
## Variables (independientes / dependientes / controladas)
## Montaje (hardware, red, versiones de código y contrato)
## Procedimiento paso a paso (lo ejecuta Álvar)
## Seguridad (zona despejada, seta al alcance, velocidad SP máxima)
## Datos que se registran (según registro-experimentos)
## Análisis previsto (estadístico y figura)
## Criterio de éxito
```
Define el análisis **antes** de tener los datos, para evitar ajustar el método a los resultados.
