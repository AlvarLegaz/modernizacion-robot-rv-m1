# Verificación de referencias — `referencias/refs.bib`

- **Fecha:** 2026-11-25
- **Agente:** `verificador-referencias`
- **Alcance:** las 41 entradas de `refs.bib` y las cifras y afirmaciones clave de `investigacion/fichas/<clave>.md` (sobre todo la sección "Evaluación").
- **Método:** las APIs de OpenAlex, Semantic Scholar y arXiv no respondían en este entorno, y PMC pedía reCAPTCHA. El acceso de WebFetch funciona por lista de URL permitidas: solo se pueden abrir URL que hayan salido en resultados de WebSearch. Por eso cada título se buscó con WebSearch y después se abrió con WebFetch la página del editor, el PDF o el repositorio que aparecía en los resultados. Cuando Crossref salía en los resultados (`api.crossref.org/works/<DOI>`), se usó como fuente. La columna "Comprobado en" indica la fuente de cada caso.
- **Resultado:** 34 VERIFICADAS, 7 CORREGIDAS, 0 DUDOSAS, 0 NO ENCONTRADAS. No hay que retirar ninguna entrada por no existir. Hay salvedades en ariascachero2023operational (DOI sin confirmar), xiang2024development (preprint), ruiz2022caracterizacion y castillo2020propuesta (literatura gris) y en varias cifras de fichas (ver más abajo).

## Tabla de verificación

