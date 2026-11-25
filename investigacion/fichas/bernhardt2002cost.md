# Cost Reduction via Accurate Controller Simulation

- **Clave:** bernhardt2002cost
- **Referencia:** Bernhardt, R. y Willnow, C. (2002). Cost Reduction via Accurate Controller Simulation. En 15th Triennial World Congress of the International Federation of Automatic Control (IFAC), Barcelona, 21–26 de julio de 2002, sesión T-We-M06, artículo 776.
- **DOI/URL:** DOI no localizado. https://skoge.folk.ntnu.no/prost/proceedings/ifac2002/data/content/00776/776.pdf (actas en línea del congreso; resumen en .../00776/abstract.htm). Páginas no indicadas en lo leído.
- **Tipo:** congreso
- **Leído:** texto completo (PDF de las actas), mediante extracción resumida
- **Línea:** revision-v3 (Realistic Robot Simulation: RCS y VRC)

## Problema que aborda
Reducir costes en planificación, puesta en marcha y mantenimiento de líneas con simulación exacta de las controladoras de robot.

## Solución / arquitectura
- Equipo o robot: controladoras industriales de distintos fabricantes (consorcios de fabricantes de automóviles, de robots y de simuladores; Fraunhofer IPK como gestor del proyecto).
- RRS-I, interfaz RCS (*Robot Controller Simulation*), publicada en 1994: permite crear instancias de los controladores de movimiento, pasarles objetivos y obtener los pasos interpolados (§3.1). Los autores dicen que remodelar el comportamiento fracasó por la complejidad del software de las controladoras y que "el único enfoque con éxito" es usar el software original (§3.1).
- RRS-II, interfaz VRC (*Virtual Robot Controller*), iniciada en 1998 y publicada en 2001: cubre casi todo el software de la controladora, incluido el sistema operativo, con órdenes, respuestas y eventos asíncronos, E/S, sistema de ficheros, interfaz de usuario y gestión del tiempo de simulación (§3.2–3.3).
- ¿Mantiene la controladora original? Su software se integra en el simulador.
- Gemelo digital: simulación con controladora virtual.
- Seguridad en la capa de comunicación: no aplica.

## Evaluación
- Métricas medidas: **ninguna cifra** de exactitud (ni tiempo de ciclo ni desviación de trayectoria). La figura 2 muestra desviaciones de finales de los 80 sin números. La conclusión afirma que se ha logrado una simulación muy exacta (§5), de forma cualitativa.
- Tamaño de la muestra: no aplica.

## Limitaciones (declaradas y observadas)
- Observadas: no publica la medida de la exactitud que reivindica; requiere el software original del fabricante, que no existe para controladoras retiradas como la D/U-M1.

## Relación con nuestro trabajo
- Qué aprovechamos: describe, con texto completo, la emulación de controladoras industriales en simuladores (RCS desde 1994, VRC desde 2001), incluidas la semántica de órdenes y eventos y la gestión del tiempo. Es la línea industrial que hace que la emulación de la semántica de la controladora **no** sea una aportación nuestra (revisión v3, mayor 1).
- En qué nos diferenciamos: (1) la D/U-M1 no tiene software de controladora reutilizable: el emulador se escribe desde el manual y se contrasta con la controladora real; (2) se publica la **coherencia medida** frente a la controladora real con un protocolo declarado y separada de la fidelidad física; RRS, en lo leído, afirma la exactitud sin cifras.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "The only successful approach consists in using the original controller software." (§3.1)
