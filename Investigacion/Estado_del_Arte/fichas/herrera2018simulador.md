# Simulador de un brazo robótico Mitsubishi RV-M1

- **Clave:** herrera2018simulador
- **Referencia:** Herrera Aponte, J. (2018). Simulador de un brazo robótico Mitsubishi RV-M1. Tesis de Maestría en Ingeniería, Instituto Tecnológico de Mérida, Tecnológico Nacional de México. Director: M. R. Moreno Sabido.
- **DOI/URL:** https://rinacional.tecnm.mx/bitstream/TecNM/2613/3/Herrera25.pdf
- **Tipo:** tesis (máster)
- **Leído:** texto completo (PDF; en la portada figura como "Jonathan H. Aponte")
- **Línea:** rvm1-similares

## Problema que aborda
Disponer de una herramienta para que estudiantes e investigadores estudien la geometría y el movimiento del RV-M1 antes de usar el robot real.

## Solución / arquitectura
- Equipo o robot: Mitsubishi RV-M1 (5 GDL).
- Software: simulador en MATLAB con interfaz gráfica y modelo 3D; cinemática directa por Denavit-Hartenberg (basada en Quintero López y Flórez Gómez, 2011) y cinemática inversa analítica (hasta cuatro soluciones, elige la válida más próxima).
- ¿Mantiene la controladora original? no aplica (no hay conexión con el robot real).
- Comunicación / protocolo: ninguna con el robot.
- Gemelo digital: cinemático, no conectado (simulador puro).
- Seguridad en la capa de comunicación: no aplica.

## Evaluación
- Métricas: no se reportan validaciones numéricas en el texto revisado.
- Tamaño de la muestra / repeticiones: no aplica.

## Limitaciones (declaradas y observadas)
- Declaradas: solo cinemática; dinámica e interacción con objetos como trabajo futuro.
- Observadas: inconsistencia entre DH estándar y modificado; sin enlace con el robot físico ni contraste con medidas reales.

## Relación con nuestro trabajo
- Qué aprovechamos: parámetros DH y solución analítica de la cinemática inversa del RV-M1 para el gemelo.
- En qué nos diferenciamos: nuestro gemelo se alimenta del estado real del robot vía la controladora y se compara cuantitativamente con él.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae.