| Clave | Estado | Comprobado en | Observaciones |
|---|---|---|---|
| roldan2018enhancing | CORREGIDA | PDF y HTML de Revista ESPACIOS (revistaespacios.com/a18v39n35/…p06.pdf y 18393506.html) | Título, autores, vol. 39, n.º 35 y 2018 coinciden. La revista indica solo la página inicial (Pág. 6), sin rango: se añade `pages = {6}`. Sin DOI. Recibido el 20/03/2018 y aprobado el 10/05/2018. |
| ruiz2022caracterizacion | VERIFICADA | PDF en investigacion.teinco.edu.co (2024/05) | Autores (Ruiz Neira, D.; González Guevara, E. Y., directora del Semillero Bicentenario), TEINCO, 2022 confirmados en el documento. **No tiene ISSN, revista ni revisión por pares declarada**: es literatura gris y debe citarse como tal. |
| castillo2020propuesta | CORREGIDA | PDF del libro "Aplicaciones Mecatrónicas" (investigacion.teinco.edu.co, 2023/05) | Autores confirmados en el capítulo (Iván Eduardo Castillo Gómez y Camilo Andrés Peña Forero, estudiantes). Editor: M. F. García García. Editorial TEINCO, Bogotá, 2020 (publicado el 25/06/2020). **Páginas 45–51** (antes "≈44–52"). No consta ISBN ni revisión por pares. |
| barraza2016modelado | VERIFICADA | revistas.uis.edu.co (página del artículo) | Coinciden autores, vol. 15(2), 49–62 y DOI. Nombres completos en la fuente: Barraza Cantillo, Rúa Charris, Sosa Rodríguez, Díaz González, Yime Rodríguez, Roldán Mckinley. |
| swider2007system | CORREGIDA | PDF y registro de delibra.bg.polsl.pl (publication/40685) | Autores Świder, Foit, Wszołek, Mastrowski; JAMME 25(1), 2007. El registro de la biblioteca da las páginas 7–14 y se añaden. (Las cabeceras del PDF sugieren que empieza en la 9, pero el número de la primera página no se lee; se usan los metadatos del repositorio.) |
| foit2008web | VERIFICADA | PDF en delibra.bg.polsl.pl (Content/36182) | Foit, K.; JAMME 27(2), abril de 2008, 183–186. Prototipo inicial sin métricas, como dice la ficha. |
| mihali2005effective | VERIFICADA | Página del artículo y PDF en jstem.org | Mihali y Sobh; J. STEM Educ. 6(3–4), julio–diciembre de 2005, 21–28. Robot RV-M1 (Movemaster EX). No hay métricas cuantitativas, como dice la ficha. |
| pan2004pcbased | VERIFICADA | Crossref (10.1109/ROBIO.2004.1521883) | Título, autores, ROBIO 2004 y 790–794 coinciden. Crossref no da fecha de publicación (depósito de 2005), lo que explica que OpenAlex dé 2005; se mantiene 2004. |
| herrera2018simulador | VERIFICADA | PDF en rinacional.tecnm.mx | Tesis de Maestría en Ingeniería, IT de Mérida (TecNM), 28/08/2018. En la portada el autor figura como "I.S.C. Jonathan H. Aponte". Se mantiene "Herrera Aponte, Jonathan" (el nombre del fichero es Herrera25), pero conviene confirmarlo en el registro del repositorio. |
| jokic2020two | VERIFICADA | mdpi.com/2079-9292/9/6/972 | Metadatos y cifras de error confirmados. Ver la nota sobre los costes en "Afirmaciones". |
| patrao2025understanding | VERIFICADA | PDF de las actas (ieomsociety.org/proceedings/brazil2025/81.pdf) e índice IEOM | El PDF imprime el orden Patrão, Godoy, Caldana (coincide con el .bib), con págs. 316–327 y el DOI correcto. El índice web de IEOM ordena Patrão, Caldana, Godoy; se da prioridad al PDF. Especificaciones confirmadas. |
| campos2019diseno | VERIFICADA | repositoriotec.tec.ac.cr (handle 2238/10957) | Proyecto de graduación de licenciatura, Escuela de Ing. Electrónica, TEC, 2019. Cifras de la ficha no comprobadas (solo se abrieron los metadatos). |
| alqoud2022industry | VERIFICADA | mfr.edp-open.org (DOI 10.1051/mfreview/2022031) | Metadatos coinciden. 32 trabajos, 69 %, 53 % y 37,5 % confirmados. |
| sanchezlondono2023smart | VERIFICADA | Crossref (10.1007/s10845-022-02002-2) | 34(1), 1–19, 2023 (en línea el 29/08/2022). |
| kolla2022retrofitting | VERIFICADA | PDF publicado en orbilu.uni.lu | El PDF incluye a los 4 autores (con Atal Anil Kumar; la ficha de ORBilu omite a uno). Vol. 200, 62–70, DOI correcto. Sensores y ausencia de cifras de error confirmados. |
| mendonca2025development | VERIFICADA | mdpi.com/2227-9717/13/1/136 | Metadatos y los cinco niveles RAMI antes/después confirmados (tabla 4). |
| bilancia2023overview | VERIFICADA | mdpi.com/2076-3417/13/4/2582 | Metadatos coinciden. RSI 12/4 ms, EGM 4 ms con hasta 20 ms, DPM 8 ms y ~200 trabajos confirmados. |
| alvares2018retrofitting | VERIFICADA | link.springer.com (DOI 10.1007/s40430-018-1073-0) | Autores, revista, 40(3), art. 149, 2018 (en línea el 20/02/2018). El resumen habla de dos modelos de robots antiguos y de dos equipos (UFMG y UnB). No tiene métricas cuantitativas. |
| alasti2021turning | VERIFICADA | peer.asee.org/37941 y arXiv 2102.12649 (PDF) | Metadatos ASEE coinciden. Las cifras de la ficha son del preprint arXiv, no del artículo ASEE (ver "Afirmaciones"). |
| pontarolli2025analyzing | CORREGIDA | PDF en repositorio.unesp.br | **Volumen 13, págs. 167744–167755** (añadidos). Cifras de RTT, percentil 95, picos, 200 muestras e instrumentación confirmadas. |
| ogorodnyk2020towards | VERIFICADA | peerj.com/articles/cs-302 (HTML y PDF) | Autores en el orden del PDF. Cifras confirmadas salvo un matiz (ver "Afirmaciones"). |
| bravoarrabal2025iort | VERIFICADA | mdpi.com/1424-8220/25/16/4972 | Metadatos y ocho autores coinciden. Se resuelve el [POR VERIFICAR] de la ficha (ver "Afirmaciones"). |
| luu2025enhancing | CORREGIDA | link.springer.com (artículo completo, sección Author information) | **Lista completa: 7 autores** (Luu, Nguyen, Tran T., Tran M., Ding, Kua, Hoang); se quita "others". Vol. 139(11), 6233–6257, 2025. Dos cifras de la ficha no se encuentran o no coinciden (ver "Afirmaciones"). La ficha avisa de una colisión de clave con otra línea. |
| singh2024unity | VERIFICADA | mdpi.com/1424-8220/24/17/5680 | Metadatos y todas las cifras confirmados (77,67 ± 15,74 ms; 99,99 % y 99,91 %; >5000 puntos; 3 × 8 h). |
| chang2025construction | VERIFICADA | mdpi.com/1424-8220/25/13/4153 | Metadatos coinciden. "±1 mm mayoritariamente" y 125 Hz confirmados. No se da latencia extremo a extremo. |
| zhang2024construction | VERIFICADA | mdpi.com/1424-8220/24/22/7183 | Metadatos y todas las cifras confirmados. |
| hacesgarcia2024building | VERIFICADA | mdpi.com/2073-431X/13/11/282 | Metadatos y cifras confirmados (100 ms con PUN, 5 usuarios durante 2 h, 10–50 Hz, 0,1–0,4 % de CPU). No hay latencias numéricas. |
| liang2020bidirectional | VERIFICADA | iaarc.org (actas ISARC 2020) y PDF en par.nsf.gov | Metadatos coinciden. Hay un error en el rango de máximos de la ficha (ver "Afirmaciones"). |
| profanter2019opcua | VERIFICADA | Crossref (10.1109/ICIT.2019.8755050) y PDF en mediatum.ub.tum.de | Metadatos y cifras de RTT confirmados (tabla III). Matiz menor en la carga de red. |
| ariascachero2023operational | VERIFICADA (con DOI pendiente) | Manuscrito aceptado en vbn.aau.dk (PDF, CC BY 4.0) | Título, 6 autores en orden, ICAR 2023 y artículo IEEE 10406936 confirmados. **No se pudo confirmar el DOI ni las páginas**: IEEE Xplore no apareció en las búsquedas, y DBLP y el repositorio de Uniovi bloquean con Anubis. **No se añade DOI** (no se completa de memoria). Las cifras de la ficha están confirmadas. |
| bray2024latency | VERIFICADA | mdpi.com/1999-5903/16/12/457 | Metadatos y cifras confirmados. 240,7 ms es la cifra del resumen; la tabla 4 da 240,769 ms. |
| xiang2024development | VERIFICADA (preprint) | arxiv.org/html/2410.14934 y búsquedas en el portal de XJTLU | Autores y afiliaciones coinciden. **No se ha localizado ninguna versión publicada** (el portal de XJTLU redirige a un dominio no accesible; ninguna búsqueda devuelve revista ni congreso). Es un preprint sin revisión por pares. Cifras confirmadas. |
| kuts2019digital | VERIFICADA | PDF en yadda.icm.edu.pl (BazTech) | Metadatos coinciden (págs. 128–145 impresas, aunque el fichero se llama "128-144"). Cifras confirmadas, "32,875 ms" incluido de forma literal. |
| azkarate2019virtual | CORREGIDA | Crossref (10.1109/ETFA.2019.8869373) y ebiltegia.mondragon.edu | **Tres autores**: Igor Azkarate Fernandez, Mikel Ayani Eguia y Luka Eciolaza Echeverria (Crossref). Se añade a Ayani y se usan los apellidos completos. |
| conchasanchez2020recycling | VERIFICADA | mdpi.com/1424-8220/20/6/1694 | Metadatos coinciden. ~1 s, 0,955 mm/píxel, 5 FPS, ~400 mm, ~230 USD y Colima confirmados. "3 TFG y talleres" no localizado en lo leído. |
| erdei2022digital | VERIFICADA | mdpi.com/2076-3417/12/17/8862 | Metadatos y cifras confirmados (15:49–31:32 min; 10 voluntarios de 19–25 años; SUS 3,6–5,0 en una escala poco habitual; sin pruebas estadísticas). |
| pang2022remote | VERIFICADA | online-journals.org (página del artículo y PDF) | **El orden de autores es correcto** (Pang, Cui, Yang). Vol. 17(21), 230–245. α = 0,966, KMO = 0,920 y los porcentajes, confirmados. La incoherencia 58/60 respuestas está en la propia fuente. |
| kaarlela2023digital | VERIFICADA | mdpi.com/2075-1702/11/1/13 | Metadatos coinciden (publicado en línea el 22/12/2022 en el vol. 11 de 2023). Validación funcional sin participantes, confirmada. |
| antonelli2023virtual | VERIFICADA | mdpi.com/2227-7102/13/5/528 | Metadatos y cifras confirmados (119 → 70; p de 0,14 a 0,96; α de 0,63 a 0,89; 25/16/13). |
| kumar2024scalable | CORREGIDA | Crossref (10.1007/978-981-96-3522-1_19) y arXiv 2412.15369v1 | **Versión publicada:** Social Robotics (ICSR + AI 2024, Odense), LNCS, Springer Nature Singapore, 2025, págs. 202–215, DOI 10.1007/978-981-96-3522-1_19. La entrada pasa de `@misc` a `@inproceedings` y se mantiene la clave. Cifras confirmadas, con matices. |
| ciungan2025enhancing | VERIFICADA | mdpi.com/2076-3417/15/19/10537 | Metadatos (13 autores) y estadísticos confirmados. |

