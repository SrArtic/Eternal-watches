# ETERNAL Watches — sitio web inicial

Tienda estática preparada para publicarse gratuitamente con GitHub Pages.

## Qué incluye
- Diseño adaptable a celular y computador, en negro y dorado.
- Catálogo de demostración con filtros.
- Bolsa de compras en el navegador.
- Formulario de pedido que redacta el pedido en WhatsApp.
- Instagram `@eternalwatches.co`.

## Antes de publicar
1. Abre `index.html`.
2. Busca `const WHATSAPP_NUMBER = "PON_AQUI_TU_NUMERO";` y reemplázalo con tu número comercial en formato internacional, solo dígitos (Colombia: 57 + celular). No incluyas `+`, espacios ni guiones.
3. Reemplaza los seis productos de demostración (nombres, descripciones, categorías y precios) por datos reales confirmados en Dropi.
4. Añade tus imágenes en la carpeta `assets` con estos nombres:
   - `hero-watch.jpg`
   - `reloj-1.jpg` hasta `reloj-6.jpg`
   Si no tienes imágenes listas, el sitio muestra un símbolo provisional.
5. Confirma con Dropi y la transportadora la disponibilidad, envío y pago contra entrega antes de anunciar estas condiciones como garantizadas.

## Publicar en GitHub Pages
1. Entra a https://github.com y crea un repositorio nuevo, por ejemplo `eternal-watches`.
2. Sube `index.html`, `README.md` y la carpeta `assets` (si ya tienes imágenes).
3. En el repositorio, entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, luego pulsa **Save**.
6. Espera a que GitHub muestre la URL publicada en esa misma sección.

## Importante
Este sitio no procesa pagos ni guarda pedidos en un servidor. El carrito se usa en el navegador y el pedido se envía mediante WhatsApp para confirmación manual. No guardes datos personales de clientes en el repositorio. Los precios incluidos son únicamente de ejemplo y no deben usarse para vender hasta sustituirlos.
