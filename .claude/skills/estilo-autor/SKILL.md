---
name: estilo-autor
description: Perfil del estilo de redacción científica de Álvar Ginés Legaz Aparicio extraído de sus publicaciones abiertas. Usar siempre al redactar o reescribir el artículo para que suene como él y no como un modelo de IA.
---

# Estilo de redacción de Álvar Ginés Legaz Aparicio

Este perfil sale de tres textos completos que se pudieron leer, de los resúmenes de otros trabajos suyos y de los metadatos de su tesis doctoral. La lista completa de publicaciones está en `Docu/publicaciones_autor.md`. Las citas literales son breves y se usan solo como muestra.

## Fuentes analizadas

Leídas a texto completo:

1. **[TFM-2013]** Legaz Aparicio, Á. G. *Estimación de la Orientación Múltiple en Imágenes Mediante Morfología Matemática y Técnicas de Regularización*. Trabajo Fin de Máster, UPCT, 2013. Autor único, en español. https://core.ac.uk/download/60428344.pdf
2. **[IJNS-2017]** Legaz-Aparicio, A.-G. et al. *Efficient Variational Approach to Multimodal Registration of Anatomical and Functional Intra-Patient Tumorous Brain Data*. International Journal of Neural Systems 27(6), 2017. Primer autor, en inglés. DOI 10.1142/S0129065717500149. Versión leída: https://riunet.upv.es/bitstream/10251/84783/3/
3. **[BIOSIG-2015]** Morales, S., Legaz-Aparicio, A.-G., Naranjo, V., Verdú-Monedero, R. *Determination of Bifurcation Angles of the Retinal Vascular Tree…*. BIOSIGNALS 2015, pp. 126–131. Segundo autor, en inglés. DOI 10.5220/0005170101260131

Solo resumen o metadatos:

- **[TESIS-2019]** Tesis doctoral por compendio, UPCT, en español. DOI 10.31428/10317/8312 (embargada).
- **[AMC-2018]** DOI 10.1016/j.amc.2018.04.018
- **[JCAM-2018]** DOI 10.1016/j.cam.2017.05.001
- **[SIVP-2018]** DOI 10.1007/s11760-018-1276-y
- **[ESWA-2023]** DOI 10.1016/j.eswa.2023.120776. Es de acceso abierto, pero no se pudo descargar.

Advertencia: en IJNS-2017 y BIOSIG-2015 hay coautores. Lo que se repite en los tres textos, y sobre todo en el TFM (autor único), es lo que mejor representa su voz.

## Rasgos de estilo

### 1. Estructura

- Usa una estructura clásica y corta, sin apartados de más.
  - En revista: *Introducción, Metodología/Método, Resultados, Discusión y conclusiones*, a veces con un apéndice para un desarrollo matemático. IJNS-2017 no tiene ni siquiera subsecciones numeradas. BIOSIG-2015 sí las tiene en el método (2.1 a 2.4), una por paso.
  - En el TFM: *Introducción, Estado del arte, Método propuesto, Evaluación y resultados, Conclusiones y Líneas Futuras*, más anexos con material de apoyo y pseudocódigo.
- **Haz:** que el método se divida en subsecciones que sigan el orden del procesado, y manda los desarrollos largos o el material de apoyo a un apéndice o anexo.
- **Evita:** secciones como "Motivación", "Contribuciones", "Limitaciones" o "Impacto". Si hay que hablar de una limitación, hazlo dentro de la discusión o de las conclusiones.

### 2. Cómo empieza la introducción

- El primer párrafo define la tarea o el problema de forma general y pasa enseguida a su importancia práctica.
  - IJNS-2017: "Image registration is the process of finding the optimum geometrical transformation…"
  - TFM-2013: "La estimación de la orientación es una tarea importante en el procesado de imágenes".
- Luego repasa los métodos existentes y señala qué les falta, por ejemplo que dependen de la segmentación, que cuestan mucho de computar o que solo sirven para una aplicación concreta.
- **Haz:** abrir con una frase declarativa y sobria del tipo "X es…" o "X es una tarea importante en…".
- **Evita:** arranques grandilocuentes ("En la era de la Industria 4.0…", "En los últimos años se ha producido un crecimiento sin precedentes…").

### 3. Cómo presenta el objetivo y las aportaciones