## Afirmaciones o cifras no respaldadas

Las fichas no se han editado. Estos son los puntos que el autor de cada ficha (o la síntesis) debe corregir o matizar:

1. **luu2025enhancing — escalabilidad.** La ficha dice que "con 100 robots la latencia media supera 1 s (QoS0 1135 ms)". La página de Springer da, para la prueba de *throttle* con **QoS 1**, ~94,5 ms con 10 robots, 101,4 ms con 50 y **481,9 ms con 100**. No se encontró la cifra de 1135 ms ni ninguna latencia > 1 s con 100 robots. Hasta localizarla en una tabla, la cifra no está respaldada. El límite práctico de ~50 robots sí se confirma.
2. **luu2025enhancing — tasas en kbps.** Los 60 Hz y 250 Hz se confirman, pero **~46,8 kbps y ~131,2 kbps no aparecen** en el texto accesible. No usar sin comprobarlos.
3. **liang2020bidirectional — errores máximos.** El rango de máximos de la ficha (2,8·10⁻⁷ a 7,0·10⁻⁶ rad) está mal: 7,0·10⁻⁶ es el máximo de A5, y el máximo global es el de A3, **2,07·10⁻⁵ rad** (el texto dice "< 2,1·10⁻⁵ rad"). La incoherencia está en la tabla de la fuente: en **A3 y A6** el error medio es mayor que el máximo.
4. **bravoarrabal2025iort — RTT o latencia.** La fuente define latencia = RTT/2. Por tanto, los 58 ms (media), 43 ms (mínimo) y 318 ms (pico) son **latencias de un sentido**, y el ping de 116 ms es el RTT. La frase literal de la discusión es "The average RTT measured in these trials was below 60 ms" y contradice la definición del propio artículo. Al citarlo hay que decir "latencia de un sentido ≈58 ms (RTT ≈116 ms)" y no "RTT < 60 ms".
5. **ogorodnyk2020towards.** El rango 0,96–2,43 % de muestras con sobrecarga > 0,025 s vale solo para 100, 50 y 33 Hz. Incluyendo 2 Hz, el rango es de 0,00 % a 2,43 %.
6. **alasti2021turning.** La precisión de ~1 cm, el alcance de ~5 m, ThingSpeak, el MECA 500 y el AMAX 5580 salen del **preprint arXiv:2102.12649** (mismo autor), no del artículo ASEE. Se confirman en el preprint, pero no deben atribuirse a `[@alasti2021turning]`. Si se usan, el preprint necesita una entrada propia en el .bib.
7. **jokic2020two — costes.** Las cifras de ~35 k€ frente a 12 k€ y de 15 k€ frente a 1 k€ están en el artículo, pero los autores las toman de su referencia [22]. No son una medida propia del trabajo.
8. **kumar2024scalable.** "A hardware llegaron 14 y 38 equipos": en el Stack 2 se preseleccionaron 38 equipos, pero solo **36 recibieron acceso remoto**. La duración tampoco es coherente en la fuente (7 meses en el resumen y 6 en las contribuciones). El resto de cifras están confirmadas.
9. **kaarlela2023digital.** La fuente habla de *snap points* (puntos de ajuste predefinidos), no de "puntos de anclaje". Es un matiz de traducción.
10. **profanter2019opcua.** Con carga de red, OPC UA C/S da exactamente 875 µs: lo correcto es "≥ 875 µs", no "superan ~875 µs".
11. **kuts2019digital.** "32,875 ms" es literal en la fuente (≈ 32,9 s si la coma es separador de miles). Es probable que sea una errata de la fuente. No conviene usar esa cifra.
12. **conchasanchez2020recycling.** El uso docente con "3 TFG y talleres internos" no apareció en las partes leídas (hasta el 70 % del HTML). No está respaldado por ahora.
13. **ruiz2022caracterizacion.** La cifra "STM32 ~5 veces más rápido que Nano" está en el documento, pero sale de un vídeo de YouTube. Es una fuente débil y no conviene citarla como dato.
14. **barraza2016modelado.** El resumen habla de "parámetros reportados en literatura existente" sin nombrar a Bonilla et al. (2010). No se comprobó el texto completo. No es una contradicción, solo queda sin confirmar.
15. **Cifras no comprobadas** (solo se verificaron los metadatos): campos2019diseno (sensores recuperados y averiados) y sanchezlondono2023smart (indicadores). Ninguna de las dos se contradice.

