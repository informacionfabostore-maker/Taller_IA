# Registro de Prompt Engineering

## Priming
Actúa como desarrollador frontend senior especializado en marketplaces sostenibles. EcoMarket conecta productores locales colombianos con consumidores. Ayúdame a diseñar una landing accesible y responsive. Antes de comenzar, confirma el contexto y pregunta qué información falta. No generes código todavía.

## Meta-prompting
Evalúa qué información falta sobre audiencia, propuesta, contenidos, identidad visual, funcionalidades y restricciones. Formula preguntas concretas sin asumir respuestas.

## Propuesta visual — chain of thought resumido
Solicita una propuesta UX/UI con secciones y propósito, jerarquía, paleta, tipografía, componentes, accesibilidad y responsive. Entregar razones resumidas y verificables, sin exponer razonamiento interno privado. Propuesta aplicada: cabecera blanca, portada verde con foto aportada por estudiante, accesos a categorías, productos, bloque de impacto, testimonio/suscripción y footer verde.

## Zero-shot
“Diseña una tarjeta accesible de producto EcoMarket con nombre, categoría, precio COP, stock y acción; devuelve HTML semántico y CSS independiente.”
## One-shot
“Usa este patrón de tarjeta: imagen, badge orgánico, nombre con presentación, precio y botón de carrito. Adáptalo a Café orgánico 340 g; no inventes certificaciones.”
## Few-shot
“Usa estas referencias: precio colombiano sin decimales; badge Agotado si stock=0; Stock bajo si stock<=stockMinimo; Disponible de lo contrario. Aplica consistentemente en catálogo y dashboard.”
## Generación de datos (few-shot)
“Genera 30 registros adicionales con IDs consecutivos 6–35, exactamente el esquema de productos.json, categorías/ciudades permitidas, COP entero, fechas 2026-01-01 a 2026-11-03 y booleanos nativos. Devuelve JSON válido, sin campo estado.”
## Refinamiento
“Revisa la respuesta contra el brief y las reglas del esquema. No cambies datos automáticamente; presenta hallazgos y corrección propuesta.”

### Ajustes humanos
Se mantuvo el MVP en HTML/CSS/JS vanilla, se marcaron datos ficticios y se reservó el espacio fotográfico para recursos entregados por la estudiante. Se priorizaron búsqueda y filtros combinables, acciones CRUD y persistencia local.
