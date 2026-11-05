const { chromium } = require(process.env.ECOMARKET_PLAYWRIGHT_MODULE || "playwright");
const path = require("node:path");

const evidence = path.resolve(__dirname);

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1024, height: 680 } });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("http://127.0.0.1:8767/index.html");
  await page.waitForFunction(() => document.querySelectorAll(".featured-photo img").length === 5);
  await page.screenshot({ path: path.join(evidence, "01-landing.png") });

  await page.locator('.featured-grid [data-cart-id="7"]').click();
  await page.locator(".cart-product-image").waitFor();
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(evidence, "06-carrito.png") });
  await page.locator("#cart-close").click();

  await page.locator('.category-tile[data-cat="Despensa"]').click();
  await page.locator("#catalogo").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(evidence, "02-categoria.png"), fullPage: true });

  await page.locator("#admin-link").click();
  await page.waitForFunction(() => !document.querySelector("#dashboard").hidden);
  await page.screenshot({ path: path.join(evidence, "03-dashboard.png"), fullPage: true });

  await page.locator("#add").click();
  await page.screenshot({ path: path.join(evidence, "04-modal.png") });
  await page.locator("#close").click();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  await mobile.goto("http://127.0.0.1:8767/index.html");
  await mobile.waitForFunction(() => document.querySelectorAll(".featured-photo img").length === 5);
  await mobile.screenshot({ path: path.join(evidence, "05-mobile-390.png"), fullPage: true });

  await browser.close();
  if (pageErrors.length) throw new Error(`Errores de página: ${pageErrors.join("; ")}`);
  console.log("Capturas actualizadas: landing (1024×680), categoría, panel, modal y móvil (390 px). Sin errores de JavaScript.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