## Acciones

1. **ariascachero2023operational:** obtener el DOI y las páginas desde IEEE Xplore (artículo 10406936) en un entorno con acceso y añadirlos. Hasta entonces se puede citar con la URL del manuscrito aceptado de AAU.
2. **xiang2024development:** citar como preprint sin revisión por pares. Mejor usarlo solo como apoyo y no como evidencia principal. Volver a buscar una versión publicada antes de enviar el artículo.
3. **ruiz2022caracterizacion y castillo2020propuesta:** son literatura gris (semillero y libro institucional sin ISBN ni revisión). Se pueden citar como antecedentes del mismo robot, indicando su naturaleza. RIAI puede objetar a su peso en el estado del arte.
4. **luu2025enhancing:** el investigador debe corregir la ficha (escalabilidad a 100 robots y kbps) y resolver el aviso de colisión de clave. No usar las cifras de 1135 ms ni de 46,8/131,2 kbps hasta localizarlas.
5. **liang2020bidirectional, bravoarrabal2025iort, ogorodnyk2020towards, kumar2024scalable, profanter2019opcua y kaarlela2023digital:** corregir en las fichas los matices de los puntos 3, 4, 5, 8, 9 y 10 antes de que pasen a `matriz.md` o `estado_del_arte.md`.
6. **alasti2021turning:** si se usan las cifras del preprint, crear una entrada propia (`alasti2021adapting`, arXiv:2102.12649, verificada en el PDF de arXiv) en `referencias/parciales/` para que la sesión principal la fusione.
7. **herrera2018simulador:** confirmar la forma del nombre del autor en el registro del repositorio TecNM (en la portada pone "Jonathan H. Aponte").
8. **kuts2019digital:** no usar la cifra de "32,875 ms".
9. Ninguna entrada debe retirarse por inexistencia. Cuando haya citas finales en `paper/`, repetir la verificación de las afirmaciones concretas que se atribuyan.

