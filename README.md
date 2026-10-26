# ETERNAL HOUR — tienda estática (GitHub Pages)

Sitio sin build: HTML + CSS + JS modular. Rutas por hash (`#/catalogo`), compatible con GitHub Pages.

## Cómo actualizar
- **WhatsApp y textos** (marca, contacto, FAQ, políticas): `js/config.js`. `whatsappNumber` en formato internacional, solo dígitos (ej. `573001234567`).
- **Productos y precios**: `js/products.js` (hay plantilla comentada). Precios como número en COP.
- **Fotos**: súbelas a `img/` (mejor `.webp`, ~1000 px de lado) y referéncialas en `images`.

## Publicar
Settings → Pages → Source: **GitHub Actions**. Cada push a `main` despliega con `.github/workflows/pages.yml`.

## Pendiente / fuera de alcance
Pagos, inventario, envíos e integración con Dropi no están implementados; los pedidos se gestionan manualmente por WhatsApp.
