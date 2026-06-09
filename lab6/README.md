# Lab 6 — Embedding semantic data in web pages (RDFa + JSON-LD)

**Aim:** embed semantic data inside the web application's HTML views using
the **RDFa** standard (annotations) and **JSON-LD** scripts, preferring the
**schema.org** vocabulary and falling back to a **custom vocabulary** where
schema.org has no matching class/property.

This lab combines the two earlier labs:

| Lab | What it gave us | Reused here |
|-----|-----------------|-------------|
| **lab4** | The Angular web app (ModellingClub: builds, marketplace, test runs, members) and its HTML views + dark theme | The page layouts and `styles.css` are mirrored so the snapshots look like the real app |
| **lab5** | The custom ontology `mc:` (`ontology.ttl`) + sample instances in an RDF4J triplestore | The pages publish the **same triples**, reusing the same IRIs (`mc:`, `mcr:`) |

---

## 1. Why static "snapshot" pages (the Angular problem)

The live app is **Angular** — the views are rendered **client-side** from JSON
returned by the REST API. As the brief notes, that is hostile to semantic
annotation:

* a crawler / RDFa parser that reads the served `index.html` sees only
  `<app-root></app-root>` — the real DOM does not exist until JS runs;
* the same entity is painted as **several sibling `<div>` cards** that are
  styled by external CSS but **not nested in one hierarchy** (build header,
  media, votes, flight log, comments are independent `.glass-card`s);
* values are interpolated (`{{ build.title }}`), so there is no stable place
  to hang an annotation.

