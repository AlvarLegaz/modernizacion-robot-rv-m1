# JRobot — Tool for Mitsubishi RVM1 robot (FICHA DE PISTA, NO CITABLE COMO LITERATURA)

- **Clave:** calderon2002jrobot (identificador interno; **sin entrada en `refs.bib`**)
- **Referencia (según las fuentes leídas):** Proyecto de software abierto en SourceForge, "JRobot - Tool for Mitsubishi RVM1 robot". Registrado el 2002-05-01; único fichero, jrobot.zip (749,8 kB), publicado el 2002-05-09; última actualización de la página 2012-08-15. Mantenedor en SourceForge: usuario "vecalciskay". Según la web del proyecto, primera versión de Michel Deriaz; vista virtual, cámara y *joystick* de Vladimir Calderón; biblioteca RVM1 del Vision Group de la Universidad de Ginebra (agradecimiento a Carlo Jelmini). Informe en francés de V. Calderón, curso "Cybernétique appliquée", 2002 (institución no nombrada en el informe).
- **DOI/URL:** https://sourceforge.net/projects/jrobot/ ; https://jrobot.sourceforge.net/home.htm ; documentación en https://jrobot.sourceforge.net/docs/index.htm (needed.htm, config.htm, report.pdf)
- **Tipo:** software abierto (BSD y GPLv2) con documentación informal; no revisado.
- **Leído:** página del proyecto, página de ficheros, web del proyecto (inicio, índice de documentación, needed.htm, config.htm) e informe report.pdf, mediante extracción resumida. **No se ha leído el código fuente**: está solo dentro de jrobot.zip, SourceForge no ofrece navegador de código (sin CVS/SVN/git enlazado) y en este entorno no hay herramienta para descargar y descomprimir el zip.
- **Línea:** revision-v4 (revisión v4, mayor 1 b: "emulador abierto")

## Qué hace (según lo leído)
- Aplicación Java (Swing) para manejar un RV-M1: editor de programas (escribir, guardar, cargar y ejecutar), ventana de salida, vista 3D virtual en Java3D ("modelada con precisión milimétrica" según la web), cámara local o remota por RTP y control con *joystick*.
- Conexión con el robot por puerto serie (javax.comm, COM2) o en remoto por un servidor de *sockets*.
- La biblioteca RVM1 de Ginebra crea un objeto robot que recibe órdenes RVM1, las encola, las sincroniza con el robot y "nunca se pierden"; admite conexión serie, una **conexión de prueba** ("test connection") y una conexión remota por *socket* (needed.htm). Qué hace la conexión de prueba no se explica.

## Lo que la tarea pedía comprobar
- **¿Emula la controladora o solo envía órdenes?** En lo leído, **envía órdenes** al robot. Ninguna fuente describe un intérprete de órdenes Movemaster en la vista virtual, ni que modele errores, tiempos, velocidad o límites. El informe describe la vista 3D como una escena Java3D con comportamientos que cambian las transformaciones de cada eslabón (lo que sugiere que se mueve por ángulos articulares) y no dice si los programas se pueden ejecutar sin robot. Sin leer el código, **no se puede descartar** que haya algo de simulación detrás de la "conexión de prueba" o de la vista virtual [POR VERIFICAR en el código].
- **¿Lee el estado?** No se describe la lectura de la posición ni del estado de error desde la controladora (ni `WH` ni `ER`). Los "errores" del informe son mensajes de la interfaz gráfica.
- **Órdenes concretas:** no se nombra ninguna (MJ, MP, WH, ER…).

## Evaluación
- Ninguna medida.

## Relación con nuestro trabajo
- Es un **software abierto para el RV-M1, con vista 3D "intended for simulation"**, publicado en 2002 y citado por swider2007offline. Aunque lo leído apunta a un cliente que envía órdenes con una visualización, **sin el código no se puede afirmar que no emule la controladora**. Por eso "abierto" **se retira como diferenciador** de A3 (revisión v4, mayor 1 b). El diferenciador que queda es la **medida** con protocolo declarado y su descomposición, no la apertura.
- No se cita como literatura (no es una publicación). Si el artículo lo menciona, como software (URL de SourceForge), solo para decir que existen herramientas abiertas para el RV-M1 con vista 3D.
- **Pendiente para Álvar (opcional):** descargar jrobot.zip en su equipo y buscar en el código si hay un intérprete de órdenes en la vista virtual o un modo de prueba que simule respuestas de la controladora.

## Citas textuales útiles
- Ninguna (no citable).
