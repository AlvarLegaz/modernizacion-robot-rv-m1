# Estado del arte: modernización no invasiva de manipuladores heredados con MQTT y gemelo digital

Versión 2 (2026-11-25), en respuesta a `revisiones/revision_estado_arte_v1.md` (revisión mayor) y a `revisiones/verificacion_referencias.md`. Síntesis de 44 fichas de trabajos y 5 normas de `investigacion/fichas/`, de la matriz (`matriz.md`) y del análisis de huecos (`huecos.md`).

> **Aviso.** Las claves `[@clave]` están en `referencias/refs.bib`. Las 41 previas están verificadas o corregidas. Las 8 añadidas en esta versión (kutzer2023scorbot, holmes2025retrofitting, kumar2011virtual, oasis2014mqtt, oasis2019mqtt, iso2023sparkplug, iso1998manipulating, iso2025robotics) están **pendientes de verificación**. Las cifras se dan tal como figuran en las fichas, ya corregidas según la verificación. Cuando la fuente tiene una incoherencia, se indica. Se marcan como NRP los trabajos no revisados por pares.

## 1. Introducción: equipos heredados e Industria 4.0

Muchas empresas y centros de formación tienen máquinas mecánicamente sanas cuya electrónica de control ha quedado obsoleta o es cerrada. Para las pymes, sustituirlas no siempre es viable, y la modernización (*retrofitting*) se ha consolidado como alternativa para incorporarlas a la Industria 4.0 [@alqoud2022industry; @kolla2022retrofitting; @holmes2025retrofitting]. La revisión sistemática de Alqoud et al. (32 trabajos, 2015–2021) concluye que el retrofit digital aún tiene un alcance y un proceso poco definidos. En esa muestra, los brazos robóticos son el segundo tipo de máquina más estudiado (16 %), muy por detrás de las máquinas CNC (50 %) [@alqoud2022industry]. Sanchez-Londono et al. lo plantean desde el mantenimiento: recogen propuestas que no exigen abrir ni modificar mucho la máquina y recomiendan probar en un banco de ensayos antes de pasar a la línea [@sanchezlondono2023smart]. En docencia el problema es el mismo: hay robots didácticos e industriales de los años 80 y 90 con la mecánica intacta y la electrónica averiada o cerrada [@castillo2020propuesta; @ruiz2022caracterizacion; @conchasanchez2020recycling; @jokic2020two].

Este documento revisa la literatura en cinco enfoques: (i) estrategias de modernización, con o sin sustitución de la controladora; (ii) antecedentes sobre el RV-M1 y robots didácticos comparables; (iii) protocolos de comunicación y su latencia; (iv) gemelos digitales de manipuladores, su interfaz con el robot, su fidelidad y la seguridad en la capa de comunicación, junto con las normas de mensajería que la condicionan; y (v) gemelos y laboratorios remotos en docencia.

## 2. Estrategias de modernización: sustituir o conservar la controladora

**Taxonomías.** Para la maquinaria en general, Alqoud et al. distinguen tres enfoques [@alqoud2022industry]:
- *starter kits*, sin conexión directa al sistema heredado (12,5 %);
- *embedded streaming gateway*, que modifica el software del PLC con riesgo para las funciones de control (25 %);
- soluciones de hardware IoT con pasarela (62,5 %).

La ficha avisa de pequeñas incoherencias en los porcentajes de la fuente (28 de 32 trabajos presentado como 72 %). Para robots, Bilancia et al. separan el *external coordinator* y el *external trajectory generator*, que conservan la controladora, del *open controller*, que la sustituye en parte o del todo [@bilancia2023overview]. En el *external coordinator*, la controladora interpreta las órdenes recibidas y sigue planificando las trayectorias. Esa revisión se centra en controladoras con interfaces de tiempo real (KUKA RSI, ABB EGM, Fanuc DPM, con ciclos de 4 a 20 ms) y no trata controladoras con solo puerto serie ni protocolos IIoT. Kolla et al. añaden la distinción entre el retrofit "empujado" por la Industria 4.0 y el "tirado" por una necesidad concreta [@kolla2022retrofitting].

