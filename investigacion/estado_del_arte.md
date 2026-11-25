# Estado del arte: modernización no invasiva de manipuladores heredados con MQTT y gemelo digital

Documento de síntesis a partir de las 41 fichas de `investigacion/fichas/`, la matriz (`matriz.md`) y el análisis de huecos (`huecos.md`). Fecha: 2026-11-25.

> **Aviso.** Las claves `[@clave]` están en `referencias/refs.bib`, que está **pendiente de verificación**. Las cifras se dan tal como figuran en las fichas. Cuando la ficha avisa de una incoherencia en la fuente, se indica. Se marcan como NRP los trabajos no revisados por pares (tesis, preprints, informes o capítulos institucionales).

## 1. Introducción: equipos heredados e Industria 4.0

Muchas empresas y centros de formación tienen máquinas mecánicamente sanas cuya electrónica de control ha quedado obsoleta o es cerrada. Para las pymes, sustituirlas no siempre es viable. Por eso la modernización (*retrofitting*) se ha consolidado como alternativa para incorporarlas a la Industria 4.0 [@alqoud2022industry; @kolla2022retrofitting]. La revisión sistemática de Alqoud et al. (32 trabajos, 2015–2021) concluye que el retrofit digital aún tiene un alcance y un proceso poco definidos. Según esa revisión, los brazos robóticos son el segundo tipo de máquina más estudiado (16 %), muy por detrás de las máquinas CNC (50 %) [@alqoud2022industry]. Sanchez-Londono et al. lo plantean desde el mantenimiento como alternativa a sustituir el equipo. Recogen propuestas que no exigen abrir ni modificar mucho la máquina y recomiendan probar en un banco de ensayos antes de pasar a la línea [@sanchezlondono2023smart]. En docencia el problema es el mismo. Hay robots didácticos e industriales de los años 80 y 90 con la mecánica intacta y la electrónica averiada o cerrada [@castillo2020propuesta; @ruiz2022caracterizacion; @conchasanchez2020recycling; @jokic2020two].

Este documento revisa la literatura en cinco enfoques: (i) estrategias de modernización, con o sin sustitución de la controladora; (ii) antecedentes sobre el RV-M1 y robots Mitsubishi comparables; (iii) protocolos de comunicación y su latencia; (iv) gemelos digitales de manipuladores y su validación, junto con la seguridad en la capa de comunicación; y (v) gemelos y laboratorios remotos en docencia.

## 2. Estrategias de modernización: sustituir o conservar la controladora

**Taxonomías.** Hay dos clasificaciones complementarias. Para la maquinaria en general, Alqoud et al. distinguen tres enfoques [@alqoud2022industry]:
- *starter kits*, sin conexión directa al sistema heredado (12,5 %);
- *embedded streaming gateway*, que modifica el software del PLC con riesgo para las funciones de control (25 %);
- soluciones de hardware IoT con pasarela (62,5 %).

La ficha avisa de pequeñas incoherencias en los porcentajes de la fuente (28 de 32 trabajos presentado como 72 %). Para robots, Bilancia et al. separan el *external coordinator* y el *external trajectory generator*, que conservan la controladora, del *open controller*, que la sustituye en parte o del todo [@bilancia2023overview]. En el *external coordinator*, la controladora interpreta las órdenes recibidas y sigue planificando las trayectorias. Esa revisión se centra en controladoras modernas con interfaces de tiempo real (KUKA RSI, ABB EGM, Fanuc DPM, con ciclos de 4 a 20 ms). No trata controladoras con solo puerto serie ni protocolos IIoT. Kolla et al. añaden la distinción entre el retrofit "empujado" por la Industria 4.0 y el retrofit "tirado" por una necesidad concreta [@kolla2022retrofitting].

