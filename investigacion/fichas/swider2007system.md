# The system for simulation and off-line, remote programming of the Mitsubishi Movemaster RV-M1 robot

- **Clave:** swider2007system
- **Referencia:** Świder, J., Foit, K., Wszołek, G. y Mastrowski, D. (2007). The system for simulation and off-line, remote programming of the Mitsubishi Movemaster RV-M1 robot. Journal of Achievements in Materials and Manufacturing Engineering, 25(1), 7–14. [POR VERIFICAR: páginas tomadas del registro del repositorio, que muestra además una lista de autores duplicada/inconsistente; los cuatro autores proceden de la cabecera del PDF]
- **DOI/URL:** sin DOI. https://delibra.bg.polsl.pl/dlibra/publication/40685
- **Tipo:** revista
- **Leído:** texto completo
- **Línea:** retrofit-heredados, rvm1-similares (trabajo clave anterior a 2018: mismo robot; relevante también como antecedente de uso docente)

## Problema que aborda
Los sistemas comerciales de programación y simulación para el RV-M1 son cerrados; se busca un sistema propio, extensible, de programación *off-line*, simulación y supervisión remota.

## Solución / arquitectura
Programa ROBO (simulación y programación *off-line* con OpenGL, en Windows), KAMROB (vídeo y control) y SERWER (servidor) para supervisión remota. Reconoce solo un subconjunto de órdenes del lenguaje del robot.
- Equipo o robot: Mitsubishi Movemaster RV-M1 (5 ejes, 1,2 kg).
- ¿Mantiene la controladora original? sí (comunicación PC–controladora; RS-232 preferente, Centronics también soportado).
- Comunicación / protocolo: RS-232; servidor propio para control remoto.
- Gemelo digital: visualización/simulación (no sincronizada como gemelo).
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: ninguna cuantitativa; resultados cualitativos (versión inicial operativa, uso en prácticas).
- Tamaño de la muestra: no aplica.

## Limitaciones (declaradas y observadas)
- Declarada: solo un modelo de robot y un subconjunto de órdenes.
- Observada: sin protocolos IIoT, sin medidas, tecnología de 2007 (Windows, OpenGL propio).

## Relación con nuestro trabajo
- Qué aprovechamos: precedente directo de control del RV-M1 por RS-232 conservando la controladora, con simulación y uso docente.
- En qué nos diferenciamos: pub/sub MQTT estandarizado, gemelo sincronizado, *teach pendant* de software, Python multiplataforma y evaluación cuantitativa (latencia, disponibilidad).

## Citas textuales útiles
- Ninguna literal registrada.
