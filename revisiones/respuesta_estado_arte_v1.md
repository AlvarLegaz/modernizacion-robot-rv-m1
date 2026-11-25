# Respuesta a la revisión del estado del arte v1

- **Fecha:** 2026-11-25
- **Responde:** agente `investigador`, que no revisa su propio trabajo; la v2 debe revisarla `revisor`.
- **Documentos revisados:** `investigacion/estado_del_arte.md`, `investigacion/huecos.md` e `investigacion/matriz.md`, todos en su versión 2.
- **Otros cambios:**
  - 11 fichas corregidas según `revisiones/verificacion_referencias.md`;
  - 3 trabajos y 5 normas nuevos, con ficha y entrada en `referencias/refs.bib` (`note = {verificacion: pendiente}`);
  - el registro de búsquedas `investigacion/busquedas/revision-v1.md`.
- **No se han tocado:** `paper/` y `docu/contrato_mqtt.md`. La versión 0.2 del contrato ya resuelve los defectos del mayor 3; aquí solo se reflejan sus cambios.

## Resumen de cambios

| Ámbito | Cambio |
|---|---|
| Aportaciones | Pasan de 4 a 3. **A1** une la plataforma (base habilitante) y la caracterización medida. **A2** es la adaptación y verificación de salvaguardas conocidas. **A3** (antes A4) es el gemelo que emula la D/U-M1, comparte el contrato, se sincroniza por eventos y tiene la fidelidad medida; es la aportación principal. |
| Preguntas | PI1 (latencia, con el supuesto de `ER`), PI2 (coherencia y fidelidad física del gemelo), PI3 (salvaguardas con cota de confianza) y PI4 (robustez). Desaparece la PI de repetibilidad. |
| Experimentos | E1.0 (analizador en la línea serie), E1 (un solo reloj por equipo), E2a/E2b, E4 con N ≥ 30 por tipo, E5 reducido y E3 como demostración funcional. |
| Nuevas referencias | kutzer2023scorbot, holmes2025retrofitting, kumar2011virtual, oasis2014mqtt, oasis2019mqtt, iso2023sparkplug, iso1998manipulating, iso2025robotics. |
| No localizadas | El trabajo de RA sobre el RV-M1 (AMM 162, 2012) sigue sin autores visibles y no se ficha. |

## Problemas mayores

### Mayor 1 — A4 e interfaz común gemelo/robot
- **Hecho.** Se ha fichado Kutzer, Donnal y Wick (2023) (`investigacion/fichas/kutzer2023scorbot.md`) a partir del PDF de NEMO/ASEE. Confirma lo que dice el revisor:
  - funciones `ScorSim*` con la misma sintaxis que las `Scor*`;
  - programas que "se traducen directamente" al hardware;
  - controladora y DLL USB del fabricante;
  - servidor local;
  - curso remoto en otoño de 2020;
  - código abierto.
- **Dónde se ha incorporado:**
  - Está en la matriz, en H1, H4, H5 y H8, y en los riesgos de `huecos.md`.
  - En `estado_del_arte.md` aparece en §3, §5 ("Interfaz común"), §6 y §7.
  - En la versión para la introducción se ha sustituido la frase contradictoria por la redacción que propone el revisor: "La intercambiabilidad entre simulador y robot existe en entornos locales o mediante elección al conectar [@mihali2005effective; @kutzer2023scorbot; @zhang2024construction], pero no se ha encontrado sobre un bus pub/sub con comprobación del destino en el mensaje".
- **Cómo queda la aportación.** A3 (antes A4) ya no reivindica la intercambiabilidad. Se apoya en cuatro elementos (`huecos.md` §3):
  - (a) un gemelo web que emula la D/U-M1, con los mismos ACK y estados;
  - (b) la sincronización por eventos con una controladora que solo informa bajo petición (`WH`/`ER`);
  - (c) la fidelidad en unidades físicas, separando coherencia y fidelidad física;
  - (d) varios clientes con comprobación del destino.
- Se han quitado todas las condiciones "si hay gemelo", "opcional" y "si no llega a tiempo".
- H8 se matiza: en un robot didáctico heredado sí hay código abierto.

