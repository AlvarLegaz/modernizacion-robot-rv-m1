# Revisión de estado del arte (estado_del_arte.md, huecos.md, matriz.md) — v1

Revisor: agente `revisor` (no ha participado en la elaboración). Fecha: 2026-11-25.
Enfoques pedidos: novedad, cobertura, rigor, trazabilidad. No se ha revisado `referencias/refs.bib` (lo verifica otro agente en paralelo).

> **Nota de contexto.** Durante la revisión cambió `CLAUDE.md`. Ahora el gemelo digital es **obligatorio** ("la aportación que da nivel al artículo") y el artículo se escribirá **en español para RIAI**. Los documentos revisados todavía tratan el gemelo como opcional: `huecos.md` A4 dice "(Condicionada al gemelo)… Si el gemelo no llega a tiempo, A4 se elimina", y §2, E2 y la fila "Este trabajo" de la matriz también lo marcan como opcional. Este informe se ha ajustado al nuevo criterio: A4 y E2 pasan a ser núcleo (mayores 1, 6 y 8).

## Resumen del documento (3–4 líneas)

Los tres documentos sintetizan 41 fichas en cinco líneas: retrofit invasivo frente a no invasivo, antecedentes sobre el RV-M1 y otros Mitsubishi, latencia de protocolos, gemelos digitales con su fidelidad y su seguridad, y docencia. Identifican nueve huecos (H1–H9) y proponen cuatro aportaciones (A1–A4), cinco preguntas (PI1–PI5) y cinco experimentos (E1–E5). El trabajo se posiciona como *external coordinator* sobre la D/U-M1 original con un puente RS-232→MQTT. La síntesis es ordenada y prudente ("no se ha encontrado"), y avisa de las erratas de las fuentes. Pero sobrevalora la novedad de A2 y A4, tiene dos huecos de cobertura que afectan a H1 y H4, y propone más experimentos de los que caben en 8–9 páginas. Además, E3 no sirve para probar la aportación que dice probar.

## Puntuaciones

| Criterio | Nota | Justificación |
|---|---|---|
| Novedad | 3 | A3 (caracterización medida de una cadena serie heredada conectada a IIoT) se sostiene. A1 no es novedosa por sí sola: el RV-M1 ya se gobierna por RS-232 desde software en swider2007system, foit2008web y mihali2005effective, y en bibliotecas abiertas. A2 presenta como "no encontrados" mecanismos que ya forman parte del estándar MQTT y de Sparkplug (mayor 2). A4 choca con mihali2005effective y con Kutzer et al. 2023 (mayor 1). |
| Cobertura del estado del arte | 3 | Las cinco líneas están bien elegidas, y la síntesis compara enfoques en vez de limitarse a enumerar artículos (§2 y §5, con taxonomías y niveles de acoplamiento). Faltan Holmes et al. 2025 (KUKA KRC2 heredadas con pasarela OPC UA) y el ScorBot Toolbox (2023), las normas (MQTT, Sparkplug, ISO 9283) y la segunda ronda que el propio `huecos.md` §6 da por pendiente (mayor 7). |
| Rigor metodológico | 2 | Las PI están bien formuladas y son medibles. Pero E3 no contrasta lo que dice (mayor 5). El desglose por tramos de E1 depende de sincronizar relojes entre equipos y de un supuesto sin verificar sobre `ER` (mayor 4). E4 no fija N ni una cota de confianza. Faltan amenazas a la validez. El volumen total no es viable en 8–9 páginas (mayor 6). |
| Trazabilidad | 4 | Las cifras revisadas coinciden con las fichas (ver Comprobaciones). Hay tres desajustes: chang2025construction (la ficha recoge "tratamiento de retrasos o pérdida de datos" y la síntesis dice que nadie trata las órdenes retrasadas), ciungan2025enhancing ("no mide latencia" frente a "no reportada en lo leído") y pontarolli2025analyzing (clasificado como "MQTT con manipulador"). |
| Reproducibilidad | 3 | Contrato publicado (v0.1), pero con supuestos sin verificar (`ER` bloqueante, rangos). Falta por decidir la placa (ESP32 o RPi), que condiciona la latencia, y faltan los parámetros serie y las versiones del broker y de las bibliotecas. |
| Claridad | 4 | La estructura es clara, la terminología es constante y las tablas de huecos y riesgos son muy útiles. Sobra algo de repetición entre §7, §8 y la versión para la introducción. |
| Adecuación a la revista | 3 | El tema encaja en RIAI, y el artículo irá en español, como el estado del arte. La versión para la introducción (539 palabras sin citas, 24 claves) cabe en el presupuesto de 1100–1300 palabras. Pero cuatro aportaciones con cinco experimentos no caben en 1300–1500 palabras de resultados. Ahora que el gemelo es obligatorio, hay que recortar por otro lado (mayor 6). |

