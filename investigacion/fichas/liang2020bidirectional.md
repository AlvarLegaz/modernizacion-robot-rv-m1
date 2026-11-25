# Bi-Directional Communication Bridge for State Synchronization between Digital Twin Simulations and Physical Construction Robots

- **Clave:** liang2020bidirectional
- **Referencia:** Liang, C.-J.; McGee, W.; Menassa, C.; Kamat, V. (2020). Bi-Directional Communication Bridge for State Synchronization between Digital Twin Simulations and Physical Construction Robots. Proceedings of the 37th International Symposium on Automation and Robotics in Construction (ISARC), Kitakyushu, pp. 1480–1487.
- **DOI/URL:** https://doi.org/10.22260/ISARC2020/0205 (texto: https://par.nsf.gov/servlets/purl/10282926)
- **Tipo:** congreso
- **Leído:** texto completo
- **Línea:** gemelo-mqtt

## Problema que aborda
Sincronizar un gemelo digital online (ROS/Gazebo) con un robot físico para que el humano revise trayectorias antes de ejecutarlas, mejorando seguridad y confianza en robótica de construcción.

## Solución / arquitectura
- Equipo o robot: KUKA KR120 (6 ejes) sobre carril (el carril no se modela).
- ¿Mantiene la controladora original? sí (controlado mediante PLC e interfaz de sensores del robot).
- Comunicación / protocolo: ROS (Gazebo, rviz, MoveIt!/MATLAB) y puente MQTT entre el módulo virtual ROS y el PLC del robot, a 250 Hz; Ethernet hasta el PLC.
- Gemelo digital: sincronizado bidireccional.
- Seguridad en la capa de comunicación: algoritmo de comprobación de pose (PCA) que compara ángulos virtuales y físicos con un umbral y, si se supera, reinicia el objetivo a la pose actual y replanifica; control en modo relativo. La aprobación humana previa se plantea como trabajo futuro.

## Evaluación
- Métricas medidas: error articular medio entre 2,3·10⁻⁷ y 2,2·10⁻⁵ rad; máximos entre 2,8·10⁻⁷ y 7,0·10⁻⁶ rad (A3: 2,07·10⁻⁵ rad, inferior a su media, posible errata en la tabla). Latencia no cuantificada.
- Tamaño de la muestra / repeticiones: trayectoria virtual de 1500 puntos y 18 802 medidas físicas.

## Limitaciones (declaradas y observadas)
- Observadas: sin medidas de latencia; caso único de fabricación digital; aparente errata en la tabla de errores.

## Relación con nuestro trabajo
- Qué aprovechamos: precedente directo de puente MQTT entre gemelo ROS y robot industrial con comparación articular gemelo–robot y umbral de desincronización.
- En qué nos diferenciamos: nuestro robot no expone estado continuo (solo `WH` bajo demanda), por lo que la sincronización es por eventos; añadimos ACK, caducidad y separación real/gemelo por topic.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
