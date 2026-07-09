// Single route table: maps each output filename to the renderer that produces
// it. The dev server and the static exporter both iterate this list, so a page
// added here appears in BOTH without further wiring. Adding a build/member to
// the data automatically adds its page here.

import { builds, listings, testRuns, users } from "./model.js";
import {
  buildDetailPage,
  buildsPage,
  homePage,
  marketplacePage,
  memberPage,
  testRunPage,
} from "./views/pages.js";

export function sitemap() {
  const pages = [
    { path: "index.html", render: homePage },
    { path: "builds.html", render: buildsPage },
    { path: "marketplace.html", render: marketplacePage },
    { path: "testrun.html", render: () => testRunPage(testRuns[0]) },
  ];

  for (const b of builds) {
    pages.push({ path: `build-${b.slug}.html`, render: () => buildDetailPage(b) });
  }
  for (const id of Object.keys(users)) {
    pages.push({ path: `member-${users[id].username}.html`, render: () => memberPage(id) });
  }
  return pages;
}

// Static assets copied verbatim into the export (reused from the lab6 root).
export const ASSETS = [
  { from: "../styles.css", to: "styles.css" },
  { from: "../vocabulary/ontology.ttl", to: "vocabulary/ontology.ttl" },
  { from: "../vocabulary/mc-context.jsonld", to: "vocabulary/mc-context.jsonld" },
];
