# An Operational 5G Edge Cloud-Controlled Robotic Cell Environment based on MQTT and OPC UA

- **Clave:** ariascachero2023operational
- **Referencia:** Arias-Cachero Rincon, D.; Celik, A. E.; Zhang, W.; Rodriguez, I.; Cekirdek Yavuz, S.; Mogensen, P. (2023). An Operational 5G Edge Cloud-Controlled Robotic Cell Environment based on MQTT and OPC UA. 2023 21st International Conference on Advanced Robotics (ICAR), IEEE.
- **DOI/URL:** https://vbn.aau.dk/ws/files/661305137/Robotic_Cell_paper_ICAR_2023.pdf [POR VERIFICAR: DOI de IEEE Xplore; el número de artículo indicado es 10406936]
- **Tipo:** congreso
- **Leído:** texto completo (versión de repositorio)
- **Línea:** gemelo-mqtt

## Problema que aborda
Controlar un robot industrial desde un PLC virtualizado en el edge cloud a través de 5G y comparar MQTT y OPC UA como protocolos de control en condiciones operativas.

## Solución / arquitectura
- Equipo o robot: UR5e (6 GDL); tarea de martilleo simple.
- ¿Mantiene la controladora original? sí (solo se virtualiza el PLC, no la controladora del robot).
- Comunicación / protocolo: MQTT (QoS 0, vía broker) y OPC UA PubSub (periodo 10 ms); 5G frente a Ethernet.
- Gemelo digital: no.
- Seguridad en la capa de comunicación: no indicada (solo un umbral de 8,75·10⁻⁴ rad para dar por terminado un movimiento).

## Evaluación
- Métricas medidas: latencia mediana de lazo cerrado (CCLL): Ethernet 2 B: MQTT 2,5 ms / OPC UA 10,1 ms; Ethernet 1300 B: 10,9 / 16,6 ms; 5G 2 B: 12,1 / 25,3 ms; 5G 1300 B: 46,5 / 39,6 ms. En operación MQTT ≈30 ms más rápido que OPC UA; 5G añade ≈28 ms. Tiempo de ciclo: Ethernet 3,95 s (MQTT) y 4,32 s (OPC UA); 5G 4,30 s y 4,67 s (≈8–9 % más).
- Tamaño de la muestra / repeticiones: no indicado en lo leído.

## Limitaciones (declaradas y observadas)
- Observadas: solo QoS 0 en MQTT (sin entrega garantizada); sin mecanismos de seguridad; un único robot y tarea.

## Relación con nuestro trabajo
- Qué aprovechamos: comparación directa MQTT vs. OPC UA en control de un manipulador; muestra que MQTT es competitivo en latencia para control a nivel de movimiento; metodología de "latencia de lazo cerrado" a nivel de aplicación.
- En qué nos diferenciamos: usamos QoS 1 y ACK de aplicación; robot legado sin interfaz de red; añadimos gemelo intercambiable.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
