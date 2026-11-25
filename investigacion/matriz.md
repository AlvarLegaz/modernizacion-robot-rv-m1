# Matriz comparativa del estado del arte

Versión 2 (2026-11-25), en respuesta a `revisiones/revision_estado_arte_v1.md` y a `revisiones/verificacion_referencias.md`. Síntesis de 44 fichas de trabajos de `investigacion/fichas/` (líneas retrofit-heredados, gemelo-mqtt, rvm1-similares, educacion-gemelos y revision-v1) y de 5 normas de referencia, que van en una tabla aparte.

**Estado de las referencias:** las 41 entradas previas están verificadas o corregidas. Las 8 añadidas en la v2 (kutzer2023scorbot, holmes2025retrofitting, kumar2011virtual y las 5 normas) tienen `verificacion: pendiente`. Los valores proceden solo de las fichas, ya corregidas según la verificación; si la ficha se basó únicamente en el resumen, se indica con (R).

**Leyenda.** n. i. = no indicado en lo leído; n. a. = no aplica; (R) = solo resumen leído; NRP = no revisado por pares (tesis, preprint, informe o capítulo institucional).
- *Controladora original*: sí = se conserva sin modificar; no = se sustituye; parcial = se conserva una parte.
- *Gemelo digital*: no; simulación (modelo sin conexión al robot); réplica no sincronizada; visualización sincronizada (el modelo sigue al robot); sincronizado bidireccional (estado y órdenes en ambos sentidos); propuesto (no implementado).
- *Código abierto*: solo se marca "sí" si la ficha dice que se publica el código o el hardware.

## Matriz

