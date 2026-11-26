# Línea de búsqueda: educacion-gemelos

Objetivo: gemelos digitales y laboratorios remotos/virtuales de robótica industrial y automatización en la enseñanza (ingeniería y FP): (a) formación previa al robot real; (b) arquitecturas remotas IoT/MQTT; (c) evaluación del impacto docente; (d) reutilización de equipos antiguos. Línea secundaria: se priorizan trabajos con arquitectura técnica y evaluación.

Nota de fuentes: las APIs de OpenAlex, Crossref y Semantic Scholar **no respondieron** (WebFetch: URL fuera de la lista permitida; curl: proxy 403). Se usó WebSearch + WebFetch sobre páginas de editoriales, repositorios (PMC, IRIS PoliTo, BazTech, Mondragon, UNED, Portsmouth) y arXiv/DOAJ.

## Búsquedas
| Fecha | Fuente | Cadena | Vistos | Seleccionados |
|---|---|---|---|---|
| 2026-11-25 | OpenAlex API | `digital twin industrial robot education` (desde 2018) | 0 (no responde) | 0 |
| 2026-11-25 | OpenAlex API | `remote laboratory robot MQTT` (desde 2018) | 0 (no responde) | 0 |
| 2026-11-25 | Crossref API | `remote lab robot` | 0 (no responde) | 0 |
| 2026-11-25 | WebSearch | `digital twin industrial robot engineering education students evaluation survey` | 10 | 2 (erdei2022digital, antonelli2023virtual) |
| 2026-11-25 | WebSearch | `remote laboratory industrial robot MQTT IoT education architecture` | 10 | 1 (kumar2024scalable) |
| 2026-11-25 | WebSearch | `virtual commissioning digital twin robot cell training students before real robot safety` | 10 | 2 (kuts2019digital, azkarate2019virtual) |
| 2026-11-25 | WebSearch | `retrofitting old industrial robot for education laboratory low-cost controller students` | 10 | 1 (conchasanchez2020recycling) |
| 2026-11-25 | WebSearch | `digital twin robot arm remote laboratory Node-RED MQTT students evaluation journal` | 10 | 1 (ciungan2025enhancing) |
| 2026-11-25 | WebSearch | `Kaarlela digital twin virtual reality robotics education safety training 2023` | 10 | 1 (kaarlela2023digital) |
| 2026-11-25 | WebSearch | `"remote laboratory" industrial robot ABB OR KUKA OR Fanuc web students evaluation learning outcomes journal 2021 OR 2022 OR 2023` | 10 | 1 (pang2022remote) |
| 2026-11-25 | WebSearch (es) | `gemelo digital robot industrial formación profesional docencia laboratorio virtual` | 10 | 0 (Jornadas de Automática UDC no accesible; resto sin arquitectura+evaluación verificable) |
| 2026-11-25 | WebSearch (adelante) | `"Scalable and low-cost remote lab platforms" Kumar ICSR 2024 Springer DOI` | 10 | 0 (encontrado Kandala et al. 2025, descartado) |