- Las presenta en prosa, en un párrafo al final de la introducción. No usa listas numeradas ni viñetas.
  - En inglés: "In this paper, we present an efficient approach to…" (IJNS-2017) o "The goal of this paper is to propose a new method…" (BIOSIG-2015).
  - En español: "El objetivo de este trabajo es presentar un nuevo método…" (TFM-2013). El resumen empieza con "El presente trabajo describe…".
- Dice de qué trabajo previo parte, por ejemplo "extiende el marco de [n]", y qué añade, por ejemplo una implementación nueva.
- Después viene un párrafo breve que explica cómo está organizado el texto.
- **Haz:** escribir un párrafo de objetivo que empiece por "El objetivo de este trabajo es…" / "In this paper, we present…". **Excepción acordada con el autor:** en este artículo las aportaciones pueden quedar algo más definidas, dentro de ese mismo párrafo (o en el siguiente), enumeradas en línea con (i), (ii), (iii) y redactadas de forma concisa y concreta: qué se hace y sobre qué, sin adjetivos valorativos. Ejemplo de tono: "(i) a bridge between the original RS-232C interface and MQTT that keeps the D/U-M1 controller unchanged". Después, el párrafo de organización.
- **Evita:** viñetas o lista vertical de contribuciones, frases grandilocuentes ("una contribución clave que transforma…"), y el adjetivo "novedoso" repetido en cada frase.

### 4. Persona gramatical

- Predominan la pasiva y el impersonal: en inglés, "is proposed", "was chosen", "the proposed method"; en español, "se propone", "se obtiene", "puede observarse".
- La primera persona del plural aparece con moderación. En inglés son unas 15 o 20 veces en todo un artículo (IJNS-2017), sobre todo en la introducción y en los resultados ("we chose", "we can see"). En español va implícita en el verbo ("consideramos", "describiremos", "Denotamos"), nunca con "nosotros" explícito.
- No usa la primera persona del singular.
- **Haz:** una proporción aproximada de 2/3 de impersonal o pasiva por 1/3 de "nosotros" implícito, y hablar de "el método propuesto".
- **Evita:** "yo"; "nosotros" explícito; dirigirte al lector ("como verás").

### 5. Longitud de frases y párrafos

- Las frases suelen tener entre 20 y 30 palabras. En el método se alargan con subordinadas, de 35 a 40 palabras. De vez en cuando mete una frase corta para remarcar algo, como "The key of the method is…" (BIOSIG-2015).
- Los párrafos van de 60 a 150 palabras. En torno a las ecuaciones hay párrafos de una sola frase que presentan la expresión o explican sus símbolos.
- **Haz:** frases largas pero lineales, con la idea principal delante.
- **Evita:** encadenar muchas frases cortas de impacto y escribir párrafos de 250 palabras o más.

### 6. Citas

- Usa citas numéricas. En el TFM van entre corchetes, [n]. En IJNS-2017 se usó el formato de la revista, con superíndices y "Ref. 19" o "Refs. 15-17". En BIOSIG-2015 se usó autor-año porque lo exigía el congreso. Es decir, sigue la plantilla de cada revista.
- Suele nombrar al autor dentro de la frase: "Perona en [29]", "Kass y Witkin [19]", "Verdú et al. [39]" (TFM-2013).
- La densidad de citas es alta en la introducción y en el estado del arte, de 2 a 6 por párrafo, y baja en el método propio.
- Cita su trabajo previo y el de su grupo (Verdú-Monedero) cuando hay continuidad.
- **Haz:** escribir "Autor et al. [n] proponen…" para los trabajos más importantes, y concentrar las citas en la introducción.
- **Evita:** citas sueltas al final de párrafos que no dicen nada concreto.

### 7. Ecuaciones, figuras y tablas

- Usa muchas ecuaciones numeradas: 11 en IJNS-2017, 6 en BIOSIG-2015 y unas 40 en el TFM entre el cuerpo y los anexos. Las presenta con dos puntos y define cada símbolo justo después.
- Usa muchas figuras con subpaneles (a), (b)… (d), y las cita en el texto con "Fig. 2(b)" o "Figura 3.2". Muestra la evolución por pasos de cada método.
- En los artículos con medidas hay tablas de resultados y de parámetros: IJNS-2017 tiene 4 tablas, una de ellas con los parámetros de cada herramienta.
- **Haz:** referenciar siempre las figuras y tablas desde el texto ("Como se puede observar en la Fig. 4(b)…"), poner una tabla con los parámetros usados y numerar las ecuaciones que se mencionan después.
- **Evita:** figuras que no se citan en el texto y tablas decorativas.

