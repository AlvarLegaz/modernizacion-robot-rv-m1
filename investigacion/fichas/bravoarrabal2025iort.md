# The IoRT-in-Hand: Tele-Robotic Echography and Digital Twins on Mobile Devices

- **Clave:** bravoarrabal2025iort
- **Referencia:** Bravo-Arrabal, J.; Cheng, Z.; Fernández-Lozano, J. J.; Gomez-Ruiz, J. A.; Schlette, C.; Savarimuthu, T. R.; Mandow, A.; García-Cerezo, A. (2025). The IoRT-in-Hand: Tele-Robotic Echography and Digital Twins on Mobile Devices. Sensors, 25(16), 4972.
- **DOI/URL:** https://doi.org/10.3390/s25164972
- **Tipo:** revista
- **Leído:** texto completo (página del editor, lectura parcial por longitud)
- **Línea:** gemelo-mqtt

## Problema que aborda
Teleoperación de un manipulador para ecografía remota a larga distancia (≈2300 km, España–Dinamarca) con realimentación visual 3D desde dispositivos móviles.

## Solución / arquitectura
- Equipo o robot: UR3 (Universal Robots) con un efector propio (IoRT-in-Hand: instrumento, cámara RGB con servos, sensor fuerza/par y mini-PC). Velocidad limitada a 30 mm/s en operación remota.
- ¿Mantiene la controladora original? sí (se usa el UR3 con su control; no es un retrofit).
- Comunicación / protocolo: MQTT (broker Mosquitto en la nube) + ROS, con puente ROS–MQTT alojado en la nube; app Android de código abierto; VPN ZeroTier entre nodos; 5G NSA en el lado del operador.
- Gemelo digital: sincronizado bidireccional (gemelo en VEROSIM, arquitectura Edge–Cloud), usado para control y realimentación visual 3D.
- Seguridad en la capa de comunicación: las órdenes MQTT se interpretan primero en el gemelo y solo se ejecutan en el robot real tras validarse por la capa ROS y con confirmación de una persona junto al robot; permisos de acceso MQTT que impiden a clientes externos modificar propiedades del gemelo; VPN. No se menciona TLS, QoS, retain, LWT ni temporizadores.

## Evaluación
- Métricas medidas: latencia en ensayos remotos: media 58 ms, mínima 43 ms, pico 318 ms; ping medio 116 ms en 2300 km. En otra sección se afirma "latencia de ida y vuelta media por debajo de 60 ms". [POR VERIFICAR: la relación exacta entre las cifras de ping y de latencia de aplicación no queda clara en el texto]. También avisos de fuerza, tiempos y un índice de desempeño φ; valoración con sujetos humanos.
- Tamaño de la muestra / repeticiones: ensayos RT1–RT3; nº de muestras de latencia y método de sincronización de relojes no indicado (los autores proponen un servicio ROS para sincronizar las medidas de RTT como trabajo futuro).

## Limitaciones (declaradas y observadas)
- Declaradas: latencias >400 ms en interiores con mala cobertura (obliga a reducir velocidad); dependencia del 5G; necesidad de VPN/redirección de puertos para ROS tras NAT; el vídeo RTSP añade hasta ~2 s; control de fuerza solo por umbral.
- Observadas: no hay medida de error de posición gemelo–robot; la medida de latencia no detalla extremos ni sincronización de relojes; el broker es una instancia pública sin cifrado descrito.

## Relación con nuestro trabajo
- Qué aprovechamos: patrón "la orden pasa primero por el gemelo" y confirmación humana antes del robot real; combinación MQTT+ROS como referencia de arquitectura; cifras de latencia de larga distancia como contexto.
- En qué nos diferenciamos: nuestro gemelo y robot real comparten exactamente el mismo contrato de mensajes y se seleccionan por el `destino` del topic y del payload (doble comprobación), con ACK en dos fases, rechazo de órdenes caducadas (>500 ms) y LWT; robot legado sin API moderna (RS-232) en lugar de un cobot actual.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
