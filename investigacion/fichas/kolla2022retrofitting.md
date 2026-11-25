# Retrofitting of legacy machines in the context of Industrial Internet of Things (IIoT)

- **Clave:** kolla2022retrofitting
- **Referencia:** Kolla, S. S. V. K., Lourenço, D. M., Kumar, A. A. y Plapper, P. (2022). Retrofitting of legacy machines in the context of Industrial Internet of Things (IIoT). Procedia Computer Science, 200, 62–70. (3rd Int. Conf. on Industry 4.0 and Smart Manufacturing).
- **DOI/URL:** https://doi.org/10.1016/j.procs.2022.01.205 — PDF abierto: https://orbilu.uni.lu/handle/10993/50793
- **Tipo:** congreso (actas en revista)
- **Leído:** texto completo
- **Línea:** retrofit-heredados

## Problema que aborda
Las pymes carecen de capital para maquinaria nueva y sus máquinas heredadas no recogen datos.

## Solución / arquitectura
Arquitectura de cuatro capas (p. 65): (1) sensores/actuadores retrofit y nodos IoT (microcontrolador, PLC u ordenador); (2) pasarela IIoT como capa intermedia segura hacia el *middleware*; (3) protocolo de comunicación estandarizado (no especifica cuál); (4) almacenamiento y analítica. Principio de diseño: reutilizar la electrónica existente para abaratar y diseñar soportes impresos en 3D.
- Equipo o robot: taladro de columna sin sensores (laboratorio); prueba de campo en curso en una etiquetadora semiautomática con PLC Siemens.
- ¿Mantiene la controladora original? sí (se añaden sensores externos; el taladro no tenía electrónica de control relevante).
- Comunicación / protocolo: Raspberry Pi por Ethernet/LAN; Node-RED como *middleware*; InfluxDB; Grafana. No usa MQTT ni OPC UA explícitamente.
- Gemelo digital: no.
- Seguridad en la capa de comunicación: mencionada solo de forma general (p. 69).
- Clasificación citada (Zambetti et al.): retrofit "Industry 4.0 push" frente a "need-based pull" (p. 64).

## Evaluación
- Métricas: velocidad del husillo (sensor Hall → RPM) y profundidad (sensor IR 0–3 V, 10–80 cm, ajuste polinómico). No se reportan valores numéricos de error, precisión ni frecuencia de muestreo; validación cualitativa.
- Tamaño de la muestra: no indicado.

## Limitaciones (declaradas y observadas)
- Declarada: pocos trabajos con implementación práctica, enfoque pyme, bajo coste y código abierto (p. 64–65), hueco que pretende cubrir.
- Observada: sin métricas cuantitativas; protocolo no especificado; se monitoriza, no se controla.

## Relación con nuestro trabajo
- Qué aprovechamos: arquitectura en capas de bajo coste con pasarela (equivalente a nuestra Raspberry/PC + puente); argumento pyme/bajo coste.
- En qué nos diferenciamos: nosotros usamos la interfaz de comunicación existente de la controladora (RS-232) en vez de sensores añadidos, ofrecemos control bidireccional (no solo monitorización) y medimos latencia.

## Citas textuales útiles
- "retrofitting as a starting point for SMEs with legacy machines" (p. 63).
