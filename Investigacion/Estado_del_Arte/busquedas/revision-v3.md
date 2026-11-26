# Línea de búsqueda: revision-v3 (cuarta ronda dirigida tras la revisión v3)

Objetivo: localizar, leer y fichar fuentes citables sobre lo que la revisión v3 (`revisiones/revision_estado_arte_v3.md`, mayor 1) señala como antecedentes de la emulación de la controladora: COSIMIR (simulación de celdas con el RV-M1 y su lenguaje MRL con controladora simulada), RRS/RRS-II (Realistic Robot Simulation, Fraunhofer IPK) y el artículo corto de Świder et al. en *JAMME* 20. Releer swider2007system. Límites: solo lo pedido.

## Incidencias de acceso (2026-11-25)
- Las APIs bibliográficas siguen sin acceso; se usa WebSearch y después WebFetch sobre los resultados.
- publica.fraunhofer.de bloquea con Anubis (registro del artículo IFAC 2002 de Bernhardt y Willnow).
- El manual de COSIMIR Educational solo aparece en una copia no oficial (rahebeducation.web.app) y en Scribd. En el portal de soporte de Festo, el InfoPortal de Festo Didactic y el folleto de software de simulación de Festo (2007) no hay copia oficial.
- La lectura de PDF largos es por extracción resumida; las citas literales se han limitado a fragmentos que la herramienta devolvió entre comillas.

## Búsquedas
| Fecha | Fuente | Cadena | Vistos | Seleccionados |
|---|---|---|---|---|
| 2026-11-25 | WebFetch (URL dada por la tarea) | PDF de *JAMME* 20(1–2), delibra Content/38967 | 1 | 1 (swider2007offline) |
| 2026-11-25 | WebSearch | `"off-line programming and simulation software for the Mitsubishi Movemaster RV-M1 robot" Świder` | 20 | 1 (PDF de swider2007system para releerlo); AMM 162 "AR-Based Off-Line Programming of the RV-M1 Robot" visto (sin autores en la página; no fichado) |
| 2026-11-25 | WebFetch | PDF de swider2007system (delibra Content/38972) | 1 | relectura (nota en la ficha) |
| 2026-11-25 | WebSearch | `COSIMIR Educational Festo manual Movemaster RV-M1 MRL robot controller simulation` | 10 | 0 citables (copias no oficiales en Scribd y rahebeducation) |
| 2026-11-25 | WebSearch | `COSIMIR robot simulation 3D cell virtual controller Freund Roßmann paper` | 10 | 1 (tesis de Keibel, TU Dortmund); 2 registros ICRA 2001/2002 de Freund et al. vistos (COSIMIR Factory; no fichados: no tratan la controladora virtual) |
| 2026-11-25 | WebFetch | Tesis de Keibel (eldorado.tu-dortmund.de), 4 bloques | 1 | 1 (keibel2002konzeption) |
| 2026-11-25 | WebSearch | `"COSIMIR" "RV-M1" robot simulation paper` | 10 | 0 (barraza2016modelado ya fichado; no menciona COSIMIR) |
| 2026-11-25 | WebSearch | `Festo Didactic COSIMIR Robotics manual "Movemaster Command" MRL pdf` | 13 | 0 (manual de estación robot Festo 2015 leído: no menciona COSIMIR ni el RV-M1) |
| 2026-11-25 | WebFetch | Copia no oficial del manual COSIMIR Educational (pista del revisor) | 1 | ficha de pista karras2003cosimir, **sin entrada en refs.bib** |
| 2026-11-25 | WebSearch | `"526501" COSIMIR Educational Festo` | 15 | 0 (portal de Festo sin el manual) |
| 2026-11-25 | WebSearch | `COSIMIR Educational simulation robot workcells Mitsubishi Karras Festo Didactic user's guide` | 10 | 0 (folleto de Festo 2007 leído: COSIMIR Industrial programa un robot Mitsubishi; no menciona RV-M1 ni MRL) |
| 2026-11-25 | WebFetch | PDF de patrao2025understanding (cómo describen COSIMIR) | 1 | 0 nuevos (COSIMIR Industrial 4.1 con RV-2AJ por RS-232; vista 3D de la posición actual del robot; nota para la síntesis) |
| 2026-11-25 | WebSearch | `Freund Rossmann Uthoff van der Valk "Towards realistic simulation of robotic workcells" IROS 1994` | 10 | 1 (freund1994towards) |
| 2026-11-25 | WebSearch | `Bernhardt Schreck Willnow "Realistic robot simulation" Computing & Control Engineering Journal` | 10 | 2 (bernhardt1995realistic; bernhardt2002cost) |
| 2026-11-25 | WebSearch | `"Virtual Robot Controller" VRC interface RRS-II Bernhardt Willnow paper` | 10 | 0 nuevos (página de Fraunhofer IPK leída como contraste) |
| 2026-11-25 | WebSearch | `"Cost reduction via accurate controller simulation" Bernhardt Willnow IFAC Proceedings Volumes 2002 doi` | 10 | 0 (DOI no localizado) |
| 2026-11-25 | WebSearch | `"Realistic robot simulation" Bernhardt 1995 "10.1049/cce:19950404"` | 10 | 0 nuevos |

