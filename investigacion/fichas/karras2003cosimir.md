# COSIMIR Educational, User's Guide (Festo Didactic) — FICHA DE PISTA, NO CITABLE

- **Clave:** karras2003cosimir (solo identificador interno; **sin entrada en `refs.bib`**)
- **Referencia (según la copia leída):** Karras, U. (IRF, Universidad de Dortmund) (2003). COSIMIR Educational, User's Guide. Festo Didactic GmbH & Co. KG, Denkendorf. Nº de pedido 526501, revisión 06/2003 (documento D:HB-COSIMIR-EDUNET-EN).
- **DOI/URL:** sin DOI. **No se ha localizado una copia oficial** (portal de soporte de Festo, InfoPortal de Festo Didactic y folleto de software de simulación de Festo de 2007 consultados; ninguno la ofrece). Solo hay una copia no oficial en rahebeducation.web.app y copias en Scribd. Por la regla de `CLAUDE.md` (URL comprobable) y por ser una copia no autorizada, **no se usa como referencia**.
- **Tipo:** manual de producto (literatura gris)
- **Leído:** texto de la copia no oficial (pista aportada por el revisor)
- **Línea:** revision-v3 (COSIMIR y el RV-M1)

## Problema que aborda
Software didáctico de Festo para aprender robótica en celdas virtuales antes de usar el robot real.

## Solución / arquitectura (según la copia no oficial)
- Celdas con robots Mitsubishi RV-2AJ y **RV-M1**; los programas de ejemplo del RV-M1 están en **MRL** (Movemaster Command) (§2.3–2.4).
- La simulación incluye una controladora de robot completa ("fully fledged robot controller", §2.3).
- La controladora solo se reproduce en la simulación: los datos no se transmiten por la interfaz serie (§3.4).
- Gemelo digital: modelo (simulación con controladora emulada), sin enlace con el robot real en esos modos.

## Evaluación
- No aplica (manual).

## Limitaciones
- Fuente no citable en su forma actual. Lo que dice sobre el RV-M1 y MRL **no** se ha podido respaldar con una fuente citable: ni keibel2002konzeption ni freund1994towards mencionan el RV-M1 ni MRL (Keibel cita una vez un manual Movemaster de Mitsubishi, [Ele97], sobre ejes adicionales, §6.3, p. 116, sin relación con la simulación del RV-M1; matiz del verificador, ronda 4); patrao2025understanding usa COSIMIR Industrial 4.1 con un RV-2AJ y MELFA BASIC IV.

## Relación con nuestro trabajo
- Qué aprovechamos: **riesgo de novedad alto** que se tiene en cuenta en `huecos.md` §6 aunque no se cite: existía un emulador comercial de la controladora del RV-M1 que interpretaba su lenguaje MRL. Para el artículo, COSIMIR se cita a través de fuentes citables (freund1994towards, keibel2002konzeption) sin afirmar lo específico del RV-M1; si Álvar o la biblioteca consiguen el manual oficial (Festo, nº 526501), se puede añadir como literatura gris.
- En qué nos diferenciamos: el manual no publica medidas de coherencia con la controladora real.

## Citas textuales útiles
- Ninguna (fuente no citable).
