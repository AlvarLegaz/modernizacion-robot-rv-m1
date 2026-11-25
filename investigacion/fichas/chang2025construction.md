# Construction and Validation of a Digital Twin-Driven Virtual-Reality Fusion Control Platform for Industrial Robots

- **Clave:** chang2025construction
- **Referencia:** Chang, W.; Sun, W.; Chen, P.; Xu, H. (2025). Construction and Validation of a Digital Twin-Driven Virtual-Reality Fusion Control Platform for Industrial Robots. Sensors, 25(13), 4153.
- **DOI/URL:** https://doi.org/10.3390/s25134153
- **Tipo:** revista
- **Leído:** texto completo (página del editor, lectura parcial)
- **Línea:** gemelo-mqtt

## Problema que aborda
Reducir la dificultad de programar robots industriales con lenguajes propietarios mediante una plataforma de gemelo digital con interfaz gráfica y órdenes modulares.

## Solución / arquitectura
- Equipo o robot: FANUC M-20iD/35 (repetibilidad declarada ±0,08 mm).
- ¿Mantiene la controladora original? sí.
- Comunicación / protocolo: socket TCP/IP (puerto 4003) con la librería FRRJIF.DLL. Sin MQTT, OPC UA ni ROS.
- Gemelo digital: sincronizado bidireccional (Unity3D; lectura de estado a 125 Hz y envío de órdenes por el mismo socket). Arquitectura en tres capas: física, digital y de fusión.
- Seguridad en la capa de comunicación: detección de "fuera de paso" comparando la desviación de posición con un umbral antes de enviar órdenes; tratamiento de retrasos o pérdida de datos; parada de emergencia, permisos por inicio de sesión y retorno a home; pruebas previas en Roboguide.

## Evaluación
- Métricas medidas: errores de posición X, Y, Z "mayoritariamente dentro de ±1 mm" en un ensayo de soldadura de una hélice de tres palas; errores articulares solo cualitativos. Latencia extremo a extremo no indicada (125 Hz es frecuencia de sondeo).
- Tamaño de la muestra / repeticiones: no indicado.

## Limitaciones (declaradas y observadas)
- Observadas: dependiente de una librería propietaria de FANUC; sin cifras de latencia; validación sobre una sola tarea.

## Relación con nuestro trabajo
- Qué aprovechamos: comprobación de desviación gemelo–robot frente a umbral antes de emitir la siguiente orden (idea transferible a nuestro gemelo); métrica de error en mm por eje.
- En qué nos diferenciamos: protocolo abierto (MQTT) en vez de librería del fabricante; robot legado de 5 GDL con RS-232; validación de órdenes en el puente (caducidad, destino, referenciado).

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
