# ISO/IEC 20237:2023 Information technology — Sparkplug® version 3.0 (norma de referencia)

- **Clave:** iso2023sparkplug
- **Referencia:** ISO/IEC (2023). ISO/IEC 20237:2023 Information technology — Sparkplug® version 3.0. Ed. 1, 18 de octubre de 2023. (Especificación de origen: Eclipse Foundation, Sparkplug 3.0, https://sparkplug.eclipse.org/specification/version/3.0/)
- **DOI/URL:** https://www.iso.org/standard/86204.html (metadatos leídos en https://committee.iso.org/es/sites/isoorg/contents/data/standard/08/62/86204.html)
- **Tipo:** norma
- **Leído:** ficha de catálogo de ISO (alcance) y, como fuente primaria, el primer tercio de la especificación de Eclipse Sparkplug 3.0.0 (§2.4 y §4.2.1; ronda revision-v2). **No se ha leído el texto de ISO/IEC 20237** (de pago) ni comprobado que coincida con el de Eclipse. La documentación de Eclipse Kura se usó al principio como fuente secundaria y queda sustituida por la especificación en lo que esta cubre. (Cabecera actualizada en revision-v3, menor N3-9.)
- **Línea:** revision-v1 (normas)

## Qué se usa de la norma
- Alcance (ISO, ficha de catálogo): define la estructura y los requisitos de implementación de clientes MQTT conformes con Sparkplug (nodos *edge* y aplicaciones *host*).
- Según la especificación de Eclipse Sparkplug 3.0.0 (fuente primaria leída; detalle en la nota revision-v2):
  - §2.4: los certificados de muerte del nodo se registran siempre en el CONNECT como mensaje de última voluntad (NDEATH).
  - §4.2.1: el NBIRTH debe llevar la métrica `bdSeq`, igual a la del Will del CONNECT, que empieza en 0 y aumenta en cada CONNECT; así se empareja cada NDEATH con su NBIRTH. El NDEATH solo lleva `bdSeq`.
  - §4.2.1: `seq` vale 0 en el NBIRTH y aumenta en uno en cada NDATA, volviendo a 0 tras 255 (rango deducido de esa regla; el texto no dice "0–255").
- No se usa nada que solo venga de Eclipse Kura (p. ej., el marcado STALE en la aplicación). No se ha comprobado que el texto de ISO/IEC 20237 coincida con el de Eclipse 3.0.0. (Cuerpo actualizado en revision-v4, menor N4-8.)

## Notas desde la línea revision-v2 (2026-11-25): lectura de la especificación de Eclipse
- Se ha leído como fuente primaria la especificación de Eclipse Sparkplug 3.0.0 (https://sparkplug.eclipse.org/specification/version/3.0/documents/sparkplug-specification-3.0.0.pdf; leída la primera parte del PDF, hasta el carácter 100 000 de unos 311 000). Sustituye a la documentación secundaria de Kura en lo siguiente (revisión v2, menor N10):
  - §2.4: los certificados de muerte "are always registered in the MQTT CONNECT packet as the MQTT Will Message" (texto descriptivo).
  - §4.2.1, NBIRTH: debe incluir la métrica `bdSeq`, que debe coincidir con la del Will Message del CONNECT y empezar en cero e incrementarse en cada nuevo CONNECT ([tck-id-topics-nbirth-bdseq-included], [-matching], [-increment]).
  - §4.2.1, NDEATH: solo lleva la métrica `bdSeq` y no lleva número de secuencia.
  - §4.2.1, NDATA: `seq` aumenta en uno y vuelve a 0 tras 255; en NBIRTH vale 0. El texto no dice literalmente "0–255"; se deduce de esa regla.
- No se ha comprobado que el texto de ISO/IEC 20237:2023 sea idéntico al de Eclipse 3.0.0; el título de ISO dice "Sparkplug version 3.0". En el artículo conviene citar la norma ISO y decir que se ha consultado la especificación de Eclipse, o citar esta directamente (decisión de `verificador-referencias`).

## Relación con nuestro trabajo
- Sparkplug ya resuelve sobre MQTT la detección de caída de nodos (LWT + certificados de muerte) y el estado de sesión. Nuestro `online` con LWT es la versión mínima de esa idea, no una aportación. Se cita para reconocerlo y para justificar por qué no se adopta Sparkplug completo: el contrato necesita semántica de órdenes a un manipulador (ACK en dos fases, caducidad, destino real/gemelo), y Sparkplug está orientado a métricas de dispositivos.