### 8. Experimentos y resultados

- Primero describe el montaje con números concretos: base de datos y número de imágenes ("40 DRIVE images, 565 × 584 pixels"), parámetros (longitud del elemento estructurante, Δθ = 15°, σ = 1, umbral al 25 % del máximo) y tiempos de cómputo en segundos.
- Da las métricas con unidades y una precisión fija: errores en mm con dos decimales, información mutua en bits con dos o tres decimales, intervalos con ± y variaciones en %.
- Compara con métodos de referencia con nombre propio (ANTS, Elastix, ASGVF, LST, PCA) y con el punto de partida ("Before registration"), a menudo con diagramas de caja o figuras de comparación.
- Primero describe lo que se ve en la figura o la tabla y después lo interpreta: "Como se puede observar…", "As expected,…".
- **Haz:** dar el valor numérico concreto con su unidad, decir contra qué se compara y en qué condiciones. En español, la coma decimal y el espacio antes de "%" ("50 %").
- **Evita:** porcentajes de mejora sin la referencia de partida, y valores sin unidad o con una precisión distinta en cada caso.

### 9. Tono

- Es afirmativo cuando habla de la aportación: "the proposed method significantly improves on the registration errors of its competitors" (IJNS-2017); "excelentes resultados", "sustanciales mejoras" (TFM-2013).
- Es prudente con los resultados débiles y reconoce los fallos sin rodeos: "Aún así aparecen varios falsos positivos" (TFM-2013); "Results suggest that…", "a possible disadvantage" (IJNS-2017).
- **Haz:** afirmar con claridad lo que respaldan los datos y señalar la limitación concreta en una frase directa.
- **Evita:** adjetivos superlativos sin datos que los apoyen, como "revolucionario" o "sin precedentes". También evita poner condicionales en todas las frases: no tiene un tono defensivo.

### 10. Conclusiones y trabajo futuro

- Las conclusiones son breves. Resumen el método y su resultado principal, mencionan el parámetro crítico o la limitación (por ejemplo, que la sensibilidad depende de la resolución angular, o las condiciones de contorno periódicas) y terminan con el trabajo futuro.
- El trabajo futuro se plantea como algo concreto y en marcha:
  - "In ongoing research, we would like to address…" (IJNS-2017)
  - "As future work, we will evaluate the performance…" (BIOSIG-2015)
  - "Actualmente se está trabajando en aplicar el método…" y "Por último es interesante realizar una comparativa…" (TFM-2013)
- **Haz:** dos o tres líneas futuras concretas, como otra aplicación, una comparativa con más métodos o una extensión multiescala, cada una en una frase.
- **Evita:** cerrar con frases de impacto genérico ("este trabajo abre la puerta a…", "contribuye a democratizar…") y resumir otra vez todo el artículo.

### 11. Vocabulario técnico

- Usa términos precisos y siempre los mismos, como "el método propuesto", "orientación múltiple", "elemento estructurante (EE)", "campo vectorial", "banco de filtros", "regularización", "marco de trabajo (framework)" o "datos de referencia / plantilla".
- Repite el par de términos elegido sin buscar sinónimos: por ejemplo, "bifurcations and crossovers" aparece igual en todo BIOSIG-2015.
- En español, introduce el término inglés entre paréntesis la primera vez: "tensor estructural local, en inglés *local structural tensor* (LST)". Define cada acrónimo en su primer uso y después usa solo el acrónimo.
- En inglés, encadena sustantivos y usa compuestos con guion: "orientation estimation method", "segmentation-dependent results", "intra-patient".
- **Haz:** fijar los términos clave y no cambiarlos. Para este proyecto: "controladora", "teach pendant", "puente RS-232/MQTT", "gemelo digital".

## Expresiones y patrones típicos

En español (TFM-2013):

