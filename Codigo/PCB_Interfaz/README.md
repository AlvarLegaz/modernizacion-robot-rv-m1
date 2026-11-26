# Placa de interfaz (PCB)

Pasarela ESP32 entre el RS-232C de la controladora D/U-M1 y el broker MQTT, con interfaz de parada eléctrica aislada y supervisada hacia `EXT. EMG. STOP`. Arquitectura en `Docu/arquitectura_control_parada_remota.jpg`; comportamiento exigido (latido, permiso de movimiento, fallo seguro, rearme manual) en la sección 5 de `Docu/contrato_mqtt.md`.

| Carpeta | Contenido |
|---|---|
| `esquemas/` | Esquemático y PCB (p. ej. KiCad) |
| `firmware/` | Firmware del ESP32 (pasarela MQTT ↔ RS-232C, latido, circuito de parada) |
| `fabricacion/` | Gerbers, lista de materiales (BOM) y ficheros de montaje |

Estado: sin empezar.
