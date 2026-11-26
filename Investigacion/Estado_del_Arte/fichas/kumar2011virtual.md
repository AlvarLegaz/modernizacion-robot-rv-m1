# A virtual RV-M1 robot system

- **Clave:** kumar2011virtual
- **Referencia:** Kumar, R., Kalra, P., Prakash, N. R. (2011). A virtual RV-M1 robot system. Robotics and Computer-Integrated Manufacturing, 27, 994–1000.
- **DOI/URL:** https://doi.org/10.1016/j.rcim.2011.05.003 (texto leído en https://www.academia.edu/91708949/A_virtual_RV_M1_robot_system; la página de ScienceDirect no se pudo abrir)
- **Tipo:** revista
- **Leído:** texto completo (copia en academia.edu)
- **Línea:** revision-v1 (segunda ronda; rvm1-similares)

## Problema que aborda
Los simuladores comerciales y los robots físicos son caros para la docencia; se propone un modelo virtual del RV-M1 de bajo coste para enseñar y planificar trayectorias.

## Solución / arquitectura
- Equipo o robot: modelo virtual del Mitsubishi RV-M1 en MATLAB (cinemática directa e inversa) con un teach box simulado.
- ¿Mantiene la controladora original? no aplica: no hay conexión con el robot ni con la controladora.
- Comunicación / protocolo: ninguno. Los autores plantean como trabajo futuro una interfaz para tener "un sistema común" de simulación y ejecución real.
- Gemelo digital: simulación (sin sincronización). El teach box virtual imita los botones del real y añade otros (GET, GRASP, PLACE, RELEASE) que el real no tiene.
- Seguridad en la capa de comunicación: no aplica.

## Evaluación
- Métricas medidas: ninguna. Ejemplos de cinemática directa e inversa, trayectoria recta y circular y una secuencia de pick-and-place mostrados en figuras; sin comparación con el robot físico.
- Tamaño de la muestra / repeticiones: no aplica.

## Limitaciones (declaradas y observadas)
- Declaradas: solo cinemática (dinámica como trabajo futuro); la orientación de muñeca (roll) la da el usuario; interfaz común simulación/real como trabajo futuro.
- Observadas: sin validación frente al robot real; depende de una licencia de MATLAB.

## Relación con nuestro trabajo
- Qué aprovechamos: antecedente de modelo cinemático del RV-M1 con fines docentes; útil para contrastar la cinemática del gemelo.
- En qué nos diferenciamos: nuestro gemelo comparte el contrato de mensajes con el robot real, se sincroniza con la D/U-M1 por eventos y su fidelidad se mide. La "interfaz común" que estos autores dejan como trabajo futuro ya aparece en mihali2005effective (el usuario elige al conectar si manda el robot o el simulador) y en kutzer2023scorbot (misma sintaxis en otro robot); nuestro contrato la lleva a una red pub/sub con varios clientes.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- no indicado