**Sustitución de la controladora (invasiva).** Es la opción mayoritaria en robots antiguos, sobre todo si la controladora está averiada o se quiere enseñar control de bajo nivel. Las soluciones van desde controladores CNC abiertos sobre LinuxCNC en un ASEA IRB6-S2, con hardware y software publicados [@alvares2018retrofitting], hasta PC con tarjeta de adquisición o FPGA en un PUMA 560 [@jokic2020two]. En el propio RV-M1 se ha usado una dSPACE DS1103 con servoamplificadores propios [@roldan2018enhancing]. En robots didácticos se recurre a microcontroladores o a la Raspberry Pi: un ED7220C con Arduino y Simulink [@conchasanchez2020recycling] o un SCORBOT ER-4U con Raspberry Pi y Python [@campos2019diseno] (NRP). De este grupo, solo tres trabajos dan medidas de prestaciones:
- el error del eje 1 de un PUMA 560 (40 mrad máximo en movimiento con PC) [@jokic2020two];
- el coste de componentes del ED7220C, de unos 230 USD [@conchasanchez2020recycling];
- un error en régimen permanente de 0,3 mm en el RV-M1 con dSPACE [@roldan2018enhancing].

Las medidas son escasas: un solo eje en el PUMA y una sola trayectoria, sin método de medida documentado, en el RV-M1. Los costes que Jokić et al. comparan entre PC y FPGA los toman de otra referencia, no los miden [@jokic2020two]. Además, el precio de abrir el lazo es eliminar la controladora original y sus seguridades.

**Conservación de la controladora con pasarela (no invasiva).** Varios trabajos añaden una capa de comunicación sin tocar el control:
- Ogorodnyk et al. construyen una API sobre la interfaz nativa EMI de una inyectora y miden el techo que impone esa interfaz: unos 39,5 Hz efectivos cuando se piden 100 Hz [@ogorodnyk2020towards].
- Pontarolli et al. despliegan una plataforma *edge* en paralelo a un PLC que gobierna un SCARA FANUC. MQTT es allí el bus interno del *edge*, no el canal hacia el robot. Miden un RTT medio de 5,94–7,23 ms y un p95 de 9 ms [@pontarolli2025analyzing].
- Alasti añade sensórica y comunicación a un robot industrial no colaborativo con fines docentes [@alasti2021turning].
- Kolla et al. proponen una arquitectura en cuatro capas con pasarela (Raspberry Pi, Node-RED, InfluxDB, Grafana), validada solo de forma cualitativa [@kolla2022retrofitting].
- El caso más próximo al nuestro es el de Holmes et al. Integran dos KUKA (KR10 y KR16) cuyas controladoras KRC2 son tan antiguas que no admiten RSI: una Raspberry Pi habla con ellas por OPC XML-DA, y cada dispositivo expone un servidor OPC UA según una arquitectura basada en RAMI 4.0. Miden tasas de fallo de pick/place del 8,3 % y del 15,4 % y un 13,9 % del tiempo perdido en retardos, la mitad por caídas de la conexión con las KRC2. No dan latencias [@holmes2025retrofitting].

Por tanto, conservar una controladora **heredada** y conectarla a un protocolo IIoT estándar ya se ha hecho. Pero en todos estos casos la controladora tiene **interfaz de red** (Ethernet, OPC, API del fabricante). Ninguno parte de un manipulador cuya única interfaz sea un puerto serie.

**Marcos metodológicos.** Hay marcos en cinco pasos apoyados en RAMI 4.0 y gemelo digital [@mendonca2025development] y en IDEF0 [@alvares2018retrofitting]. Desde el mantenimiento se citan GFMAM e ISO 55000 [@sanchezlondono2023smart]. La evaluación suele ser una autoevaluación de madurez, por ejemplo de RAMI 3→4 en automatización [@mendonca2025development], y no de prestaciones. En ese caso, además, el módulo del brazo robótico quedó fuera porque su controladora no inicializaba.

