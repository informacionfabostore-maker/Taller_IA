const { chromium } = require(process.env.ECOMARKET_PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
let browser;

(async () => {
  browser = await chromium.launch({
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1024, height: 680 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:8767/index.html");
  await page.waitForFunction(() => document.querySelectorAll(".featured-photo img").length === 5);
  assert.equal(await page.locator("#dashboard").isVisible(), false);
  assert.equal(await page.locator(".featured-photo img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), true);

  await page.locator('.featured-grid [data-cart-id="7"]').click();
  assert.equal(await page.locator("#cart-drawer").evaluate((drawer) => drawer.classList.contains("open")), true);
  assert.equal(await page.locator(".cart-product-image").count(), 1);
  const cartImageStyle = await page.locator(".cart-product-image").evaluate((element) => ({ radius: getComputedStyle(element).borderRadius, overlay: getComputedStyle(element, "::after").backgroundImage }));
  assert.equal(cartImageStyle.radius, "14px");
  assert.match(cartImageStyle.overlay, /linear-gradient/);
  await page.locator('[data-cart-plus="7"]').click();
  assert.equal(await page.locator("#cart-count").innerText(), "2");
  await page.locator("#cart-close").click();

  await page.locator('.category-tile[data-cat="Despensa"]').click();
  await page.waitForFunction(() => !document.querySelector("#catalogo").hidden);
  assert.equal(await page.locator("#shop .card").count(), 13);
  await page.locator('.categories [data-cat=""]').click();
  assert.equal(await page.locator("#shop .card").count(), 35);
  assert.equal(await page.locator("#shop .product-thumb").count(), 35);
  assert.equal(await page.locator("#shop .product-thumb").evaluateAll((images) => images.every((image) => getComputedStyle(image).backgroundImage.includes("productos-"))), true);

  await page.locator("#admin-link").click();
  assert.equal(await page.locator("#total").innerText(), "35");
  await page.locator("#search").fill("café");
  assert.equal(await page.locator("#admin .card").count(), 2);
  await page.locator("#clear").click();
  await page.locator("#add").click();
  await page.locator("#name").fill("Prueba de catálogo");
  await page.locator("#category").selectOption({ label: "Despensa" });
  await page.locator("#price").fill("9000");
  await page.locator("#stock").fill("12");
  await page.locator("#minimum").fill("4");
  await page.locator("#producer").fill("Productor Prueba");
  await page.locator("#town").selectOption({ label: "Bogotá" });
  await page.locator("#form button.button").click();
  assert.equal(await page.locator("#total").innerText(), "36");
  await page.reload();
  await page.locator("#admin-link").click();
  assert.equal(await page.locator("#total").innerText(), "36");
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator('[data-del="36"]').click();
  assert.equal(await page.locator("#total").innerText(), "35");
  await page.evaluate(() => localStorage.removeItem("eco-v1"));

  const localFile = await browser.newPage({ viewport: { width: 1024, height: 680 } });
  await localFile.goto("file:///C:/Users/Asus/Desktop/Taller_IA/index.html");
  await localFile.locator('.primary-nav [data-open-catalog]').click();
  assert.equal(await localFile.locator("#shop .card").count(), 35);

  await browser.close();
  assert.deepEqual(errors, []);
  console.log("PASS: landing, 35 imágenes de producto, filtros, carrito e imagen redondeada con degradado, búsqueda, CRUD, localStorage y apertura directa de index.html; sin errores JS.");
})().catch(async (error) => {
  await browser?.close();
  console.error(error);
  process.exitCode = 1;
});
