import { chromium } from "playwright";
import path from "node:path";

const OUT = process.env.OUT_DIR || ".";
const URL = "http://localhost:3000/";

const shot = (page, name) =>
  page.screenshot({ path: path.join(OUT, name), type: "png" });

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("CONSOLE.ERROR: " + m.text());
  });

  await page.goto(URL, { waitUntil: "load", timeout: 60000 });

  // wait for the hero loader to disappear (all frames decoded) or 25s cap
  await page
    .waitForFunction(
      () => !document.body.innerText.includes("Firing up the grill"),
      { timeout: 25000 }
    )
    .catch(() => console.log("(loader still visible after 25s)"));
  await page.waitForTimeout(800);
  await shot(page, "01-hero-top.png");

  const docHeight = await page.evaluate(
    () => document.documentElement.scrollHeight
  );
  console.log("doc height:", docHeight);

  const scrollTo = async (y) => {
    await page.evaluate((py) => {
      const l = window.__lenis;
      if (l) l.scrollTo(py, { immediate: true });
      else window.scrollTo(0, py);
    }, y);
    await page.waitForTimeout(1300); // let the SplitText reveal finish
  };

  await scrollTo(450);
  await shot(page, "02-hero-scatter.png");
  await scrollTo(1100);
  await shot(page, "03-hero-sauce.png");
  await scrollTo(1850);
  await shot(page, "04-hero-final.png");

  // menu section: scroll near the bottom-ish then find #menu
  await page.evaluate(() => {
    const el = document.querySelector("#menu");
    window.__lenis
      ? window.__lenis.scrollTo(el, { immediate: true })
      : el?.scrollIntoView();
  });
  await page.waitForTimeout(900);
  await shot(page, "05-menu.png");

  // open featured drawer
  await page.getByRole("button", { name: "Open featured menu" }).click();
  await page.waitForTimeout(800);
  await shot(page, "06-featured-drawer.png");

  // add first featured item to cart
  await page
    .getByRole("button", { name: /add to cart/i })
    .first()
    .click();
  await page.waitForTimeout(400);
  // view bag
  await page.getByRole("button", { name: "View Bag" }).click();
  await page.waitForTimeout(800);
  await shot(page, "07-cart-drawer.png");

  // reservation
  await page.keyboard.press("Escape");
  await page.evaluate(() => {
    const el = document.querySelector("#reservation");
    window.__lenis
      ? window.__lenis.scrollTo(el, { immediate: true })
      : el?.scrollIntoView();
  });
  await page.waitForTimeout(800);
  await shot(page, "08-reservation.png");

  // ---------- mobile pass ----------
  const mpage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    deviceScaleFactor: 3,
    hasTouch: true,
  });
  mpage.on("pageerror", (e) => errors.push("MOBILE PAGEERROR: " + e.message));
  mpage.on("console", (m) => {
    if (m.type() === "error") errors.push("MOBILE CONSOLE.ERROR: " + m.text());
  });
  await mpage.goto(URL, { waitUntil: "load", timeout: 60000 });
  await mpage
    .waitForFunction(() => !document.body.innerText.includes("Firing up the grill"), { timeout: 25000 })
    .catch(() => console.log("(mobile loader still visible)"));
  await mpage.waitForTimeout(2200);
  await shot(mpage, "10-mobile-hero.png");
  await mpage.evaluate(() => window.__lenis?.scrollTo(500, { immediate: true }));
  await mpage.waitForTimeout(1400);
  await shot(mpage, "11-mobile-hero-scroll.png");
  await mpage.evaluate(() => {
    const el = document.querySelector("#menu");
    window.__lenis ? window.__lenis.scrollTo(el, { immediate: true }) : el?.scrollIntoView();
  });
  await mpage.waitForTimeout(900);
  await shot(mpage, "12-mobile-menu.png");

  await browser.close();

  console.log("\n=== ERRORS (" + errors.length + ") ===");
  console.log(errors.length ? errors.join("\n") : "none 🎉");
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
