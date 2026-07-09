// Loads the single source of truth (data/*.json) and exposes typed lookups.
// Every page and every RDF serialiser reads from here — there is no hand-written
// markup carrying its own copy of the data.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dataDir = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
const load = (file) => JSON.parse(readFileSync(join(dataDir, file), "utf8"));

export const site = load("site.json");
export const users = load("users.json");
export const communities = load("communities.json");
export const builds = load("builds.json");
export const listings = load("marketplace.json");
export const testRuns = load("testruns.json");

// ── Lookups ────────────────────────────────────────────────────────────────
export const userById = (id) => (users[id] ? { id, ...users[id] } : null);
export const communityById = (id) =>
  communities[id] ? { id, ...communities[id] } : null;
export const buildById = (id) => builds.find((b) => b.id === id) || null;
export const buildBySlug = (slug) => builds.find((b) => b.slug === slug) || null;
export const listingById = (id) => listings.find((l) => l.id === id) || null;
export const testRunById = (id) => testRuns.find((t) => t.id === id) || null;
export const testRunBySlug = (slug) =>
  testRuns.find((t) => t.slug === slug) || null;

// Builds authored by a given user (drives the member profile, no duplication).
export const buildsByAuthor = (userId) =>
  builds.filter((b) => b.author === userId);

// ── Canonical page paths (one definition, reused for links + static export) ──
export const pageForBuild = (b) => `build-${b.slug}.html`;
export const pageForUser = (id) => `member-${users[id].username}.html`;
export const pageForTestRun = (t) => `testrun.html`; // single test-run page today

// Resolve a resource IRI local-name (e.g. "build-falcon", "user-alice") to the
// HTML document that represents it — used by Linked-Data content negotiation.
export function pageForResource(localName) {
  const b = buildById(localName);
  if (b) return pageForBuild(b);
  if (users[localName]) return pageForUser(localName);
  const t = testRunById(localName);
  if (t) return pageForTestRun(t);
  const l = listingById(localName);
  if (l) return "marketplace.html";
  return null;
}
