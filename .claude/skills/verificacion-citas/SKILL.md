---
name: verificacion-citas
description: Procedimiento para comprobar que una referencia existe y que respalda la afirmación que se le atribuye. Usar en el agente verificador.
---

# Verificación de citas

Para cada entrada de `refs.bib`:

1. **Existencia por DOI:** `https://api.crossref.org/works/<DOI>` (o `https://doi.org/<DOI>`). Compara título, primer autor, año y revista.
2. **Sin DOI:** busca el título exacto en OpenAlex (`https://api.openalex.org/works?search=<título>`) o en la web del editor.
3. **Respaldo de la afirmación:** localiza en fichas/textos cada `[@clave]` y comprueba en el resumen o texto de la fuente que dice eso. Las cifras se comprueban una a una.
3b. **Si las APIs no responden** (en algunos entornos OpenAlex/Crossref están bloqueadas): busca el título exacto con WebSearch y abre con WebFetch la página del editor o del repositorio. Anota en el informe qué fuente usaste.
4. Estado:
   - `VERIFICADA` — existe y los metadatos coinciden.
   - `CORREGIDA` — existe, pero había metadatos erróneos (indicar cuáles y corregir en `refs.bib`).
   - `DUDOSA` — no se pudo acceder o hay discrepancias que no se pueden resolver.
   - `NO ENCONTRADA` — no existe con esos datos. **Debe retirarse** de los textos.
5. Actualiza `note = {verificacion: ...}` en `refs.bib`.

Informe:
```markdown
| Clave | Estado | Comprobado en | Observaciones |
|---|---|---|---|
## Afirmaciones no respaldadas
## Acciones
```
