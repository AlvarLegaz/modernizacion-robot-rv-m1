# Protocolos experimentales

Versión 1 (2026-11-25). Diseñados para que **Álvar los ejecute solo, con un robot, en el aula**, y para que sus resultados quepan en la sección 4 del artículo (1300–1500 palabras, 2–3 figuras o tablas). Base: `Investigacion/Estado_del_Arte/huecos.md` v2, `Investigacion/Revisiones/revision_estado_arte_v2.md`, contrato MQTT v0.4, `Codigo/Gemelo/README.md` y `Codigo/Broker/README.md`.

Ningún agente envía órdenes al robot ni genera datos. Los análisis están definidos en cada protocolo **antes** de tener datos y no se cambian a la vista de los resultados. Si se cambian, se dice en el artículo y se da también el análisis previsto.

## Protocolos y orden de ejecución

| # | Protocolo | Responde | Por qué en este orden | Duración |
|---|---|---|---|---|
| 0 | Preparación común (abajo) | — | Montaje del analizador, red, NTP y comprobación del robot, una sola vez | 2 h |
| 1 | [E1.0_supuestos_controladora.md](E1.0_supuestos_controladora.md) | PI1 (paso previo) | Fija los parámetros serie, la resolución de `WH` y la definición del ACK `hecho`; puede obligar a cambiar el contrato antes de seguir | 2 h |
| 2 | [E1_latencia.md](E1_latencia.md) | PI1 | Da el margen m de la zona frontera de E4 y, si se quiere, los tiempos para calibrar el modelo del gemelo **antes** de E2 | 3 h |
| 3 | [E4_salvaguardas.md](E4_salvaguardas.md) | PI3 | Verifica las salvaguardas antes de las sesiones largas con el robot | 4 h |
| 4 | [E2_fidelidad_gemelo.md](E2_fidelidad_gemelo.md) | PI2 | Con el gemelo congelado y E1.0 cerrado; E2b en sesión propia | 6 h (2 sesiones) |
| 5 | [E5_robustez.md](E5_robustez.md) | PI4 | Al final, con todo el sistema estable; incluye 2 h de sesión continua | 3 h 30 min |
| 6 | [E3_demo_pick_place.md](E3_demo_pick_place.md) | — (demostración) | Material gráfico y cierre | 1 h 30 min |

**Tiempo total con el robot: unas 22 h**, en 7 sesiones de 3–4 h. Además, unas 3 h sin robot para los ensayos en seco contra el gemelo (uno por protocolo) y para probar los scripts de análisis con esos registros.

Puntos de decisión:
- **Tras E1.0:** si S1 no se cumple (`ER` responde durante el movimiento), se para hasta que `ingeniero` redefina `hecho` en el contrato y en el gemelo. Si `WH` responde durante el movimiento, la sesión principal reformula A3 (b) y H5.
- **Tras E1:** se calcula m = |desfase|_máx + p99(N_acep, LAN cableada) y se anota antes de E4. Si se calibra el modelo de tiempos del gemelo, se hace ahora, se congela y se anota el commit.

## Qué produce cada protocolo para el artículo

| Protocolo | En el artículo | Ficheros (en `Investigacion/Experimentos/analisis/`) |
|---|---|---|
| E1.0 | Un párrafo (parámetros reales, comportamiento de `ER`/`WH`) y la definición de `hecho` en la sección 3 | `resultados/E10_*.csv`, figura de trabajo `figuras/E10_cronograma.pdf` |
| E1 | **Figura 1:** ECDF de la latencia por tramos, LAN frente a Wi-Fi; cifras en el texto y en el pie | `figuras/E1_ecdf.pdf/.png`, `resultados/E1_*.csv` |
| E2 | **Figura 2:** (a) coherencia gemelo–`WH` por programa; (b) fidelidad física con U95. Un párrafo sobre ACK, tiempos, modo sincronizado y multicliente | `figuras/E2_fidelidad.pdf/.png`, `resultados/E2*_*.csv` |
| E4 | **Tabla 1:** una fila por regla (N, rechazo correcto, movimientos indebidos, cota al 95 %, falsos rechazos) y LWT | `resultados/E4_tabla.csv` y detalle |
| E5 | Un párrafo; si cabe, dos filas al final de la tabla 1 | `resultados/E5_*.csv` |
| E3 | Dos o tres líneas; foto opcional en la sección 2 | `resultados/E3_ciclos.csv` |

