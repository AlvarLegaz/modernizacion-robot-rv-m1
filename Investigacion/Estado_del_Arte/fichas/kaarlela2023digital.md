# Digital Twins Utilizing XR-Technology as Robotic Training Tools

- **Clave:** kaarlela2023digital
- **Referencia:** Kaarlela, T., Padrao, P., Pitkäaho, T., Pieskä, S., Bobadilla, L. (2023). Digital Twins Utilizing XR-Technology as Robotic Training Tools. Machines, 11(1), 13.
- **DOI/URL:** https://doi.org/10.3390/machines11010013
- **Tipo:** revista
- **Leído:** texto completo
- **Línea:** educacion-gemelos

## Problema que aborda
La formación de operadores de robots necesita elementos interactivos del mundo real; se proponen entornos virtuales con gemelos digitales y XR para formación y para formación en seguridad.

## Solución / arquitectura
- Equipo o robot: cobot Universal Robots con pinza (pick-and-place en virtualidad aumentada); celda educativa Fanuc (AR y control táctil); ABB IRB6700 en celda con vallas, cortinas de luz y escáneres láser (formación en seguridad en VR).
- ¿Mantiene la controladora original? sí.
- Comunicación / protocolo: MQTT como protocolo principal bidireccional entre gemelo físico y digital; WebSocket entre broker y aplicación web; OPC UA hacia el hardware con puente OPC UA→MQTT propio (Fanuc) y ABB IoT Data Gateway; WebRTC para vídeo.
- Gemelo digital: sincronizado bidireccional (Unity3D con IK), con tres niveles seleccionables por el alumno: modelo digital, sombra y gemelo. Las trayectorias se validan en el gemelo antes de enviarse al robot real.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: solo validación funcional por los autores en HTC Vive, Oculus Quest, tableta iOS y móvil Android; problemas detectados y corregidos (mapeo de botones, retardo en el jogging, imprecisión táctil resuelta con *snap points* (puntos de ajuste predefinidos; corregida la traducción anterior "puntos de anclaje"), y que al disparar seguridades virtuales se paraba el robot real; se cambió para que solo pare el gemelo).
- Tamaño de la muestra / repeticiones: sin participantes; sin encuestas.

## Limitaciones (declaradas y observadas)
Beneficio formativo no medido; retardos de transferencia degradan el jogging; un solo usuario (multiusuario como trabajo futuro); extensiones acuáticas/metaverso solo planificadas.

## Relación con nuestro trabajo
- Qué aprovechamos: es la referencia más cercana en arquitectura (MQTT + WebSocket + puente de protocolo hacia la controladora) y en la idea de niveles modelo/sombra/gemelo y validación previa en el gemelo; útil para justificar el puente RS-232→MQTT como análogo al puente OPC UA→MQTT.
- En qué nos diferenciamos: robots modernos con OPC UA nativo o pasarela del fabricante; nosotros puenteamos RS-232 de una controladora de los 80 y medimos latencia/seguridad.

## Citas textuales útiles
No se extrae cita textual.

## Correcciones tras la verificación (2026-11-25, respuesta a la revisión v1)
- Origen: `Investigacion/Revisiones/verificacion_referencias.md`, punto 9. Matiz de traducción (*snap points*).
