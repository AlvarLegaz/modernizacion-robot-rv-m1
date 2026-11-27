# Documentación del Mitsubishi Movemaster EX RV-M1

Los manuales originales son de Mitsubishi Electric y no se copian en este repositorio; aquí se enlazan las fuentes.

## Manuales

- **Manual de instrucciones oficial (inglés)**, con especificaciones, comandos, apéndices de conexionado, ajustes RS-232C/E/S, esquemas de cableado y lista de repuestos: http://www.mitsubishirobot.com/Manual/rv-m1.pdf
- Copia del manual en Scribd: https://www.scribd.com/document/627859510/RV-M1-InstructionManual
- Copia del manual en manualzz: https://manualzz.com/doc/8635155/mitsubishi-rv-m1-instruction-manual
- Copia del manual en SlideShare: https://www.slideshare.net/slideshow/movemaster-robot/246582057
- Resumen en español de instalación y especificaciones (ref. BFPA5191): https://sistemasmanufactura.wordpress.com/wp-content/uploads/2011/11/robot-mantenimiento-rv-m1.pdf

## Ingeniería inversa y repotenciación

- Reverse engineering de la controladora D/U-M1 (placa de señales de motor, firmware Z80): https://hackaday.io/project/171597-reviving-and-reverse-engineering-an-old-robot-arm
- Retrofit con dSPACE y arquitectura abierta (Revista Espacios, 2018): https://revistaespacios.com/a18v39n35/18393506.html
- Caracterización de alternativas de repotenciación (TEINCO): https://investigacion.teinco.edu.co/wp-content/uploads/2024/05/Caracterizacion-de-alternativas-para-la-repotenciacion-de-un-brazo-robotico-Mitsubishi-modelo-RV-M1.pdf
- Tesis: simulador del brazo RV-M1 (TecNM): https://rinacional.tecnm.mx/bitstream/TecNM/2613/1/Tesis%20Jonathan%20Herrera%20Aponte%20SIMULADOR%20DE%20UN%20BRAZO%20ROB+%C3%B4TICO%20MITSUBISHI%20RV-M1.pdf

## Software y comunicación

- Librería .NET para controlar el RV-M1 por RS-232: https://github.com/Springwald/Movemaster-RV-M1-Library
- Hilo sobre cable RS-232C DB25-DB9 (Denford): https://www.denfordata.com/bb/viewtopic.php?t=4157
- Conexión del RV-M1 a PLC (MrPLC): https://mrplc.com/forums/topic/1422-mitsubishi-rv-m1-movemaster-plc/

## Datos técnicos clave

| Elemento | Dato |
|---|---|
| Grados de libertad | 5 (J1 cintura, J2 hombro, J3 codo, J4 cabeceo, J5 giro) |
| Motores | Servomotores DC con escobillas: 30 W en J1–J3, 11 W en J4–J5 |
| Reducción | Harmonic drive; correa dentada en J2, J3 y J4 |
| Frenos | J2 y J3 |
| Encoders | Incrementales de cuadratura (A/B) con índice Z, en el eje del motor |
| Referencia | Final de carrera por eje + fase Z (comando NT) |
| Carga | 1,2 kg incluida la pinza |
| Repetibilidad | 0,3 mm |
| Velocidad máx. | 1000 mm/s en la muñeca |
| Controladora | D/U-M1, 120–240 V AC, 0,5 kVA, CPU Z80 |
| Interfaces | RS-232C (bidireccional) y Centronics (solo PC→robot) |
| Cables robot–controladora | Señales MS-M1 y potencia MP-M1 (5 m) |