## Cambios aplicados en `refs.bib`

- luu2025enhancing: lista completa de autores (sin "others").
- kumar2024scalable: `@misc` → `@inproceedings`. Se añaden booktitle, series, publisher, address, year (2025), páginas 202–215 y DOI 10.1007/978-981-96-3522-1_19. Se mantienen la URL de arXiv y la clave.
- azkarate2019virtual: se añade a Mikel Ayani Eguia y se usan los apellidos completos según Crossref.
- pontarolli2025analyzing: volume = 13 y pages = 167744--167755.
- swider2007system: pages = 7--14.
- castillo2020propuesta: pages = 45--51.
- roldan2018enhancing: pages = 6 (página inicial).
- Todas las entradas tienen ahora `note = {verificacion: verificada|corregida; …}`. No se ha borrado ninguna entrada.

## Ronda 2 (25/11/2026)

- **Alcance:** las 8 entradas añadidas tras la revisión v1 (`note = {verificacion: pendiente}`) y las cifras de sus fichas en `investigacion/fichas/`.
- **Método:** las APIs bibliográficas devuelven 403. Cada título se buscó con WebSearch y se abrió con WebFetch la fuente que apareció. peer.asee.org, bohrium.com, scribd.com e iso.org/standard/86204 no se pudieron abrir (error del sitio, WAF o JavaScript). En esos casos se usaron las fuentes alternativas que indica la tabla.
- **Resultado:** 8 VERIFICADAS, 0 CORREGIDAS, 0 DUDOSAS, 0 NO ENCONTRADAS. No se cambió ningún metadato. Solo se actualizó el campo `note`.

