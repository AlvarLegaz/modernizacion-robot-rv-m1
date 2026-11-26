# Respuesta a la revisión del estado del arte v2

- **Fecha:** 2026-11-25
- **Responde:** agente `investigador`, que no revisa su propio trabajo; la v3 debe revisarla `revisor`.
- **Documentos revisados:** `Investigacion/Estado_del_Arte/estado_del_arte.md`, `Investigacion/Estado_del_Arte/huecos.md` e `Investigacion/Estado_del_Arte/matriz.md`, todos en versión 3.
- **Otros cambios:**
  - 4 fichas nuevas: `barbie2024digital`, `chitta2017roscontrol`, `crespo2015virtual` y `kritzinger2018digital`, con entrada en `Investigacion/Referencias/refs.bib` (`note = {verificacion: pendiente}`);
  - notas añadidas a las fichas `oasis2019mqtt` (N1), `iso2023sparkplug` (N10) y `mihali2005effective` (N8);
  - registro de búsquedas `Investigacion/Estado_del_Arte/busquedas/revision-v2.md`.
- **No se han tocado:** `Investigacion/Paper/`, `Codigo/Gemelo/` ni `Docu/contrato_mqtt.md`. El contrato v0.4 ya define los modos del gemelo y los topics del real que lee; aquí solo se usan.

## Resumen de cambios

| Ámbito | Cambio |
|---|---|
| A3 | Se apoya en: (a) tres modos definidos con kritzinger2018digital (`emulador` = modelo, `sombra` = sombra digital con el error medido, `sincronizado` = sombra de visualización), declarando que ninguno es un gemelo estricto; (b) emulación de la **semántica** de un intérprete serie que solo informa bajo petición (`WH`/`ER`), con contrato idéntico, como aplicación del DTP de barbie2024digital; (c) separación medida coherencia / fidelidad física. Se retiran "bus pub/sub multicliente", "destino en el mensaje" (pasa a A2) y "emula la controladora" como idea propia. |
| E1.0 | Comprueba también `WH` durante el movimiento: si responde, periodo útil T_WH y si el sondeo altera el movimiento. Tabla de casos A/B/C con su efecto en A3 (`huecos.md` §3.2). |
| E2 | E2a (coherencia del emulador con el modo `sombra`, sin otros clientes), E2b (con registro de la referencia e incertidumbre) y E2c (antigüedad de la sombra). |
| E4 | Cota 3/N solo en los 5 tipos dependientes del tiempo, con casos frontera; deterministas con pruebas automáticas y pocos ensayos. *Keep alive* fijado. |
| Referencias | 4 nuevas; introducción con 29 claves y 33 en total en el artículo (`huecos.md` §8). |

## Problemas mayores

### Mayor 1 — Definición contradictoria del gemelo
- **Referencia de definición.** Se ha fichado Kritzinger et al. (2018, IFAC-PapersOnLine 51(11):1016–1022, doi:10.1016/j.ifacol.2018.08.474). **Limitación:** solo se han podido leer los metadatos y el resumen (Fraunhofer, ScienceDirect y doi.org no son accesibles desde este entorno). Las definiciones operativas por flujo de datos (modelo: ninguno automático; sombra: automático del físico al digital; gemelo: automático en los dos sentidos) se toman de su uso en barbie2024digital (§2, texto completo leído), y coinciden con fuentes terciarias. Están marcadas [POR VERIFICAR en el texto completo] en la ficha, en `huecos.md` y en `estado_del_arte.md`. Se pide a `verificador-referencias` que lo confirme antes de citarlas.
- **Modos** (`huecos.md` §3.1), sobre el contrato v0.4 y `Codigo/Gemelo/README.md`:
  - `emulador` = modelo digital (sin flujo con el real);
  - `sombra` = emulador + sombra digital del real, con el error gemelo–real calculado;
  - `sincronizado` = sombra digital de visualización.
- **Se declara que ningún modo es un gemelo en sentido estricto.** El gemelo nunca publica en `rvm1/real/...`, y las órdenes al real las publica un usuario autorizado, no el modelo. Por eso desaparece "sincronizado por eventos" de A3, de H5, de la matriz y de la introducción.
- **E2a.** Mide ahora, explícitamente, la coherencia del **emulador** (lazo abierto), usando el modo `sombra` como instrumento. Lo que el revisor señalaba como defecto pasa a ser lo que se declara medir.
- **Ensayo de la sombra (nuevo E2c).** Mide la antigüedad de la pose mostrada en modo `sincronizado`, descompuesta con un reloj por equipo, y, si el manual lo permite con el RS-232 conectado, un movimiento lanzado desde el teach box físico, fuera del bus.
- **Especificación del emulador** (`huecos.md` §3.3, para `ingeniero`):
  - cinemática y sus parámetros provisionales;
  - modelo de tiempos provisional, a ajustar con E1;
  - errores emulados;
  - salvaguardas replicadas;
  - supuestos S1–S6 sin verificar.

  Se añade la amenaza a la validez de que unos parámetros provisionales contaminen E2a.

