# Retrofitting legacy systems for industry 4.0 via OPC UA and distributed control

- **Clave:** holmes2025retrofitting
- **Referencia:** Holmes, N., Katavich, L., Xu, X. (2025). Retrofitting legacy systems for industry 4.0 via OPC UA and distributed control. Manufacturing Letters, 44 (Supplement), 1337–1348.
- **DOI/URL:** https://doi.org/10.1016/j.mfglet.2025.06.153 (leído en https://www.sciencedirect.com/science/article/pii/S2213846325001865; acceso abierto, CC BY-NC-ND)
- **Tipo:** revista (número de actas de congreso en Manufacturing Letters)
- **Leído:** texto completo (página del editor)
- **Línea:** revision-v1 (segunda ronda; retrofit no invasivo de manipuladores heredados)

## Problema que aborda
Modernizar a bajo coste máquinas heredadas de fabricación (relevante para pymes) con un marco general, ya que los retrofits previos se centran en un aspecto o en un tipo concreto de máquina.

## Solución / arquitectura
- Equipo o robot: celda del laboratorio LISMS (Universidad de Auckland) con dos KUKA (KR10 y KR16) con controladora **KRC2**, y dos transportadores.
- ¿Mantiene la controladora original? sí. La KRC2 es tan antigua que no admite RSI; Ethernet KRL no estaba instalado por presupuesto. Se usa el paquete KUKA.OPC Server ya configurado en ambas controladoras.
- Comunicación / protocolo: una Raspberry Pi 5 ejecuta un cliente **OPC XML-DA** propio (no encontraron biblioteca Python libre y actualizada; reprodujeron las peticiones SOAP observadas con Wireshark) hacia las KRC2. Cada dispositivo expone un servidor **OPC UA** (patrón servidor a servidor con clientes embebidos); los robots siguen la especificación OPC UA Robotics. Arquitectura en tres capas (activo, integración, comunicación) basada en RAMI 4.0, con control modular y distribuido. Otras Raspberry Pi hacen de pasarela para transportadores, sensores y cámaras.
- Gemelo digital: no indicado en lo leído.
- Seguridad en la capa de comunicación: no indicado en lo leído. Las acciones que cambian el estado se exponen como métodos y las variables son de solo lectura. Los autores señalan que RSI suele ignorar sistemas de seguridad como la velocidad máxima.

## Evaluación
- Métricas medidas: tasa de fallos de pick/place del 8,3 % (KR10) y 15,4 % (KR16), atribuidos sobre todo al seguimiento de objetos; los retardos supusieron el 13,9 % del tiempo de funcionamiento del bucle, la mitad por caídas de la conexión OPC XML-DA con los KUKA y la otra mitad por errores en la invocación de métodos.
- No se da latencia medida en milisegundos (los 12 ms que aparecen son el periodo de interpolación de RSI, no una medida).
- Tamaño de la muestra / repeticiones: unos siete ciclos completos del bucle.

## Limitaciones (declaradas y observadas)
- Declaradas: problemas encontrados en la implementación (caídas de OPC XML-DA, errores de invocación de métodos, seguimiento de objetos).
- Observadas: muestra pequeña; sin latencias; controladoras heredadas pero con interfaz de red (OPC sobre Ethernet), no solo puerto serie.

## Relación con nuestro trabajo
- Qué aprovechamos: es el antecedente más próximo de **manipulador industrial heredado con su controladora conservada, conectado a un protocolo IIoT estándar mediante una Raspberry Pi**; da cifras de fiabilidad de la cadena (fallos y tiempo perdido) y muestra que la conexión con la controladora heredada es la fuente principal de retardos.
- En qué nos diferenciamos: la KRC2 ofrece interfaz de red (OPC sobre Ethernet); la D/U-M1 solo tiene RS-232C y un intérprete de órdenes. Nosotros usamos MQTT, no OPC UA; medimos latencia por tramos; añadimos un gemelo que comparte el contrato. **Invalida** la frase "los trabajos que conservan la controladora usan controladoras modernas": hay que decir "controladoras con interfaz de red, aunque sean heredadas".

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
