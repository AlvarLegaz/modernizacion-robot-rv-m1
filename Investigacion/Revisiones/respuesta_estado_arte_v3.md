# Respuesta a la revisión del estado del arte v3

- **Fecha:** 2026-11-25
- **Responde:** agente `investigador`, que no revisa su propio trabajo; la v4 debe revisarla `revisor`.
- **Responde a:** `Investigacion/Revisiones/revision_estado_arte_v3.md` (1 mayor y 10 menores) y a la ronda 3 de `Investigacion/Revisiones/verificacion_referencias.md`.
- **Documentos actualizados (versión 4):** `Investigacion/Estado_del_Arte/estado_del_arte.md` (con la versión para la introducción), `Investigacion/Estado_del_Arte/huecos.md` e `Investigacion/Estado_del_Arte/matriz.md`.
- **Fichas nuevas** (5 citables, con entrada en `Investigacion/Referencias/refs.bib` y `note = {verificacion: pendiente}`):
  - `swider2007offline`
  - `freund1994towards`
  - `keibel2002konzeption`
  - `bernhardt1995realistic`
  - `bernhardt2002cost`

  Además, una **ficha de pista no citable**, `karras2003cosimir`, sin entrada en refs.bib.
- **Fichas corregidas:** `swider2007system` (relectura y nota), `kritzinger2018digital` (reescrita), `barbie2024digital`, `mihali2005effective` e `iso2023sparkplug`.
- **Registro de búsquedas:** `Investigacion/Estado_del_Arte/busquedas/revision-v3.md`.
- **No se han tocado** `Investigacion/Paper/`, `Codigo/Gemelo/` ni `Docu/contrato_mqtt.md`.

## Resumen de cambios

| Ámbito | v3 | v4 |
|---|---|---|
| A3 | (a) modos de Kritzinger; (b) emulación de la semántica de la D/U-M1; (c) separación coherencia / fidelidad física | Gemelo abierto en los niveles modelo y sombra, declarados, con **tres medidas**: (1) coherencia del emulador frente a la controladora real, sin circularidad; (2) separación coherencia / fidelidad física, acotada a los gemelos de manipuladores revisados; (3) observabilidad (E1.0, E2c). Los modos pasan a métodos. La emulación deja de ser novedad. |
| H4 | Emulación de la semántica de un intérprete serie heredado | Emulador abierto de una controladora heredada, tras el contrato del real, con su coherencia **medida** frente a esa controladora |
| E2a | Parámetros "fijados antes" | Conjuntos de ajuste y de evaluación separados; parámetros congelados y versionados (commit o etiqueta) antes de E2a; si se cambia el emulador, se repite con programas nuevos |
| E2c | Antigüedad con red "de E1" | Cada pose se fecha con el `ts` de la placa; las retenidas o antiguas se marcan y se excluyen (y se cuentan); el tramo de red se declara como estimación |
| Referencias del artículo | 33 | 33: entran bernhardt2002cost y keibel2002konzeption, salen foit2008web y liang2020bidirectional |

## Problema mayor 1 — Antecedentes de la emulación de la semántica de la controladora

**Se acepta por completo.** Respuesta por partes.

### 1. Búsqueda y fichas

**Świder et al., *JAMME* 20(1–2), 499–502 (2007) → `swider2007offline`.** Texto completo leído en el PDF indicado.
- ROBO puede enviar datos al robot "en tiempo real": cada cambio del brazo virtual produce el cambio correspondiente del real (p. 502).
- Hay modo mixto: una instancia conectada al real y otras con robots virtuales (p. 501).
- **No** describe qué órdenes interpreta (habla de "MELFA BASIC"), ni la emulación de errores o tiempos, ni la lectura del estado del robot. No hay medidas.

**Relectura de `swider2007system`.**
- El procesador de visualización reconoce solo órdenes seleccionadas.
- Cada cambio del brazo virtual desplaza el manipulador real (§4.1, p. 10).
- No describe la lectura de la posición durante la simulación.
- **Se corrige su clasificación** de "simulación no sincronizada" a "modelo que gobierna el robot real en lazo abierto": en la ficha (cuerpo y nota), en la matriz y en `estado_del_arte.md` §3 y §5.

