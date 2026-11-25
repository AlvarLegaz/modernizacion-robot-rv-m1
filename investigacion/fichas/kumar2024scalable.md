# Scalable and low-cost remote lab platforms: Teaching industrial robotics using open-source tools and understanding its social implications

- **Clave:** kumar2024scalable
- **Referencia:** Kumar, A., Jose, J., Jain, A., Kulkarni, S., Arya, K. (2025). Scalable and Low-Cost Remote Lab Platforms: Teaching Industrial Robotics Using Open-Source Tools and Understanding Its Social Implications. En Social Robotics (ICSR + AI 2024), LNCS, Springer Nature Singapore, pp. 202–215. (Versión publicada confirmada por `verificador-referencias` vía Crossref; preprint arXiv:2412.15369.)
- **DOI/URL:** https://doi.org/10.1007/978-981-96-3522-1_19 (preprint leído: https://arxiv.org/abs/2412.15369)
- **Tipo:** congreso (leído en su versión preprint)
- **Leído:** texto completo
- **Línea:** educacion-gemelos

## Problema que aborda
Dar acceso a robots industriales reales a miles de estudiantes a bajo coste mediante laboratorios remotos (competición e-Yantra, IIT Bombay).

## Solución / arquitectura
- Equipo o robot: UR5 montado sobre rover propio (Intel NUC, LIDAR 2D, IMU, cámara de profundidad), en invernadero (AAHS) y almacén (AWMS).
- ¿Mantiene la controladora original? sí (UR5).
- Comunicación / protocolo: Stack 1: ROS sobre VPN P2P (Husarnet), código en el lado del alumno, vídeo RTSP; Stack 2: ROS 2 con escritorio remoto (AnyDesk) sobre VPN, código en el host; portal web de reserva de turnos. Sin MQTT.
- Gemelo digital: no propiamente; simulación previa en Gazebo antes de pasar al hardware (los autores señalan el sim-to-real gap); RViz para visualización.
- Seguridad en la capa de comunicación: VPN, cuentas sin privilegios, cifrado de ficheros EncFS, revocación de acceso; además scripts de seguridad (colisión por LIDAR, paradas del UR5, límites de movimiento).

## Evaluación
- Métricas: latencia media ~300 ms y ~2 s de retraso de vídeo (Stack 1); 160 turnos de 1 h (Stack 1) y 355 h (Stack 2) de uso remoto del hardware; media de acceso de finalistas 19,4 h y 30,8 h; abandono >50 % en fases iniciales.
- Tamaño de la muestra / repeticiones: 1433 alumnos (373 equipos) y 1312 alumnos (349 equipos). Acceso al hardware: 14 equipos en el Stack 1; en el Stack 2 se preseleccionaron 38, pero **solo 36 recibieron acceso remoto**. *(Corregido: antes decía "llegaron 14 y 38".)* La duración es incoherente en la fuente (7 meses en el resumen, 6 en las contribuciones).

## Limitaciones (declaradas y observadas)
El operador debe reiniciar el entorno tras cada uso; configuración del host compleja. Observadas: sin evaluación formal de aprendizaje ni grupo de control; "implicaciones sociales" poco desarrolladas.

## Relación con nuestro trabajo
- Qué aprovechamos: flujo "simulación primero, hardware después" a gran escala y medidas de latencia/seguridad de acceso remoto como referencia.
- En qué nos diferenciamos: robot moderno con ROS; nosotros, robot heredado vía RS-232/MQTT y gemelo sincronizado.

## Citas textuales útiles
No se extrae cita textual.

## Correcciones tras la verificación (2026-11-25, respuesta a la revisión v1)
- Origen: `revisiones/verificacion_referencias.md`, punto 8 y tabla. Versión publicada (LNCS 2025) y apellido "Arya" corregidos; equipos con acceso al hardware: 14 y 36; duración incoherente en la fuente. Ya no se marca como NRP en la síntesis, porque hay versión revisada publicada.
