# Respuesta a la revisión v4 del estado del arte y a la ronda 4 de verificación

- **Autor de la respuesta:** agente `investigador` (productor de `estado_del_arte.md`, `huecos.md` y `matriz.md`; no revisa su propio trabajo).
- **Fecha:** 2026-11-25.
- **Documentos actualizados (v5):** `investigacion/estado_del_arte.md` (incluida la versión para la introducción, unas 640 palabras sin claves, con PI), `investigacion/huecos.md` e `investigacion/matriz.md`.
- **Fichas nuevas:** `placzek2018testing`, `industrialrobot2006csr` (literatura gris) y las fichas de pista no citables `calderon2002jrobot` (JRobot) y `denford2011vrrobot` (Denford VR Robot).
- **Fichas corregidas:** keibel2002konzeption, karras2003cosimir, swider2007offline, swider2007system, bernhardt2002cost, mihali2005effective (relectura del PDF), crespo2015virtual, freund1994towards e iso2023sparkplug.
- **`refs.bib`:** +2 entradas con `note = {verificacion: pendiente}`: placzek2018testing e industrialrobot2006csr. La página de ABB no se añade.
- **Registro:** `investigacion/busquedas/revision-v4.md`.
- **No se ha tocado** `paper/`, `gemelo/` ni el contrato.

## Problema mayor 1: "no se ha encontrado una medida publicada" y "emulador abierto"

**(a) Medidas publicadas. Aceptado.**
- Fichado **placzek2018testing** con el texto completo. Es revisado por pares, *Eksploatacja i Niezawodność* 20(3), 455–464, DOI 10.17531/ein.2018.3.15.
  - Compara la trayectoria de un KUKA KR 16-2 real, medida con un láser tracker Faro, con la simulada en Robcad de dos formas: en modo "default" y con la herramienta RCS de la controladora.
  - La real coincide con la de RCS y difiere de forma significativa de la "default".
  - Se compara **una sola trayectoria** y el resultado está **solo en figuras**, sin cifras ni tiempos de ciclo.
  - El texto desarrolla RCS como "Robot Controller Software" y **no** menciona RRS. La relación con la interfaz RCS de RRS es una inferencia nuestra, marcada [POR VERIFICAR].
  - Ensayos ISO 9283: AP de unos 0,54 a 2,36 mm y RP de unos 0,03 a 0,12 mm.
- Fichado **industrialrobot2006csr**, con los metadatos de Emerald: *Industrial Robot* 33(1), 2006, DOI 10.1108/ir.2006.04933aab.001, "non article" sin firma.
  - CimStation Robotics con RRS quedó a un 1,2 % de los tiempos de ciclo reales en pruebas de ABB en Västerås. La nota afirma además un 3 % frente al 5 % "del sector".
  - Las declaraciones son del director de AC&E, el fabricante del software. Se cita **solo como afirmación comercial**, tal como pide el revisor.
- **ABB (~99 %):** se ha leído la página, que no indica fecha, método ni muestra. Queda como contraste **dentro de la ficha** industrialrobot2006csr, sin entrada en `refs.bib`, porque la nota de 2006 basta como ejemplo.
- Rot (2023) y Malik (2025) **no se han fichado**. Quedan en riesgos de cobertura (`huecos.md` §6).
- Las dos fuentes nuevas se han añadido a `huecos.md` §6:
  - RRS/VRC se amplía con sus cifras;
  - placzek2018testing entra como riesgo alto nuevo.

**(b) "Abierto" frente a JRobot. Aceptado: "abierto" se retira como diferenciador.**
- Se han leído la página de SourceForge, la de ficheros, la web del proyecto (inicio, índice de documentación, needed.htm y config.htm) y el informe report.pdf, de 2002 y en francés.
- JRobot es una aplicación Java (BSD/GPLv2) que envía órdenes al RV-M1 por serie o por *socket* a través de una biblioteca de la Universidad de Ginebra. Esa biblioteca encola las órdenes y las sincroniza con el robot. La aplicación tiene una vista 3D en Java3D.
- En lo leído **no** se describe:
  - un intérprete de órdenes Movemaster en la vista virtual;
  - el modelado de errores o tiempos;
  - la lectura de `WH` o `ER`.

  La biblioteca tiene una "test connection" que no se explica.
