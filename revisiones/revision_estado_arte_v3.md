# Revisión de estado del arte (estado_del_arte.md, huecos.md, matriz.md) — v3

Revisor: agente `revisor` (no ha participado en la elaboración). Fecha: 2026-11-25.
Enfoques: novedad, cobertura, rigor metodológico, trazabilidad y reproducibilidad, más el contraste con la introducción ya redactada del artículo.

**Material leído:**
- `CLAUDE.md`, la revisión v2 y la respuesta del investigador (`respuesta_estado_arte_v2.md`);
- la versión 3 de `estado_del_arte.md`, `huecos.md` y `matriz.md`;
- las fichas nuevas barbie2024digital, chitta2017roscontrol, crespo2015virtual y kritzinger2018digital;
- las notas añadidas a mihali2005effective, oasis2019mqtt e iso2023sparkplug, y la ficha swider2007system;
- `investigacion/busquedas/revision-v2.md`, `docu/contrato_mqtt.md` v0.4 y `gemelo/README.md`;
- `paper/secciones/01_introduction.tex`.

**Fuera de alcance:** las 4 referencias nuevas de `refs.bib` las verifica otro agente en paralelo y **no se dan por verificadas** en este informe. Tampoco se ha comprobado si las entradas existen en `refs.bib`.

## Resumen del documento (3–4 líneas)

La v3 redefine el gemelo con tres modos (`emulador`, `sombra`, `sincronizado`) y los clasifica con la taxonomía de Kritzinger (modelo, sombra y gemelo). Declara con honestidad que ningún modo es un gemelo en sentido estricto. Retira los diferenciadores débiles ("bus pub/sub multicliente", "destino en el mensaje" y "emula la controladora" como idea propia) y reconoce ros_control, Kaarlela y los *Digital Twin Prototypes* como antecedentes. Además, amplía E1.0 a `WH` con una tabla de casos A/B/C y desdobla E2 en E2a/E2b/E2c. Corrige la cita MQTT–OPC UA y resuelve casi todos los menores.

Queda un problema de fondo, de nuevo en la aportación principal. El diferenciador con el que se ha sustituido a los anteriores, la "emulación de la **semántica** de un intérprete serie industrial de los 80", tiene antecedentes directos, y uno de ellos es **sobre el propio RV-M1** (mayor 1). Esa formulación la propuse yo en la v2 sin haberla contrastado con la simulación comercial de controladoras. Lo corrijo aquí.

## Puntuaciones

| Criterio | Nota (v2 → v3) | Justificación |
|---|---|---|
| Novedad | 3 → 3 | A1 y A2 siguen bien formuladas. En A3, el apartado (a) es terminología, no una aportación. El (b), la emulación de la semántica, choca con COSIMIR (lenguaje MRL del RV-M1 con la controladora simulada), con los controladores virtuales RRS/VRC (desde 1992) y con la propia ficha swider2007system (mayor 1). Solo el (c), la separación medida entre coherencia y fidelidad física, junto con la observabilidad medida, sostiene la aportación principal. |
| Cobertura del estado del arte | 4 → 4 | Bien integrados Kritzinger, Barbie, ros_control y Crespo (§3, §5, matriz y H4). Falta toda la línea de **controladores virtuales y simulación realista de controladoras** (RRS-1/RRS-2, VRC de fabricante, COSIMIR), que es la más próxima al nuevo A3 (b). |
| Rigor metodológico | 3 → 4 | Mejora clara. Hay una tabla de casos de E1.0 con sus consecuencias, E2a declara medir un emulador en lazo abierto, E2b tiene registro e incertidumbre, E2c es nuevo y E4 está bien repartido. Quedan dos riesgos: circularidad entre el ajuste del emulador y E2a (menor N3-1), y la pose retenida en E2c (menor N3-5). |
| Trazabilidad | 4 → 4 | El mayor 3 de la v2 está resuelto y las cifras de ariascachero coinciden con la ficha. Pero las definiciones de Kritzinger proceden de Barbie y de **Wikipedia**, no de la fuente (menor N3-2). Hay además restos de la clasificación antigua de Mihali (menor N3-4). |
| Reproducibilidad | 3 → 4 | El contrato v0.4 define los modos y los topics que se leen, y `huecos.md` §3.3 especifica el emulador con su estado. Sigue sin elegirse la placa (menor 15 de la v1) y los parámetros del emulador son provisionales. |
| Claridad | 4 → 4 | La terminología modelo/sombra está bien explicada en `huecos.md` §3.1. Hay una incoherencia en el nivel asignado a las "visualizaciones sincronizadas" (menor N3-3). |
| Adecuación a la revista | 4 → 4 | 33 referencias previstas, por debajo del límite. La introducción en LaTeX está en el límite de palabras y no incluye las preguntas de investigación (ver "Desajustes"). |

