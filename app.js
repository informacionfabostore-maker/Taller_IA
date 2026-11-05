const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
const storageKey = "eco-v1";
const categories = ["Frutas y verduras", "Despensa", "Cuidado personal", "Hogar sostenible"];
const cities = ["Bucaramanga", "Floridablanca", "Girón", "Bogotá", "Medellín", "Cali", "Tunja", "Cúcuta"];
const statusOf = (product) => product.stock === 0 ? "Agotado" : product.stock <= product.stockMinimo ? "Stock bajo" : "Disponible";
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const productImageSheets = [
  { file: "productos-frutas.png", ids: [4, 6, 7, 8, 9, 10, 32, 33, 18] },
  { file: "productos-despensa.png", ids: [1, 2, 11, 12, 13, 14, 15, 16, 17] },
  { file: "productos-cuidado.png", ids: [null, 19, 30, 31, 3, 20, 21, 22, 23] },
  { file: "productos-hogar.png", ids: [5, 24, 25, 26, 27, 28, 29, 34, 35] },
];
const productImage = new Map();
productImageSheets.forEach(({ file, ids }) => ids.forEach((id, index) => {
  if (id !== null) productImage.set(id, { file, x: (index % 3) * 50, y: Math.floor(index / 3) * 50 });
}));
let data = [];
let cart = [];
let activeCategory = "";

function productCard(product, admin = false) {
  const thumbnail = productThumbnail(product, "product-thumb");
  return `<article class="card">${thumbnail}<div class="card-copy"><h3>${escapeHTML(product.nombre)}</h3><p>${escapeHTML(product.categoria)} · ${escapeHTML(product.ciudad)}</p><p>${escapeHTML(product.productor)}</p><b>${money(product.precio)}</b><p>${product.stock} unidades · <span class="badge ${statusOf(product) === "Agotado" ? "out" : statusOf(product) === "Stock bajo" ? "low" : ""}">${statusOf(product)}</span></p>${admin ? `<button data-edit="${product.id}">Editar</button><button data-del="${product.id}">Eliminar</button>` : `<button class="card-cart" data-cart-id="${product.id}">Agregar al carrito</button>`}</div></article>`;
}

function productThumbnail(product, className) {
  const image = productImage.get(product.id);
  if (!image) return "";
  return `<div class="${className}" role="img" aria-label="${escapeHTML(product.nombre)}" style="--image-sheet:url('assets/${image.file}');--image-x:${image.x}%;--image-y:${image.y}%"></div>`;
}

function renderChart(products) {
  const canvas = $("#chart");
  if (!canvas || !canvas.clientWidth) return;
  const context = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = 240;
  canvas.width = width * scale;
  canvas.height = height * scale;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.clearRect(0, 0, width, height);
  const counts = categories.map((category) => products.filter((product) => product.categoria === category).length);
  const labels = ["Huerta", "Despensa", "Cuidado", "Hogar"];
  const colors = ["#78a959", "#e7b84b", "#d57b4b", "#557f68"];
  const gap = width / categories.length;
  counts.forEach((count, index) => {
    const x = gap * index + gap * .3;
    const barHeight = count * 5;
    context.fillStyle = colors[index];
    context.fillRect(x, 184 - barHeight, Math.min(42, gap * .4), barHeight);
    context.fillStyle = "#173f35";
    context.font = "12px Arial";
    context.fillText(String(count), x + 12, 174 - barHeight);
    context.fillText(labels[index], x - 4, 210);
  });
}

function fillOptions(element, values, label) {
  element.innerHTML = `<option value="">${label}</option>${values.map((value) => `<option>${value}</option>`).join("")}`;
}

async function loadBaseProducts() {
  if (Array.isArray(window.ECOMARKET_PRODUCTS)) return JSON.parse(JSON.stringify(window.ECOMARKET_PRODUCTS));
  return (await (await fetch("productos.json")).json());
}

function draw() {
  const active = data.filter((product) => product.activo);
  const visible = active.filter((product) => !activeCategory || product.categoria === activeCategory);
  $("#shop").innerHTML = visible.map((product) => productCard(product)).join("");

  const query = $("#search").value.trim().toLocaleLowerCase("es");
  const filtered = active.filter((product) =>
    `${product.nombre} ${product.productor}`.toLocaleLowerCase("es").includes(query) &&
    (!$ ("#cat").value || product.categoria === $("#cat").value) &&
    (!$ ("#city").value || product.ciudad === $("#city").value) &&
    (!$ ("#state").value || statusOf(product) === $("#state").value)
  );
  $("#admin").innerHTML = filtered.map((product) => productCard(product, true)).join("");
  $("#total").textContent = active.length;
  $("#low").textContent = active.filter((product) => product.stock <= product.stockMinimo).length;
  $("#value").textContent = money(active.reduce((sum, product) => sum + product.stock * product.precio, 0));
  $("#report").textContent = `${filtered.length} de ${active.length} productos`;
  renderChart(active);
}