## 3. Antecedentes sobre el RV-M1 y robots didácticos comparables

La literatura específica del RV-M1 sigue los mismos dos caminos. En el **invasivo** están la dSPACE de Roldán et al. [@roldan2018enhancing] y dos trabajos institucionales de TEINCO (NRP) que consideran irrecuperable la controladora. Uno compara microcontroladores y elige un Arduino Mega [@ruiz2022caracterizacion]. El otro diagnostica el deterioro y presupuesta servos Yaskawa [@castillo2020propuesta]. Pan y Huang presentan un controlador de PC abierto basado en CORBA aplicado a un Movemaster-EX. Solo se leyó el resumen, y no está confirmado si es un RV-M1 ni si sustituye la controladora [POR VERIFICAR] [@pan2004pcbased].

En el **no invasivo** hay tres trabajos de 2005–2008 que se comunican con la controladora por RS-232:
- un sistema de simulación, programación fuera de línea y supervisión remota [@swider2007system];
- una interfaz web basada en CGI que lo reutiliza [@foit2008web];
- un simulador OpenGL que se mueve a la par que el robot real, con red TCP/IP entre simuladores y control desde un móvil. Al conectar, el usuario elige si manda el robot o el simulador [@mihali2005effective].

Los tres tienen motivación docente y ninguno aporta medidas cuantitativas. Las tecnologías (Visual Basic, CGI, HDML, servidores propios) están hoy obsoletas. El control del RV-M1 por RS-232 desde software existe también en bibliotecas abiertas no revisadas por pares (.NET y Node.js), que no se citan como literatura. Fuera del RV-M1, la ScorBot Toolbox para MATLAB gobierna un SCORBOT-ER 4u con su controladora a través de la DLL USB del fabricante y un servidor local, con una simulación que usa la misma sintaxis que las funciones de hardware. Así, los programas de simulación pasan al robot casi sin cambios. Es código abierto y se usó en un curso remoto en otoño de 2020, pero es local y no mide la discrepancia entre simulación y robot [@kutzer2023scorbot].

Más recientemente, Patrão et al. estudian integrar un Mitsubishi RV-2AJ, con su controladora y RS-232, en el gemelo digital de un FMS heredado. Dejan sin implementar la realimentación desde la controladora, y la ficha avisa de una inconsistencia de unidades de velocidad en la fuente [@patrao2025understanding]. Completan el panorama varios modelos del RV-M1 sin conexión al robot:
- un modelo virtual en MATLAB con cinemática directa e inversa y un teach box simulado; los autores dejan como trabajo futuro una interfaz común para la simulación y la ejecución real [@kumar2011virtual];
- un simulador cinemático en MATLAB (NRP) [@herrera2018simulador];
- la identificación de parámetros dinámicos desde CAD, solo en simulación [@barraza2016modelado].

## 4. Protocolos de comunicación y latencia

En los retrofits domina OPC/OPC UA, seguido de Modbus y Ethernet, y MQTT aparece en una cuarta parte de los trabajos [@alqoud2022industry]. Las comparaciones indican que, en una LAN cableada, el transporte apenas cuenta:
- En un banco de pruebas, el RTT medio con 2 B fue de 520 µs para OPC UA cliente/servidor, 584 µs para MQTT y 618 µs para ROS. MQTT tuvo más valores atípicos, y con carga de red todos llegaron a 875 µs o más [@profanter2019opcua]. Es decir, las diferencias entre protocolos son inferiores al milisegundo.
- Controlando un UR5e desde un PLC virtualizado, MQTT dio una latencia mediana de lazo cerrado de 2,5 ms frente a 10,1 ms de OPC UA (Ethernet, 2 B), y 5G añadió unos 28 ms. Ese trabajo usó solo QoS 0 [@ariascachero2023operational].
- Haces-Garcia y Zhu dejan MQTT entre los finalistas para un simulador multiusuario, sin cifras de su latencia [@hacesgarcia2024building].
- Xiang et al. usan la interfaz REST nativa de la controladora (preprint, NRP). Su "refresco" de unos 17 ms es el inverso de las peticiones por segundo, no una latencia extremo a extremo [@xiang2024development].

