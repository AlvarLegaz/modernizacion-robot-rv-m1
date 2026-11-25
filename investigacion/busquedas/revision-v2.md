# Línea de búsqueda: revision-v2 (tercera ronda dirigida tras la revisión v2)

Objetivo: localizar, leer y fichar lo que la revisión v2 (`revisiones/revision_estado_arte_v2.md`, mayores 1 y 2, menores N8 y N10) señala como ausente: una referencia de definición de modelo/sombra/gemelo, los *digital twin prototypes*, ros_control como ejemplo de intercambio real/simulado en ROS y el trabajo de VR sobre el RV-M1 (2015). Límites: solo lo pedido; no es una ampliación general.

## Incidencias de acceso (2026-11-25)
- doi.org y mdpi.com fuera de la lista permitida de WebFetch (`URL_NOT_ON_ALLOWLIST`); Barbie et al. se leyó en el repositorio de Southampton.
- publica.fraunhofer.de (Anubis) y bohrium.com (WAF) bloquean el acceso; ScienceDirect da error del sitio (Kritzinger y Crespo). Kritzinger solo se ha podido leer en resumen y metadatos.
- Las APIs de Crossref y OpenAlex siguen sin acceso.

## Búsquedas
| Fecha | Fuente | Cadena | Vistos | Seleccionados |
|---|---|---|---|---|
| 2026-11-25 | WebFetch (URL dada por la tarea) | https://joss.theoj.org/papers/10.21105/joss.00456.pdf | 1 | 1 (chitta2017roscontrol) |
| 2026-11-25 | WebFetch (URL dada por la tarea) | https://research.tec.mx/vivo-tec/display/AcademicArticleSCO_84964068311 | 1 | resumen; sin autores ni DOI |
| 2026-11-25 | WebSearch | `"Virtual Reality Application for Simulation and Off-line Programming of the Mitsubishi Movemaster RV-M1 Robot Integrated with the Oculus Rift"` | 10 | 2 (ficha tec.mx de 2016; registro de search.isc.ac con autores y DOI de la versión ICBL) |
| 2026-11-25 | WebSearch | `Procedia Computer Science 2015 Oculus Rift Mitsubishi Movemaster RV-M1 Unity off-line programming A* students training` | 10 | 0 |
| 2026-11-25 | WebSearch | `"RV-M1" "Oculus Rift" Procedia Computer Science 75 2015 virtual reality robot Tecnológico de Monterrey authors` | 10 | 0 |
| 2026-11-25 | WebSearch | `Crespo García Quiroz 2015 Procedia Computer Science "Movemaster RV-M1" virtual reality off-line programming` | 10 | 0 |
| 2026-11-25 | WebSearch | `"S187705091503687X"` | 10 | 0 |
| 2026-11-25 | WebSearch (extendida) | `"Mitsubishi Movemaster RV-M1 Robot Integrated with the Oculus Rift" doi 10.1016/j.procs.2015` | 10 | 1 (crespo2015virtual; texto en ResearchGate; ScienceDirect no abre) |
| 2026-11-25 | WebSearch | `Barbie Hasselbring Hansen 2024 Symmetry digital twin prototypes embedded software sym16020221` | 10 | 1 (barbie2024digital; PDF en eprints.soton.ac.uk) |
| 2026-11-25 | WebSearch | `Kritzinger Karner Traar Henjes Sihn 2018 Digital Twin in manufacturing categorical literature review IFAC-PapersOnLine` | 10 | 1 (kritzinger2018digital; metadatos en el catálogo UTB) |
| 2026-11-25 | WebSearch | `Kritzinger "Digital Twin in manufacturing: A categorical literature review and classification" pdf "Digital Shadow" "manual data flow" "automatic data flow"` | 10 | 0 (solo fuentes secundarias; Wikipedia "Digital twin integration level" leída como contraste) |
| 2026-11-25 | WebSearch | `sciencedirect "Digital Twin in manufacturing: A categorical literature review and classification" Kritzinger 2405-8963` | 10 | 0 |
| 2026-11-25 | WebSearch | `"S2405896318316021"` | 10 | 0 (clave PII supuesta; sin resultados pertinentes) |
| 2026-11-25 | WebSearch | `Eclipse Sparkplug 3.0.0 specification NDEATH Will Message bdSeq sparkplug.eclipse.org specification html` | 17 | 1 (PDF de la especificación 3.0.0; menor N10, se añade a la ficha iso2023sparkplug) |

