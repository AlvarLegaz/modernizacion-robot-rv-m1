# Digital Twin Prototypes for Supporting Automated Integration Testing of Smart Farming Applications

- **Clave:** barbie2024digital
- **Referencia:** Barbie, A., Hasselbring, W., Hansen, M. (2024). Digital Twin Prototypes for Supporting Automated Integration Testing of Smart Farming Applications. Symmetry, 16(2), 221.
- **DOI/URL:** https://doi.org/10.3390/sym16020221 (PDF leído en https://eprints.soton.ac.uk/488801/1/symmetry-16-00221-v2.pdf; preprint de este artículo: arXiv:2311.05748, "Enabling Automated Integration Testing of Smart Farming Applications via Digital Twin Prototypes" (corregido en revision-v3 según el verificador; arXiv:2401.07985 es otro trabajo, Barbie y Hasselbring, sobre la formalización del DTP, que no está en refs.bib); código: https://github.com/cau-se/DigitalTwinPrototypes, Apache 2.0)
- **Tipo:** revista
- **Leído:** texto completo (PDF del repositorio de Southampton)
- **Línea:** revision-v2 (definición de gemelo y emulación de interfaces de dispositivos)

## Problema que aborda
Probar de forma automática (integración continua) el software de sistemas embebidos y de sus gemelos digitales sin tener disponible el hardware físico, que en su caso de estudio agrícola solo se puede usar en temporada y falla con frecuencia.

## Solución / arquitectura
- Equipo o robot: no es un manipulador. Casos: observación oceánica (proyecto ARCHES, con RS232/RS485 y módems acústicos), un vehículo didáctico PiCar-X (ROS, Gazebo) y una barra de sensores de un tractor (SilageControl; prototipo no terminado al publicarse).
- ¿Mantiene la controladora original? n. a. (el prototipo sustituye el hardware en las pruebas; el software embebido es el mismo).
- Comunicación / protocolo: los controladores (*drivers*) se conectan a interfaces reales o emuladas sin cambiar la configuración. Para el puerto serie, un contenedor enlaza con Socat una conexión serie a un *socket* TCP, de modo que el software, en la capa de aplicación, no distingue un RS232 real de uno emulado (§2, p. 7). En el PiCar-X, GPIO e I2C se emulan con herramientas del núcleo de Linux (gpio-mockup, I2C-stub) y ros_control simula sensores y actuadores en Gazebo.
- Gemelo digital: define el **Digital Twin Prototype (DTP)** como el prototipo software de un gemelo físico, con su misma configuración pero con sensores y actuadores emulados (§2, p. 5); el DTP se puede conectar al gemelo digital correspondiente. Usa la clasificación de Kritzinger et al. (modelo sin intercambio automático, sombra con flujo automático en un sentido, gemelo con flujo en los dos) y sitúa el DTP como sustituto del sistema físico que alimenta de forma fiable una sombra digital; un modelo CAD por sí solo es un modelo digital (§2, pp. 2–3).
- Seguridad en la capa de comunicación: no indicado (los PLC solo aparecen como contexto, con observaciones sobre arquitecturas monolíticas y seguridad).

## Evaluación
- Métricas medidas: no hay resultados cuantitativos ni métricas de la integración continua. La única prueba descrita es la de integración del PiCar-X: comprobar que el vehículo simulado recorre unos 1 m con una tolerancia de 5 cm (tolerancia necesaria porque ROS Noetic no garantiza tiempo real). En ARCHES, el gemelo físico y el digital respondieron a las mismas órdenes difundidas en una misión de demostración; se describe una tubería GitLab CI/CD con pruebas SIL y PIL en tres arquitecturas ARM.
- Tamaño de la muestra / repeticiones: un caso con entrevista a un ingeniero de una pyme (SilageControl); evaluación cualitativa.

## Limitaciones (declaradas y observadas)
- Declaradas: un único caso de estudio, sin plan de investigación estricto y con relación previa con la empresa entrevistada; prototipo del tractor incompleto; modelo CAD de un vehículo parecido (PiCar-V); dependencia de modelos de calidad; el DTP no sustituye las pruebas de prestaciones, que requieren hardware equivalente al de producción; la mala documentación de los *drivers* queda fuera del enfoque.
- Observadas: no trata manipuladores ni controladoras industriales heredadas; la emulación serie es a nivel de transporte (Socat), no del intérprete de órdenes de un dispositivo; no mide la discrepancia entre el prototipo emulado y el sistema físico.

## Relación con nuestro trabajo
- Qué aprovechamos: es el **concepto publicado** del que el modo `emulador` es una aplicación. Nuestra pasarela habla con la controladora emulada solo por su interfaz de texto (`NT`, `DJ`, `ER`, `WH`…), igual que la placa por RS-232C, así que el software de la pasarela y los clientes no distinguen el gemelo del robot real salvo por el destino. También aporta la lectura de Kritzinger que usamos para nombrar los modos.
- En qué nos diferenciamos: medimos la **coherencia** del emulador con la controladora real (con parámetros congelados y programas de evaluación distintos de los de ajuste) y, por separado, su **fidelidad física** frente a una referencia externa, cosa que Barbie et al. no hacen. **No** se reivindica la idea de emular el dispositivo detrás de la misma interfaz (es suya) **ni** la emulación de la semántica de la controladora: la simulación de controladoras industriales con su software o su lenguaje es anterior (bernhardt1995realistic, bernhardt2002cost, keibel2002konzeption) y en el RV-M1 ya se interpretaba parte de su lenguaje (swider2007system, swider2007offline) (revisión v3, mayor 1; corregido en revision-v3).

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "A digital twin prototype (DTP) is the software prototype of a physical twin." (§2, p. 5)