| Clave | Estado | Comprobado en | Observaciones |
|---|---|---|---|
| kutzer2023scorbot | VERIFICADA | PDF en nemo.asee.org (papers/40592/download) y página de la sesión en NEMO (papers/40592/view) | Título exacto y 3 autores en el PDF (Kutzer, Donnal y Wick; Wick firma como "Carl E. Wick Sr."). La página de la sesión (MECH Technical Session 6) solo lista a Kutzer y Wick; se mantienen los 3 del PDF. ASEE 2023 confirmado. **No se localizó el DOI**, porque peer.asee.org no se pudo abrir, ni se confirmó "Baltimore, MD" en lo leído. Cifras de la ficha confirmadas: MTIS para MATLAB de 32 bits y DLL USBC de 32 bits; tabla 3 con 128 funciones, 16 scripts y 18 986 líneas frente a 846 de MTIS; curso Introduction to Robotics, otoño de 2020; número de alumnos no indicado; "translate directly" en §2.3; RJ11 y SCORBASE. Matices en "Afirmaciones (ronda 2)". |
| holmes2025retrofitting | VERIFICADA | sciencedirect.com (pii S2213846325001865) y cita [38] en arXiv 2601.10929 | Autores, título, Manufacturing Letters 44 (Supplement), 1337–1348, 2025 (en línea el 02/09/2025) y DOI coinciden. Cifras confirmadas: 8,3 % y 15,4 % de fallos; 13,9 % del tiempo del bucle, repartido al 50 % entre caídas de OPC XML-DA y errores de invocación de métodos; unos 7 ciclos; 12 ms como periodo de RSI (no es una medida); Raspberry Pi 5 y KUKA.OPC Server en ambas controladoras. Un matiz sobre la KRC2 en "Afirmaciones (ronda 2)". |
| kumar2011virtual | VERIFICADA | Copia en academia.edu (91708949) | Autores, título, RCIM vol. 27, 994–1000, 2011 y DOI coinciden. **El número no figura en la copia** y no se añade. ScienceDirect y Scribd no se pudieron abrir. Contenido de la ficha confirmado: botones GET, GRASP, PLACE y RELEASE que no tiene el teach box real; trayectorias recta y circular; pick-and-place; "common system" simulación/real y dinámica como trabajo futuro; el usuario da el roll de la muñeca. |
| oasis2014mqtt | VERIFICADA | docs.oasis-open.org (mqtt-v3.1.1.html) y oasis-open.org/?p=4424 | Editores: Andrew Banks y Rahul Gupta (IBM). Norma OASIS del 29/10/2014: la votación se cerró ese día y la aprobación se anunció el 30/10/2014. **La URL del .bib sirve la edición Plus Errata 01 (10/12/2015)**, como ya indica `howpublished`. Contenido de la ficha confirmado: §3.1.2.5 (desencadenantes de la Will), §3.3.1.1 (DUP; quien recibe no puede suponer que ya lo vio), §3.3.1.2 (QoS 1 "at least once") y §3.3.1.3 (RETAIN = 1/0). |
| oasis2019mqtt | VERIFICADA | docs.oasis-open.org (mqtt-v5.0.html; "This version" = os/mqtt-v5.0-os.html) | Editores Banks, Briggs, Borgendale y Gupta. Norma OASIS del 07/03/2019, sin errata posterior indicada. Contenido de la ficha confirmado: §3.3.2.3.3 (borrar la copia si vence antes de empezar a entregarla, enviar el intervalo reducido y sin propiedad no caduca); Will no publicada con DISCONNECT 0x00 ni si el cliente reconecta antes del Will Delay Interval. |
| iso2023sparkplug | VERIFICADA | committee.iso.org (ficha de catálogo 86204, versión en español) | ISO/IEC 20237:2023, "Information technology — Sparkplug® version 3.0", ed. 1, 18/10/2023, ISO/IEC JTC 1, 123 págs. El alcance coincide con la ficha. iso.org/standard/86204 no se pudo abrir. **No se ha leído el texto normativo**: lo que la ficha toma de Eclipse Kura (NDEATH, NBIRTH, bdSeq, STALE) no se comprobó en esta ronda y sigue siendo de fuente secundaria. |
| iso1998manipulating | VERIFICADA | committee.iso.org/standard/22244 | ISO 9283:1998, ed. 2, abril de 1998, ISO/TC 299. Sustituye a ISO 9283:1990 y a su Amd 1:1991. Revisada y confirmada en 2021. Hay un ciclo de revisión cerrado el 05/06/2026 sin resultado registrado; conviene volver a mirar el estado antes de enviar el artículo. Texto normativo no leído. |
| iso2025robotics | VERIFICADA | iso.org/standard/73933 | ISO 10218-1:2025, ed. 3, febrero de 2025, ISO/TC 299. El alcance (máquinas incompletas; la integración va en ISO 10218-2) coincide con la ficha. La ficha de catálogo no menciona dispositivos de habilitación ni teach pendants, como dice la ficha. Texto normativo no leído. |

