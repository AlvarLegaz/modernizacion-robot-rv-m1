# Línea de búsqueda: revision-v1 (segunda ronda dirigida tras la revisión v1)

Objetivo: localizar, leer y fichar los trabajos y normas que la revisión v1 (`revisiones/revision_estado_arte_v1.md`, mayores 1, 2, 5 y 7) señala como ausentes, y releer chang2025construction. Límites: solo lo que pide la revisión; no es una ampliación general del estado del arte.

## Incidencias de acceso (2026-11-25)
- Las APIs de Crossref y OpenAlex siguen fuera de la lista permitida de WebFetch (`URL_NOT_ON_ALLOWLIST`). Solo se pueden abrir URL que aparezcan en resultados de WebSearch.
- No se pudieron abrir: peer.asee.org (error del sitio; se leyó el PDF en nemo.asee.org), bohrium.com (WAF), ScienceDirect de Kumar 2011 y de un trabajo de VR sobre el RV-M1 (error del sitio), ResearchGate, dokumen.tips, iso.org (se usó committee.iso.org), el PDF de la especificación Sparkplug en eclipse.org (redirige a la página del proyecto) y la vista previa de VDE de ISO/IEC 20237 (fuera de la lista).
- PMC de chang2025construction redirige a un dominio fuera de la lista; se leyó en mdpi.com.

## Búsquedas
| Fecha | Fuente | Cadena | Vistos | Seleccionados |
|---|---|---|---|---|
| 2026-11-25 | WebSearch | `Kutzer Donnal Wick ScorBot Toolbox MATLAB open-source hardware interaction simulation library ASEE 2023` | 10 | 1 (kutzer2023scorbot) |
| 2026-11-25 | WebSearch | `"ScorBot Toolbox for MATLAB" ASEE 2023 10.18260` | 10 | 0 (DOI no localizado) |
| 2026-11-25 | WebSearch | `Holmes Katavich Xu Retrofitting legacy systems for industry 4.0 via OPC UA and distributed control Manufacturing Letters` | 10 | 1 (holmes2025retrofitting; leído en ScienceDirect con la URL de la revisión) |
| 2026-11-25 | WebSearch | `"A virtual RV-M1 robot system" Kumar Kalra Prakash Robotics and Computer-Integrated Manufacturing 2011` | 10 | 0 |
| 2026-11-25 | WebSearch (extendida) | `Kumar Kalra Prakash 2011 "virtual RV-M1" robot simulation doi 10.1016/j.rcim` | 10 | 1 (localizado en ScienceDirect, no abre) |
| 2026-11-25 | WebSearch (extendida) | `"A virtual RV-M1 robot system" abstract` | 9 | 1 (kumar2011virtual; texto completo en academia.edu) |
| 2026-11-25 | WebSearch | `augmented reality RV-M1 robot off-line programming Applied Mechanics and Materials 162 2012` | 10 | 0 (resumen leído; sin autores) |
| 2026-11-25 | WebSearch | `"AR-Based Off-Line Programming of the RV-M1 Robot" authors` | 10 | 0 |
| 2026-11-25 | WebSearch (extendida) | `"RV-M1" augmented reality off-line programming Pai Yeh Ong Nee 2012` | 10 | 0 (aparece Pai et al. 2015, sobre otro robot; no se ficha) |
| 2026-11-25 | WebSearch | `"Off-Line Programming of the RV-M1 Robot" augmented reality Applied Mechanics and Materials 10.4028` | 10 | 0 |
| 2026-11-25 | Crossref API (búsqueda) | `AR-Based Off-Line Programming of the RV-M1 Robot`; `A virtual RV-M1 robot system` | 0 (sin acceso) | 0 |
| 2026-11-25 | WebSearch | `Chang Sun Chen Xu 2025 Sensors digital twin-driven virtual-reality fusion control platform industrial robots FANUC delay data loss` | 10 | relectura de chang2025construction |
| 2026-11-25 | WebSearch | `Virtual Reality Application Simulation Off-line Programming Mitsubishi Movemaster RV-M1 Oculus Rift Procedia Computer Science 2015` | 10 | 0 (no se pudo abrir; ver abajo) |
| 2026-11-25 | WebSearch | `OASIS MQTT Version 3.1.1 OASIS Standard 29 October 2014 docs.oasis-open.org` | 19 | 1 (oasis2014mqtt) |
| 2026-11-25 | WebSearch | `docs.oasis-open.org mqtt-v3.1.1-os.html Will Message QoS 1 at least once delivery` | 17 | (confirmación) |
| 2026-11-25 | WebSearch | `OASIS MQTT Version 5.0 OASIS Standard 07 March 2019 Message Expiry Interval` | 18 | 1 (oasis2019mqtt) |
| 2026-11-25 | WebSearch | `ISO/IEC 20237:2023 Sparkplug specification iso.org` | 10 | 1 (iso2023sparkplug) |
| 2026-11-25 | WebSearch | `Eclipse Sparkplug specification version 3.0 NDEATH Will message bdSeq sequence number sparkplug.eclipse.org` | 17 | (documentación secundaria: Eclipse Kura) |
| 2026-11-25 | WebSearch | `Sparkplug 3.0.0 specification NDEATH "Will Message" NBIRTH bdSeq "seq" 0 to 255 edge node` | 19 | 0 |
| 2026-11-25 | WebSearch | `ISO 9283:1998 Manipulating industrial robots performance criteria and related test methods iso.org` | 10 | 1 (iso1998manipulating) |
| 2026-11-25 | WebSearch | `ISO 10218-1:2025 Robotics safety requirements Part 1 industrial robots iso.org` | 10 | 1 (iso2025robotics) |

