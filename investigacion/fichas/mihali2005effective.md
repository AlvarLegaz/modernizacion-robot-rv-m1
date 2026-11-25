# Effective Simulation and Control Approaches for Alleviating the Access to High-Cost Manipulators

- **Clave:** mihali2005effective
- **Referencia:** Mihali, R., Sobh, T. (2005). Effective Simulation and Control Approaches for Alleviating the Access to High-Cost Manipulators. Journal of STEM Education, 6(3–4), 21–28.
- **DOI/URL:** https://jstem.org/jstem/index.php/JSTEM/article/view/1280 (sin DOI localizado)
- **Tipo:** revista
- **Leído:** texto completo (PDF de la revista)
- **Línea:** rvm1-similares
- **Nota:** existe una versión previa en congreso: Mihali, R., Sobh, T. "Ergonomic and Efficient Software Alternatives for High Cost Manipulators – Direct, Wireless and Networked Control Techniques", IETA 2001, El Cairo (IEEE); texto en https://core.ac.uk/download/52956188.pdf. DOI no localizado [POR VERIFICAR].

## Problema que aborda
El coste, la seguridad y el mal uso de manipuladores industriales en universidades limitan su uso por los alumnos; las herramientas de simulación comerciales no cubren modelos concretos.

## Solución / arquitectura
- Equipo o robot: Mitsubishi RV-M1 (Movemaster EX).
- Software: simulador 3D (OpenGL en Visual Basic) con cinemática directa e inversa geométrica (avisos de singularidad o fuera de alcance), trayectorias (Lagrange, Bézier, B-spline, Hermite, etc.), cámara opcional.
- ¿Mantiene la controladora original? sí (conexión por puerto serie a la controladora).
- Comunicación / protocolo: serie (RS-232) con opción TEST de conexión; TCP/IP entre simuladores en cadena cliente/servidor (se envían ángulos articulares); control desde móvil por página HDML.
- Gemelo digital: visualización en paralelo, en lazo abierto (el brazo real se mueve a la par que el modelo CAD porque ambos ejecutan las mismas órdenes; el usuario elige si manda el robot o el simulador al conectar). No se recoge lectura del estado del robot [POR VERIFICAR releyendo el PDF]. Clasificación corregida en las rondas revision-v2 y revision-v3; ver notas al final.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: ninguna cuantitativa (precisión, tiempos o latencia no medidos); pruebas cualitativas ("probado con éxito"); discrepancias menores con el manual.
- Tamaño de la muestra / repeticiones: no aplica.
- Velocidad y aceleración no implementadas porque el robot no las soporta así.

## Limitaciones (declaradas y observadas)
- Observadas: sin métricas; tecnologías hoy obsoletas (VB, HDML, Windows 2000); sin seguridad de red descrita.

## Relación con nuestro trabajo
- Qué aprovechamos: es un antecedente cercano (simulador que se ejecuta en paralelo con el robot, en lazo abierto, + red + controladora original vía serie) y su motivación docente (seguridad del alumno, desgaste, acceso remoto).
- En qué nos diferenciamos: debemos posicionarnos explícitamente frente a él: MQTT con contrato, Python abierto, gemelo con estado leído del robot, seguridades del pendant y, sobre todo, caracterización medida (latencia, fiabilidad, discrepancia gemelo-robot) que ellos no aportan.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae.

## Notas desde la línea revision-v2 (2026-11-25)
- Revisión v2, menor N8. Lo que recoge esta ficha es que el brazo "se mueve a la par" que el modelo y que el usuario elige al conectar si manda el robot o el simulador; **no recoge que el simulador lea el estado del robot** (posición o error). Por tanto, la sincronía descrita es en lazo abierto: el modelo y el robot ejecutan las mismas órdenes. Es una inferencia a partir de lo fichado, no una afirmación de la fuente [POR VERIFICAR releyendo el PDF].
- En la terminología de Kritzinger (criterio del flujo de datos según barbie2024digital) sería un **modelo digital** que se ejecuta en paralelo, no una sombra. Por eso se excluye de forma explícita de la afirmación "los gemelos sincronizados revisados se alimentan de estado continuo" y se reclasifica en la matriz como "visualización en paralelo (lazo abierto)".

## Notas desde la línea revision-v3 (2026-11-25)
- Revisión v3, menor N3-4: se corrigen en el cuerpo de la ficha las dos líneas que conservaban la clasificación antigua ("Gemelo digital" en Solución y "Qué aprovechamos"). Ya no queda "visualización sincronizada" ni "simulador sincronizado" en la ficha.
