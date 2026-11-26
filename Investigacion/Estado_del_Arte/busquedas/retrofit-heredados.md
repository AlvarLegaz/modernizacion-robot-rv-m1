# Línea de búsqueda: retrofit-heredados

**Objetivo:** estado del arte sobre la modernización (*retrofitting*) de robots y máquinas industriales heredadas para Industria 4.0 / IIoT: (a) enfoques no invasivos (se conserva la controladora y se añade una pasarela por RS-232 u otra interfaz existente) frente a sustitución de la controladora; (b) protocolos (MQTT, OPC UA, ROS); (c) métricas (latencia, disponibilidad, coste); (d) marcos o metodologías de retrofit.
**Límites:** se excluyen edificios y energía; foco en maquinaria y manipuladores industriales.
**Agente:** investigador · **Fecha:** 2026-11-25

## Incidencias de las fuentes
- APIs OpenAlex, Crossref y Semantic Scholar: **bloqueadas** (HTTP 403 del proxy de salida, tanto por `curl` como por WebFetch, por no estar en la *allowlist*). arXiv tampoco respondió por `curl`. Todo se hizo con WebSearch + WebFetch sobre las páginas de editores y repositorios.
- PMC (un artículo) y uvadoc.uva.es / katalog.lib.cas.cz devolvieron páginas anti-bot: esos trabajos no se pudieron leer y no se incluyen.
- **Colisión de claves con otras líneas paralelas:** las fichas `luu2025enhancing`, `swider2007system` y `foit2008web` ya las habían creado otros agentes justo antes y esta línea las sobrescribió (aviso añadido en cada ficha). `luu2025enhancing` está ya en `referencias/parciales/gemelo-mqtt.bib`, así que no se duplica en el `.bib` de esta línea.

## Búsquedas
| Fecha | Fuente | Cadena | Vistos | Seleccionados |
|---|---|---|---|---|
| 2026-11-25 | OpenAlex API | `retrofit legacy industrial robot`; `retrofitting legacy machine industry 4.0` | 0 (403) | 0 |
| 2026-11-25 | Crossref / Semantic Scholar / arXiv API | `retrofit` (prueba de acceso) | 0 (403/sin respuesta) | 0 |
| 2026-11-25 | WebSearch | `retrofitting legacy industrial robot Industry 4.0 IIoT gateway serial RS-232 MQTT` | 16 | 1 (kolla2022retrofitting) |
| 2026-11-25 | WebSearch | `"retrofitting" legacy machines IIoT systematic review machinery DOI` | 10 | 2 (alqoud2022industry, sanchezlondono2023smart) |
| 2026-11-25 | WebSearch | `legacy industrial robot arm retrofit MQTT digital twin serial controller paper` | 10 | 0 |
| 2026-11-25 | WebSearch | `retrofitting old industrial robot ROS legacy controller open source Industry 4.0 MDPI` | 10 | 2 (mendonca2025development; alasti, preprint arXiv:2102.12649) |
| 2026-11-25 | WebSearch | `Mitsubishi Movemaster RV-M1 retrofit OR modernization OR ROS paper` | 10 | 0 (todo ascensores/marketing) |
| 2026-11-25 | WebSearch | `legacy industrial robot OPC UA integration retrofit brownfield robot cell paper` | 10 | 0 (sain2026, preprint, descartado) |
| 2026-11-25 | WebSearch | `retrofit obsolete industrial robot controller replacement open architecture ROS 2 journal article` | 10 | 1 (alvares2018retrofitting) |
| 2026-11-25 | WebSearch | `low-cost retrofitting legacy machine tool IoT gateway Raspberry Pi MQTT Industry 4.0 case study journal` | 10 | 0 (vukovic2022, waters2022 descartados) |
| 2026-11-25 | WebSearch | `digital twin retrofit legacy robotic arm Industry 4.0 serial communication article 2023` | 10 | 0 |
| 2026-11-25 | WebSearch | `SCORBOT OR "old robot" retrofit IoT cloud remote laboratory Industry 4.0 paper` | 10 | 1 (alasti2021turning, versión ASEE) |
| 2026-11-25 | WebSearch | `"legacy" industrial robot ROS driver serial RS-232 integration Industry 4.0 IEEE conference` | 10 | 0 |
| 2026-11-25 | WebSearch | `retrofitting industrial robot MQTT latency measurement legacy controller gateway` | 10 | 2 (pontarolli2025analyzing, luu2025enhancing) |
| 2026-11-25 | WebSearch | `"OPC UA" "legacy robot" OR "older robot" information model integration Industry 4.0 Sensors MDPI` | 10 | 0 (martins2021 visto, descartado) |
| 2026-11-25 | WebSearch | `"An approach to integrating manufacturing data from legacy Injection Moulding Machines using OPC UA" DOI` | 10 | 1 (ogorodnyk2020towards) |
| 2026-11-25 | WebSearch | `"retrofitting" "industrial robot" legacy "Industry 4.0" connectivity non-invasive approach controller preserved` | 10 | 0 (PMC y UVa bloqueados) |
| 2026-11-25 | WebSearch | `brownfield industrial robot integration ROS bridge legacy controller vendor interface "retrofit" 2022 2023 2024` | 10 | 0 (ajdinovic2026, sin métricas, descartado) |
| 2026-11-25 | WebSearch | `Procedia CIRP retrofitting legacy robot Industry 4.0 OPC UA communication old robot controller` | 10 | 0 |
| 2026-11-25 | WebSearch | `Alqoud Schaefer Milisavljevic-Syed retrofitting decision-making framework legacy manufacturing 2023 OR 2024` (seguimiento hacia delante) | 10 | 0 (alqoud2025 autoevaluación, anotado) |
| 2026-11-25 | WebSearch | `retrofit PUMA OR KUKA OR "ABB IRB" old robot new controller open architecture Industry 4.0 sensors article` | 10 | 1 (bilancia2023overview) |
| 2026-11-25 | WebSearch | `legacy CNC machine RS-232 serial port IIoT data acquisition gateway MQTT OR MTConnect retrofit paper` | 10 | 0 (bocharov2025, sin DOI completo) |
| 2026-11-25 | WebSearch | `old educational robot arm serial interface Python MQTT remote control Industry 4.0 laboratory retrofit "RS-232"` | 10 | 0 (pekarcikova2025, mcdermott2023 fuera de foco) |
| 2026-11-25 | WebSearch | `"Movemaster" robot RS-232 control software paper journal` | 10 | 2 (swider2007system, foit2008web) |

