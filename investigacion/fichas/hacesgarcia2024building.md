# Building an Accessible and Flexible Multi-User Robotic Simulation Framework with Unity-MATLAB Bridge

- **Clave:** hacesgarcia2024building
- **Referencia:** Haces-Garcia, A.; Zhu, W. (2024). Building an Accessible and Flexible Multi-User Robotic Simulation Framework with Unity-MATLAB Bridge. Computers, 13(11), 282.
- **DOI/URL:** https://doi.org/10.3390/computers13110282
- **Tipo:** revista
- **Leído:** texto completo (página del editor, lectura parcial)
- **Línea:** gemelo-mqtt

## Problema que aborda
Entorno de simulación robótica multiusuario, abierto y accesible, utilizable como gemelo digital en industria y docencia.

## Solución / arquitectura
- Equipo o robot: brazo Meca500 y robot móvil Reeman.
- ¿Mantiene la controladora original? no indicado (el foco es la simulación).
- Comunicación / protocolo: comparan TCP/IP, memoria compartida, Firebase y MQTT (Node-RED como host, M2MQTT en Unity); MQTT y Firebase pasan a la segunda ronda; Photon (PUN) para multiusuario.
- Gemelo digital: simulación validada comparando movimiento y LIDAR simulados con los robots físicos.
- Seguridad en la capa de comunicación: límites de velocidad y rango articular en el simulador del Meca500; botón de parar todo y de reset a cero; un único propietario controla cada robot (sliders desactivados para los demás); la propiedad solo se cede con el robot parado; traspaso automático si el propietario se desconecta.

## Evaluación
- Métricas medidas: no se da latencia numérica de los métodos de comunicación; ≈100 ms de retardo en objetos no propios con PUN; 5 usuarios simultáneos durante 2 h; consumo de datos según frecuencia (recomiendan 10–50 Hz); MQTT vía Node-RED 0,1–0,4 % de CPU.
- Tamaño de la muestra / repeticiones: dos casos de estudio.

## Limitaciones (declaradas y observadas)
- Observadas: sin cifras de latencia de MQTT; la validación gemelo–robot es cualitativa.

## Relación con nuestro trabajo
- Qué aprovechamos: contexto docente multiusuario (similar a nuestro `<id_robot>` por alumno) y política de "un solo propietario" del robot, útil para el aula.
- En qué nos diferenciamos: el control del robot real pasa por un contrato explícito con ACK y rechazo motivado; medimos latencia y fidelidad cuantitativamente.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
