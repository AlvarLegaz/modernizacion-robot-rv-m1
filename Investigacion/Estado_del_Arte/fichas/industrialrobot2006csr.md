# CSR simulation sets new robot cycle time accuracy standard (nota de prensa técnica)

- **Clave:** industrialrobot2006csr
- **Referencia:** (sin firma) (2006). CSR simulation sets new robot cycle time accuracy standard. Industrial Robot: An International Journal, 33(1). Sin paginación indicada.
- **DOI/URL:** 10.1108/ir.2006.04933aab.001 — https://www.emerald.com/insight/content/doi/10.1108/ir.2006.04933aab.001/full/html
- **Tipo:** **literatura gris en revista**: Emerald la clasifica como "non article" (noticia); no es un artículo revisado por pares. Contacto y fuente de las declaraciones: Dr. Stewart Allinson, director de Applied Computing & Engineering (AC&E), la empresa que vende el producto.
- **Leído:** página completa del editor (HTML), mediante extracción resumida.
- **Línea:** revision-v4 (medidas publicadas de la coherencia entre controladora emulada y robot real; revisión v4, mayor 1)

## Problema que aborda
Promoción de la exactitud en tiempos de ciclo de un simulador comercial de robots.

## Solución / arquitectura
- Producto: CimStation Robotics (CSR), de AC&E, que usa la interfaz *Realistic Robot Simulation* (RRS), es decir, el software original de la controladora en el simulador.
- ¿Mantiene la controladora original? n. a. (simulación con controladora emulada por RRS).
- Gemelo digital: simulación con controladora emulada.

## Evaluación (según la nota; sin protocolo publicado)
- En pruebas de ABB en su fábrica de robots de Västerås (Suecia), CSR quedó "within 1.2 percent of the actual values" de los tiempos de ciclo.
- La nota afirma que AC&E logra una exactitud de al menos el 3 % de los tiempos de ciclo previstos, frente a una "norma del sector" del 5 %.
- Sin descripción de los programas, del número de ciclos, del robot ni de la métrica. El 1,2 % se presenta como resultado de ABB, pero la nota no recoge una declaración de ABB; el resto lo afirma el propio fabricante del software.

## Limitaciones
- Fuente de fabricante, sin revisión ni protocolo. Solo tiempos de ciclo (ni pose ni conducta). Se refiere a un emulador que **reutiliza el software original** (RRS).

## Relación con nuestro trabajo
- Qué aprovechamos: prueba de que **sí existen cifras publicadas** de la exactitud de controladoras emuladas, en tiempos de ciclo y del orden del 1–5 % (revisión v4, mayor 1 a). Se cita, si se cita, como **afirmación de un fabricante en prensa técnica**, nunca como resultado científico. Útil para una frase de la discusión que sitúe el orden de magnitud de nuestro error de tiempos (revisión v4, cambio 5).
- En qué nos diferenciamos: medida con protocolo declarado, de un emulador reconstruido desde el manual, que cubre pose, tiempos y conducta (órdenes, errores, ACK), no solo tiempo de ciclo.
- **Contraste no citado:** ABB (página de noticias "Closing the 'Sim-to-Real' gap", RobotStudio HyperReality, https://www.abb.com/global/en/news/134178; fecha no indicada en el texto) declara para su Virtual Controller, que ejecuta el mismo firmware que la controladora física, "~99% correlation between simulated and real robot behavior", sin método, métrica ni muestra. No se añade a refs.bib: la nota de 2006 basta como ejemplo y esta página no tiene fecha ni autor citables.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "within 1.2 percent of the actual values" (sin paginación) — atribuir a la nota, como afirmación comercial.