- **El código no se ha podido leer.** Solo está dentro de jrobot.zip, no hay navegador de código y en este entorno no hay herramienta para descomprimirlo.
- Como el revisor indica que "abierto" no puede usarse mientras no se mire el código, se **retira** de H4, A3, §8, la introducción y la matriz ("no es diferenciador"). El diferenciador que queda es la medida con protocolo y su descomposición.
- Pendiente opcional para Álvar: revisar el zip en su equipo (anotado en la ficha).
- **Denford VR Robot:** el foro (dos páginas del hilo de 2011) confirma un software comercial con llave de licencia que trabaja con el RV-M1 por RS-232. No dice si emula la controladora ni si lee el estado, y no hay documentación accesible. Riesgo bajo; ficha de pista sin cita.

**(c) Riesgo de "validar el artefacto". Aceptado; se reformula A3-1 como propone el revisor.**
- **Formulación nueva de A3-1** (`huecos.md` §3.2 y H4; `estado_del_arte.md` §5, §7 (c) y §8; introducción): medida, con protocolo declarado, de la coherencia de un emulador **reconstruido desde el manual** de una controladora serie **sin software reutilizable**. El protocolo tiene conjuntos de ajuste y de evaluación separados, con cobertura fijada, y parámetros congelados. El error se **descompone** en:
  - **cinemática:** pose final frente a `WH` en reposo, con la misma orden;
  - **tiempos:** instante del `hecho`;
  - **conducta:** aceptación o rechazo, código o modo de error, y ACK.

  Pregunta (PI2 a): "qué fidelidad alcanza un emulador escrito solo desde el manual y dónde falla".
- **Se reconocen las medidas parciales**:
  - tiempos de ciclo de RRS y ABB, de fabricante y sin protocolo;
  - la trayectoria de Płaczek, solo en figuras;
  - los "pocos por ciento" de Keibel, sin datos.
- **En qué se diferencia la nuestra** (`huecos.md` §3.2, A3-1, puntos a–d):
  - (a) el tipo de emulador: reconstruido desde el manual frente a la reutilización del software o del firmware del fabricante, que bernhardt2002cost considera "el único enfoque con éxito";
  - (b) el protocolo declarado;
  - (c) las magnitudes: pose, tiempos y conducta, frente a solo tiempo de ciclo o solo trayectoria;
  - (d) la descomposición, que asigna cada discrepancia de conducta a un supuesto S1–S6 o la marca como "no documentada". Es lo que hace el resultado transferible a otras controladoras heredadas.
- La transferencia se declara como argumento, no como medida, en las amenazas a la validez externa.
- Ya no se dice en ningún sitio "no se ha encontrado una medida publicada" en forma absoluta. Tampoco se reivindica la "primera medida" (§8).
- **Cambio 4 (E2a).** Añadidos a `huecos.md` §5:
  - las tres métricas de la descomposición;
  - el conjunto de conducta, derivado del manual y de S1–S6, limitado a casos que el manual indica sin movimiento peligroso y con la seta al alcance;
  - el registro de la respuesta a `ER` y del ACK de ambos destinos, como petición nueva a `ingeniero`.
- **Cambio 5 (opcional).** Anotado en E2a como "contraste para la discusión (orden de magnitud, no competidores)".
- **A3-2.** Se acota también frente a placzek2018testing. En un mismo trabajo tienen la simulación con la controladora emulada, el robot real y la medida externa, pero comparan la simulación directamente con el tracker, sin la pose informada por la controladora como término intermedio y sin cifras (`huecos.md` H5 y §6; `estado_del_arte.md` §5).

## Problemas menores nuevos

