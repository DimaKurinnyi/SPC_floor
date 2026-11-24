// Renders documents/karta-techniczna/karta-techniczna.html to public/docs/karta-techniczna-spc.pdf
// (A4, two pages) with headless Chromium. Company details come from src/content/company.ts, so the
// PDF matches the site; rerun `npm run docs:pdf` after changing them or the template.
// Chromium: set CHROMIUM_PATH, or Playwright's own browser is used (`npx playwright install chromium`).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { company, companyAddress } from "../src/content/company.ts";

const root = join(import.meta.dirname, "..");
const templatePath = join(root, "documents/karta-techniczna/karta-techniczna.html");
const outPath = join(root, "public/docs/karta-techniczna-spc.pdf");

// The site address is printed only once it is a real domain.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const website = /localhost|127\.0\.0\.1/.test(siteUrl) ? "" : siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

const issued = new Intl.DateTimeFormat("pl-PL", { month: "2-digit", year: "numeric" }).format(new Date());

const values = {
  brand: company.brand,
  legalName: company.legalName,
  address: companyAddress,
  krs: company.krs,
  nip: company.nip,
  bdo: company.bdo ?? "",
  phone: company.phone,
  email: company.email,
  website,
  issued,
};

const escapeHtml = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

let html = await readFile(templatePath, "utf8");
// Drop optional blocks whose value is empty, then fill the placeholders.
html = html.replace(/<!--if:(\w+)-->([\s\S]*?)<!--\/if:\1-->/g, (_, key, block) => (values[key] ? block : ""));
html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
  if (!(key in values)) throw new Error(`Unknown placeholder ${match}`);
  return escapeHtml(values[key]);
});

// Write next to the template so the relative font paths resolve.
const renderedPath = join(root, "documents/karta-techniczna/.rendered.html");
await writeFile(renderedPath, html);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(renderedPath).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await mkdir(join(root, "public/docs"), { recursive: true });
  await page.pdf({ path: outPath, format: "A4", printBackground: true, preferCSSPageSize: true });
} finally {
  await browser.close();
}
console.log(`Wrote ${outPath}`);
