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
- La caducidad del contrato (`ts` en el payload, 500 ms) es una adaptación de la idea de *Message Expiry*: no es un mecanismo nuevo. La justificación de la v2 ("solo cubre el broker, no la cola de la placa") era **incompleta**: como el broker reenvía el intervalo reducido, la placa podría aplicar la caducidad restante con su reloj monótono. Ver la sección siguiente.

## Notas desde la línea revision-v2 (2026-11-25)
- Corrección pedida en la revisión v2 (menor N1). Razones correctas para usar `ts` en el payload y no el *Message Expiry Interval*:
  1. **Resolución.** El intervalo es un entero de cuatro bytes en **segundos** (§3.3.2.3.3), así que no puede expresar una caducidad de 500 ms.
  2. **Tramo publicador → broker.** La norma solo descuenta el tiempo que el mensaje espera en el servidor (el valor reenviado es el recibido menos esa espera); no cubre el tiempo que la orden ha pasado en el cliente ni en la red antes de llegar al broker (por ejemplo, en la cola de un cliente que reconecta).
  3. **Dependencia de la versión.** Exige que el broker, el cliente y la biblioteca MQTT de la placa hablen MQTT 5; con una biblioteca solo 3.1.1 la propiedad no existe. Enlaza con la elección de la placa, aún abierta.
- Lo que sí se aprovecha de la norma: como el broker reenvía el intervalo reducido, en la placa se puede combinar con el reloj monótono para la parte broker → ejecución. Se deja como alternativa futura si se fija una placa con MQTT 5; el contrato actual usa `ts` y paga el precio de sincronizar relojes (NTP o `/hora`, rechazo `reloj` por encima de 100 ms).