A nivel de aplicación y en redes amplias, las cifras suben a decenas o centenares de milisegundos:
- Luu et al. teleoperan un ABB IRB1200 por MQTT con TLS. Miden una latencia media en LAN de 139,3 ms con QoS 0, 94,7 ms con QoS 1 y 101,3 ms con QoS 2, y fijan un límite práctico de unos 50 robots por broker [@luu2025enhancing]. Que QoS 0 dé más latencia que QoS 1 es lo contrario de lo esperable y la fuente no lo explica en lo leído, así que estas cifras se usan solo como orden de magnitud.
- Bravo-Arrabal et al. definen la latencia como la mitad del RTT y dan una latencia de un sentido de 58 ms de media (pico de 318 ms) a 2300 km con MQTT y ROS, con un RTT (ping) medio de 116 ms [@bravoarrabal2025iort].
- Bray et al. son los únicos que **descomponen** la latencia por tramos y escenarios: 6,6 ms de RTT en LAN cableada, 58,4 ms por Wi-Fi con VPN, 115,4 ms por 4G y 240,7 ms en un enlace transatlántico [@bray2024latency].
- Pontarolli et al. son una referencia de buena práctica de medida, con *sniffer* hardware, NTP con GPS, percentiles y 200 muestras [@pontarolli2025analyzing].

Todas estas medidas corresponden a controladoras con interfaz de red o de tiempo real (EGM a 4 ms, ROS, PROFINET). Holmes et al., con controladoras heredadas, miden el tiempo perdido, pero no la latencia [@holmes2025retrofitting]. No se han encontrado datos sobre el retardo que añaden un enlace serie y el intérprete de órdenes de una controladora de los años 80.

## 5. Gemelos digitales de manipuladores: interfaz con el robot, fidelidad y seguridad

**Niveles de acoplamiento.** Bajo el nombre de "gemelo" conviven niveles muy distintos:
- réplicas sin canal con el robot, como el centro de formación con teach pendant virtual de un KUKA KR5 [@erdei2022digital] o los modelos del RV-M1 [@kumar2011virtual; @herrera2018simulador];
- visualizaciones sincronizadas, como el simulador del RV-M1 [@mihali2005effective] o los gemelos en VR [@luu2025enhancing; @ciungan2025enhancing];
- gemelos bidireccionales sobre controladoras con interfaz de red:
  - por TCP con librería del fabricante en un FANUC, con sondeo a 125 Hz [@chang2025construction];
  - por ROS en un ABB IRB1200 [@singh2024unity];
  - por API propietaria bajo NDA en un Yaskawa GP8 [@kuts2019digital];
  - por RWS en un ABB IRB120 [@xiang2024development];
  - con un puente MQTT a 250 Hz entre ROS/Gazebo y el PLC de un KUKA KR120 [@liang2020bidirectional].

Kaarlela et al. dejan elegir al alumno entre modelo digital, sombra y gemelo, y usan MQTT como protocolo principal con un puente OPC UA→MQTT hacia la controladora [@kaarlela2023digital]. Todos los gemelos sincronizados revisados se alimentan de un **estado continuo**. Ninguno se sincroniza con una controladora que solo da su posición y su error bajo demanda, como hace la D/U-M1 con `WH` y `ER`.

**Interfaz común para el gemelo y el robot.** Que las mismas órdenes gobiernen el simulador y el robot real **no es nuevo**:
- en el propio RV-M1, el usuario elegía al conectar si mandaba el robot o el simulador [@mihali2005effective];
- en un SCORBOT-ER 4u con su controladora, la simulación comparte sintaxis con las funciones de hardware y los programas pasan de una a otra, en local [@kutzer2023scorbot];
- en un SCARA impreso en 3D, las mismas órdenes van al robot virtual y al físico por sockets locales [@zhang2024construction];
- Bravo-Arrabal et al. hacen pasar las órdenes MQTT por el gemelo antes del robot real [@bravoarrabal2025iort];
- Kumar et al. dejan esa interfaz común como trabajo futuro para el RV-M1 [@kumar2011virtual].

