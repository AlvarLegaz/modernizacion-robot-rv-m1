# Línea de búsqueda: gemelo-mqtt

Objetivo: estado del arte sobre gemelos digitales de manipuladores/robots industriales conectados por MQTT (y, como comparación, ROS/ROS 2 y OPC UA), con atención a: (a) gemelo y robot real con la misma interfaz de comandos; (b) validación de la fidelidad del gemelo; (c) latencia extremo a extremo en MQTT para control/teleoperación; (d) seguridad en la capa de comunicación (ACK, órdenes caducadas, watchdog, QoS, separación real/simulado).

Límites: manipuladores y robots industriales. Se excluyen gemelos de edificios, redes eléctricas y, salvo como contexto, robots móviles.

## Incidencias de las fuentes
- Las APIs de OpenAlex, Crossref (api.crossref.org), Semantic Scholar y arXiv **no respondían por la red de la sesión** (proxy de salida: HTTP 403) el 2026-11-25. OpenAlex tampoco por WebFetch (fuera de la lista permitida).
- Se usó el buscador web (WebSearch) y la lectura de páginas de editor (MDPI, Springer, IAARC), repositorios (par.nsf.gov, mediaTUM, vbn.aau.dk) y arXiv. Algunos registros de Crossref se pudieron leer por WebFetch cuando el buscador devolvía su URL.
- PMC (pmc.ncbi.nlm.nih.gov) devolvía una comprobación reCAPTCHA; se leyó la versión del editor MDPI en su lugar.

## Búsquedas
| Fecha | Fuente | Cadena | Vistos | Seleccionados |
|---|---|---|---|---|
| 2026-11-25 | OpenAlex API | `digital twin robotic arm MQTT` (+2 variantes) | 0 (API bloqueada) | 0 |
| 2026-11-25 | Crossref / Semantic Scholar / arXiv API | `mqtt` (prueba de acceso) | 0 (APIs bloqueadas) | 0 |
| 2026-11-25 | WebSearch | `digital twin robotic arm MQTT architecture latency` | 10 | 2 (bravoarrabal2025iort, singh2024unity), luu2025enhancing localizado |
| 2026-11-25 | WebSearch | `digital twin industrial robot MQTT synchronization position error validation` | 10 | 0 (yang 2025 Machines leído y descartado: TCP, compensación de error, no MQTT) |
| 2026-11-25 | WebSearch | `MQTT versus ROS 2 DDS latency robot control comparison` | 10 | 0 (zhang 2023 arXiv:2309.07496 leído y descartado: TurtleBot, robot móvil) |
| 2026-11-25 | WebSearch | `OPC UA digital twin industrial robot arm bidirectional real-time Unity` | 10 | 2 (chang2025construction, xiang2024development) |
| 2026-11-25 | WebSearch | `MQTT robotic arm digital twin open source education Unity ESP32` | 20 | 1 (hacesgarcia2024building); dosoftei 2023 y acker 2023 leídos y descartados (sin MQTT ni medidas) |
| 2026-11-25 | WebSearch | `MQTT QoS latency measurement industrial robot control end-to-end experimental evaluation` | 10 | 0 nuevos (confirma luu2025enhancing) |
| 2026-11-25 | WebSearch | `"Construction and Validation of a Digital Twin-Driven Virtual-Reality Fusion Control Platform for Industrial Robots"` | 10 | (resolución de chang2025construction) |
| 2026-11-25 | WebSearch | `legacy robot arm retrofit MQTT digital twin serial interface Industry 4.0` | 10 | 0 (pertenece a la línea de retrofit) |
| 2026-11-25 | WebSearch | `"digital twin" "MQTT" robot manipulator ... ROS bridge real robot simulated same interface` | 10 | 1 (liang2020bidirectional) |
| 2026-11-25 | WebSearch | `OPC UA versus MQTT robot digital twin latency comparison industrial manipulator` | 10 | 1 (profanter2019opcua); freitas 2024 (10.1007/978-3-031-61575-7_11) visto solo en metadatos, sin resumen → no usado |
| 2026-11-25 | WebSearch | `Construction Method of a Digital-Twin Simulation System for SCARA Robots Based on Modular Communication` | 10 | 1 (zhang2024construction) |
| 2026-11-25 | WebSearch | `robot teleoperation MQTT safety watchdog timeout stale command heartbeat manipulator` | 10 | 0 (patentes y foros, no revisados por pares) |
| 2026-11-25 | WebSearch | `digital twin robot arm MQTT Node-RED physical virtual synchronization experimental joint error` | 10 | 0 nuevos |
| 2026-11-25 | WebSearch | `OPC UA digital twin robot arm latency measured ms Sensors MDPI collaborative robot` | 10 | 0 (das 2022 arXiv:2209.12854 leído: sin MQTT ni venue; PMC inaccesible) |
| 2026-11-25 | WebSearch | `robot arm remote control MQTT broker round-trip latency measured cloud vs local Raspberry Pi` | 17 | 1 (bray2024latency) |
| 2026-11-25 | WebSearch | `digital twin industrial robot OPC UA MQTT architecture interchangeable virtual physical robot virtual commissioning same program` | 10 | 1 (ariascachero2023operational); ionescu 2025 Sensors 25(6) 1821 leído y descartado (OPC UA/PROFINET, resultados no accesibles) |
| 2026-11-25 | WebSearch | búsquedas de resolución de metadatos (DOI ISARC, ICAR, autores de luu2025enhancing) | ~30 | — |

