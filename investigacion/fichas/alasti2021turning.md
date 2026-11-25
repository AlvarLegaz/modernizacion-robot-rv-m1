# Turning a Legacy Robot to Collaborate to Fit in Industry 4.0 Demands

- **Clave:** alasti2021turning
- **Referencia:** Alasti, H. (2021). Turning a Legacy Robot to Collaborate to Fit in Industry 4.0 Demands. 2021 ASEE Virtual Annual Conference Content Access, Virtual Conference.
- **DOI/URL:** https://doi.org/10.18260/1-2--37941 — https://peer.asee.org/37941
- **Tipo:** congreso (educación en ingeniería)
- **Leído:** resumen (página ASEE PEER) + preprint relacionado arXiv:2102.12649 (texto completo)
- **Línea:** retrofit-heredados

## Problema que aborda
Sustituir robots industriales no colaborativos por cobots es caro; se propone añadirles sensórica, comunicación y red como transición a Industria 4.0, con fines también docentes.

## Solución / arquitectura
Proyecto en cuatro fases: sensores y comunicación inalámbrica; servidor web y recogida de datos; programación del brazo adaptada a IoT; control del brazo por PLC sobre IP. En el preprint relacionado (arXiv:2102.12649, "Adapting legacy robotic machinery to Industry 4.0: a CIoT experiment – version 1", mismo autor), un sensor ultrasónico en un ESP32 publica distancias en ThingSpeak (nube) y un controlador de automatización AMAX 5580, conectado al brazo MECA 500 por EtherCAT, consulta la nube y ralentiza/detiene el brazo.
- Equipo o robot: no nombrado en el resumen ASEE; MECA 500 en el preprint [POR VERIFICAR si es el mismo montaje].
- ¿Mantiene la controladora original? sí (se añade un controlador externo y sensores).
- Comunicación / protocolo: IP, Wi-Fi, servicio IoT en la nube (ThingSpeak), EtherCAT (preprint).
- Gemelo digital: no.
- Seguridad en la capa de comunicación: tratada de forma breve (preprint).

## Evaluación
- Métricas: en el preprint, precisión del sensor ~1 cm y alcance 5 m; no se mide latencia ni distancia de parada.
- Tamaño de la muestra: no indicado.

## Limitaciones (declaradas y observadas)
- Declarada (preprint): la latencia del sondeo en nube queda como trabajo futuro.
- Observada: no hay métricas de latencia ni de coste pese a defender el bajo coste; relevancia de seguridad funcional no demostrada.

## Relación con nuestro trabajo
- Qué aprovechamos: precedente de retrofit IoT de un robot heredado con orientación docente.
- En qué nos diferenciamos: usamos MQTT (pub/sub, QoS) en local en vez de sondeo a nube, conectamos por la interfaz nativa RS-232 y medimos latencia.

## Citas textuales útiles
- Ninguna.
