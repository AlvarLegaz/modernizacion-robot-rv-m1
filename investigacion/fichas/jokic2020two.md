# Two Open Solutions for Industrial Robot Control: The Case of PUMA 560

- **Clave:** jokic2020two
- **Referencia:** Jokić, D., Lubura, S., Rajs, V., Bodić, M., Šiljak, H. (2020). Two Open Solutions for Industrial Robot Control: The Case of PUMA 560. Electronics, 9(6), 972.
- **DOI/URL:** https://doi.org/10.3390/electronics9060972
- **Tipo:** revista
- **Leído:** texto completo (web MDPI; algunos detalles de hardware en material suplementario no leído)
- **Línea:** rvm1-similares

## Problema que aborda
Las unidades de control obsoletas inutilizan robots industriales mecánicamente sanos; se buscan controladores abiertos para docencia, investigación e industria.

## Solución / arquitectura
- Equipo o robot: PUMA 560.
- Solución 1: PC con tarjeta de adquisición Humusoft MF634 y control en MATLAB Real-Time Windows Toolbox.
- Solución 2: FPGA con un "Matlab FPGA Real Time Toolbox" desarrollado por los autores.
- Potencia: driver de motor DC en puente H propio (±10 V → 60 V, ±10 A).
- ¿Mantiene la controladora original? no (se sustituye la unidad de control; el texto no nombra la original).
- Comunicación / protocolo: no indicado; sin ROS.
- Gemelo digital: no (simulación para comparar).
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas (solo eje 1, 0→1 rad→0, control PD): PC: error máximo en movimiento 40 mrad, en reposo 0,2 mrad (2 pulsos; 1 pulso = 0,102 mrad). FPGA: error en reposo 1,2 mrad (12 pulsos); errores en movimiento fuera de rango de medida (±2 mrad), estimados indirectamente. Simulación: ≈1 mrad en movimiento, 0,2 mrad en reposo.
- Costes: FPGA ≈12 k€ frente a ≈35 k€ PC (con mano de obra); solo hardware ≈1 k€ frente a ≈15 k€. **No son una medida propia del trabajo:** los autores toman estas cifras de su referencia [22]. *(Matiz añadido según la verificación.)*
- Tamaño de la muestra / repeticiones: no indicado.

## Limitaciones (declaradas y observadas)
- Declaradas: solo el primer eje (no afectado por la gravedad); PD de ganancias fijas no rinde igual en todas las configuraciones; menor resolución de la FPGA (convertidores de 8 bits frente a 14 bits).
- Observadas: no se valida el robot completo.

## Relación con nuestro trabajo
- Qué aprovechamos: ejemplo de evaluación cuantitativa y de análisis de costes en un retrofit de robot antiguo; útil para el formato de nuestra tabla comparativa.
- En qué nos diferenciamos: no sustituimos el lazo de control; coste mucho menor; foco en conectividad y gemelo.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae.

## Correcciones tras la verificación (2026-11-25, respuesta a la revisión v1)
- Origen: `revisiones/verificacion_referencias.md`, punto 7. Los costes se citan, si acaso, como "estimación recogida por los autores", no como medida suya. En la síntesis se usa solo el error del eje 1.