## Problemas mayores

1. **A4 y la "interfaz común gemelo/robot": la afirmación de novedad choca con el propio documento y con un trabajo no citado.**
   - *Dónde.* `estado_del_arte.md` §5 ("No se ha encontrado un contrato…") y la versión para la introducción, párrafo 3 ("Que las mismas órdenes gobiernen el gemelo y el robot real se ha mostrado solo en comunicación local con un robot de bajo coste [@zhang2024construction]"). También `huecos.md` H4 y §8, punto 3.
   - *Problema.* El propio §3 dice que en mihali2005effective (el RV-M1, controladora original, red TCP/IP) "el usuario elige si manda el robot o el simulador" al conectar. Por tanto, la frase de la introducción es falsa según el propio documento. Además, Kutzer, Donnal y Wick (2023, ASEE Annual Conference) publican un toolbox de código abierto para el SCORBOT-ER 4u, un robot didáctico heredado de los 90 que conserva la controladora original. Su simulación usa la misma sintaxis que las funciones de hardware (p. ej. `ScorSimSetBSEPR` frente a `ScorSetBSEPR`), de modo que los programas pasan de una a otra, y se usó en un curso remoto en 2020 ([ASEE PEER](https://peer.asee.org/the-scorbot-toolbox-for-matlab-an-open-source-hardware-interaction-and-simulation-library-for-the-intelitek-scorbot-er-4u-educational-robot); [GitHub](https://github.com/kutzer/ScorBotToolbox)). Es local (MATLAB, servidor local, DLL USB), pero invalida "solo con un robot de bajo coste" y matiza H8: en un robot heredado sí hay código abierto.
   - *Cambio propuesto.*
     - Fichar Kutzer et al. 2023 y añadirlo a la matriz y a H4/H8.
     - Reescribir la frase de la introducción, por ejemplo: "La intercambiabilidad simulador/robot existe en entornos locales o mediante elección al conectar [@mihali2005effective; @kutzer2023scorbot; @zhang2024construction]; no se ha encontrado sobre un bus pub/sub con comprobación del destino en el mensaje".
     - Limitar la novedad de A4 a dos cosas: la comprobación doble del destino en una red pub/sub multicliente y la fidelidad medida (E2), no la intercambiabilidad en sí.
     - Como `CLAUDE.md` hace ahora del gemelo la aportación que da nivel al artículo, este punto es el más urgente. Si A4 se presenta como "gemelo intercambiable", un revisor de RIAI la rebatirá con mihali2005effective (el mismo robot) y con Kutzer 2023. Lo que la sostiene es: (a) el gemelo se sincroniza por eventos con una controladora que solo da su estado bajo demanda (`WH`/`ER`), algo que ninguna ficha recoge (H5); (b) la fidelidad se mide en unidades físicas; (c) varios clientes comparten un bus con salvaguardas de destino. Conviene que A4 se formule en esos términos en `huecos.md` §3 y en la introducción.

2. **A2: los mecanismos se presentan como "no encontrados en la literatura", pero son funciones estándar de MQTT o de Sparkplug.**
   - *Dónde.* `estado_del_arte.md` §5, último párrafo ("no se han encontrado mecanismos de rechazo de órdenes caducadas…, ACK de aplicación en dos fases ni uso de la última voluntad (LWT)"), §7 (d) y §8, punto 2. También `huecos.md` H3 y A2, y la versión para la introducción, aportación (ii).
   - *Problema.* Un revisor de RIAI lo detectará enseguida:
     - el LWT es una función nativa de MQTT 3.1.1;
     - MQTT 5.0 añade *Message Expiry Interval*, es decir, caducidad del mensaje en el broker ([OASIS MQTT v5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html));
     - Eclipse Sparkplug B, especificación IIoT sobre MQTT normalizada como ISO/IEC 20237, define certificados de muerte basados en LWT, mensajes de nacimiento y números de secuencia ([especificación Sparkplug](https://www.eclipse.org/tahu/spec/sparkplug_spec.pdf)).

     Que no aparezcan en las 41 fichas de manipuladores no los convierte en novedad. Además, la ficha de chang2025construction recoge "tratamiento de retrasos o pérdida de datos", lo que contradice "sin tratar órdenes retrasadas" (§7 d) y la introducción.
   - *Cambio propuesto.*
     - Citar la especificación MQTT y Sparkplug en §5 y en `huecos.md` H3.
     - Formular A2 como "la selección, adaptación y verificación por inyección de fallos de un conjunto de salvaguardas de mensajería para un manipulador sin interfaz de red", no como mecanismos nuevos.
     - Justificar por qué se usa `ts` en el payload y no *Message Expiry* de MQTT 5: el *expiry* solo cubre el tiempo en el broker, no la cola de la placa ni el desfase de relojes.
     - Releer chang2025construction y explicar qué hace con los retrasos antes de afirmar (d).

3. **Defectos del contrato que invalidan parte de lo que E4 quiere demostrar (PI4) y de lo que afirma A2.**
   - *Dónde.* `huecos.md` A2, PI4, E4 y §5 "Observaciones de diseño". `docu/contrato_mqtt.md` §1–2.
   - *Problema.* El contrato comprueba la caducidad al recibir la orden y la encola (`aceptado` = "se ha encolado"). Una orden válida que espera en la cola tras un `mover_pose` largo se ejecuta segundos después sin volver a comprobarse. Así, la garantía declarada ("un jog retrasado por la red no mueve el robot tarde") solo cubre el retraso de red, no el de la cola. `huecos.md` §5 ya señala tres puntos: los duplicados por QoS 1, el `parar` que no aborta el movimiento en curso y la falta de TLS. Pero los deja como observaciones, cuando afectan directamente a si A2 se sostiene.
   - *Cambio propuesto.*
     - Pasar esas observaciones a requisitos previos a E4. Que `analista-experimentos` o `ingeniero` decidan sobre `docu/contrato_mqtt.md`, no este revisor.
     - Opciones concretas: comprobar de nuevo la caducidad al sacar la orden de la cola, o rechazar los jogs con `ocupado=true`; descartar `id` repetidos; definir el alcance real de `parar`; activar TLS y autenticación, o justificar por escrito que la red del aula está aislada.
     - Añadir a E4 los casos "orden válida retenida en la cola más de 500 ms" y "orden duplicada por QoS 1".

4. **E1 (núcleo de A3): el desglose por tramos no es medible de forma fiable tal como está diseñado.**
   - *Dónde.* `huecos.md` PI1 y E1.
   - *Problema.* Hay tres dificultades:
     - *Relojes.* Las latencias en un sentido entre cliente y placa dependen de NTP. En un ESP32 por Wi-Fi, la incertidumbre de NTP es del orden de milisegundos, comparable al tramo red+broker en LAN (6,6 ms de RTT en bray2024latency; 2,5 ms de mediana en ariascachero2023operational).
     - *Fin del movimiento.* El tramo "intérprete/ejecución hasta `ER`" depende del supuesto, sin verificar, de que la D/U-M1 no responde a `ER` hasta acabar el movimiento. Además, mezcla latencia con duración del movimiento, que depende de la distancia y de `SP`.
     - *Factores sin fijar.* No se fija la placa ni el enlace serie. Según la biblioteca abierta `movemaster-robot`, el RV-M1 trabaja por defecto a 9600 baudios, 7E2 y XON/XOFF ([README](https://app.unpkg.com/movemaster-robot@1.0.6/files/README.md)), es decir, unos 1,15 ms por carácter. Esto da un límite teórico que conviene calcular y contrastar.
   - *Cambio propuesto.*
     - Medir cada tramo con un solo reloj: en el cliente, el RTT hasta `aceptado`; en la placa, con reloj monótono, la recepción, la escritura serie, la respuesta y el `ER`. Usar NTP solo para la caducidad e informar del desfase medido.
     - Verificar primero el supuesto de `ER`, con un osciloscopio o un analizador lógico en la línea TX/RX.
     - Separar en E1 "latencia de orden sin movimiento" y "tiempo de ejecución del movimiento" en función de la distancia y de `SP`.
     - Declarar la placa, los baudios, el broker y las bibliotecas como factores fijos.

5. **E3 (repetibilidad pick&place por MQTT frente a RS-232 directo) no contrasta la aportación.**
   - *Dónde.* `huecos.md` PI3, E3 y A3; `estado_del_arte.md` §8, punto 4.
   - *Problema.* Por ambos canales llega a la D/U-M1 la misma cadena `MP`. La controladora planifica y cierra el lazo, así que la pose final no puede depender del canal salvo que se pierdan o se dupliquen órdenes, y eso ya lo cubren E4 y E5. La repetibilidad mide el estado mecánico del robot, que tiene 40 años, no el puente. Por eso la PI3 ("¿empeora?") tiene un resultado nulo previsible. Además:
     - `WH` da la posición que calcula la controladora a partir de sus encoders, no la posición física del TCP;
     - la "plantilla o calibre" no es un método de medida de repetibilidad;
     - la norma de referencia (ISO 9283) está marcada [POR VERIFICAR] y no está en refs.bib.
   - *Cambio propuesto.* Elegir una de dos opciones:
     - (a) Reducir E3 a una demostración funcional (tasa de éxito y tiempo de ciclo en ≥ 30 ciclos), con una prueba de equivalencia (TOST) del tiempo de ciclo entre canales, y no presentarla como aportación de precisión.
     - (b) Si se quiere dar repetibilidad, medirla según ISO 9283 (repetibilidad de pose RP, con un comparador o reloj palpador sobre 3 ejes y 30 ciclos), presentarla como caracterización del robot heredado y compararla con la nominal del manual.

     En ambos casos, quitar "repetibilidad de pick&place" de la lista de novedades de §8 y de la introducción.

6. **El alcance no cabe en 8–9 páginas, y el carácter del gemelo no coincide con `CLAUDE.md`.**
   - *Dónde.* `huecos.md` §2, §3 (A4), §4 (PI2) y §5 (E2 "si hay gemelo"); la versión para la introducción, aportaciones (ii) y (iii); la matriz, fila "Este trabajo" ("opcional"); `estado_del_arte.md` §8, punto 3 ("un gemelo opcional").
   - *Problema.* Cuatro aportaciones, cinco PI y cinco experimentos con estadística por tramo, QoS, red, tipo de fallo y escenario de robustez no caben en 1300–1500 palabras y 2–3 figuras de resultados (presupuesto de `redaccion-cientifica`). Los documentos tratan el gemelo como opcional y prevén eliminar A4, pero según `CLAUDE.md` ahora es obligatorio. Además, la introducción omite E5.
   - *Cambio propuesto.*
     - Quitar en los tres documentos todas las condiciones del tipo "si hay gemelo", "opcional" y "si el gemelo no llega a tiempo, A4 se elimina".
     - Fijar un núcleo: E1 (latencia), E2 (fidelidad del gemelo), E4 (seguridades) y una versión reducida de E5 (corte del broker, desconexión del RS-232 y una sesión larga).
     - Recortar por E3: reducirlo a una demostración funcional de pocas líneas o eliminarlo (mayor 5).
     - Reducir los factores de E1 a QoS 1 y LAN/Wi-Fi; QoS 0 solo como referencia.
     - Fusionar A1 con A3 como "plataforma + caracterización", porque A1 sola no es una aportación científica (menor 10).
     - Para E2, la skill `diseno-experimental` ya fija ≥ 10 programas × 3 repeticiones. `huecos.md` E2 debería remitir a ese diseño.

7. **Faltan trabajos que matizan H1 y las afirmaciones de "no existe".**
   - *Dónde.* `estado_del_arte.md` §2 ("Ninguno de estos trabajos parte de…") y §7 (a); `huecos.md` H1 ("usan controladoras modernas…") y §6 "Riesgos de cobertura".
   - *Problema.*
     - Holmes, Katavich y Xu (2025), "Retrofitting legacy systems for industry 4.0 via OPC UA and distributed control", *Manufacturing Letters* 44, 1337–1348, [doi:10.1016/j.mfglet.2025.06.153](https://www.sciencedirect.com/science/article/pii/S2213846325001865). Integran dos KUKA (KR10 y KR16) con controladoras KRC2 conservadas, tan antiguas que no admiten RSI, mediante una Raspberry Pi con OPC DA XML y servidores OPC UA. Dan tasas de fallo de pick/place (8,3 % y 15,4 %) y el porcentaje de tiempo perdido en retardos (13,9 %). Es el antecedente más próximo a H1 en manipuladores industriales heredados con protocolo IIoT estándar. No usa puerto serie, así que no invalida A3, pero sí invalida la frase "los que conservan la controladora usan controladoras modernas". La KRC2 es heredada; lo que la distingue del RV-M1 es que tiene interfaz de red.
     - Siguen sin fichar, según el propio `huecos.md` §6, Kumar et al. 2011 (RV-M1 virtual), el trabajo de RA sobre el RV-M1 (2012), Kandala et al. 2025 (IEEE Access) y Brunn y Labib 2005.
     - Faltan las normas que el artículo necesitará: especificación MQTT (OASIS), Sparkplug/ISO/IEC 20237 (mayor 2), ISO 9283 (mayor 5) y la norma de seguridad del robot y de los dispositivos de habilitación (ISO 10218-1), a la que alude el "dispositivo de habilitación" del pendant.
   - *Cambio propuesto.*
     - Fichar Holmes et al. 2025 y Kutzer et al. 2023.
     - Cambiar en H1 y en §2 "controladoras modernas" por "controladoras con interfaz de red (Ethernet, OPC, API del fabricante), aunque sean heredadas".
     - Hacer la segunda ronda dirigida antes de cerrar la introducción.
     - Añadir las normas a refs.bib a través de `investigador` y `verificador-referencias`.

8. **E2 (fidelidad del gemelo), ahora núcleo del artículo, mide coherencia con la controladora, no fidelidad física.**
   - *Dónde.* `huecos.md` PI2, E2 y H5.
   - *Problema.* El error gemelo–real se calcula frente a `WH`, que devuelve la posición que la D/U-M1 calcula con sus encoders, no la posición física del TCP. Si el gemelo usa la cinemática nominal del manual, E2 medirá sobre todo:
     - las diferencias entre la cinemática inversa del gemelo y la de la controladora;
     - la resolución de `WH`;
     - el desfase temporal del ACK `hecho`.

     No medirá cuánto se parece el gemelo al robot físico, que tiene holguras y desgaste. Además, la sincronización es por eventos: el gemelo no tiene trayectoria intermedia observable en el robot real, porque `WH` se lee en reposo (cada 500 ms según el contrato). Esto no está dicho y es justo lo que diferencia este trabajo de los gemelos de estado continuo (H5). Antes era un problema menor (menor 9), pero pasa a mayor porque el gemelo es ahora la aportación principal.
   - *Cambio propuesto.*
     - Definir dos métricas distintas: (a) **coherencia** gemelo–controladora (pose final del gemelo frente a `WH`, y diferencia en el instante del ACK `hecho`) con el diseño de `diseno-experimental` (≥ 10 programas × 3 repeticiones); (b) **fidelidad física** en un subconjunto de poses (p. ej. 5–10), con una medida externa: puntero sobre una plantilla milimetrada, comparador o, si se dispone, un sistema de visión calibrado.
     - Informar ambas en mm y en grados, sin normalizar (evitar la métrica de singh2024unity).
     - Declarar explícitamente la sincronización por eventos como limitación y como rasgo diferenciador.

## Problemas menores

1. **Ciungan.** `huecos.md` §6, fila ciungan2025enhancing: "no mide latencia". La ficha dice "Latencia no reportada en lo leído" (lectura parcial). Cambiar a "no se ha encontrado medida de latencia en las partes leídas" o completar la lectura.
2. **Pontarolli.** `matriz.md`, "Lectura rápida", y `estado_del_arte.md` §2: pontarolli2025analyzing se cuenta como "MQTT con manipulador industrial real". El MQTT es el *Databus* interno del Industrial Edge y el SCARA lo gobierna el PLC. Reformular como "PLC con manipulador; MQTT interno del *edge*".
3. **Alqoud.** `huecos.md` H1: "alqoud2022industry (brazos solo el 16 % de los retrofits)" aparece como prueba de que la taxonomía "no trata este caso". Un 16 % no implica que no se trate. Separar el dato de la conclusión.
4. **"Por primera vez".** `huecos.md` A3: "Es, según la búsqueda realizada, la primera…". `redaccion-cientifica` prohíbe "por primera vez" sin comprobarlo. Usar "no se ha encontrado una caracterización equivalente".
5. **Profanter.** Versión para la introducción, párrafo 3: se cita profanter2019opcua como apoyo de que MQTT es "competitivo frente a OPC UA". En ese trabajo OPC UA cliente/servidor es algo más rápido (520 frente a 584 µs) y MQTT tiene más valores atípicos. Matizar: "con diferencias inferiores al milisegundo en LAN".
6. **Luu.** `estado_del_arte.md` §4: luu2025enhancing da más latencia con QoS 0 (139,3 ms) que con QoS 1 (94,7 ms), lo contrario de lo esperable. Señalarlo como anomalía de la fuente antes de usarlo como referencia de comparación.
7. **N de E4.** `huecos.md` E4: "N repeticiones por tipo" sin fijar, con el objetivo "todas". Con 0 fallos en N ensayos, la cota superior al 95 % es ≈ 3/N (regla de tres). Fijar N ≥ 30 por tipo de fallo (cota ≈ 10 %) o N = 100 (≈ 3 %) e informar de la cota.
8. **Disponibilidad en E5.** `huecos.md` E5: llamar "disponibilidad" al % del tiempo `online` en unas horas puede confundirse con disponibilidad de mantenimiento (MTTF/MDT, sanchezlondono2023smart). Llamarlo "fracción de tiempo en línea durante el ensayo".
9. *(Pasado a mayor 8 al ser obligatorio el gemelo.)*
10. **A1 y la literatura gris.** `huecos.md` A1: el control del RV-M1 por RS-232 desde software existe en la literatura (swider, foit, mihali) y en bibliotecas abiertas (Springwald/Movemaster-RV-M1-Library en .NET; `movemaster-robot` en Node.js), citadas en `busquedas/rvm1-similares.md` como no revisadas por pares. Mencionarlas en una frase para que A1 no parezca original y presentar A1 como base habilitante.
11. **Dispositivo de habilitación.** `huecos.md` A1 y la introducción, aportación (i): "teach pendant de software con dispositivo de habilitación". Mantener pulsada la barra espaciadora no es un dispositivo de habilitación de tres posiciones en el sentido de ISO 10218-1. Llamarlo "pulsación mantenida de habilitación (software)" y declarar que la parada de emergencia es la seta física.
12. **Generalización desde Patrão.** Introducción, párrafo 2: "En 2025 el problema seguía abierto para robots Mitsubishi antiguos" se apoya en un solo trabajo de congreso. Escribir "un estudio de 2025 sobre un RV-2AJ lo deja abierto…".
13. **Pan y Huang.** `huecos.md` H1 cuenta pan2004pcbased entre los que "sustituyen" la controladora, aunque está [POR VERIFICAR] y solo se leyó el resumen. Sacarlo del recuento hasta verificarlo.
14. **Fila "Este trabajo".** `matriz.md`: las celdas de gemelo y métricas describen cosas aún no hechas. Marcarlas todas como "previsto", igual que la de métricas.
15. **Placa por elegir.** `huecos.md` §2: "ESP32 o Raspberry Pi" sigue abierto. La elección cambia la latencia, el reloj y la pila MQTT. Fijarla antes de E1.
16. **Amenazas a la validez.** No hay una lista de amenazas a la validez: un único robot envejecido, una sola red, un solo broker, el desgaste mecánico y las versiones de firmware. Añadirla en `huecos.md` §5 para que la recoja `analista-experimentos`.
17. **Frase ambigua.** `estado_del_arte.md` §2: "Estos trabajos son los únicos de su grupo que aportan medidas" es ambiguo, porque campos2019diseno no da medidas de prestaciones. Precisar a cuáles se refiere (jokic, conchasanchez, roldan).

## Comprobaciones hechas (búsquedas, cifras contrastadas)

**Documentos leídos.** `CLAUDE.md`, `.claude/agents/revisor.md`, la skill `rubrica-revision`, los tres documentos revisados, `docu/contrato_mqtt.md`, `README.md`, los cuatro registros de `busquedas/` y las fichas citadas abajo.

**Cifras contrastadas con las fichas (coinciden):**
- alqoud2022industry: 32 trabajos; 16 % brazos y 50 % CNC; 12,5 / 25 / 62,5 %; MQTT 25 %; incoherencia 28/32 = 72 %.
- luu2025enhancing: 139,3 / 94,7 / 101,3 ms; unos 50 robots por broker; 30 % de pérdidas → 2 %.
- bray2024latency: 6,6 / 58,4 / 115,4 / 240,7 ms.
- profanter2019opcua: 584 / 520 / 618 µs.
- ariascachero2023operational: 2,5 frente a 10,1 ms; 5G añade unos 28 ms; solo QoS 0.
- pontarolli2025analyzing: 5,94–7,23 ms; p95 de 9 ms; n = 200; *sniffer* y NTP con GPS.
- ogorodnyk2020towards: unos 39,5 Hz cuando se piden 100 Hz.
- jokic2020two: 40 mrad; unos 12 k€ frente a unos 35 k€.
- roldan2018enhancing: 0,3 mm en una trayectoria, sin método documentado.
- conchasanchez2020recycling: unos 230 USD.
- zhang2024construction: 2,01–3,83 mm; unos 0,07 s.
- singh2024unity: 77,67 ± 15,74 ms; 99,99 % normalizado por 180°; ciclos de 8 h.
- liang2020bidirectional: 10⁻⁷–10⁻⁵ rad, con posible errata.
- kuts2019digital: "32,875 ms".
- bravoarrabal2025iort: 58 ms, pico de 318 ms, ping de 116 ms.
- erdei2022digital: unos 8 alumnos; n = 10.
- kumar2024scalable: más de 2700 alumnos; unos 300 ms.
- pang2022remote: n = 64; 58 frente a 60 respuestas.
- antonelli2023virtual: n = 70.
- ciungan2025enhancing: n = 31.
- mendonca2025development: madurez RAMI de 3→4; el módulo del brazo no inicializaba.
- kolla2022retrofitting: RPi, Node-RED, InfluxDB, Grafana.
- xiang2024development: unos 17 ms como inverso de las peticiones por segundo.

**Desajustes encontrados.** chang2025construction (mayor 2), ciungan2025enhancing (menor 1) y pontarolli2025analyzing (menor 2).

**Coherencia con el contrato.** Coinciden la caducidad de 500 ms, el destino en el topic y en el payload, los comandos sin retain, el LWT, los motivos de rechazo y el alcance de `parar`. La caducidad solo se comprueba al recibir la orden y las órdenes se encolan (mayor 3).

**Extensión.** La versión para la introducción tiene 539 palabras sin las claves y 24 claves distintas, dentro del presupuesto de la skill `redaccion-cientifica` (1100–1300 palabras de introducción y unas 25–35 referencias en total).

**Búsquedas web para comprobar la novedad (2026-11-25):**
- "legacy industrial robot RS-232 controller MQTT gateway digital twin": solo páginas comerciales de pasarelas serie→MQTT genéricas; ningún manipulador.
- "Movemaster RV-M1 IoT MQTT Raspberry Pi": solo la biblioteca .NET de Springwald (RS-232, sin red).
- "Mitsubishi RV-2AJ digital twin implementation Node-RED RS-232": nada que implemente lo que patrao2025understanding deja abierto. Se revisaron F1000Research 15-617 (PLC Allen-Bradley, sin robot) y Cristea et al. 2026 (ABB en RobotStudio, sin serie).
- "Movemaster robot digital twin / IoT / Industry 4.0 2023–2025": Loyola et al. 2023 (CCC, robot de 3 GDL sin especificar) y Guerra-Zubiaga et al. 2024 (IMECE, FANUC, cualitativo). Ninguno compromete la novedad.
- "RV-M1 Mitsubishi robot ROS driver serial original controller": solo drivers ROS 2 para MELFA modernas y el paquete npm `movemaster-robot` (RS-232, local).
- "retrofit legacy robot arm original controller serial interface OPC UA OR MQTT latency": **Holmes et al. 2025** (mayor 7) y "OPC-UA Agent for Legacy PLCs" (Applied Sciences 2022, doi:10.3390/app12178859; no se pudo abrir; trata PLC, no robots).
- "Scorbot ER digital twin / controller / MQTT": **Kutzer et al. 2023, ScorBot Toolbox** (mayor 1), Sheshu et al. 2026 (ISSF, brazo de servos con UDP; 32 ms de sincronización) y un artículo PMC sobre una plataforma VR de robots industriales modernos.
- Normas: especificación OASIS MQTT v5.0 (*Message Expiry Interval*) y especificación Eclipse Sparkplug (certificados de muerte por LWT y secuencia; ISO/IEC 20237).
- Kumar, Kalra y Prakash 2011, "A virtual RV-M1 robot system": sigue sin localizarse (solo resultados indirectos).

**Resultado sobre la novedad.** No se ha encontrado ningún trabajo que conecte un manipulador cuya única interfaz es un puerto serie, con su controladora original, a un protocolo IIoT estándar con medidas, así que A3 y el núcleo de H1/H2 se sostienen. Hay dos trabajos que obligan a reformular. Kutzer et al. 2023 compromete la formulación actual de A4 (intercambiabilidad simulador/robot en un robot heredado con controladora original) y de H8. Holmes et al. 2025 compromete la frase de H1 sobre "controladoras modernas". Las normas MQTT/Sparkplug comprometen la presentación de A2 como mecanismos no descritos.

**No revisado.** `referencias/refs.bib` (en verificación por otro agente). Tampoco se han abierto los textos originales de las 41 fuentes: la trazabilidad se ha comprobado contra las fichas.

## Recomendación: revisión mayor — motivo

La base es buena: síntesis comparativa, cautela al formular los huecos y cifras que coinciden con las fichas. La aportación central (A3, caracterización medida de una cadena serie heredada conectada a MQTT) sigue siendo defendible tras las búsquedas. Pero hay tres cambios que hacer antes de pasar a los protocolos y a la redacción:
- reformular la novedad de A2 (mecanismos estándar) y de A4 (Mihali 2005 y Kutzer 2023), y corregir la frase de la introducción que el propio documento contradice (mayores 1, 2 y 7);
- corregir los defectos del contrato que harían fallar E4 y rediseñar E1 y E3 para que midan lo que dicen medir (mayores 3, 4 y 5);
- recortar el alcance para que quepa en 8–9 páginas, alinear los documentos con `CLAUDE.md` (el gemelo es obligatorio) y separar en E2 la coherencia con la controladora de la fidelidad física (mayores 6 y 8).

Ninguno de estos cambios exige rehacer el estado del arte. Hace falta fichar 2–4 trabajos, cambiar varias frases y reordenar los experimentos. Tras corregirlos, se recomienda una revisión v2.