### Mayor 2 — Novedad de A3/H4 sobrevalorada
- **"Bus pub/sub multicliente":** retirado como diferenciador en §5, §7, §8, H4, la matriz (lectura rápida: "No es un diferenciador") y la introducción. Se ha fichado ros_control (`chitta2017roscontrol`, JOSS 2(20):456, PDF leído). Se reconocen ROS, kaarlela2023digital y bravoarrabal2025iort como antecedentes de intercambiabilidad sobre pub/sub.
- **"Gemelo que emula la controladora":** se ha fichado Barbie, Hasselbring y Hansen (2024, *Symmetry* 16(2):221), con el texto completo leído en el repositorio de Southampton. Confirma el DTP con dispositivos emulados que el software no distingue, incluido RS-232 mediante Socat, y con código abierto. Además, no mide la discrepancia con el sistema físico.
  - A3 (b) se presenta como **aplicación** de ese concepto.
  - Lo que se reivindica es emular la **semántica** de un intérprete industrial de los 80: `hecho` derivado de `ER`, modos I/II, `NT` y tiempos según `SP`. No basta con emular el transporte.
- **"Solo informa bajo petición":** se acepta que la diferencia real con chang2025construction (sondeo a 125 Hz) depende de si `WH` responde durante el movimiento.
  - E1.0 lo comprueba: si responde, con qué periodo útil T_WH, y si el sondeo altera el movimiento o el instante de la respuesta a `ER`.
  - `huecos.md` §3.2 recoge qué cambia en A3 en cada caso:
    - caso A (sombra por eventos, trayectoria intermedia no observable): se declara como limitación;
    - caso B (sombra cuasi continua a baja frecuencia): se retira "sin trayectoria intermedia observable", A3 (b) pasa a caracterizar T_WH y hay que cambiar el contrato para publicar `posicion/mundo` durante el movimiento;
    - caso C: hay que redefinir `hecho`.
- **"Destino comprobado en el mensaje":** sale de A3 y queda como salvaguarda de A2. La demostración multicliente pasa a un bloque aparte de E4.
- **RV-M1 en VR (2015):** fichado `crespo2015virtual` (Crespo, García y Quiroz, Procedia Computer Science 75:107–112, doi:10.1016/j.procs.2015.12.226). Texto leído en ResearchGate, porque ScienceDirect no abre.
  - Los programas pasan al robot por fichero (software de Denford), sin enlace en vivo.
  - La evaluación es anecdótica.
  - Está en la matriz, en §3, §5, §6 y §8, en H1, H4 y los riesgos, y en la introducción.
  - La versión ICBL 2015 (doi:10.1109/ICBL.2015.7387635) se menciona en la ficha. No entra en refs.bib.
- **Formulación final de A3** (`huecos.md` §3.2), en la línea que propone el revisor: modos definidos; emulación de la semántica de la D/U-M1 tras un contrato idéntico, con la observabilidad medida en E1.0; y separación medida entre coherencia y fidelidad física.

### Mayor 3 — Cita MQTT frente a OPC UA que contradice su fuente
- **Introducción:** se ha sustituido por la redacción propuesta: "En un banco de pruebas en LAN, sus diferencias con OPC UA cliente/servidor fueron inferiores al milisegundo [@profanter2019opcua]; en una celda con un UR5e, MQTT fue varios milisegundos más rápido que OPC UA PubSub [@ariascachero2023operational]".
- **§7.1:** se separa "MQTT se usa entre gemelo y manipulador" (luu, kaarlela, liang) de la comparación de latencia (profanter, ariascachero).
- **§4:** se retira "el transporte apenas cuenta". Ahora dice que las diferencias dependen de la configuración: el modo de OPC UA, el tamaño del mensaje y la carga. Se dan las cifras de ariascachero (2,5 frente a 10,1 ms; 10,9 frente a 16,6 ms; unos 30 ms en operación), con QoS 0 y PubSub a 10 ms.

## Problemas menores

