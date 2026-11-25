# The off-line programming and simulation software for the Mitsubishi Movemaster RV-M1 robot

- **Clave:** swider2007offline
- **Referencia:** Świder, J., Foit, K., Wszołek, G. y Mastrowski, D. (2007). The off-line programming and simulation software for the Mitsubishi Movemaster RV-M1 robot. Journal of Achievements in Materials and Manufacturing Engineering, 20(1–2), 499–502 (artículo corto, *short paper*).
- **DOI/URL:** sin DOI localizado. PDF: https://delibra.bg.polsl.pl//Content/38967/BCPS_40662_-_The-off-line-program_0000.pdf
- **Tipo:** revista (artículo corto)
- **Leído:** texto completo (PDF de la Biblioteca Digital de la Universidad Politécnica de Silesia). Volumen, números, mes (enero–febrero de 2007) y páginas 499–502 tomados de la cabecera y de los números impresos en el PDF.
- **Línea:** revision-v3 (controladoras simuladas y simuladores del RV-M1; revisión v3, mayor 1)

## Problema que aborda
Las soluciones comerciales de programación y simulación suelen estar ligadas a un tipo concreto de robot y son cerradas. Los autores presentan una versión preliminar de un sistema propio de programación *off-line*, simulación y supervisión remota para el RV-M1 de su laboratorio.

## Solución / arquitectura
- Equipo o robot: Mitsubishi Movemaster RV-M1 (5 ejes, 1,2 kg).
- Programas: ROBO (simulación y programación *off-line*, OpenGL, Windows), "inspirado en el Denford Virtual Robot" según los autores; KAMROB (junto al robot: puente con la controladora por RS-232 y vídeo de una cámara); SERWER (servidor de red entre las instancias de ROBO y KAMROB, con un puerto para vídeo, otro para ROBO/KAMROB y otro para mensajes de diagnóstico, incluidos los errores de comunicación con el robot real).
- ¿Mantiene la controladora original? sí. La controladora no se puede conectar a la red, por eso se usa un PC servidor (p. 500).
- Comunicación / protocolo: RS-232 entre PC y controladora; red propia (SERWER) entre puestos. Modo mixto: una instancia de ROBO conectada al robot real y otras con robots virtuales en otros puestos (p. 501).
- Lenguaje: el texto dice que el programa se prepara en "MELFA BASIC" (p. 500); **no** dice qué órdenes interpreta ROBO ni describe un intérprete. (Nota: el lenguaje del RV-M1 es el de órdenes Movemaster; la denominación es la de la fuente.)
- **Enlace en vivo modelo → robot:** ROBO puede enviar datos al robot "en tiempo real": cada cambio de la posición del brazo virtual produce el cambio correspondiente del manipulador real (p. 502). El flujo descrito es **de un solo sentido**, del modelo al robot.
- Lectura del estado del robot: **no se describe** (solo el puerto de diagnóstico de errores de comunicación).
- Emulación de la controladora (errores, tiempos, velocidad): **no se describe**.
- Gemelo digital: modelo que gobierna el robot en lazo abierto (flujo automático modelo → robot; ninguno robot → modelo, según lo leído).
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas medidas: ninguna. Solo se dice que el prototipo permitió probar la corrección de la estructura (p. 502).
- Tamaño de la muestra / repeticiones: no aplica.

## Limitaciones (declaradas y observadas)
- Declaradas: versión preliminar; uso actual sobre todo docente.
- Observadas: no describe qué parte del lenguaje se simula ni cómo; sin lectura del estado del robot; sin ninguna medida de la discrepancia entre el brazo virtual y el real; tecnología de 2007.

## Relación con nuestro trabajo
- Qué aprovechamos: antecedente directo sobre el **mismo robot** de un modelo virtual conectado en vivo al RV-M1 real por RS-232, con varios puestos y modo mixto real/virtual. Obliga a no presentar como nuevo ni el enlace en vivo modelo–robot del RV-M1 ni la mezcla de robots virtuales y real en red (revisión v3, mayor 1).
- En qué nos diferenciamos: nuestro flujo automático es el contrario (del robot real a la sombra, leyendo `WH`), y el modelo no publica estado en el real; medimos la coherencia del emulador con la controladora real, la fidelidad física y la observabilidad. Ellos no leen el estado ni miden nada.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "send data to the robot in real time" (p. 502). El verificador (ronda 4) confirmó este fragmento; el arranque "an ability to" no se pudo comprobar literalmente y se retira.

## Notas desde la línea revision-v4 (2026-11-25)
- Cita acortada al fragmento confirmado (verificador, ronda 4, punto 5).
- Revisión v4, N4-1: el flujo automático es solo modelo → robot. Con el criterio de Barbie (ninguno / físico → digital / ambos) **no encaja en ninguno de los tres niveles**; en la matriz pasa a "fuera de los tres niveles (flujo automático solo digital → físico)".
- Este trabajo es el que cita JRobot como otro sistema para el RV-M1; ver la ficha de pista calderon2002jrobot.