Total aproximado visto: ~230 resultados; texto o resumen leído de ~22 trabajos; **12 seleccionados**.

## Seleccionados
- **alqoud2022industry** — revisión sistemática (32 trabajos) con taxonomía de tres enfoques (*starter kit*, *embedded gateway*, hardware IoT) y frecuencias de protocolos (OPC 75 %, Modbus 39 %, MQTT 25 %). Base de (a), (b) y (d).
- **sanchezlondono2023smart** — revisión PRISMA del *smart retrofitting* en mantenimiento; métricas de disponibilidad/fiabilidad (MTTF, MDT) y marcos (GFMAM, ISO 55000). Base de (c) y (d).
- **kolla2022retrofitting** — arquitectura de retrofit IIoT en cuatro capas con pasarela (Raspberry Pi, Node-RED, InfluxDB, Grafana) orientada a pymes; sin métricas. (a), (d).
- **mendonca2025development** — marco de retrofit en 5 pasos con gemelo digital RAMI 4.0 sobre Festo MPS; evaluación solo por madurez. (d).
- **bilancia2023overview** — revisión de enfoques de control de robots: *external coordinator* / *external trajectory generator* (se conserva la controladora) frente a *open controller* (sustitución). Clave para (a).
- **alvares2018retrofitting** — sustitución de la controladora de un ASEA IRB6-S2 por control CNC abierto (LinuxCNC) con metodología IDEF0. Contraejemplo invasivo para (a).
- **alasti2021turning** — retrofit IoT de un robot no colaborativo con fines docentes (nube, PLC por IP); sin medidas de latencia. (a).
- **luu2025enhancing** — teleoperación por MQTT de un ABB IRB1200 conservando la IRC5; latencias por QoS (≈95–160 ms), TLS. Referencia para (b) y (c). (Compartido con la línea gemelo-mqtt.)
- **pontarolli2025analyzing** — plataforma *edge* en paralelo a un PLC que gobierna un SCARA FANUC; RTT medio 5,9–7,2 ms, p95 9 ms, MQTT. (a), (b), (c).
- **ogorodnyk2020towards** — API no invasiva sobre la interfaz nativa (EMI) de una inyectora; frecuencia efectiva medida (~39,5 Hz frente a 100 Hz solicitados). Análogo metodológico para caracterizar el enlace RS-232. (a), (c).
- **swider2007system** — sistema de simulación, programación *off-line* y supervisión remota del **mismo robot RV-M1** por RS-232. Trabajo clave (anterior a 2018).
- **foit2008web** — interfaz web (HTTP/CGI) para programar el **RV-M1**. Trabajo clave (anterior a 2018).

### Vistos y descartados
- Mendonca et al. (2025), *Processes* 13(8) 2488, doi 10.3390/pr13082488 — línea de contadores eléctricos; no nombra protocolos ni conserva/sustituye controladora; redundante con mendonca2025development.
- Alqoud et al. (2022), ATDE 10.3233/ATDE220557 — versión corta de alqoud2022industry (duplicado).
- Alqoud, Milisavljevic-Syed y Salonitis (2025), IJIEM 16(3) 316–336, doi 10.24867/IJIEM-391 — modelo de autoevaluación organizativa; no técnico. Posible cita secundaria para (d).
- Vuković et al. (2022), *Appl. Sci.* 12(17) 8571, doi 10.3390/app12178571 — retrofit IIoT de brochadora con DMAIC; solo se vio el resumen y no aporta datos de controladora/protocolos. Candidato de reserva para (d).
- Waters et al. (2022), *Sensors* 22(8) 2972, doi 10.3390/s22082972 — no invasivo (lee el PLC sin modificarlo) pero se centra en el desperdicio de gas (energía), excluido por los límites.
- Martins et al. (2021), IMC37, hdl 10400.8/6444 — OPC UA/Euromap sobre inyectoras heredadas, sin DOI ni métricas.
- Sain et al. (2026), arXiv:2601.10929 — agregación OPC UA para conectar sistemas heredados inseguros; preprint sin revisión por pares. Útil si se trata la seguridad.
- Alasti, arXiv:2102.12649 — preprint relacionado con alasti2021turning; usado solo como apoyo dentro de esa ficha.
- Ajdinović et al. (2026), CEUR Vol-4243 — ROS 2 + TwinCAT CNC sin modificar la controladora del robot, pero sin resultados cuantitativos.
- Bocharov et al. (2025), EAI Endorsed Trans. — red OT con PLC S7 heredados; DOI truncado en la fuente.
- Pekarcikova et al. (2025), *Machines* 13(9) 753 — robot educativo moderno (Mirobot), no heredado.
- McDermott et al. (2023), arXiv:2311.08200 — instrumentos de laboratorio científico, fuera de foco.