| # | Respuesta | Dónde |
|---|---|---|
| N1 `ts` frente a *Message Expiry* | Se sustituye la justificación por las tres razones del revisor: (1) el intervalo es un entero en segundos y no puede expresar 500 ms; (2) solo descuenta la espera en el broker y no cubre el tramo publicador → broker; (3) exige MQTT 5 en la biblioteca de la placa, aún sin elegir. Se reconoce que la placa podría usar el intervalo reducido con su reloj monótono, pero eso no resuelve (1) ni (2). | `huecos.md` A2; `estado_del_arte.md` §5 y §8; ficha `oasis2019mqtt`; matriz (normas) |
| N2 Cota 3/N | Solo para los 5 tipos dependientes del tiempo, con instantes aleatorizados y casos frontera (490/510 ms, ±100 ms de adelanto, duplicado durante la ejecución, desfase cerca de 100 ms, LWT). Los tipos deterministas se cubren con pruebas automáticas (`node --test`) y unos 3 ensayos con el robot, sin cota. E4 pasa de ≥ 330 a unos 175 ensayos. | `huecos.md` E4 y PI3 |
| N3 Ventana efectiva | Se declara en PI1: de unos 400 a 600 ms con 100 ms de desfase. Se añade que el contrato solo controla el desfase del receptor: un cliente desfasado ensancha la ventana, así que se registra. | `huecos.md` PI1 |
| N4 E2b, referencia externa | Se exige una resolución claramente menor que los errores que se quieren resolver: un puntero sobre plantilla, de orden 1 mm, solo sirve para errores de varios mm. También el registro plantilla → base con al menos tres puntos y el residuo del ajuste como incertidumbre declarada; las poses de medida no son las de registro. | `huecos.md` E2b; amenazas (medida) |
| N5 `WH` no es un `cmd` | La latencia se mide con `velocidad`. `WH` solo aparece en E1.0, por la línea serie. | `huecos.md` E1 |
| N6 Multicliente en E2a | E2a se hace sin otros clientes; la demostración multicliente va en un bloque aparte de E4. | `huecos.md` E2a y E4 |
| N7 *Keep alive* | Se fija y se declara como factor; `offline` se compara con 1,5 × *keep alive* (MQTT 3.1.1). | `huecos.md` PI3, E1 y E4 |
| N8 mihali2005effective | Según su ficha, no lee el estado del robot: se reclasifica como "visualización en paralelo (lazo abierto)", marcado como inferencia [POR VERIFICAR releyendo el PDF], y se excluye de la afirmación sobre el estado continuo. | Ficha (nota); matriz; `estado_del_arte.md` §5; `huecos.md` H5 |
| N9 Presupuesto de referencias | 29 claves en la introducción y 4 solo en métodos: 33 en total. Fuera de la introducción: kolla, sanchezlondono, antonelli y hacesgarcia. MQTT 3.1.1 y 5.0 van en una sola mención. Si hay que recortar más: foit, liang y alvares. **Falta la entrada del manual del RV-M1 en refs.bib.** | `huecos.md` §8 |
| N10 Sparkplug | Leída como fuente primaria la especificación de Eclipse 3.0.0 (primer tercio del PDF): §2.4 (certificados de muerte como Will Message en el CONNECT) y §4.2.1 (`bdSeq` en NBIRTH/NDEATH; `seq` vuelve a 0 tras 255). No se ha comprobado que el texto coincida con el de ISO/IEC 20237. | Ficha `iso2023sparkplug`; `estado_del_arte.md` §5; matriz |
| N11 "No se ha encontrado" | Ahora dice "controladora industrial heredada". | Introducción; §7 (a); H1 |
| N12 Duplicados | Es para `ingeniero`: qué ACK se repite y si el emulador aplica la misma lógica. Queda en `huecos.md` §3.3 y en las observaciones abiertas. | `huecos.md` §3.3 y §5 |
| N13 kumar2011virtual | Es para `verificador-referencias`; no se ha cambiado. | — |
| Menor 15 de la v1 (placa) | Sigue abierto. Ahora condiciona también N1 (MQTT 5) y E1.0. | `huecos.md` §2 |

## Pendiente para otros agentes
1. `verificador-referencias`:
   - verificar las 4 entradas nuevas;
   - en particular, leer el texto completo de kritzinger2018digital y confirmar las definiciones;
   - comprobar que la ficha de mihali2005effective no omite una lectura del estado del robot (N8);
   - decidir cómo citar Sparkplug (ISO o Eclipse).
2. `ingeniero`:
   - qué ACK se repite ante un duplicado (N12);
   - parámetros y tiempos del emulador (§3.3);
   - en el caso B de E1.0, la versión 0.5 del contrato, con `posicion/mundo` durante el movimiento;
   - incluir el manual del RV-M1 en refs.bib si se va a citar.
3. Álvar o `ingeniero`: elegir la placa.
4. `analista-experimentos`: protocolos de E1.0 (con `WH`), E2a/E2b/E2c y E4 con el nuevo reparto.
5. `revisor`: revisión v3.