### Mayor 2 — A2 presenta como nuevos mecanismos estándar
- **Hecho.** Se han fichado y añadido a refs.bib MQTT 3.1.1 (`oasis2014mqtt`), MQTT 5.0 (`oasis2019mqtt`) e ISO/IEC 20237 Sparkplug (`iso2023sparkplug`).
  - De las dos especificaciones OASIS se han leído las secciones de la última voluntad, QoS 1 con duplicados, retain y *Message Expiry Interval*.
  - De Sparkplug se han leído la ficha de catálogo de ISO y documentación secundaria. El texto normativo no se pudo abrir, y así consta en la ficha.
- **Reformulación de A2** (`huecos.md` H3 y A2; `estado_del_arte.md` §5 "Normas de mensajería", §7 (d), §8 punto 2; introducción, aportación (ii)): "adaptación a una controladora serie, y su verificación por inyección de fallos, de salvaguardas de mensajería conocidas". En ningún sitio se presentan ya como "no encontradas en la literatura".
- **Justificación de `ts` frente a *Message Expiry*:** la §3.3.2.3.3 de MQTT 5.0 solo descarta las copias que el broker aún no ha empezado a entregar. No cubre la cola de la placa, y el contrato v0.2 vuelve a comprobar la caducidad antes de escribir en el RS-232. El coste es depender de relojes sincronizados (motivo `reloj`). Está en `huecos.md` A2 y en la ficha `oasis2019mqtt`.
- **chang2025construction:** releído en la página de MDPI. La §3.2 *declara* tolerancia a fallos ante "network delays or data loss", pero no describe el mecanismo (ni temporizadores, ni reintentos, ni marcas de tiempo) ni lo ensaya. Se ha anotado en la ficha. En la síntesis ya no se dice que nadie trata los retrasos, sino que la única mención no se describe ni se ensaya (`estado_del_arte.md` §5 y §7 (d); `huecos.md` H3; matriz).

### Mayor 3 — Defectos del contrato
- **Resuelto en `docu/contrato_mqtt.md` v0.2** (fuera del alcance de este agente; no se ha editado). La v0.2:
  - comprueba la caducidad al recibir y antes de escribir en el RS-232;
  - descarta los `id` repetidos (al menos 256 o los de los últimos 10 s) y repite el ACK;
  - sincroniza los relojes con NTP, publica `desfase_ms` y rechaza con motivo `reloj` si el desfase supera 100 ms;
  - deja claro que `parar` no detiene el movimiento en curso;
  - exige usuario y contraseña y ACL por topic en una red aislada, y TLS si la red no está aislada.
- **Reflejado en `huecos.md` §5:** las observaciones pasan a "estado de las observaciones de diseño". E4 incluye los casos que pide el revisor:
  - orden válida retenida en la cola más de 500 ms;
  - orden duplicada por QoS 1;
  - desfase de reloj de más de 100 ms;
  - destino cruzado.
- Sigue abierto, y así consta, el supuesto sobre `ER`, que pasa a E1.0, y los rangos de los argumentos.

### Mayor 4 — E1 no medible tal como estaba
- **Hecho** (`huecos.md` PI1, E1.0 y E1):
  - **Un solo reloj por equipo.** En el cliente, reloj monótono para el RTT hasta `aceptado` y hasta `hecho`. En la placa, reloj monótono para la recepción, la salida de la cola, la escritura serie y la respuesta. No se restan marcas de relojes distintos. NTP solo se usa para la caducidad, y se registra `desfase_ms`.
  - **E1.0 previo:** analizador lógico u osciloscopio con decodificación en TX/RX para verificar cuándo responde la D/U-M1 a `ER` y los parámetros reales de la línea. Si el supuesto falla, se redefine `hecho` antes de E1 y E2.
  - **Separación:** la latencia se mide con una orden sin movimiento; el tiempo de ejecución de `mover_pose` se da aparte, en función de la distancia y de `SP`.
  - **Factores fijos declarados:** placa, baudios y formato, broker y bibliotecas. Los variables son LAN cableada o Wi-Fi con QoS 1; QoS 0 queda solo como referencia.
  - **Cota teórica:** con 7E2 son 11 bits por carácter, unos 1,15 ms por carácter a 9600 baudios. Son parámetros a confirmar en E1.0. La fuente que da 9600/7E2 (`movemaster-robot`) no es revisada por pares y no se cita.
