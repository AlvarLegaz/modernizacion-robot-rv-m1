# Analyzing Microservice Communication Performance in Industrial Edge Platform

- **Clave:** pontarolli2025analyzing
- **Referencia:** Pontarolli, R. P., Gaffurini, M., Godoy, E. P. y Ferrari, P. (2025). Analyzing Microservice Communication Performance in Industrial Edge Platform. IEEE Access, 13. [POR VERIFICAR: volumen inferido y páginas no anotadas]
- **DOI/URL:** https://doi.org/10.1109/ACCESS.2025.3612701 — PDF abierto: https://repositorio.unesp.br/bitstreams/bc6a9723-66ab-43d8-a5bd-a972348cf0eb/download
- **Tipo:** revista
- **Leído:** texto completo
- **Línea:** retrofit-heredados

## Problema que aborda
Cómo conectar equipos de fabricación heredados a sistemas Industria 4.0 mediante plataformas *edge* y microservicios, y cuánto retardo introduce.

## Solución / arquitectura
Sistema híbrido con contenedores Docker, *framework* Moleculer y Asset Administration Shell (AAS), en paralelo al sistema heredado. Compara arquitecturas híbridas, basadas en bus de campo y totalmente virtualizadas.
- Equipo o robot: PLC Siemens S7-1500 que gobierna un SCARA FANUC SR-6iA, atornilladora y utillajes (planta de atornillado y prueba de estanqueidad); Siemens Industrial Edge.
- ¿Mantiene la controladora original? sí (el PLC sigue controlando la planta).
- Comunicación / protocolo: S7comm (TCP 102), PROFINET (ciclo 4 ms), NATS, MQTT (Industrial Edge Databus), REST/HTTPS, NTP.
- Gemelo digital: no (AAS como representación digital del activo).
- Seguridad en la capa de comunicación: HTTPS en la pasarela API; no profundiza.

## Evaluación
- RTT medio: 7,23 ms (actualización de sensor, híbrido); 5,94 ms (escritura de orden, virtualizado); 75 % de operaciones < 10 ms; percentil 95: 9 ms; picos de hasta 57 ms.
- Instrumentación: sniffer hardware (TAP sobre FPGA) y NTP con GPS (incertidumbre 0,003–0,5 ms).
- Tamaño de la muestra: 200 muestras por experimento.

## Limitaciones (declaradas y observadas)
- Declarada: la traducción de protocolos añade sobrecarga en lo híbrido; más variabilidad temporal en lo virtualizado.
- Observada: la desviación típica de un enlace se reporta igual al máximo (posible errata).

## Relación con nuestro trabajo
- Qué aprovechamos: enfoque de migración gradual en paralelo al control heredado; buenas prácticas de medida de latencia (sincronización de relojes, percentiles, nº de muestras).
- En qué nos diferenciamos: nuestra interfaz es RS-232 directa a la controladora del robot, sin PLC intermedio ni plataforma comercial.

## Citas textuales útiles
- Ninguna literal registrada.