function showCatalog(category = activeCategory) {
  activeCategory = category;
  const catalog = $("#catalogo");
  catalog.hidden = false;
  catalog.dataset.category = category;
  document.querySelectorAll(".categories [data-cat]").forEach((button) => button.classList.toggle("selected", button.dataset.cat === category));
  draw();
  catalog.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateCart() {
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  $("#cart-count").textContent = count;
  $("#cart-items").innerHTML = cart.length ? cart.map((line) => `<article class="cart-line">${productThumbnail(line.product, "cart-product-image")}<div class="cart-line-info"><strong>${escapeHTML(line.product.nombre)}</strong><small>${money(line.product.precio)} por unidad</small><b>${money(line.product.precio * line.quantity)}</b></div><div class="cart-line-actions"><button data-cart-minus="${line.product.id}" aria-label="Quitar una unidad">−</button><span>${line.quantity}</span><button data-cart-plus="${line.product.id}" aria-label="Agregar una unidad">+</button><button class="remove-item" data-cart-remove="${line.product.id}">Quitar</button></div></article>`).join("") : `<p class="cart-empty">Tu carrito está vacío.<br>¡Descubre productos locales!</p>`;
  $("#cart-subtotal").textContent = money(cart.reduce((sum, line) => sum + line.product.precio * line.quantity, 0));
}

function openCart() {
  $("#cart-drawer").classList.add("open");
  $("#cart-drawer").setAttribute("aria-hidden", "false");
  $("#drawer-backdrop").hidden = false;
}

function closeCart() {
  $("#cart-drawer").classList.remove("open");
  $("#cart-drawer").setAttribute("aria-hidden", "true");
  $("#drawer-backdrop").hidden = true;
}

function addToCart(id) {
  const product = data.find((item) => item.id === Number(id));
  if (!product) return;
  const line = cart.find((item) => item.product.id === product.id);
  if (line) line.quantity += 1;
  else cart.push({ product, quantity: 1 });
  updateCart();
  openCart();
}

const testimonials = [
  ["“Productos frescos, de excelente calidad y con sentido social. ¡Me encanta EcoMarket!”", "Laura Martínez"],
  ["“Comprar aquí me conecta con las familias que cultivan nuestros alimentos.”", "Andrés Rojas"],
  ["“Me encantan los productos locales y saber de dónde vienen.”", "Camila Torres"],
];
let testimonialIndex = 0;
function moveTestimonial(step) {
  testimonialIndex = (testimonialIndex + step + testimonials.length) % testimonials.length;
  $("#quote-text").textContent = testimonials[testimonialIndex][0];
  $("#quote-author").textContent = testimonials[testimonialIndex][1];
  document.querySelectorAll(".testimonial-dots i").forEach((dot, index) => dot.classList.toggle("selected", index === testimonialIndex));
}

async function initialize() {
  fillOptions($("#cat"), categories, "Todas las categorías");
  fillOptions($("#city"), cities, "Todas las ciudades");
  fillOptions($("#category"), categories, "Elige categoría");
  fillOptions($("#town"), cities, "Elige ciudad");
  try {
    const saved = localStorage.getItem(storageKey);
    data = saved ? JSON.parse(saved) : await loadBaseProducts();
  } catch {
    data = [];
    $("#report").textContent = "Abre este proyecto con Live Server para cargar el catálogo.";
  }
  const errors = validarProductos(data);
  if (errors.length) $("#report").textContent = `Hay ${errors.length} registros que necesitan revisión.`;
  draw();
  updateCart();
}

$("#admin-link").addEventListener("click", () => {
  const dashboard = $("#dashboard");
  const isOpening = dashboard.hidden;
  dashboard.hidden = !isOpening;
  document.body.classList.toggle("admin-view", isOpening);
  if (isOpening) {
    draw();
    dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    $("#inicio").scrollIntoView({ behavior: "smooth" });
  }
});
$("#back-to-store")?.addEventListener("click", () => {
  $("#dashboard").hidden = true;
  document.body.classList.remove("admin-view");
  $("#inicio").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll("[data-open-catalog]").forEach((link) => link.addEventListener("click", () => showCatalog("")));
document.querySelectorAll(".category-tile").forEach((button) => button.addEventListener("click", () => showCatalog(button.dataset.cat)));
document.querySelectorAll(".categories [data-cat]").forEach((button) => button.addEventListener("click", () => showCatalog(button.dataset.cat)));
$("#search-toggle").addEventListener("click", () => {
  const search = $("#search-bar");
  const opening = search.hidden;
  search.hidden = !opening;
  $("#search-toggle").setAttribute("aria-expanded", String(opening));
  if (opening) $("#site-search").focus();
});
$("#search-bar").addEventListener("submit", (event) => {
  event.preventDefault();
  showCatalog("");
  $("#search-bar").hidden = true;
  $("#site-search").setAttribute("aria-expanded", "false");
  const query = $("#site-search").value.trim().toLocaleLowerCase("es");
  const results = data.filter((product) => `${product.nombre} ${product.productor} ${product.categoria}`.toLocaleLowerCase("es").includes(query));
  $("#shop").innerHTML = results.map((product) => productCard(product)).join("") || `<p>No encontramos productos para “${escapeHTML(query)}”.</p>`;
});
$("#site-search").addEventListener("input", () => {
  const query = $("#site-search").value.trim().toLocaleLowerCase("es");
  const matches = query ? data.filter((product) => `${product.nombre} ${product.productor}`.toLocaleLowerCase("es").includes(query)).slice(0, 5) : [];
  $("#search-results").innerHTML = matches.map((product) => `<a href="#catalogo" data-search-result="${product.id}"><span>${escapeHTML(product.nombre)}</span><b>${money(product.precio)}</b></a>`).join("") || (query ? `<p>No encontramos ese producto.</p>` : "");
});
$("#search-results").addEventListener("click", (event) => {
  const link = event.target.closest("[data-search-result]");
  if (!link) return;
  $("#site-search").value = data.find((product) => product.id === Number(link.dataset.searchResult))?.nombre || "";
  $("#search-bar").requestSubmit();
});

$("#cart-toggle").addEventListener("click", openCart);
$("#cart-close").addEventListener("click", closeCart);
$("#drawer-backdrop").addEventListener("click", closeCart);
$("#checkout").addEventListener("click", () => {
  if (!cart.length) return;
  closeCart();
  $("#order-modal").showModal();
  cart = [];
  updateCart();
});
$("#login-toggle").addEventListener("click", () => $("#login-modal").showModal());
$("#testimonial-prev").addEventListener("click", () => moveTestimonial(-1));
$("#testimonial-next").addEventListener("click", () => moveTestimonial(1));

["search", "cat", "city", "state"].forEach((id) => $("#" + id).addEventListener("input", draw));
$("#clear").addEventListener("click", () => {
  ["search", "cat", "city", "state"].forEach((id) => $("#" + id).value = "");
  draw();
});
$("#reset-data").addEventListener("click", async () => {
  if (!confirm("¿Restaurar el catálogo inicial? Se borrarán los cambios locales.")) return;
  localStorage.removeItem(storageKey);
  data = await loadBaseProducts();
  draw();
});
$("#add").addEventListener("click", () => {
  $("#form").reset();
  $("#id").value = "";
  $("#form-title").textContent = "Agregar producto";
  $("#modal").showModal();
});
$("#close").addEventListener("click", () => $("#modal").close());
$("#form").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = Number($("#id").value);
  const product = { id: id || Math.max(0, ...data.map((item) => item.id)) + 1, nombre: $("#name").value.trim(), categoria: $("#category").value, precio: Number($("#price").value), stock: Number($("#stock").value), stockMinimo: Number($("#minimum").value), productor: $("#producer").value.trim(), ciudad: $("#town").value, organico: $("#organic").checked, fechaRegistro: "2026-11-03", activo: true };
  data = id ? data.map((item) => item.id === id ? product : item) : [...data, product];
  const errors = validarProductos(data);
  if (errors.length) {
    $("#error").textContent = errors[0].mensaje;
    return;
  }
  localStorage.setItem(storageKey, JSON.stringify(data));
  $("#error").textContent = "";
  draw();
  $("#modal").close();
});

document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-cart-id]");
  if (add) addToCart(add.dataset.cartId);
  const plus = event.target.closest("[data-cart-plus]");
  if (plus) {
    const line = cart.find((item) => item.product.id === Number(plus.dataset.cartPlus));
    if (line) line.quantity += 1;
    updateCart();
  }
  const minus = event.target.closest("[data-cart-minus]");
  if (minus) {
    const line = cart.find((item) => item.product.id === Number(minus.dataset.cartMinus));
    if (line) line.quantity -= 1;
    cart = cart.filter((item) => item.quantity > 0);
    updateCart();
  }
  const remove = event.target.closest("[data-cart-remove]");
  if (remove) {
    cart = cart.filter((item) => item.product.id !== Number(remove.dataset.cartRemove));
    updateCart();
  }
  const edit = event.target.closest("[data-edit]");
  if (edit) {
    const product = data.find((item) => item.id === Number(edit.dataset.edit));
    $("#id").value = product.id;
    $("#name").value = product.nombre;
    $("#category").value = product.categoria;
    $("#price").value = product.precio;
    $("#stock").value = product.stock;
    $("#minimum").value = product.stockMinimo;
    $("#producer").value = product.productor;
    $("#town").value = product.ciudad;
    $("#organic").checked = product.organico;
    $("#form-title").textContent = "Editar producto";
    $("#modal").showModal();
  }
  const removeProduct = event.target.closest("[data-del]");
  if (removeProduct && confirm("¿Eliminar este producto del catálogo?")) {
    data = data.filter((item) => item.id !== Number(removeProduct.dataset.del));
    localStorage.setItem(storageKey, JSON.stringify(data));
    draw();
  }
});

window.addEventListener("resize", () => renderChart(data.filter((product) => product.activo)));
initialize();