## Descartados relevantes (con motivo)
- Anhelo, Robles Gómez, Martín Gutiérrez (2023), *Internet of Things Remote Laboratory for MQTT remote experimentation* (UNED, https://hdl.handle.net/20.500.14468/12932): arquitectura MQTT/Mosquitto/Node-RED con NodeMCU, pero sin robot y sin evaluación visible; sin DOI en el registro.
- Kandala et al. (2025), *Engineering End-to-End Remote Labs Using IoT-Based Retrofitting*, IEEE Access 13, 1106–1132, doi:10.1109/ACCESS.2024.3523066: buen ejemplo de laboratorio remoto por retrofit IoT con evaluación (coste, latencia de vídeo 200–400 ms, disponibilidad 84 %, 45 alumnos), pero son experimentos de física, no manipuladores. Puede citarse si se amplía el alcance.
- Brunn y Labib (2005), *"New lamps for old!"*, Int. J. Mech. Eng. Education 33(4), 339–348 (rejuvenecer un ASEA IRB6 sustituyendo la controladora): tema clave para (d), pero sin DOI confirmado en la página y solo resumen; [POR VERIFICAR] si se quiere incluir.
- Estudio con Braccio en laboratorio remoto (Smart Learning Environments, doi 10.1186/s40561-024-00305-w): no se pudo confirmar título ni autores (página sin metadatos); brazo no industrial.

## Seleccionados
- kuts2019digital — gemelo VR sincronizado con robot industrial real (Yaskawa GP8) y prevención de colisiones; uso en laboratorio docente/demostración.
- azkarate2019virtual — puesta en marcha virtual de una celda robótica como caso docente (solo resumen).
- conchasanchez2020recycling — reciclaje de un manipulador educativo antiguo (ED7220C) con controladora abierta de bajo coste; línea (d).
- erdei2022digital — centro de formación con gemelo y teach pendant virtual (KUKA KR5); compara grupo con gemelo frente a tradicional en el robot real.
- pang2022remote — laboratorio remoto con gemelo sincronizado por OPC UA (ABB IRB120); encuesta a 64 alumnos.
- kaarlela2023digital — gemelos XR bidireccionales por MQTT/OPC UA para formación y formación en seguridad (UR, Fanuc, ABB).
- antonelli2023virtual — laboratorio VR blended con gemelo sincronizado por MQTT y evaluación pre/post con 70 alumnos.
- kumar2024scalable — laboratorio remoto ROS/ROS 2 con UR5 a gran escala (>2700 alumnos), simulación previa en Gazebo, latencia y seguridad de acceso.
- ciungan2025enhancing — brazo didáctico con Raspberry Pi pasarela serie↔MQTT (TLS) y VR; 31 alumnos, estadística inferencial.

## Resumen de la línea

**Qué hay.**
- (a) Formar con el gemelo antes del robot real está bien asentado: teach pendant virtual (erdei2022digital), validar trayectorias en el gemelo antes de enviarlas (kaarlela2023digital), simulación previa en Gazebo (kumar2024scalable), puesta en marcha virtual (azkarate2019virtual) y seguridad anticolisión con el gemelo (kuts2019digital). El argumento de seguridad/disponibilidad se repite: la celda física admite pocos alumnos a la vez (~8 en erdei2022digital).
- (b) MQTT aparece como protocolo de sincronización gemelo↔equipo en antonelli2023virtual, kaarlela2023digital (con puente OPC UA→MQTT) y ciungan2025enhancing (Raspberry Pi como pasarela serie↔MQTT con TLS). Las demás usan OPC UA (pang2022remote), ROS/VPN (kumar2024scalable) o API propietaria (kuts2019digital).
- (c) La evaluación docente suele ser débil: satisfacción autodeclarada con Likert (pang2022remote, >80 % satisfechos; ciungan2025enhancing), muestras pequeñas (10 en erdei2022digital, 31 en ciungan2025enhancing) o métricas de participación sin medir aprendizaje (kumar2024scalable). El estudio más riguroso (antonelli2023virtual, 70 alumnos, pre/post) **no encontró ganancias significativas de conocimiento**, aunque sí motivación y utilidad percibida.
- (d) La reutilización de robots antiguos en docencia existe (conchasanchez2020recycling; Brunn y Labib 2005, descartado por verificar), pero **sustituyendo la controladora original**.

**Qué falta.**
- Ningún trabajo encontrado combina un **robot industrial heredado con su controladora original** (sin modificarla), un puente serie→MQTT y un gemelo sincronizado para docencia. Los gemelos educativos se construyen sobre robots modernos con OPC UA, ROS o API de red.
- Casi ningún trabajo informa de latencia de la capa gemelo↔robot o de seguridad en la comunicación (excepciones: kumar2024scalable con ~300 ms y VPN; ciungan2025enhancing con TLS, sin latencia medida).
- No se encontraron trabajos centrados en FP (formación profesional); todos son universitarios o de formación de operarios.

**Implicaciones para el artículo.**
1. La novedad no está en "gemelo para docencia" (muy cubierto), sino en llevarlo a un **equipo heredado de forma no invasiva**; esto debe ser el eje de los trabajos relacionados de esta línea, citando conchasanchez2020recycling como contraste (retrofit invasivo).
2. kaarlela2023digital y antonelli2023virtual son las referencias de arquitectura más cercanas (MQTT); conviene comparar explícitamente nuestro puente RS-232→MQTT con su puente OPC UA→MQTT y reportar latencia y seguridad, que ellos no miden.
3. Si se incluye evaluación docente, el diseño de erdei2022digital (grupo gemelo vs. tradicional, tiempo de tarea en el robot real) es replicable en el aula de FP, pero hay que anticipar el resultado de antonelli2023virtual: los cuestionarios de satisfacción no bastan y las ganancias de aprendizaje pueden no ser significativas con intervenciones cortas. Dado que el artículo es técnico, basta con mencionarlo como uso y trabajo futuro.
