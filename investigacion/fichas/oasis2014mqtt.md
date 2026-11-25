# MQTT Version 3.1.1 (norma de referencia)

- **Clave:** oasis2014mqtt
- **Referencia:** Banks, A., Gupta, R. (eds.) (2014). MQTT Version 3.1.1. OASIS Standard, 29 de octubre de 2014. Edición vigente: MQTT Version 3.1.1 Plus Errata 01, OASIS Standard Incorporating Approved Errata 01, 10 de diciembre de 2015.
- **DOI/URL:** http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.html (aprobación: https://www.oasis-open.org/?p=4424)
- **Tipo:** norma (especificación OASIS)
- **Leído:** secciones citadas (cabecera, §3.1.2.5, §3.3.1.1–3.3.1.3)
- **Línea:** revision-v1 (normas)

## Qué se usa de la norma
- **Última voluntad (Will Message, §3.1.2.5):** el broker guarda el mensaje al conectar y lo publica si la conexión se cierra sin DISCONNECT (fallo de red, *keep alive* vencido, cierre sin DISCONNECT o error de protocolo).
- **QoS 1 "al menos una vez" (§3.3.1.2):** los mensajes llegan, pero puede haber duplicados; el indicador DUP se pone a 1 en las retransmisiones (§3.3.1.1), y quien recibe DUP = 1 no puede suponer que ya lo recibió.
- **Retain (§3.3.1.3):** con RETAIN = 1 el broker guarda el último mensaje y lo entrega a los nuevos suscriptores; con RETAIN = 0 no lo guarda.

## Relación con nuestro trabajo
- El LWT (`online`), la entrega con QoS 1 y la política de comandos sin retain del contrato son **funciones estándar de MQTT**, no aportaciones. Lo que hace el contrato es usarlas y añadir, por encima, el descarte de `id` repetidos que exige QoS 1 (los duplicados son un comportamiento normal del protocolo).