## Seleccionados
- barbie2024digital — define el *Digital Twin Prototype* (dispositivo con sensores y actuadores emulados que el software no distingue del real, incluido el RS-232 mediante Socat) y usa la clasificación de Kritzinger. Antecedente conceptual del modo `emulador` (mayor 2).
- chitta2017roscontrol — capa de abstracción de hardware de ROS que permite intercambiar robot real y simulado sin tocar los controladores. Antecedente estándar de la intercambiabilidad sobre middleware pub/sub (mayor 2).
- crespo2015virtual — simulador VR (Unity + Oculus Rift) del RV-M1 con programación fuera de línea y transferencia por fichero al robot real; evaluación docente anecdótica. Antecedente sobre el mismo robot (mayor 2).
- kritzinger2018digital — clasificación modelo/sombra/gemelo por nivel de integración del flujo de datos. Referencia de definición para los modos (mayor 1). **Solo resumen**: las definiciones operativas se toman de barbie2024digital [POR VERIFICAR en el texto completo].

## Descartados / no fichados
- Crespo, García y Quiroz, "Virtual reality simulator for robotics learning", ICBL 2015, pp. 61–65, doi:10.1109/ICBL.2015.7387635: mismo simulador; solo resumen. Se menciona en la ficha de crespo2015virtual y no entra en refs.bib (presupuesto de referencias).
- Xiong, Ma y Wang (2026), localizado por el revisor: no se busca en esta ronda (no compromete A1 según la revisión; contexto).
- Sigue pendiente de la ronda anterior: "AR-Based Off-Line Programming of the RV-M1 Robot" (AMM 162, 2012), sin autores visibles; Kandala et al. (2025) y Brunn y Labib (2005).

## Resumen de la línea
- **Qué hay.** (1) Una terminología asentada (Kritzinger) que separa modelo, sombra y gemelo por el flujo automático de datos; con ella, nuestro `emulador` es un modelo y nuestros `sombra` y `sincronizado` son sombras digitales; ningún modo es un gemelo en sentido estricto porque el gemelo no publica en el robot real. (2) La emulación del dispositivo detrás de la misma interfaz, para que el software no distinga real de emulado, ya está publicada como *Digital Twin Prototype*, incluso para puertos serie (Barbie et al.). (3) Intercambiar robot real y simulado sin tocar los clientes sobre un middleware pub/sub es práctica estándar en ROS (ros_control). (4) En el propio RV-M1 hubo en 2015 un simulador VR con programación fuera de línea y paso al robot por fichero (Crespo et al.).
- **Qué falta.** No se ha encontrado la emulación de la **semántica** de un intérprete serie industrial de los 80 (ACK derivado de `ER`, errores de modo I/II, referencia con `NT`) con un contrato idéntico para el robot real, ni la medida separada de la coherencia con la controladora y de la fidelidad física de ese emulador; tampoco cuánta observabilidad permite una controladora que solo da su pose bajo petición (`WH`), lo que E1.0 tiene que medir.
- **Implicaciones.** A3 deja de apoyarse en "intercambiable sobre pub/sub multicliente" y en "emula la controladora" como idea propia; pasa a: modos definidos con Kritzinger, emulación de la semántica de la D/U-M1 como aplicación del concepto DTP, y separación medida coherencia/fidelidad física. Detalle en `huecos.md` §3 y `estado_del_arte.md` §5 y §8.
