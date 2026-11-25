---
name: registro-experimentos
description: Formato obligatorio de los registros de datos de experimentos (JSONL con marcas de tiempo) y normas de custodia de datos crudos. Usar al implementar registro en el código y al analizar datos.
---

# Registro de experimentos

## Dónde
`experimentos/datos_crudos/<experimento>/<AAAAMMDD-HHMMSS>_<destino>_<descripcion>.jsonl`

## Formato: una línea JSON por evento
```json
{"t_ms": 1764067200000, "t_mono_ns": 123456789, "nodo": "puente", "destino": "real",
 "evento": "cmd_rx", "id": "a1b2c3", "cmd": "jog_mundo", "args": {"dz": -1.0}}
```
`evento` ∈ `cmd_tx` (cliente envía), `cmd_rx` (puente recibe), `ack_tx`, `ack_rx`, `serie_tx`, `serie_rx`, `pos` (posición publicada), `estado`, `nota`.

- `t_ms`: reloj de pared (epoch ms). `t_mono_ns`: reloj monotónico del nodo (para latencias dentro del mismo nodo).
- Las latencias entre nodos solo se calculan si los relojes están sincronizados (NTP/PTP); anota el método y el desfase estimado en un evento `nota` al inicio.
- Al inicio de cada fichero, un evento `nota` con: versión del código (commit), versión del contrato, broker, red, robot/gemelo, operador.

## Custodia
- Los ficheros de `datos_crudos/` **no se editan nunca**. Si un ensayo es inválido, se anota en `experimentos/datos_crudos/<experimento>/INCIDENCIAS.md`.
- Nada sintético en `datos_crudos/`. Las pruebas con simulador van en `experimentos/datos_simulados/`.