| Clave | Año | Equipo | Controladora original | Protocolo | Gemelo digital | Seguridad en comunicación | Métricas medidas | Uso educativo | Código abierto |
|---|---|---|---|---|---|---|---|---|---|
| alasti2021turning (R) | 2021 | Robot industrial no colaborativo (no nombrado en el resumen ASEE) | sí (+ sensórica y controlador externo) | IP, inalámbrico (resumen ASEE) | no | n. i. | ninguna en el artículo ASEE (las cifras de ~1 cm y ~5 m son de un preprint aparte y no se atribuyen) | sí | n. i. |
| alqoud2022industry | 2022 | Revisión (32 trabajos; brazos 16 %) | según enfoque | OPC 75 %, Modbus 39 %, Ethernet 36 %, MQTT 25 % | n. a. | n. a. | n. a. (revisión) | no | n. a. |
| alvares2018retrofitting (R) | 2018 | ASEA IRB6-S2 | no (CNC abierto, LinuxCNC) | n. i. | n. i. | n. i. | n. i. (R) | n. i. | sí (hw y sw para IRB6-S2) |
| antonelli2023virtual | 2023 | Cobots de doble brazo; ABB | sí | MQTT | visualización sincronizada (Unity web) | n. i. | pre/post sin diferencias significativas; motivación (n = 70) | sí | n. i. |
| ariascachero2023operational | 2023 | UR5e | sí (PLC virtualizado en edge 5G) | MQTT (QoS 0) vs. OPC UA PubSub | no | no (solo umbral de fin de movimiento) | latencia de lazo cerrado (mediana Ethernet 2 B: MQTT 2,5 ms / OPC UA 10,1 ms); tiempo de ciclo | no | n. i. |
| azkarate2019virtual (R) | 2019 | Celda robótica (n. i.) | n. i. | n. i. | puesta en marcha virtual | n. i. | cualitativa | sí | n. i. |
| barraza2016modelado | 2016 | RV-M1 (modelo CAD) | n. a. | n. a. | simulación (modelo dinámico) | n. a. | errores en simulación (solo gráficas) | n. i. | n. i. |
| bilancia2023overview | 2023 | Revisión (KUKA, ABB, Fanuc…) | según enfoque | bus de campo, TCP/UDP, serie | n. a. | n. i. | recopila ciclos RSI/EGM/DPM (4–20 ms) | no | n. a. |
| bravoarrabal2025iort | 2025 | UR3 + efector propio | sí | MQTT + ROS (puente en nube), VPN, 5G | sincronizado bidireccional (VEROSIM) | órdenes validadas en el gemelo + confirmación humana; permisos MQTT; VPN | latencia de un sentido media 58 ms (pico 318 ms), definida como RTT/2; RTT (ping) 116 ms | no | parcial (app Android) |
| bray2024latency | 2024 | Baxter | sí | TCP, ROS | no | VPN; caja límite; ≈4 órdenes/s | RTT por escenario 6,6–240,7 ms; pérdidas | no | n. i. |
| campos2019diseno (NRP) | 2019 | SCORBOT ER-4U | no (no disponible; RPi + Python) | VNC | no | no (VNC) | caracterización de componentes | sí | n. i. |
| castillo2020propuesta (NRP) | 2020 | RV-M1 | parcial (solo fuente; propuesta servos Yaskawa) | n. i. | no | n. i. | ninguna (propuesta) | sí | n. i. |
| chang2025construction | 2025 | FANUC M-20iD/35 | sí | TCP/IP con librería propietaria (FRRJIF) | sincronizado bidireccional (Unity; sondeo a 125 Hz) | umbral de desincronización; tolerancia a retrasos/pérdidas declarada sin describir; login; parada de emergencia | error XYZ "mayoritariamente ±1 mm"; sin latencia | no | no (librería propietaria) |
| ciungan2025enhancing | 2025 | Brazo de 5 GDL impreso en 3D | n. a. | MQTT (TLS) / WebSockets; serie RPi–Arduino | visualización sincronizada (VR) | TLS + usuario/contraseña | Likert y pruebas t (n = 31); latencia no encontrada en las partes leídas | sí | n. i. |
| conchasanchez2020recycling | 2020 | ED7220C | no (Arduino Mega + Simulink) | USB | no | n. i. | coste ~230 USD; visión 0,955 mm/píxel | sí | n. i. |
| erdei2022digital | 2022 | KUKA KR5 | sí (gemelo no conectado) | ninguno | réplica no sincronizada (+ pendant virtual) | n. a. | tiempo de tarea en el robot real (15:49–31:32 min); SUS (n = 10) | sí | n. i. |
| foit2008web | 2008 | RV-M1 | sí | HTTP/CGI; serie | no (3D planificado) | n. i. | ninguna | sí | n. i. |
| hacesgarcia2024building | 2024 | Meca500 + móvil Reeman | n. i. | TCP, mem. compartida, Firebase, MQTT (Node-RED) | simulación validada cualitativamente | propietario único del robot; parar todo; límites | CPU de MQTT 0,1–0,4 %; ≈100 ms (PUN); sin latencia MQTT | parcial | n. i. |
| herrera2018simulador (NRP) | 2018 | RV-M1 (simulador MATLAB) | n. a. | ninguno | simulación cinemática | n. a. | ninguna | sí | n. i. |
| **holmes2025retrofitting** | 2025 | 2 KUKA (KR10, KR16) con KRC2 + transportadores | sí (KRC2 heredada, sin RSI) | OPC XML-DA (RPi 5) + OPC UA (servidor por dispositivo) | n. i. | n. i. (métodos para cambiar estado; variables de solo lectura) | fallos de pick/place 8,3 % y 15,4 %; 13,9 % del tiempo en retardos; sin latencia (≈7 ciclos) | n. i. | n. i. |
| jokic2020two | 2020 | PUMA 560 | no (PC/MATLAB y FPGA) | n. i. | no | n. i. | error del eje 1 (mrad); costes tomados de otra referencia | parcial | n. i. |
| kaarlela2023digital | 2023 | UR, Fanuc, ABB IRB6700 | sí | MQTT, WebSocket, puente OPC UA→MQTT | sincronizado bidireccional (3 niveles) | n. i. | validación funcional, sin participantes | sí | n. i. |
| kolla2022retrofitting | 2022 | Taladro de columna; etiquetadora con PLC | sí | Ethernet, Node-RED (sin MQTT/OPC UA explícitos) | no | general | cualitativa | no | n. i. |
| **kumar2011virtual** | 2011 | RV-M1 (modelo virtual MATLAB + teach box simulado) | n. a. (sin conexión) | ninguno | simulación cinemática (interfaz común como trabajo futuro) | n. a. | ninguna | sí | n. i. |
| kumar2024scalable | 2025 | UR5 sobre rover | sí | ROS / ROS 2 sobre VPN | simulación previa (Gazebo) | VPN, cuentas sin privilegios, EncFS, revocación | latencia ~300 ms; vídeo ~2 s; horas de uso (>2700 alumnos; 14 y 36 equipos con acceso al hardware) | sí | parcial (herramientas abiertas) |
| kuts2019digital | 2019 | Yaskawa GP8 | sí | API propietaria (NDA) | sincronizado (bidireccional completo como trabajo futuro) | n. i. (anticolisión funcional) | FPS; retardo no utilizable (probable errata de la fuente) | sí | no (NDA) |
| **kutzer2023scorbot** | 2023 | Intelitek SCORBOT-ER 4u | sí (con DLL USB del fabricante) | USB + HTTP/JSON local (MATLAB ↔ servidor local) | simulación con la misma sintaxis que el hardware (no sincronizada) | n. a. (local) | métricas de código; valoración cualitativa (curso remoto 2020) | sí | sí (GitHub) |
| liang2020bidirectional | 2020 | KUKA KR120 | sí | ROS + puente MQTT (250 Hz) | sincronizado bidireccional | comprobación de pose con umbral | error articular del orden de 10⁻⁷–10⁻⁵ rad (máx. 2,07·10⁻⁵ rad; incoherencias en la tabla de la fuente); sin latencia | no | n. i. |
| luu2025enhancing | 2025 | ABB IRB1200 (IRC5) | sí | MQTT (QoS 0/1/2, TLS), EGM/UDP, WebRTC | visualización sincronizada (VR) | TLS 1.2 + autenticación | latencia por QoS (LAN QoS 1: 94,7 ms; QoS 0 > QoS 1, anomalía de la fuente); escalado; pérdidas; error < 22 mm | no | n. i. |
| mendonca2025development | 2025 | Festo MPS | parcial / no claro | CANopen, OPC, USB | sincronizado solo módulo M1 | n. i. | madurez RAMI (1–5) | parcial | n. i. |
| mihali2005effective | 2005 | RV-M1 | sí | RS-232, TCP/IP, HDML | visualización sincronizada; elección robot/simulador al conectar | n. i. | ninguna | sí | n. i. |
| ogorodnyk2020towards | 2020 | Inyectora ENGEL (CC300) | sí | EMI (TCP/IP, XML), Pyro4 | no | n. i. | frecuencia efectiva (~39,5 Hz con 100 Hz pedidos) | no | n. i. |
| pan2004pcbased (R) | 2004 | Movemaster-EX [POR VERIFICAR modelo] | n. i. [POR VERIFICAR; fuera del recuento] | CORBA | n. i. | n. i. | n. i. (R) | n. i. | n. i. |
| pang2022remote | 2022 | ABB IRB120 | sí | OPC UA, HTTP/JSON | sincronizado (OPC UA) | n. i. | satisfacción >80 % (n = 64; 58/60 respuestas, incoherencia) | sí | n. i. |
| patrao2025understanding | 2025 | Mitsubishi RV-2AJ (CR1-571) | sí | RS-232 (COSIMIR) | propuesto | n. i. | ninguna | parcial | n. i. |
| pontarolli2025analyzing | 2025 | PLC S7-1500 que gobierna un SCARA FANUC SR-6iA | sí | S7comm, PROFINET, NATS, REST; MQTT solo como *Databus* interno del *edge* | no (AAS) | HTTPS (sin profundizar) | RTT 5,94–7,23 ms, p95 9 ms (n = 200), NTP-GPS | no | n. i. |
| profanter2019opcua | 2019 | Banco de pruebas (2 PC) | n. a. | OPC UA, ROS, DDS, MQTT | no | no evaluada | RTT en µs por protocolo (OPC UA C/S 520, MQTT 584 µs; ≥ 875 µs con carga de red) | no | n. i. |
| roldan2018enhancing | 2018 | RV-M1 | no (dSPACE DS1103) | E/S analógicas/digitales | no (simulación Simulink) | n. i. | error en régimen 0,3 mm (una trayectoria) | sí | n. i. |
| ruiz2022caracterizacion (NRP) | 2022 | RV-M1 | no (Arduino Mega) | n. i. | simulación propuesta (Simscape) | n. i. | comparativa de placas; prueba de motor en banco | sí | n. i. |
| sanchezlondono2023smart | 2023 | Revisión (maquinaria heredada) | n. a. | n. i. (pasarelas genéricas) | n. i. | n. i. | n. a. (recoge MTTF/MDT) | no | n. a. |
| singh2024unity | 2024 | ABB IRB1200 (IRC5) | sí | ROS (ROS-TCP-Connector) | sincronizado | no | latencia 77,67 ± 15,74 ms; exactitud articular 99,99 % (normalizada por 180°) | no | parcial (herramientas abiertas) |
| swider2007system | 2007 | RV-M1 | sí | RS-232 (y Centronics); servidor propio | simulación (no sincronizada) | n. i. | ninguna | sí | n. i. |
| xiang2024development (NRP) | 2024 | ABB IRB120 (IRC5) | sí | RWS (HTTP/REST), TCP | sincronizado bidireccional | autenticación digest | refresco ≈17 ms (no es latencia); energía | no | n. i. |
| zhang2024construction | 2024 | SCARA de 4 GDL impreso en 3D + Arduino | n. a. | TCP/IP local + serie USB | sincronizado bidireccional (mismas órdenes) | avisos de límites en el gemelo | retardo ≈72–76 ms; error 2,01–3,83 mm (3 ensayos) | n. i. | n. i. |
| **Este trabajo** | 2026 | **Mitsubishi Movemaster EX RV-M1 (D/U-M1)** | **sí, sin modificar** | **RS-232C + MQTT (QoS 1, JSON)** | **previsto: gemelo web que emula la D/U-M1, comparte el contrato y se sincroniza por eventos (`WH`/`ER`)** | **previsto (adaptación de mecanismos MQTT/Sparkplug): LWT; caducidad por `ts` al recibir y antes del RS-232; descarte de `id` repetidos; destino en topic y payload; ACK en dos fases; comandos sin retain; rechazos motivados; control de desfase de reloj; usuario/contraseña y ACL** | **previsto: latencia por tramos (un reloj por equipo), coherencia y fidelidad física del gemelo (mm, grados), salvaguardas con cota al 95 %, robustez reducida** | **sí (FP)** | **previsto (repositorio del proyecto) [POR CONFIRMAR licencia]** |

