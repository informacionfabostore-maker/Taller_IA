# EcoMarket — Taller práctico 2

MVP académico para comercio sostenible colombiano. `index.html` puede abrirse directamente: `productos.js` carga el catálogo sin depender de un servidor. También funciona con Live Server.

## Entregables
- Landing page: `index.html`, `styles.css`.
- Panel responsive con 3 KPI, filtros combinables, catálogo CRUD y gráfico por categoría: `app.js`.
- Dataset de 35 registros: cinco ejemplos manuales y treinta registros generados para el ejercicio: `productos.json`.
- Reglas verificables: `validacion.js`.
- Antes/después de validación: `docs/validacion-antes.json`, `docs/validacion-despues.json`, `docs/reporte-validacion.md`.
- Registro de técnicas y prompts: `docs/prompts.md`.
- Reflexión y lista de verificación: `docs/reflexion.md`.
- Capturas solicitadas: `evidencias/`.
- Imágenes generadas con ChatGPT para la portada, el productor, cinco destacados y las fichas fotográficas de los 35 productos: `assets/`.

## Uso
1. Abre `index.html` con doble clic o con Live Server.
2. Usa Productos o los mosaicos de categoría para abrir y filtrar el catálogo; agrega productos al carrito.
3. En el pie de página, pulsa Administración para abrir KPI, búsqueda/filtros, gráfico y CRUD.
4. Los cambios del catálogo se guardan en localStorage. “Restaurar catálogo original” revierte los cambios locales.

No usa frameworks. Los datos comerciales y productores son ficticios. Las imágenes de `assets/` se generaron con ChatGPT para esta maqueta académica.

Evidencias capturadas: portada de referencia a 1024×680, categoría, panel/gráfico, modal, vista móvil y carrito con imagen. Ver `docs/` y `evidencias/`.