Total aproximado de registros vistos: ≈200; leídos en resumen o texto: 19; seleccionados: 11.

Seguimiento de referencias: se siguió hacia delante el preprint de luu2025enhancing (Research Square, DOI 10.21203/rs.3.rs-3812859/v1) hasta su versión publicada en IJAMT. No se pudo hacer seguimiento sistemático de citas (APIs bloqueadas).

## Seleccionados
- **bravoarrabal2025iort** — UR3 teleoperado a 2300 km con MQTT+ROS y gemelo VEROSIM; latencia medida; las órdenes pasan primero por el gemelo y requieren confirmación humana para el robot real (a, c, d).
- **luu2025enhancing** — ABB IRB 1200 teleoperado por MQTT con TLS; latencia por nivel de QoS (0/1/2), escalado a 100 robots y pérdida de paquetes; QoS 1 recomendado (c, d).
- **singh2024unity** — ABB IRB 1200, gemelo Unity+ROS; latencia 77,67 ± 15,74 ms y exactitud articular en 3 × 8 h; referencia de método de validación (b, c).
- **chang2025construction** — FANUC M-20iD/35, gemelo bidireccional por TCP; error XYZ ≈ ±1 mm; detección de desincronización por umbral (b, d).
- **zhang2024construction** — SCARA con capa de comunicación modular: mismas órdenes para robot virtual y físico; retardo ≈74 ms y error 2–3,8 mm (a, b).
- **hacesgarcia2024building** — Marco multiusuario Unity-MATLAB que compara TCP, memoria compartida, Firebase y MQTT; control con propietario único (a, d; contexto docente).
- **liang2020bidirectional** — KUKA KR120 con puente MQTT a 250 Hz entre gemelo ROS/Gazebo y PLC del robot; error articular y algoritmo de comprobación de pose (a, b, d).
- **profanter2019opcua** — Comparación de RTT de OPC UA, ROS, DDS y MQTT en banco de pruebas (c, comparación de protocolos).
- **ariascachero2023operational** — UR5e controlado desde PLC virtual en edge 5G; MQTT vs. OPC UA en latencia de lazo cerrado y tiempo de ciclo (c, comparación).
- **bray2024latency** — Descomposición de latencia de telerrobótica (Baxter/ROS) en LAN, Wi-Fi, 4G y transatlántico (c, método).
- **xiang2024development** — Preprint; gemelo de ABB IRB120 por Robot Web Services con refresco ≈17 ms, evitando ROS/OPC UA (a, comparación de "pila ligera").

## Resumen de la línea

