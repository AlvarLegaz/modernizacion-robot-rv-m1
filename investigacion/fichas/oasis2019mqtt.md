# MQTT Version 5.0 (norma de referencia)

- **Clave:** oasis2019mqtt
- **Referencia:** Banks, A., Briggs, E., Borgendale, K., Gupta, R. (eds.) (2019). MQTT Version 5.0. OASIS Standard, 7 de marzo de 2019.
- **DOI/URL:** https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html (última versión: https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)
- **Tipo:** norma (especificación OASIS)
- **Leído:** secciones citadas (cabecera, §3.1.2.5, §3.1.3.2.2, §3.1.3.2.4, §3.3.2.3.3)
- **Línea:** revision-v1 (normas)

## Qué se usa de la norma
- **Message Expiry Interval (§3.3.2.3.3):** si vence el intervalo y el broker **aún no ha empezado a entregar** la copia a un suscriptor, debe borrarla; al entregarla, envía el intervalo reducido en el tiempo que el mensaje ha esperado en el broker. Sin la propiedad, el mensaje no caduca. La norma solo cubre la espera **en el broker**: no dice nada del tiempo que pasa después de entregarlo al cliente.
- **Will Message y Will Delay Interval (§3.1.2.5, §3.1.3.2.2):** el broker publica la última voluntad al cerrarse la conexión, tras el retardo configurado o al acabar la sesión; no la publica si el cliente se desconecta con DISCONNECT normal o reconecta antes de que venza el retardo.

## Relación con nuestro trabajo
- La caducidad del contrato (`ts` en el payload, 500 ms) es una adaptación de la idea de *Message Expiry*: no es un mecanismo nuevo. Se justifica usar `ts` y no la propiedad del protocolo porque el *expiry* solo cubre el tiempo en el broker, no la cola de la placa ni la espera hasta escribir en el RS-232 (el contrato v0.2 comprueba la caducidad al recibir y antes de escribir en la línea serie). El precio es depender de relojes sincronizados (NTP, rechazo con motivo `reloj` si el desfase supera 100 ms).
