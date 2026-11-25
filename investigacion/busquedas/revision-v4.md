# Línea de búsqueda: revision-v4 (quinta ronda dirigida tras la revisión v4)

Objetivo: fichar las medidas publicadas de la exactitud de controladoras emuladas que señala la revisión v4 (mayor 1 a): Płaczek y Piszczek (2018) y la nota de *Industrial Robot* (2006); la declaración de ABB solo como contraste. Comprobar JRobot y Denford Virtual Robot (mayor 1 b). Releer Mihali y Sobh (N4-2) e intentar de nuevo el texto de Crespo et al. (verificador, ronda 4). Límites: solo lo pedido; no se buscan más trabajos.

## Incidencias de acceso (2026-11-25)
- Las APIs bibliográficas siguen sin acceso; se usa WebSearch y WebFetch.
- jrobot.sourceforge.net no estaba en la lista permitida hasta que salió en una búsqueda. El código de JRobot solo está dentro de jrobot.zip; SourceForge no enlaza navegador de código y en este entorno no hay herramienta para descargar y descomprimir el zip. **El código no se ha leído.**
- El texto completo de crespo2015virtual sigue sin aparecer (ScienceDirect no sale en las búsquedas).
- La lectura de PDF es por extracción resumida; las citas se limitan a fragmentos que la herramienta devolvió entre comillas y se marcan [POR VERIFICAR literal] cuando no las ha comprobado el verificador.

## Búsquedas
| Fecha | Fuente | Cadena | Vistos | Seleccionados |
|---|---|---|---|---|
| 2026-11-25 | WebFetch (URL de la tarea) | PDF de Płaczek y Piszczek en BazTech (dos pasadas: metadatos y resultados; RRS/RCS, cifras, cita) | 1 | 1 (placzek2018testing) |
| 2026-11-25 | WebFetch (URL de la tarea) | Nota de *Industrial Robot* 33(1), 2006, en Emerald | 1 | 1 (industrialrobot2006csr, literatura gris) |
| 2026-11-25 | WebFetch (URL de la tarea) | Noticia de ABB sobre RobotStudio HyperReality | 1 | 0 (contraste dentro de la ficha industrialrobot2006csr; sin fecha ni autor; no va a refs.bib) |
| 2026-11-25 | WebFetch (URL de la tarea) | Página de JRobot en SourceForge y página de ficheros | 2 | pista (calderon2002jrobot) |
| 2026-11-25 | WebSearch | `JRobot Mitsubishi RVM1 java sourceforge` | 17 | web del proyecto y documentación (home, docs/index, needed, config, report.pdf) |
| 2026-11-25 | WebFetch | jrobot.sourceforge.net: home.htm, docs/index.htm, docs/config.htm, docs/needed.htm, docs/report.pdf | 5 | pista (calderon2002jrobot) |
| 2026-11-25 | WebFetch (URL de la tarea) | Foro de Denford, viewtopic.php?p=11748 | 1 | pista (denford2011vrrobot) |
| 2026-11-25 | WebSearch | `"Denford" "Virtual Robot" Mitsubishi RV-M1 software simulation` | 10 | 1 página más del mismo hilo (p=11746); ninguna documentación del producto |
| 2026-11-25 | WebFetch | Foro de Denford, viewtopic.php?p=11746 | 1 | pista (denford2011vrrobot) |
| 2026-11-25 | WebSearch | `Denford "VR Robotics" software robot arm simulation virtual reality CIM manual` | 10 | 0 (resultados ajenos) |
| 2026-11-25 | WebSearch | `Mihali Sobh "Effective Simulation and Control Approaches for Alleviating the Access to High-Cost Manipulators"` | 10 | PDF de la revista (jstem.org) |
| 2026-11-25 | WebFetch | PDF de mihali2005effective (jstem.org, download/1280/1127/3188) | 1 | relectura (nota en la ficha; N4-2) |
| 2026-11-25 | WebSearch | `"Virtual Reality Application for Simulation and Off-line Programming of the Mitsubishi Movemaster RV-M1 Robot" pdf` | 10 | 0 (sin copia del texto completo) |

## Seleccionados
- placzek2018testing — revisado por pares: trayectoria de Robcad con la herramienta RCS de la controladora KUKA frente a la del robot real medida con láser tracker, más ensayos ISO 9283. La comparación con la simulación es cualitativa, solo en figuras. Riesgo para A3-1 y A3-2.
- industrialrobot2006csr — nota de prensa técnica (non article): CimStation Robotics con RRS, a un 1,2 % de los tiempos de ciclo reales en una prueba en ABB; 3 % frente al 5 % "del sector". Literatura gris de fabricante.

## Pistas no citables
- calderon2002jrobot — JRobot (SourceForge, 2002, BSD/GPLv2): aplicación Java que envía órdenes al RV-M1 por serie o en remoto, con vista 3D "intended for simulation". En la documentación leída no se describe ni emulación de la controladora ni lectura del estado. Código no leído.
- denford2011vrrobot — Denford VR Robot: software comercial cerrado (con llave) que trabaja con el RV-M1 por RS-232; el foro no dice si emula la controladora ni si lee el estado.

## No fichados
- Rot (2023), trabajo de fin de grado de Liubliana (Visual Components frente a un Motoman HP20 real), señalado por el revisor: no se ha abierto en esta ronda. Se menciona en `huecos.md` §6 como pista no fichada.
- Malik (WSC 2025), URSim con Process Simulate sin cuantificar la discrepancia: no fichado (contraste opcional según el revisor).

## Resumen de la línea
- **Qué hay.** Medidas publicadas de la exactitud de controladoras emuladas, pero **parciales**: (1) cifras de tiempos de ciclo de fabricantes, sin protocolo (industrialrobot2006csr: 1,2 % en una prueba en ABB; ABB declara hoy ~99 % de correlación para su Virtual Controller); (2) una comparación revisada por pares de una trayectoria simulada con la herramienta RCS de la controladora frente al robot real medido con tracker, solo en figuras (placzek2018testing). Todas se refieren a emuladores que **reutilizan el software o el firmware del fabricante**. En el RV-M1 existe software abierto con vista 3D (JRobot, 2002) y un simulador comercial cerrado (Denford VR Robot); en lo leído ninguno emula la controladora ni lee su estado, pero el código de JRobot no se ha podido revisar.
- **Qué falta.** No se ha encontrado una medida con protocolo declarado (ajuste y evaluación separados, cobertura fijada, unidades físicas) de un emulador **reconstruido desde el manual** de una controladora sin software reutilizable, ni una descomposición del error en cinemática, tiempos y conducta. Tampoco que alguien separe la coherencia con la pose informada por la controladora de la fidelidad física (Płaczek compara la simulación directamente con la medida externa).
- **Implicaciones.** A3-1 deja de apoyarse en "no hay medida publicada" y pasa a "medida con protocolo declarado de un emulador reconstruido desde el manual, con descomposición del error". "Abierto" se retira como diferenciador (JRobot). E2a añade la descomposición, la cobertura de los conjuntos y el informe separado de interpolación y extrapolación. E2c fija el margen de exclusión (2 × periodo de sondeo) antes del ensayo. La introducción reconoce las medidas parciales con industrialrobot2006csr (como afirmación comercial) y placzek2018testing.
