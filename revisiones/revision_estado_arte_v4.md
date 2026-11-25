# Revisión de estado del arte (estado_del_arte.md, huecos.md, matriz.md) — v4

Revisor: agente `revisor` (no ha participado en la elaboración). Fecha: 2026-11-25.
Enfoques: novedad (sobre todo A3), cobertura, rigor metodológico, trazabilidad y reproducibilidad.

**Material leído:**
- `CLAUDE.md`, mi revisión v3 y la respuesta del investigador (`respuesta_estado_arte_v3.md`);
- la versión 4 de `estado_del_arte.md` (con la versión para la introducción), `huecos.md` y `matriz.md`;
- las fichas nuevas swider2007offline, keibel2002konzeption, freund1994towards, bernhardt1995realistic, bernhardt2002cost y la ficha de pista karras2003cosimir;
- las fichas corregidas swider2007system, kritzinger2018digital, mihali2005effective e iso2023sparkplug (cabecera y primer apartado);
- `investigacion/busquedas/revision-v3.md`.

**Fuera de alcance:**
- Las 5 referencias nuevas de `refs.bib` las verifica otro agente en paralelo y **no se dan por verificadas** en este informe.
- No he abierto los textos de Keibel ni de Bernhardt y Willnow: lo que digo de ellos se apoya en las fichas.
- Tampoco he revisado `paper/`, que no ha cambiado en esta ronda.

## Resumen del documento (3–4 líneas)

La v4 acepta por completo el mayor 1 de la v3:
- retira la emulación de la semántica de la controladora como novedad;
- ficha RRS/VRC (Bernhardt), COSIMIR (Keibel, Freund) y el segundo artículo de Silesia;
- reclasifica swider2007system como "modelo que gobierna el robot en lazo abierto";
- trata con rigor la pista no citable del manual de COSIMIR.

A3 queda reducida a tres medidas: coherencia del emulador frente a la controladora real, separación entre coherencia y fidelidad física, y observabilidad. De los menores de la v3, 8 están resueltos, 1 en parte y 1 trasladado.

Queda un problema de fondo, más pequeño que el de la v3. La nueva afirmación central de A3, "no se ha encontrado una **medida publicada** de la coherencia entre una controladora emulada y la real", no resiste en su forma absoluta. Además, la etiqueta "emulador **abierto**" no se ha contrastado con un sistema abierto para el RV-M1 que la propia ficha swider2007offline cita (mayor 1).

## Puntuaciones

| Criterio | Nota (v3 → v4) | Justificación |
|---|---|---|
| Novedad | 3 → 3,5 | A1 y A2 siguen bien. A3 ya no reivindica nada con antecedentes claros: la emulación, la intercambiabilidad y los niveles están reconocidos (`huecos.md` §3.2, `estado_del_arte.md` §8). Pero la formulación nueva de A3-1 ("no se ha encontrado una medida publicada") choca con cifras publicadas por fabricantes y prensa técnica sobre la exactitud de los tiempos de ciclo de controladoras emuladas con RRS, y "abierto" choca con JRobot (mayor 1). Además, tal como está escrita, A3-1 puede leerse como la validación del propio artefacto, que es práctica normal y no aportación (mayor 1, c). |
| Cobertura del estado del arte | 4 → 4 | La línea de controladoras virtuales está bien integrada (§5, matriz, H4, §6) y los riesgos altos están bien ordenados. Faltan los trabajos que **sí miden** la coherencia de un simulador con controladora emulada, aunque no sean revisados por pares, y dos sistemas conocidos del RV-M1 sin fichar (JRobot y Denford Virtual Robot). |
| Rigor metodológico | 4 → 4,5 | E2a separa ajuste y evaluación (≥ 10 programas × 3), congela y versiona la configuración y obliga a repetir si se cambia. E2c fecha con el `ts` de la placa, excluye las poses retenidas y declara la red como estimación. Las amenazas están actualizadas. Quedan detalles (N4-4 y N4-5). |
| Trazabilidad | 4 → 4 | A Kritzinger solo se le atribuye su resumen, y el criterio se cita con Barbie: correcto. Las citas literales nuevas proceden de "extracción resumida" (N4-6). "Ninguno lee el estado del robot" pasa a la introducción apoyado en una inferencia que la ficha de Mihali sigue marcando [POR VERIFICAR] (N4-2). "Sin cifras" no es exacto para Keibel, que da "pocos por ciento" (N4-3). |
| Reproducibilidad | 4 → 4 | Están especificadas, y asignadas a `ingeniero`, la congelación del emulador y la exposición de la bandera retain en el JSONL. La placa sigue sin elegir. |
| Claridad | 4 → 4 | Buena tabla v3 → v4 en `huecos.md`. Hay una incoherencia al equiparar "lazo abierto" con el nivel de modelo (N4-1). |
| Adecuación a la revista | 4 → 4 | 33 referencias, con los recortes previstos. La versión para la introducción, de unas 750 palabras, es razonable. |

