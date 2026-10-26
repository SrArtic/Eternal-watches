import { CONFIG } from "./config.js";
import { PRODUCTS } from "./products.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => new Intl.NumberFormat(CONFIG.locale, { style: "currency", currency: CONFIG.currency, maximumFractionDigits: 0 }).format(n);
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const img = (p, i = 0) => esc(p.images?.[i] || "img/placeholder.svg");

let cart = [];
try { cart = JSON.parse(localStorage.getItem("eh-cart") || "[]").filter((l) => byId(l.id)); } catch { cart = []; }
const save = () => { try { localStorage.setItem("eh-cart", JSON.stringify(cart)); } catch {} $("#cartCount").textContent = cart.reduce((a, l) => a + l.qty, 0); };
const add = (id, qty = 1) => { const l = cart.find((x) => x.id === id); l ? (l.qty += qty) : cart.push({ id, qty }); save(); toast("Agregado al carrito"); renderCart(); };
const setQty = (id, q) => { cart = q < 1 ? cart.filter((l) => l.id !== id) : cart.map((l) => (l.id === id ? { ...l, qty: q } : l)); save(); renderCart(); };
const total = () => cart.reduce((a, l) => a + byId(l.id).price * l.qty, 0);
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); }

function sendWhatsApp(lines) {
  if (!CONFIG.whatsappNumber) { toast("Número de WhatsApp pendiente de configurar"); return; }
  const text = `Hola ${CONFIG.brand}, quiero hacer este pedido:\n\n${lines.join("\n")}`;
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}
const lineText = (p, q) => `• ${p.name} (Ref. ${p.ref}) x${q} — ${money(p.price)} c/u = ${money(p.price * q)}`;
const sendCart = () => { if (cart.length) sendWhatsApp([...cart.map((l) => lineText(byId(l.id), l.qty)), "", `Total: ${money(total())}`]); };

const drawer = $("#drawer"), scrim = $("#scrim");
function openCart() { renderCart(); drawer.hidden = scrim.hidden = false; drawer.setAttribute("aria-hidden", "false"); $("#closeCart").focus(); }
function closeCart() { drawer.hidden = scrim.hidden = true; drawer.setAttribute("aria-hidden", "true"); $("#cartBtn").focus(); }
function renderCart() {
  drawer.innerHTML = `<div class="row" style="justify-content:space-between"><h2 style="margin:0">Tu carrito</h2><button class="icon-btn" id="closeCart" aria-label="Cerrar carrito">✕</button></div>` +
    (cart.length ? cart.map((l) => { const p = byId(l.id); return `<div class="line"><img src="${img(p)}" alt="" loading="lazy"><div><strong>${esc(p.name)}</strong><div class="ref">Ref. ${esc(p.ref)}</div><div class="price">${money(p.price * l.qty)}</div>
      <div class="row"><div class="qty"><button data-q="${esc(p.id)}" data-d="-1" aria-label="Quitar uno">−</button><span>${l.qty}</span><button data-q="${esc(p.id)}" data-d="1" aria-label="Agregar uno">+</button></div><button class="link" data-rm="${esc(p.id)}">Eliminar</button></div></div></div>`; }).join("") +
      `<div class="total"><span>Total</span><strong class="price">${money(total())}</strong></div><button class="btn" id="sendCart">Enviar pedido por WhatsApp</button>`
      : `<p class="empty">Tu carrito está vacío.</p><a class="btn ghost" href="#/catalogo" id="goCat">Ver catálogo</a>`);
  $("#closeCart").onclick = closeCart;
  $("#goCat")?.addEventListener("click", closeCart);
  $("#sendCart")?.addEventListener("click", sendCart);
  drawer.querySelectorAll("[data-q]").forEach((b) => (b.onclick = () => setQty(b.dataset.q, cart.find((l) => l.id === b.dataset.q).qty + +b.dataset.d)));
  drawer.querySelectorAll("[data-rm]").forEach((b) => (b.onclick = () => setQty(b.dataset.rm, 0)));
}
$("#cartBtn").onclick = openCart; scrim.onclick = closeCart;
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!drawer.hidden) closeCart(); closeNav(); } });

const nav = $("#nav"), menuBtn = $("#menuBtn");
function closeNav() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
menuBtn.onclick = () => menuBtn.setAttribute("aria-expanded", nav.classList.toggle("open"));
nav.addEventListener("click", closeNav);

const card = (p) => `<li><a class="card" href="#/producto/${encodeURIComponent(p.id)}"><img src="${img(p)}" alt="${esc(p.name)}" loading="lazy" width="400" height="400"><div><h3>${esc(p.name)}</h3><div class="ref">Ref. ${esc(p.ref)}</div><div class="price">${money(p.price)}</div></div></a></li>`;
const emptyMsg = `<p class="empty">El catálogo se está preparando. Agrega productos reales en <code>js/products.js</code>.</p>`;

