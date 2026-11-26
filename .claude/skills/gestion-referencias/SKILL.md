---
name: gestion-referencias
description: Normas de la bibliografía del proyecto en Investigacion/Referencias/refs.bib (claves, campos obligatorios, prohibición de inventar). Usar siempre que se añada o cite una referencia.
---

# Gestión de referencias

- Fichero único: `Investigacion/Referencias/refs.bib`.
- Clave: `apellidoprimerautor` + `año` + `palabraclave`, todo en minúsculas sin acentos (`schmidgall2025agentlab`).
- Antes de añadir, busca la clave y el DOI con Grep para no duplicar.
- Si trabajan varios agentes en paralelo, cada uno escribe en `Investigacion/Referencias/parciales/<linea>.bib`; la sesión principal los fusiona en `refs.bib` eliminando duplicados.
- Campos obligatorios: `author`, `title`, `year`, `journal`/`booktitle`/`school`, y `doi` (o `url` si no tiene DOI). Recomendados: `volume`, `number`, `pages`.
- Añade un campo `note = {verificacion: pendiente}`; el verificador lo cambia a `verificada` o `corregida`.
- **Nunca** completes un campo de memoria. Si no está en la fuente, déjalo fuera.
- En los textos se cita como `[@clave]`.
