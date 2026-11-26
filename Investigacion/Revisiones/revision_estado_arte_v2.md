# Revisión de estado del arte (estado_del_arte.md, huecos.md, matriz.md) — v2

Revisor: agente `revisor` (no ha participado en la elaboración). Fecha: 2026-11-25.
Enfoques: novedad, cobertura, rigor metodológico, trazabilidad y reproducibilidad.
Material leído: `CLAUDE.md`, la revisión v1, la respuesta del investigador, la versión 2 de los tres documentos, `Docu/contrato_mqtt.md` v0.2 y las fichas mihali2005effective, kaarlela2023digital, kumar2024scalable, ariascachero2023operational, holmes2025retrofitting, kutzer2023scorbot, chang2025construction y oasis2019mqtt.
Fuera de alcance: las 8 referencias nuevas de `refs.bib` las verifica otro agente en paralelo. **No se dan por verificadas** en este informe.

## Resumen del documento (3–4 líneas)

La v2 reorganiza el trabajo en tres aportaciones:
- A1: plataforma y caracterización medida de la cadena serie;
- A2: adaptación y verificación de salvaguardas MQTT/Sparkplug conocidas;
- A3: gemelo que emula la D/U-M1, se sincroniza por eventos y tiene la fidelidad medida. Es la aportación principal.

Hay cuatro PI, y los experimentos son E1.0, E1, E2a/E2b, E4 y E5 reducido, con E3 como demostración. La respuesta a la v1 es seria. Se han fichado Kutzer, Holmes y Kumar 2011, se han añadido las normas, se han quitado las condiciones sobre el gemelo y se han rediseñado E1, E2 y E3.

Queda un problema de fondo: la aportación principal (A3) está mal definida. El contrato no conecta el gemelo con el robot real, así que "sincronización por eventos" no tiene contenido operativo. Además, su novedad sigue sobrevalorada frente a prácticas conocidas: ROS/ros_control, los niveles de Kaarlela y los *digital twin prototypes*.

## Puntuaciones

| Criterio | Nota (v1 → v2) | Justificación |
|---|---|---|
| Novedad | 3 → 3 | A1 y A2 están ahora formuladas con honestidad (base habilitante; mecanismos conocidos adaptados). A3, que es la aportación que según `CLAUDE.md` da nivel al artículo, se apoya en diferenciadores débiles o no demostrados: "bus pub/sub multicliente", "destino en el mensaje" y "solo informa bajo petición" (mayor 2). |
| Cobertura del estado del arte | 3 → 4 | Holmes, Kutzer, Kumar 2011 y las normas están bien integrados, por ejemplo en §2, §5 "Interfaz común" y H1. Faltan tres cosas: (a) una referencia de definición de gemelo digital (modelo, sombra y gemelo), imprescindible si el gemelo es la aportación principal; (b) los *digital twin prototypes* (emulación de interfaces de dispositivos); (c) el simulador VR del RV-M1 de 2015, que ya está localizado. |
| Rigor metodológico | 2 → 3 | Mejora clara: E1.0, un solo reloj por equipo, separación entre latencia y tiempo de ejecución, E2a/E2b, N de E4 y amenazas a la validez. Pero E2a mide un gemelo que corre en paralelo y en lazo abierto, no sincronizado (mayor 1). E1.0 no comprueba si `WH` responde durante el movimiento, que es de lo que depende A3 (b) (mayor 2). Y la cota "3/N" se aplica a comprobaciones deterministas (menor N2). |
| Trazabilidad | 4 → 4 | Las cifras corregidas coinciden con las fichas. Pero se atribuye a ariascachero2023operational una diferencia MQTT–OPC UA "inferior al milisegundo" que su ficha contradice (mayor 3), y en §7.1 se citan como comparación con OPC UA trabajos que no la hacen. |
| Reproducibilidad | 3 → 3 | El contrato v0.2 corrige los defectos de la v1. Sigue sin elegirse la placa, y no hay especificación del gemelo: qué emula, cómo modela los tiempos y los errores, y a qué topics se suscribe. |
| Claridad | 4 → 4 | Las tablas de cambios v1→v2 y de riesgos son muy útiles. La terminología "gemelo / emulador / sincronizado" no es constante (mayor 1). |
| Adecuación a la revista | 3 → 4 | Tres aportaciones, dos figuras y una tabla caben en el presupuesto. Hay riesgo de pasarse del límite de referencias (menor N9). |