- **N4-1 ("lazo abierto = modelo"). Aceptado y ampliado.**
  - La leyenda de la matriz y `estado_del_arte.md` §5 tienen ahora una categoría "fuera de los tres niveles (flujo automático solo digital → físico)" para swider2007system y swider2007offline. `huecos.md` §3.1 dice que el criterio no contempla ese flujo.
  - **Mihali no sigue como modelo.** Al releer el PDF (N4-2) se ve que el robot conectado se mueve con las operaciones del usuario en el simulador ("The actual robot will move synchronously with the users operations if it is connected to the simulator"). Es decir, el simulador gobierna el robot, como en Świder, y no se trata de dos ejecuciones en paralelo de las mismas órdenes.
  - Por eso pasa a la misma categoría. Desaparecen la "visualización en paralelo" y la "inferencia".
- **N4-2. Aceptado.** Releído el PDF de la revista.
  - Mihali lee la pose del robot **al conectar** ("Sym Gets Robot Coords") y comprueba la conexión con TEST. No describe la lectura durante la ejecución.
  - La introducción dice ahora "ninguno muestra el estado del robot **durante la ejecución**". §3, §5 y §8 usan "lectura en vivo" o "durante la ejecución".
  - Se ha retirado el [POR VERIFICAR] de la ficha.
- **N4-3. Aceptado.** En H5, §5 y la matriz, Keibel aparece como "afirmada sin protocolo ni datos ('pocos por ciento')".
- **N4-4. Aceptado.**
  - E2a y E1 exigen que el protocolo de `analista-experimentos` fije, **antes del ajuste**, la cobertura del conjunto de ajuste: los rangos de distancia articular y cartesiana y los valores de `SP` (al menos los extremos usados y uno intermedio).
  - También debe declarar de antemano qué programas de evaluación son de interpolación y cuáles de extrapolación. La cinemática y los tiempos se informan por separado en cada grupo.
  - Añadido a las amenazas internas y a la especificación del emulador (§3.3).
- **N4-5. Aceptado. Margen fijado.** En E2c, el criterio se fija en el protocolo antes del ensayo y no se cambia tras ver los datos. Se excluyen:
  - la primera muestra tras suscribirse, si llega con la bandera retain;
  - toda muestra cuya antigüedad estimada (recepción en el gemelo menos el `ts` de la placa, corregida con `desfase_ms`) supere **2 × el periodo de sondeo vigente**: **1000 ms en reposo** (sondeo cada 500 ms) y **2 × T_WH** en movimiento en el caso B.

  Se informan el número de muestras excluidas y la estadística **con y sin exclusiones**.
- **N4-6 (citas de "extracción resumida"). Resuelto con la ronda 4 del verificador.**
  - El verificador confirmó como **literales** la cita de Bernhardt y Willnow ("The only successful approach…", §3.1) y la de Keibel (cap. 6, p. 93). Las fichas lo indican.
  - La cita de swider2007offline se acorta al fragmento confirmado ("send data to the robot in real time").
  - La cita nueva de placzek2018testing queda marcada [POR VERIFICAR literal].
- **N4-7. Aceptado.**
  - freund1994towards sigue en reserva y solo se le atribuye lo que dice su resumen.
  - §5 escribe "procede de la línea de Dortmund … [@freund1994towards; @keibel2002konzeption]", de modo que el "origen" se apoya en Keibel (ver también el punto 4 del verificador).
  - Nota añadida a la ficha.
- **N4-8. Aceptado.**
  - El cuerpo de iso2023sparkplug ("Qué se usa de la norma") se apoya ahora solo en la especificación de Eclipse 3.0.0: §2.4 (NDEATH como Will en el CONNECT) y §4.2.1 (`bdSeq`, NDEATH, `seq` de 0 a 255 por la regla de incremento).
  - Se retira lo que solo venía de Kura (STALE).
  - El [POR VERIFICAR] de `seq` queda resuelto en Eclipse, no en el texto ISO.

## Heredados