**Sustitución de la controladora (invasiva).** Es la opción mayoritaria en robots antiguos, sobre todo si la controladora está averiada o se quiere enseñar control de bajo nivel. Las soluciones van desde controladores CNC abiertos sobre LinuxCNC en un ASEA IRB6-S2, con metodología IDEF0 y hardware y software publicados [@alvares2018retrofitting], hasta PC con tarjeta de adquisición o FPGA en un PUMA 560 [@jokic2020two]. También se ha usado una dSPACE DS1103 con servoamplificadores propios en el propio RV-M1 [@roldan2018enhancing]. En robots didácticos se recurre a microcontroladores o a la Raspberry Pi, como en el ED7220C con Arduino y Simulink [@conchasanchez2020recycling] o en el SCORBOT ER-4U con Raspberry Pi y Python [@campos2019diseno] (NRP). Estos trabajos son los únicos de su grupo que aportan medidas. En el PUMA 560 se midió el error del eje 1 (40 mrad máximo en movimiento con PC) y el coste: unos 12 k€ la FPGA frente a unos 35 k€ el PC, con mano de obra [@jokic2020two]. En el ED7220C, el coste de componentes ronda 230 USD [@conchasanchez2020recycling]. En el RV-M1 con dSPACE, el error en régimen permanente es de 0,3 mm [@roldan2018enhancing]. Las medidas son escasas: un solo eje en el PUMA, una sola trayectoria sin método de medida documentado en el RV-M1. Además, el precio de abrir el lazo es eliminar la controladora original y sus seguridades.

**Conservación de la controladora con pasarela (no invasiva).** Varios trabajos añaden una capa de comunicación sin tocar el control. Ogorodnyk et al. construyen una API sobre la interfaz nativa EMI de una inyectora y miden el techo que impone esa interfaz: unos 39,5 Hz efectivos cuando se piden 100 Hz [@ogorodnyk2020towards]. Pontarolli et al. despliegan una plataforma *edge* en paralelo a un PLC que gobierna un SCARA FANUC, con un RTT medio de 5,94–7,23 ms y un p95 de 9 ms [@pontarolli2025analyzing]. Alasti añade sensórica y comunicación a un robot no colaborativo con fines docentes, sin medir latencia [@alasti2021turning]. Kolla et al. proponen una arquitectura en cuatro capas con pasarela (Raspberry Pi, Node-RED, InfluxDB, Grafana), validada solo de forma cualitativa [@kolla2022retrofitting]. Ninguno de estos trabajos parte de un manipulador cuya única interfaz sea un puerto serie.

**Marcos metodológicos.** Hay marcos en cinco pasos apoyados en RAMI 4.0 y gemelo digital [@mendonca2025development] y en IDEF0 [@alvares2018retrofitting]. Desde el mantenimiento se citan GFMAM e ISO 55000 [@sanchezlondono2023smart]. La evaluación suele ser una autoevaluación de madurez, por ejemplo de RAMI 3→4 en automatización [@mendonca2025development], y no de prestaciones. En ese caso, además, el módulo del brazo robótico quedó fuera porque su controladora no inicializaba.

## 3. Antecedentes sobre el RV-M1 y robots Mitsubishi comparables

La literatura específica del RV-M1 sigue los mismos dos caminos. En el **invasivo** están la dSPACE de Roldán et al. [@roldan2018enhancing] y dos trabajos institucionales de TEINCO (NRP) que consideran irrecuperable la controladora. Uno compara microcontroladores y elige un Arduino Mega [@ruiz2022caracterizacion]. El otro diagnostica el deterioro (servomotores averiados, frenos ausentes, CI obsoletos) y presupuesta servos Yaskawa [@castillo2020propuesta]. Pan y Huang presentan un controlador de PC abierto basado en CORBA aplicado a un Movemaster-EX. Solo se leyó el resumen, y no está confirmado si es un RV-M1 ni si sustituye la controladora [POR VERIFICAR] [@pan2004pcbased].

En el **no invasivo** hay tres trabajos de 2005–2008 que se comunican con la controladora por RS-232:
- un sistema de simulación, programación fuera de línea y supervisión remota [@swider2007system];
- una interfaz web basada en CGI que lo reutiliza [@foit2008web];
- un simulador OpenGL que se mueve a la par que el robot real, con red TCP/IP entre simuladores y control desde un móvil [@mihali2005effective]. Al conectar, el usuario elige si manda el robot o el simulador.

