# The ScorBot Toolbox for MATLAB: An Open-Source Hardware Interaction and Simulation Library for the Intelitek SCORBOT-ER 4u Educational Robot

- **Clave:** kutzer2023scorbot
- **Referencia:** Kutzer, M. D. M., Donnal, J. S., Wick, C. E. (2023). The ScorBot Toolbox for MATLAB: An Open-Source Hardware Interaction and Simulation Library for the Intelitek SCORBOT-ER 4u Educational Robot. 2023 ASEE Annual Conference & Exposition, Baltimore, MD.
- **DOI/URL:** https://peer.asee.org/the-scorbot-toolbox-for-matlab-an-open-source-hardware-interaction-and-simulation-library-for-the-intelitek-scorbot-er-4u-educational-robot (PDF leído en https://nemo.asee.org/public/conferences/327/papers/40592/download; código: https://github.com/kutzer/ScorBotToolbox). DOI no confirmado.
- **Tipo:** congreso (educación en ingeniería)
- **Leído:** texto completo (PDF de NEMO/ASEE)
- **Línea:** revision-v1 (segunda ronda; robots didácticos heredados con controladora original)

## Problema que aborda
Facilitar la interacción con el robot didáctico SCORBOT-ER 4u y su simulación desde MATLAB, sustituyendo una herramienta previa (MTIS) que solo funcionaba con MATLAB de 32 bits, para docencia presencial y remota basada en proyectos.

## Solución / arquitectura
- Equipo o robot: Intelitek SCORBOT-ER 4u (5 GDL) con su controladora, su teach pendant y el software SCORBASE del fabricante.
- ¿Mantiene la controladora original? sí. El acceso al hardware pasa por la DLL USB del fabricante (USBC.dll, solo Windows de 32 bits), una DLL intermedia (MTIS) y un servidor web local (ScorBotServer) que permite usarla desde MATLAB de 64 bits con URL codificadas y respuestas JSON (§2.2).
- Comunicación / protocolo: USB (DLL del fabricante) + HTTP/JSON **local** entre MATLAB y ScorBotServer. Sin protocolo IIoT ni red entre equipos.
- Gemelo digital: simulación cinemática en MATLAB (no sincronizada con el robot) con **la misma sintaxis que las funciones de hardware**: `ScorSimInit`/`ScorInit`, `ScorSimSetBSEPR`/`ScorSetBSEPR`, `ScorSimGetXYZPR`/`ScorGetXYZPR` (tabla 1). Los programas de simulación "se traducen directamente" a programas de hardware (§2.3); los algoritmos 1 y 2 son casi iguales línea a línea (el de hardware añade `ScorHome`). También se pueden enviar al robot valores leídos de la simulación (§4.3).
- Seguridad en la capa de comunicación: no indicado (no hay red). Comprobación de errores en las funciones.

## Evaluación
- Métricas medidas: solo métricas de código (tabla 3: 128 funciones, 16 scripts de ejemplo, unas 19 000 líneas de código frente a 846 de MTIS) y observaciones de registros de errores. No mide latencia, precisión ni discrepancia simulación–robot.
- Tamaño de la muestra / repeticiones: uso en el curso Introduction to Robotics de la USNA en otoño de 2020 (COVID-19), casi todo en remoto con simulación y proyecto final en hardware (§6). Valoración cualitativa y anónima, sin encuesta estructurada ni número de alumnos indicado.

## Limitaciones (declaradas y observadas)
- Declaradas: hardware solo en Windows; dependencia de una DLL de 32 bits fuera de su control; cuelgues de la DLL por cables RJ11 del pendant flojos y por desajustes tras actualizar SCORBASE (§4.3); comparación con MTIS "preliminar" (§5, §7).
- Observadas: todo local (un PC); el destino (simulación o robot) se elige por el nombre de la función, no por un mensaje en red; sin medida de fidelidad.

## Relación con nuestro trabajo
- Qué aprovechamos: antecedente directo de **intercambiabilidad simulador/robot** con la misma interfaz de programación en un robot didáctico con su controladora conservada y de **código abierto**; precedente de uso docente remoto con "simulación primero, hardware después".
- En qué nos diferenciamos: el nuestro es un bus pub/sub en red (MQTT) con varios clientes y comprobación del destino en topic y payload; el gemelo emula la controladora (responde con los mismos ACK y estados) y se sincroniza con el robot real por eventos (`WH`/`ER`); y medimos la fidelidad gemelo–robot en unidades físicas. Su robot se gobierna mediante la DLL USB del fabricante; el nuestro, por el RS-232C de la D/U-M1. **Invalida** decir que la intercambiabilidad simulador/robot solo existe en robots de bajo coste o que no hay código abierto en robots didácticos heredados.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- Los programas de simulación se "translate directly" a hardware (§2.3; página no anotada).
