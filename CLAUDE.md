# Proyecto: modernización del Mitsubishi Movemaster RV-M1

Modernización no invasiva de un brazo Mitsubishi Movemaster EX RV-M1 (5 GDL, controladora D/U-M1 original con RS-232C): control desde Python, teach pendant de software, puente RS-232 → MQTT y gemelo digital (obligatorio: es la aportación que da nivel al artículo). Objetivo final: **un artículo de investigación técnico en español** para la revista **RIAI** (Revista Iberoamericana de Automática e Informática Industrial; sin coste de publicación). MDPI quedaría solo como alternativa futura, traduciendo al inglés.

Autor y responsable: Álvar Ginés Legaz Aparicio (doctor, profesor de FP en el CIFP Politécnico de Cartagena; ORCID 0000-0002-6450-9653). Idioma de trabajo y del artículo: **español** (decisión del autor).

## Estructura del repositorio

| Carpeta | Contenido |
|---|---|
| `codigo/` | Scripts del robot (`rvm1_control.py`, `rvm1_pendant.py`) y, más adelante, puente MQTT y gemelo |
| `gemelo/` | Gemelo digital web estático (three.js + mqtt.js en `lib/`): modelo headless (cinemática, emulador D/U-M1, pasarela del contrato, registro JSONL), 3D, teach pendant y modos EMULADOR/SOMBRA/SINCRONIZADO; pruebas con `node --test gemelo/tests` |
| `broker/` | Servidor MQTT del aula: Mosquitto con usuarios y ACL según el contrato, `crear_usuarios.py`, Docker Compose (broker + web del gemelo), ejemplo para alumnos y pruebas |
| `docu/` | Propuesta, contrato MQTT, referencias del manual del robot |
| `investigacion/` | Estado del arte: `busquedas/` (registro de búsquedas), `fichas/` (una ficha por trabajo), `matriz.md`, `huecos.md`, `estado_del_arte.md` |
| `referencias/refs.bib` | Bibliografía única del proyecto (BibTeX) |
| `experimentos/` | `protocolos/` (diseño de cada experimento) y `datos_crudos/` (registros reales, **inmutables**) |
| `analisis/` | Scripts y figuras generadas a partir de `datos_crudos/` |
| `paper/` | Artículo en LaTeX: `main.tex`, `secciones/`, `figuras/`, `build.sh` y el PDF compilado `main.pdf` |
| `revisiones/` | Informes de revisión y de verificación de referencias |

## Agentes (`.claude/agents/`)

| Agente | Rol | Skills |
|---|---|---|
| `investigador` | Estado del arte por líneas; enfoque y novedad del artículo | busqueda-bibliografica, ficha-lectura, matriz-estado-arte, analisis-huecos, gestion-referencias |
| `verificador-referencias` | Comprueba que cada referencia existe y respalda lo que se le atribuye | gestion-referencias, verificacion-citas |
| `ingeniero` | Código: puente RS-232↔MQTT, gemelo digital, registro de datos | rvm1-comandos, contrato-mqtt, registro-experimentos |
| `analista-experimentos` | Diseño de experimentos, análisis estadístico y figuras | diseno-experimental, registro-experimentos, analisis-datos |
| `redactor` | Escribe el artículo en LaTeX con el estilo del autor | estilo-autor, redaccion-cientifica, plantilla-revista, gestion-referencias |
| `revisor` | Revisión independiente con rúbrica; **nunca edita**, solo informa | rubrica-revision |

## Flujo de trabajo

Patrón orquestador-trabajadores + productor-evaluador. La sesión principal (con Álvar) orquesta; los subagentes no lanzan otros subagentes.

1. **Estado del arte** — lanzar varios `investigador` en paralelo, uno por línea de búsqueda. Cada uno escribe sus fichas y su registro de búsqueda. La sesión principal (o un `investigador` de síntesis) integra `matriz.md`, `huecos.md` y `estado_del_arte.md`.
2. **Verificación** — `verificador-referencias` sobre `referencias/refs.bib` → `revisiones/verificacion_referencias.md`. Las referencias no verificadas no se usan.
3. **Revisión** — `revisor` sobre el estado del arte → `revisiones/revision_estado_arte_vN.md`. Se corrige y se repite hasta que no haya problemas mayores.
4. **Desarrollo** — `ingeniero` implementa (puente, registro, gemelo). `analista-experimentos` diseña los protocolos en `experimentos/protocolos/`.
5. **Experimentos** — los ejecuta **Álvar con el robot real**. Los agentes no ejecutan nada sobre el hardware ni generan datos.
6. **Análisis** — `analista-experimentos` analiza `datos_crudos/` y genera figuras en `analisis/`.
7. **Redacción** — `redactor` escribe `paper/` (LaTeX) y lo compila con `paper/build.sh`. Las secciones que no dependen de resultados se pueden redactar antes, dejando `\FALTA{...}` donde falten datos. `investigador` revisa la novedad y los trabajos relacionados; `revisor` hace la revisión completa; `verificador-referencias` repasa las citas finales.

## Reglas obligatorias para todos los agentes

- **No inventar referencias.** Toda cita debe tener DOI o URL comprobable y estar en `refs.bib`. Si no se encuentra la fuente, se dice.
- **No inventar datos.** Los resultados solo salen de `experimentos/datos_crudos/`. Nunca se rellenan valores, ni "ejemplos ilustrativos" presentados como medidas.
- **`datos_crudos/` no se modifica nunca**; los análisis leen de ahí y escriben en `analisis/`.
- **Seguridad del robot:** ningún agente envía comandos al robot real. El código que lo controle debe respetar el contrato MQTT (`docu/contrato_mqtt.md`) y las seguridades del pendant.
- **Separación productor/revisor:** quien escribe un documento no lo revisa.
- **Extensión:** el artículo no puede pasar de **8–9 páginas** en la plantilla de la revista, referencias incluidas. Respetar el presupuesto de palabras de la skill `redaccion-cientifica`.
- **Estilo:** el artículo imita el estilo de las publicaciones del autor (skill `estilo-autor`), no el estilo propio del modelo.
- **Uso de IA:** el artículo debe declarar el uso de herramientas de IA según la política de la revista; la autoría es humana.
- En scripts que procesen muchos ficheros, usar barra de progreso `tqdm`.