## Resumen de la línea

### Qué hay
1. **Taxonomías consolidadas.** Para maquinaria en general, alqoud2022industry distingue *starter kits*, *embedded gateway* (que modifica el PLC y pone en riesgo el control) y soluciones de hardware IoT con pasarela, que son la mayoría (62,5 %). Para robots, bilancia2023overview separa los enfoques que conservan la controladora (*external coordinator*, *external trajectory generator*) del *open controller*, que la sustituye (p. ej. alvares2018retrofitting con LinuxCNC). Kolla et al. añaden la división *push* / *pull* (necesidad).
2. **Protocolos.** En los retrofits domina OPC/OPC UA, seguido de Modbus y Ethernet; MQTT aparece en una cuarta parte de los trabajos (alqoud2022industry). En robótica, MQTT se usa para teleoperación y *edge* (luu2025enhancing, pontarolli2025analyzing). En los trabajos de retrofit de esta línea ROS apenas aparece (solo en preprints o talleres descartados). Las interfaces serie como RS-232 solo aparecen en los trabajos del RV-M1 (swider2007system, foit2008web), que son anteriores a IIoT.
3. **Marcos metodológicos.** Hay cinco pasos con RAMI 4.0 y gemelo digital (mendonca2025development), IDEF0 en cinco pasos para robots (alvares2018retrofitting), DMAIC (Vuković, reserva), una arquitectura en cuatro capas (kolla2022retrofitting) y marcos de mantenimiento como GFMAM e ISO 55000 (sanchezlondono2023smart).
4. **Métricas.** Las revisiones y los marcos evalúan sobre todo con madurez cualitativa (RAMI/PIMM). Solo unos pocos trabajos miden prestaciones de comunicación: latencia por QoS de MQTT (≈95–160 ms extremo a extremo con un *broker* en LAN o WAN; luu2025enhancing), RTT en el *edge* (≈6–7 ms, p95 9 ms; pontarolli2025analyzing) y la frecuencia efectiva frente a la solicitada sobre la interfaz nativa (ogorodnyk2020towards).

### Qué falta
- No se ha encontrado ningún trabajo revisado por pares (2018 o posterior) que modernice **un manipulador industrial heredado conservando su controladora original y usando solo su puerto serie RS-232** como pasarela hacia un protocolo IIoT (MQTT u OPC UA).
- La **disponibilidad** (tiempo en servicio del puente, reconexión, MTTF/MDT) y el **coste** del retrofit casi nunca se cuantifican; las revisiones defienden el bajo coste solo de forma cualitativa.
- Las medidas de latencia publicadas corresponden a controladoras modernas con interfaces de tiempo real (EGM, PROFINET). No hay datos sobre el retardo que añaden un enlace serie lento y el intérprete de órdenes de una controladora de los años 80.
- Los trabajos previos sobre el RV-M1 (2007–2008) no usan protocolos estandarizados ni gemelo sincronizado, y no miden nada.
- La seguridad de la capa de comunicación se trata de pasada, salvo TLS en luu2025enhancing.

### Implicaciones para el artículo
- Situar la aportación como un retrofit de tipo **"hardware IoT con pasarela"** (taxonomía de Alqoud) y **"external coordinator"** (taxonomía de Bilancia). Se mantienen las seguridades y la planificación de la D/U-M1, que es lo que distingue el enfoque de los *open controller* como Alvares et al.
- Medir lo que falta en la literatura: la latencia extremo a extremo desglosada (MQTT, puente y RS-232 con la respuesta de la controladora), el *throughput* máximo de órdenes, la disponibilidad o robustez del puente y el coste de los materiales. Conviene usar como referencia la metodología de luu2025enhancing (QoS, pérdidas emuladas) y de pontarolli2025analyzing (percentiles, número de muestras, sincronización de relojes).
- Citar swider2007system y foit2008web como antecedentes directos sobre el mismo robot y diferenciarse de ellos por el uso de MQTT, el gemelo y la evaluación cuantitativa.
- Usar un marco metodológico explícito, como los cinco pasos de Mendonca o RAMI 4.0, para estructurar la sección de método.
