# Diseño e implementación de control a través de matrices de cinemática para el brazo robótico SCORBOT ER 4U ubicado en el Instituto Tecnológico de Costa Rica

- **Clave:** campos2019diseno
- **Referencia:** Campos Artavia, R. I. (2019). Diseño e implementación de control a través de matrices de cinemática para el brazo robótico SCORBOT ER 4U ubicado en el Instituto Tecnológico de Costa Rica. Informe de Proyecto de Graduación, Escuela de Ingeniería Electrónica, Instituto Tecnológico de Costa Rica (sede San Carlos).
- **DOI/URL:** https://core.ac.uk/download/250408441.pdf
- **Tipo:** tesis (proyecto de graduación de licenciatura)
- **Leído:** texto completo (PDF, primera parte)
- **Línea:** rvm1-similares

## Problema que aborda
El SCORBOT ER-4U del centro perdió su unidad de control original y solo tenía un control secuencial simple; se quiere recuperar el control cinemático para docencia e investigación.

## Solución / arquitectura
- Equipo o robot: SCORBOT ER-4U (5 articulaciones + deslizadera lineal, pinza neumática).
- ¿Mantiene la controladora original? no (no estaba disponible). Se conservan motores, sensores, encoders y una fuente de PC; se rehace el cableado.
- Hardware/software: Raspberry Pi 3 B+ con Python (numpy, sympy, threading, GPIO), expansor MCP23017, sensores optorreflectivos ITR8102, finales de carrera, encoders HEDS-9100 (512 CPR); interfaz en Processing; simulación en MATLAB; cinemática por Denavit-Hartenberg.
- Comunicación / protocolo: maestro-esclavo Python–Processing; control remoto por VNC (SSH y AWS IoT Greengrass descartados).
- Requisito: interfaz de órdenes al estilo MELFA BASIC 4.
- Gemelo digital: no.
- Seguridad en la capa de comunicación: no indicada (VNC).

## Evaluación
- Métricas: caracterización de componentes (motores, reducciones, encoders); de los sensores probados se recuperan dos y cuatro estaban averiados; algunos GPIO poco fiables. No se leyeron resultados de precisión del control en la parte revisada.
- Tamaño de la muestra / repeticiones: no indicado.

## Limitaciones (declaradas y observadas)
- Observadas: inconsistencias en especificaciones de motor; sensores averiados; trabajo de grado sin revisión por pares.

## Relación con nuestro trabajo
- Qué aprovechamos: ejemplo de recuperación de un robot didáctico comparable con Python y Raspberry Pi, y de que se quiera conservar un lenguaje de órdenes tipo MELFA.
- En qué nos diferenciamos: conservamos la controladora y su lenguaje real; añadimos mensajería IoT con seguridades en lugar de VNC.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae.
