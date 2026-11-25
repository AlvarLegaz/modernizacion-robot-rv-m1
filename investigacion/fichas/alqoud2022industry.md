# Industry 4.0: a systematic review of legacy manufacturing system digital retrofitting

- **Clave:** alqoud2022industry
- **Referencia:** Alqoud, A., Schaefer, D. y Milisavljevic-Syed, J. (2022). Industry 4.0: a systematic review of legacy manufacturing system digital retrofitting. Manufacturing Review, 9, art. 32.
- **DOI/URL:** https://doi.org/10.1051/mfreview/2022031
- **Tipo:** revista (revisión sistemática, acceso abierto CC BY 4.0)
- **Leído:** texto completo (secciones 2 y 4, vía página del editor)
- **Línea:** retrofit-heredados

## Problema que aborda
Muchas pymes no pueden sustituir sus sistemas de fabricación heredados; el alcance y el proceso del *retrofitting* digital están poco definidos en la literatura.

## Solución / arquitectura
Revisión sistemática de 32 trabajos (2015–2021, seis bases de datos). Identifica y compara tres enfoques de retrofit digital (sec. 4.3, tabla 5):
- *Starter kits* (12,5 %): sensores + conectividad + analítica empaquetados, sin conexión directa al sistema heredado.
- *Embedded streaming gateway* (25 %): se modifica el software del PLC para añadir conectividad; los autores señalan riesgo para las funciones de control.
- Soluciones basadas en hardware IoT (62,5 %): pasarelas y sensores añadidos para integración OT-IT; la más común y la más compleja por heterogeneidad de protocolos.
- Equipo o robot: genérico; los brazos robóticos industriales son el 2.º tipo de máquina más estudiado (16 %), tras CNC (50 %).
- ¿Mantiene la controladora original? depende del enfoque (sí en *starter kits* e IoT hardware; modificada en *embedded gateway*).
- Comunicación / protocolo: OPC (75 %, sin distinguir OPC UA), Modbus (39 %), Ethernet (36 %), MQTT (25 %), otros (AMQP, REST, SSH) 14 % (sec. 4.5, base de 28 trabajos). Pasarelas en el 88 % de los trabajos; Raspberry Pi y Arduino como ejemplos comerciales.
- Gemelo digital: no indicado como eje de la revisión.
- Seguridad en la capa de comunicación: no indicado de forma cuantitativa.

## Evaluación
- Métricas medidas: no aplica (revisión). La revisión no recoge cifras de coste del retrofit ni trata la latencia; cita OEE, disponibilidad y consumo como métricas que soportan los *starter kits*. Usos más frecuentes: monitorización del estado de la máquina (69 %), CPS (53 %), mantenimiento predictivo y control remoto (37,5 % cada uno).
- Tamaño de la muestra: 32 trabajos.

## Limitaciones (declaradas y observadas)
- Observada: la extracción de porcentajes muestra pequeñas incoherencias internas (p. ej. 28 de 32 trabajos presentado como 72 %).
- Observada: no hay comparación cuantitativa de prestaciones (latencia, disponibilidad) entre enfoques.

## Relación con nuestro trabajo
- Qué aprovechamos: la taxonomía de tres enfoques; nuestro puente RS-232→MQTT encaja en "solución basada en hardware IoT" sin tocar la controladora, evitando el riesgo del *embedded gateway*. Justifica que los brazos robóticos son un caso relevante pero minoritario frente a CNC.
- En qué nos diferenciamos: aportamos medidas de latencia/disponibilidad, que la revisión no recoge.

## Citas textuales útiles
- Ninguna literal registrada (no se anotó página).
