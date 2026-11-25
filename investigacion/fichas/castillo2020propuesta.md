# Propuesta de reincorporación brazo robótico Mitsubishi modelo RV-M1 para ambiente educativo

- **Clave:** castillo2020propuesta
- **Referencia:** Castillo Gómez, I. E., Peña Forero, C. A. (2020). Propuesta de reincorporación brazo robótico Mitsubishi modelo RV-M1 para ambiente educativo. En M. F. García García (ed.), Aplicaciones Mecatrónicas: Proyectos sobre Robótica y Automatización de Procesos Industriales (pp. ≈44–52 [POR VERIFICAR]). Bogotá: Editorial TEINCO.
- **DOI/URL:** https://investigacion.teinco.edu.co/wp-content/uploads/2023/05/Aplicaciones-Mecatronicas.pdf (ISBN no indicado en el texto)
- **Tipo:** capítulo de libro institucional (autores estudiantes; revisión por pares no indicada)
- **Leído:** texto completo del capítulo (PDF)
- **Línea:** rvm1-similares

## Problema que aborda
Restaurar un RV-M1 deteriorado de TEINCO para volver a usarlo en la docencia de mecatrónica.

## Solución / arquitectura
- Equipo o robot: Mitsubishi RV-M1.
- Diagnóstico: estructura mecánica intacta; cableado a reponer; faltan los frenos; solo dos de los seis servomotores funcionan; tarjeta de control con CI obsoletos irreparables; etapa de potencia a transistores a actualizar a MOSFET/IGBT; fuente de alimentación en buen estado (se conserva).
- ¿Mantiene la controladora original? parcial (solo la fuente); la tarjeta de control se rediseña o sustituye.
- Propuesta: servomotores y servopacks Yaskawa SIGMA-7 con unidad de control de movimiento de 4 ejes, presupuestados con un proveedor local (CDM).
- Comunicación / protocolo: no indicado.
- Gemelo digital: no.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: ninguna (propuesta y presupuesto).
- Tamaño de la muestra / repeticiones: no aplica.

## Limitaciones (declaradas y observadas)
- Observadas: propuesta no implementada; sin medidas; sustitución completa de accionamientos, lo que cambia la naturaleza del robot.

## Relación con nuestro trabajo
- Qué aprovechamos: diagnóstico típico del deterioro de un RV-M1 (motores, frenos, cableado, electrónica obsoleta), útil para motivar por qué conservar una D/U-M1 operativa tiene valor.
- En qué nos diferenciamos: enfoque no invasivo y de coste casi nulo frente a sustitución industrial de servos.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae.