### Afirmaciones o cifras no respaldadas (ronda 2)

1. **kutzer2023scorbot — "cuelgues".** La fuente habla de *crashes* de la DLL USBC al desconectar el pendant (cables RJ11 gastados). Sobre el desajuste tras actualizar SCORBASE, los autores dicen que **no saben si causó directamente los fallos** (sincronizar los ficheros lo resolvió). La ficha lo presenta como causa. Hay que matizarlo.
2. **kutzer2023scorbot — erratas de la fuente.** El texto da 372 funciones relacionadas, pero 128 + 243 = 371, y 26 292 líneas de comentarios, pero 10 216 + 16 082 = 26 298. Las cifras de la ficha (128 funciones, ~19 000 líneas) salen de la tabla 3 y son correctas. No hay que usar los totales del texto.
3. **holmes2025retrofitting — KRC2 en ambos robots.** El artículo nombra el KR10 y el KR16 y menciona "the age of the KRC2" al hablar de RSI. Lo leído no dice de forma explícita que **las dos** controladoras sean KRC2. Hasta confirmarlo, mejor escribir "controladoras KUKA KRC2 heredadas" sin precisar por robot o comprobarlo en el texto.
4. **iso2023sparkplug.** El número de secuencia `seq` y el resto de la mecánica de Sparkplug siguen [POR VERIFICAR] en el texto normativo, como ya indica la ficha.

### Acciones (ronda 2)

1. **kutzer2023scorbot:** buscar el DOI de ASEE PEER (formato 10.18260/1-2--NNNNN) y el lugar del congreso en un entorno donde peer.asee.org responda. Hasta entonces, citar con la URL. Corregir en la ficha los matices 1 y 2.
2. **kumar2011virtual:** si hace falta el número del volumen 27, sacarlo de ScienceDirect. No completarlo de memoria.
3. **holmes2025retrofitting:** confirmar en el texto que las dos controladoras son KRC2 o rebajar la frase de la ficha.
4. **Normas ISO (3):** se pueden citar solo para lo que dice la ficha de catálogo (existencia, título y alcance). No se puede atribuirles ningún requisito ni procedimiento concreto sin leer el texto.
5. **oasis2014mqtt:** si se citan secciones, hacerlo sobre la edición Plus Errata 01, que es la que sirve la URL.

### Cambios aplicados en `refs.bib` (ronda 2)

- Solo cambia el campo `note` de las 8 entradas: `pendiente` → `verificada`, indicando la fuente y lo que no se confirmó. No se modificó ningún otro metadato ni se borró ninguna entrada.