So the deliverable is a set of **server-rendered snapshots** of the views —
exactly what an SSR build (Angular Universal) or a "prototype" page (see
<https://developers.google.com/search/docs/guides/prototype>) would emit for a
bot. Each snapshot carries the semantics in two independent ways:

1. **RDFa 1.1** attributes woven into the visible markup.
2. A **JSON-LD** `<script type="application/ld+json">` in `<head>`.

Either one alone is enough for a crawler; both are included to demonstrate both
techniques and to make validation easy.

---

## 2. Files

```
lab6/
├─ index.html          Home  — schema:WebSite + schema:Organization + ItemList of builds
├─ builds.html         Explore — schema:CollectionPage + ItemList → 4 builds
├─ build-falcon.html   Build detail (showcase) — CreativeWork + mc:DroneBuild, author,
│                       AggregateRating, vote counters, FLIGHT LOG + TELEMETRY (custom vocab), comments
├─ marketplace.html    Listings — schema:Product + schema:Offer + mc:MarketplaceListing
├─ member-alice.html   Member — schema:Person + mc:Builder + mc:ReputationRecord (custom)
├─ testrun.html        Test run — schema:Event + schema:Place + mc:TestRun
├─ styles.css          Theme copied from the lab4 app (presentation only)
└─ vocabulary/
   ├─ mc-context.jsonld Reusable JSON-LD @context for the custom mc: terms
   └─ ontology.ttl      Custom mc: ontology (TBox) — DELIVERABLE 3

(docs, not submitted: README.md, guide.txt, snapshot.md — snapshot.md holds the
 full term-by-term schema.org-vs-mc: provenance per page.)
```

The custom ontology (TBox) originates in **lab5**
(`sesameExample_sol/src/main/resources/ontology.ttl`) and is delivered with this
lab as **`vocabulary/ontology.ttl`** — this is the only ontology handed in
(schema.org and XSD are existing vocabularies, referenced in the report, not
delivered).

---

## 3. schema.org ↔ custom vocabulary mapping

schema.org covers most of the domain. Where it does **not**, the custom `mc:`
vocabulary from lab5 is used (this is the "missing classes/properties" case the
brief asks about).

| Domain thing | schema.org (primary) | Custom `mc:` (added via `additionalType` / extra props) |
|---|---|---|
| Build | `CreativeWork` (`name`, `description`, `genre`, `author`, `dateCreated`, `creativeWorkStatus`, `aggregateRating`, `comment`, `image`, `additionalProperty`) | `mc:DroneBuild` / `mc:RCCarBuild` / `mc:RobotBuild` / `mc:AircraftBuild`, `mc:buildTitle`, `mc:hasStatus` |
| Up/down votes | `interactionStatistic` → `InteractionCounter` (`LikeAction`/`DislikeAction`) | — |
| **Flight log** | *(no equivalent)* | **`mc:FlightLog`, `mc:flightAltitude`, `mc:pilotLicenseId`** |
| **Telemetry** | *(no equivalent)* | **`mc:TelemetryRecord`, `mc:topSpeed`, `mc:maxRange`, `mc:crashCount`** |
| Marketplace listing | `Product` + `Offer` (`price`, `priceCurrency`, `itemCondition`, `availability`, `seller`) | `mc:MarketplaceListing`, `mc:partName`, `mc:partCategory`, `mc:listedBy` |
| Member | `Person` (`name`, `email`, `knows`, `memberOf`) | `mc:User` / `mc:Builder`, `mc:username`, `mc:registeredAt` |
| **Reputation** | *(no equivalent)* | **`mc:ReputationRecord`, `mc:builderScore`, `mc:helperScore`, `mc:organiserScore`, `mc:reliabilityScore`** |
| Test run | `Event` + `Place` + `PostalAddress` (`startDate`, `organizer`, `attendee`) | `mc:TestRun`, `mc:testRunLocation`, `mc:testRunDate`, `mc:organisedBy`, `mc:attendedBy` |
| Club / community | `Organization` | `mc:Community` |

RDFa wiring: `<html vocab="https://schema.org/" prefix="mc: … mcr: …">`. Bare
terms (`property="name"`) resolve to schema.org; custom terms are prefixed
(`property="mc:flightAltitude"`). Types combine both:
`typeof="schema:CreativeWork mc:DroneBuild"`.

**In-page provenance.** Every page opens with a `VOCAB MAP` comment (visible in
View Source) listing that page's schema.org terms, its custom `mc:` terms, and
any **custom-ONLY** section. The custom-only sections — no schema.org equivalent
exists, so they use `mc:` end-to-end — are:

* `build-falcon.html` → **Flight Logs** card (`mc:FlightLog`,
  `mc:flightAltitude`, `mc:pilotLicenseId`) and **Telemetry** card
  (`mc:TelemetryRecord`, `mc:topSpeed`, `mc:maxRange`, `mc:crashCount`);
* `member-alice.html` → **Reputation** card (`mc:ReputationRecord`,
  `mc:builderScore`, `mc:helperScore`, `mc:organiserScore`,
  `mc:reliabilityScore`).

Everywhere else `mc:` is dual-annotated alongside schema.org. The full
term-by-term table per page lives in `snapshot.md` (§5b).

---

## 4. The "scattered `<div>`s" technique (the hard part)

When one entity is rendered as separate, non-nested elements, RDFa keeps them
together with **`@about`**: every block repeats the subject IRI.

* **`build-falcon.html`** — six independent `.glass-card`s (header, media,
  votes, flight log, telemetry, comments) each carry
  `about="mcr:build-falcon"`, so all their triples land on the one build.
* **`marketplace.html`** — a `<table>` is the worst case: one Offer's data is
  split across the *Condition* `<td>` and the *Price* `<td>`. Both cells use
  `rel="offers" resource="mcr:offer-esc"`, so the two sibling cells contribute
  to the **same** Offer node instead of minting two.

Machine values use `content=`/`datatype=` while humans see formatted text, e.g.
`<span property="mc:flightAltitude" datatype="xsd:decimal" content="118.5">118.5 m</span>`.

---

## 5. How to verify

### 5a. RDFa — RDFa Play (<http://rdfa.info/play/>)
1. Open the service, choose the **Turtle** (or **N-Triples**) output tab.
2. Open a page (e.g. `build-falcon.html`), **View Source**, copy the markup,
   paste it into the editor.
3. The graph panel/triple list should show `mcr:build-falcon` as a
   `schema:CreativeWork` **and** `mc:DroneBuild`, with `schema:name`,
   `schema:author → mcr:user-alice`, `schema:aggregateRating`, the
   `mc:hasFlightLog`/`mc:hasTelemetry` sub-graphs, and both comments.
4. Confirm the scattered cards all attach to the one subject (no stray blank
   nodes for the build).

### 5b. JSON-LD + RDFa — Google
The brief links the **Structured Data Testing Tool**
(<https://search.google.com/structured-data/testing-tool>). Google has since
split it into two; use whichever you have:

* **Rich Results Test** — <https://search.google.com/test/rich-results>
  (paste the page URL or its code; good for the `Product`, `Event`,
  `AggregateRating` types).
* **Schema Markup Validator** — <https://validator.schema.org/>
  (best for general schema.org, including our `CreativeWork` + `Person`).

Paste a page's code; the tool should detect the items and **0 errors**. The
custom `mc:` properties appear as recognised-but-unknown extra properties
(expected — they are not schema.org terms), while all schema.org types parse
cleanly.

### 5c. Offline check (done in this repo)
JSON-LD was parsed locally with `rdflib` to confirm it yields real RDF:

```
build-falcon.html : 76 triples
marketplace.html  : 40 triples
testrun.html      : 31 triples
```

Re-run:
```bash
python -c "import re,rdflib; b=re.findall(r'<script type=\"application/ld\\+json\">(.*?)</script>',open('build-falcon.html',encoding='utf-8').read(),re.S)[0]; print(len(rdflib.Graph().parse(data=b,format='json-ld')),'triples')"
```

(RDFa is validated with RDFa Play / Google as above — `rdflib` needs the
`pyRdfa` plugin for RDFa, which is not installed here.)

---

## 6. Notes
* Subjects reuse lab5 IRIs (`http://modellingclub.local/resource/…`), so a page
  scraped into a triplestore merges with the lab5 graph — the website becomes a
  publishing front-end for the same knowledge base.
* `priceCurrency` is `PLN` to match the lab4 marketplace (`price_pln`).
* Prefer the showcase page **`build-falcon.html`** when demonstrating, since it
  exercises every technique: dual vocab, scattered-`div` `@about`,
  typed literals, nested resources, AggregateRating, and custom-only sub-graphs.