## Problemas mayores

1. **El nuevo diferenciador de A3 (b), "emulación de la semántica de un intérprete serie industrial de los 80", tiene antecedentes directos, incluso sobre el RV-M1.**
   - *Dónde.*
     - `huecos.md`: H4 ("Lo que no se ha encontrado es la emulación, con su semántica, de un intérprete de órdenes serie de una controladora industrial de los 80"), §3.2 A3 (b), §6 (riesgos; no aparecen) y §1 "Riesgo de percepción";
     - `estado_del_arte.md`: §5 "Emulación de dispositivos" (último párrafo), §7 carencia (c) y §8 punto 1 y párrafo final ("de los prototipos de gemelo [...] en que emula la semántica de una controladora industrial");
     - `matriz.md`: lectura rápida, "Emulación del dispositivo";
     - introducción del artículo, aportación (i).
   - *Problema.* Hay tres antecedentes:
     - **COSIMIR (Festo / EF Robotertechnik).** Según una copia de su manual ([rahebeducation.web.app](https://rahebeducation.web.app/content/2%C3%A9me%20annee/cosimir/cosimir%20eng.html), §2.4), permite elegir celdas "with either the Mitsubishi RV-2AJ robot or the RV-M1 predecessor model", y con el RV-M1 se usa "the simple command language, Movemaster Command (MRL)". La simulación "includes a fully fledged robot controller" (§2.2), y en E/S serie "the robot controller is only replicated in the simulation" (§3.3). Es decir: hay un emulador comercial de la controladora del RV-M1 que interpreta su lenguaje de órdenes, y existe desde hace décadas. Además, patrao2025understanding, que está en la matriz, trabaja con COSIMIR sobre un RV-2AJ.
     - **Realistic Robot Simulation (RRS).** La interfaz RCS (RRS-1, 1992–1993) proporciona "the original motion control software as a call library", y la interfaz VRC (RRS-2, 1998–2001) integra el software de la controladora "almost completely into simulators", con el objetivo de simular con exactitud las controladoras ([Fraunhofer IPK](https://www.ipk.fraunhofer.de/en/expertise-and-technologies/automation/realistic-robot-simulation-rrs.html); también [RoboDK](https://eu.robodk.com/doc/en/RRS.html)). La emulación fiel del comportamiento de una controladora industrial, con su planificación y sus tiempos de ciclo, es una línea industrial consolidada.
     - **swider2007system, ya fichado.** La ficha dice que ROBO "reconoce solo un subconjunto de órdenes del lenguaje del robot". Es un simulador del RV-M1 que interpreta su lenguaje. Otro artículo corto del mismo grupo (Świder et al., 2007, *JAMME* 20(1–2), [PDF](https://delibra.bg.polsl.pl//Content/38967/BCPS_40662_-_The-off-line-program_0000.pdf)) describe que ROBO puede enviar datos al robot real en tiempo real mientras se mueve el brazo virtual. No está fichado y conviene leerlo, porque afecta también a la clasificación de swider2007system como "simulación no sincronizada".

     Con esto, la afirmación de H4 y de §7 (c) no resiste: emular el intérprete de la D/U-M1, incluso con errores y tiempos, ya se ha hecho, aunque sea en software cerrado o en simuladores académicos. A3 queda entonces así:
     - (a) es la aplicación de una taxonomía existente: útil y honesta, pero **no es una aportación**;
     - (b) es, en lo esencial, conocido;
     - (c) más la medida de la observabilidad (E1.0, E2c) es lo único defendible.

     Si el artículo mantiene (b) como novedad, un revisor de RIAI que conozca COSIMIR o RRS lo rechazará, y es la aportación que según `CLAUDE.md` da nivel al trabajo.
   - *Cambio propuesto.*
     - Fichar COSIMIR (manual o ficha técnica como literatura gris; comprobar en patrao2025understanding cómo lo describen) y una referencia revisada por pares de RRS/VRC. La debe localizar `investigador`; no la invento aquí.
     - Releer swider2007system y el artículo corto de *JAMME* 20 para ver qué parte del lenguaje interpretan y si el simulador gobierna al robot en vivo.
     - Añadirlos a `huecos.md` §6 como **riesgo alto**, por encima de barbie2024digital.
     - Reformular H4 y A3 (b). Lo que no se ha encontrado no es la emulación de la semántica, sino **un emulador abierto de la controladora detrás de un contrato de mensajería idéntico al del robot real, con su coherencia frente a esa controladora medida**. Ni COSIMIR ni RRS, que se sepa por lo leído, publican medidas de coherencia con el robot real de un modelo antiguo. Esto debe confirmarse en la búsqueda antes de escribirlo.
     - Reescribir A3 con el peso en lo medible:
       1. un gemelo web abierto en los niveles modelo y sombra, declarados como tales;
       2. la coherencia del emulador y la fidelidad física, medidas por separado;
       3. la observabilidad que permite una controladora que solo informa bajo petición, medida con E1.0 y E2c.

       Bajar (a) a "marco de definición" en métodos, no en la lista de aportaciones.
     - Ajustar §5, §7 (c), §8, la matriz (lectura rápida) y la versión para la introducción.

## Problemas menores

**Nuevos en la v3**

- **N3-1. Circularidad entre el ajuste del emulador y E2a.**
  - *Dónde:* `huecos.md` §3.3 y E2a.
  - *Problema:* el modelo de tiempos se ajusta "con los tiempos de ejecución medidos en E1", y `gemelo/README.md` propone usar el modo SOMBRA para "corregir los límites". Si los mismos movimientos o los mismos datos sirven para ajustar y para evaluar, E2a sobrestimará la coherencia.
  - *Cambio:* exigir en E2a (1) programas de evaluación distintos de los de ajuste y (2) parámetros congelados y versionados (commit) antes de E2a, declarados en el artículo. Añadirlo a las amenazas internas.
- **N3-2. Definiciones de Kritzinger tomadas de fuentes secundarias.**
  - *Dónde:* ficha kritzinger2018digital ("Leído"), §5 y `huecos.md` §3.1.
  - *Problema:* la ficha declara como fuentes barbie2024digital y la entrada de Wikipedia "Digital twin integration level". Las he contrastado: Wikipedia da las mismas definiciones y las atribuye a Kritzinger ([Wikipedia](https://en.wikipedia.org/wiki/Digital_twin_integration_level)). Coinciden con la ficha, pero una enciclopedia no puede sostener la definición en la que descansa la aportación principal.
  - *Cambio:* que no pase al artículo hasta que `verificador-referencias` lo confirme en el texto completo, y retirar Wikipedia de la ficha como fuente (dejarla, como mucho, como "contraste").
- **N3-3. Nivel de las "visualizaciones sincronizadas".**
  - *Problema:* `estado_del_arte.md` §5 dice "Con lo fichado no se les asigna un nivel de Kritzinger". La leyenda de `matriz.md` dice "visualización sincronizada sin órdenes = sombra digital".
  - *Cambio:* elegir una de las dos opciones y aplicarla en los dos documentos.
- **N3-4. Restos de la clasificación antigua de mihali2005effective.**
  - *Problema:* la ficha conserva en "Solución" la línea "Gemelo digital: visualización sincronizada", contradictoria con su nota N8. "Relación con nuestro trabajo" sigue diciendo "simulador sincronizado". La introducción del artículo lo clasifica igual (ver "Desajustes").
  - *Cambio:* corregir la ficha en los dos sitios. La nota está bien, pero la ficha se lee de arriba abajo.
- **N3-5. Pose retenida en la sombra (E2c y E2a).**
  - *Problema:* `posicion/mundo` se publica con retain y QoS 0. Al suscribirse, la sombra recibe la última pose retenida, que puede tener minutos de antigüedad.
  - *Cambio:* en E2c, la antigüedad tiene que calcularse con el `ts` de la placa, y las muestras retenidas al suscribirse deben marcarse o descartarse. Hay que indicarlo en el protocolo, y es una decisión para `ingeniero`/`analista-experimentos`. Además, el tramo "red (de E1)" de E2c se toma de otro experimento: declararlo como estimación, no como medida en E2c.
- **N3-6. "El gemelo nunca publica en `rvm1/real/...`".**
  - *Dónde:* `huecos.md` §3.1, §8 y la ficha kritzinger.
  - *Problema:* `gemelo/README.md` registra una excepción: el pendant integrado con destino REAL publica `comandos` (solo como `profesor`). La conclusión, nivel sombra, se mantiene, porque es un flujo manual. Pero la frase, al pie de la letra, es falsa para la aplicación.
  - *Cambio:* "el modelo nunca publica en el real; las órdenes al real las da una persona, también desde el pendant integrado, y eso es flujo manual en términos de Kritzinger".
- **N3-7. Coherencia entre contrato y gemelo.**
  - *Problema:* el README cita el contrato v0.3 en su cabecera. En SOMBRA lee también `online`, que el contrato v0.4 no lista. Y en SINCRONIZADO publica `online = "offline"`, que es una propuesta aún no incorporada.
  - *Cambio:* es tarea de `ingeniero`, pero afecta a la reproducibilidad de E2. Señalarlo en las observaciones abiertas de `huecos.md` §5.
- **N3-8. Alcance de "ningún trabajo separa coherencia y fidelidad física".**
  - *Dónde:* §5 y la introducción.
  - *Problema:* comparar la pose que informa la controladora con una medida externa es lo que hacen la calibración de robots e ISO 9283.
  - *Cambio:* acotar siempre a "en los gemelos de manipuladores revisados", como ya se hace en parte, para que no parezca que se reivindica la separación en sí.
- **N3-9. Ficha iso2023sparkplug.** La cabecera "Leído" sigue diciendo que no se ha leído el texto normativo y que se usó documentación secundaria. Actualizarla con la lectura parcial de la especificación de Eclipse 3.0.0 (primer tercio).
- **N3-10. Versión para la introducción en `estado_del_arte.md`.** "Esos gemelos se alimentan del estado continuo de controladoras con interfaz de red [singh; chang]": chang2025construction **sondea** a 125 Hz. Escribir "continuo o sondeado a alta frecuencia", como en §5.

**Heredados**

- **Menor 15 de la v1 (placa).** Sigue abierto. Bloquea E1.0, E1 y la decisión sobre MQTT 5 (N1).
- **N12 (qué ACK se repite ante un duplicado)** y **N13 (kumar2011virtual)**: trasladados a `ingeniero` y `verificador-referencias`. Es correcto, pero siguen abiertos.
- **Manual del RV-M1** sin entrada en `refs.bib` (lo reconoce `huecos.md` §8). Hace falta para métodos y para los supuestos S1–S6.

## Seguimiento de la v2

| Problema v2 | Estado | Comentario |
|---|---|---|
| M1 Gemelo definido de forma contradictoria | **Resuelto** (con condiciones) | Tres modos con su flujo de datos (`huecos.md` §3.1), coherentes con el contrato v0.4. Se declara que no hay gemelo estricto. "Sincronizado por eventos" se retira. E2a declara medir el emulador en lazo abierto. E2c mide la sombra. Hay especificación mínima del emulador (§3.3). Condiciones: verificar Kritzinger en la fuente (N3-2), congelar los parámetros antes de E2a (N3-1) y matizar "nunca publica" (N3-6). |
| M2 Novedad de A3/H4 sobrevalorada | **Parcialmente resuelto** | Bien retirados "bus pub/sub multicliente", "destino en el mensaje" y "emula la controladora" como idea propia. ros_control, Barbie y Crespo están fichados. E1.0 se amplía a `WH` con tabla de casos. Pero el diferenciador que los sustituye, la semántica del intérprete, tiene antecedentes (COSIMIR, RRS, swider2007system), lo que da lugar al **nuevo mayor 1**. La formulación la sugerí yo en la v2; el error de partida es mío. |
| M3 Cita MQTT–OPC UA contradice su fuente | **Resuelto** | Introducción, §4 y §7.1 corregidos. Las cifras de ariascachero coinciden con la ficha. La introducción del artículo también lo recoge bien. |
| N1 `ts` frente a *Message Expiry* | Resuelto | Las tres razones aparecen en `huecos.md` A2, §5, §8 y en la ficha. |
| N2 Cota 3/N | Resuelto | Solo los 5 tipos dependientes del tiempo, con casos frontera. Los deterministas van con `node --test` y unos 3 ensayos. Unos 175 ensayos. |
| N3 Ventana efectiva | Resuelto | De unos 400 a 600 ms en PI1, con el matiz del desfase del cliente. |
| N4 Referencia externa en E2b | Resuelto | Resolución exigida, registro con al menos 3 puntos, residuo declarado y poses de medida distintas de las de registro. |
| N5 `WH` no es un `cmd` | Resuelto | La latencia se mide con `velocidad`. |
| N6 Multicliente en E2a | Resuelto | E2a sin otros clientes; la demostración pasa a un bloque aparte de E4. |
| N7 *Keep alive* | Resuelto | Fijado y comparado con 1,5 × *keep alive*. |
| N8 mihali2005effective | **Parcialmente resuelto** | Reclasificado como lazo abierto en la matriz, §5 y H5, marcado como inferencia. Pero la ficha conserva la clasificación antigua (N3-4), y la introducción del artículo también. |
| N9 Presupuesto de referencias | Resuelto | 29 + 4 = 33. Falta la entrada del manual. Si se añaden COSIMIR y RRS (mayor 1), habrá que aplicar los recortes ya previstos (foit, liang, alvares). |
| N10 Sparkplug | Resuelto | Especificación de Eclipse leída en parte (§2.4, §4.2.1). Falta actualizar la cabecera de la ficha (N3-9). Queda abierta la elección ISO/Eclipse para el verificador. |
| N11 "No se ha encontrado" | Resuelto | "Controladora industrial heredada" en la introducción, §7 (a) y H1. |
| N12 Duplicados | Trasladado | A `ingeniero` (§3.3 y §5). Sigue abierto. |
| N13 kumar2011virtual | Trasladado | A `verificador-referencias`. |
| Menor 15 de la v1 (placa) | **No resuelto** | Bloquea E1.0. |

## Desajustes con la introducción del artículo (`paper/secciones/01_introduction.tex`)

La introducción se escribió en paralelo y refleja en gran parte la v2. Los desajustes se ordenan de mayor a menor gravedad.

1. **Aportación (i) (párrafo "La aportación principal es…").**
   - No cita Kritzinger.
   - No declara el nivel (modelo y sombra) ni que no es un gemelo en sentido estricto. Para un lector de RIAI, "gemelo digital web con tres modos" sin esa declaración vuelve a la contradicción del mayor 1 de la v2.
   - No cita Barbie.
   - Omite que se mide cuánta trayectoria del real puede observar la sombra, que en la v3 forma parte de (i).
   - Presenta "aplica la emulación de dispositivos a una controladora que solo informa bajo petición" como rasgo propio, lo que queda afectado por el nuevo mayor 1.

   Hay que reescribirla tras resolver el mayor 1.
2. **Tabla comparativa (`tab:comparativa`).**
   - La fila de mihali2005effective dice "Visualización sincronizada". La v3 lo clasifica como **visualización en paralelo, en lazo abierto**, con lectura de estado [POR VERIFICAR].
   - Faltan los dos trabajos que `huecos.md` §6 sitúa entre los de mayor riesgo: **barbie2024digital** (y, tras el mayor 1, COSIMIR/RRS) y **crespo2015virtual**, que es el mismo robot.
   - La fila "Este trabajo" dice "Emulador, sombra y sincronizado", sin el nivel. Proponer "Modelo emulado y sombra (Kritzinger); estado bajo petición (`WH`/`ER`)". Las medidas tampoco incluyen la observabilidad.
   - chang2025construction aparece con "Error XYZ de ±1 mm", cuando la ficha dice "mayoritariamente dentro de ±1 mm". Es una sobreafirmación.
   - Toda la fila "Este trabajo" es "previsto" mientras no haya datos. Está bien en el artículo final, pero no debe compilarse para circular antes de los resultados sin marcarla.
3. **Antecedentes sobre el RV-M1 (párrafo "En el RV-M1, la vía no invasiva…").**
   - Falta **crespo2015virtual**, que la versión v3 para la introducción sí incluye (simulador VR, paso por fichero).
   - Tras el mayor 1 habrá que mencionar también la simulación comercial de la controladora del RV-M1 (COSIMIR).
   - La frase sobre Mihali ("un simulador OpenGL que se mueve a la par que el robot") es compatible con la v3. No debe añadirse "sincronizado".
4. **`\FALTA` que la v3 ya cubre.** Kritzinger (párrafo de gemelos), ros_control y Barbie (párrafo "Que un mismo programa…") tienen ya clave en `refs.bib`: kritzinger2018digital, chitta2017roscontrol y barbie2024digital. Hay que sustituirlos **solo cuando** `verificador-referencias` las dé por buenas. Kritzinger necesita además la comprobación de las definiciones en la fuente (N3-2).
5. **`\VERIFICAR` de Sparkplug.** El texto dice "mecanismo de Sparkplug tomado de documentación secundaria". La v3 ya lo ha leído en la especificación de Eclipse 3.0.0 (§2.4, §4.2.1). Hay que actualizar la frase ("registra el certificado de muerte del nodo como última voluntad y empareja nacimiento y muerte con `bdSeq`") y quitar la marca cuando el verificador decida cómo citar la norma (ISO o Eclipse).
6. **Hueco (párrafo "Por tanto, en la búsqueda realizada…").** Coincide con la v3. Pero la frase "A diferencia de las controladoras que alimentan los gemelos revisados, la D/U-M1 solo informa… cuando se le piden" debe quedar condicionada a E1.0. En el caso B (`WH` responde durante el movimiento), la diferencia es de frecuencia, no de naturaleza.
7. **Preguntas de investigación.** La skill `redaccion-cientifica` pide que la introducción incluya las PI. El texto no las tiene. La v3 tiene PI1–PI4 en `huecos.md` §4.
8. **Párrafo de organización.** No menciona dónde se describe el gemelo, que es la aportación principal. Según la estructura acordada va en la `sec:modernisation`: decirlo ("…el proceso de modernización y el gemelo digital…").
9. **Erratas y extensión.**
   - Falta un espacio en "predomina la sustitución.\citet{alvares2018retrofitting}".
   - El texto tiene unas 1300 palabras sin la tabla, en el límite superior del presupuesto (1100–1300). Añadir Crespo, las PI y la declaración de niveles obliga a recortar en otro sitio, por ejemplo el detalle de alvares, jokic y conchasanchez en el segundo párrafo, que la versión v3 resume en una frase.
10. **Lo que sí coincide.** Comparación MQTT–OPC UA (mayor 3 de la v2 resuelto, con las cifras correctas), Holmes, Patrão, Kutzer, el hueco con "controladora industrial heredada", las aportaciones (ii) y (iii) y la frase sobre la fidelidad heterogénea. El conjunto de claves (25 citadas, más 3 `\FALTA` y crespo) coincide con las 29 de `huecos.md` §8.

## Comprobaciones hechas (búsquedas, cifras contrastadas)

**Coherencia interna:**
- Contrato v0.4, "Modos del gemelo": coincide con la tabla de `huecos.md` §3.1 (topics leídos y "nunca publica en `rvm1/real/...`"). Discrepancias con `gemelo/README.md` en N3-6 y N3-7.
- `gemelo/README.md`: la especificación del emulador en §3.3 (parámetros provisionales, supuestos S1–S6, `TL` 107 mm, J4→brida 72 mm, `NT` 4 s, SP lineal) coincide con el README.
- Fichas nuevas: lo que §3, §5 y la matriz atribuyen a barbie2024digital (Socat RS-232→TCP, sin medida de discrepancia, código Apache 2.0), chitta2017roscontrol (cita "whether it is a real or simulated robot"), crespo2015virtual (paso por fichero con software de Denford, evaluación sin tamaño de muestra) y kritzinger2018digital (literatura del gemelo estricto escasa, del resumen) coincide con las fichas.
- Cifras de ariascachero2023operational y profanter2019opcua en §4, §7.1 y la introducción: coinciden con las fichas.
- Recuento de E4: 5 × 30 + unos 8 × 3 ≈ 175 ensayos. Coincide.

**Búsquedas web (2026-11-25):**
- "Realistic Robot Simulation RRS virtual robot controller": [Fraunhofer IPK](https://www.ipk.fraunhofer.de/en/expertise-and-technologies/automation/realistic-robot-simulation-rrs.html). RRS-1 (interfaz RCS, 1992–1993) da el software original de control de movimiento como biblioteca. RRS-2 (VRC, 1998–2001) integra casi por completo el software de la controladora en el simulador. No da cifras de exactitud. Lo mismo en [RoboDK](https://eu.robodk.com/doc/en/RRS.html). Afecta al mayor 1.
- "COSIMIR Movemaster RV-M1 MRL": copia del manual de COSIMIR ([rahebeducation.web.app](https://rahebeducation.web.app/content/2%C3%A9me%20annee/cosimir/cosimir%20eng.html)). Admite celdas con RV-M1 y su lenguaje MRL, y la simulación incluye "a fully fledged robot controller". Es literatura gris en una copia no oficial: hay que localizar una fuente citable. Afecta al mayor 1.
- Silesia: Świder, Foit, Wszołek y Mastrowski (2007), *JAMME* 20(1–2), "The off-line programming and simulation software for the Mitsubishi Movemaster RV-M1 robot" ([PDF](https://delibra.bg.polsl.pl//Content/38967/BCPS_40662_-_The-off-line-program_0000.pdf)). ROBO puede enviar datos al robot real en tiempo real mientras se mueve el brazo virtual, por RS-232 a través de KAMROB/SERWER, sin medidas. Distinto de swider2007system (*JAMME* 25(1)). Hay que fichar o releer.
- "Kritzinger digital model digital shadow": [Wikipedia, "Digital twin integration level"](https://en.wikipedia.org/wiki/Digital_twin_integration_level). Modelo: flujo manual en los dos sentidos. Sombra: automático del físico al digital y manual en sentido contrario. Gemelo: automático en los dos. Atribuido a Kritzinger et al. (2018). Coincide con la ficha, pero no sustituye a la fuente (N3-2).

**Resultado sobre la novedad.**
- A1 se sostiene: no se ha encontrado una caracterización medida de una cadena serie industrial heredada conectada a IIoT.
- A2 se sostiene como adaptación verificada.
- A3 se sostiene solo en (c) y en la medida de la observabilidad. El (a) es terminología. El (b), la emulación de la semántica del intérprete, tiene antecedentes comerciales y académicos, uno de ellos sobre el RV-M1 (COSIMIR) y otro dentro de la propia matriz (swider2007system).

**No revisado.** Las 4 referencias nuevas (las verifica otro agente) y su presencia en `refs.bib`. Tampoco se han abierto los textos originales de barbie, chitta y crespo: la trazabilidad se ha comprobado contra las fichas.

## Recomendación: revisión mayor (acotada) — motivo

La v3 resuelve bien los tres mayores de la v2 en lo que pedían:
- el gemelo está definido y es coherente con el contrato;
- los diferenciadores débiles se han retirado y los antecedentes se reconocen;
- la cita MQTT–OPC UA está corregida.

También resuelve 11 de los 13 menores; los otros dos están trasladados a otros agentes. El rigor metodológico ha subido de forma clara.

Queda **un problema mayor**, de nuevo en la aportación principal. La "emulación de la semántica de un intérprete serie de los 80" no es nueva: COSIMIR simula la controladora del RV-M1 con su lenguaje MRL, RRS/VRC emula controladoras industriales desde los años 90 y swider2007system ya interpretaba parte del lenguaje del RV-M1. La corrección es acotada y no obliga a rehacer el estado del arte:
- fichar COSIMIR, una referencia de RRS/VRC y releer los dos trabajos de Silesia;
- reformular H4, A3 y §7 (c) con el peso en la coherencia medida frente a la controladora real, la separación coherencia/fidelidad física y la observabilidad medida;
- sacar los modos de Kritzinger de la lista de aportaciones.

En paralelo, la introducción del artículo debe alinearse con la v3 (sección "Desajustes", puntos 1–5) **después** de resolver el mayor 1 y de que el verificador apruebe las 4 claves nuevas. Se recomienda una revisión v4, que debería ser rápida.
