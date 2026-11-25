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
- Gemelo digital: modelo que gobierna el robot real en lazo abierto (cada cambio del brazo virtual mueve el real, §4.1; sin lectura del estado del robot en lo leído). Corregido en la ronda revision-v3; ver nota al final.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: ninguna cuantitativa; resultados cualitativos (versión inicial operativa, uso en prácticas).
- Tamaño de la muestra: no aplica.

## Limitaciones (declaradas y observadas)
- Declarada: solo un modelo de robot y un subconjunto de órdenes.
- Observada: sin protocolos IIoT, sin medidas, tecnología de 2007 (Windows, OpenGL propio).

## Relación con nuestro trabajo
- Qué aprovechamos: precedente directo de control del RV-M1 por RS-232 conservando la controladora, con simulación y uso docente.
- En qué nos diferenciamos: pub/sub MQTT estandarizado, sombra que lee el estado del real (`WH`), *teach pendant* de software, Python multiplataforma y evaluación cuantitativa (latencia, coherencia del emulador, fidelidad física, observabilidad). No nos diferenciamos en interpretar el lenguaje del robot ni en mover el real desde el modelo: eso ya lo hacían.

## Citas textuales útiles
- Ninguna literal registrada.

## Notas desde la línea revision-v3 (2026-11-25)
Relectura pedida por la revisión v3 (mayor 1), sobre el PDF de delibra (Content/38972), con extracción resumida:
- **Lenguaje:** el procesador de visualización reconoce solo órdenes seleccionadas de lo que la fuente llama "MELFA BASIC" (resumen). No lista cuáles ni describe la emulación de errores, tiempos o velocidad de la controladora. La programación del modelo virtual es "casi igual" que la del robot real, con funciones aún sin implementar (§1, p. 9).
- **Enlace en vivo:** cada cambio de la posición del brazo virtual produce el desplazamiento correspondiente del manipulador real (§4.1, p. 10). No se describe la lectura de la posición o del estado del robot durante la simulación; solo la descarga de programas o posiciones desde la controladora en el panel del traductor CAD (§3.1).
- **Corrección de la clasificación.** La línea "Gemelo digital: visualización/simulación (no sincronizada como gemelo)" queda **sustituida**: es un **modelo que gobierna el robot real en lazo abierto** (flujo automático modelo → robot; ninguno robot → modelo en lo leído). Lo mismo describe el artículo corto swider2007offline (JAMME 20(1–2), p. 502). En "En qué nos diferenciamos", "gemelo sincronizado" se sustituye por "sombra que lee el estado del real (`WH`) y medida de coherencia, fidelidad física y observabilidad".
- **Consecuencia para A3:** que un simulador del RV-M1 interprete parte de su lenguaje y mueva el robot real en vivo ya está publicado (2007); no es aportación nuestra.