Lo que no se ha encontrado es esa intercambiabilidad sobre un bus pub/sub con varios clientes, con el destino comprobado por el receptor en el propio mensaje, y con un gemelo que emule la controladora: es decir, que responda con los mismos acuses y estados que la pasarela del robot real.

**Validación de la fidelidad.** No hay un protocolo común:
- error XYZ "mayoritariamente dentro de ±1 mm" en una tarea de soldadura [@chang2025construction];
- error absoluto del efector de 2,01 a 3,83 mm en tres ensayos, con un retardo de unos 0,07 s [@zhang2024construction];
- error articular del orden de 10⁻⁷ a 10⁻⁵ rad (máximo de 2,07·10⁻⁵ rad), con incoherencias en la tabla de la fuente [@liang2020bidirectional];
- latencia de 77,67 ± 15,74 ms y una "exactitud articular" del 99,99 % normalizada por 180°, que da porcentajes muy altos aun con errores de décimas de grado [@singh2024unity].

Ningún trabajo separa la **coherencia** del gemelo con lo que informa la controladora de la **fidelidad física** frente a una medida externa. mihali2005effective y kutzer2023scorbot no miden la fidelidad.

**Normas de mensajería.** Varias salvaguardas útiles entre un gemelo, una pasarela y un robot ya están en las normas:
- MQTT 3.1.1 define la última voluntad (LWT), que el broker publica si la conexión se cierra sin desconexión ordenada. También define la entrega QoS 1 "al menos una vez", que puede duplicar mensajes, y el indicador retain [@oasis2014mqtt].
- MQTT 5.0 añade el *Message Expiry Interval*, pero solo descarta los mensajes que aún no han empezado a entregarse desde el broker; no cubre el tiempo que pasa después en el cliente [@oasis2019mqtt].
- Sparkplug, normalizado como ISO/IEC 20237, registra un certificado de muerte del nodo como última voluntad y empareja nacimientos y muertes con un número de secuencia [@iso2023sparkplug]. El texto normativo no se ha leído; esto se toma de documentación secundaria.

**Seguridad en la capa de comunicación de los trabajos con manipuladores.** Lo publicado se agrupa en cuatro tipos:
- cifrado y autenticación: TLS en el broker MQTT [@luu2025enhancing; @ciungan2025enhancing] y VPN [@bray2024latency; @kumar2024scalable; @bravoarrabal2025iort];
- control de acceso: permisos MQTT y confirmación humana antes de ejecutar en el robot real [@bravoarrabal2025iort], y un único propietario de cada robot con traspaso al desconectarse [@hacesgarcia2024building];
- coherencia gemelo–robot: un umbral de desincronización que obliga a replanificar [@liang2020bidirectional; @chang2025construction];
- seguridad funcional apoyada en el gemelo: prevención de colisiones [@kuts2019digital] y validación de trayectorias en el gemelo [@kaarlela2023digital].

Kaarlela et al. cuentan que, al disparar las seguridades virtuales, se paraba el robot real, y tuvieron que separar ambos efectos [@kaarlela2023digital]. Es una muestra de lo delicado que es separar el gemelo del robot real. Chang et al. declaran un tratamiento tolerante a fallos ante retrasos de red o pérdida de datos, pero no describen el mecanismo ni lo ensayan [@chang2025construction]. Luu et al. son los únicos que evalúan empíricamente los niveles de QoS: con un 30 % de pérdidas emuladas, QoS 0 pierde un 2 % de los datos y QoS 1/2 mantienen la integridad [@luu2025enhancing].

En los trabajos de manipuladores no se ha encontrado cómo adaptar los mecanismos normalizados a una pasarela delante de una controladora sin red ni cómo verificarlos. En concreto:
- la caducidad que cubra también la cola de la pasarela;
- el descarte de duplicados de QoS 1 antes de un intérprete que ejecutaría dos veces un movimiento relativo;
- la comprobación del destino real/gemelo en el receptor.

