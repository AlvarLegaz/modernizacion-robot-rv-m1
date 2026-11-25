# Digital Twin in manufacturing: A categorical literature review and classification

- **Clave:** kritzinger2018digital
- **Referencia:** Kritzinger, W., Karner, M., Traar, G., Henjes, J., Sihn, W. (2018). Digital Twin in manufacturing: A categorical literature review and classification. IFAC-PapersOnLine, 51(11), 1016–1022.
- **DOI/URL:** https://doi.org/10.1016/j.ifacol.2018.08.474 (metadatos y resumen leídos en el catálogo de la UTB, https://vufind-test.katalog.k.utb.cz/…, y en data.zhenzhi.com; publica.fraunhofer.de, bohrium.com, ScienceDirect y doi.org no accesibles desde este entorno)
- **Tipo:** congreso publicado en revista (IFAC-PapersOnLine, ISSN 2405-8963)
- **Leído:** **solo resumen y metadatos**. El texto completo no se ha podido leer (tampoco el verificador, ronda 3). Fuente de contraste no citable: la entrada de Wikipedia "Digital twin integration level" (solo para contrastar, nunca como fuente).
- **Línea:** revision-v2 (definición de gemelo, modelo y sombra digital); corregida en revision-v3

## Problema que aborda
La literatura no comparte una definición de gemelo digital y cada disciplina usa el término de forma algo distinta. El trabajo revisa la literatura de gemelos en fabricación y la clasifica por nivel de integración.

## Solución / arquitectura
- Equipo o robot: n. a. (revisión).
- Clasificación (resumen, **lo único atribuible a esta clave**): distingue tres niveles de integración, **modelo digital (DM)**, **sombra digital (DS)** y **gemelo digital (DT)**.
- Criterio operativo de los niveles: **no se atribuye a esta clave**. Se cita con barbie2024digital (§2, texto verificado por `verificador-referencias`, ronda 3): sin intercambio automático de datos (modelo), flujo automático en un sentido, del objeto físico al modelo (sombra), flujo automático en los dos sentidos (gemelo). Barbie et al. no dicen nada del flujo en sentido contrario en la sombra, así que esta ficha tampoco lo dice.
- Comunicación, gemelo, seguridad: n. a.

## Evaluación
- Resultado de la revisión (resumen): la literatura sobre el nivel más alto, el gemelo propiamente dicho, es escasa; hay más sobre modelos y sombras.
- Tamaño de la muestra: no indicado en lo leído.

## Limitaciones (declaradas y observadas)
- Observadas: no se ha podido leer el texto completo. La clasificación, tal como la describe barbie2024digital, es por flujo de datos y no dice nada de la frecuencia ni del retardo de ese flujo, que en nuestro caso es lo que limita la controladora.

## Relación con nuestro trabajo
- Qué aprovechamos: la **terminología** (modelo, sombra, gemelo) para nombrar los modos en métodos; no es una aportación. Con el criterio de barbie2024digital: `emulador` = modelo digital; `sombra` y `sincronizado` = sombra digital (flujo automático real → gemelo por `posicion/mundo` y `actuadores`).
- Por qué no es un gemelo en sentido estricto: **el modelo nunca publica estado ni órdenes en `rvm1/real/...`**. Las órdenes al robot real las da una persona autorizada (`profesor`), también desde el pendant integrado en la aplicación del gemelo con destino REAL (`gemelo/README.md`); eso es una acción manual, no un flujo automático del modelo al robot.
- En qué nos diferenciamos: no aplica; es una referencia de terminología. Obliga a no llamar "gemelo sincronizado" a lo que es una sombra y a usar "gemelo digital" solo en sentido amplio y declarándolo.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- Ninguna literal: la frase del resumen registrada antes no se ha podido comprobar literalmente (verificador, ronda 3). Usar solo paráfrasis: "la literatura sobre el gemelo en sentido estricto es escasa".
