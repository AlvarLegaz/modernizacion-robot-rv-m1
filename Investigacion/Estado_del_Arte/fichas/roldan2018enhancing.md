# Fortaleciendo las prácticas de laboratorio en Robótica educacional para el manipulador Mitsubishi RV-M1 usando dSpace y arquitectura abierta

- **Clave:** roldan2018enhancing
- **Referencia:** Roldán Mckinley, J., Yime Rodríguez, E., Sosa Rodríguez, J. (2018). Fortaleciendo las prácticas de laboratorio en Robótica educacional para el manipulador Mitsubishi RV-M1 usando dSpace y arquitectura abierta (Enhancing educational Robotics lab practices for the Mitsubishi RV-M1 manipulator using dSpace and open architecture). Revista ESPACIOS, 39(35), artículo 06 [POR VERIFICAR: numeración de páginas].
- **DOI/URL:** https://www.revistaespacios.com/a18v39n35/a18v39n35p06.pdf (HTML: https://revistaespacios.com/a18v39n35/18393506.html). Sin DOI.
- **Tipo:** revista
- **Leído:** texto completo (PDF)
- **Línea:** rvm1-similares

## Problema que aborda
La controladora original del RV-M1 es de arquitectura cerrada ("caja negra") y solo permite control punto a punto en articulaciones, lo que impide enseñar y probar leyes de control no lineales en el laboratorio (Universidad del Atlántico, Colombia).

## Solución / arquitectura
- Equipo o robot: Mitsubishi Movemaster RV-M1 (5 GDL, 5 servomotores DC, 1,2 kg de carga).
- ¿Mantiene la controladora original? no. Se sustituye por una tarjeta dSPACE DS1103 con MATLAB/Simulink, cinco tarjetas servoamplificadoras analógicas de diseño propio (±10 V → PWM con LM555 + puente H, 12–24 V, hasta 3 A), caja adaptadora de señales (Centronics-36 a 5 DB15HD, con finales de carrera para homing) y tarjeta de sincronización de frenos (optoacoplada) para hombro y brazo.
- Comunicación / protocolo: E/S analógicas/digitales de la DS1103 (no hay red ni RS-232).
- Gemelo digital: no (hay simulación del modelo dinámico en Simulink para comparar con el robot real).
- Seguridad en la capa de comunicación: no indicado.
- Control: PD con compensación de gravedad en posición de herramienta (KP = diag[30, 28, 20, 20, 4]·1000; KD = diag[3, 5, 7, 5, 3]·100).

## Evaluación
- Métricas: error de posición en régimen permanente del robot real dentro de 0,3 mm en una trayectoria tipo pintado de superficie esférica. No se describe cómo se midió la posición real.
- Tamaño de la muestra / repeticiones: no indicado (una trayectoria, una ley de control).

## Limitaciones (declaradas y observadas)
- Declaradas: la compensación de gravedad supone parámetros dinámicos exactos que pueden haber cambiado por envejecimiento; fricción y desgaste aumentan el error; ganancias por afinar.
- Observadas: no se describe el sensado de posición/encoders; una sola prueba sin repeticiones ni estadística; método de medida del error no documentado. Intervención invasiva (se desconecta la D/U-M1).

## Relación con nuestro trabajo
- Qué aprovechamos: es el antecedente más directo sobre el RV-M1 con uso docente; su revisión bibliográfica recoge la literatura previa del RV-M1 (Świder, Foit, Kumar, Barraza, Roldán 2012). Confirma el interés docente del robot.
- En qué nos diferenciamos: nosotros mantenemos la controladora original y añadimos capas (Python, MQTT, gemelo) sin tocar el hardware; ellos abren el lazo de control a costa de eliminar la controladora y requerir dSPACE (coste alto).

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae cita literal [POR VERIFICAR página].