## 6. Gemelos y laboratorios remotos en docencia

Formar con el gemelo antes de usar el robot real está bien asentado. El argumento es de disponibilidad y seguridad: la celda física admite pocos alumnos a la vez, unos 8 en [@erdei2022digital]. Se usan:
- la puesta en marcha virtual como competencia profesional [@azkarate2019virtual];
- la simulación en Gazebo antes del hardware en laboratorios remotos masivos con un UR5 (más de 2700 alumnos, unos 300 ms de latencia) [@kumar2024scalable];
- la simulación antes del hardware en un curso remoto con un robot didáctico heredado [@kutzer2023scorbot];
- laboratorios remotos con gemelo sincronizado por OPC UA [@pang2022remote] o por MQTT [@antonelli2023virtual].

La reutilización de robots antiguos en docencia existe, pero casi siempre sustituyendo la controladora [@conchasanchez2020recycling; @roldan2018enhancing]. kutzer2023scorbot es la excepción y la conserva.

La evaluación docente suele ser débil:
- satisfacción autodeclarada de más del 80 % con 64 alumnos, con una incoherencia en el número de respuestas (58 frente a 60) [@pang2022remote];
- 31 alumnos con estadística inferencial sobre percepciones [@ciungan2025enhancing];
- 10 voluntarios sin pruebas estadísticas [@erdei2022digital];
- valoraciones cualitativas anónimas [@kutzer2023scorbot].

El estudio más riguroso, con 70 alumnos y pre/post-test, no encontró ganancias de conocimiento significativas, aunque sí más motivación y utilidad percibida; la ficha avisa de incoherencias en sus tablas [@antonelli2023virtual]. Ciungan et al. comparten con este proyecto la arquitectura (Raspberry Pi como pasarela serie↔MQTT con TLS), pero sobre un brazo de servos de hobby [@ciungan2025enhancing]. No se ha encontrado ningún trabajo centrado en formación profesional.

## 7. Síntesis

Hay tres tendencias claras (detalle en `huecos.md`):
1. **MQTT** se usa ya como capa de mensajería entre gemelo y robot. En LAN, el transporte por sí solo no llega al milisegundo [@profanter2019opcua], y en lazo cerrado MQTT dio 2,5 ms frente a 10,1 ms de OPC UA, unos 30 ms menos en operación [@ariascachero2023operational]; se ha usado además en teleoperación y en gemelos docentes [@luu2025enhancing; @kaarlela2023digital; @liang2020bidirectional].
2. **Los gemelos sincronizados** de manipuladores son habituales, pero sobre controladoras con interfaz de red y estado continuo [@singh2024unity; @chang2025construction; @xiang2024development].
3. **En robots heredados** predomina sustituir la controladora [@roldan2018enhancing; @jokic2020two; @alvares2018retrofitting; @conchasanchez2020recycling]. Cuando se conserva, la controladora tiene interfaz de red [@holmes2025retrofitting] o la conexión es local [@kutzer2023scorbot; @mihali2005effective].

Las carencias comunes son estas:
- (a) no se ha encontrado ningún trabajo que conserve una controladora cuya única interfaz sea un puerto serie y la conecte a un protocolo IIoT estándar con medidas. Los antecedentes en esa línea son de 2005–2008 o se quedan en propuesta [@swider2007system; @foit2008web; @mihali2005effective; @patrao2025understanding];
- (b) los trabajos no invasivos con controladoras heredadas apenas miden; holmes2025retrofitting mide fallos y tiempo perdido, pero no latencia, y solo bray2024latency desglosa la latencia por tramos;
- (c) la fidelidad del gemelo se informa de forma heterogénea y nunca se separa la coherencia con la controladora de la fidelidad física; además, todos los gemelos se alimentan de estado continuo;
- (d) los mecanismos de mensajería existen en MQTT y Sparkplug, pero en manipuladores no se ha encontrado cómo adaptarlos a una controladora sin red ni cómo verificarlos. Lo publicado son cifrado, acceso y umbrales, y la única mención a retrasos [@chang2025construction] no se describe ni se ensaya.

