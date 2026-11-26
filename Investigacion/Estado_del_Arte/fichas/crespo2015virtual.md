# Virtual Reality Application for Simulation and Off-line Programming of the Mitsubishi Movemaster RV-M1 Robot Integrated with the Oculus Rift to Improve Students Training

- **Clave:** crespo2015virtual
- **Referencia:** Crespo, R., García, R., Quiroz, S. (2015). Virtual Reality Application for Simulation and Off-line Programming of the Mitsubishi Movemaster RV-M1 Robot Integrated with the Oculus Rift to Improve Students Training. Procedia Computer Science, 75, 107–112 (2015 International Conference on Virtual and Augmented Reality in Education, VARE 2015).
- **DOI/URL:** https://doi.org/10.1016/j.procs.2015.12.226 (ScienceDirect S187705091503687X no abrió; metadatos y texto leídos en ResearchGate, https://www.researchgate.net/publication/290003698; resumen también en https://research.tec.mx/vivo-tec/display/AcademicArticleSCO_84964068311)
- **Tipo:** congreso publicado en revista (Procedia Computer Science, Elsevier, CC BY-NC-ND 4.0)
- **Leído:** texto completo (copia de ResearchGate)
- **Línea:** revision-v2 (antecedentes sobre el RV-M1)
- **Versión relacionada:** los mismos autores, "Virtual reality simulator for robotics learning", 2015 International Conference on Interactive Collaborative and Blended Learning (ICBL), pp. 61–65, doi:10.1109/ICBL.2015.7387635 (metadatos en search.isc.ac; resumen en research.tec.mx, AcademicArticleSCO_84963743789). Solo se leyó el resumen; describe el mismo simulador. No se añade a refs.bib.

## Problema que aborda
Reducir el tiempo de uso del robot físico y la curva de aprendizaje del RV-M1, y permitir enseñar automatización y robótica en universidades con poco o ningún equipo industrial.

## Solución / arquitectura
- Equipo o robot: Mitsubishi Movemaster RV-M1 (modelo 3D con los parámetros del robot real).
- ¿Mantiene la controladora original? sí (el robot se programa con su controladora; no se modifica).
- Comunicación / protocolo: **solo transferencia de ficheros**. Las secuencias articulares programadas con *joystick* se compilan en ficheros de "instrucciones" y "posiciones", según el manual, y se descargan al robot con el software Denford Robot Communications. No hay enlace en vivo, ni serie ni en red, entre la aplicación y el robot. No se nombra la sintaxis de órdenes (MJ, MP…).
- Gemelo digital: simulación (Unity + Oculus Rift) sin conexión al robot; programación fuera de línea; algoritmo A* para trayectorias sin colisión y comparación de la secuencia del usuario con la de A*; animaciones, imágenes y textos que sustituyen partes del manual impreso.
- Seguridad en la capa de comunicación: n. a.

## Evaluación
- Métricas medidas: prueba con un grupo de alumnos de ingeniería; los que no usaron el simulador procedieron por "prueba y error" y los que lo usaron terminaron antes. Sin tamaño de muestra, métricas ni estadística. La aplicación muestra los ángulos articulares y calcula el ángulo diferencial de cada eje para generar programas; no se informa de precisión ni de tiempos en el robot físico.
- Tamaño de la muestra / repeticiones: no indicado.

## Limitaciones (declaradas y observadas)
- Observadas: sin enlace con el robot ni lectura de su estado; evaluación docente anecdótica; no mide la discrepancia entre la simulación y el robot.

## Relación con nuestro trabajo
- Qué aprovechamos: otro antecedente de "simulación → robot real" **en el mismo robot**, con motivación docente (menos tiempo en el equipo físico, acceso sin equipo) y programación con los parámetros reales.
- En qué nos diferenciamos: su paso al robot es por fichero, fuera de línea; el nuestro emula la controladora detrás del mismo contrato de órdenes que el robot real, lee el estado del robot (modos `sombra` y `sincronizado`) y mide la coherencia y la fidelidad física. En la clasificación de Kritzinger es un modelo digital.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae (lectura en copia no oficial; paginación no anotada).

## Notas desde la línea revision-v4 (2026-11-25)
- El verificador (rondas 3 y 4) no ha podido leer el texto completo; los dos resúmenes accesibles (research.tec.mx y el registro ISC de la versión ICBL) **no mencionan Denford ni el número de alumnos**. Una nueva búsqueda del PDF en esta ronda tampoco lo encontró. Por tanto, hasta que alguien lea el PDF de ScienceDirect, en `estado_del_arte.md`, `huecos.md` y la matriz se escribe **solo lo del resumen**: modelo 3D con las especificaciones del robot real, *joystick* por articulación, secuencias guardadas en un fichero que se transfiere al robot real, A* y menos tiempo en el equipo físico; evaluación con alumnos de carácter cualitativo. Se retiran "software de Denford" y "sin tamaño de muestra" de los textos de síntesis. Lo anotado arriba en Solución y Evaluación (Denford, sin tamaño de muestra) queda como lectura no verificada de la copia de ResearchGate [POR VERIFICAR en el PDF].
