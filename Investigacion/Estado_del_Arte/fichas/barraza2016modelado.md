# Modelado dinámico del manipulador serial Mitsubishi Movemaster RV-M1 usando SolidWorks

- **Clave:** barraza2016modelado
- **Referencia:** Barraza, A., Rúa, J. C., Sosa, J. L., Díaz, J., Yime, E., Roldán, J. (2016). Modelado dinámico del manipulador serial Mitsubishi Movemaster RV-M1 usando SolidWorks. Revista UIS Ingenierías, 15(2), 49–62.
- **DOI/URL:** https://doi.org/10.18273/revuin.v15n2-2016004 (PDF: https://www.redalyc.org/pdf/5537/553776590003.pdf)
- **Tipo:** revista
- **Leído:** texto completo (PDF Redalyc)
- **Línea:** rvm1-similares

## Problema que aborda
Obtener los parámetros dinámicos del RV-M1 (centros de masa, tensores de inercia), necesarios para controladores basados en modelo, sin ensayos experimentales costosos.

## Solución / arquitectura
- Equipo o robot: Mitsubishi Movemaster RV-M1.
- Método: cinemática con el enfoque de parámetros unificados de Duffy y Crane; dinámica de Lagrange-Euler; masas del manual; centros de masa e inercias de un CAD detallado en SolidWorks (incluye motores, poleas y cables).
- Control: PD con compensación de gravedad simulado en Simulink.
- ¿Mantiene la controladora original? no aplica (trabajo de simulación).
- Comunicación / protocolo: no aplica.
- Gemelo digital: no (modelo dinámico de simulación).
- Seguridad en la capa de comunicación: no aplica.

## Evaluación
- Métricas: errores articulares y en espacio de tarea en simulación (1 s), comparando parámetros CAD frente a los de Bonilla et al. (2010). Con parámetros CAD el error es menor en θ2, θ3 y θ4 y en y, z; en x es menor con los de la literatura. Valores solo en gráficas.
- Tamaño de la muestra / repeticiones: una simulación por conjunto de parámetros.

## Limitaciones (declaradas y observadas)
- Declaradas: trabajo "no experimental pero detallado".
- Observadas: sin validación con el robot real.

## Relación con nuestro trabajo
- Qué aprovechamos: parámetros cinemáticos y dinámicos publicados del RV-M1, útiles si el gemelo digital pasa de cinemático a dinámico.
- En qué nos diferenciamos: nosotros medimos sobre el robot real y no necesitamos el modelo dinámico para el control (lo hace la D/U-M1).

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "no experimental pero detallado" (resumen) [POR VERIFICAR página].