Total: 2 figuras y 1 tabla, dentro del presupuesto de `redaccion-cientifica`.

## Material necesario (lista corta y barata)

Además del robot, la placa elegida, el PC del profesor y la red del aula:

| Material | Para | Precio orientativo |
|---|---|---|
| Analizador lógico USB de 8 canales y 24 MHz, compatible con sigrok/PulseView | E1.0, E1, E4, E5 | 10–15 € |
| 2 módulos MAX3232 (solo como receptores, para pasar ±12 V a 3,3 V) | Toma de escucha del RS-232 | 2–4 € |
| Adaptador en Y o breakout DB9/DB25 con bornas | Pinchar la línea sin cortar el cable | 5–8 € |
| 2 LED y resistencias de 330 Ω | Ver los bytes en el vídeo (E1.0) | < 1 € |
| Calibre digital de 150 mm | E2b (marcas, alturas, punta, papel) | 15–20 € |
| Escuadra de acero y regla de acero de 300–500 mm | E2b (ejes del papel, escala) | 10 € |
| Inclinómetro digital | E2b (`pitch`) | 10–15 € |
| Papel de fumar | E2b (detección del contacto) | 1 € |
| Punta rígida (punzón o clavo afilado) y soporte impreso en 3D | E2b | < 2 € |
| Tablero plano (MDF o aluminio) y un bloque de altura conocida | E2b | 5–10 € |
| Relé USB (1 canal) | E4 T6 (cortar la alimentación de la placa) | 6–10 € |
| Cubo de 30 mm impreso en 3D | E3 | < 1 € |
| Router propio para aislar la red del ensayo (opcional) | E1, E4, E5 | 20–30 € |
| Móvil con cámara lenta (≥ 120 fps) y trípode | E1.0, E3 | disponible |

**Coste total: unos 90–130 €** (sin el router: 70–100 €).

## Preparación común (una vez, 2 h)

1. **Robot reparado:** 5 `NT` seguidos sin error. Foto de SW1–SW3 de la D/U-M1.
2. **Placa elegida y congelada** (ESP32 o Raspberry Pi). El puente implementa el contrato v0.4 y registra los eventos de la sección siguiente. Pasa las pruebas automáticas del contrato en el commit que se va a ensayar.
3. **Toma de escucha** del RS-232 (Y + MAX3232 + analizador), montada con todo apagado; comprobación con polímetro de que no altera la línea.
4. **Red:** broker según `Codigo/Broker/README.md` (usuarios, ACL, `profesor` y `placa_real`); red aislada; anotar los equipos conectados. TLS no se usa si la red está aislada; se declara en el artículo.
5. **NTP:** PC del profesor como servidor (chrony o w32time); placa y PC cliente sincronizados; desfase < 10 ms con `Codigo/Broker/comprobar_reloj.py`.
6. **Zona de seguridad:** cinta en el suelo a 1 m del eje de la base; la seta física de la D/U-M1, al alcance de la mano desde el puesto del operador.
7. **Ensayos en seco** de todos los scripts contra el gemelo; registros a `Investigacion/Experimentos/datos_simulados/<Ex>/`, nunca a `datos_crudos/`.

## Seguridad común

- Nadie dentro de la zona marcada mientras el robot tenga potencia, salvo el operador en E2b con el robot parado.
- La **seta física** es la única parada de emergencia. El STOP del pendant y la orden `parar` solo vacían la cola: no detienen un movimiento en curso.
- **SP máximo:** 4 en E1.0, E1 y E2a; 3 en E3; 2 en E2b, E4 y E5. Todo programa nuevo se ejecuta antes en el gemelo, y la primera vez en el real a SP 2 con la mano en la seta.
- Sin alumnos en el aula durante los ensayos, o fuera de la zona y sin permiso para publicar en `rvm1/real/`.
- Ante cualquier movimiento inesperado: seta, fin de la sesión y anotación en `INCIDENCIAS.md`.

## Registro y custodia de los datos (skill `registro-experimentos`)

