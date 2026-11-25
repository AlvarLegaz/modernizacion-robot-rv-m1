# A Latency Composition Analysis for Telerobotic Performance Insights Across Various Network Scenarios

- **Clave:** bray2024latency
- **Referencia:** Bray, N.; Boeding, M.; Hempel, M.; Sharif, H.; Heikkilä, T.; Suomalainen, M.; Seppälä, T. (2024). A Latency Composition Analysis for Telerobotic Performance Insights Across Various Network Scenarios. Future Internet, 16(12), 457.
- **DOI/URL:** https://doi.org/10.3390/fi16120457
- **Tipo:** revista
- **Leído:** texto completo (página del editor, lectura parcial)
- **Línea:** gemelo-mqtt

## Problema que aborda
Descomponer la latencia del lazo de telerrobótica (vídeo al operador y órdenes al robot) en distintos escenarios de red.

## Solución / arquitectura
- Equipo o robot: Rethink Robotics Baxter, controlado por script Python sobre ROS usando su IK interna; mando de videojuego para órdenes cartesianas y de pinza.
- ¿Mantiene la controladora original? sí.
- Comunicación / protocolo: TCP para la medida extremo a extremo; ROS hacia el robot. Sin MQTT.
- Gemelo digital: no.
- Seguridad en la capa de comunicación: caja límite del espacio de trabajo, orden de recentrado, control de acceso por VPN; limitación a ≈4 órdenes/s en el enlace transatlántico para garantizar la ejecución de cada una.

## Evaluación
- Métricas medidas: RTT medio del lazo de control: LAN cableada 6,6 ms; Wi-Fi + VPN 58,4 ms; 4G + VPN 115,4 ms; Finlandia–EE. UU. + VPN 240,7 ms. Cámara: ≈100 ms de procesado por fotograma (≈200 ms total por Wi-Fi + VPN). Pérdidas: 0 de 70 000 paquetes en LAN; 3 de 5000 en transatlántico.
- Tamaño de la muestra / repeticiones: 70 000 paquetes (LAN), 5000 muestras (transatlántico).

## Limitaciones (declaradas y observadas)
- Declaradas: proponen UDP como trabajo futuro.
- Observadas: robot de investigación, no industrial; no usa MQTT.

## Relación con nuestro trabajo
- Qué aprovechamos: metodología de descomposición de la latencia por tramos (red, procesado, ejecución), aplicable a nuestro tramo MQTT + RS-232 + movimiento; justificación de que la VPN añade latencia.
- En qué nos diferenciamos: medimos la latencia con ACK de aplicación en dos fases y analizamos la ventana de caducidad de 500 ms frente a estas cifras de red.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
