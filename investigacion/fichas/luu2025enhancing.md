# Enhancing real-time robot teleoperation with immersive virtual reality in industrial IoT networks

- **Clave:** luu2025enhancing
- **Referencia:** Luu, T., Nguyen, Q., Tran, T., Tran, M., Ding, S., Kua, J., …, Hoang, T. (2025). Enhancing real-time robot teleoperation with immersive virtual reality in industrial IoT networks. The International Journal of Advanced Manufacturing Technology, 139(11), 6233–6257. [POR VERIFICAR: lista completa de autores; la página del editor la muestra truncada]
- **DOI/URL:** https://doi.org/10.1007/s00170-025-16236-w
- **Tipo:** revista
- **Leído:** texto completo (parcial, ~2/3 vía página del editor)
- **Línea:** retrofit-heredados, gemelo-mqtt

## Problema que aborda
Teleoperación en tiempo real de robots industriales a larga distancia sobre redes IIoT, con realimentación inmersiva.

## Solución / arquitectura
Los movimientos de la mano del operador (mando VR) se publican por MQTT a un *broker* (Mosquitto 2.0.15) y se transmiten al robot; vídeo por WebRTC.
- Equipo o robot: ABB IRB1200, controladora IRC5 Compact.
- ¿Mantiene la controladora original? sí (programa RAPID cargado en la IRC5; interfaz EGM sobre UDP con Protocol Buffers).
- Comunicación / protocolo: MQTT con JSON, usuario/contraseña, TLS 1.2, QoS 0/1/2; WebRTC (SRTP); EGM/UDP cada 4 ms.
- Gemelo digital: visualización en VR (Unity) con realimentación de articulaciones.
- Seguridad en la capa de comunicación: TLS 1.2 + autenticación en MQTT; SRTP en vídeo.

## Evaluación
- Latencia media en LAN: QoS0 139,3 ms; QoS1 94,7 ms; QoS2 101,3 ms. En WAN: QoS0 158 ms; QoS1 99 ms; QoS2 146 ms.
- Precisión local: error < 22 mm en los tres ejes (mayor en Z).
- Escalabilidad: con 100 robots la latencia media supera 1 s (QoS0 1135 ms); límite práctico ~50 robots en su banco.
- Pérdida emulada 30 %: QoS0 pierde ~2 % de datos; QoS1/2 mantienen integridad.
- Tasas: guiado 60 Hz (~46,8 kbps); realimentación 250 Hz (~131,2 kbps).
- Tamaño de la muestra: no anotado [POR VERIFICAR].

## Limitaciones (declaradas y observadas)
- Declarada: entorno de red de prueba limitado; error de seguimiento afectado por limitaciones del hardware.
- Observada: controladora moderna con interfaz de tiempo real (EGM), no un equipo heredado.

## Relación con nuestro trabajo
- Qué aprovechamos: metodología de medida de latencia extremo a extremo por nivel de QoS MQTT y con emulación de pérdidas; valores de referencia para comparar.
- En qué nos diferenciamos: controladora de los 80 accesible solo por RS-232 (sin EGM), donde el cuello de botella previsible es el enlace serie y el intérprete de la controladora, no la red.

## Citas textuales útiles
- Ninguna literal registrada.
