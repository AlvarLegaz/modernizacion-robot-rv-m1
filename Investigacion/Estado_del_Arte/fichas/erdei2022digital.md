# Design of a Digital Twin Training Centre for an Industrial Robot Arm

- **Clave:** erdei2022digital
- **Referencia:** Erdei, T. I., Krakó, R., Husi, G. (2022). Design of a Digital Twin Training Centre for an Industrial Robot Arm. Applied Sciences, 12(17), 8862.
- **DOI/URL:** https://doi.org/10.3390/app12178862
- **Tipo:** revista
- **Leído:** texto completo (las tablas 1 y 2 con tiempos por equipo no se pudieron leer)
- **Línea:** educacion-gemelos

## Problema que aborda
Formar operadores de robot industrial con menos coste y más alumnos en paralelo, dado que la celda física solo admite ~8 alumnos a la vez.

## Solución / arquitectura
- Equipo o robot: KUKA KR5 (6 ejes) con celda propia, pinza, cinta y mesa; teach pendant replicado (HMI) en Unreal Engine 4 (UMG, Control Rig con IK); modelado en Blender. Movimientos PTP, LIN y CIRC y programación por el usuario.
- ¿Mantiene la controladora original? sí (el gemelo no se conecta a ella).
- Comunicación / protocolo: ninguno; los autores indican que no hay canal de comunicación entre objetos virtuales y físicos.
- Gemelo digital: visualización/simulación fuera de línea (réplica sin sincronización), pese al nombre.
- Seguridad en la capa de comunicación: no aplica.

## Evaluación
- Métricas: tiempo de ejecución de una tarea (trayectoria LIN en triángulo + CIRC en círculo) en el KUKA real, desde que reciben el pendant hasta volver a home: rango 15:49–31:32 min; según el texto el equipo que entrenó con el gemelo fue más rápido y se sintió mejor preparado. Encuesta Google Forms (1–5) y SUS (puntuaciones 3,6–5,0).
- Tamaño de la muestra / repeticiones: 10 voluntarios (2 equipos de 5: virtual vs. material tradicional), 19–25 años; sin pruebas estadísticas.

## Limitaciones (declaradas y observadas)
Sin percepción física de peso/espacio ("falsa sensación de seguridad"); no simula la posición intermedia del pulsador de hombre muerto; teclado y ratón en lugar de VR; sin tutorial integrado; muestra muy pequeña.

## Relación con nuestro trabajo
- Qué aprovechamos: es el antecedente más cercano a "teach pendant virtual + gemelo para entrenar antes del robot real", con un diseño experimental simple (grupo gemelo vs. grupo tradicional, tiempo de tarea en el robot real) que podríamos replicar.
- En qué nos diferenciamos: nuestro gemelo y pendant están conectados (MQTT) al robot real y el mismo pendant sirve para el gemelo y para el robot; robot heredado de los 80.

## Citas textuales útiles
"no communication channel between the virtual objects and the physical components" [POR VERIFICAR página].
