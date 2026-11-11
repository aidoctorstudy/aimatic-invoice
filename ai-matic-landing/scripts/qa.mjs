// Full-device QA sweep. Run against a production build (`npm run build && npm run start`),
// not the dev server — dev-mode overhead and HMR noise would skew both the screenshots and
// the perf-adjacent checks (3D canvas visibility, console errors).
//
// Usage: node scripts/qa.mjs [baseUrl]   (baseUrl defaults to http://localhost:3000)

import { chromium } from "playwright";
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "qa-screenshots");
const BASE_URL = process.argv[2] || "http://localhost:3000";
const LOCALES = ["en", "ar"];
const MIN_TAP_SIZE = 44;

const DEVICES = [
  // Phones
  { name: "iphone-se", width: 375, height: 667, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "iphone-15-pro", width: 393, height: 852, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  { name: "iphone-15-pro-max", width: 430, height: 932, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  { name: "galaxy-s24", width: 360, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  { name: "pixel-7", width: 412, height: 915, isMobile: true, hasTouch: true, deviceScaleFactor: 2.625 },
  { name: "low-end-android", width: 360, height: 640, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "galaxy-z-fold-6-folded", width: 344, height: 882, isMobile: true, hasTouch: true, deviceScaleFactor: 2.6 },
  { name: "galaxy-z-fold-6-unfolded", width: 882, height: 1104, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  // Tablets
  { name: "ipad-mini", width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "ipad-pro-11", width: 834, height: 1194, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "ipad-pro-11-landscape", width: 1194, height: 834, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  // Laptops / desktops
  { name: "small-laptop-1280x720", width: 1280, height: 720, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
  { name: "laptop-1440x900", width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
  { name: "full-hd-1920x1080", width: 1920, height: 1080, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
  { name: "2k-2560x1440", width: 2560, height: 1440, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
];

async function scrollThroughPage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewport = page.viewportSize().height;
  const steps = Math.max(4, Math.ceil(height / viewport));
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((height / steps) * i));
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

async function checkOverflow(page) {
  return page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    if (docWidth <= clientWidth + 1) return null;
    return { docWidth, clientWidth, overflowBy: docWidth - clientWidth };
  });
}

// Decorative elements that intentionally bleed past their container (a blurred glow, an
// animated sheen sweeping fully off-screen) and are already safely clipped by body's own
// `overflow-x: hidden` — real overflow bugs, not these, are what this check is for.
const INTENTIONAL_BLEED = ["pricing-glow", "-translate-x-full", "rtl:translate-x-full"];

async function checkOverflowingElements(page) {
  return page.evaluate((exemptClasses) => {
    const vw = document.documentElement.clientWidth;
    const results = [];
    for (const el of document.querySelectorAll("body *")) {
      const style = getComputedStyle(el);
      if (style.position === "fixed") continue; // viewport-pinned by design, not page overflow
      const cls = (el.className || "").toString();
      if (exemptClasses.some((c) => cls.includes(c))) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      if (r.right > vw + 3 || r.left < -3) {
        results.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 60),
          text: (el.textContent || "").trim().slice(0, 40),
          right: Math.round(r.right),
          left: Math.round(r.left),
        });
      }
    }
    // De-dupe by tag+class — a parent and its overflowing child both match otherwise.
    const seen = new Set();
    return results.filter((r) => {
      const key = `${r.tag}.${r.cls}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);
  }, INTENTIONAL_BLEED);
}

async function checkClippedText(page) {
  return page.evaluate(() => {
    const results = [];
    for (const el of document.querySelectorAll("h1,h2,h3,h4,p,span,a,button,li,dt,dd")) {
      const style = getComputedStyle(el);
      if (style.overflow !== "hidden" && style.overflowX !== "hidden" && style.overflowY !== "hidden") continue;
      if (style.textOverflow === "ellipsis") continue; // intentional truncation, not a bug
      if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        results.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || "").trim().slice(0, 40),
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
        });
      }
    }
    return results.slice(0, 10);
  });
}

async function checkTapTargets(page) {
  return page.evaluate((minSize) => {
    const results = [];
    for (const el of document.querySelectorAll("button, a")) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      // WCAG 2.5.8 exempts a link that sits inline within a sentence/block of running text —
      // enlarging "Source: <link>" to 44px would just misalign the hit area from the word.
      if (el.tagName === "A" && el.parentElement?.tagName === "P") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue; // not rendered / zero-size by design
      if (r.height < minSize || r.width < minSize) {
        results.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40),
          width: Math.round(r.width),
          height: Math.round(r.height),
        });
      }
    }
    const seen = new Set();
    return results.filter((r) => {
      const key = `${r.tag}:${r.text}:${r.width}x${r.height}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 15);
  }, MIN_TAP_SIZE);
}

async function checkCanvas(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const r = canvas.getBoundingClientRect();
      const style = getComputedStyle(canvas);
      const visible =
        r.width > 10 &&
        r.height > 10 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        parseFloat(style.opacity) > 0;
      const inViewport = r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
      return { present: true, mode: "webgl", visible, inViewport, width: Math.round(r.width), height: Math.round(r.height) };
    }
    // No <canvas> at all means WebGL was unavailable (commonly true in a headless/no-GPU CI
    // browser, which is intentionally treated as "no WebGL" — see lib/useWebglSupport.ts) and
    // the app fell back to a static illustration instead. That's correct behavior, not a bug,
    // as long as the fallback is actually there.
    const fallback = document.querySelector('[aria-label="Illustration of a particle network"]');
    if (fallback) {
      const r = fallback.getBoundingClientRect();
      return { present: true, mode: "fallback", visible: r.width > 10 && r.height > 10, inViewport: true };
    }
    return { present: false };
  });
}

async function openDemoModal(page) {
  const trigger = page.getByRole("button", { name: /request a demo|طلب عرض تجريبي/i }).first();
  if ((await trigger.count()) === 0) return false;
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click({ force: true });
  const dialog = page.locator('[role="dialog"]');
  try {
    await dialog.waitFor({ state: "visible", timeout: 3000 });
    await page.waitForTimeout(250);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const issues = [];
  const manifest = [];

  for (const device of DEVICES) {
    for (const locale of LOCALES) {
      const label = `${device.name} / ${locale}`;
      console.log(`→ ${label}`);
      const dir = path.join(OUT_DIR, device.name);
      await mkdir(dir, { recursive: true });

      const context = await browser.newContext({
        viewport: { width: device.width, height: device.height },
        isMobile: device.isMobile,
        hasTouch: device.hasTouch,
        deviceScaleFactor: device.deviceScaleFactor,
        locale: locale === "ar" ? "ar-AE" : "en-US",
      });
      const page = await context.newPage();

      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 200));
      });
      page.on("pageerror", (err) => consoleErrors.push(String(err).slice(0, 200)));

      try {
        await page.goto(`${BASE_URL}/${locale}`, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForSelector("canvas", { timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(1200); // let the 3D scene settle into its first shape

        await scrollThroughPage(page);

        const canvasInfo = await checkCanvas(page);
        if (!canvasInfo.present) {
          issues.push({ label, type: "canvas-missing", detail: "No <canvas> element found on page" });
        } else if (!canvasInfo.visible || !canvasInfo.inViewport) {
          issues.push({ label, type: "canvas-not-visible", detail: JSON.stringify(canvasInfo) });
        }

        const overflow = await checkOverflow(page);
        if (overflow) {
          issues.push({ label, type: "horizontal-scroll", detail: JSON.stringify(overflow) });
        }

        const overflowingEls = await checkOverflowingElements(page);
        for (const el of overflowingEls) {
          issues.push({
            label,
            type: "element-overflow",
            detail: `<${el.tag} class="${el.cls}"> "${el.text}" right=${el.right} left=${el.left}`,
          });
        }

        const clipped = await checkClippedText(page);
        for (const c of clipped) {
          issues.push({
            label,
            type: "text-clipped",
            detail: `<${c.tag}> "${c.text}" scrollWidth=${c.scrollW} clientWidth=${c.clientW}`,
          });
        }

        if (device.hasTouch) {
          const smallTargets = await checkTapTargets(page);
          for (const t of smallTargets) {
            issues.push({
              label,
              type: "tap-target-too-small",
              detail: `<${t.tag}> "${t.text}" ${t.width}x${t.height}px (min ${MIN_TAP_SIZE}px)`,
            });
          }
        }

        // Full-page screenshot
        await page.screenshot({ path: path.join(dir, `${locale}-full.png`), fullPage: true });

        // Hero section only
        const hero = page.locator("#top");
        if (await hero.count()) {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(300);
          await hero.screenshot({ path: path.join(dir, `${locale}-hero.png`) }).catch((e) => {
            issues.push({ label, type: "screenshot-failed", detail: `hero: ${e.message.slice(0, 150)}` });
          });
        }

        // Pricing section only (includes the particle coin, rendered on the fixed canvas behind it)
        const pricing = page.locator("#pricing");
        if (await pricing.count()) {
          await pricing.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);
          await pricing.screenshot({ path: path.join(dir, `${locale}-pricing.png`) }).catch((e) => {
            issues.push({ label, type: "screenshot-failed", detail: `pricing: ${e.message.slice(0, 150)}` });
          });
        }

        // Demo modal
        const opened = await openDemoModal(page);
        if (opened) {
          await page.screenshot({ path: path.join(dir, `${locale}-modal.png`) });
          await page.keyboard.press("Escape").catch(() => {});
        } else {
          issues.push({ label, type: "modal-failed", detail: "Could not open the demo modal" });
        }

        if (consoleErrors.length) {
          for (const e of [...new Set(consoleErrors)].slice(0, 5)) {
            issues.push({ label, type: "console-error", detail: e });
          }
        }

        manifest.push({ device: device.name, locale, width: device.width, height: device.height });
      } catch (err) {
        issues.push({ label, type: "fatal", detail: String(err).slice(0, 300) });
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  await writeFile(path.join(OUT_DIR, "manifest.json"), JSON.stringify({ devices: DEVICES, manifest }, null, 2));
  await writeFile(path.join(OUT_DIR, "issues.json"), JSON.stringify(issues, null, 2));
  await writeFile(path.join(ROOT, "QA-REPORT.md"), buildReportMd(issues, DEVICES));
  console.log(`\nDone. ${issues.length} issue(s) found. See QA-REPORT.md.`);
}

function buildReportMd(issues, devices) {
  const date = new Date().toISOString().slice(0, 16).replace("T", " ");
  if (issues.length === 0) {
    return `# QA Report\n\nGenerated ${date} UTC · ${devices.length} devices × en/ar\n\n✅ No problems found across all devices and locales.\n`;
  }

  const byType = new Map();
  for (const issue of issues) {
    if (!byType.has(issue.type)) byType.set(issue.type, []);
    byType.get(issue.type).push(issue);
  }

  const typeTitles = {
    "horizontal-scroll": "Horizontal scroll (document wider than viewport)",
    "element-overflow": "Elements overflowing the viewport",
    "text-clipped": "Text overlapping / cut off",
    "tap-target-too-small": `Tap targets under ${MIN_TAP_SIZE}px`,
    "canvas-not-visible": "3D canvas not visible / cut off",
    "canvas-missing": "3D canvas missing entirely",
    "console-error": "Console errors",
    "modal-failed": "Demo modal failed to open",
    "screenshot-failed": "Screenshot capture failed",
    fatal: "Fatal errors (page failed to load/run)",
  };

  let md = `# QA Report\n\nGenerated ${date} UTC · ${devices.length} devices × en/ar · **${issues.length} issue(s)**\n\n`;
  for (const [type, list] of byType) {
    md += `## ${typeTitles[type] || type} (${list.length})\n\n`;
    for (const issue of list) {
      md += `- **${issue.label}** — ${issue.detail}\n`;
    }
    md += "\n";
  }
  return md;
}

run();
