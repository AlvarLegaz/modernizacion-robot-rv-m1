# Recycling and Updating an Educational Robot Manipulator with Open-Hardware-Architecture

- **Clave:** conchasanchez2020recycling
- **Referencia:** Concha Sánchez, A., Figueroa-Rodríguez, J. F., Fuentes-Covarrubias, A. G., Fuentes-Covarrubias, R., Gadi, S. K. (2020). Recycling and Updating an Educational Robot Manipulator with Open-Hardware-Architecture. Sensors, 20(6), 1694.
- **DOI/URL:** https://doi.org/10.3390/s20061694 (PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC7146749)
- **Tipo:** revista
- **Leído:** texto completo (parcial: la sección de resultados experimentales no se pudo leer entera)
- **Línea:** educacion-gemelos

## Problema que aborda
Recuperar un brazo educativo ED7220C (ED Corporation, 5 GDL con pinza) cuya controladora cerrada estaba averiada, para reutilizarlo en docencia de robótica y control.

## Solución / arquitectura
- Equipo o robot: ED7220C; se conservan mecánica y motores DC con encoders ópticos.
- ¿Mantiene la controladora original? no (se sustituye por arquitectura abierta: 2 Arduino Mega, drivers L298N, MATLAB-Simulink con control PID con anti-windup y observador de velocidad).
- Comunicación / protocolo: USB entre Arduinos y PC; Simulink envía PWM en tiempo real vía Arduino IO Toolbox. Se añaden webcam (visión), sensor de fuerza y sensor flex.
- Gemelo digital: no.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: convergencia de la estimación de parámetros del actuador de base en ~1 s; visión a 0,955 mm/píxel y 5 FPS; alcance ~400 mm; coste de componentes principales ~230 USD; recogida de objeto sin colisión verificada experimentalmente (según resumen).
- Tamaño de la muestra / repeticiones: no indicado. Uso docente en el laboratorio de Robótica de la Universidad de Colima (Colima confirmado por la verificación). *(Retirado "3 TFG y talleres internos": no se localizó en las partes leídas por el verificador; no respaldado.)*

## Limitaciones (declaradas y observadas)
Control descentralizado sin modelo dinámico; fricción y holgura no modeladas; visión limitada a área pequeña y objetos rojos/amarillos; beneficio docente sin medir.

## Relación con nuestro trabajo
- Qué aprovechamos: precedente directo de reutilización de un manipulador educativo antiguo con fines docentes y de bajo coste.
- En qué nos diferenciamos: ellos sustituyen la controladora (invasivo); nosotros la mantenemos y nos comunicamos por su RS-232 original (no invasivo), y añadimos MQTT y gemelo.

## Citas textuales útiles
No se extrae cita textual.

## Correcciones tras la verificación (2026-11-25, respuesta a la revisión v1)
- Origen: `Investigacion/Revisiones/verificacion_referencias.md`, punto 12. Retirado el uso docente en "3 TFG y talleres" hasta localizarlo en el texto completo.
