# Development of a Novel Retrofit Framework Considering Industry 4.0 Concepts: A Case Study of a Modular Production System

- **Clave:** mendonca2025development
- **Referencia:** Mendonca, R. S., da Silva, M., Ayres Jr., F. A. C., Bessa, I. V., Medeiros, R. L. P. y Lucena Jr., V. F. (2025). Development of a Novel Retrofit Framework Considering Industry 4.0 Concepts: A Case Study of a Modular Production System. Processes, 13(1), 136.
- **DOI/URL:** https://doi.org/10.3390/pr13010136
- **Tipo:** revista
- **Leído:** texto completo (vía página del editor)
- **Línea:** retrofit-heredados

## Problema que aborda
Falta de un procedimiento sistemático para adaptar sistemas industriales heredados a los requisitos de Industria 4.0.

## Solución / arquitectura
Marco de retrofit en cinco pasos: recogida de requisitos, definición de objetivos, selección de componentes, integración y pruebas. Se apoya en una arquitectura de gemelo digital basada en RAMI 4.0 y evalúa la madurez con criterios RAMI.
- Equipo o robot: plataforma didáctica Festo MPS (módulos M1–M5). El módulo M4 (brazo robótico) estaba averiado (la controladora no inicializaba) y no se describe su retrofit.
- ¿Mantiene la controladora original? parcial / no claro: entre los objetivos figura sustituir controladores de módulo, y se instala un CPX-CEC-C1-V3 nuevo; no se aclara si los CPX-FEC originales se retiran.
- Comunicación / protocolo: CANopen (nuevo controlador), USB (EasyPort), OPC (EZOPC servidor, CIROS cliente), IEC 61131-3. No usa MQTT ni ROS.
- Gemelo digital: sincronizado solo en el módulo M1.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: niveles de madurez RAMI (escala 1–5) antes/después: automatización 3→4, integración 2→4, dispositivos inteligentes 1→3, análisis en tiempo real 1→4, flexibilidad 1→3. No hay métricas de prestaciones (latencia, tiempos de ciclo).
- Tamaño de la muestra: un caso.

## Limitaciones (declaradas y observadas)
- Observada: evaluación solo por autoevaluación de madurez; gemelo limitado a un módulo; el brazo robótico queda fuera.

## Relación con nuestro trabajo
- Qué aprovechamos: marco de 5 pasos y uso de RAMI 4.0 como referencia metodológica para estructurar nuestro retrofit; contexto educativo similar.
- En qué nos diferenciamos: conservamos la controladora original del robot, usamos MQTT y aportamos métricas medidas, no solo madurez.

## Citas textuales útiles
- "the digital twin was applied only in M1" (sección de resultados) [página no anotada].
