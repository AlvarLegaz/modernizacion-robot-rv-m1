# Understanding the Robotic Manipulator RV-2AJ for Future Viability Study of Integration into a Legacy FMS Digital Twin application

- **Clave:** patrao2025understanding
- **Referencia:** Patrão, L. H. C., Godoy, E. P., Caldana, V. M. (2025). Understanding the Robotic Manipulator RV-2AJ for Future Viability Study of Integration into a Legacy FMS Digital Twin application. En Proceedings of the 6th South American Conference on Industrial Engineering and Operations Management, Sorocaba, Brasil, pp. 316–327. IEOM Society.
- **DOI/URL:** https://doi.org/10.46254/SA6.20250081 (PDF: https://ieomsociety.org/proceedings/brazil2025/81.pdf)
- **Tipo:** congreso
- **Leído:** texto completo (PDF)
- **Línea:** rvm1-similares

## Problema que aborda
Estudiar la viabilidad de integrar un Mitsubishi RV-2AJ (con su controladora original) en el gemelo digital de un sistema de fabricación flexible (FESTO) heredado.

## Solución / arquitectura
- Equipo o robot: Mitsubishi MELFA RV-2AJ (5 GDL) con controladora CR1-571 y teach pendant, laboratorio de automatización de UNESP Sorocaba.
- Trabajo: estudio de MELFA BASIC IV y de los ficheros .POS/.MB4 de COSIMIR Industrial 4.1; dos programas de prueba (transferencia de pieza y apilado de tres piezas).
- ¿Mantiene la controladora original? sí.
- Comunicación / protocolo: RS-232 entre COSIMIR y la controladora; propuesta de precargar programas y que el gemelo (Node-RED en trabajos relacionados de los autores) seleccione cuál ejecutar. Sin enlace en vivo implementado.
- Gemelo digital: propuesto, no implementado (la realimentación controladora → software queda como trabajo futuro).
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: solo especificaciones (2 kg, ≈410 mm de alcance, 2200 mm/s, 88 programas, 16 E/S) y programas con override del 50 %. Sin medidas de rendimiento.
- Tamaño de la muestra / repeticiones: no aplica.

## Limitaciones (declaradas y observadas)
- Declaradas: estudio de primera fase; integración "posible" pero no realizada; realimentación pendiente.
- Observadas: inconsistencia de unidades de velocidad; sin implementación ni datos.

## Relación con nuestro trabajo
- Qué aprovechamos: confirma que la integración no invasiva de un Mitsubishi antiguo (RS-232 + controladora original) en un gemelo/IIoT es un problema abierto y actual (2025), y que la realimentación de estado es el punto difícil.
- En qué nos diferenciamos: nosotros implementamos el puente bidireccional (órdenes y lectura de estado) y lo medimos, sobre un modelo aún más antiguo (RV-M1, D/U-M1).

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae.
