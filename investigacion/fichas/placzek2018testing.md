# Testing of an industrial robot's accuracy and repeatability in off and online environment

- **Clave:** placzek2018testing
- **Referencia:** Płaczek, M. y Piszczek, Ł. (2018). Testing of an industrial robot's accuracy and repeatability in off and online environment. Eksploatacja i Niezawodność – Maintenance and Reliability, 20(3), 455–464. (Título polaco: *Badania dokładności i powtarzalności pozycjonowania robota przemysłowego w środowiskach off i online*.)
- **DOI/URL:** 10.17531/ein.2018.3.15 (impreso en el PDF como http://dx.doi.org/10.17531/ein.2018.3.15). PDF: https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-5f5a6221-9efe-470b-a2fa-513a29f80dbb/c/Placzek.pdf
- **Tipo:** revista (revisada por pares)
- **Leído:** texto completo (PDF de BazTech), mediante extracción resumida en dos pasadas; la cita de abajo es el arranque literal que devolvió la herramienta.
- **Línea:** revision-v4 (medidas publicadas de la coherencia entre controladora emulada y robot real; revisión v4, mayor 1)
- **Afiliaciones:** M. Płaczek, Universidad Politécnica de Silesia (Gliwice); Ł. Piszczek, ProPoint Sp. z o.o. (Gliwice).

## Problema que aborda
Comprobar la exactitud y la repetibilidad de posicionamiento de un robot industrial real y hasta qué punto la simulación *off-line* reproduce su trayectoria.

## Solución / arquitectura
- Equipo o robot: KUKA KR 16-2 (soldadura; carga nominal de 16 kg). El hardware de la controladora no se nombra; el software de simulación usa el grupo "Kuka KR C1 Spot".
- ¿Mantiene la controladora original? sí (robot real sin modificar; ensayo de caracterización).
- Simulación: Robcad, en dos modos: "default" (modelo genérico del simulador) y con la herramienta **RCS** de la controladora ("Kuka_KRC1_Spot"). El texto desarrolla RCS como "Robot Controller Software" (§3). **No** aparecen las palabras "RRS" ni "Realistic Robot Simulation". Que esa herramienta RCS sea la interfaz RCS de RRS (bernhardt2002cost) es una inferencia nuestra, no una afirmación de la fuente [POR VERIFICAR].
- Medida externa: láser tracker Faro Vantage con SMR, a 2 m del robot (exactitud del fabricante 0,009 mm).
- Comunicación / protocolo: no aplica.
- Gemelo digital: no; simulación *off-line* con controladora emulada comparada con el robot real.
- Seguridad en la capa de comunicación: no aplica.

## Evaluación
- Ensayos según PN-EN ISO 9283: exactitud de pose (AP) y repetibilidad (RP) con 30 medidas por punto, en cubos de 200, 600 y 1000 mm (puntos C3–C6), tres orientaciones de la herramienta, velocidad máxima y 10 % y 50 % en el cubo de 1000 mm, carga de discos de acero (masa no indicada), 22 °C y 40 min de calentamiento.
  - AP entre unos 0,54 y 2,36 mm según punto y cubo; un punto con 2,21 mm en el cubo de 1000 mm que los autores consideran inaceptable.
  - RP entre unos 0,03 y 0,12 mm; peor caso declarado 0,15 mm.
- **Comparación simulación–real (§6, pp. 461–462, figs. 13–16):** una trayectoria desde Home con la herramienta girada +20° en X e Y; el robot real a 150 mm/min, registrado con el tracker y muestreado cada 10 mm; los puntos se importan en Robcad. La trayectoria real se compara con la simulada en modo "default" y con la simulada con RCS. **Resultado solo cualitativo y gráfico:** la real coincide con la de RCS y difiere de forma significativa de la "default". **No hay ninguna cifra** (mm, % ni tiempo de ciclo) de la discrepancia simulación–real, ni en el texto ni en los pies de figura. No se comparan tiempos de ciclo.
- Tamaño de la muestra: una trayectoria real frente a dos simuladas; repeticiones no indicadas para esta parte (las 30 medidas son de AP/RP).

## Limitaciones (declaradas y observadas)
- Observadas: la comparación con la simulación es de una sola trayectoria, a velocidad muy reducida, sin cifras ni métrica definida; la emulación es la herramienta del fabricante, no un modelo reconstruido; solo trayectoria, sin tiempos ni conducta ante errores.

## Relación con nuestro trabajo
- Qué aprovechamos: (1) es una comparación **revisada por pares** entre la trayectoria de una simulación con la controladora emulada (RCS) y la del robot real medido con una referencia externa. Obliga a acotar A3-1: existen comparaciones publicadas, aunque parciales (revisión v4, mayor 1 a). (2) Es el antecedente más cercano a la separación de A3-2: en el mismo trabajo hay simulación con controladora emulada, robot real y una medida física externa (tracker). (3) Ejemplo de método (ISO 9283, tracker) para acotar E2b.
- En qué nos diferenciamos: ellos emulan con el software del fabricante (vía RRS/RCS) y comparan una trayectoria en una figura, sin cifras. Nosotros medimos un emulador **reconstruido desde el manual** de una controladora sin software reutilizable, con protocolo declarado (conjuntos de ajuste y evaluación separados, parámetros congelados), con cifras en unidades físicas y con el error descompuesto en cinemática, tiempos y conducta (órdenes, errores, ACK). Además, separamos la coherencia con lo que informa la controladora (`WH`) de la fidelidad física; ellos comparan la simulación directamente con la medida externa, sin la pose informada por la controladora como término intermedio.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "the real path (blue) coincides with the path created using the RCS tool" (§6, p. 462) — arranque literal devuelto por la herramienta; [POR VERIFICAR literal] por el verificador.
