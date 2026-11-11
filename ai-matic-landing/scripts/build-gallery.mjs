// Builds qa-screenshots/index.html from the manifest + issues produced by scripts/qa.mjs.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "qa-screenshots");

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function run() {
  const manifestRaw = JSON.parse(await readFile(path.join(OUT_DIR, "manifest.json"), "utf8"));
  const issues = JSON.parse(await readFile(path.join(OUT_DIR, "issues.json"), "utf8"));
  const { devices, manifest } = manifestRaw;

  const issuesByDevice = new Map();
  for (const issue of issues) {
    const deviceName = issue.label.split(" / ")[0];
    if (!issuesByDevice.has(deviceName)) issuesByDevice.set(deviceName, []);
    issuesByDevice.get(deviceName).push(issue);
  }

  const cards = devices
    .map((device) => {
      const runs = manifest.filter((m) => m.device === device.name);
      if (!runs.length) return "";
      const deviceIssues = issuesByDevice.get(device.name) || [];
      const issueBadge = deviceIssues.length
        ? `<span class="badge badge-bad">${deviceIssues.length} issue${deviceIssues.length === 1 ? "" : "s"}</span>`
        : `<span class="badge badge-ok">clean</span>`;

      const localeBlocks = ["en", "ar"]
        .filter((l) => runs.some((r) => r.locale === l))
        .map(
          (locale) => `
          <div class="locale-block">
            <h4>${locale.toUpperCase()}</h4>
            <div class="shots">
              <a href="${device.name}/${locale}-full.png" target="_blank"><img loading="lazy" src="${device.name}/${locale}-full.png" alt="${device.name} ${locale} full page"><span>full page</span></a>
              <a href="${device.name}/${locale}-hero.png" target="_blank"><img loading="lazy" src="${device.name}/${locale}-hero.png" alt="${device.name} ${locale} hero"><span>hero</span></a>
              <a href="${device.name}/${locale}-pricing.png" target="_blank"><img loading="lazy" src="${device.name}/${locale}-pricing.png" alt="${device.name} ${locale} pricing"><span>pricing</span></a>
              <a href="${device.name}/${locale}-modal.png" target="_blank"><img loading="lazy" src="${device.name}/${locale}-modal.png" alt="${device.name} ${locale} modal"><span>demo modal</span></a>
            </div>
          </div>`
        )
        .join("");

      const issueList = deviceIssues.length
        ? `<ul class="issue-list">${deviceIssues
            .map((i) => `<li><strong>${esc(i.type)}</strong> (${esc(i.label.split(" / ")[1])}) — ${esc(i.detail)}</li>`)
            .join("")}</ul>`
        : "";

      return `
        <section class="device-card" id="${device.name}">
          <h2>${device.name} <span class="dims">${device.width}×${device.height}</span> ${issueBadge}</h2>
          ${localeBlocks}
          ${issueList}
        </section>`;
    })
    .join("\n");

  const totalIssues = issues.length;
  const nav = devices.map((d) => `<a href="#${d.name}">${d.name}</a>`).join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Matic — QA Gallery</title>
<style>
  :root { --border:#e2e8f0; --muted:#64748b; --bg:#f8fafc; --ok:#15803d; --bad:#b91c1c; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: -apple-system, Segoe UI, Arial, sans-serif; background:var(--bg); color:#0f172a; }
  header { position:sticky; top:0; z-index:10; background:#fff; border-bottom:1px solid var(--border); padding:16px 24px; }
  header h1 { margin:0 0 4px; font-size:20px; }
  header p { margin:0; color:var(--muted); font-size:13px; }
  nav { display:flex; flex-wrap:wrap; gap:6px; padding:10px 24px; background:#fff; border-bottom:1px solid var(--border); position:sticky; top:62px; z-index:9; }
  nav a { font-size:12px; color:#334155; text-decoration:none; padding:4px 8px; border-radius:6px; background:#eef2f7; }
  nav a:hover { background:#dbe4ef; }
  main { padding:24px; max-width:1400px; margin:0 auto; }
  .device-card { background:#fff; border:1px solid var(--border); border-radius:12px; padding:20px; margin-bottom:24px; }
  .device-card h2 { margin:0 0 14px; font-size:17px; display:flex; align-items:center; gap:10px; }
  .dims { font-weight:400; color:var(--muted); font-size:13px; }
  .badge { font-size:11px; font-weight:600; padding:2px 8px; border-radius:999px; }
  .badge-ok { background:#dcfce7; color:var(--ok); }
  .badge-bad { background:#fee2e2; color:var(--bad); }
  .locale-block h4 { margin:14px 0 8px; font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); }
  .shots { display:flex; gap:12px; flex-wrap:wrap; }
  .shots a { display:flex; flex-direction:column; align-items:center; gap:4px; text-decoration:none; color:#334155; font-size:11px; }
  .shots img { width:160px; max-height:220px; object-fit:cover; object-position:top; border:1px solid var(--border); border-radius:6px; background:#f1f5f9; }
  .issue-list { margin:14px 0 0; padding:10px 14px; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; font-size:12px; line-height:1.6; }
  .issue-list li { margin-bottom:2px; }
</style>
</head>
<body>
<header>
  <h1>AI Matic — Device QA Gallery</h1>
  <p>${devices.length} devices × en/ar · ${totalIssues} issue${totalIssues === 1 ? "" : "s"} found</p>
</header>
<nav>${nav}</nav>
<main>
${cards}
</main>
</body>
</html>`;

  await writeFile(path.join(OUT_DIR, "index.html"), html);
  console.log("Gallery written to qa-screenshots/index.html");
}

run();