- Ruta: `Investigacion/Experimentos/datos_crudos/<Ex>/AAAAMMDD-HHMMSS_<destino>_<descripcion>.<ext>`. Un fichero por nodo (`-cliente`, `-placa`, `-analizador`, `-video`); el gemelo, con destino `gemelo`.
- Cada `.jsonl` empieza con una `nota`: commit, versión del contrato, broker, red, placa, robot o gemelo, operador, método de sincronización y desfase medido, semilla del sorteo y los factores fijos propios de cada protocolo.
- Las capturas (`.sr`), los vídeos y las hojas de medidas manuales (`.csv` de E2b) también son datos crudos; sus SHA-256 van en `SHA256SUMS` de cada carpeta. Los ficheros que no quepan en el repositorio se guardan fuera, con su suma y su ubicación en la nota.
- **Nada se edita después.** Un ensayo inválido se anota en `Investigacion/Experimentos/datos_crudos/<Ex>/INCIDENCIAS.md` (fecha, fichero, qué pasó, si se repitió).
- Nada sintético en `datos_crudos/`. Los ensayos en seco con el gemelo van a `datos_simulados/`. Excepción explícita: en E2, el registro del gemelo durante la sesión con el robot real va a `datos_crudos/E2/`, porque es el registro del objeto bajo ensayo. Lleva `nodo: "gemelo"` y nunca se presenta como medida del robot.

## Requisitos de instrumentación (para `ingeniero`, antes de E1)

El puente de la placa todavía no existe en `Codigo/Software_Control/`. Para que los protocolos se puedan analizar, tiene que registrar en JSONL, con `t_ms` y `t_mono_ns` de su reloj monótono:
- `cmd_rx` con la edad calculada en la primera comprobación;
- `ack_tx` (`aceptado`, `hecho`, `error`, `rechazado` con `motivo`);
- `serie_tx` con `fase` (`inicio` antes de escribir, `fin` tras vaciar el búfer de salida), `origen` (`orden` o `sondeo`), el `id` de la orden y la edad en la segunda comprobación;
- `serie_rx` al recibir el terminador de la respuesta;
- `estado` con cola, `conectado`, `desfase_ms` y, en E5, memoria en uso.

Además: el *latency timer* del adaptador USB-RS232 a 1 ms; *keep alive*, `clean session` y reintentos configurables y escritos en la nota inicial; un método documentado para desplazar el reloj de la placa en E4 T5.

**Herramientas pendientes** (`Codigo/Software_Control/experimentos/`, para `ingeniero`): `e1_cliente.py`, `e2_cliente.py` (envío doble real/gemelo, paso a paso), `e2_programas.json`, `e4_inyector.py` (con semilla, estratos y zonas), `e5_carga.py` (con script de cortes), `e3_pick_place.py` y, si E1.0 lo pide, un sondeo de `WH` en bucle. Todas registran con el formato de `registro-experimentos` y se prueban antes contra el gemelo.

**Aviso detectado al diseñar E1.0:** `RVM1.run()` en `Codigo/Software_Control/rvm1_control.py` pide `ER` 0,5 s después de cada movimiento y espera 2 s como máximo. Si S1 se cumple, en movimientos largos la consola mostrará un error falso y descartará la respuesta tardía (`query()` vacía el búfer de entrada). No afecta a E1.0, porque la referencia es el analizador, pero conviene corregirlo cuando se conozca el resultado.

## Análisis

Un script por experimento en `Investigacion/Experimentos/analisis/` (`analizar_E1_0.py`, `analizar_E1.py`, `analizar_E2.py`, `analizar_E3.py`, `analizar_E4.py`, `analizar_E5.py`). Leen solo de `Investigacion/Experimentos/datos_crudos/`, escriben en `Investigacion/Experimentos/analisis/resultados/` (CSV) y `Investigacion/Experimentos/analisis/figuras/` (PDF vectorial y PNG a 300 ppp) y regeneran todo desde cero (skill `analisis-datos`, con barra `tqdm` al recorrer ficheros). Se desarrollan y prueban con los registros de `datos_simulados/` antes de tener datos reales; los resultados de esas pruebas no se usan en el artículo.