Los tres tienen motivación docente y ninguno aporta medidas cuantitativas. Las tecnologías (Visual Basic, CGI, HDML, servidores propios) están hoy obsoletas. Más recientemente, Patrão et al. estudian integrar un Mitsubishi RV-2AJ, con su controladora y RS-232, en el gemelo digital de un FMS heredado. Dejan sin implementar la realimentación desde la controladora, y la ficha avisa de una inconsistencia de unidades de velocidad en la fuente [@patrao2025understanding]. Completan el panorama modelos del RV-M1 sin conexión al robot: un simulador cinemático en MATLAB (NRP) [@herrera2018simulador] y la identificación de parámetros dinámicos desde CAD, solo en simulación [@barraza2016modelado].

## 4. Protocolos de comunicación y latencia

En los retrofits domina OPC/OPC UA, seguido de Modbus y Ethernet. MQTT aparece en una cuarta parte de los trabajos [@alqoud2022industry]. Las comparaciones de protocolos indican que el transporte apenas cuenta en una LAN cableada. En un banco de pruebas, el RTT medio con 2 B fue de 584 µs para MQTT, 520 µs para OPC UA cliente/servidor y 618 µs para ROS, aunque MQTT tuvo más valores atípicos [@profanter2019opcua]. Controlando un UR5e desde un PLC virtualizado, MQTT dio una latencia mediana de lazo cerrado de 2,5 ms frente a 10,1 ms de OPC UA (Ethernet, 2 B), y 5G añadió unos 28 ms. Ese trabajo usó solo QoS 0 [@ariascachero2023operational]. Haces-Garcia y Zhu comparan TCP, memoria compartida, Firebase y MQTT para un simulador multiusuario y dejan MQTT entre los finalistas, aunque no dan cifras de su latencia [@hacesgarcia2024building]. Xiang et al. defienden evitar ROS, OPC UA y PLC y usar la interfaz nativa REST de la controladora (preprint, NRP). Su "refresco" de unos 17 ms es un inverso de peticiones por segundo, no una latencia extremo a extremo [@xiang2024development].

A nivel de aplicación y en redes amplias, las cifras suben a decenas o centenares de milisegundos. Luu et al. teleoperan un ABB IRB1200 por MQTT con TLS. Miden una latencia media en LAN de 139,3 ms con QoS 0, 94,7 ms con QoS 1 y 101,3 ms con QoS 2, recomiendan QoS 1 y fijan un límite práctico de unos 50 robots por broker [@luu2025enhancing]. Bravo-Arrabal et al. dan una media de 58 ms (pico de 318 ms) a 2300 km con MQTT y ROS. La ficha avisa de que la relación entre esa cifra y el ping medio de 116 ms no está clara en la fuente [@bravoarrabal2025iort]. Bray et al. son los únicos que **descomponen** la latencia por tramos y escenarios: 6,6 ms de RTT en LAN cableada, 58,4 ms por Wi-Fi con VPN, 115,4 ms por 4G y 240,7 ms en un enlace transatlántico [@bray2024latency]. Pontarolli et al. son una referencia de buena práctica de medida, con sniffer hardware, NTP con GPS, percentiles y 200 muestras [@pontarolli2025analyzing]. Todas estas medidas corresponden a controladoras con interfaz de red o de tiempo real (EGM a 4 ms, ROS, PROFINET). No se han encontrado datos sobre el retardo que añaden un enlace serie y el intérprete de órdenes de una controladora de los años 80.

## 5. Gemelos digitales de manipuladores: sincronización, interfaz común, fidelidad y seguridad

**Niveles de acoplamiento.** Bajo el nombre de "gemelo" conviven niveles muy distintos. Hay réplicas sin canal con el robot, como el centro de formación con teach pendant virtual de un KUKA KR5 [@erdei2022digital]. Hay visualizaciones sincronizadas, como el simulador del RV-M1 [@mihali2005effective] o los gemelos en VR [@luu2025enhancing; @ciungan2025enhancing]. Y hay gemelos bidireccionales sobre controladoras modernas:
- por TCP con librería del fabricante en un FANUC [@chang2025construction];
- por ROS en un ABB IRB1200 [@singh2024unity];
- por API propietaria bajo NDA en un Yaskawa GP8 [@kuts2019digital];
- por RWS en un ABB IRB120 [@xiang2024development];
- con un puente MQTT a 250 Hz entre ROS/Gazebo y el PLC de un KUKA KR120 [@liang2020bidirectional].

