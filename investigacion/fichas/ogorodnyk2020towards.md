# Towards a general application programming interface (API) for injection molding machines

- **Clave:** ogorodnyk2020towards
- **Referencia:** Ogorodnyk, O., Larsen, M., Lyngstad, O. V. y Martinsen, K. (2020). Towards a general application programming interface (API) for injection molding machines. PeerJ Computer Science, 6, e302.
- **DOI/URL:** https://doi.org/10.7717/peerj-cs.302
- **Tipo:** revista (acceso abierto)
- **Leído:** texto completo (PMC7924464)
- **Línea:** retrofit-heredados

## Problema que aborda
Registrar y ajustar parámetros de proceso de máquinas de inyección mediante una API abierta, aprovechando las interfaces que ya ofrece la controladora.

## Solución / arquitectura
Prototipo de API abierta que implementa el protocolo EMI (ENGEL) y captura hasta 97 parámetros de máquina/proceso más sensores de terceros, con registro sincronizado y frecuencia de muestreo ajustable (tiempo real blando).
- Equipo o robot: inyectora ENGEL insert 130 (control CC300); RevPi Core3 + módulo AIO con kernel Preempt-RT; sensores Kistler en molde.
- ¿Mantiene la controladora original? sí; los autores afirman que el prototipo no interfiere con el sistema de control de la máquina.
- Comunicación / protocolo: EMI sobre Ethernet TCP/IP con XML; Pyro4. EUROMAP63/77 no implementados (futuro).
- Gemelo digital: no.
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Intervalo medio de muestreo: a 100 Hz solicitados se obtienen ~39,5 Hz (0,02532 s); a 33 Hz, 0,03001 s; a 2 Hz, 0,5006 s. Muestras con sobrecarga > 0,025 s: 0,96–2,43 % según caso.
- Tamaño de la muestra: 4 900 muestras por ensayo.
- No se probó la escritura (ajuste) de parámetros.

## Limitaciones (declaradas y observadas)
- Declarada: cumple 33 Hz y 2 Hz pero no frecuencias mayores; sin ensayos en producción.
- Observada: solo un fabricante/protocolo propietario.

## Relación con nuestro trabajo
- Qué aprovechamos: ejemplo claro de enfoque no invasivo sobre la interfaz de comunicación nativa de la controladora, con medida de la frecuencia efectiva alcanzable y del techo impuesto por la interfaz; método reutilizable para caracterizar el enlace RS-232 del RV-M1.
- En qué nos diferenciamos: manipulador en vez de inyectora; control bidireccional; MQTT como capa de publicación.

## Citas textuales útiles
- "does not in any way hinder operation of the IMM's own control system" [página no anotada].
