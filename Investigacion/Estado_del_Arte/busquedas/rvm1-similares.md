# Línea de búsqueda: rvm1-similares

Objetivo: trabajos previos de modernización, nuevos controladores, gemelos o simuladores sobre el Mitsubishi Movemaster RV-M1 y robots didácticos/industriales antiguos comparables (RV-M2, RV-2AJ, Scorbot, PUMA 560, Rhino, ED-7220…). Qué hicieron, con qué tecnología, si miden algo y si tienen uso educativo.

## Incidencias de acceso (25/11/2026)
- Las APIs de OpenAlex, Crossref y Semantic Scholar **no respondieron** con consulta de búsqueda directa (no están en la allowlist ni desde Bash ni desde WebFetch). Solo se pudieron abrir registros concretos de OpenAlex/Crossref por DOI cuando aparecían como resultado del buscador web (p. ej. DOI 10.1109/ROBIO.2004.1521883).
- La URL HTML de Revista Espacios no se pudo abrir directamente; se leyó el PDF del mismo artículo localizado por el buscador.
- El PDF de TEINCO (enlazado en `docu/referencias.md`) se pudo leer completo tras localizarlo con el buscador.
- ResearchGate y Scribd no devolvieron contenido.

## Búsquedas
| Fecha | Fuente | Cadena | Vistos | Seleccionados |
|---|---|---|---|---|
| 2026-11-25 | OpenAlex / Crossref / Semantic Scholar API | `RV-M1 robot`, `Movemaster RV-M1` | 0 (sin acceso) | 0 |
| 2026-11-25 | WebSearch | `Revista Espacios 2018 robot Mitsubishi RV-M1 dSPACE arquitectura abierta repotenciación` | 10 | 0 (sin el artículo) |
| 2026-11-25 | WebSearch | `TEINCO caracterización de alternativas para la repotenciación de un brazo robótico Mitsubishi RV-M1` | 10 | 0 |
| 2026-11-25 | WebSearch (extendida) | `"RV-M1" Mitsubishi robot retrofit controller` | 9 | 2 (roldan2018enhancing; pista a swider2007system) |
| 2026-11-25 | WebSearch | `"Movemaster" robot new controller open architecture` | 10 | 0 |
| 2026-11-25 | WebSearch | `revistaespacios.com a18v39n35 robot` | 19 | 0 |
| 2026-11-25 | Bibliografía de roldan2018enhancing (hacia atrás) | 8 refs RV-M1 + 4 de controladores abiertos | 12 | — (pistas) |
| 2026-11-25 | WebSearch | `Kumar Kalra Prakash "A virtual RV-M1 robot system" Robotics and Computer-Integrated Manufacturing` | 10 | 0 (no localizado) |
| 2026-11-25 | WebSearch + Crossref/OpenAlex por DOI | `Pan Huang 2004 "Implementation of a PC-based robot controller with open architecture" Movemaster` | 10 | 1 (pan2004pcbased) |
| 2026-11-25 | WebSearch | `Barraza "Modelado dinámico del manipulador serial Mitsubishi Movemaster RV-M1 usando SolidWorks" UIS Ingenierías` | 10 | 1 (barraza2016modelado) |
| 2026-11-25 | WebSearch | `"AR-Based Off-Line Programming of the RV-M1 Robot" Applied Mechanics and Materials authors` | 10 | 0 (sin autores ni DOI visibles) |
| 2026-11-25 | WebSearch (extendida) | `Scorbot ER retrofit new controller open architecture ROS Arduino` | 10 | 0 (ya registrado conchasanchez2020recycling por otra línea; resto no revisados por pares) |
| 2026-11-25 | WebSearch (extendida) | `PUMA 560 retrofit open controller ROS educational` | 9 | 1 (jokic2020two) |
| 2026-11-25 | WebSearch | `Scorbot ER-4u modernization ROS controller replacement paper` | 10 | 1 (campos2019diseno) |
| 2026-11-25 | WebSearch | `Mitsubishi RV-2AJ ROS driver digital twin educational` | 10 | 1 (patrao2025understanding) |
| 2026-11-25 | WebSearch | `Rhino XR robot retrofit new controller` | 16 | 0 (solo tesis antigua de Illinois sin revisar y páginas comerciales) |
| 2026-11-25 | WebSearch (extendida) | `"RV-M1" robot Arduino OR "Raspberry Pi" OR ROS control 2020` | 10 | 0 (ruido) |
| 2026-11-25 | WebSearch | `investigacion.teinco.edu.co repotenciación brazo robótico Mitsubishi` | 10 | 0 |
| 2026-11-25 | WebSearch (extendida) | `"repotenciación" "RV-M1" Mitsubishi brazo robótico` | 9 | 2 (ruiz2022caracterizacion; castillo2020propuesta vía libro TEINCO) |
| 2026-11-25 | WebSearch | `Herrera Aponte simulador de un brazo robótico Mitsubishi RV-M1 tesis TecNM` | 10 | 1 (herrera2018simulador) |
| 2026-11-25 | WebSearch | `Foit 2008 "Remote programming of the Mitsubishi Movemaster robot by using the web-based interface"` | 16 | 2 (foit2008web, swider2007system) |
| 2026-11-25 | WebSearch (extendida) | `retrofit legacy educational robot arm open architecture controller Sensors OR Electronics OR "Applied Sciences" 2021 2022 2023` | 9 | 0 (capítulo ED-7220 sin datos bibliográficos; ver abajo) |
| 2026-11-25 | WebSearch | `Scorbot ER-III ROS-Industrial operation package conference paper 2017` | 10 | 0 (no accesible) |
| 2026-11-25 | WebSearch | `"A virtual RV-M1 robot system" sciencedirect` | 10 | 1 (mihali2005effective, vía versión IETA 2001 en CORE) |
| 2026-11-25 | WebSearch | `"Cascade Control of the PUMA 560 Motors using Simulink and Arduino"` | 10 | 0 |
| 2026-11-25 | WebSearch | `Mitsubishi "RV-M2" OR "Movemaster EX" robot control PC interface paper` | 10 | 0 |
| 2026-11-25 | WebSearch | `Mihali Sobh "Ergonomic and Efficient Software Alternatives for High Cost Manipulators" IEEE` | 10 | (confirma mihali2005effective, J. STEM Educ.) |
| 2026-11-25 | WebSearch (extendida) | `Scorbot retrofit open-source controller journal article ROS MoveIt educational robot legacy` | 10 | 0 |

