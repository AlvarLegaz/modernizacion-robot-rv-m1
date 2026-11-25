# Digital Twin in manufacturing: A categorical literature review and classification

- **Clave:** kritzinger2018digital
- **Referencia:** Kritzinger, W., Karner, M., Traar, G., Henjes, J., Sihn, W. (2018). Digital Twin in manufacturing: A categorical literature review and classification. IFAC-PapersOnLine, 51(11), 1016–1022.
- **DOI/URL:** https://doi.org/10.1016/j.ifacol.2018.08.474 (metadatos y resumen leídos en el catálogo de la UTB, https://vufind-test.katalog.k.utb.cz/…, y en data.zhenzhi.com; publica.fraunhofer.de, bohrium.com, ScienceDirect y doi.org no accesibles desde este entorno)
- **Tipo:** congreso publicado en revista (IFAC-PapersOnLine, ISSN 2405-8963)
- **Leído:** **solo resumen y metadatos**. Las definiciones operativas de los tres niveles **no** se han leído en la fuente: se toman de su uso en barbie2024digital (§2, texto completo leído) y de la entrada de Wikipedia "Digital twin integration level", que coinciden. [POR VERIFICAR con el texto completo antes de citarlas literalmente.]
- **Línea:** revision-v2 (definición de gemelo, modelo y sombra digital)

## Problema que aborda
La literatura no comparte una definición de gemelo digital y cada disciplina usa el término de forma algo distinta. El trabajo revisa la literatura de gemelos en fabricación y la clasifica por nivel de integración.

## Solución / arquitectura
- Equipo o robot: n. a. (revisión).
- Clasificación (resumen): distingue tres niveles de integración, **modelo digital (DM)**, **sombra digital (DS)** y **gemelo digital (DT)**.
- Definiciones operativas (según barbie2024digital y Wikipedia; [POR VERIFICAR en la fuente]): en el modelo no hay flujo automático de datos entre el objeto físico y el digital; en la sombra el flujo es automático del físico al digital y manual en sentido contrario; en el gemelo es automático en los dos sentidos.
- Comunicación, gemelo, seguridad: n. a.

## Evaluación
- Resultado de la revisión (resumen): la literatura sobre el nivel más alto, el gemelo propiamente dicho, es escasa; hay bastante más sobre modelos y sombras.
- Tamaño de la muestra: no indicado en lo leído.

## Limitaciones (declaradas y observadas)
- Observadas: no se ha podido leer el texto completo; la clasificación es por flujo de datos y no dice nada de la frecuencia ni del retardo de ese flujo, que en nuestro caso es lo que limita la controladora.

## Relación con nuestro trabajo
- Qué aprovechamos: la **terminología** para nombrar los modos del gemelo (revisión v2, mayor 1): `emulador` = modelo digital (no hay flujo automático con el robot real); `sombra` y `sincronizado` = sombra digital (flujo automático real → gemelo por `posicion/mundo` y `actuadores`; el gemelo nunca publica en `rvm1/real/...`). Ningún modo es un gemelo en sentido estricto, porque el flujo gemelo → robot real no es automático: las órdenes al robot real las publica un usuario autorizado, no el modelo.
- En qué nos diferenciamos: no aplica; es una referencia de definición. Obliga a no llamar "gemelo sincronizado" a lo que es una sombra, y a usar "gemelo digital" en el artículo solo en sentido amplio y declarándolo.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- Del resumen: "literature concerning the highest development stage, the DT, is scarce" (resumen).