Kaarlela et al. dejan elegir al alumno entre modelo digital, sombra y gemelo, y usan MQTT como protocolo principal con un puente OPC UA→MQTT hacia la controladora [@kaarlela2023digital].

**Interfaz común para el gemelo y el robot.** Que las mismas órdenes gobiernen indistintamente el gemelo y el robot aparece solo de forma parcial. Zhang et al. encapsulan las mismas órdenes para un SCARA virtual y otro físico impreso en 3D, pero con sockets locales [@zhang2024construction]. Bravo-Arrabal et al. hacen pasar las órdenes MQTT por el gemelo antes del robot real [@bravoarrabal2025iort]. En el simulador del RV-M1, el destino se elige al conectar [@mihali2005effective]. No se ha encontrado un contrato de mensajes publicado en el que cambiar del gemelo al robot real sea cambiar solo el destino.

**Validación de la fidelidad.** No hay un protocolo común:
- error XYZ "mayoritariamente dentro de ±1 mm" en una tarea de soldadura [@chang2025construction];
- error absoluto del efector de 2,01 a 3,83 mm en tres ensayos, con un retardo de unos 0,07 s [@zhang2024construction];
- error articular de 10⁻⁷ a 10⁻⁵ rad, aunque la ficha avisa de una posible errata en la tabla [@liang2020bidirectional];
- latencia de 77,67 ± 15,74 ms y una "exactitud articular" del 99,99 % normalizada por 180°, que da porcentajes muy altos aun con errores de décimas de grado [@singh2024unity].

Kuts et al. informan de un retardo entre comandos de "32,875 ms", que la ficha marca como posible errata de unidades [POR VERIFICAR] [@kuts2019digital]. Todos estos gemelos se alimentan de un estado continuo. Ninguno se sincroniza con una controladora que solo da su posición y su error bajo demanda.

**Seguridad en la capa de comunicación.** Lo publicado se agrupa en cuatro tipos:
- cifrado y autenticación: TLS en el broker MQTT [@luu2025enhancing; @ciungan2025enhancing] y VPN [@bray2024latency; @kumar2024scalable; @bravoarrabal2025iort];
- control de acceso: permisos MQTT y confirmación humana antes de ejecutar en el robot real [@bravoarrabal2025iort], y un único propietario de cada robot con traspaso al desconectarse [@hacesgarcia2024building];
- coherencia gemelo–robot: un umbral de desincronización que obliga a replanificar [@liang2020bidirectional; @chang2025construction];
- seguridad funcional apoyada en el gemelo: prevención de colisiones [@kuts2019digital] y validación de trayectorias en el gemelo [@kaarlela2023digital].

Kaarlela et al. cuentan que al disparar las seguridades virtuales se paraba el robot real, y tuvieron que separar ambos efectos. Es una muestra práctica de lo delicado que es separar el gemelo del robot real [@kaarlela2023digital]. Luu et al. son los únicos que evalúan empíricamente los niveles de QoS. Con un 30 % de pérdidas emuladas, QoS 0 pierde un 2 % de los datos y QoS 1/2 mantienen la integridad [@luu2025enhancing]. En la búsqueda no se han encontrado mecanismos de rechazo de órdenes caducadas por marca de tiempo, ACK de aplicación en dos fases ni uso de la última voluntad (LWT) en manipuladores.

## 6. Gemelos y laboratorios remotos en docencia

Formar con el gemelo antes de usar el robot real está bien asentado. El argumento es de disponibilidad y seguridad: la celda física admite pocos alumnos a la vez, unos 8 en [@erdei2022digital]. Se usa la puesta en marcha virtual como competencia profesional [@azkarate2019virtual], la simulación en Gazebo antes del hardware en laboratorios remotos masivos con un UR5 (más de 2700 alumnos, unos 300 ms de latencia; preprint, NRP) [@kumar2024scalable] y laboratorios remotos con gemelo sincronizado por OPC UA [@pang2022remote] o por MQTT [@antonelli2023virtual]. La reutilización de robots antiguos en docencia existe, pero sustituyendo la controladora [@conchasanchez2020recycling; @roldan2018enhancing].