### Qué hay
1. **MQTT es habitual como capa de mensajería entre gemelo y robot**, pero casi siempre como *puente* hacia una pila ROS (liang2020bidirectional, bravoarrabal2025iort) o como canal de teleoperación en streaming (luu2025enhancing). Las comparaciones de protocolo muestran que el transporte en LAN es sub-milisegundo para todos (profanter2019opcua) y que MQTT es competitivo frente a OPC UA en latencia de lazo de control de un manipulador (2,5 ms vs. 10,1 ms en Ethernet con 2 B; ariascachero2023operational). En redes de área amplia y con broker en la nube las latencias de aplicación son de 60–240 ms (bray2024latency, bravoarrabal2025iort, luu2025enhancing).
2. **Validación de fidelidad**: se mide comparando estados articulares (singh2024unity; liang2020bidirectional) o el error del TCP en mm (chang2025construction ±1 mm; zhang2024construction 2–3,8 mm), y la latencia por marcas de tiempo de mensajes (singh2024unity 77,67 ms). No hay un protocolo común; algunas métricas son poco informativas (exactitud normalizada por 180° en singh2024unity; "refresco" en lugar de latencia en xiang2024development).
3. **Interfaz común gemelo/real**: aparece de forma parcial. zhang2024construction encapsula las mismas órdenes para virtual y físico (en sockets locales); bravoarrabal2025iort hace pasar las órdenes MQTT por el gemelo antes del robot real; liang2020bidirectional y chang2025construction comparan gemelo y robot y replanifican si divergen.
4. **Seguridad en la capa de comunicación**: lo encontrado es TLS + autenticación en el broker (luu2025enhancing), VPN (bray2024latency, bravoarrabal2025iort), permisos MQTT y confirmación humana (bravoarrabal2025iort), umbral de desincronización (liang2020bidirectional, chang2025construction) y propiedad única del robot (hacesgarcia2024building). El QoS se ha evaluado empíricamente solo en luu2025enhancing (QoS 1 recomendado).

### Qué falta
- **Ningún trabajo seleccionado define un contrato de mensajes explícito y publicado** en el que gemelo y robot real sean intercambiables solo cambiando el destino, con doble comprobación (topic + campo `destino`) para no mover el robot real por error.
- **No se encontraron mecanismos de rechazo de órdenes caducadas por marca de tiempo**, ACK de aplicación en dos fases (aceptado/hecho) ni uso de LWT/estado `online` en trabajos de manipuladores revisados por pares. luu2025enhancing observa el problema (ráfagas de mensajes retrasados) pero no lo resuelve por diseño. No se encontró literatura revisada por pares sobre watchdog en MQTT para manipuladores [la búsqueda dirigida solo devolvió patentes y foros].
- **Ningún trabajo aplica gemelo + MQTT a un robot legado con controladora original de interfaz serie** (todos usan robots con API de red: EGM, RWS, ROS, PLC, FRRJIF). El RV-M1 solo da estado bajo demanda (`WH`, `ER`), por lo que la sincronización ha de ser por eventos, caso no estudiado.
- Las medidas de latencia rara vez separan tramos (red, puente, controladora, movimiento) salvo bray2024latency, y casi nunca se informa de la sincronización de relojes.

### Implicaciones para nuestro artículo
- Posicionar la aportación no en "usar MQTT" ni en "tener gemelo", que ya existen, sino en **un contrato MQTT con seguridades explícitas (ACK en dos fases, `caducado` a 500 ms, `destino` doble, sin retain en comandos, LWT) que hace intercambiables gemelo y robot real sobre una controladora legada sin modificarla**.
- Medir la latencia **descompuesta por tramos** (cliente→broker→puente→RS-232→`ER`), siguiendo bray2024latency y singh2024unity, e informar del método de sincronización de relojes. Justificar QoS 1 con luu2025enhancing y comparar las cifras con ariascachero2023operational y profanter2019opcua.
- Reportar la fidelidad del gemelo **en unidades físicas** (mm del TCP y grados por articulación, comparando con `WH`), evitando métricas normalizadas como la de singh2024unity, y declarar el número de repeticiones.
- Discutir OPC UA y ROS como alternativas: más ricas semánticamente o en paquetes, pero más pesadas para un puente embebido (ESP32/RPi); la literatura no muestra ventaja de latencia que lo justifique para un robot cuyo tiempo dominante es el movimiento mecánico.
