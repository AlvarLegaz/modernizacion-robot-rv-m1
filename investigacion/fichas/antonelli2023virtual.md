# A Virtual Reality Laboratory for Blended Learning Education: Design, Implementation and Evaluation

- **Clave:** antonelli2023virtual
- **Referencia:** Antonelli, D., Christopoulos, A., Laakso, M.-J., Dagiene, V., Juškevičienė, A., Masiulionytė-Dagienė, V., Mądziel, M., Stadnicka, D., Stylios, C. (2023). A Virtual Reality Laboratory for Blended Learning Education: Design, Implementation and Evaluation. Education Sciences, 13(5), 528.
- **DOI/URL:** https://doi.org/10.3390/educsci13050528 (PDF abierto: https://iris.polito.it/bitstream/11583/2978678/1/education-13-00528.pdf)
- **Tipo:** revista
- **Leído:** texto completo
- **Línea:** educacion-gemelos

## Problema que aborda
Mantener y luego integrar en docencia mixta (blended) los talleres universitarios de robótica mediante un laboratorio VR (proyecto europeo JANUS), con acceso seguro y repetible a experimentos.

## Solución / arquitectura
- Equipo o robot: robots colaborativos de doble brazo en montaje (Politecnico di Torino); robot ABB en rectificado de llanta (Rzeszów), además de RobotStudio.
- ¿Mantiene la controladora original? sí.
- Comunicación / protocolo: emparejamiento en tiempo real con el puesto físico mediante MQTT; gemelos (robot, banco, pieza) en Unity 3D accesibles por navegador; integración con el LMS ViLLE (pre/post-test, analítica).
- Gemelo digital: visualización sincronizada vía MQTT, usada de forma asíncrona por el alumnado.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: pre/post-test de conocimientos sin diferencias significativas en ningún tema (p entre 0,14 y 0,96); disfrute, utilidad y motivación significativamente positivos; inmersión, realismo y dificultad neutros; sin efecto de género. Cuestionarios adaptados (Cronbach α 0,63–0,89).
- Tamaño de la muestra / repeticiones: Turín: 119 invitados → 70 analizados (40 H, 30 M). Datos de Rzeszów excluidos. Autoevaluaciones en VR demasiado escasas (25, 16, 13 envíos).

## Limitaciones (declaradas y observadas)
Sin comparación con taller convencional; aprendizaje medido indirectamente; acceso individual (sin colaborativo); abandono por voluntariedad; formación quizá demasiado corta. Se observan incoherencias de reporte en tablas (escalas y p-valores).

## Relación con nuestro trabajo
- Qué aprovechamos: precedente de gemelo web sincronizado por MQTT con evaluación docente formal; muestra que la evaluación pre/post puede no detectar ganancias, lo que conviene anticipar en el diseño.
- En qué nos diferenciamos: robots actuales; nuestro foco es la capa técnica sobre robot heredado y la evaluación técnica (latencia, fidelidad), con lo docente como uso secundario.

## Citas textuales útiles
No se extrae cita textual.