## Seleccionados
- kutzer2023scorbot — SCORBOT-ER 4u con su controladora; simulación con la misma sintaxis que el hardware; código abierto; curso remoto en 2020. Antecedente de intercambiabilidad simulador/robot (revisión v1, mayor 1).
- holmes2025retrofitting — dos KUKA con KRC2 conservadas (sin RSI) integradas con Raspberry Pi, OPC XML-DA y OPC UA; fallos de pick/place y tiempo perdido medidos. Antecedente más próximo de H1 (mayor 7).
- kumar2011virtual — modelo virtual del RV-M1 en MATLAB sin conexión al robot; deja la interfaz común como trabajo futuro (segunda ronda pendiente).
- oasis2014mqtt, oasis2019mqtt — LWT, QoS 1 con duplicados, retain, *Message Expiry Interval* (mayor 2).
- iso2023sparkplug — certificados de muerte por LWT y secuencia de nacimiento/muerte (mayor 2). Texto normativo no leído.
- iso1998manipulating — norma de prestaciones de robots; solo para acotar lo que no se afirma (mayor 5). Texto no leído.
- iso2025robotics — seguridad de robots industriales; solo para la frase de cautela sobre la habilitación (menor 11). Texto no leído.

## Descartados / no fichados
- "AR-Based Off-Line Programming of the RV-M1 Robot", Applied Mechanics and Materials 162, 344–351 (Trans Tech, en línea desde marzo de 2012), https://www.scientific.net/AMM.162.344. Se leyó el resumen (prototipo de programación fuera de línea del RV-M1 con realidad aumentada y equipo barato, con manipulación y pick-and-place en la escena), pero **ni la página del artículo ni la del volumen muestran autores ni DOI**, y Crossref no es accesible. Sin autores no se puede crear la entrada (no se completan campos de memoria). Queda [POR VERIFICAR]; no compromete la novedad (programación fuera de línea, sin enlace a la controladora descrito en el resumen).
- "Virtual Reality Application for Simulation and Off-line Programming of the Mitsubishi Movemaster RV-M1 Robot Integrated with the Oculus Rift to Improve Students Training", Procedia Computer Science (ScienceDirect S187705091503687X): localizado por título; la página no se pudo abrir. Sin leer, no se usa. **Candidato para la próxima ronda**: es otro simulador docente del RV-M1 y conviene comprobar si se conecta al robot.
- Kandala et al. (2025, IEEE Access) y Brunn y Labib (2005): no buscados en esta ronda (la tarea priorizaba los cuatro trabajos citados y las normas). Siguen pendientes.
- Pai, Yap y Singh (2015), RA para programar una celda robótica: no es el RV-M1 según el título; no se abre.

## Resumen de la línea
- **Qué hay.** (1) La intercambiabilidad simulador/robot con la misma interfaz existe en robots didácticos heredados con su controladora: el SCORBOT-ER 4u con la ScorBot Toolbox (local, MATLAB, código abierto) y el propio RV-M1 en 2005 (mihali2005effective, elección al conectar). Kumar et al. (2011) la dejan como trabajo futuro para el RV-M1. (2) Hay retrofit no invasivo de manipuladores industriales heredados con protocolo IIoT estándar y una Raspberry Pi (KUKA KRC2 con OPC UA, holmes2025retrofitting), pero sobre controladoras con interfaz de red. (3) LWT, QoS 1 con duplicados, retain y caducidad en el broker son funciones de MQTT 3.1.1/5.0, y Sparkplug normaliza la detección de muerte de nodos.
- **Qué falta.** Sigue sin encontrarse un manipulador cuya única interfaz sea serie, con la controladora original, conectado a un protocolo IIoT estándar y caracterizado con medidas; y un gemelo que emule la controladora, comparta el contrato de órdenes en un bus pub/sub multicliente y se sincronice por eventos con una controladora que solo informa bajo petición, con fidelidad medida en unidades físicas.
- **Implicaciones.** A2 se reformula como adaptación verificada de mecanismos conocidos; A4 se limita a lo que no tienen mihali2005effective ni kutzer2023scorbot; H1 pasa a decir "controladoras con interfaz de red, aunque sean heredadas". Detalle en `huecos.md` y `estado_del_arte.md`.