**COSIMIR.**
- *Fuente oficial del manual.* No se ha encontrado una fuente oficial citable del manual. Se consultaron el portal de soporte de Festo, el InfoPortal de Festo Didactic, el folleto de software de simulación de Festo (2007) y el manual de la estación robot (2015); ninguno menciona el RV-M1 ni MRL.
- *La copia no oficial.* Identifica el documento: *COSIMIR Educational, User's Guide*, Festo Didactic, 2003, nº 526501, de U. Karras (IRF Dortmund). Confirma lo que cita el revisor (§2.3, §2.4 y §3.4).
- *Decisión.* Se registra como **ficha de pista no citable** (`karras2003cosimir`), sin entrada en refs.bib. Entra en `huecos.md` §6 como riesgo alto. El artículo **no afirma nada específico del RV-M1 en COSIMIR** sin fuente.
- *Fuentes citables de COSIMIR:*
  - `keibel2002konzeption`, tesis doctoral de la TU Dortmund leída en el repositorio Eldorado. La controladora virtual de COSIMIR se diseña para intercambiarse por la real sin cambiar el simulador (cap. 5.1). El autor dice que la calidad está en la diferencia con el sistema real (cap. 6), pero afirma la exactitud sin publicar la medida (cap. 9). No menciona el RV-M1 ni MRL.
  - `freund1994towards` (IROS 1994, DOI; solo resumen). Integra una controladora industrial en la simulación de celdas mediante mensajes. Keibel lo cita como referencia de COSIMIR.
- *Cómo lo describe patrao2025understanding.* Usa COSIMIR Industrial 4.1, de Festo, con un RV-2AJ por RS-232. Su bibliografía cita una "COSIMIR: Getting Started" del IRR (2000) en una URL que no ha salido en ninguna búsqueda. Se anota y no se usa.

**RRS/RRS-II.**
- `bernhardt1995realistic` (*Computing & Control Engineering Journal* 6(4), 174–176, DOI 10.1049/cce:19950404; solo resumen): RRS integra el software original de la controladora en los simuladores.
- `bernhardt2002cost` (IFAC 2002, Barcelona; texto completo en las actas en línea; DOI y páginas no localizados, no se añaden):
  - interfaz RCS (1994) e interfaz VRC (2001), esta con órdenes, respuestas y eventos asíncronos, E/S, sistema de ficheros y tiempo de simulación;
  - "el único enfoque con éxito" es usar el software original;
  - no da cifras de exactitud.
- No se ha encontrado un artículo de Bernhardt et al. que publique la medida de la exactitud.

### 2. Reformulación

**H4** (`huecos.md` §1). Ya no reivindica la emulación de la semántica. Reconoce cuatro grupos de antecedentes:
- intercambiabilidad;
- DTP;
- RRS/VRC y COSIMIR;
- el propio RV-M1 (Świder; COSIMIR según la pista no citable).

Lo que no se ha encontrado es la **medida publicada** de la coherencia entre una controladora emulada y la real, y un emulador **abierto** de una controladora retirada, sin software del fabricante que reutilizar. Siempre como "no se ha encontrado en lo leído".

**A3** (`huecos.md` §3.2; `estado_del_arte.md` §8; versión para la introducción, aportación (i)): sigue con un máximo de 3 aportaciones (A1, A2 y A3) y se queda solo con lo medible:
1. Coherencia **medida** del emulador frente a la controladora real (E2a), con programas de evaluación distintos de los de ajuste y parámetros congelados antes.
2. Separación medida coherencia / fidelidad física (E2a frente a E2b), acotada a los gemelos de manipuladores revisados (N3-8).
3. Observabilidad medida (E1.0 y E2c), con las poses retenidas antiguas marcadas o descartadas según el `ts` de la placa (N3-5).

