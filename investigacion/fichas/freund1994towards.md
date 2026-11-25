# Towards realistic simulation of robotic workcells

- **Clave:** freund1994towards
- **Referencia:** Freund, E., Rossmann, J., Uthoff, J. y van der Valk, U. (1994). Towards realistic simulation of robotic workcells. En Proceedings of the IEEE/RSJ/GI International Conference on Intelligent Robots and Systems (IROS '94), Múnich, pp. 39–46. IEEE.
- **DOI/URL:** https://doi.org/10.1109/IROS.1994.407411 (metadatos y resumen en search.isc.ac/inventory/49/292408.htm y manuscript.isc.ac; páginas 39–46 e ISBN 0-7803-1933-8 según researchr.org/publication/FreundRUV94)
- **Tipo:** congreso
- **Leído:** solo resumen y palabras clave
- **Línea:** revision-v3 (simulación de celdas con controladora industrial integrada; COSIMIR)

## Problema que aborda
Simulación realista de celdas robóticas industriales (robots, AGV, cintas, sensores) para programación *off-line* y diseño de la disposición de la celda.

## Solución / arquitectura
- Equipo o robot: genérico (celdas con robots industriales).
- ¿Mantiene la controladora original? El resumen describe "la integración de una controladora de robot industrial en el sistema de simulación" mediante una interfaz basada en mensajes. No dice si es la controladora física o su software.
- Comunicación / protocolo: interfaz propia basada en mensajes.
- Gemelo digital: simulación (modelo) con controladora integrada; visualización 3D en tiempo real.
- Seguridad en la capa de comunicación: no indicado.
- **Relación con COSIMIR:** el resumen no nombra COSIMIR. La tesis keibel2002konzeption (Universidad de Dortmund) cita este trabajo, junto con la tesis de Uthoff (1997), como referencia del sistema COSIMIR ("Cell Oriented SImulation of Industrial Robots") del Institut für Roboterforschung. La asociación con COSIMIR procede, por tanto, de keibel2002konzeption.

## Evaluación
- Métricas medidas: no indicado en el resumen.
- Tamaño de la muestra: no indicado.

## Limitaciones (declaradas y observadas)
- Observadas: solo se ha leído el resumen; no se sabe si mide la diferencia entre simulación y celda real.

## Relación con nuestro trabajo
- Qué aprovechamos: referencia revisada por pares del origen de la simulación de celdas con controladora integrada en la línea de Dortmund (COSIMIR). Junto con keibel2002konzeption y bernhardt1995realistic/bernhardt2002cost, establece que **emular la controladora dentro de la simulación es práctica consolidada desde los años 90** (revisión v3, mayor 1).
- En qué nos diferenciamos: no se reivindica la emulación de la controladora. Lo que se aporta es la coherencia medida de un emulador abierto frente a la controladora real de un modelo antiguo, con parámetros congelados y programas de evaluación distintos de los de ajuste.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "a versatile message-based interface" (resumen) — usar como paráfrasis.