- Conectores: "Por otro lado", "Por otra parte", "Además,", "Por tanto,", "Es decir,", "En otras palabras,", "Por ello", "Para ello", "De esta forma", "Como contrapartida", "Aún así", "Por último", "Finalmente,".
- Para comentar resultados: "Como se puede observar…", "puede observarse que…".
- Para presentar el trabajo: "El objetivo de este trabajo es…", "El presente trabajo describe…".
- Para el trabajo futuro: "Actualmente se está trabajando en…".

En inglés (IJNS-2017 y BIOSIG-2015):

- Conectores: "Moreover,", "In addition,", "On the other hand,", "However,", "Nevertheless,", "Thus,", "Therefore,", "Hence,", "As a consequence,", "In particular,", "Specifically,", "In this sense,", "For instance,", "First, … Second, …", "Finally,".
- Otras fórmulas habituales: "It should be noted that", "Note that", "As expected,", "Regarding…", "In order to", "Thanks to", "Based on this fact".
- Para presentar el trabajo y el trabajo futuro: "In this paper, we present…", "The goal of this paper is to…", "In ongoing research,…".

Patrones:

- Antes de una ecuación usa dos puntos; después explica los símbolos con "donde…" / "where…".
- Usa paréntesis para acrónimos, números de ecuación y aclaraciones breves.
- Cuando compara con otro método, menciona la diferencia de forma explícita: "Contrary to our method,…" (IJNS-2017), "A diferencia de…".

## Qué evitar (rasgos típicos de IA que no aparecen en sus textos)

- Listas de viñetas y negritas en el cuerpo del artículo. Él escribe en prosa continua, y las listas solo aparecen como pseudocódigo en un anexo.
- Listas numeradas de contribuciones, y sus anuncios del tipo "Este trabajo hace tres contribuciones clave".
- Guiones largos (—) para meter incisos. Él usa paréntesis o comas.
- Tríadas retóricas ("rápido, robusto y escalable") repetidas, y frases que contraponen "no solo X, sino también Y".
- Palabras de relleno: "crucial", "fundamental" (de forma repetida), "robusto" sin una métrica que lo respalde, "aprovechar", "sinergia", "paradigma", "panorama", "en el ámbito de", "cabe destacar que" en cada párrafo, "en resumen" o "en definitiva" al final de cada sección.
- Abrir o cerrar con grandes frases sobre la Industria 4.0 o la democratización tecnológica.
- Variar los términos técnicos para no repetir palabras. Él repite el término exacto.
- Encabezados en forma de pregunta, títulos con dos puntos en todas las secciones y párrafos de una frase para dar efecto (salvo los que presentan una ecuación).
- Matizar todas las afirmaciones con "podría", "potencialmente" o "parece sugerir". Él afirma lo que mide y matiza solo lo dudoso.

Errores del autor que **no** hay que copiar: en sus textos hay erratas y fallos de concordancia (falta de tildes, "has been" con sujeto plural, palabras repetidas), la "o" en lugar del símbolo de grado y la alternancia entre "Fig" y "Figura". Imita la estructura y el tono, pero entrega un texto limpio y coherente: un solo formato de referencia a figuras, el símbolo ° y ortografía correcta.

## Nivel de confianza

- **Alto:** estructura de secciones, aportaciones en prosa, predominio de la pasiva y el impersonal con algo de "nosotros", densidad y forma de las citas, mucho uso de ecuaciones y figuras con subpaneles, conectores repetidos y forma de plantear el trabajo futuro. Se ven igual en los tres textos y en dos idiomas.
- **Medio:** longitud media de frases y párrafos (es una estimación de lectura, sin recuento automático) y el equilibrio entre afirmación y prudencia. En los artículos con coautores parte del estilo puede venir del grupo (Verdú-Monedero, Naranjo).
- **Bajo o sin evidencia:** su estilo reciente, porque ESWA-2023 no se pudo leer (el texto más moderno es de 2017) y la tesis está embargada. Tampoco hay ningún texto suyo sobre robótica o automática, ni en la revista RIAI. Si la revista elegida tiene convenciones propias de estructura o de citas, prevalecen sobre este perfil.
- Limitación del método: los textos se leyeron mediante una herramienta que resume y extrae fragmentos, no con el PDF descargado en local. Las citas literales son cortas, y los recuentos (ecuaciones, figuras, "we") son aproximados.