La evaluación docente suele ser débil:
- satisfacción autodeclarada de más del 80 % con 64 alumnos, con una incoherencia en el número de respuestas (58 frente a 60) [@pang2022remote];
- 31 alumnos con estadística inferencial sobre percepciones [@ciungan2025enhancing];
- 10 voluntarios sin pruebas estadísticas [@erdei2022digital].

El estudio más riguroso, con 70 alumnos y pre/post-test, no encontró ganancias de conocimiento significativas, aunque sí más motivación y utilidad percibida. La ficha avisa de incoherencias en sus tablas [@antonelli2023virtual]. Ciungan et al. comparten con este proyecto la arquitectura (Raspberry Pi como pasarela serie↔MQTT con TLS), pero sobre un brazo de servos de hobby [@ciungan2025enhancing]. No se ha encontrado ningún trabajo centrado en formación profesional.

## 7. Síntesis

Hay tres tendencias claras (detalle en `huecos.md`):
1. **MQTT** está ya aceptado como capa de mensajería entre gemelo y robot y es competitivo en latencia [@ariascachero2023operational; @luu2025enhancing; @kaarlela2023digital; @liang2020bidirectional].
2. **Los gemelos sincronizados** de manipuladores son habituales, pero sobre controladoras modernas con interfaz de red [@singh2024unity; @chang2025construction; @xiang2024development].
3. **En robots heredados** predomina sustituir la controladora [@roldan2018enhancing; @jokic2020two; @alvares2018retrofitting; @conchasanchez2020recycling].

Las carencias comunes son estas:
- (a) ningún trabajo moderniza un manipulador conservando una controladora cuya única interfaz es un puerto serie y conectándolo a un protocolo IIoT estándar. Los antecedentes en esa línea son de 2005–2008 o se quedan en propuesta [@swider2007system; @foit2008web; @mihali2005effective; @patrao2025understanding];
- (b) los trabajos no invasivos no miden nada, y la latencia rara vez se desglosa por tramos [@bray2024latency];
- (c) la fidelidad del gemelo se informa de forma heterogénea y a veces poco informativa;
- (d) las seguridades sobre la mensajería se reducen a cifrado, acceso y umbrales, sin tratar órdenes retrasadas, confirmación de ejecución ni detección de desconexión.

Estas conclusiones se basan en una búsqueda en la que las APIs bibliográficas no estaban accesibles. Por eso deben formularse como "no se ha encontrado".

## 8. Posicionamiento del artículo

Según la taxonomía de Bilancia et al., el trabajo es un *external coordinator* [@bilancia2023overview]. Según la de Alqoud et al., es una solución de hardware IoT con pasarela [@alqoud2022industry]. La D/U-M1 del RV-M1 se conserva sin modificar, con su planificación y sus seguridades, y se gobierna por su RS-232C desde Python, desde un teach pendant de software y a través de una placa puente RS-232→MQTT. Frente a los antecedentes sobre el mismo robot, se diferencia de dos formas. Frente a los invasivos [@roldan2018enhancing; @ruiz2022caracterizacion; @castillo2020propuesta], porque no requiere electrónica de potencia nueva ni equipos de alto coste. Frente a los no invasivos [@swider2007system; @foit2008web; @mihali2005effective], por cuatro aspectos que muestra la matriz:
1. un protocolo IIoT estándar con un contrato publicado;
2. seguridades de aplicación que no se han encontrado en la literatura revisada: ACK en dos fases, rechazo de órdenes caducadas (> 500 ms), comprobación del destino en el topic y en el payload, comandos sin retain, LWT y rechazos motivados;
3. un gemelo intercambiable con el robot real solo cambiando el destino, que extiende la idea local de [@zhang2024construction] a una red pub/sub;
4. una validación experimental en el robot real: latencia por tramos, fidelidad gemelo–real en mm y grados, repetibilidad de pick&place, seguridades y robustez. Las cifras de controladoras modernas sirven como referencia de comparación [@luu2025enhancing; @singh2024unity; @pontarolli2025analyzing].

El trabajo da continuidad, con implementación y medidas, al problema que [@patrao2025understanding] deja abierto en 2025 para robots Mitsubishi antiguos.