**Lo que se baja de nivel:**
- La clasificación modelo/sombra/gemelo pasa a "marco de definición" (`huecos.md` §3.1), que va en métodos.
- La emulación pasa a ser el **medio** de la medida.
- Lo que se dice en "no se reivindica" queda explícito en `huecos.md` §3.2 y en `estado_del_arte.md` §8: intercambiabilidad, DTP, emulación de controladoras y, en el RV-M1, la interpretación del lenguaje y el enlace modelo → robot.

**Otros ajustes:**
- `estado_del_arte.md`: §5 (nuevo párrafo "Emulación de dispositivos y de controladoras"), §7 (tendencia 3 y carencia c) y §8 (diferenciación final);
- la matriz: 6 filas nuevas, la fila de swider2007system, la fila "Este trabajo" y la lectura rápida ("La emulación de la controladora no es un diferenciador");
- `huecos.md` §6: COSIMIR, RRS/VRC y Świder entran como **riesgo alto**, por encima de barbie2024digital;
- riesgo de percepción reescrito.

**Lo que no se ha podido confirmar.** No se ha comprobado si alguna publicación de la línea COSIMIR o RRS, fuera de lo leído, mide la coherencia con un robot real. Se declara en los riesgos de cobertura.

## Problemas menores

| # | Respuesta | Dónde |
|---|---|---|
| N3-1 Circularidad ajuste/E2a | Conjunto de ajuste (tiempos de E1 y programas de ajuste) separado de **≥ 10 programas de evaluación** con otras poses y velocidades. Configuración del emulador **congelada y versionada** (commit o etiqueta) antes de E2a, con su identificador publicado junto a los datos. El modo SOMBRA no se usa para corregir límites ni tiempos después de la etiqueta. Si se cambia, E2a se repite con programas nuevos. El error en el conjunto de ajuste se informa aparte, solo como referencia. Se añade a las amenazas internas. | `huecos.md` §3.3 (fila "Congelación"), E1, E2a, amenazas; PI2 a |
| N3-2 Kritzinger desde fuentes secundarias | Wikipedia queda solo como contraste, nunca como fuente. A `kritzinger2018digital` solo se le atribuye lo del resumen. El **criterio del flujo de datos se cita con `barbie2024digital`**, en la forma que propone el verificador. La cita literal del resumen, no comprobada, se retira de la ficha. | Ficha reescrita; `estado_del_arte.md` aviso, §5, §8 e introducción; `huecos.md` cabecera y §3.1; matriz (fila y leyenda) |
| N3-3 Nivel de las visualizaciones sincronizadas | Se elige **no asignar nivel** fila a fila (ni a las visualizaciones sincronizadas ni a las bidireccionales), porque las fichas no permiten saber si el flujo hacia el robot es automático. Mismo criterio en la leyenda de la matriz y en §5. | `matriz.md` leyenda; `estado_del_arte.md` §5 |
| N3-4 Mihali | Corregidas en el cuerpo de la ficha la línea "Gemelo digital" (ahora "visualización en paralelo, en lazo abierto") y "Qué aprovechamos". Nota añadida. La tabla de la introducción del artículo (`Investigacion/Paper/`) **no se toca**: queda para `redactor`. | Ficha `mihali2005effective` |
| N3-5 Pose retenida | E2c fecha cada muestra con el `ts` de la placa. La primera muestra tras suscribirse (bandera retain) y las de antigüedad mayor que el periodo de sondeo más un margen declarado se marcan y se excluyen; se informa su número. El tramo de red se toma de E1 y se declara como **estimación**. Se deja para `ingeniero` cómo exponer en el JSONL la bandera retain y el `ts`. | `huecos.md` E2c, §5 (observaciones), amenazas (interna y medida) |
| N3-6 "Nunca publica en el real" | Texto nuevo: "el **modelo** nunca publica estado ni órdenes en `rvm1/real/...`; las órdenes al real las da una persona autorizada (`profesor`), también desde el pendant integrado con destino REAL, y eso es una acción manual, no un flujo automático del modelo al robot". | `huecos.md` §3.1; ficha `kritzinger2018digital`; `estado_del_arte.md` §8; matriz ("Este trabajo") |
| N3-7 Contrato frente a gemelo | Anotado como observación abierta para `ingeniero`: el README cita el contrato v0.3; SOMBRA lee `online`, que v0.4 no lista; SINCRONIZADO publica `online = "offline"`, que es una propuesta. Debe cerrarse antes de congelar el emulador. | `huecos.md` §5 |
| N3-8 Alcance de la separación coherencia/fidelidad | Acotado siempre a "en los gemelos de manipuladores revisados", con la aclaración de que comparar con una medida externa es lo que hacen la calibración e ISO 9283; lo que se aporta es usarla para separar los dos errores de un gemelo. | `huecos.md` H5 y A3-2; `estado_del_arte.md` §5, §7 (c) y §8; matriz (lectura rápida) |
| N3-9 Cabecera de Sparkplug | "Leído" actualizado: ficha de catálogo de ISO más el primer tercio de la especificación de Eclipse 3.0.0 (§2.4, §4.2.1); el texto de ISO no se ha leído. | Ficha `iso2023sparkplug` |
| N3-10 "Estado continuo" | Ahora dice "estado, continuo o sondeado a alta frecuencia". | Versión para la introducción |

