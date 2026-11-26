# Unity and ROS as a Digital and Communication Layer for Digital Twin Application: Case Study of Robotic Arm in a Smart Manufacturing Cell

- **Clave:** singh2024unity
- **Referencia:** Singh, M.; Kapukotuwa, J.; Gouveia, E. L. S.; Fuenmayor, E.; Qiao, Y.; Murry, N.; Devine, D. (2024). Unity and ROS as a Digital and Communication Layer for Digital Twin Application: Case Study of Robotic Arm in a Smart Manufacturing Cell. Sensors, 24(17), 5680.
- **DOI/URL:** https://doi.org/10.3390/s24175680
- **Tipo:** revista
- **Leído:** texto completo (página del editor, lectura parcial)
- **Línea:** gemelo-mqtt

## Problema que aborda
Construir un gemelo digital de un brazo industrial con herramientas abiertas y evaluar sus dos métricas clave: latencia y exactitud respecto al robot físico.

## Solución / arquitectura
- Equipo o robot: ABB IRB 1200-5/0.9 con IRC5 Compact (conectado por LAN; la controladora usa EtherNet/IP).
- ¿Mantiene la controladora original? sí.
- Comunicación / protocolo: ROS Noetic + MoveIt; Unity conectado por ROS-TCP-Connector (preferido frente a ROS# y ROS.NET por latencia). Sin MQTT ni OPC UA.
- Gemelo digital: sincronizado (estados articulares publicados por ambos en topics ROS); no queda claro si las mismas órdenes gobiernan indistintamente gemelo y robot.
- Seguridad en la capa de comunicación: no indicada (solo medidas físicas: zona delimitada con barreras).

## Evaluación
- Métricas medidas: latencia por marcas de tiempo de mensajes entre gemelo y robot: media 77,67 ms, desviación típica 15,74 ms, con picos esporádicos. Exactitud articular: 99,99 % global (99,91 % en Joint_2), definida como 1 − (error medio / 180°).
- Tamaño de la muestra / repeticiones: >5000 puntos de trayectoria para latencia; tres ciclos de 8 h con movimientos aleatorios registrados con rosbag para exactitud.

## Limitaciones (declaradas y observadas)
- Declaradas: solo condiciones estándar (sin variar carga ni calidad de red); robot nuevo; solo se simulan estados articulares (no velocidad, aceleración ni esfuerzo); recomiendan recalibrar.
- Observadas: la métrica de exactitud normaliza por 180°, lo que da porcentajes muy altos aun con errores de varias décimas de grado; no se reporta el error en mm del TCP.

## Relación con nuestro trabajo
- Qué aprovechamos: protocolo de medida de latencia por marcas de tiempo y comparación articular en ciclos largos; referencia de ~78 ms para un gemelo ROS–Unity.
- En qué nos diferenciamos: reportaremos el error en unidades físicas (mm y grados, con `WH` del propio robot) en vez de un porcentaje normalizado; MQTT en lugar de ROS; robot legado.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
