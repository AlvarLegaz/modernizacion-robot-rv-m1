# ros_control: A generic and simple control framework for ROS

- **Clave:** chitta2017roscontrol
- **Referencia:** Chitta, S., Marder-Eppstein, E., Meeussen, W., Pradeep, V., Rodríguez Tsouroukdissian, A., Bohren, J., Coleman, D., Magyar, B., Raiola, G., Lüdtke, M., Fernández Perdomo, E. (2017). ros_control: A generic and simple control framework for ROS. Journal of Open Source Software, 2(20), 456.
- **DOI/URL:** https://doi.org/10.21105/joss.00456 (PDF leído en https://joss.theoj.org/papers/10.21105/joss.00456.pdf)
- **Tipo:** revista (artículo de software)
- **Leído:** texto completo (PDF de JOSS, dos páginas)
- **Línea:** revision-v2 (intercambio robot real / simulado sobre middleware pub/sub)

## Problema que aborda
Disponer en ROS de un marco de control con prestaciones de tiempo real y controladores reutilizables entre robots distintos, dado que la capa de comunicación de ROS no es segura para tiempo real.

## Solución / arquitectura
- Equipo o robot: genérico; lista de robots de producción e investigación que lo usan (Clearpath, OTTO Motors, Valkyrie y Robonaut de la NASA, PAL Robotics, Shadow Robot, plataformas de Universal Robots).
- ¿Mantiene la controladora original? n. a. (marco de software; la clase `RobotHW` envuelve el hardware o el simulador).
- Comunicación / protocolo: ROS. Los controladores se arrancan, paran y configuran en ejecución con servicios estándar de ROS (`controller_manager`); `realtime_tools` da utilidades de comunicación seguras para tiempo real.
- Gemelo digital: no como tal. La capa de abstracción de hardware (`hardware_interface::RobotHW`, con interfaces tipadas de estado, posición, velocidad y esfuerzo) hace que los controladores no dependan del hardware y permite intercambiar componentes "whether it is a real or simulated robot". El texto leído no nombra Gazebo ni describe la integración con un simulador concreto.
- Seguridad en la capa de comunicación: no indicado; `joint_limits_interface` impone límites articulares.

## Evaluación
- Métricas medidas: ninguna; la evidencia es la lista de robots que lo usan.
- Tamaño de la muestra / repeticiones: n. a.

## Limitaciones (declaradas y observadas)
- Observadas: artículo de software breve, sin evaluación; supone que el robot expone estado y mando a la frecuencia del lazo (interfaces de posición, velocidad o esfuerzo), lo que no ofrece una controladora que solo acepta órdenes de alto nivel y devuelve su pose bajo petición.

## Relación con nuestro trabajo
- Qué aprovechamos: antecedente **estándar** de intercambiabilidad entre robot real y simulado sin tocar los clientes, sobre un middleware pub/sub multicliente (ROS). Obliga a retirar "bus pub/sub multicliente" como diferenciador (revisión v2, mayor 2).
- En qué nos diferenciamos: no en la intercambiabilidad. ros_control abstrae a nivel de articulaciones y lazo de control; nuestro contrato abstrae a nivel de órdenes de alto nivel de un intérprete serie (`MP`, `DJ`, `NT`) con ACK de aplicación y estado solo bajo petición, que es lo que el gemelo emula.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- "swapping out components transparently whether it is a real or simulated robot" (p. 1)