## Seleccionados (12 fichas nuevas + 1 compartida)
- roldan2018enhancing — sustitución de la D/U-M1 por dSPACE DS1103 + servoamplificadores propios; PD con compensación de gravedad; error en régimen 0,3 mm; uso docente. Antecedente más directo.
- ruiz2022caracterizacion — (TEINCO, no revisado por pares) comparación de microcontroladores y drivers para repotenciar un RV-M1 inoperativo; elige Arduino Mega; incluido a petición expresa como punto de partida.
- castillo2020propuesta — (capítulo de libro institucional TEINCO) diagnóstico de un RV-M1 deteriorado y propuesta de sustitución por servos Yaskawa.
- barraza2016modelado — parámetros dinámicos del RV-M1 desde CAD; solo simulación.
- swider2007system — simulación, programación fuera de línea y remota del RV-M1 por RS-232 + TCP/IP, controladora original; uso docente; sin medidas.
- foit2008web — interfaz web (CGI) para programar el RV-M1 a distancia; prototipo sin medidas.
- mihali2005effective — simulador OpenGL sincronizado con el RV-M1 real por puerto serie, red TCP/IP y móvil; controladora original; uso docente; sin medidas. Antecedente más cercano a nuestra propuesta.
- pan2004pcbased — controlador de PC abierto con CORBA aplicado a un Movemaster-EX (solo resumen).
- herrera2018simulador — tesis de máster: simulador cinemático MATLAB del RV-M1 sin conexión al robot.
- jokic2020two — PUMA 560: dos controladores abiertos (PC/MATLAB y FPGA), con errores medidos y costes; solo eje 1.
- patrao2025understanding — Mitsubishi RV-2AJ con controladora original y RS-232, viabilidad de integrarlo en un gemelo digital de FMS heredado; no implementado.
- campos2019diseno — SCORBOT ER-4U sin su controladora: Raspberry Pi + Python, control cinemático DH, VNC.
- conchasanchez2020recycling (ficha y BibTeX ya creados por la línea `educacion-gemelos`; no se duplican) — ED7220C con Arduino Mega + MATLAB/Simulink, sustitución de controladora, uso docente.

