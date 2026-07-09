// Shared RDFa view fragments. Every page is assembled from these, so the markup
// that carries the semantics is written once and reused — the opposite of the
// old per-file hand-copied snapshots.

import { RDFA_PREFIX, SCHEMA } from "../ns.js";
import { pageForBuild, pageForUser, userById } from "../model.js";
import { vocabMap } from "../rdf/vocabmap.js";
import { esc, html } from "./html.js";

const NAV = [
  { href: "index.html", label: "Home", key: "home" },
  { href: "builds.html", label: "Explore", key: "builds" },
  { href: "marketplace.html", label: "Marketplace", key: "marketplace" },
  { href: "testrun.html", label: "Test Runs", key: "testrun" },
  { href: "member-alice.html", label: "Members", key: "members" },
];

export function navBar(active) {
  const links = NAV.map(
    (n) =>
      `<a href="${n.href}"${n.key === active ? ' class="active"' : ""}>${n.label}</a>`
  ).join("\n    ");
  return html`<nav>
    <a href="index.html" class="site-footer-brand" style="text-decoration:none">✈ ModellingClub</a>
    <span class="sep">|</span>
    ${links}
  </nav>`;
}

export const footer = () => html`<footer class="site-footer">
    <div class="site-footer-copy">ModellingClub — semantic data published with RDFa 1.1 + JSON-LD (schema.org + custom mc: vocabulary).</div>
  </footer>`;

// Author byline as an RDFa resource node (schema:author -> mcr:user-…).
export function personInline(id) {
  const u = userById(id);
  return html`<span rel="author" resource="mcr:${id}"><span property="name">${esc(u.username)}</span></span>`;
}

// One build card inside an ItemList (home + explore grids).
export function buildCard(b, position) {
  return html`<a href="${pageForBuild(b)}" class="build-card" property="itemListElement" typeof="ListItem">
        <meta property="position" content="${position}">
        <div class="build-card-cover">
          <div class="build-card-cover-empty"><span class="emoji">${b.emoji}</span></div>
          <span class="badge ${b.statusBadge} build-card-status">${b.status.display}</span>
        </div>
        <div class="build-card-body" rel="item" resource="mcr:${b.id}" typeof="CreativeWork ${b.mcType}">
          <div class="build-card-title-row">
            <h3 class="build-card-title" property="name">${esc(b.name)}</h3>
            <span class="badge ${b.genreBadge}" property="genre">${esc(b.genre)}</span>
          </div>
          <p class="build-card-desc" property="description">${esc(b.description)}</p>
          <div class="build-card-meta"><span>by ${personInline(b.author)}</span></div>
        </div>
      </a>`;
}

// Full HTML document shell: RDFa vocab/prefix on <html>, every JSON-LD graph in
// <head>, and an auto-generated VOCAB MAP comment derived from those graphs.
export function layout({ title, jsonld = [], body, active, topComment = "", bodyAttrs = "" }) {
  const graphs = Array.isArray(jsonld) ? jsonld : [jsonld];
  const scripts = graphs
    .filter(Boolean)
    .map(
      (g) =>
        `  <script type="application/ld+json">\n${JSON.stringify(g, null, 2)}\n  </script>`
    )
    .join("\n");
  const maps = graphs.filter(Boolean).map((g) => vocabMap(g)).join("\n");

  return `<!doctype html>
${topComment ? topComment + "\n" : ""}<html lang="en"
      vocab="${SCHEMA}"
      prefix="${RDFA_PREFIX}">
<head>
  <meta charset="utf-8">
  <title>${esc(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="styles.css">

${scripts}
</head>
<body${bodyAttrs ? " " + bodyAttrs : ""}>
${maps}
  ${navBar(active)}

  <div class="page-wrapper">
${body}
  </div>

  ${footer()}
</body>
</html>
`;
}
