const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
  const p = await b.newPage({ viewport: { width: 1360, height: 950 } });
  await p.goto("http://127.0.0.1:8767/index.html");
  await p.waitForTimeout(800);
  await p.screenshot({
    path: "C:/Users/Asus/Desktop/Taller_IA/evidencias/01-landing.png",
    fullPage: true,
  });
  await p.locator('.category-links [data-cat="Despensa"]').click();
  await p.screenshot({
    path: "C:/Users/Asus/Desktop/Taller_IA/evidencias/02-categoria.png",
    fullPage: true,
  });
  await p.locator("#admin-link").click();
  await p.waitForTimeout(300);
  await p.screenshot({
    path: "C:/Users/Asus/Desktop/Taller_IA/evidencias/03-dashboard.png",
    fullPage: true,
  });
  await p.locator("#add").click();
  await p.screenshot({
    path: "C:/Users/Asus/Desktop/Taller_IA/evidencias/04-modal.png",
    fullPage: true,
  });
  await b.close();
  console.log("Capturas guardadas");
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

