# Implementation of a PC-based Robot Controller with Open Architecture

- **Clave:** pan2004pcbased
- **Referencia:** Pan, L., Huang, X. (2004). Implementation of a PC-based Robot Controller with Open Architecture. En 2004 IEEE International Conference on Robotics and Biomimetics (ROBIO), pp. 790–794.
- **DOI/URL:** https://doi.org/10.1109/ROBIO.2004.1521883
- **Tipo:** congreso
- **Leído:** resumen (reconstruido desde OpenAlex) y metadatos Crossref
- **Línea:** rvm1-similares
- **Nota:** OpenAlex fecha la publicación en 2005 (aparición en IEEE Xplore); el congreso es de 2004.

## Problema que aborda
Construir un controlador de robot abierto, barato y robusto sobre PC.

## Solución / arquitectura
- Equipo o robot: Mitsubishi Movemaster-EX (modelo exacto RV-M1 no confirmado en el resumen [POR VERIFICAR]).
- Arquitectura: software basado en componentes con hardware y software comerciales; CORBA para extensibilidad, escalabilidad y portabilidad.
- ¿Mantiene la controladora original? no indicado en el resumen (roldan2018enhancing lo cita como sustitución por controlador de PC) [POR VERIFICAR].
- Comunicación / protocolo: CORBA (middleware distribuido).
- Gemelo digital: no indicado.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: el resumen dice que se evalúa el rendimiento aplicándolo al Movemaster-EX; valores no disponibles en el resumen.
- Tamaño de la muestra / repeticiones: no indicado.

## Limitaciones (declaradas y observadas)
- Observadas: solo se ha leído el resumen.

## Relación con nuestro trabajo
- Qué aprovechamos: precedente del uso de middleware distribuido sobre un Movemaster; análogo de época a usar MQTT/ROS hoy.
- En qué nos diferenciamos: no sustituimos el controlador; usamos un middleware ligero y estándar IoT.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae (solo resumen).
