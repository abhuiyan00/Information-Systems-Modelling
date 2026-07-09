// Static export: render every page in the sitemap to dist/ and copy the shared
// assets. This is the "server-rendered snapshot for crawlers" deliverable — now
// a build artifact generated from data, not hand-maintained HTML.

import { mkdir, copyFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { ASSETS, sitemap } from "../src/sitemap.js";

const root = dirname(fileURLToPath(import.meta.url));
const appDir = join(root, "..");
const dist = join(appDir, "dist");

async function main() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(join(dist, "vocabulary"), { recursive: true });

  const pages = sitemap();
  for (const page of pages) {
    await writeFile(join(dist, page.path), page.render(), "utf8");
  }

  for (const asset of ASSETS) {
    await copyFile(join(appDir, asset.from), join(dist, asset.to));
  }

  console.log(`Built ${pages.length} pages + ${ASSETS.length} assets -> app/dist/`);
  for (const p of pages) console.log(`  ${p.path}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