Estas conclusiones se basan en una búsqueda sin acceso a las APIs bibliográficas. Por eso se formulan como "no se ha encontrado".

## 8. Posicionamiento del artículo

Según la taxonomía de Bilancia et al., el trabajo es un *external coordinator* [@bilancia2023overview]. Según la de Alqoud et al., es una solución de hardware IoT con pasarela [@alqoud2022industry]. La D/U-M1 del RV-M1 se conserva sin modificar, con su planificación y sus seguridades, y se gobierna por su RS-232C desde Python, desde un teach pendant de software y a través de una placa puente RS-232→MQTT. Gobernar el RV-M1 por RS-232 desde software no es nuevo [@swider2007system; @foit2008web; @mihali2005effective]: es la base habilitante. Las aportaciones son tres (detalle en `huecos.md` §3):

1. **Un gemelo digital** (aportación principal) que:
   - emula la controladora D/U-M1: acepta las mismas órdenes y responde con los mismos acuses y estados que la placa del robot real;
   - comparte el contrato con el robot en un bus pub/sub con varios clientes y comprobación del destino;
   - se sincroniza por eventos con una controladora que solo informa bajo petición (`WH`/`ER`);
   - tiene su fidelidad medida en unidades físicas, separando la coherencia con la controladora y la fidelidad física.

   La intercambiabilidad en sí tiene antecedentes, que se reconocen [@mihali2005effective; @kutzer2023scorbot; @zhang2024construction].
2. **La adaptación y la verificación por inyección de fallos de salvaguardas de mensajería conocidas** [@oasis2014mqtt; @oasis2019mqtt; @iso2023sparkplug] para una controladora serie sin interfaz de red:
   - última voluntad;
   - caducidad por marca de tiempo, comprobada también antes de escribir en la línea serie, porque el *Message Expiry* de MQTT 5 solo cubre el broker;
   - descarte de duplicados;
   - destino en el topic y en el payload;
   - ACK en dos fases.
3. **La caracterización medida de la cadena serie heredada**: latencia por tramos, con un solo reloj por equipo y tras verificar con un analizador cuándo responde la controladora, y robustez ante cortes. Las cifras de controladoras con interfaz de red sirven de comparación [@luu2025enhancing; @pontarolli2025analyzing; @bray2024latency].

Se diferencia de los trabajos invasivos sobre el mismo robot [@roldan2018enhancing; @ruiz2022caracterizacion; @castillo2020propuesta] en que no requiere electrónica de potencia nueva. Se diferencia del retrofit de controladoras heredadas con red [@holmes2025retrofitting] en el tipo de interfaz y en las medidas de latencia y fidelidad. Implementa y mide lo que un estudio de 2025 sobre un RV-2AJ deja sin hacer, la realimentación desde la controladora [@patrao2025understanding]. Una tarea de coger y dejar se usa solo como demostración funcional, no como medida de precisión.

---

## Versión para la introducción del artículo

*(Unas 650 palabras sin claves y 29 claves distintas, dentro del presupuesto de `redaccion-cientifica` para la Introducción (1100–1300 palabras) y de 25–35 referencias en total. El artículo no tiene sección de trabajos relacionados, así que este texto se integra en la Introducción. Las 8 claves nuevas están pendientes de verificación; las normas pueden ir en una nota o en la sección del protocolo si hace falta recortar.)*

