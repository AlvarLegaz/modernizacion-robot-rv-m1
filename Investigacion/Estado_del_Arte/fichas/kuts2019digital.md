# Digital twin based synchronised control and simulation of the industrial robotic cell using virtual reality

- **Clave:** kuts2019digital
- **Referencia:** Kuts, V., Otto, T., Tähemaa, T., Bondarenko, Y. (2019). Digital twin based synchronised control and simulation of the industrial robotic cell using virtual reality. Journal of Machine Engineering, 19(1), 128–145.
- **DOI/URL:** https://doi.org/10.5604/01.3001.0013.0464 (PDF: https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-864b3bb2-f435-4a9e-af97-ab8b3470a8c8/c/11_KUTS_et_al._Digital_Twin_128-144.pdf)
- **Tipo:** revista
- **Leído:** texto completo
- **Línea:** educacion-gemelos

## Problema que aborda
Monitorizar y programar una celda robótica industrial real desde realidad virtual, con un gemelo que proteja al robot real y su entorno frente a colisiones.

## Solución / arquitectura
- Equipo o robot: Yaskawa Motoman GP8 con su banco de formación; HTC Vive; Unity3D + VRTK + Final IK.
- ¿Mantiene la controladora original? sí (se usa la API del fabricante en red local).
- Comunicación / protocolo: API propietaria del fabricante bajo NDA (código no publicado). ROS solo como trabajo relacionado; no MQTT ni OPC UA.
- Gemelo digital: sincronizado (lee ángulos articulares del robot real; los comandos desde VR van al robot y el gemelo se resincroniza). La comunicación bidireccional completa queda como trabajo futuro.
- Seguridad en la capa de comunicación: no indicado. Hay scripts de prevención de colisiones basados en el gemelo (seguridad funcional, no de red).

## Evaluación
- Métricas: reducción del modelo de >1 000 000 a ~80 000 caras; precisión de consigna articular 0,001°; objetivo 90 FPS (antes de multihilo <20 FPS); retardo medio entre comandos reportado literalmente como "32,875 ms" (confirmado como literal por la verificación; ≈ 32,9 s si la coma es separador de miles). Probable errata de la fuente: **no usar esta cifra**. Prevención de colisiones evaluada solo cualitativamente.
- Tamaño de la muestra / repeticiones: no indicado; uso diario en el laboratorio IVAR (TalTech) con estudiantes y valoración informal de un especialista.

## Limitaciones (declaradas y observadas)
API bajo NDA (no reproducible); evaluación cualitativa, sin estudio con usuarios ni medidas de latencia; un solo modelo de robot; hardware VR costoso y plugin de pago.

## Relación con nuestro trabajo
- Qué aprovechamos: patrón de gemelo "espejo" que lee el estado del robot real y lo usa para seguridad (detección de colisión antes de mover) y formación de no especialistas.
- En qué nos diferenciamos: robot moderno con API de red del fabricante; nosotros partimos de una controladora de los 80 con RS-232 y usamos protocolo abierto (MQTT), reproducible.

## Citas textuales útiles
No se extrae cita textual (no verificada la paginación exacta).

## Correcciones tras la verificación (2026-11-25, respuesta a la revisión v1)
- Origen: `Investigacion/Revisiones/verificacion_referencias.md`, punto 11 y acción 8. La cifra de "32,875 ms" se retira de la matriz y de la síntesis.
