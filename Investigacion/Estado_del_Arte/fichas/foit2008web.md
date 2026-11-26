# The web-based programming interface for the Mitsubishi Movemaster robot

- **Clave:** foit2008web
- **Referencia:** Foit, K. (2008). The web-based programming interface for the Mitsubishi Movemaster robot. Journal of Achievements in Materials and Manufacturing Engineering, 27(2), 183–186. [POR VERIFICAR: páginas inferidas de las cabeceras del PDF]
- **DOI/URL:** sin DOI. https://delibra.bg.polsl.pl//Content/36182/0000038747.pdf
- **Tipo:** revista (*short paper*)
- **Leído:** texto completo
- **Línea:** retrofit-heredados, rvm1-similares (trabajo clave anterior a 2018: mismo robot)

## Problema que aborda
Existen pocas herramientas software para este robot antiguo; se busca programarlo desde un navegador reutilizando el sistema remoto previo (swider2007system).

## Solución / arquitectura
Servidor web en Windows con programas CGI que invocan aplicaciones externas: una procesa los datos recibidos y otra gestiona la comunicación servidor–controladora. Interfaz con panel de control, programa y posiciones.
- Equipo o robot: Mitsubishi Movemaster RV-M1.
- ¿Mantiene la controladora original? sí.
- Comunicación / protocolo: HTTP/CGI hacia el servidor; enlace serie con la controladora en el sistema previo (el artículo no precisa qué puerto usa la nueva versión).
- Gemelo digital: no (simulación 3D planificada).
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: ninguna; prototipo en fase temprana.

## Limitaciones (declaradas y observadas)
- Declarada: faltan funciones (visualización 3D, cámara, traductor de trayectorias desde CAD).
- Observada: sin evaluación.

## Relación con nuestro trabajo
- Qué aprovechamos: confirma la línea "puente software sobre la controladora original" para el RV-M1 y el interés docente.
- En qué nos diferenciamos: MQTT en lugar de HTTP/CGI ad hoc, gemelo y métricas medidas.

## Citas textuales útiles
- Ninguna literal registrada.
