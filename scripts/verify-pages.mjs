import { chromium } from "playwright";
import path from "node:path";

const OUT = process.env.OUT_DIR || ".";
const BASE = "http://localhost:3000";
const shot = (p, n) => p.screenshot({ path: path.join(OUT, n), type: "png" });

const errors = [];
const watch = (p, tag) => {
  p.on("pageerror", (e) => errors.push(`${tag} PAGEERROR: ${e.message}`));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(`${tag} CONSOLE: ${m.text()}`);
  });
};

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, "[desktop]");

  // HOME — wait out the hero loader, then scroll through the new sections
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  await page
    .waitForFunction(() => !document.body.innerText.includes("Firing up the grill"), { timeout: 25000 })
    .catch(() => {});
  await page.waitForTimeout(800);
  for (const [name, y] of [
    ["20-home-lineup", 1700],
    ["21-home-menu", 3100],
    ["22-home-steps", 4300],
    ["23-home-deals", 5200],
    ["24-home-testimonials", 6100],
    ["25-home-reserve", 7000],
    ["26-home-footer", 9000],
  ]) {
    await page.evaluate((py) => (window.__lenis ? window.__lenis.scrollTo(py, { immediate: true }) : window.scrollTo(0, py)), y);
    await page.waitForTimeout(700);
    await shot(page, name + ".png");
  }

  const go = async (url, name, wait = 900) => {
    await page.goto(BASE + url, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(wait);
    await shot(page, name + ".png");
  };

  await go("/food/super-charger-burger", "30-food");
  // customise + add to order
  await page.getByRole("button", { name: /Hot/ }).first().click().catch(() => {});
  await page.getByText("Smoked Bacon").click().catch(() => {});
  await page.getByRole("button", { name: /Add to Order/i }).click();
  await page.waitForTimeout(900);
  await shot(page, "31-food-added-cart.png");

  await go("/deals", "32-deals");
  await go("/reservations", "33-reservations");
  await go("/cart", "34-cart");

  await go("/checkout", "35-checkout");
  await page.fill('input[placeholder="Jane Smith"]', "Alex Johnson").catch(() => {});
  await page.fill('input[placeholder="+44…"]', "07700900123").catch(() => {});
  await page.fill('input[placeholder*="Baker Street"]', "12 Baker Street, London").catch(() => {});
  await page.getByRole("button", { name: /Place Order/i }).click();
  await page.waitForTimeout(1500);
  await shot(page, "36-order-confirmed.png");
  console.log("after checkout url:", page.url());

  // MOBILE
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 3, hasTouch: true });
  watch(m, "[mobile]");
  await m.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  await m.waitForFunction(() => !document.body.innerText.includes("Firing up the grill"), { timeout: 25000 }).catch(() => {});
  await m.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(3000, { immediate: true }) : window.scrollTo(0, 3000)));
  await m.waitForTimeout(800);
  await shot(m, "40-mobile-home.png");
  await m.goto(BASE + "/food/bbq-burger", { waitUntil: "load" });
  await m.waitForTimeout(900);
  await shot(m, "41-mobile-food.png");
  await m.goto(BASE + "/reservations", { waitUntil: "load" });
  await m.waitForTimeout(800);
  await shot(m, "42-mobile-reservations.png");

  await browser.close();
  console.log("\n=== ERRORS (" + errors.length + ") ===");
  console.log(errors.length ? errors.join("\n") : "none 🎉");
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