## Problemas mayores

1. **La nueva base de A3-1, "no se ha encontrado una medida publicada de la coherencia entre una controladora emulada y la real", es demasiado fuerte; y "emulador abierto" no está contrastado.**
   - *Dónde.*
     - `huecos.md`: H4 ("Lo que no se ha encontrado es la medida publicada…"), §3.2 A3-1 ("Ni RRS ni COSIMIR ni Świder publican esta medida en lo leído"), §6 (filas de COSIMIR y RRS) y riesgo de percepción;
     - `estado_del_arte.md`: §5, último párrafo de "Emulación de dispositivos y de controladoras"; §7, carencia (c); §8, aportación 1 y párrafo final ("en que publica la coherencia medida frente a la controladora real");
     - la versión para la introducción ("En lo leído, estas fuentes afirman o persiguen la exactitud del emulador, pero no publican una medida de su coherencia con la controladora real");
     - `matriz.md`, lectura rápida ("Ninguno publica una medida de la coherencia…").
   - *Problema.*
     - **(a) Hay medidas publicadas, aunque no en el ámbito revisado.** En una búsqueda breve he encontrado:
       - Una nota de *Industrial Robot* (Emerald, 2006). Está clasificada como "non article", es decir, es prensa técnica del fabricante. Según ella, CimStation Robotics con RRS quedó "within 1.2 percent of the actual values" de los tiempos de ciclo de un robot real, en pruebas controladas en la planta de ABB en Västerås. Afirma además una exactitud de al menos el 3 %, frente al 5 % habitual en el sector ([Emerald](https://www.emerald.com/insight/content/doi/10.1108/ir.2006.04933aab.001/full/html)).
       - ABB declara hoy, para su VirtualController, "~99% correlation between simulated and real robot behavior" ([ABB, 2025](https://www.abb.com/global/en/news/134178)).
       - Płaczek y Piszczek (2018, *Eksploatacja i Niezawodność* 20(3), 455–464, revisado por pares). Comparan la trayectoria simulada con el módulo RCS (RRS) de Robcad con la de un KUKA KR 16-2 real medida con láser tracker, junto con ensayos de exactitud y repetibilidad según ISO 9283. La comparación con la simulación solo aparece en figuras, sin cifras en el texto ([PDF](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-5f5a6221-9efe-470b-a2fa-513a29f80dbb/c/Placzek.pdf)). Es también lo más próximo que he visto a la separación de A3-2: simulación con controladora emulada frente a una medida física externa.
       - Rot (2023, trabajo de fin de grado, Liubliana). Compara los tiempos de ciclo de Visual Components con los de un Motoman HP20 real y concluye que el real siempre tarda más ([repositorio](https://repozitorij.uni-lj.si/IzpisGradiva.php?id=148563)).
       - El propio Keibel da "pocos por ciento" (ficha, cap. 9).

       Son medidas parciales: tiempos de ciclo, sin protocolo publicado y en buena parte de fabricantes. Pero existen y son públicas, así que "no se ha encontrado una medida publicada" es falso tal como está escrito. Un revisor de RIAI del ámbito de la simulación industrial conoce las cifras de exactitud de tiempo de ciclo de RRS y de RobotStudio.
     - **(b) "Emulador abierto de una controladora retirada" no se ha contrastado con JRobot.**
       - La ficha swider2007offline cita JRobot, y `revision-v3.md` lo deja como "no buscado". En SourceForge figura como una utilidad Java para controlar el RV-M1 en local o en remoto, con una vista 3D "intended for simulation", licencias BSD y GPLv2, registrada en 2002 y actualizada en 2012 ([SourceForge](https://sourceforge.net/projects/jrobot/)).
       - No he comprobado si emula la D/U-M1 o solo dibuja. Mientras no se mire el código, "abierto" no puede usarse como diferenciador en el RV-M1.
       - Lo mismo vale, en menor grado, para el **Denford Virtual Robot**, un simulador comercial del RV-M1 sin fichar. Según swider2007offline, ROBO se "inspira" en él; Crespo usa software de Denford; y hay usuarios que programan con él el RV-M1 por RS-232 ([foro de Denford](https://www.denfordata.com/bb/viewtopic.php?p=11748)).
     - **(c) Riesgo de lectura: "medimos nuestro emulador" equivale a validar el artefacto.** Al quitar la emulación de las aportaciones, A3-1 dice en esencia "construimos un emulador y medimos su error frente al real". Para un revisor, validar un simulador contra el sistema real es práctica normal, y la propia línea RRS lo hace; no es una aportación. La medida aporta conocimiento solo si se explica **qué enseña más allá del propio artefacto**. Por ejemplo:
       - cuánto del comportamiento de una controladora cerrada y sin software reutilizable se puede reconstruir **solo desde su manual**, frente a la vía de RRS de reutilizar el software original, que Bernhardt y Willnow consideran "el único enfoque con éxito";
       - qué parte del error se debe a la cinemática (los parámetros), cuál a los tiempos y cuál a la semántica no documentada (los supuestos S1–S6).

       Esa descomposición convierte la medida en un resultado transferible a otras controladoras heredadas. Ahora no aparece ni en A3-1 ni en las métricas de E2a.
   - *Cambio propuesto.*
     1. Reformular H4, A3-1, §5, §7 (c), §8, la lectura rápida y la introducción, más o menos así: "Las medidas publicadas de la exactitud de controladoras emuladas son sobre todo de tiempos de ciclo, comunicadas por fabricantes o sin protocolo (p. ej., un 1,2 % en una prueba de RRS en ABB), y se refieren a emuladores que **reutilizan el software original**. No se ha encontrado, en la búsqueda realizada, una medida con protocolo declarado (conjuntos de ajuste y de evaluación separados; pose y tiempos en unidades físicas) de un emulador **reconstruido desde el manual** de una controladora sin software reutilizable". Esta formulación mantiene la aportación y es defendible.
     2. Fichar como mínimo Płaczek y Piszczek (2018), que es revisado por pares y es un riesgo para A3-1 y A3-2, y, como contraste no revisado, la nota de *Industrial Robot* (2006). Debe hacerlo `investigador`; aquí solo doy la pista.
        - Si se usa la cifra del 1,2 %, citarla como afirmación de un fabricante en prensa técnica, no como resultado científico.
        - Añadir ambos a `huecos.md` §6.
     3. Mirar el código de JRobot y, si es posible, la documentación del Denford Virtual Robot.
        - Si alguno interpreta órdenes Movemaster con errores o tiempos, retirar "abierto" como diferenciador y quedarse con "medido".
        - Si solo dibujan, decirlo en la ficha y en §6.
     4. Añadir a E2a (`huecos.md` §5) una **descomposición del error** en tres partes:
        - cinemática: frente a `WH` en reposo, con la misma orden `MP`;
        - tiempos: con el instante del `hecho`;
        - conducta: casos en que el emulador acepta o rechaza distinto que la D/U-M1, o da otro código de error.

        Formular A3-1 como "qué fidelidad alcanza un emulador escrito solo desde el manual y dónde falla". Así la medida deja de ser solo la validación del artefacto.
     5. Opcional, para el artículo: una frase en la discusión que compare la cifra obtenida con el orden de magnitud que la industria declara para la vía de RRS, sin presentarla como competidora.

## Problemas menores

**Nuevos en la v4**

- **N4-1. "Lazo abierto = modelo digital" no encaja con el criterio de Barbie.**
  - *Dónde:* leyenda de `matriz.md` y `estado_del_arte.md` §5 ("Modelo en paralelo o que gobierna el robot, en lazo abierto").
  - *Problema:* en Świder hay **flujo automático modelo → robot**, porque cada cambio del brazo virtual mueve el real. Con el criterio citado (ninguno / solo del físico al digital / ambos), eso no es un modelo, que no tiene flujo automático en ningún sentido. La taxonomía no contempla un flujo que vaya solo de lo digital a lo físico.
  - *Cambio:* en la leyenda, quitar "modelo que gobierna el robot" de la equivalencia con el nivel de modelo y anotarlo como "fuera de los tres niveles (flujo automático solo digital → físico)". Mihali, que funciona en paralelo con las mismas órdenes, puede seguir como modelo.
- **N4-2. "Ninguno lee el estado del robot" (introducción) descansa en una inferencia sin verificar.**
  - *Dónde:* versión para la introducción, primer párrafo.
  - *Problema:*
    - La ficha de Mihali mantiene [POR VERIFICAR releyendo el PDF].
    - En Świder, la nota de swider2007system recoge "la descarga de programas o posiciones desde la controladora en el panel del traductor CAD". Es decir, sí se leen posiciones de la controladora, aunque no durante la ejecución.
  - *Cambio:* releer el PDF de Mihali, que es de acceso abierto, y escribir "ninguno muestra el estado del robot **durante la ejecución**", o condicionar la frase.
- **N4-3. Keibel no es "sin cifras".**
  - *Dónde:* `huecos.md` H5 (en la evidencia: "keibel2002konzeption y bernhardt2002cost (exactitud afirmada sin cifras)").
  - *Problema:* la ficha y la matriz recogen "pocos por ciento" (cap. 9), un orden de magnitud sin protocolo.
  - *Cambio:* escribir "afirmada sin protocolo ni datos ('pocos por ciento')", como en la matriz.
- **N4-4. E2a: cobertura de los conjuntos de ajuste y de evaluación.**
  - *Dónde:* §3.3 ("tiempos de E1 y programas de ajuste") y E1.
  - *Problema:* E1 mide el tiempo de `mover_pose` con programas de ajuste, y E2a exige otras poses y velocidades. Está bien, pero no se fija ningún criterio de cobertura. Si el ajuste solo cubre unas pocas velocidades `SP`, E2a medirá sobre todo la extrapolación del modelo lineal de `SP`.
  - *Cambio:* que el protocolo de `analista-experimentos` fije la cobertura de ambos conjuntos (rangos de distancia y de `SP`) e informe el error de E2a por separado para la interpolación y para la extrapolación.
- **N4-5. E2c: margen de exclusión.**
  - *Problema:* "periodo de sondeo más un margen declarado" deja abierto el umbral, que podría elegirse después de ver los datos.
  - *Cambio:* fijar el margen en el protocolo **antes** de E2c (p. ej., 2 × periodo) e informar también la estadística sin exclusiones, para que la exclusión no sesgue la antigüedad a la baja.
- **N4-6. Citas literales procedentes de "extracción resumida".**
  - *Dónde:* fichas keibel2002konzeption (cita en alemán, cap. 6, p. 93) y bernhardt2002cost ("The only successful approach…", §3.1).
  - *Problema:* la cabecera "Leído" de las dos dice "mediante extracción resumida", y el registro reconoce que las citas son lo que la herramienta "devolvió entre comillas". Eso no equivale a haberlas comprobado literalmente.
  - *Cambio:* marcarlas [POR VERIFICAR literal] hasta que el verificador las compruebe. La de Bernhardt importa especialmente: es la que sostiene en §5 y en la ficha que reutilizar el software es "el único enfoque con éxito".
- **N4-7. freund1994towards y bernhardt1995realistic: solo resumen.**
  - Está bien que queden en reserva (`huecos.md` §8).
  - No deben pasar al artículo como apoyo de nada que no esté en su resumen. En concreto, que Freund sea el "origen de COSIMIR" lo dice Keibel, no Freund, y así debe atribuirse. Ahora es correcto en §5; mantenerlo.
- **N4-8. Ficha iso2023sparkplug: el cuerpo contradice la cabecera.**
  - *Problema:* la cabecera ya está corregida (N3-9). Pero "Qué se usa de la norma" sigue empezando por "Según la documentación de Eclipse Kura (fuente secundaria)…", y `seq` sigue [POR VERIFICAR].
  - *Cambio:* es el mismo patrón que N3-4. Actualizar el cuerpo con lo leído en la especificación de Eclipse (§2.4, §4.2.1).

**Heredados**

- **Menor 15 de la v1 (placa).** Sigue abierto y bloquea E1.0.
- **N12 (ACK ante un duplicado), N3-7 (contrato frente a gemelo) y la entrada del manual del RV-M1 en `refs.bib`.** Trasladados a `ingeniero`; siguen abiertos.
- **crespo2015virtual (Denford, tamaño de muestra).** Pendiente del verificador, según la respuesta.
- **Desajustes de la introducción del artículo** (revisión v3, puntos 1–9).
  - Siguen todos, porque `paper/` no se ha tocado, como estaba previsto.
  - La versión para la introducción de la v4 resuelve la mayoría: aportación (i) con niveles, PI, frase de Kritzinger, condición de E1.0, Crespo y COSIMIR/RRS.
  - Cuando `redactor` alinee la introducción, debe incorporar también el cambio del mayor 1 de este informe.

## Seguimiento de la v3

| Problema v3 | Estado | Comentario |
|---|---|---|
| M1 Novedad de A3 (b): emulación de la semántica con antecedentes (COSIMIR, RRS, Świder) | **Resuelto** | La emulación se retira como novedad en H4, A3, §5, §7, §8, la matriz y la introducción. Están fichados RRS (bernhardt1995realistic, bernhardt2002cost), COSIMIR (keibel2002konzeption, freund1994towards) y swider2007offline, y se ha releído swider2007system. COSIMIR, RRS y Świder entran en §6 como riesgo alto, por encima de Barbie. La pista del manual de COSIMIR se trata como no citable y el artículo no afirma nada del RV-M1 en COSIMIR: es la decisión correcta. Los modos de Kritzinger pasan a métodos. La formulación que sustituye a la anterior tiene su propio problema (**nuevo mayor 1**), mucho más acotado. |
| N3-1 Circularidad ajuste/E2a | Resuelto | Conjuntos separados, ≥ 10 programas de evaluación, configuración congelada y versionada, repetición si se cambia y error de ajuste solo como referencia. Añadido a las amenazas internas. Mejora posible en N4-4. |
| N3-2 Kritzinger desde fuentes secundarias | Resuelto | A Kritzinger solo se le atribuye su resumen. El criterio se cita con Barbie. Wikipedia queda como contraste y se retira la cita literal. |
| N3-3 Nivel de las visualizaciones sincronizadas | Resuelto | No se asigna nivel fila a fila, y el criterio es el mismo en la matriz y en §5. Queda la equivalencia de "lazo abierto" (N4-1). |
| N3-4 Mihali | Resuelto en la ficha | Cuerpo y "Qué aprovechamos" corregidos. La tabla de `paper/` queda para `redactor`. Sigue el [POR VERIFICAR] sobre la lectura del estado (N4-2). |
| N3-5 Pose retenida | Resuelto | Fechado con el `ts` de la placa, exclusiones contadas y red declarada como estimación. Falta fijar el margen antes del ensayo (N4-5). |
| N3-6 "Nunca publica en el real" | Resuelto | Texto nuevo, coherente en §3.1, §8, la ficha y la matriz. |
| N3-7 Contrato frente a gemelo | Trasladado | Anotado en `huecos.md` §5 para `ingeniero`, con la condición de cerrarlo antes de congelar el emulador. Abierto. |
| N3-8 Alcance de la separación coherencia/fidelidad | Resuelto | Acotado a "gemelos de manipuladores revisados", con la aclaración sobre la calibración e ISO 9283. Conviene añadir Płaczek y Piszczek (2018) como riesgo (mayor 1, a). |
| N3-9 Cabecera de Sparkplug | Parcialmente resuelto | La cabecera está bien; el cuerpo sigue apoyándose en Kura (N4-8). |
| N3-10 "Estado continuo" | Resuelto | "Continuo o sondeado a alta frecuencia" en la introducción, §5 y §7. |
| Menor 15 de la v1 (placa) | **No resuelto** | Depende de Álvar; bloquea E1.0. |
| N12, N13 | Trasladados | Siguen abiertos en `ingeniero` y `verificador-referencias`. |
| Manual del RV-M1 en refs.bib | No resuelto | Asignado a `ingeniero`. |

## Comprobaciones hechas (búsquedas, cifras contrastadas)

**Coherencia interna:**
- Lo que §5, H4, §6 y la matriz atribuyen a las 6 fichas nuevas coincide con ellas:
  - RCS en 1994 y VRC en 2001, con órdenes, eventos, E/S, ficheros y tiempo de simulación;
  - "único enfoque con éxito";
  - controladora de COSIMIR intercambiable por la real (cap. 5.1);
  - "pocos por ciento" sin medida;
  - Świder, con envío "en tiempo real" modelo → robot y modo mixto;
  - COSIMIR/RV-M1/MRL solo en la pista no citable.

  La única excepción es "sin cifras" para Keibel en H5 (N4-3).
- La clasificación nueva de swider2007system es coherente entre la ficha (cuerpo y nota), la matriz, §3 y §5.
- Recuento: la matriz tiene 54 filas de trabajos además de "Este trabajo", es decir, 53 citables más la de pista. Coincide con las cabeceras.
- Presupuesto de referencias: 29 + 4 = 33, con las entradas y salidas de claves descritas. Coincide entre `huecos.md` §8 y la nota de la versión para la introducción.
- E4: 5 × 30 más unos 25 casos deterministas. Coincide con §5.

**Búsqueda pedida: medida publicada de la coherencia entre una controladora emulada y la real (2026-11-25).**
- "RobotStudio virtual controller cycle time accuracy compared with real robot":
  - ABB declara "~99% correlation" del VirtualController con el robot real ([ABB](https://www.abb.com/global/en/news/134178)). Es una afirmación de fabricante, sin protocolo.
  - Los foros de RobotStudio discuten diferencias de tiempo de ciclo ([foro](https://forums.robotstudio.com/discussion/2504/360-cycle-time-may-be-wrong)), pero no son fuente.
- "realistic robot simulation RRS cycle time deviation": la nota de *Industrial Robot* (2006, "non article"). CSR con RRS quedó a un 1,2 % de los tiempos de ciclo reales en ABB Västerås. La empresa afirma al menos un 3 %, frente al 5 % habitual en el sector ([Emerald](https://www.emerald.com/insight/content/doi/10.1108/ir.2006.04933aab.001/full/html)). **Afecta al mayor 1 (a).**
- "comparison simulated and real cycle time offline programming": **afectan al mayor 1 (a) y a A3-2.**
  - Płaczek y Piszczek (2018): Robcad/RCS frente a un KUKA real medido con láser tracker, con la comparación solo en figuras ([PDF](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-5f5a6221-9efe-470b-a2fa-513a29f80dbb/c/Placzek.pdf));
  - Rot (2023): tiempos de Visual Components frente a un Motoman real ([repositorio](https://repozitorij.uni-lj.si/IzpisGradiva.php?id=148563)).
- "virtual robot controller … virtual commissioning": Malik (Winter Simulation Conference 2025) enlaza URSim, como controladora virtual, con Process Simulate y **no cuantifica** la discrepancia ([PDF](https://www.informs-sim.org/wsc25papers/inv181.pdf)). Apoya que en la literatura académica reciente se afirma sin medir. Podría ficharse como contraste.
- "digital twin prototype … discrepancy": en los resultados (arXiv 2401.07985 y 2408.13866, Symmetry 2024) no aparece nada nuevo respecto a barbie2024digital. No los he abierto.
- "Denford Virtual Robot RV-M1" y JRobot: [foro de Denford](https://www.denfordata.com/bb/viewtopic.php?p=11748) y [SourceForge](https://sourceforge.net/projects/jrobot/). **Afectan al mayor 1 (b).**
- No he podido abrir publica.fraunhofer.de (bloqueo Anubis), donde podría haber informes de RRS con cifras.

**Resultado sobre la novedad.**
- A1 y A2 se sostienen como en la v3.
- A3 se sostiene si se acota así: una medida con protocolo declarado de un emulador **reconstruido desde el manual** de una controladora sin software reutilizable, con descomposición del error y separada de la fidelidad física, más la observabilidad bajo petición.
- No se sostiene como "no existe ninguna medida publicada de la coherencia emulador–controladora". Tampoco, mientras no se mire JRobot, como "el primer emulador abierto del RV-M1".

**No revisado.**
- Las 5 referencias nuevas y sus entradas en `refs.bib` (las revisa otro agente).
- Los textos originales de Keibel, de Bernhardt y Willnow y de Świder et al. (2007, *JAMME* 20): la trazabilidad se ha comprobado contra las fichas.
- El código de JRobot.

## Recomendación: revisión mayor (acotada) — motivo

La v4 resuelve el mayor de la v3 de forma completa y honesta:
- la emulación, la intercambiabilidad y los niveles ya no se reivindican;
- los antecedentes de RRS, COSIMIR y Silesia están fichados y ordenados como riesgo alto;
- la pista no citable se trata correctamente.

De los 10 menores nuevos de la v3, 8 están resueltos, N3-9 lo está en parte y N3-7 está trasladado a `ingeniero`. El rigor de E2a y E2c ha mejorado claramente.

Queda **un problema mayor**, en la frase que sostiene ahora A3-1:
- hay medidas publicadas de la exactitud de controladoras emuladas, sobre todo de fabricantes y de tiempos de ciclo: un 1,2 % en una prueba de RRS en ABB y una correlación de ~99 % declarada por ABB para su VirtualController;
- hay una comparación revisada por pares entre una trayectoria simulada con RCS y la del robot real medido;
- "abierto" no se ha contrastado con JRobot.

La corrección es de redacción y de dos o tres fichas, sin rehacer nada:
- acotar A3-1 a "medida con protocolo declarado de un emulador reconstruido desde el manual de una controladora sin software reutilizable";
- añadir a E2a la descomposición del error, para que la medida enseñe algo más que la calidad del propio artefacto;
- fichar Płaczek y Piszczek (2018) y la nota de 2006;
- comprobar JRobot.

Hecho esto, la v5 debería poder aceptarse con, como mucho, menores. La alineación de `paper/secciones/01_introduction.tex` debe esperar a este cambio y a la verificación de las claves nuevas.