- **Pendiente fuera de este agente:** elegir la placa (ESP32 o RPi) antes de E1. Ver el menor 15.

### Mayor 5 — E3 no contrasta la aportación
- **Se adopta la opción (a), sin TOST.** E3 pasa a "demostración funcional de coger y dejar": el mismo programa se ejecuta primero en el gemelo y luego en el robot real, cambiando solo el destino. Se informa de la tasa de éxito y el tiempo de ciclo (≥ 30 ciclos si cabe), sin PI propia y en pocas líneas.
- La repetibilidad se ha quitado de las aportaciones, de §8 y de la introducción. H6 queda como "no como aportación", con el motivo que da el revisor: la pose final la decide la D/U-M1.
- **ISO 9283:** se ha añadido (`iso1998manipulating`) solo para dejar claro que E2b **no** es un ensayo de exactitud de pose según la norma. El texto normativo no se ha leído. No se ha elegido la opción (b) por falta de páginas.
- **Por qué no se hace la TOST:** no cabe en el presupuesto de resultados y no apoya ninguna aportación. Si `analista-experimentos` la considera barata, puede añadirla al protocolo.

### Mayor 6 — Alcance y carácter del gemelo
- **Hecho.** En los tres documentos se han quitado todas las condiciones "si hay gemelo", "opcional" y "se elimina si…". La fila "Este trabajo" de la matriz marca el gemelo como "previsto", no como opcional.
- **Núcleo fijado:**
  - E1 (con E1.0);
  - E2 (E2a y E2b);
  - E4;
  - E5 reducido a tres escenarios: corte del broker, desconexión serie y sesión larga, sin pérdidas emuladas por niveles;
  - E3 como demostración.
- **Factores de E1:** QoS 1 en LAN y Wi-Fi; QoS 0 solo como referencia.
- **A1 y A3 fusionadas.** El total es de tres aportaciones y cuatro PI.
- **Presupuesto de resultados** (`huecos.md` §5): una figura para E1, una para E2 y una tabla para E4; E5 y E3 van en texto.
- **E2a remite al diseño de `diseno-experimental`** (≥ 10 programas × 3 repeticiones).
- **E5 en la introducción:** la versión para la introducción ya lo menciona, en la aportación (iii).

### Mayor 7 — Faltan trabajos y normas
- **Holmes et al. 2025:** fichado (`holmes2025retrofitting.md`) a partir del texto completo en ScienceDirect. Confirma lo que dice el revisor:
  - KR10 y KR16 con KRC2 sin RSI;
  - Raspberry Pi 5 con un cliente OPC XML-DA propio;
  - servidores OPC UA;
  - 8,3 % y 15,4 % de fallos;
  - 13,9 % del tiempo en retardos.

  Añade un dato: la mitad de esos retardos se debe a caídas de la conexión con las KRC2. **No da latencias en ms.**
  - En H1 y en §2, "controladoras modernas" pasa a "controladoras con interfaz de red (Ethernet, OPC, API del fabricante), aunque sean heredadas".
  - Holmes aparece además en la introducción, en §4, §7 y §8, en la matriz y en los riesgos.
- **Kumar et al. 2011:** localizado en ScienceDirect (no abría) y leído completo en academia.edu (`kumar2011virtual.md`; DOI 10.1016/j.rcim.2011.05.003). Es un modelo virtual MATLAB del RV-M1 sin conexión al robot, que deja la interfaz común como trabajo futuro. Se cita en §3 y §5 y en H4. Riesgo bajo.
- **RA sobre el RV-M1 (AMM 162, 344–351, 2012):** se leyó el resumen en scientific.net (programación fuera de línea con RA y equipo barato), pero ni la página del artículo ni la del volumen muestran autores ni DOI, y Crossref no es accesible desde este entorno. **No se ficha ni se añade a refs.bib**, porque no se completan campos de memoria. Queda como pendiente en `busquedas/revision-v1.md` y en `huecos.md` §6.
- **Nuevo candidato:** un trabajo de VR con Oculus Rift sobre el RV-M1 (Procedia Computer Science, ScienceDirect S187705091503687X). Está localizado, pero no se pudo abrir, así que no se usa. Pendiente.
- **Kandala et al. 2025 y Brunn y Labib 2005:** no se han buscado en esta ronda, porque se priorizó lo que pedía la tarea. Siguen como pendientes.
- **Normas:** MQTT 3.1.1, MQTT 5.0, ISO/IEC 20237, ISO 9283 e ISO 10218-1 (`iso2025robotics`, por el menor 11), todas con URL oficial y `verificacion: pendiente`. De las ISO solo se han leído las fichas de catálogo, y así consta en sus fichas y en la nota del .bib.

