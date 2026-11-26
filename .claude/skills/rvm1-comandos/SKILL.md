---
name: rvm1-comandos
description: Referencia de comandos RS-232C del Mitsubishi Movemaster RV-M1, parámetros serie, comportamiento de errores y supuestos aún sin verificar. Usar al escribir código que hable con el robot o con su simulador.
---

# Comandos del RV-M1

Implementación de referencia: `Codigo/Software_Control/rvm1_control.py` (clase `RVM1`) y `MockRVM1` en `Codigo/Software_Control/rvm1_pendant.py`.

## Enlace serie
- RS-232C, por defecto 9600 baudios, 7 bits, paridad par, 2 bits de stop, RTS/CTS (deben coincidir con SW2/SW3 de la controladora D/U-M1).
- Terminador CR (bit 1 de SW1). Cable DB25 (robot) – DB9 (PC).

## Comandos usados en el proyecto
| Comando | Uso | Notas |
|---|---|---|
| `NT` | Homing (origen) | Obligatorio tras encender o tras error de modo I |
| `DJ j,g` | Girar el eje j (1–5) g grados | Jog articular |
| `MJ a,b,c,d,e` | Girar los 5 ejes (incrementos en grados) | |
| `DS dx,dy,dz` | Recta incremental de la punta (mm) | Requiere referenciado |
| `MP x,y,z,p,r` | Ir a pose absoluta | Requiere referenciado |
| `SP n` | Velocidad 0–9 | El pendant arranca en 2 |
| `TL mm` | Longitud de herramienta | Afecta al cartesiano |
| `GO` / `GC` | Abrir / cerrar pinza | |
| `HE n` / `MO n` | Guardar / ir a posición n | |
| `WH` | Leer posición: `x,y,z,p,r` | Solo por RS-232 |
| `ER` | Leer error: 0, 1 (modo I hardware), 2 (modo II comando) | |
| `RS` | Reset de error | |

## Errores
- Modo I (hardware): se corta la potencia y se aplican frenos de J2/J3; LED parpadea. Requiere revisar LED interno, `RS` y nuevo `NT`.
- Modo II (comando): orden mal formada o no ejecutable.

## Supuestos sin verificar (no presentarlos como hechos)
1. Que `ER` no responde hasta terminar el movimiento anterior (base del ACK "hecho").
2. Si se acepta jog articular antes de `NT`.
3. Sintaxis exacta y rangos de cada argumento.
4. El RV-M1 no puede abortar un movimiento por RS-232; la parada real es la seta física.

## Seguridad
Ningún agente envía comandos al robot real. Todo código se prueba con `MockRVM1` o el gemelo.
