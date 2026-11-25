# Scalable and low-cost remote lab platforms: Teaching industrial robotics using open-source tools and understanding its social implications

- **Clave:** kumar2024scalable
- **Referencia:** Kumar, A., Jose, J., Jain, A., Kulkarni, S., Arva, K. (2024). Scalable and low-cost remote lab platforms: Teaching industrial robotics using open-source tools and understanding its social implications. Preprint arXiv:2412.15369; aceptado en la 16th International Conference on Social Robotics + AI (ICSR 2024) según los autores [POR VERIFICAR versión publicada y DOI de Springer].
- **DOI/URL:** https://arxiv.org/abs/2412.15369
- **Tipo:** preprint (aceptado en congreso)
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
- Tamaño de la muestra / repeticiones: 1433 alumnos (373 equipos) y 1312 alumnos (349 equipos); a hardware llegaron 14 y 38 equipos.

## Limitaciones (declaradas y observadas)
El operador debe reiniciar el entorno tras cada uso; configuración del host compleja. Observadas: sin evaluación formal de aprendizaje ni grupo de control; "implicaciones sociales" poco desarrolladas.

## Relación con nuestro trabajo
- Qué aprovechamos: flujo "simulación primero, hardware después" a gran escala y medidas de latencia/seguridad de acceso remoto como referencia.
- En qué nos diferenciamos: robot moderno con ROS; nosotros, robot heredado vía RS-232/MQTT y gemelo sincronizado.

## Citas textuales útiles
No se extrae cita textual.