## Correcciones del verificador (ronda 3)

| Punto | Respuesta |
|---|---|
| 1. Criterio de flujo atribuido a Kritzinger en la introducción | Reescrito: "Kritzinger et al. distinguen modelo, sombra y gemelo digital por su grado de integración…; según la descripción de Barbie et al., el criterio es el flujo automático de datos…". |
| 2. "Tres modos definidos con la clasificación de Kritzinger" | §8 y la aportación (i) ya no lo presentan como aportación. Donde se usa la terminología, se cita también barbie2024digital. |
| 3. "Manual en sentido contrario" | Retirado de la ficha de Kritzinger, que dice ahora de forma expresa que Barbie et al. no hablan del flujo contrario en la sombra. |
| 4. Cita literal del resumen de Kritzinger | Retirada; solo paráfrasis. |
| 5. Preprint de Barbie | Corregido a arXiv:2311.05748. Se aclara que arXiv:2401.07985 es otro trabajo. También se corrige su "En qué nos diferenciamos", que reivindicaba la emulación de la semántica. |
| 6. crespo2015virtual (Denford, tamaño de muestra) | No se ha releído en esta ronda (ScienceDirect sigue sin abrir). Queda como está, respaldado solo por la lectura en ResearchGate. Pendiente para el verificador. |

## Pendiente para otros agentes

1. **`verificador-referencias`:**
   - verificar las 5 entradas nuevas: en swider2007offline, las páginas impresas; en keibel2002konzeption, el año de catálogo (2002 o 2003); en bernhardt2002cost, el DOI y las páginas en IFAC Proceedings Volumes, si aparecen;
   - confirmar que karras2003cosimir sigue sin entrada en refs.bib;
   - si se consigue el texto completo de Kritzinger, contrastar las definiciones.
2. **`ingeniero`:**
   - congelar y etiquetar la configuración del emulador antes de E2a (N3-1);
   - registrar en JSONL la bandera retain y el `ts` de la placa (N3-5);
   - cerrar N3-7 (contrato frente a gemelo);
   - resolver N12;
   - añadir la entrada del manual del RV-M1.
3. **`analista-experimentos`:** protocolos de E2a con los conjuntos de ajuste y de evaluación, y de E2c con el filtrado de las retenidas.
4. **`redactor`:** alinear `Investigacion/Paper/secciones/01_introduction.tex` con la nueva versión para la introducción **después** de la verificación. En concreto:
   - la aportación (i);
   - la tabla, con mihali "en paralelo, lazo abierto", sin "±1 mm" para chang, y con COSIMIR/RRS y Crespo;
   - las PI;
   - la frase de Kritzinger;
   - la condición sobre E1.0.

   La versión propuesta tiene unas 750 palabras y hay que recortarla al presupuesto.
5. **Álvar:**
   - elegir la placa (menor 15 de la v1, sigue abierto);
   - si tiene acceso al manual oficial de COSIMIR Educational (Festo, nº 526501), podría citarse como literatura gris.
6. **`revisor`:** revisión v4.