function home() {
  const feat = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  return `<section class="hero"><h1>ETERNAL HOUR</h1><p>Relojes y accesorios pensados para acompañar cada momento.</p><div><a class="btn" href="#/catalogo">Explorar catálogo</a></div></section>
  <section class="wrap"><h2>Destacados</h2>${feat.length ? `<ul class="grid">${feat.map(card).join("")}</ul>` : emptyMsg}</section>`;
}
function catalog() {
  const cats = [...new Set(PRODUCTS.map((p) => p.category).filter(Boolean))];
  const html = `<section class="wrap"><h2>Catálogo</h2>${PRODUCTS.length ? `<div class="tools">
    <input id="q" type="search" placeholder="Buscar por nombre o referencia" aria-label="Buscar">
    <select id="cat" aria-label="Categoría"><option value="">Todas las categorías</option>${cats.map((c) => `<option>${esc(c)}</option>`).join("")}</select>
    <select id="sort" aria-label="Ordenar"><option value="">Orden por defecto</option><option value="asc">Precio: menor a mayor</option><option value="desc">Precio: mayor a menor</option><option value="az">Nombre A–Z</option></select></div>
    <ul class="grid" id="list"></ul>` : emptyMsg}</section>`;
  return { html, after() {
    if (!PRODUCTS.length) return;
    const run = () => {
      const q = $("#q").value.trim().toLowerCase(), c = $("#cat").value, s = $("#sort").value;
      const r = PRODUCTS.filter((p) => (!c || p.category === c) && (!q || `${p.name} ${p.ref}`.toLowerCase().includes(q)));
      if (s === "asc") r.sort((a, b) => a.price - b.price); if (s === "desc") r.sort((a, b) => b.price - a.price); if (s === "az") r.sort((a, b) => a.name.localeCompare(b.name));
      $("#list").innerHTML = r.length ? r.map(card).join("") : `<li class="empty" style="grid-column:1/-1">Sin resultados. Prueba otra búsqueda.</li>`;
    };
    document.querySelectorAll(".tools input,.tools select").forEach((el) => { el.addEventListener("input", run); el.addEventListener("change", run); }); run();
  } };
}
function product(id) {
  const p = byId(decodeURIComponent(id));
  if (!p) return `<section class="wrap"><p class="empty">Producto no encontrado.</p><a class="btn ghost" href="#/catalogo">Volver al catálogo</a></section>`;
  const imgs = p.images?.length ? p.images : [""];
  return { html: `<section class="wrap"><a href="#/catalogo" class="link">← Catálogo</a><div class="detail"><div><img class="gal-main" id="main-img" src="${img(p)}" alt="${esc(p.name)}">
    ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((_, i) => `<button data-i="${i}" aria-label="Foto ${i + 1}" aria-current="${i === 0}"><img src="${img(p, i)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}</div>
    <div><h1 style="font-size:2.4rem;letter-spacing:0">${esc(p.name)}</h1><div class="ref">Ref. ${esc(p.ref)}</div><p class="price" style="font-size:1.5rem">${money(p.price)}</p>
    <p>${esc(p.description)}</p>${p.specs?.length ? `<table class="specs">${p.specs.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table>` : ""}
    <div class="row" style="margin-top:1.5rem"><button class="btn" id="buy">Comprar por WhatsApp</button><button class="btn ghost" id="addc">Agregar al carrito</button></div></div></div></section>`,
    after() {
      $("#buy").onclick = () => sendWhatsApp([lineText(p, 1), "", `Total: ${money(p.price)}`]);
      $("#addc").onclick = () => add(p.id);
      document.querySelectorAll(".thumbs button").forEach((b) => (b.onclick = () => { $("#main-img").src = img(p, +b.dataset.i); document.querySelectorAll(".thumbs button").forEach((x) => x.setAttribute("aria-current", x === b)); }));
    } };
}
function info() {
  const c = CONFIG.contact, pend = `<p class="empty">Pendiente de completar en <code>js/config.js</code>.</p>`;
  return `<section class="wrap"><h2>La marca</h2>${CONFIG.about ? `<p>${esc(CONFIG.about)}</p>` : pend}
  <h2 style="margin-top:2.5rem">Contacto</h2>${c.email || c.instagram || c.horario ? `<p>${[c.email && `Correo: ${esc(c.email)}`, c.instagram && `Instagram: ${esc(c.instagram)}`, c.horario && `Horario: ${esc(c.horario)}`].filter(Boolean).join("<br>")}</p>` : pend}
  <h2 style="margin-top:2.5rem">Preguntas frecuentes</h2>${CONFIG.faq.length ? CONFIG.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("") : pend}
  <h2 style="margin-top:2.5rem">Políticas de compra</h2>${CONFIG.policies.length ? CONFIG.policies.map((f) => `<details><summary>${esc(f.title)}</summary><p>${esc(f.text)}</p></details>`).join("") : pend}</section>`;
}
function route() {
  const [, page, arg] = location.hash.split("/");
  const v = page === "catalogo" ? catalog() : page === "producto" ? product(arg || "") : page === "info" ? info() : home();
  const main = $("#main");
  main.innerHTML = typeof v === "string" ? v : v.html;
  v.after?.();
  window.scrollTo(0, 0); main.focus({ preventScroll: true });
}
addEventListener("hashchange", route);
save(); route();