La modernización (*retrofitting*) de equipos heredados es una alternativa a su sustitución para incorporarlos a la Industria 4.0, sobre todo en pymes y centros de formación [@alqoud2022industry; @sanchezlondono2023smart; @kolla2022retrofitting]. En los manipuladores se distinguen dos estrategias [@bilancia2023overview]: conservar la controladora original y gobernarla desde fuera (*external coordinator*) o sustituirla por un controlador abierto (*open controller*). En robots antiguos predomina la segunda, sobre todo cuando la controladora está averiada o se quiere enseñar control de bajo nivel: LinuxCNC en un ASEA IRB6-S2 [@alvares2018retrofitting], PC o FPGA en un PUMA 560 [@jokic2020two] o microcontroladores en robots didácticos [@conchasanchez2020recycling]. En el propio Mitsubishi RV-M1 se ha sustituido la controladora por una dSPACE con servoamplificadores propios [@roldan2018enhancing]. El precio es renunciar a la controladora original y a sus seguridades. Cuando se conserva, la controladora suele tener interfaz de red, incluso si es heredada: dos KUKA con controladoras KRC2 se han integrado mediante una Raspberry Pi y OPC UA, con medidas de fallos y tiempo perdido, pero sin latencias [@holmes2025retrofitting].

Para el RV-M1, la vía no invasiva se exploró entre 2005 y 2008, con simulación, programación fuera de línea y control remoto por RS-232 [@swider2007system; @foit2008web; @mihali2005effective], con tecnologías hoy obsoletas y sin medidas. Un estudio de 2025 sobre un RV-2AJ deja sin implementar la realimentación de estado desde la controladora en un gemelo digital [@patrao2025understanding].

En paralelo, MQTT se usa como capa de mensajería entre gemelo digital y manipulador. En LAN el transporte no llega al milisegundo [@profanter2019opcua] y, controlando un manipulador, MQTT dio 2,5 ms de latencia de lazo cerrado frente a 10,1 ms de OPC UA [@ariascachero2023operational], y se ha empleado en teleoperación con QoS y TLS [@luu2025enhancing] y en gemelos para formación [@kaarlela2023digital; @antonelli2023virtual; @liang2020bidirectional]. Sin embargo, estos gemelos se alimentan del estado continuo de controladoras con interfaz de red [@singh2024unity; @chang2025construction]. Su fidelidad se informa de forma heterogénea, en mm, en rad o como un porcentaje normalizado [@chang2025construction; @zhang2024construction; @liang2020bidirectional; @singh2024unity], y la latencia rara vez se desglosa por tramos [@bray2024latency]. La intercambiabilidad entre simulador y robot existe en entornos locales o mediante elección al conectar [@mihali2005effective; @kutzer2023scorbot; @zhang2024construction], pero no se ha encontrado sobre un bus pub/sub con comprobación del destino en el mensaje. Los mecanismos de mensajería que la harían segura (última voluntad, entrega con duplicados, caducidad en el broker, certificados de muerte) están normalizados [@oasis2014mqtt; @oasis2019mqtt; @iso2023sparkplug]. Pero en los trabajos sobre manipuladores las salvaguardas se limitan a cifrado, VPN, permisos o umbrales de desincronización [@luu2025enhancing; @bravoarrabal2025iort; @hacesgarcia2024building].

En la búsqueda realizada no se ha encontrado ningún trabajo que conserve una controladora cuya única interfaz sea un puerto serie, la conecte a un protocolo IIoT estándar con un gemelo digital y lo caracterice experimentalmente. Este artículo aborda ese hueco con un Mitsubishi Movemaster EX RV-M1 cuya controladora D/U-M1 se conserva sin modificar, gobernada por RS-232C desde Python y a través de una placa puente RS-232→MQTT. Sus aportaciones son:

- (i) un gemelo digital web que emula la controladora, comparte el contrato de mensajes con el robot real en un bus con varios clientes y comprobación del destino, y se sincroniza por eventos con una controladora que solo informa bajo petición; su fidelidad se mide en mm y grados frente a la posición que devuelve la controladora y, en varias poses, frente a una medida externa;
- (ii) la adaptación a una controladora serie, y su verificación por inyección de fallos, de salvaguardas de mensajería conocidas: caducidad comprobada también antes de la línea serie, descarte de duplicados, destino doble, acuse en dos fases y última voluntad;
- (iii) la caracterización de la cadena heredada: latencia desglosada por tramos y robustez ante cortes del broker y del enlace serie.

El resto del artículo describe la arquitectura, el gemelo y el protocolo, los experimentos y resultados, y las conclusiones.
