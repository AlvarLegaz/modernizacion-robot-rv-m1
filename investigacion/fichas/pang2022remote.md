# Remote Laboratory as an Educational Tool in Robotics Experimental Course

- **Clave:** pang2022remote
- **Referencia:** Pang, D., Cui, S., Yang, G. (2022). Remote Laboratory as an Educational Tool in Robotics Experimental Course. International Journal of Emerging Technologies in Learning (iJET), 17(21), 230–245. [POR VERIFICAR orden de autores: los metadatos de la página solo listan a G. Yang]
- **DOI/URL:** https://doi.org/10.3991/ijet.v17i21.33791 (https://online-journals.org/index.php/i-jet/article/view/33791)
- **Tipo:** revista
- **Leído:** texto completo
- **Línea:** educacion-gemelos

## Problema que aborda
Pérdida de prácticas presenciales de robótica durante la COVID-19; se busca que el alumnado diseñe y depure programas de robot desde casa como en el laboratorio.

## Solución / arquitectura
- Equipo o robot: ABB IRB120, programado con RobotStudio.
- ¿Mantiene la controladora original? sí.
- Comunicación / protocolo: OPC UA para sincronizar robot virtual y físico; cliente Unity3D-WebGL en navegador; peticiones HTTP/JSON a servidor Apache Tomcat 6.0 con MySQL 5.6 que almacena datos del robot; cámara y micrófono. Sin MQTT.
- Gemelo digital: sincronizado (posiciones articulares virtuales y reales coinciden vía OPC UA); diseño instruccional ADDIE.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: cuestionario de 10 ítems (escala de 5 niveles de satisfacción); >80 % satisfechos en los 10 indicadores; >90 % dicen que estimula el interés; >85 % que ayuda a adquirir conocimientos; ~90 % apoyan que se siga usando; 85 % satisfechos con ADDIE; >13 % insatisfechos con la parte práctica. Cronbach α = 0,966; KMO = 0,920.
- Tamaño de la muestra / repeticiones: 64 alumnos de 3.º (Ingeniería mecánica y electrónica, curso de Robótica Industrial 2022), trabajo por parejas; 58 respuestas según el resumen y 60 según la sección 4.2 (incoherencia).

## Limitaciones (declaradas y observadas)
Los autores declaran que no soporta prácticas de mantenimiento mecánico/eléctrico y que el laboratorio remoto es más caro que uno virtual. Observadas: solo satisfacción autodeclarada, sin grupo de control ni medida objetiva; no trata latencia, seguridad ni escalabilidad.

## Relación con nuestro trabajo
- Qué aprovechamos: arquitectura de referencia gemelo web + robot real sincronizado para laboratorio remoto; instrumento de encuesta con fiabilidad reportada.
- En qué nos diferenciamos: OPC UA sobre controladora moderna frente a MQTT sobre RS-232 de una controladora heredada; nosotros sí tratamos seguridad y latencia de la capa de comunicación.

## Citas textuales útiles
"the remote lab does not support mechanical and electrical maintenance experiments" [POR VERIFICAR página].
