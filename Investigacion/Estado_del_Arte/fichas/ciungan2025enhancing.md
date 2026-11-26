# Enhancing IoT Education Through Hybrid Robotic Arm Integration: A Quantitative and Qualitative Student Experience Study

- **Clave:** ciungan2025enhancing
- **Referencia:** Ciungan, D.-A., Mîș, E.-O., Rusu, D.-Ș., Bratosin, I.-A., Popovici, A.-F., Popovici, R., Goga, N., Goga, M., Pomană, L.-N., Bordea, C.-A., Popescu, B., Stan, A.-V., Neacșu, R.-F. (2025). Enhancing IoT Education Through Hybrid Robotic Arm Integration: A Quantitative and Qualitative Student Experience Study. Applied Sciences, 15(19), 10537.
- **DOI/URL:** https://doi.org/10.3390/app151910537
- **Tipo:** revista
- **Leído:** texto completo (parcial: discusión y conclusiones no leídas)
- **Línea:** educacion-gemelos

## Problema que aborda
Comparar el control de un brazo robótico desde VR frente al control por teclado en docencia de IoT, y la preferencia del alumnado entre modalidad presencial, online e híbrida.

## Solución / arquitectura
- Equipo o robot: brazo de 5 GDL impreso en 3D con servos (MG996R y uno de 35 kg), Arduino (PWM) + Raspberry Pi (conectividad, envía ángulos por serie).
- ¿Mantiene la controladora original? no aplica (robot didáctico propio).
- Comunicación / protocolo: MQTT (con TLS y usuario/contraseña) o WebSockets, seleccionable desde la app VR; Meta Quest 2 (Unity) → backend Python 3.11 en la nube → Raspberry Pi → Arduino (serie) → servos.
- Gemelo digital: visualización sincronizada en VR de los ángulos articulares (los autores reconocen que no es un laboratorio VR completo).
- Seguridad en la capa de comunicación: TLS y autenticación usuario/contraseña en MQTT.

## Evaluación
- Métricas: presencial > online-VR en beneficios percibidos (M = 4,51 vs. 4,13; t(30) = 3,10; p = 0,004; d = 0,56); sin diferencias teclado vs. VR en experiencia (p = 0,625) ni intuitividad (p = 0,831); facilidad de transición correlaciona con intuitividad VR (r = 0,801). Latencia no reportada en lo leído.
- Tamaño de la muestra / repeticiones: 31 alumnos de 3.º de ingeniería, un semestre; Likert 1–5 y 10 preguntas abiertas.

## Limitaciones (declaradas y observadas)
Muestra pequeña de un centro; datos autodeclarados; sin medida objetiva de aprendizaje ni de latencia; algunas incoherencias en tablas.

## Relación con nuestro trabajo
- Qué aprovechamos: arquitectura análoga (Raspberry Pi como pasarela serie ↔ MQTT seguro) y evidencia de que el alumnado valora el hardware real frente a lo solo virtual.
- En qué nos diferenciamos: brazo de servos de hobby frente a robot industrial heredado con controladora original; nosotros medimos la capa técnica.

## Citas textuales útiles
No se extrae cita textual.
