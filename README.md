# EcoMarket — Taller práctico 2

MVP académico para comercio sostenible colombiano. Ejecuta desde Live Server para leer `productos.json` (fetch no funciona al abrir como archivo).

## Entregables
- Landing page: `index.html`, `styles.css`.
- Panel responsive con 3 KPI, filtros combinables, catálogo CRUD y gráfico por categoría: `app.js`.
- Dataset de 35 registros: cinco ejemplos manuales y treinta registros generados para el ejercicio: `productos.json`.
- Reglas verificables: `validacion.js`.
- Antes/después de validación: `docs/validacion-antes.json`, `docs/validacion-despues.json`, `docs/reporte-validacion.md`.
- Registro de técnicas y prompts: `docs/prompts.md`.
- Reflexión y lista de verificación: `docs/reflexion.md`.
- Capturas solicitadas: `evidencias/`.
- Imágenes generadas con ChatGPT para la portada, el productor y cinco productos destacados: `assets/`.

## Uso
1. Abrir `index.html` con Live Server.
2. En la landing, usa Catálogo y filtros de categoría.
3. Pulsa Administración para abrir KPI, búsqueda/filtros, gráfico y CRUD.
4. Los cambios se guardan en localStorage. “Limpiar datos locales” restaura el JSON original.

No usa frameworks. Los datos comerciales y productores son ficticios. Las imágenes de `assets/` se generaron con ChatGPT para esta maqueta académica.

Evidencias capturadas: landing con imágenes, categoría, panel/gráfico, modal y móvil. Ver `docs/` y `evidencias/`.