## Seleccionados
- swider2007offline — artículo corto (*JAMME* 20(1–2), 499–502) sobre el mismo RV-M1: ROBO envía datos al robot real en tiempo real mientras se mueve el brazo virtual, con modo mixto real/virtual en red. Sin lectura de estado ni medidas.
- keibel2002konzeption — tesis doctoral (Dortmund) sobre la controladora virtual de COSIMIR, intercambiable por la real sin cambiar el simulador; afirma exactitud sin publicar la medida.
- freund1994towards — IROS 1994: simulación realista de celdas con una controladora industrial integrada por mensajes; origen de COSIMIR según keibel2002konzeption (solo resumen).
- bernhardt1995realistic — revista con DOI: RRS integra el software original de la controladora en los simuladores (solo resumen).
- bernhardt2002cost — IFAC 2002, texto completo: interfaces RCS (1994) y VRC (2001); "el único enfoque con éxito" es usar el software original; sin cifras de exactitud.

## No citables o no fichados
- **COSIMIR Educational, User's Guide** (Festo Didactic, 2003, nº 526501): ficha de pista `karras2003cosimir`, **sin entrada en refs.bib**. Es la única fuente leída que dice que COSIMIR simula el RV-M1 con MRL y controladora completa, y solo está en copias no oficiales. No se usa como referencia; sí como riesgo de novedad en `huecos.md` §6.
- "AR-Based Off-Line Programming of the RV-M1 Robot" (AMM 162, 344–351, 2012): resumen leído en scientific.net, sin autores ni DOI en la página. Programación *off-line* con RA; no consta enlace con la controladora. Sigue pendiente.
- Freund et al., ICRA 2001 y 2002 (COSIMIR Factory): no tratan la controladora virtual.
- JRobot (otro sistema para el RV-M1 citado en swider2007offline): no buscado.

## Resumen de la línea
- **Qué hay.** (1) Emular la controladora industrial dentro del simulador es una línea consolidada desde 1992–1994: RRS (RCS) integra el software original de la controladora y VRC (2001) casi todo ese software, con órdenes, eventos y tiempo de simulación (bernhardt1995realistic, bernhardt2002cost); en COSIMIR, la controladora virtual se diseña para intercambiarse por la real sin tocar el simulador (keibel2002konzeption; freund1994towards). (2) En el propio RV-M1, ROBO interpretaba parte del lenguaje y movía el robot real en vivo desde el modelo (swider2007system, swider2007offline). (3) Según una copia no oficial de su manual, COSIMIR Educational simulaba el RV-M1 con MRL y controladora completa (no citable).
- **Qué falta.** Ninguna de estas fuentes publica una **medida** de la coherencia entre la controladora emulada y la real: RRS y Keibel la afirman sin cifras; Świder no lee el estado del robot. Tampoco se ha encontrado la separación medida entre coherencia con la controladora y fidelidad física en gemelos de manipuladores, ni la observabilidad de una controladora que solo informa bajo petición.
- **Implicaciones.** A3 deja de reivindicar la emulación de la semántica (antes A3 b) y los modos de Kritzinger (antes A3 a, que pasa a métodos). Queda: coherencia **medida** del emulador frente a la controladora real con protocolo anti-circularidad (programas de evaluación distintos de los de ajuste y parámetros congelados antes de E2a), separación medida coherencia / fidelidad física y observabilidad medida (E1.0 y E2c, con poses retenidas antiguas marcadas o descartadas por el `ts` de la placa). En el artículo, la emulación de controladoras se presenta como antecedente con freund1994towards o keibel2002konzeption y bernhardt2002cost, y los dos trabajos de Silesia como antecedentes del mismo robot.
