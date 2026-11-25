# An Overview of Industrial Robots Control and Programming Approaches

- **Clave:** bilancia2023overview
- **Referencia:** Bilancia, P., Schmidt, J., Raffaeli, R., Peruzzini, M. y Pellicciari, M. (2023). An Overview of Industrial Robots Control and Programming Approaches. Applied Sciences, 13(4), 2582.
- **DOI/URL:** https://doi.org/10.3390/app13042582
- **Tipo:** revista (revisión)
- **Leído:** texto completo (PDF del repositorio institucional cris.unibo.it)
- **Línea:** retrofit-heredados

## Problema que aborda
El control y la programación de los robots industriales limitan la flexibilidad y reconfigurabilidad que exige la fábrica moderna.

## Solución / arquitectura
Revisión de enfoques académicos y de fabricantes; analiza la estructura estándar de la controladora y clasifica alternativas de control externo:
- *External coordinator*: un intérprete en la controladora original traduce órdenes recibidas; la planificación de trayectorias sigue en la controladora original.
- *External trajectory generator*: se conserva la controladora, pero su módulo no tiempo real deja de planificar (p. ej. KUKA RSI, ABB EGM, Fanuc DPM).
- *Open controller*: sustitución parcial o total de la controladora (incluso accionamientos).
- Equipo o robot: múltiples fabricantes (KUKA, ABB, Fanuc, Stäubli, Yaskawa, Comau, Adept, Kawasaki…).
- ¿Mantiene la controladora original? según enfoque (sí / sí / no).
- Comunicación / protocolo: bus de campo, UDP o TCP/IP (mxAutomation, uniVAL…); TCP/IP en coordinadores académicos (pyadept, JOpenShowVar); serie o TCP/IP en la *toolbox* MATLAB RCV; UDP en RSI/EGM.
- Gemelo digital: no es el foco.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas recopiladas de la literatura: ciclos de RSI de 12 y 4 ms; ABB EGM con envío cada 4 ms y retardo de control de hasta 20 ms; Fanuc DPM 8 ms.
- Tamaño de la muestra: unos 200 trabajos en el primer cribado.

## Limitaciones (declaradas y observadas)
- Observada: centrada en controladoras modernas con interfaces de tiempo real; no trata controladoras antiguas con solo puerto serie ni protocolos IIoT (MQTT/OPC UA).

## Relación con nuestro trabajo
- Qué aprovechamos: taxonomía clave para posicionar nuestro enfoque como *external coordinator* (la D/U-M1 interpreta órdenes recibidas por RS-232 y mantiene su planificación), frente a *open controller* (sustitución, como alvares2018retrofitting).
- En qué nos diferenciamos: añadimos la capa IIoT (MQTT) y el gemelo sobre un coordinador externo para una controladora de los años 80, sin interfaz de tiempo real.

## Citas textuales útiles
- Ninguna literal registrada.