### Mayor 8 — E2 mide coherencia, no fidelidad física
- **Hecho** (`huecos.md` PI2 y E2; A3 (b) y (c)):
  - **E2a (coherencia gemelo–controladora):** pose final frente a `WH` en mm y grados, y diferencia entre los instantes del ACK `hecho`, con ≥ 10 programas × 3 repeticiones.
  - **E2b (fidelidad física):** de 5 a 10 poses con una referencia externa (puntero sobre plantilla milimetrada, comparador o visión calibrada), comparando con ella tanto el gemelo como `WH`.
  - Las dos se informan en unidades físicas y sin normalizar. Se declaran la resolución de `WH` y la de la medida externa.
- La sincronización por eventos (`WH` en reposo, sin trayectoria intermedia observable) se declara como limitación y como rasgo diferenciador: A3 (b), H5, `estado_del_arte.md` §5 y §8, y la introducción.

## Problemas menores

| # | Respuesta | Dónde |
|---|---|---|
| 1 Ciungan | Cambiado a "no se ha encontrado medida de latencia en las partes leídas". | `huecos.md` §6; matriz |
| 2 Pontarolli | Reclasificado como "PLC que gobierna el SCARA; MQTT solo como *Databus* interno del *edge*". Se saca de "MQTT con manipulador gobernado directamente". | Matriz (fila y lectura rápida); `estado_del_arte.md` §2; `huecos.md` H1 |
| 3 Alqoud | El 16 % se presenta como "dato de contexto, no prueba del hueco". | `huecos.md` H1 |
| 4 "Por primera vez" | Eliminado. A1 dice "no se ha encontrado una caracterización equivalente", y §6 recuerda la regla. | `huecos.md` A1 y §6 |
| 5 Profanter | Ya no se usa para "competitivo frente a OPC UA". Ahora dice "diferencias inferiores al milisegundo en LAN" e indica que OPC UA C/S fue algo más rápido (520 frente a 584 µs). | `estado_del_arte.md` §4 y §7; introducción; ficha |
| 6 Luu | Anomalía QoS 0 > QoS 1 señalada; sus cifras se usan solo como orden de magnitud. | `estado_del_arte.md` §4; matriz; ficha; `huecos.md` E1 |
| 7 N de E4 | N ≥ 30 por tipo (cota ≈ 10 %) o N = 100 (≈ 3 %), informando la cota al 95 %. | `huecos.md` E4 y PI3 |
| 8 Disponibilidad | Renombrada como "fracción de tiempo en línea durante el ensayo". | `huecos.md` E5 |
| 9 | Pasado a mayor 8 (ver arriba). | — |
| 10 A1 y literatura gris | A1 cita swider, foit, mihali y las bibliotecas abiertas no revisadas (Springwald .NET y `movemaster-robot`) y se presenta como base habilitante. Las bibliotecas no entran en refs.bib. | `huecos.md` A1; `estado_del_arte.md` §3 y §8 |
| 11 Habilitación | Se describe como "pulsación mantenida por software". Se declara que no es un dispositivo de habilitación en el sentido de ISO 10218-1 (`iso2025robotics`, texto no leído) y que la parada de emergencia es la seta física. La introducción ya no menciona el "dispositivo de habilitación". | `huecos.md` A1; ficha `iso2025robotics` |
| 12 Patrão | Cambiado a "Un estudio de 2025 sobre un RV-2AJ deja sin implementar…". | Introducción; §8 |
| 13 Pan y Huang | Fuera del recuento de H1 hasta verificarlo; se mantiene en la matriz con [POR VERIFICAR; fuera del recuento]. | `huecos.md` H1; matriz |
| 14 Fila "Este trabajo" | Todas las celdas no hechas se marcan como "previsto". | Matriz |
| 15 Placa por elegir | **No resuelto por este agente**: lo deciden Álvar o `ingeniero` (el contrato v0.2 sigue con "ESP32 o Raspberry Pi"). Se deja como requisito previo a E1. | `huecos.md` §2 |
| 16 Amenazas a la validez | Lista añadida: validez interna, de medida, externa y de constructo. | `huecos.md` §5 |
| 17 Frase ambigua | Ahora dice que "solo tres trabajos dan medidas de prestaciones" y los nombra: jokic, conchasanchez y roldan. campos2019diseno queda fuera. | `estado_del_arte.md` §2 |

