# Caracterización de alternativas para la repotenciación de un brazo robótico Mitsubishi modelo RV-M1

- **Clave:** ruiz2022caracterizacion
- **Referencia:** Ruiz Neira, D., González Guevara, E. Y. (2022). Caracterización de alternativas para la repotenciación de un brazo robótico Mitsubishi modelo RV-M1. Semillero de Investigación Bicentenario, Corporación Tecnológica Industrial Colombiana (TEINCO), Bogotá. [POR VERIFICAR: medio de publicación; año tomado del documento]
- **DOI/URL:** https://investigacion.teinco.edu.co/wp-content/uploads/2024/05/Caracterizacion-de-alternativas-para-la-repotenciacion-de-un-brazo-robotico-Mitsubishi-modelo-RV-M1.pdf
- **Tipo:** informe de semillero de investigación en formato artículo (no consta revisión por pares)
- **Leído:** texto completo (PDF)
- **Línea:** rvm1-similares

## Problema que aborda
Un RV-M1 de TEINCO está inoperativo y su sistema de control original no se puede reparar. Se comparan alternativas de bajo coste para devolverlo al uso docente.

## Solución / arquitectura
- Equipo o robot: Mitsubishi RV-M1 (el documento cuenta seis motores, seis encoders y doce finales de carrera).
- ¿Mantiene la controladora original? no (se considera no viable).
- Alternativas comparadas: Arduino Nano/Mega, STM32 (Blue/Black Pill), Raspberry Pi Pico, ESP32, PLC (sin análisis profundo), PLC basados en Arduino (descartados). Drivers L298N frente a ZK-5AD.
- Opción elegida: Arduino Mega 2560 Pro Mini como placa central extraíble, drivers ZK-5AD, acondicionamiento de encoders con amplificadores LM1558H; Arduino IDE (C/C++); MATLAB/Simulink (PID) y Simscape Multibody para simulación/"gemelo digital".
- Comunicación / protocolo: no indicado (se menciona ESP32 por su Wi-Fi/Bluetooth, no elegido).
- Gemelo digital: visualización/simulación en Simscape (propuesto; Blender como trabajo futuro).
- Seguridad en la capa de comunicación: no indicado.

## Evaluación
- Métricas: comparativa de prestaciones y precios de placas (p. ej., STM32 ~5 veces más rápido que Nano; precios en COP) y de drivers; prueba de motor en banco: entrada del 30 % (306/1023) → giro de 108°.
- Tamaño de la muestra / repeticiones: no indicado.

## Limitaciones (declaradas y observadas)
- Declaradas: la placa no sustituye a una controladora industrial (uso didáctico); pines insuficientes en placas tipo Arduino; especificaciones de encoders perdidas; PCB diseñada sin validación completa; literatura del modelo escasa.
- Observadas: no hay resultados de control en lazo cerrado sobre el robot real; documento sin revisión por pares.

## Relación con nuestro trabajo
- Qué aprovechamos: evidencia de que hay unidades RV-M1 en centros docentes que se consideran irrecuperables con su controladora; muestra la tendencia a sustituirla por microcontroladores.
- En qué nos diferenciamos: nuestro caso parte de una D/U-M1 funcional y la conserva; aportamos medida y conectividad (MQTT) en lugar de una nueva electrónica de potencia.

## Citas textuales útiles (máx. 1, < 15 palabras, con página)
- No se extrae.
