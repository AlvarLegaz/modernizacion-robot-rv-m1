# Realistic robot simulation

- **Clave:** bernhardt1995realistic
- **Referencia:** Bernhardt, R., Schreck, G. y Willnow, C. (1995). Realistic robot simulation. Computing & Control Engineering Journal, 6(4), 174–176.
- **DOI/URL:** https://doi.org/10.1049/cce:19950404 (metadatos y resumen en manuscript.isc.ac/Inventory/49/995807.htm)
- **Tipo:** revista
- **Leído:** solo resumen y metadatos
- **Línea:** revision-v3 (Realistic Robot Simulation, RRS-I)

## Problema que aborda
Las simulaciones de robots industriales no reproducían el comportamiento real del movimiento, lo que limitaba su utilidad para planificar y programar.

## Solución / arquitectura
- Equipo o robot: robots industriales en general (Fraunhofer IPK, Berlín).
- ¿Mantiene la controladora original? Integra el **software original de la controladora** en los sistemas de simulación mediante la interfaz RRS.
- Comunicación / protocolo: interfaz RRS (biblioteca de llamadas entre simulador y software de la controladora).
- Gemelo digital: simulación con controladora emulada (software original).
- Seguridad en la capa de comunicación: no aplica.

## Evaluación
- Métricas medidas: el resumen afirma que el movimiento simulado puede coincidir con la realidad "con alta precisión", sin cifras.
- Tamaño de la muestra: no indicado.

## Limitaciones (declaradas y observadas)
- Observadas: solo resumen; sin datos de exactitud en lo leído. Depende de que el fabricante entregue el software de su controladora.

## Relación con nuestro trabajo
- Qué aprovechamos: referencia revisada por pares, con DOI, de que la emulación fiel de controladoras industriales en simuladores es una línea consolidada desde los años 90 (revisión v3, mayor 1). Complementa a bernhardt2002cost (texto completo, RCS y VRC).
- En qué nos diferenciamos: RRS usa el software original que entrega el fabricante; en la D/U-M1 no existe ese software y el emulador se construye desde el manual y se contrasta con la controladora real. No se reivindica la emulación, sino su coherencia medida.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "It enables the integration of original controller software into simulation systems." (resumen)
