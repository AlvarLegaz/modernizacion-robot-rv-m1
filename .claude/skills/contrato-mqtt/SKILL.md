---
name: contrato-mqtt
description: Resumen operativo del contrato MQTT del RV-M1 (topics real/gemelo, comandos, ACK, estado, posición, seguridades). Usar al implementar el puente, el pendant MQTT, el gemelo o cualquier cliente.
---

# Contrato MQTT

Documento de referencia (manda sobre este resumen): `Docu/contrato_mqtt.md`.

- Prefijo: `rvm1/<destino>/<id>/` con destino `real` o `gemelo`.
- La aplicación **solo publica** en `comandos`. La placa (o el gemelo) publica `comandos/ack`, `actuadores`, `posicion/mundo` y `online` (LWT).
- `comandos`: QoS 1, **nunca retain**. JSON con `id`, `ts` (ms), `destino`, `cmd`, `args`.
- Rechazos: `formato`, `caducado` (> 500 ms, comprobado al recibir y al ejecutar), `destino`, `no_referenciado`, `error_activo` (solo se aceptan `reset` y luego `home`), `desconectado`, `reloj` (desfase > 100 ms).
- Duplicados: un `id` repetido no se ejecuta; se reenvía el ACK ya dado.
- `parar` vacía la cola pero no detiene el movimiento en curso.
- Broker con usuario/contraseña y ACL por topic; TLS si la red no está aislada.
- ACK en dos fases: `aceptado`/`rechazado` al recibir; `hecho`/`error` al terminar (según `ER`).
- `actuadores` (retain, ≥ 1 Hz) y `posicion/mundo` (retain, cada movimiento y cada 500 ms en reposo, campo `valida`).

## Reglas de implementación
- El gemelo implementa **exactamente** el mismo contrato que la placa real, solo cambia `<destino>`.
- Cualquier cambio del contrato: nueva versión en la cabecera de `Docu/contrato_mqtt.md` y nota de cambios.
- Cada mensaje enviado o recibido por el puente se registra según `registro-experimentos`.