## Cifras corregidas en las fichas (verificación) y su efecto en la síntesis

| Ficha | Corrección | ¿Llegaba a la síntesis? Estado ahora |
|---|---|---|
| luu2025enhancing | Lista completa de 7 autores; escalabilidad con QoS 1 de 481,9 ms con 100 robots (se retiran los 1135 ms); se retiran los kbps; anomalía QoS 0 > QoS 1. | Las cifras retiradas no estaban en la síntesis; ahora se señala la anomalía. |
| liang2020bidirectional | Máximo global de 2,07·10⁻⁵ rad (A3); incoherencia media > máximo en A3 y A6. | Sí: §5 y la matriz dicen ahora "del orden de 10⁻⁷–10⁻⁵ rad, máx. 2,07·10⁻⁵, incoherencias en la tabla". |
| bravoarrabal2025iort | Latencia = RTT/2; 58/43/318 ms son de un sentido y 116 ms es el RTT. | Sí: §4 y la matriz corregidos. |
| alasti2021turning | ~1 cm, ~5 m, ThingSpeak, MECA 500 y AMAX 5580 son del preprint, no del artículo ASEE. | Sí, en la matriz: la fila ya no los atribuye. |
| ogorodnyk2020towards | 0,96–2,43 % solo a 100/50/33 Hz; 0,00–2,43 % con 2 Hz. | No (la síntesis usa los ~39,5 Hz, que están confirmados). |
| kumar2024scalable | Versión publicada en LNCS 2025; 36 equipos (no 38) con acceso al hardware; duración incoherente en la fuente. | Deja de marcarse NRP en §6; la matriz da 14 y 36. |
| jokic2020two | Los costes vienen de su referencia [22]. | Sí: §2 ya no presenta el coste como medida suya, y la matriz dice "costes tomados de otra referencia". |
| kuts2019digital | "32,875 ms" es literal y probable errata; no usar. | Retirado de §5 y de la matriz. |
| kaarlela2023digital | *Snap points*. | No. |
| profanter2019opcua | "≥ 875 µs". | Sí: §4 dice "875 µs o más". |
| conchasanchez2020recycling | "3 TFG y talleres" no está respaldado. | No llegaba; retirado de la ficha. |
| chang2025construction (relectura, mayor 2) | Tolerancia a retrasos y pérdidas declarada sin mecanismo ni ensayo. | Sí: §5, §7 (d), H3 y la matriz. |

## Pendiente para la revisión v2 y para otros agentes
1. `verificador-referencias`: verificar las 8 entradas nuevas. En kutzer2023scorbot, la página de la sesión de ASEE lista solo a Kutzer y Wick, y el PDF incluye a Donnal; el DOI no se ha encontrado.
2. Álvar o `ingeniero`: elegir la placa (menor 15) y confirmar los parámetros serie en el manual (`docu/`) antes de E1.0.
3. `analista-experimentos`: redactar los protocolos E1.0, E1, E2a/E2b, E4 y E5 a partir de `huecos.md` §5.
4. Próxima ronda de búsqueda: autores del trabajo de RA (AMM 162, 2012), el trabajo de VR con Oculus sobre el RV-M1, Kandala et al. (2025) y Brunn y Labib (2005).
5. `revisor`: revisión v2.