## Normas de referencia (no son trabajos comparables; no entran en la lectura rápida)

| Clave | Norma | Qué se usa | Texto leído |
|---|---|---|---|
| oasis2014mqtt | MQTT 3.1.1 (OASIS, 2014; con Errata 01, 2015) | Última voluntad, QoS 1 con duplicados, retain | Secciones citadas |
| oasis2019mqtt | MQTT 5.0 (OASIS, 2019) | *Message Expiry Interval* (solo cubre la espera en el broker); Will Delay | Secciones citadas |
| iso2023sparkplug | ISO/IEC 20237:2023, Sparkplug 3.0 | Certificados de muerte por LWT, nacimiento, bdSeq | Ficha de catálogo + documentación secundaria |
| iso1998manipulating | ISO 9283:1998 | Solo para acotar que E2b no es un ensayo de exactitud de pose | Ficha de catálogo |
| iso2025robotics | ISO 10218-1:2025 | Solo para la cautela sobre la habilitación del pendant | Ficha de catálogo |

## Lectura rápida

- **Conservan la controladora y solo usan una interfaz local (serie o USB):** swider2007system, foit2008web, mihali2005effective (RV-M1), patrao2025understanding (RV-2AJ, propuesta) y kutzer2023scorbot (SCORBOT, DLL USB). Ninguno usa un protocolo IIoT estándar ni mide latencia o fidelidad.
- **Controladora heredada conservada con protocolo IIoT estándar:** solo holmes2025retrofitting (KRC2 con OPC), que tiene interfaz de red.
- **Mismo robot con medidas:** solo roldan2018enhancing, que sustituye la controladora.
- **MQTT con manipulador industrial real, gobernado directamente:** antonelli2023virtual, ariascachero2023operational, bravoarrabal2025iort, kaarlela2023digital, liang2020bidirectional y luu2025enhancing, todos con controladoras con interfaz de red. En pontarolli2025analyzing el manipulador lo gobierna un PLC y MQTT es el bus interno del *edge*.
- **Latencia medida:** ariascachero2023operational, bravoarrabal2025iort, bray2024latency, kumar2024scalable, luu2025enhancing, pontarolli2025analyzing, profanter2019opcua, singh2024unity y zhang2024construction. Solo bray2024latency la desglosa por tramos.
- **Intercambiabilidad simulador/robot con la misma interfaz:** mihali2005effective (elección al conectar), kutzer2023scorbot (misma sintaxis, local) y zhang2024construction (mismas órdenes, sockets locales). Ninguno en un bus pub/sub multicliente.
- **Fidelidad gemelo–robot en unidades físicas:** chang2025construction (mm), zhang2024construction (mm) y liang2020bidirectional (rad); singh2024unity usa un porcentaje normalizado. Todos con estado continuo.
- **Salvaguardas de aplicación sobre la mensajería (más allá de TLS/VPN):** bravoarrabal2025iort, hacesgarcia2024building, liang2020bidirectional y chang2025construction (este último declara tolerancia a retrasos sin describirla). Ninguno adapta la caducidad, la idempotencia ni el destino doble a una controladora sin red, aunque los mecanismos base están en MQTT y Sparkplug.
- **Código abierto declarado:** alvares2018retrofitting (retrofit invasivo) y kutzer2023scorbot (robot didáctico heredado). kuts2019digital y chang2025construction dependen de interfaces propietarias.