## Descartados / no fichados
- Kumar, Kalra y Prakash (2011), "A virtual RV-M1 robot system", Robotics and Computer-Integrated Manufacturing 27 (citado por roldan2018enhancing): no se pudo ver ni el resumen ni el DOI [POR VERIFICAR]. Debería buscarse en una segunda ronda.
- Świder et al. (2007), "The off-line programming and simulation software for the Mitsubishi Movemaster RV-M1 robot", JAMME 20(1–2), 499–502: PDF localizado (https://delibra.bg.polsl.pl//Content/38967/BCPS_40662_-_The-off-line-program_0000.pdf) pero no leído; precursor de swider2007system.
- "AR-Based Off-Line Programming of the RV-M1 Robot", Applied Mechanics and Materials 162, 344–351 (2012), https://www.scientific.net/AMM.162.344: se leyó el resumen (programación fuera de línea con realidad aumentada y equipo de bajo coste), pero la página no muestra autores ni DOI. Candidato si se completan los metadatos [POR VERIFICAR].
- Roldán-Mckinley et al. (2012), cinemática inversa del RV-M1 (Revista Épsilon 19): no localizado.
- Santos et al., "Retrofitting of A Robot Arm Controller" (ED-7220, Raspberry Pi 3, CEFET-MG), capítulo de libro: se leyó, pero faltan editorial, año, ISBN y DOI en la página; no se ficha.
- Farooq et al. (2007) y Costescu et al. (1998), retrofit de PUMA: solo citados en roldan2018enhancing, no leídos.
- PUMA 560 "Hardware retrofit and computed torque control" e "An Educational Framework for Remote Control of a PUMA Robot" (ResearchGate): no se pudo acceder al contenido.
- No revisados por pares (solo para el resumen): Hackaday "Reviving and reverse engineering an old robot arm" (ingeniería inversa de la D/U-M1, firmware Z80); repositorios de GitHub de Scorbot con Arduino (steveturbek/scorbot_controller, amiravni/Scorbot); Hackster "Scorbot ER-V+ Controller & Simulator"; Hackaday "Reviving Scorbot"; noticia de ROS-Industrial "Teaching an Old Robot New Tricks" (2022); librería .NET Springwald/Movemaster-RV-M1-Library (RS-232); vídeo de YouTube "Mitsubishi Movemaster RV-M1 USB" (no se pudo abrir).

## Resumen de la línea

**Qué hay.** La literatura sobre el RV-M1 y robots didácticos comparables va por dos caminos:
1. **Sustituir la controladora** (invasivo): dSPACE + amplificadores propios en el RV-M1 (roldan2018enhancing), Arduino/microcontroladores (ruiz2022caracterizacion, conchasanchez2020recycling), Raspberry Pi (campos2019diseno), PC/MATLAB o FPGA en el PUMA 560 (jokic2020two), servos industriales nuevos (castillo2020propuesta), controlador de PC con CORBA en un Movemaster-EX (pan2004pcbased). Casi siempre la motivación es que la controladora original está averiada o es cerrada, y el objetivo es enseñar control de bajo nivel. Solo jokic2020two y roldan2018enhancing aportan medidas de error, en pocas pruebas y sin estadística.
2. **Conservar la controladora original y añadir software** (no invasivo): simulación, programación fuera de línea y remota sobre RS-232 (swider2007system, foit2008web, mihali2005effective) y, recientemente, estudio de viabilidad para meter un RV-2AJ en un gemelo digital (patrao2025understanding). Hay también simuladores y modelos aislados del RV-M1 (herrera2018simulador, barraza2016modelado). Ninguno de ellos aporta medidas cuantitativas.

Casi todos tienen uso educativo declarado. Las tecnologías de los trabajos no invasivos son de 2001–2008 (Visual Basic, CGI, TCP/IP propio, Windows).

**Qué falta (huecos):**
- No se ha encontrado ningún trabajo sobre el RV-M1 (ni sobre RV-M2, RV-2AJ o Scorbot) que use **MQTT u otro protocolo IIoT estándar** (OPC UA, ROS) manteniendo la controladora original.
- Ningún trabajo no invasivo **mide** nada: latencia de extremo a extremo, fiabilidad del enlace RS-232, repetibilidad con el robot real, discrepancia entre gemelo y robot. Los dos trabajos con medidas sustituyen la controladora.
- No hay un **gemelo digital sincronizado bidireccional** del RV-M1 alimentado con el estado leído de la D/U-M1; el más cercano (mihali2005effective, 2005) es un simulador sincronizado sin evaluar, y patrao2025understanding deja la realimentación como trabajo futuro.
- No se ha visto ninguno que trate la **seguridad en la capa de comunicación** ni seguridades de operación remota (pendant de software con bloqueos).
- No se ha encontrado software abierto y reproducible con evaluación publicada (solo hay repositorios no revisados por pares).

**Implicaciones para el artículo.**
- Los antecedentes directos a citar y frente a los que posicionarse son mihali2005effective y swider2007system (misma idea no invasiva, sin medidas y con tecnología obsoleta) y roldan2018enhancing (mismo robot, enfoque invasivo).
- La novedad defendible es: modernización no invasiva del RV-M1 con Python + MQTT + gemelo, **caracterizada cuantitativamente** sobre el robot real, en contexto de FP; alternativa de coste casi nulo frente a sustituir la controladora (dSPACE, FPGA, servos nuevos).
- patrao2025understanding muestra que el problema sigue abierto en 2025 para robots Mitsubishi antiguos, lo que respalda la actualidad del enfoque.
- Pendiente para una segunda ronda: localizar Kumar et al. (2011) y completar los metadatos del artículo de AR de 2012.
