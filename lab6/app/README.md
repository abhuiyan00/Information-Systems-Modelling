# ModellingClub — dynamic semantic publishing

Data-driven version of the Lab 6 semantic markup. The old approach hand-wrote
the same data into six HTML files **twice** (RDFa in the body + JSON-LD in the
head), so every fact lived in 2–4 places and could drift. This app makes the
data the single source of truth and **generates** the markup.

```
data/ (JSON)  ──►  one renderer  ──►  RDFa  +  JSON-LD   (always in sync)
                                  ├─►  dynamic SSR server (npm run dev)
                                  └─►  static snapshots   (npm run build → dist/)
```

This is the standard answer to the problem the lab describes — a client-rendered
Angular view is invisible to crawlers, so you render on the server (SSR/SSG) and
publish the data in machine-readable form. Zero npm dependencies (built-in
`node:http`), so it runs offline.

## Run

```bash
cd app
npm run dev        # http://localhost:3000  — server-side rendered pages
npm run build      # writes the static site to app/dist/
npm run validate   # build, then parse every page's JSON-LD with rdflib
```

`npm run dev` requires only Node ≥ 18. `npm run validate` also needs Python +
`rdflib` (`pip install rdflib`).

## What makes it "industry standard"

| Practice | Where |
|---|---|
| **Single source of truth** | `data/*.json` — the ABox. No fact is written twice. |
| **One renderer, two outputs** | RDFa (`src/views/`) and JSON-LD (`src/rdf/jsonld.js`) come from the same data, so they cannot disagree. |
| **schema.org first, custom vocab as fallback** | `src/rdf/jsonld.js` prefers schema.org terms; `mc:` is added only where schema.org has no class/property (FlightLog, Telemetry, Reputation…). |
| **Dereferenceable Linked Data** | `GET /resource/<id>` content-negotiates: `Accept: application/ld+json` → the RDF graph; `Accept: text/html` → 303 redirect to the human page. |
| **Generated provenance** | `src/rdf/vocabmap.js` walks each page's graph to emit the `VOCAB MAP` comment (schema.org vs `mc:`, plus custom-only sub-graphs) — it can't go stale. |
| **Static export for crawlers** | `npm run build` snapshots the whole site to `dist/` — the deliverable, now an artifact. |
| **Validation in the pipeline** | `scripts/validate.py` parses the emitted JSON-LD to real RDF triples. |

## Layout

```
app/
├─ data/                 single source of truth (the ABox)
│   ├─ site.json users.json communities.json
│   ├─ builds.json marketplace.json testruns.json
├─ src/
│   ├─ ns.js             namespaces / prefixes / JSON-LD contexts
│   ├─ model.js          loads data, resolves references, canonical URLs
│   ├─ sitemap.js        one route table (server + export both use it)
│   ├─ server.js         SSR + Linked-Data content negotiation
│   ├─ rdf/
│   │   ├─ jsonld.js     data  ->  JSON-LD graphs
│   │   └─ vocabmap.js   graph ->  provenance comment
│   └─ views/
│       ├─ html.js components.js pages.js   data -> RDFa HTML
├─ scripts/
│   ├─ build.js          static export to dist/
│   └─ validate.py       JSON-LD -> rdflib triple counts
└─ dist/                 generated output (gitignored)
```

Shared assets are reused from the lab6 root, not copied: `styles.css` and
`vocabulary/` (`ontology.ttl` = the delivered custom TBox, `mc-context.jsonld` =
reusable JSON-LD context). The build copies them into `dist/` so the export is
self-contained.

## Add data, get pages

Adding an object to `data/builds.json` (or a user, listing, test run) makes its
detail page, its `ItemList` entries, and its dereferenceable IRI appear
automatically — no HTML to touch. That is the whole point of the rewrite.