## Problemas mayores

1. **A3: el "gemelo" está definido de forma contradictoria. Tal como lo describe el contrato, es un emulador en lazo abierto, no un gemelo sincronizado, y E2a mide eso.**
   - *Dónde.* `huecos.md` A3 (a)–(b), PI2 y E2a; `estado_del_arte.md` §8.1 e introducción, aportación (i); `matriz.md`, fila "Este trabajo"; `Docu/contrato_mqtt.md`, "Topics" ("el gemelo digital solo [se suscribe] a `rvm1/gemelo/...`").
   - *Problema.* Los documentos atribuyen al gemelo dos papeles distintos:
     - **(a) Emulador de la D/U-M1.** Recibe órdenes en `rvm1/gemelo/<id>/comandos` y responde con ACK y estados propios. Es lo que permite el contrato y lo que prueba E2a: el mismo programa se envía por separado a `real` y a `gemelo`, y se comparan las poses finales.
     - **(b) Gemelo sincronizado por eventos con el robot real** (A3 b; H5: "ninguno se sincroniza con una controladora que solo da su posición bajo demanda").

     El contrato no dice en ningún sitio que el gemelo lea `rvm1/real/+/posicion/mundo` ni `actuadores`. Por tanto, (b) no tiene mecanismo. Lo que E2a mide es la coherencia de dos sistemas que ejecutan el mismo programa en paralelo. Eso es exactamente lo que el propio §3 atribuye a mihali2005effective (simulador que "se mueve a la par" del RV-M1, elegido al conectar). En la terminología habitual (modelo, sombra y gemelo, que los propios documentos citan a través de kaarlela2023digital), un modelo sin flujo automático de datos desde el objeto físico es un *modelo digital*, no un gemelo. Un revisor de RIAI lo señalará, y es la aportación principal.

     Además, "emula la controladora" promete más de lo especificado:
     - la cinemática inversa de `MP`, que tiene que coincidir con la de la D/U-M1, o el error de E2a la medirá a ella;
     - el modelo temporal del ACK `hecho` en función de la distancia y de `SP`, sin el cual comparar "instantes del `hecho`" (E2a) no tiene sentido;
     - los errores de modo II (`ER`=2) ante poses inalcanzables o argumentos fuera de rango, que siguen sin conocerse (contrato, "Supuestos por verificar");
     - si el gemelo aplica también la caducidad, el descarte de `id`, el motivo `reloj` y `no_referenciado`.
   - *Cambio propuesto.*
     - Definir en `huecos.md` §3 los **modos** del gemelo con una referencia de definición, por ejemplo la clasificación modelo/sombra/gemelo de Kritzinger et al. (2018, IFAC-PapersOnLine) u otra equivalente, a fichar y verificar:
       - *emulador* (destino `gemelo`, lazo abierto);
       - *sombra* (sigue `posicion/mundo` y `actuadores` del real);
       - *gemelo* (ambos y, si procede, validación previa).
     - Pedir a `ingeniero` que añada al contrato (v0.3) qué topics del real lee el gemelo en modo sombra. Que no lo edite este agente.
     - Reformular A3 (b) y H5 según el modo que realmente se implemente. Si solo se implementa el emulador, retirar "sincronizado por eventos" de las aportaciones.
     - Añadir a E2 un ensayo del modo sombra: retardo entre `posicion/mundo` del real y la actualización del gemelo, y estado del gemelo tras un movimiento lanzado desde el pendant, fuera del bus. Sin él, (b) queda sin verificar.
     - Especificar el gemelo (cinemática inversa usada y su fuente, modelo de tiempos de `SP`, errores emulados y salvaguardas replicadas), aunque sea en una tabla de `huecos.md` §5 para `ingeniero`.

