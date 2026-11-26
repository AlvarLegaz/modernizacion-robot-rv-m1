# Construction Method of a Digital-Twin Simulation System for SCARA Robots Based on Modular Communication

- **Clave:** zhang2024construction
- **Referencia:** Zhang, Z.; Guo, Q.; Grigorev, M. A.; Kholodilin, I. (2024). Construction Method of a Digital-Twin Simulation System for SCARA Robots Based on Modular Communication. Sensors, 24(22), 7183.
- **DOI/URL:** https://doi.org/10.3390/s24227183
- **Tipo:** revista
- **Leído:** texto completo (página del editor, lectura parcial)
- **Línea:** gemelo-mqtt

## Problema que aborda
Coste de probar en robots físicos y complejidad de programar el control de movimiento; proponen un gemelo de bajo coste multiplataforma.

## Solución / arquitectura
- Equipo o robot: SCARA de 4 GDL con eslabones impresos en 3D y Arduino (USB serie).
- ¿Mantiene la controladora original? no aplica (robot de construcción propia).
- Comunicación / protocolo: TCP/IP entre Unity3D y MATLAB (localhost) y serie entre Arduino y MATLAB. Sin MQTT ni OPC UA; ROS solo como palabra clave.
- Gemelo digital: sincronizado bidireccional. Una capa de comunicación modular con mensajes con código identificador de tipo y órdenes encapsuladas (`func_data`, `func_point`, …) permite controlar el robot virtual y el físico con las mismas sentencias.
- Seguridad en la capa de comunicación: módulo de aviso de límites articulares y seguimiento de trayectoria sobre el robot virtual; probar primero en simulación. Sin otros mecanismos formales.

## Evaluación
- Métricas medidas: retardo medio de recepción en tres ensayos: 0,0744 s, 0,0725 s y 0,0764 s; error absoluto de posición del efector en el robot físico: 2,01 mm, 3,83 mm y 2,94 mm; el retardo medio de mapeo baja 0,05 s frente a transmisión de tipo único. Ensayo de clasificación por color con trayectorias coincidentes (sin cifra).
- Tamaño de la muestra / repeticiones: tres ensayos por prueba.

## Limitaciones (declaradas y observadas)
- Observadas: robot de laboratorio de bajo coste, no industrial; comunicación local (no en red); sin mecanismos de seguridad en la capa de mensajería.

## Relación con nuestro trabajo
- Qué aprovechamos: es el antecedente más cercano a la idea de una misma interfaz de órdenes para gemelo y robot físico; formato de resultados (retardo de mapeo y error en mm).
- En qué nos diferenciamos: interfaz por MQTT en red (pub/sub, varios clientes) y no por sockets locales; robot industrial legado; seguridades en el contrato (destino, caducidad, ACK).

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
