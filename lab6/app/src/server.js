// Dynamic SSR server. Pages are rendered per request from the data model, and
// every resource IRI is dereferenceable with content negotiation (W3C Linked
// Data best practice): a browser (Accept: text/html) is redirected to the human
// page, while an RDF client (Accept: application/ld+json) gets the data graph at
// the same /resource/<id> URL. Zero dependencies — built-in node:http only.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, normalize } from "node:path";

import { CONTEXT_FULL } from "./ns.js";
import {
  buildById,
  listingById,
  pageForResource,
  testRunById,
  users,
} from "./model.js";
import {
  buildGraph,
  listingNode,
  memberGraph,
  testRunGraph,
  withContext,
} from "./rdf/jsonld.js";
import { sitemap } from "./sitemap.js";

const root = dirname(fileURLToPath(import.meta.url));
const labRoot = join(root, "..", ".."); // lab6/  (styles.css, vocabulary/)
const PORT = process.env.PORT || 3000;

const ROUTES = new Map(sitemap().map((p) => [p.path, p.render]));

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".ttl": "text/turtle; charset=utf-8",
  ".jsonld": "application/ld+json; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

// JSON-LD graph for a dereferenced resource IRI local-name.
function resourceGraph(localName) {
  const b = buildById(localName);
  if (b) return withContext(buildGraph(b));
  if (users[localName]) return withContext(memberGraph(localName));
  const t = testRunById(localName);
  if (t) return testRunGraph(t);
  const l = listingById(localName);
  if (l) return withContext(listingNode(l), CONTEXT_FULL);
  return null;
}

const wantsRdf = (accept) =>
  /application\/ld\+json|application\/json|text\/turtle/.test(accept || "");

function send(res, status, type, body) {
  res.writeHead(status, { "content-type": type, "access-control-allow-origin": "*" });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let path = decodeURIComponent(url.pathname);
    if (path === "/") path = "/index.html";
    const name = path.slice(1);

    // ── Linked Data: dereferenceable resource IRIs ──────────────────────────
    if (path.startsWith("/resource/")) {
      const localName = path.slice("/resource/".length).replace(/\/$/, "");
      const graph = resourceGraph(localName);
      if (!graph) return send(res, 404, "text/plain", `Unknown resource: ${localName}`);

      const format = url.searchParams.get("format");
      if (format === "html" || (!format && !wantsRdf(req.headers.accept))) {
        // 303 See Other -> the document that describes the resource.
        const page = pageForResource(localName);
        res.writeHead(303, { location: "/" + page });
        return res.end();
      }
      return send(res, 200, "application/ld+json; charset=utf-8", JSON.stringify(graph, null, 2));
    }

    // ── Rendered pages (SSR) ────────────────────────────────────────────────
    if (ROUTES.has(name)) {
      return send(res, 200, "text/html; charset=utf-8", ROUTES.get(name)());
    }

    // ── Static assets from the lab6 root (styles.css, vocabulary/…) ─────────
    if (name === "styles.css" || name.startsWith("vocabulary/")) {
      const safe = normalize(name).replace(/^(\.\.[\\/])+/, "");
      const file = join(labRoot, safe);
      const data = await readFile(file);
      return send(res, 200, MIME[extname(file)] || "application/octet-stream", data);
    }

    send(res, 404, "text/plain", `Not found: ${path}`);
  } catch (err) {
    send(res, 500, "text/plain", `Server error: ${err.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`ModellingClub semantic app  →  http://localhost:${PORT}/`);
  console.log(`  pages       : ${[...ROUTES.keys()].join(", ")}`);
  console.log(`  linked data : http://localhost:${PORT}/resource/build-falcon   (Accept: application/ld+json)`);
});
