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
- Gemelo digital: visualización sincronizada (el brazo real se mueve a la par que el modelo CAD; el usuario elige si manda el robot o el simulador al conectar).
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: ninguna cuantitativa (precisión, tiempos o latencia no medidos); pruebas cualitativas ("probado con éxito"); discrepancias menores con el manual.
- Tamaño de la muestra / repeticiones: no aplica.
- Velocidad y aceleración no implementadas porque el robot no las soporta así.

## Limitaciones (declaradas y observadas)
- Observadas: sin métricas; tecnologías hoy obsoletas (VB, HDML, Windows 2000); sin seguridad de red descrita.

## Relación con nuestro trabajo
- Qué aprovechamos: es el antecedente más cercano a nuestra idea (simulador sincronizado + red + controladora original vía serie) y su motivación docente (seguridad del alumno, desgaste, acceso remoto).
- En qué nos diferenciamos: debemos posicionarnos explícitamente frente a él: MQTT con contrato, Python abierto, gemelo con estado leído del robot, seguridades del pendant y, sobre todo, caracterización medida (latencia, fiabilidad, discrepancia gemelo-robot) que ellos no aportan.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae.