- **Menor 15 de la v1 (placa):** sigue abierto; depende de Álvar y bloquea E1.0.
- **N12, N3-7 y la entrada del manual del RV-M1:** siguen en `ingeniero`. Se añade una petición: que el registro JSONL de E2a guarde la respuesta a `ER` y el ACK de ambos destinos, para el conjunto de conducta.
- **crespo2015virtual:** ver el punto 8 del verificador.
- **Introducción del artículo (`paper/`):** no se ha tocado. `redactor` debe alinearla con la versión para la introducción de la v5, que incorpora el mayor 1, cuando se verifiquen placzek2018testing e industrialrobot2006csr.

## Ronda 4 de verificación: los 7 textos a corregir (más la acción sobre Crespo)

1. **§3: subconjunto de órdenes solo con [@swider2007system]. Hecho.**
   - Se cita con [@swider2007system] el reconocimiento del subconjunto de órdenes.
   - Se citan con [@swider2007system; @swider2007offline] el enlace en vivo, los puestos en red y el modo mixto.
   - También se ha separado en la matriz ("Lectura rápida") y en H4.
2. **"Lectura en vivo del estado". Hecho.** Ahora dicen "no describen la lectura en vivo del estado del robot" y mencionan la descarga de programas o posiciones:
   - §3, §5 y §8 de `estado_del_arte.md`;
   - H5 y §6 de `huecos.md`;
   - las filas de Świder en la matriz.
3. **Movemaster en las fichas de Keibel y karras2003cosimir. Hecho.** Las dos dicen ahora: "no menciona el RV-M1 ni MRL; cita una vez un manual Movemaster ([Ele97]) en §6.3, p. 116, sobre ejes adicionales".
4. **Origen de COSIMIR. Hecho.** Ahora se apoya en las dos claves, [@freund1994towards; @keibel2002konzeption], en §5 y en H4 ("misma línea de Dortmund").
5. **Cita de swider2007offline. Hecho.** Se acorta al fragmento confirmado.
6. **Dos frases de §5 en bernhardt2002cost. Hecho.**
   - La ficha distingue la afirmación de resultado de la frase de requisito.
   - §5 dice "afirman haber logrado una simulación muy exacta, sin cifras", que es la afirmación de resultado.
7. **Aviso inicial y nota de la introducción. Hecho.**
   - Dicen que las 5 claves de la v4 están verificadas (Keibel corregida).
   - Solo quedan pendientes las 2 nuevas.
- **Punto 8: Keibel 2003. Hecho.**
  - En la ficha: cabecera "Keibel, A. (2003)" y DOI 10.17877/DE290R-5278, con su resolución no comprobada.
  - En la matriz: año 2003.
  - La clave no cambia.
  - En `estado_del_arte.md` y `huecos.md` no aparece "Keibel (2002)" como año en el texto.
- **Acción 8, crespo2015virtual. Hecho, la opción de rebajar.**
  - Se ha repetido la búsqueda del PDF sin éxito.
  - §3, §5 y §6, H2, §6 de `huecos.md` y la matriz describen ahora solo lo del resumen: programas en un fichero que se transfiere al robot real y evaluación con alumnos cualitativa.
  - Se ha quitado **Denford** y "sin tamaño de muestra".
  - La ficha conserva la lectura de ResearchGate, marcada [POR VERIFICAR en el PDF].

## Recuentos tras la v5

- **Matriz:** 55 trabajos citables y 3 pistas no citables (karras2003cosimir, calderon2002jrobot y denford2011vrrobot), más la fila "Este trabajo"; aparte, 5 normas.
- **Presupuesto de referencias:** 29 claves en la introducción + 4 en métodos = 33.
  - Entran placzek2018testing e industrialrobot2006csr.
  - Salen alvares2018retrofitting y zhang2024construction, que pasan a reserva.

## Lo que sigue abierto

- Verificar placzek2018testing e industrialrobot2006csr, incluida la cita literal de Płaczek. Después, el revisor debe hacer la v5.
- Revisar el código de JRobot (opcional; Álvar).
- Leer el texto completo de Crespo et al. (ScienceDirect).
- Fichar Rot (2023) y Malik (2025) si el revisor lo considera necesario.
