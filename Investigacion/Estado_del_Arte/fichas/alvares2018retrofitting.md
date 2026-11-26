# Retrofitting of the IRB6-S2 robotic manipulator using Computer Numerical Control-based controllers

- **Clave:** alvares2018retrofitting
- **Referencia:** Alvares, A. J., Toquica, J. S., Lima II, E. J. y Bomfim, M. H. S. (2018). Retrofitting of the IRB6-S2 robotic manipulator using Computer Numerical Control-based controllers. Journal of the Brazilian Society of Mechanical Sciences and Engineering, 40(3), art. 149.
- **DOI/URL:** https://doi.org/10.1007/s40430-018-1073-0
- **Tipo:** revista
- **Leído:** resumen (página del editor; texto completo bajo suscripción)
- **Línea:** retrofit-heredados

## Problema que aborda
Recuperar robots industriales antiguos sustituyendo su control por controladores de arquitectura abierta basados en CNC.

## Solución / arquitectura
Compara dos soluciones de controlador abierto basadas en CNC (UFMG y UnB), sobre Linux y Windows, aplicadas a dos robots antiguos similares; analiza ventajas de implantación e integración CAD/CAM. Propone una metodología genérica de retrofit en cinco pasos modelada con IDEF0, aplicable a robots serie o paralelos. Publica hardware y software para el ASEA IRB6-S2 como código abierto sobre LinuxCNC.
- Equipo o robot: ASEA IRB6-S2.
- ¿Mantiene la controladora original? no (sustitución por controlador CNC abierto; detalle de la controladora original no visto en el resumen).
- Comunicación / protocolo: no indicado en el resumen (LinuxCNC).
- Gemelo digital: no indicado.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: no indicadas en el resumen [POR VERIFICAR en texto completo].
- Tamaño de la muestra: dos robots.

## Limitaciones (declaradas y observadas)
- Observada: solo se ha leído el resumen.

## Relación con nuestro trabajo
- Qué aprovechamos: ejemplo representativo del enfoque invasivo (*open controller*) y de una metodología formal de retrofit (IDEF0, 5 pasos).
- En qué nos diferenciamos: enfoque no invasivo; conservamos la controladora D/U-M1 y sus seguridades, lo que reduce coste y riesgo, a cambio de no controlar a bajo nivel.

## Citas textuales útiles
- Ninguna.
