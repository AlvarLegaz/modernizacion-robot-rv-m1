# Smart retrofitting in maintenance: a systematic literature review

- **Clave:** sanchezlondono2023smart
- **Referencia:** Sanchez-Londono, D., Barbieri, G. y Fumagalli, L. (2023). Smart retrofitting in maintenance: a systematic literature review. Journal of Intelligent Manufacturing, 34(1), 1–19.
- **DOI/URL:** https://doi.org/10.1007/s10845-022-02002-2
- **Tipo:** revista (revisión sistemática, acceso abierto; en línea desde 29/08/2022)
- **Leído:** texto completo (parcial, primera mitad vía página del editor)
- **Línea:** retrofit-heredados

## Problema que aborda
Con Industria 4.0 el mantenimiento evoluciona de planificado a proactivo/estratégico, pero los equipos heredados suelen requerir sustitución. Se plantea el *smart retrofitting in maintenance* (SRM) como alternativa.

## Solución / arquitectura
Revisión PRISMA; propone una definición de SRM, lo evalúa en mantenimiento reactivo, planificado, proactivo y estratégico, e identifica impulsores, retos y una hoja de ruta de implantación.
- Equipo o robot: genérico (maquinaria heredada).
- ¿Mantiene la controladora original? el retrofit se presenta como alternativa a sustituir; recoge propuestas que no requieren abrir ni modificar fuertemente la máquina (Jónasdóttir et al.) y recomienda probar en *testbed* antes que en línea (Wiemer et al.).
- Comunicación / protocolo: no se detalla MQTT/OPC UA en la parte leída; señala que algunos equipos no comunican nativamente y requieren pasarela; interoperabilidad multi-fabricante como requisito; procesamiento en nube, *edge* o *fog*.
- Gemelo digital: no indicado en la parte leída.
- Seguridad en la capa de comunicación: no indicado en la parte leída.

## Evaluación
- Métricas: no aplica (revisión). Recoge indicadores de fiabilidad/disponibilidad (MTTF, frecuencia de fallo), mantenibilidad (MDT), rendimiento y calidad, y categorías de riesgo/coste/rendimiento del marco GFMAM. Marcos citados: GFMAM, ISO 55000/PAS 55, PHM, DMME.
- Tamaño de la muestra: no anotado [POR VERIFICAR].

## Limitaciones (declaradas y observadas)
- Declarada: el mantenimiento estratégico y la gestión de activos quedan como áreas abiertas.
- Observada: solo se leyó aproximadamente la mitad del texto; el número exacto de trabajos revisados no se anotó.

## Relación con nuestro trabajo
- Qué aprovechamos: marco para justificar métricas de disponibilidad (MTTF/MDT) del puente y el argumento de no invadir la máquina; idea de validar primero en banco de pruebas (aplicable al gemelo digital).
- En qué nos diferenciamos: nuestro foco es control/teleoperación y gemelo de un manipulador, no solo mantenimiento.

## Citas textuales útiles
- Ninguna literal registrada.