---

## Versión para la introducción del artículo

*(Unas 600 palabras. El artículo no tiene sección de trabajos relacionados y está limitado a 8–9 páginas, así que este texto debe integrarse en la Introducción y recortarse si hace falta.)*

La modernización (*retrofitting*) de equipos heredados es una alternativa a su sustitución para incorporarlos a la Industria 4.0, sobre todo en pymes y centros de formación [@alqoud2022industry; @sanchezlondono2023smart; @kolla2022retrofitting]. En los manipuladores se distinguen dos estrategias [@bilancia2023overview]. La primera conserva la controladora original y la gobierna desde fuera (*external coordinator*). La segunda la sustituye por un controlador abierto (*open controller*). Esta segunda es la más frecuente en robots antiguos, sobre todo cuando la controladora está averiada o se quiere enseñar control de bajo nivel: LinuxCNC en un ASEA IRB6-S2 [@alvares2018retrofitting], PC o FPGA en un PUMA 560 [@jokic2020two], microcontroladores en robots didácticos [@conchasanchez2020recycling]. En el propio Mitsubishi RV-M1 se ha sustituido la controladora por una dSPACE con servoamplificadores propios, con un error en régimen de 0,3 mm en una trayectoria [@roldan2018enhancing]. El precio es renunciar a la controladora original y a sus seguridades.

La vía no invasiva para el RV-M1 se exploró entre 2005 y 2008, con simulación, programación fuera de línea y control remoto por RS-232 [@swider2007system; @foit2008web; @mihali2005effective]. Esos trabajos usaban tecnologías hoy obsoletas y no aportaban medidas. En 2025 el problema seguía abierto para robots Mitsubishi antiguos: la integración de un RV-2AJ en un gemelo digital por RS-232 quedó en estudio de viabilidad, sin realimentación de estado [@patrao2025understanding].

En paralelo, MQTT se ha consolidado como capa de mensajería entre gemelo digital y manipulador. Es competitivo frente a OPC UA en latencia de control [@ariascachero2023operational; @profanter2019opcua] y se ha usado en teleoperación con QoS y TLS [@luu2025enhancing] y en gemelos sincronizados para formación [@kaarlela2023digital; @antonelli2023virtual; @liang2020bidirectional]. Sin embargo, estos gemelos se apoyan en controladoras modernas con interfaz de red o de tiempo real [@singh2024unity; @chang2025construction]. Su fidelidad se informa de forma heterogénea, en mm, en rad o como un porcentaje normalizado [@chang2025construction; @zhang2024construction; @liang2020bidirectional; @singh2024unity]. La latencia rara vez se desglosa por tramos [@bray2024latency]. Las seguridades sobre la mensajería se limitan a cifrado, VPN, permisos o umbrales de desincronización [@luu2025enhancing; @bravoarrabal2025iort; @hacesgarcia2024building]. Que las mismas órdenes gobiernen el gemelo y el robot real se ha mostrado solo en comunicación local con un robot de bajo coste [@zhang2024construction].

En la búsqueda realizada no se ha encontrado ningún trabajo que modernice un manipulador industrial conservando una controladora cuya única interfaz sea un puerto serie, lo conecte a un protocolo IIoT estándar con seguridades de aplicación y lo caracterice experimentalmente. Este artículo cubre ese hueco con un Mitsubishi Movemaster EX RV-M1 cuya controladora D/U-M1 se conserva sin modificar. Sus aportaciones son:

- (i) un proceso de modernización no invasivo: control por RS-232C desde Python, teach pendant de software con dispositivo de habilitación y placa puente RS-232→MQTT;
- (ii) un contrato MQTT con ACK en dos fases, rechazo de órdenes caducadas, comprobación del destino real/gemelo, comandos sin retain y última voluntad (LWT), que permite intercambiar un gemelo digital con el robot real sin cambiar los mensajes;
- (iii) una validación experimental en el robot real: latencia desglosada por tramos, fidelidad gemelo–real en mm y grados, repetibilidad de una tarea de pick&place y verificación de las seguridades.

El resto del artículo describe el proceso de modernización, el protocolo MQTT, los experimentos y resultados, y las conclusiones.
