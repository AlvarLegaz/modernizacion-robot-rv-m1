# OPC UA versus ROS, DDS, and MQTT: Performance Evaluation of Industry 4.0 Protocols

- **Clave:** profanter2019opcua
- **Referencia:** Profanter, S.; Tekat, A.; Dorofeev, K.; Rickert, M.; Knoll, A. (2019). OPC UA versus ROS, DDS, and MQTT: Performance Evaluation of Industry 4.0 Protocols. 2019 IEEE International Conference on Industrial Technology (ICIT), Melbourne, pp. 955–962.
- **DOI/URL:** https://doi.org/10.1109/ICIT.2019.8755050 (texto: https://mediatum.ub.tum.de/doc/1470362/file.pdf)
- **Tipo:** congreso
- **Leído:** texto completo
- **Línea:** gemelo-mqtt

## Problema que aborda
Comparar prestaciones y características de los protocolos usados en Industria 4.0 y robótica: OPC UA (cliente/servidor y Pub/Sub), ROS, DDS y MQTT.

## Solución / arquitectura
- Equipo o robot: no aplica (banco de pruebas de comunicación: dos PC i7-8700K, Ubuntu con PREEMPT-RT, switch gigabit).
- ¿Mantiene la controladora original? no aplica.
- Comunicación / protocolo: open62541 (OPC UA), ROS Kinetic, eProsima Fast RTPS (DDS), Eclipse Paho MQTT C; referencias TCP y UDP en bruto.
- Gemelo digital: no.
- Seguridad en la capa de comunicación: no evaluada; describe el QoS básico de MQTT pero no compara niveles.

## Evaluación
- Métricas medidas: RTT medio con carga útil de 2 B (µs), eco en reposo: OPC UA C/S 520; OPC UA Pub/Sub 590; MQTT 584; ROS 618; DDS 726; TCP 250; UDP 241. Con carga de CPU MQTT sube a 912 µs; con carga de red todos superan ~875 µs. MQTT presenta más valores atípicos. Prueba de 500 nodos: OPC UA C/S el más rápido; ROS consumió 60 de 64 GB de RAM; Fast RTPS no pasó de ~100 nodos.
- Tamaño de la muestra / repeticiones: 5000 peticiones por ensayo, cargas de 2 B a 32 768 B.

## Limitaciones (declaradas y observadas)
- Declaradas: no se probaron redes inalámbricas ni otras implementaciones del mismo protocolo.
- Observadas: no se mide el broker MQTT ni el efecto del QoS; red cableada ideal; resultados de 2019.

## Relación con nuestro trabajo
- Qué aprovechamos: cifra de referencia de que el transporte (sub-milisegundo en LAN) es despreciable frente a los tiempos del RS-232 y del propio movimiento del RV-M1; argumento de que MQTT es ligero pero con mayor dispersión.
- En qué nos diferenciamos: medimos latencia extremo a extremo de aplicación (orden → ACK aceptado → ACK hecho), incluyendo el puente serie.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
