# Konzeption und Realisierung eines integrierten Moduls zur Simulation und Steuerung von Kinematiksystemen

- **Clave:** keibel2002konzeption
- **Referencia:** Keibel, A. (2002). Konzeption und Realisierung eines integrierten Moduls zur Simulation und Steuerung von Kinematiksystemen. Tesis doctoral, Fakultät für Elektrotechnik und Informationstechnik, Universität Dortmund. [POR VERIFICAR el año de catálogo: el documento indica 2002 y defensa oral el 23/04/2003]
- **DOI/URL:** sin DOI. https://eldorado.tu-dortmund.de/bitstream/2003/2823/1/Keibelunt.pdf (repositorio Eldorado de la TU Dortmund)
- **Tipo:** tesis (doctoral; director E. Freund)
- **Leído:** texto completo en cuatro bloques (índice, cap. 5, cap. 6, cap. 8–9 y bibliografía), mediante extracción resumida; no literal en todas las partes.
- **Línea:** revision-v3 (controladoras virtuales, R/VRC, COSIMIR, RRS)

## Problema que aborda
Diseñar un módulo universal y escalable de control de robots que funcione igual como **controladora virtual** (VRC) dentro de un simulador gráfico y como **controladora real** (R/VRC) de un robot físico, dentro del entorno COSIMIR ("Cell Oriented SImulation of Industrial Robots") del Institut für Roboterforschung de Dortmund.

## Solución / arquitectura
- Equipo o robot: módulo genérico; robots reales acoplados: un Manutec r2 modificado (enlace Transputer) y un Reis RV16L (cap. 8, pp. 144 y 148).
- ¿Mantiene la controladora original? no en los robots reales acoplados: la R/VRC **es** la controladora. En simulación, el objetivo es que la controladora simulada se pueda **intercambiar por una de tiempo real sin cambiar el sistema de simulación** (cap. 5.1, p. 44).
- Comunicación / protocolo: en modo VRC, el simulador llama a la controladora y cada llamada ejecuta un ciclo de control (p. 43); en modo real, la controladora corre de forma asíncrona y guarda los cambios hasta la siguiente llamada (p. 44). Referencia la interfaz RRS (1992–1993) y la especificación VRC de RRS-II (proyecto desde 1998, dirigido por Fraunhofer IPK).
- Lenguajes: intérprete IRDATA que cubre casi toda la norma; IRL como ejemplo. Menciona detalles de MELFA BASIC (eventos, contador de vueltas) y el Mitsubishi RV-2AJ (cap. 5.3). **No** menciona el RV-M1, el Movemaster ni su lenguaje MRL.
- Mezcla de componentes simulados y reales en la misma celda (cap. 5.3.8, p. 55).
- Gemelo digital: modelo con controladora emulada intercambiable por la real.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas medidas: medidas de tiempo real del PC (Windows NT 4.0, cap. 7.5). **Ninguna comparación medida entre simulación y robot real** descrita en los capítulos leídos. El resumen final afirma, sin describir la medida, que el resultado de la simulación es suficientemente exacto incluso para tareas de pintura y que las desviaciones son de "pocos por ciento" según la aplicación (cap. 9, p. 153).
- Tamaño de la muestra: no aplica.

## Limitaciones (declaradas y observadas)
- Declarada: los procedimientos de las controladoras reales no suelen estar disponibles, así que no se garantiza una reproducción exacta; la calidad de la simulación se mide por la diferencia con el sistema real (cap. 6, p. 93).
- Observadas: afirmación de exactitud sin protocolo ni datos; robots de investigación, no un modelo comercial antiguo con su controladora cerrada.

## Relación con nuestro trabajo
- Qué aprovechamos: fuente citable (tesis en repositorio institucional) de que en COSIMIR la controladora se emula dentro de la simulación y se diseña para poder intercambiarse por la real sin tocar el simulador. Es el antecedente académico más directo de nuestro modo `emulador` tras un contrato idéntico (revisión v3, mayor 1). Su frase de que la calidad se mide por la diferencia con el sistema real, sin publicar esa diferencia, apoya que lo que falta es la **medida**.
- En qué nos diferenciamos: no se reivindica emular la controladora ni la intercambiabilidad. Medimos la coherencia del emulador frente a una controladora real cerrada (D/U-M1) con un protocolo declarado (parámetros congelados, programas de evaluación distintos de los de ajuste) y la separamos de la fidelidad física.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "Die Qualität der Simulation zeigt sich in den möglichst kleinen Differenzen zum realen System." (cap. 6, p. 93) — 14 palabras.