2. **La novedad de A3/H4 sigue sobrevalorada. Los tres diferenciadores restantes son débiles o no están demostrados.**
   - *Dónde.* `estado_del_arte.md` §5, "Interfaz común" (último párrafo), §7 (c) e introducción, párrafo 3 ("no se ha encontrado sobre un bus pub/sub con comprobación del destino en el mensaje"); `huecos.md` H4, H5 y riesgos; `matriz.md`, lectura rápida ("Ninguno en un bus pub/sub multicliente").
   - *Problema.*
     - **"Bus pub/sub multicliente".** Cambiar entre robot simulado y real sin tocar los clientes es práctica estándar en ROS, que es un bus pub/sub multicliente. La capa de abstracción de hardware de ros_control se describe como un puente "to different simulated and real robots" y permite intercambiar componentes "whether it is a real or simulated robot" (Chitta et al. 2017, JOSS, [doi:10.21105/joss.00456](https://joss.theoj.org/papers/10.21105/joss.00456)). En la propia matriz hay trabajos con ROS y Gazebo antes del hardware (kumar2024scalable) y con ROS (singh2024unity). Además, kaarlela2023digital usa MQTT como protocolo principal y deja elegir entre modelo, sombra y gemelo, y bravoarrabal2025iort hace pasar las órdenes MQTT por el gemelo antes del robot. Decir que la intercambiabilidad "no se ha encontrado sobre un bus pub/sub" no resiste.
     - **"Gemelo que emula la controladora".** Existe un concepto publicado muy próximo, el *Digital Twin Prototype*: un prototipo software del gemelo físico cuyos sensores y actuadores se emulan, de modo que el software de control no distingue el dispositivo real del emulado, incluso con puertos serie virtuales (Barbie y Hasselbring, [arXiv:2401.07985](https://arxiv.org/abs/2401.07985); versión revisada: Barbie, Hasselbring y Hansen 2024, *Symmetry* 16(2):221, [doi:10.3390/sym16020221](https://doi.org/10.3390/sym16020221), con código abierto). No trata manipuladores heredados, pero obliga a presentar A3 (a) como aplicación de ese concepto, no como idea propia.
     - **"Controladora que solo informa bajo petición".** chang2025construction también *sondea* (125 Hz) una controladora mediante una librería. La diferencia real con la D/U-M1 no es "bajo petición frente a estado continuo", sino la frecuencia y, sobre todo, si `WH` puede leerse **durante** el movimiento. E1.0 solo comprueba `ER`. Si `WH` responde durante el movimiento, la trayectoria intermedia sí es observable y el rasgo diferenciador de H5 ("sin trayectoria intermedia observable") desaparece.
     - **"Destino comprobado en el mensaje".** Es un campo redundante en el payload. Es útil como salvaguarda (A2), pero no puede sostener por sí solo la novedad de la aportación principal.
     - **RV-M1 en VR (2015).** Hay un trabajo, pendiente según `huecos.md` §6, que es el propio RV-M1 en Unity con Oculus Rift, con programación fuera de línea cuyas secuencias se guardan en un fichero que se transfiere al robot real. Según el resumen indexado en Tec de Monterrey ([ficha](https://research.tec.mx/vivo-tec/display/AcademicArticleSCO_84964068311)), es un antecedente más de "simulación → robot real" en el mismo robot. No invalida A3, pero tiene que estar en la matriz antes de afirmar nada sobre gemelos del RV-M1.
   - *Cambio propuesto.*
     - Retirar "bus pub/sub multicliente" como diferenciador en §5, §7, H4, la matriz y la introducción, y reconocer ROS/ros_control y kaarlela2023digital como antecedentes de intercambiabilidad sobre middleware pub/sub.
     - Fichar Barbie et al. 2024 (DTP) y el trabajo VR del RV-M1 de 2015 (buscar DOI; parece Procedia Computer Science).
     - Ampliar E1.0: comprobar con el analizador si la D/U-M1 responde a `WH` durante un movimiento y con qué periodo útil. Reescribir H5 y A3 (b) según el resultado.
     - Reformular A3 sobre lo que sí es defendible tras E1.0 y E2: *la aplicación del enfoque de gemelo/prototipo emulado a un intérprete serie industrial de los años 80, con su semántica de ACK, la observabilidad que permite `WH`/`ER` medida, y la fidelidad separada en coherencia y fidelidad física.* Esta última separación es el diferenciador más sólido que tiene el documento (§5, "Validación de la fidelidad").

3. **Cita que contradice su fuente en la introducción y en la síntesis: MQTT frente a OPC UA.**
   - *Dónde.* Introducción, párrafo 3: "Sus diferencias de latencia con OPC UA en LAN son inferiores al milisegundo [@profanter2019opcua; @ariascachero2023operational]". `estado_del_arte.md` §7.1: "del orden del milisegundo o menores [@profanter2019opcua; @ariascachero2023operational; @luu2025enhancing; @kaarlela2023digital; @liang2020bidirectional]". Y §4: "en una LAN cableada, el transporte apenas cuenta".
   - *Problema.* Según su ficha, ariascachero2023operational da en Ethernet con 2 B una mediana de 2,5 ms para MQTT y 10,1 ms para OPC UA (7,6 ms de diferencia), 10,9 frente a 16,6 ms con 1300 B, y "en operación MQTT ≈30 ms más rápido que OPC UA". Es decir, diferencias de varios milisegundos, no inferiores al milisegundo. El caso de OPC UA es PubSub con periodo de 10 ms, que probablemente explica la diferencia. Por otro lado, luu, kaarlela y liang no comparan con OPC UA. Al corregir el menor 5 de la v1 se ha introducido este error nuevo.
   - *Cambio propuesto.*
     - Introducción: "en un banco de pruebas en LAN las diferencias entre MQTT y OPC UA cliente/servidor fueron inferiores al milisegundo [@profanter2019opcua]; en una celda con un UR5e, MQTT fue varios milisegundos más rápido que OPC UA PubSub [@ariascachero2023operational]".
     - §7.1: separar "MQTT se usa entre gemelo y robot" [luu, kaarlela, liang] de la comparación de latencia [profanter, ariascachero].
     - §4: matizar "el transporte apenas cuenta" (depende de la configuración: PubSub periódico, tamaño del mensaje).

## Problemas menores

**Nuevos en la v2**

- **N1. Justificación de `ts` frente a *Message Expiry*.** Está en `huecos.md` A2, `estado_del_arte.md` §5 y §8.2, y en la ficha `oasis2019mqtt`. La justificación actual ("solo cubre el broker, no la cola de la placa") es incompleta. Según §3.3.2.3.3 de MQTT 5.0, el servidor reenvía al cliente el intervalo **reducido** en el tiempo que el mensaje ha esperado en el broker. Con eso, la placa podría aplicar la caducidad restante con su reloj monótono y sin NTP. Las razones de peso que no se dan son estas:
  - el intervalo es un entero en **segundos**, así que no puede expresar 500 ms;
  - no cubre el tramo publicador→broker;
  - depende de que la biblioteca MQTT de la placa admita la v5, lo que enlaza con la elección de la placa.

  Sustituir la justificación por estas.
- **N2. La cota "3/N" en comprobaciones deterministas.** Está en `huecos.md` E4 y PI3. La regla de tres supone ensayos independientes con una probabilidad de fallo constante. Repetir 30 veces la misma comprobación determinista (JSON inválido, destino cruzado, falta de `home`) no da información nueva. Propuesta:
  - presentar la cota solo para los tipos que dependen del tiempo (caducidad en la frontera de 500 ms, orden retenida en la cola, duplicados que llegan durante la ejecución, desfase cerca de 100 ms, LWT), con instantes aleatorizados y casos frontera (p. ej. 490 y 510 ms);
  - para los tipos deterministas, usar pruebas automáticas y pocos ensayos con el robot.

  Esto además reduce el esfuerzo: once tipos × 30 son ≥ 330 ensayos, varios de ellos con desconexiones físicas.
- **N3. Ventana efectiva de caducidad.** Con una tolerancia de desfase de 100 ms, la ventana real va de unos 400 a unos 600 ms. Hay que declararlo en PI1 ("¿es compatible la ventana…?") y en E4.
- **N4. E2b: medida externa.** En `huecos.md` E2b hay que exigir dos cosas: que la resolución de la referencia (un "puntero sobre plantilla milimetrada" es del orden de 1 mm) sea claramente menor que los errores que se quieren resolver, y un procedimiento de registro de la plantilla en el sistema de la base, con su incertidumbre. Si no, el error de registro dominará la "fidelidad física".
- **N5. E1: "orden sin movimiento (p. ej. `velocidad`, o `WH`)".** `WH` no es un `cmd` del contrato. Usar `velocidad` o añadir al contrato una orden de lectura (decisión de `ingeniero`).
- **N6. E2a con varios clientes a la vez.** Mezclar la demostración de A3 (d) con la medida de coherencia puede contaminar los tiempos del `hecho`. Hacer la demostración multicliente en un bloque aparte, o mostrar que no cambia los tiempos.
- **N7. PI3, "tiempo hasta `offline`".** Depende del *keep alive* configurado (el broker detecta la caída a 1,5 veces ese valor en MQTT 3.1.1). Fijarlo y declararlo como factor.
- **N8. Contradicción "todos los gemelos sincronizados se alimentan de estado continuo".** Está en §5 y en H5. mihali2005effective está clasificado como "visualización sincronizada" sobre el propio RV-M1, que no da estado continuo. Hay que precisar, a partir de la ficha, cómo sincroniza (probablemente enviando la misma orden a los dos, en lazo abierto) o excluirlo de forma explícita de la afirmación.
- **N9. Presupuesto de referencias.** La versión para la introducción ya usa 29 claves, cinco de ellas normas. Los métodos necesitarán al menos el manual del RV-M1 y la referencia de definición de gemelo (mayor 1), y quizá Barbie et al. (mayor 2). Con ellas se roza el máximo de 35. Proponer ya qué se recorta (p. ej. kolla2022retrofitting o sanchezlondono2023smart en la introducción; MQTT 3.1.1 y 5.0 en una sola mención en métodos).
- **N10. Normas leídas solo en la ficha de catálogo.** Sparkplug 3.0 tiene especificación pública de Eclipse. Leerla como fuente primaria antes de atribuirle contenido (§5 lo toma de "documentación secundaria"). Para ISO 9283 e ISO 10218-1 basta su uso actual, que es solo negativo ("no es un ensayo según…").
- **N11. Frase de "no se ha encontrado" de la introducción.** Párrafo 4: "conserve una controladora cuya única interfaz sea un puerto serie, la conecte a un protocolo IIoT estándar con un gemelo digital". Al pie de la letra, la cumple ciungan2025enhancing (Arduino por serie, RPi→MQTT con TLS, VR). Añadir "industrial heredada".
- **N12. Duplicados en el contrato.** "Devuelve otra vez el ACK que ya dio": hay que especificar cuál (el último, `aceptado` o `hecho`), y que el gemelo implemente la misma lógica si "emula" la placa. Es para `ingeniero`; afecta a E4.
- **N13. kumar2011virtual.** Leído en academia.edu. Conviene comprobar que coincide con la versión publicada (DOI 10.1016/j.rcim.2011.05.003) antes de citar detalles. Es una tarea del verificador, que se señala aquí.

**Heredado de la v1 y no resuelto**

- **Menor 15 (placa).** Sigue abierto y ahora condiciona también N1 (soporte de MQTT 5). Es bloqueante para E1.0 y E1, no para el estado del arte.

## Seguimiento de la v1

| Problema v1 | Estado | Comentario |
|---|---|---|
| M1 A4 / interfaz común | **Parcialmente resuelto** | Kutzer fichado e integrado. Frase contradictoria de la introducción corregida. Intercambiabilidad ya no reivindicada. Pero la nueva formulación de A3 se apoya en diferenciadores débiles ("pub/sub multicliente", "bajo petición") y en una sincronización que el contrato no implementa (mayores 1 y 2 de la v2). |
| M2 A2 mecanismos estándar | **Resuelto** (con N1) | Normas citadas. A2 reformulada como adaptación verificada. chang2025construction releído y descrito con precisión. Falta corregir la justificación de `ts` frente a *Message Expiry* (N1). |
| M3 defectos del contrato | **Resuelto** | El contrato v0.2 comprueba la caducidad dos veces, descarta duplicados, controla el reloj (`reloj`), aclara el alcance de `parar` y añade ACL/TLS. E4 incluye los casos pedidos. Queda un detalle de especificación (N12). |
| M4 E1 no medible | **Resuelto en el diseño** | Un reloj por equipo, E1.0 con analizador, latencia separada del tiempo de ejecución, factores fijos y cota teórica. Pendiente: elegir la placa (menor 15) y la orden sin movimiento (N5). |
| M5 E3 | **Resuelto** | Demostración funcional; repetibilidad retirada de las aportaciones; ISO 9283 solo para acotar. |
| M6 alcance y gemelo opcional | **Resuelto** | Sin condiciones; tres aportaciones; presupuesto de resultados con dos figuras y una tabla. Vigilar el número de referencias (N9) y el esfuerzo de E4 (N2). |
| M7 trabajos y normas que faltaban | **Parcialmente resuelto** | Holmes, Kutzer, Kumar 2011 y las cinco normas añadidos. Pendientes: el trabajo de RA (2012) y el de VR del RV-M1 (2015, localizado en esta revisión), Kandala 2025 y Brunn y Labib 2005. Nueva laguna: la definición de gemelo y los DTP (mayores 1 y 2). |
| M8 E2 coherencia frente a fidelidad | **Parcialmente resuelto** | E2a/E2b separados, unidades físicas, declaración de resoluciones. Pero E2a mide un emulador en lazo abierto, no la sincronización (mayor 1), y E2b necesita registro e incertidumbre de la referencia (N4). |
| m1 Ciungan | Resuelto | "No se ha encontrado medida de latencia en las partes leídas", en `huecos.md` y en la matriz. |
| m2 Pontarolli | Resuelto | PLC con SCARA; MQTT como *Databus* interno, en la matriz, §2 y H1. |
| m3 Alqoud | Resuelto | "Dato de contexto, no prueba del hueco". |
| m4 "Por primera vez" | Resuelto | Eliminado; regla recordada en §6. |
| m5 Profanter | Resuelto, con error nuevo | Profanter, bien matizado. Pero ariascachero se cita ahora para "inferior al milisegundo" (mayor 3). |
| m6 Luu | Resuelto | Anomalía señalada; cifras solo como orden de magnitud. |
| m7 N de E4 | Resuelto, con matiz | N ≥ 30 o N = 100 con cota. La cota solo tiene sentido en los casos dependientes del tiempo (N2). |
| m8 Disponibilidad | Resuelto | "Fracción de tiempo en línea durante el ensayo". |
| m9 | — | Pasado a M8. |
| m10 A1 y literatura gris | Resuelto | Base habilitante; bibliotecas mencionadas y fuera de refs.bib. |
| m11 Habilitación | Resuelto | "Pulsación mantenida por software"; seta física declarada. |
| m12 Patrão | Resuelto | "Un estudio de 2025 sobre un RV-2AJ…". |
| m13 Pan y Huang | Resuelto | Fuera del recuento, marcado en la matriz. |
| m14 Fila "Este trabajo" | Resuelto | Todo "previsto". |
| m15 Placa | **No resuelto** | Fuera del alcance del investigador. Bloquea E1 y condiciona N1. |
| m16 Amenazas a la validez | Resuelto | Lista interna, de medida, externa y de constructo en `huecos.md` §5. |
| m17 Frase ambigua | Resuelto | "Solo tres trabajos dan medidas de prestaciones", nombrados. |

## Comprobaciones hechas (búsquedas, cifras contrastadas)

**Cifras contrastadas con las fichas:**
- holmes2025retrofitting: 8,3 %, 15,4 %, 13,9 %, la mitad por caídas de OPC XML-DA, sin latencia, unos 7 ciclos. Coinciden.
- kutzer2023scorbot: funciones `ScorSim*`/`Scor*`, servidor local, DLL USB, otoño de 2020, solo métricas de código. Coinciden.
- chang2025construction: tolerancia declarada sin mecanismo y sondeo a 125 Hz. Coincide.
- kumar2024scalable: 14 y 36 equipos, Gazebo antes del hardware. Coincide.
- ariascachero2023operational: 2,5 frente a 10,1 ms; 10,9 frente a 16,6 ms; unos 30 ms en operación. **No coincide** con "inferiores al milisegundo" (mayor 3).
- mihali2005effective: elección robot/simulador al conectar; visualización sincronizada. Coincide, pero choca con "todos se alimentan de estado continuo" (N8).
- kaarlela2023digital: MQTT como protocolo principal; niveles modelo/sombra/gemelo elegibles. Pesa en contra de la afirmación de H4 (mayor 2).

**Coherencia con el contrato v0.2.** Coinciden con `huecos.md` §5 la doble comprobación de la caducidad, los duplicados (256 `id` o 10 s), `desfase_ms` con 100 ms y motivo `reloj`, el alcance de `parar` y la seguridad de red. **No hay** en el contrato ninguna suscripción del gemelo a los topics del robot real (mayor 1). `WH` no es un `cmd` (N5).

**Búsquedas web (2026-11-25):**
- "RV-M1 … virtual reality Oculus Rift Procedia": trabajo de 2015 (Tec de Monterrey, indexado en Scopus) con simulador del RV-M1 en Unity y Oculus Rift y programación fuera de línea cuyas secuencias se guardan en un fichero que se transfiere al robot real ([research.tec.mx](https://research.tec.mx/vivo-tec/display/AcademicArticleSCO_84964068311)). Hay una entrada relacionada de 2016, "Virtual reality simulator for robotics learning" ([research.tec.mx](https://research.tec.mx/vivo-tec/display/AcademicArticleSCO_84963743789)). Autores y DOI no visibles en la página. Sin enlace en vivo con el robot.
- "ros_control … simulation and real hardware": Chitta et al. 2017, JOSS, [doi:10.21105/joss.00456](https://joss.theoj.org/papers/10.21105/joss.00456). La capa de abstracción de hardware permite intercambiar robot real y simulado (mayor 2).
- "digital twin prototype emulator serial": Barbie y Hasselbring ([arXiv:2401.07985](https://arxiv.org/abs/2401.07985)) y Barbie, Hasselbring y Hansen 2024, *Symmetry* 16(2):221, [doi:10.3390/sym16020221](https://doi.org/10.3390/sym16020221). Dispositivos emulados, incluidos puertos serie virtuales, que el software de control no distingue de los reales (mayor 2).
- "Kritzinger 2018 digital twin … digital model digital shadow": localizada la referencia (IFAC-PapersOnLine, 2018). No se pudo abrir la página del repositorio de Fraunhofer, así que los datos bibliográficos los debe completar y verificar `investigador`/`verificador-referencias`.
- "legacy robot arm RS-232 controller MQTT bridge digital twin 2025 latency": Xiong, Ma y Wang 2026 (*Frontiers in Computing and Intelligent Systems* 15(3), [doi:10.54097/rh3m5y71](https://drpress.org/ojs/index.php/fcis/article/view/34436)). Gemelo y *middleware* MQTT para un brazo ligero de cinco ejes, latencia "de milisegundos" sin cifras en el resumen. No hay controladora heredada ni serie industrial, así que no compromete A1. Puede fichar como contexto. Nada más relevante.
- MQTT 5.0 §3.3.2.3.3 ([OASIS](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)): el intervalo se expresa en segundos (entero de cuatro bytes), y el servidor reenvía el valor recibido menos el tiempo de espera en el servidor (N1).

**Resultado sobre la novedad.** Sigue sin encontrarse un trabajo que caracterice con medidas una cadena serie industrial heredada conectada a un protocolo IIoT, así que A1 se sostiene. A2 se sostiene como adaptación verificada. A3, la aportación principal, no se sostiene tal como está formulada: la intercambiabilidad sobre middleware pub/sub y la emulación de interfaces de dispositivos tienen antecedentes, y la "sincronización por eventos" no está especificada ni se ha comprobado que la D/U-M1 la imponga (lectura de `WH` durante el movimiento). Lo defendible es la separación medida entre coherencia y fidelidad física, junto con la emulación de un intérprete serie de los 80 con su semántica.

**No revisado.** Las 8 referencias nuevas de `refs.bib`: las verifica otro agente y no se dan por buenas. Tampoco se han abierto los textos originales de las fuentes; la trazabilidad se ha comprobado contra las fichas.

## Recomendación: revisión mayor — motivo

La v2 resuelve bien la mayoría de lo pedido. De los ocho mayores de la v1, cuatro están resueltos (M2–M6, con M2 a falta del matiz N1) y tres parcialmente. Los 17 menores están resueltos salvo la placa. El trabajo ha ganado en honestidad y rigor.

Pero quedan tres mayores, y los dos primeros afectan a la aportación que `CLAUDE.md` declara principal, el gemelo:
1. su definición es contradictoria (emulador en lazo abierto frente a gemelo sincronizado) y E2a no mide la sincronización que se reivindica;
2. su novedad se apoya en diferenciadores que ROS/ros_control, kaarlela2023digital y los *digital twin prototypes* ya cubren, o que dependen de un comportamiento de `WH` aún no verificado;
3. una cita de la introducción contradice su fuente.

Las correcciones son acotadas y no obligan a rehacer el estado del arte:
- definir los modos del gemelo y pedir a `ingeniero` el cambio del contrato;
- ampliar E1.0 a `WH`;
- fichar entre 3 y 4 trabajos (definición de gemelo, DTP, VR del RV-M1 y, opcionalmente, ros_control);
- reescribir A3, H4 y H5 y una frase de la introducción.

Tras ello se recomienda una revisión v3, que podría ser rápida.
