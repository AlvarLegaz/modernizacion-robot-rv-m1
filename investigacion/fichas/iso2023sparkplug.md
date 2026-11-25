# ISO/IEC 20237:2023 Information technology — Sparkplug® version 3.0 (norma de referencia)

- **Clave:** iso2023sparkplug
- **Referencia:** ISO/IEC (2023). ISO/IEC 20237:2023 Information technology — Sparkplug® version 3.0. Ed. 1, 18 de octubre de 2023. (Especificación de origen: Eclipse Foundation, Sparkplug 3.0, https://sparkplug.eclipse.org/specification/version/3.0/)
- **DOI/URL:** https://www.iso.org/standard/86204.html (metadatos leídos en https://committee.iso.org/es/sites/isoorg/contents/data/standard/08/62/86204.html)
- **Tipo:** norma
- **Leído:** ficha de catálogo de ISO (alcance) y documentación secundaria de Eclipse Kura sobre Sparkplug. **No se ha leído el texto normativo** (de pago; el PDF de Eclipse redirige a la página del proyecto).
- **Línea:** revision-v1 (normas)

## Qué se usa de la norma
- Alcance (ISO): define la estructura y los requisitos de implementación de clientes MQTT conformes con Sparkplug (nodos *edge* y aplicaciones *host*).
- Según la documentación de Eclipse Kura (fuente secundaria): el nodo *edge* registra al conectar una última voluntad con un certificado de muerte (NDEATH), que el broker publica si vence el *keep alive*; el primer mensaje de la sesión es el de nacimiento (NBIRTH); un número de secuencia de nacimiento/muerte (bdSeq) empareja cada NDEATH con su NBIRTH, y la aplicación marca los datos como obsoletos (STALE). El número de secuencia por mensaje (`seq`) no se ha comprobado [POR VERIFICAR en el texto normativo].

## Relación con nuestro trabajo
- Sparkplug ya resuelve sobre MQTT la detección de caída de nodos (LWT + certificados de muerte) y el estado de sesión. Nuestro `online` con LWT es la versión mínima de esa idea, no una aportación. Se cita para reconocerlo y para justificar por qué no se adopta Sparkplug completo: el contrato necesita semántica de órdenes a un manipulador (ACK en dos fases, caducidad, destino real/gemelo), y Sparkplug está orientado a métricas de dispositivos.
