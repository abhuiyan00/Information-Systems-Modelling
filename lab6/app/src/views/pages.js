// Page renderers — each maps a slice of the data model to a full RDFa document.
// The JSON-LD in <head> and the RDFa in <body> are both produced from the same
// data, so they cannot disagree.

import {
  builds,
  buildsByAuthor,
  listings,
  pageForBuild,
  pageForUser,
  site,
  testRuns,
  userById,
} from "../model.js";
import {
  buildGraph,
  exploreGraph,
  homeGraph,
  listingNode,
  marketplaceGraph,
  memberGraph,
  testRunGraph,
  withContext,
} from "../rdf/jsonld.js";
import { buildCard, layout, personInline } from "./components.js";
import { esc, html } from "./html.js";

// ── Home ─────────────────────────────────────────────────────────────────────
export function homePage() {
  const recent = builds.filter((b) => b.featured);
  const w = site.website;
  const body = html`    <div class="hero" about="${w.id}" typeof="WebSite">
      <meta property="url" content="${w.url}">
      <h1 property="name">${esc(w.tagline)}</h1>
      <p property="description">${esc(w.heroText)}</p>
      <span rel="publisher">
        <span about="${site.org.id}" typeof="Organization">
          <meta property="name" content="${esc(site.org.name)}">
          <link property="additionalType" href="http://modellingclub.local/ontology#Community">
        </span>
      </span>
      <div class="hero-actions">
        <a href="builds.html" class="btn btn-primary">Explore Builds</a>
        <a href="member-alice.html" class="btn btn-ghost">Members</a>
      </div>
    </div>

    <div class="kpi-grid">
      ${site.kpis
        .map(
          (k) =>
            `<div class="kpi-tile ${k.accent}"><span class="kpi-label">${esc(k.label)}</span><span class="kpi-value">${k.value}</span></div>`
        )
        .join("\n      ")}
    </div>

    <div class="section-heading">
      <h2 style="margin:0">Recently Published</h2>
      <a href="builds.html">Browse all &rarr;</a>
    </div>

    <div class="build-grid" property="mainEntity" typeof="ItemList">
      <meta property="name" content="Recently Published Builds">
      <meta property="numberOfItems" content="${recent.length}">

      ${recent.map((b, i) => buildCard(b, i + 1)).join("\n\n      ")}
    </div>`;

  return layout({
    title: "ModellingClub — builds, flight logs & community",
    jsonld: homeGraph(),
    active: "home",
    bodyAttrs: 'typeof="WebPage" about="index.html"',
    topComment:
      "<!-- Home / landing. WebSite + Organization + an ItemList of featured builds. Generated from data/site.json + data/builds.json. -->",
    body,
  });
}

// ── Explore (all builds) ─────────────────────────────────────────────────────
export function buildsPage() {
  const body = html`    <div class="page-header">
      <div>
        <h1 property="name">Explore</h1>
        <p style="margin-top:0.25rem; font-size:0.9rem">Browse builds from the community.</p>
      </div>
    </div>

    <div class="build-grid" property="mainEntity" typeof="ItemList">
      <meta property="name" content="All community builds">
      <meta property="numberOfItems" content="${builds.length}">

      ${builds.map((b, i) => buildCard(b, i + 1)).join("\n\n      ")}
    </div>`;

  return layout({
    title: "Explore builds — ModellingClub",
    jsonld: exploreGraph(),
    active: "builds",
    bodyAttrs: 'typeof="CollectionPage" about="builds.html"',
    topComment:
      "<!-- Explore. CollectionPage -> ItemList of every build. One card per record in data/builds.json. -->",
    body,
  });
}

// ── Build detail (showcase) ──────────────────────────────────────────────────
export function buildDetailPage(b) {
  const subject = `mcr:${b.id}`;
  const u = userById(b.author);

  // CARD 1 — header. about="" opens the subject; typeof gives schema + mc types.
  const ratingBadge = b.aggregateRating
    ? html`<span class="badge" style="background:rgba(245,158,11,0.15);color:#f59e0b"
                  property="aggregateRating" typeof="AggregateRating">
              &#11088; <span property="ratingValue">${b.aggregateRating.ratingValue}</span>
              <meta property="bestRating" content="${b.aggregateRating.bestRating}">
              <meta property="worstRating" content="${b.aggregateRating.worstRating}">
              <meta property="ratingCount" content="${b.aggregateRating.ratingCount}">
            </span>`
    : "";

  const statusBadge = b.status
    ? html`<span class="badge ${b.statusBadge}" property="creativeWorkStatus" content="${esc(b.status.label)}">${esc(b.status.display)}</span>${
        b.status.individual
          ? `\n            <span rel="mc:hasStatus" resource="mcr:${b.status.individual}"></span>`
          : ""
      }`
    : "";

  const specs = b.specs
    ? html`
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap:0.75rem">
        ${b.specs
          .map((s) => {
            const unit = s.unitText
              ? ` ${esc(s.unitText)}<meta property="unitText" content="${esc(s.unitText)}">`
              : "";
            const valueCell = s.unitText
              ? `<span class="spec-value"><span property="value" content="${esc(s.value)}">${esc(s.value)}</span>${unit}</span>`
              : `<span class="spec-value" property="value"${typeof s.value === "number" ? ` content="${s.value}"` : ""}>${esc(s.value)}</span>`;
            return html`<div class="spec-item" property="additionalProperty" typeof="PropertyValue">
          <span class="spec-label" property="name">${esc(s.name)}</span>
          ${valueCell}
        </div>`;
          })
          .join("\n        ")}
      </div>`
    : "";

  const cardHeader = html`    <div class="glass-card" style="margin-bottom:1.5rem"
         about="${subject}" typeof="CreativeWork ${b.mcType}">
      <link property="additionalType" href="http://modellingclub.local/ontology#${b.mcType.split(":")[1]}">

      <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem">
        <div>
          <h1 style="margin-bottom:0.5rem" property="name mc:buildTitle">${esc(b.name)}</h1>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap">
            <span class="badge ${b.genreBadge}" property="genre">${esc(b.genre)}</span>
            ${statusBadge}
            ${ratingBadge}
          </div>
        </div>
      </div>

      <p style="margin-bottom:1rem; color:var(--text-primary)" property="description mc:buildDescription">${esc(b.description)}</p>

      <p style="margin-bottom:1rem">
        by
        <a href="${pageForUser(b.author)}" rel="author mc:createdBy" resource="mcr:${b.author}"
           typeof="Person mc:User" style="color:var(--primary)">
          <span property="name mc:username">${esc(u.username)}</span>
        </a>${
          b.dateCreated
            ? `\n        · created <time property="dateCreated" datetime="${b.dateCreated}" content="${b.dateCreated}">${esc(b.dateCreatedDisplay || b.dateCreated)}</time>`
            : ""
        }
      </p>
      ${specs}
    </div>`;

  // CARD 2 — media. Separate card, re-attached via about="".
  const cardMedia = b.image
    ? html`

    <div class="glass-card" style="margin-bottom:1.5rem" about="${subject}">
      <h3>Media &amp; Documentation</h3>
      <div class="media-gallery">
        <div class="media-tile" rel="image mc:hasMedia" resource="mcr:${b.image.id}"
             typeof="ImageObject mc:ImageFile">
          <img property="contentUrl mc:fileUrl" src="${b.image.contentUrl}"
               alt="${esc(b.image.alt)}" loading="lazy" />
        </div>
      </div>
    </div>`
    : "";

  // CARD 3 — votes -> interactionStatistic counters.
  const cardVotes = b.votes
    ? html`

    <div class="glass-card" style="margin-bottom:1.5rem" about="${subject}">
      <h3>Community Votes</h3>
      <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap">
        <span style="font-size:1.5rem; font-weight:700; color:#10b981"
              property="interactionStatistic" typeof="InteractionCounter">
          <meta property="interactionType" content="https://schema.org/LikeAction">
          &#128077; <span property="userInteractionCount">${b.votes.like}</span>
        </span>
        <span style="font-size:1.5rem; font-weight:700; color:#ef4444"
              property="interactionStatistic" typeof="InteractionCounter">
          <meta property="interactionType" content="https://schema.org/DislikeAction">
          &#128078; <span property="userInteractionCount">${b.votes.dislike}</span>
        </span>
      </div>
    </div>`
    : "";

  // CARD 4 — flight log. CUSTOM-ONLY: schema.org has no flight-log class.
  const cardFlight = b.flightLog
    ? html`

    <div class="glass-card" style="margin-bottom:1.5rem" about="${subject}">
      <h3>Flight Logs</h3>
      <table>
        <thead><tr><th>Max Altitude</th><th>Pilot License ID</th></tr></thead>
        <tbody>
          <tr rel="mc:hasFlightLog" resource="mcr:${b.flightLog.id}" typeof="mc:FlightLog">
            <td><span property="mc:flightAltitude" datatype="xsd:decimal" content="${b.flightLog.altitude}">${b.flightLog.altitude}</span> m</td>
            <td style="font-family:monospace" property="mc:pilotLicenseId">${esc(b.flightLog.pilotLicenseId)}</td>
          </tr>
        </tbody>
      </table>
    </div>`
    : "";

  // CARD 5 — telemetry. CUSTOM-ONLY (mc:TelemetryRecord).
  const cardTelemetry = b.telemetry
    ? html`

    <div class="glass-card" style="margin-bottom:1.5rem" about="${subject}">
      <h3>Telemetry</h3>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap:0.75rem"
           rel="mc:hasTelemetry" resource="mcr:${b.telemetry.id}" typeof="mc:TelemetryRecord">
        <div class="spec-item"><span class="spec-label">Top Speed</span>
          <span class="spec-value"><span property="mc:topSpeed" datatype="xsd:decimal" content="${b.telemetry.topSpeed}">${b.telemetry.topSpeed}</span> km/h</span></div>
        <div class="spec-item"><span class="spec-label">Max Range</span>
          <span class="spec-value"><span property="mc:maxRange" datatype="xsd:decimal" content="${b.telemetry.maxRange}">${b.telemetry.maxRange}</span> m</span></div>
        <div class="spec-item"><span class="spec-label">Crashes</span>
          <span class="spec-value" property="mc:crashCount" datatype="xsd:integer" content="${b.telemetry.crashCount}">${b.telemetry.crashCount}</span></div>
      </div>
    </div>`
    : "";

  // CARD 6 — comments.
  const cardComments = b.comments
    ? html`

    <div class="glass-card" about="${subject}">
      <h3>Comments</h3>
      ${b.comments
        .map((c) => {
          const ca = userById(c.author);
          return html`<div class="comment-item" rel="comment mc:hasComment"
           resource="mcr:${c.id}" typeof="Comment mc:Comment">
        <div class="comment-meta">
          <strong rel="author mc:postedBy" resource="mcr:${c.author}" typeof="Person ${ca.types.includes("mc:AdminUser") ? "mc:AdminUser" : "mc:User"}">
            <span property="name mc:username">${esc(ca.username)}</span>
          </strong>
        </div>
        <p class="comment-body" property="text mc:commentText">${esc(c.text)}</p>
      </div>`;
        })
        .join("\n\n      ")}
    </div>`
    : "";

  const body = html`    <a href="builds.html" class="btn btn-ghost" style="margin-bottom:1.5rem; display:inline-flex">&larr; Back to Builds</a>

${cardHeader}${cardMedia}${cardVotes}${cardFlight}${cardTelemetry}${cardComments}`;

  return layout({
    title: `${b.name} — ModellingClub`,
    jsonld: withContext(buildGraph(b)),
    active: "builds",
    topComment: `<!--
  Build detail (server-rendered). Same entity twice: RDFa woven into the visible
  cards + a JSON-LD graph in <head>. The build renders as several sibling
  .glass-card <div>s that are NOT nested; about="${subject}" repeats on every
  card so all triples attach to the one subject. Generated from data/builds.json.
-->`,
    body,
  });
}

// ── Member profile ───────────────────────────────────────────────────────────
export function memberPage(id) {
  const u = userById(id);
  const subject = `mcr:${id}`;
  const authored = buildsByAuthor(id);

  const knowsMember = u.knows?.length
    ? html`Knows ${u.knows
        .map((kid) => {
          const k = userById(kid);
          return `<a rel="knows mc:knows" resource="mcr:${kid}" href="${pageForUser(kid)}" typeof="Person" style="color:var(--primary)"><span property="name">${esc(k.username)}</span></a>`;
        })
        .join(", ")}`
    : "";

  const memberOf = u.memberOf
    ? html` · Member of
        <span rel="memberOf mc:isMemberOf" resource="mcr:${u.memberOf}"
              typeof="Organization mc:Community">
          <span property="name">Micro FPV</span></span>`
    : "";

  const repCard = u.reputation
    ? html`

    <div class="glass-card" style="margin-bottom:1.5rem" about="${subject}">
      <h3>Reputation</h3>
      <div class="kpi-grid" rel="mc:hasReputation" resource="mcr:${u.reputation.id}" typeof="mc:ReputationRecord">
        <div class="kpi-tile kpi-accent-primary"><span class="kpi-label">Builder</span>
          <span class="kpi-value" property="mc:builderScore" datatype="xsd:integer" content="${u.reputation.builderScore}">${u.reputation.builderScore}</span></div>
        <div class="kpi-tile kpi-accent-success"><span class="kpi-label">Helper</span>
          <span class="kpi-value" property="mc:helperScore" datatype="xsd:integer" content="${u.reputation.helperScore}">${u.reputation.helperScore}</span></div>
        <div class="kpi-tile kpi-accent-secondary"><span class="kpi-label">Organiser</span>
          <span class="kpi-value" property="mc:organiserScore" datatype="xsd:integer" content="${u.reputation.organiserScore}">${u.reputation.organiserScore}</span></div>
        <div class="kpi-tile kpi-accent-warning"><span class="kpi-label">Reliability</span>
          <span class="kpi-value" property="mc:reliabilityScore" datatype="xsd:integer" content="${u.reputation.reliabilityScore}">${u.reputation.reliabilityScore}</span></div>
      </div>
    </div>`
    : "";

  const buildsCard = authored.length
    ? html`

    <div class="glass-card" about="${subject}">
      <h3>Builds by ${esc(u.username)}</h3>
      <ul style="list-style:none; padding:0; margin:0">
        ${authored
          .map(
            (b, i) => html`<li style="padding:0.5rem 0${i < authored.length - 1 ? "; border-bottom:1px solid rgba(255,255,255,0.04)" : ""}">
          <a href="${pageForBuild(b)}" rel="author mc:createdBy" resource="mcr:${b.id}"
             typeof="CreativeWork ${b.mcType}" style="color:var(--text-primary)">
            <strong property="name">${esc(b.name)}</strong></a>
          <span class="badge ${b.genreBadge}">${esc(b.genre)}</span>
        </li>`
          )
          .join("\n        ")}
      </ul>
    </div>`
    : "";

  const registered = u.registeredAt
    ? html`
          <p style="margin:0; font-size:0.85rem">
            Member since
            <time property="mc:registeredAt" datatype="xsd:dateTime"
                  datetime="${u.registeredAt}" content="${u.registeredAt}">${esc(u.registeredAtDisplay || u.registeredAt)}</time>
          </p>`
    : "";

  const email = u.email
    ? html`
          <p style="margin:0">
            <a property="email" href="mailto:${esc(u.email)}" style="color:var(--primary)">${esc(u.email)}</a>
          </p>`
    : "";

  const social =
    knowsMember || memberOf
      ? html`

      <p style="margin-top:1rem; font-size:0.9rem">
        ${knowsMember}${memberOf}
      </p>`
      : "";

  const body = html`    <div class="glass-card" style="margin-bottom:1.5rem"
         about="${subject}" typeof="${u.types.join(" ")}">
      <div style="display:flex; align-items:center; gap:1rem">
        <span class="avatar lg">${esc(u.initials)}</span>
        <div>
          <h1 style="margin:0" property="name mc:username">${esc(u.username)}</h1>${email}${registered}
        </div>
      </div>${social}
    </div>${repCard}${buildsCard}`;

  return layout({
    title: `${u.username} — ModellingClub member`,
    jsonld: withContext(memberGraph(id)),
    active: "members",
    topComment:
      "<!-- Member profile. schema:Person + custom mc:User/mc:Builder. The Reputation card is CUSTOM-ONLY (mc:ReputationRecord — schema.org has no reputation concept). -->",
    body,
  });
}

// ── Marketplace ──────────────────────────────────────────────────────────────
export function marketplacePage() {
  const rows = listings
    .map((l) => {
      const seller = userById(l.seller);
      return html`<tr about="mcr:${l.id}" typeof="Product mc:MarketplaceListing">
            <td><strong property="name mc:partName">${esc(l.name)}</strong></td>
            <td property="category">${esc(l.category)}<span rel="mc:partCategory" resource="mcr:${l.categoryIndividual}"></span></td>
            <td rel="offers" resource="mcr:${l.offer.id}" typeof="Offer">
              <span property="itemCondition" resource="${l.offer.itemCondition}">${esc(l.offer.conditionLabel)}</span>
            </td>
            <td rel="offers" resource="mcr:${l.offer.id}">
              <span property="price" content="${l.offer.price}">${l.offer.price}</span>
              <span property="priceCurrency" content="${l.offer.priceCurrency}">${l.offer.priceCurrency}</span>
              <link property="availability" href="${l.offer.availability}">
            </td>
            <td rel="seller mc:listedBy" resource="mcr:${l.seller}" typeof="Person mc:User">
              <span property="name mc:username">${esc(seller.username)}</span>
            </td>
          </tr>`;
    })
    .join("\n\n          ");

  const body = html`    <div class="page-header">
      <div>
        <h1>Marketplace</h1>
        <p style="margin-top:0.25rem; font-size:0.9rem">Trade parts and full kits between members.</p>
      </div>
    </div>

    <div class="glass-card">
      <table>
        <thead><tr><th>Part</th><th>Category</th><th>Condition</th><th>Price</th><th>Seller</th></tr></thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>`;

  return layout({
    title: "Marketplace — ModellingClub",
    jsonld: marketplaceGraph(),
    active: "marketplace",
    topComment: `<!--
  Marketplace. Each <tr> is a schema:Product + mc:MarketplaceListing. A table row
  splits one Offer across sibling <td> cells (Condition + Price); both cells use
  rel="offers" resource="mcr:offer-…" so they feed the SAME Offer node, not two.
  Generated from data/marketplace.json.
-->`,
    body,
  });
}

// ── Test run ─────────────────────────────────────────────────────────────────
export function testRunPage(t) {
  const subject = `mcr:${t.id}`;
  const org = userById(t.organizer);

  const attendees = t.attendees
    .map((a) => {
      const u = userById(a);
      return html`<li rel="attendee mc:attendedBy" resource="mcr:${a}" typeof="Person mc:User">
          <span class="avatar">${esc(u.initials)}</span> <span property="name mc:username">${esc(u.username)}</span>
        </li>`;
    })
    .join("\n        ");

  const body = html`    <div class="glass-card" style="margin-bottom:1.5rem"
         about="${subject}" typeof="Event mc:TestRun">
      <h1 property="name">${esc(t.name)}</h1>
      <link property="eventStatus" href="${t.eventStatus}">
      <link property="eventAttendanceMode" href="${t.eventAttendanceMode}">

      <p style="margin-bottom:1rem">
        <span class="badge badge-published">${esc(t.statusLabel)}</span>
        &middot;
        <time property="startDate mc:testRunDate" datatype="xsd:dateTime"
              datetime="${t.startDate}" content="${t.startDate}">${esc(t.startDateDisplay)}</time>
      </p>

      <div class="spec-item" style="margin-bottom:1rem; max-width:360px"
           rel="location" typeof="Place">
        <span class="spec-label">Location</span>
        <span class="spec-value" property="name mc:testRunLocation">${esc(t.location.name)}</span>
        <span rel="address" typeof="PostalAddress">
          <meta property="addressLocality" content="${esc(t.location.addressLocality)}">
          <meta property="addressCountry" content="${esc(t.location.addressCountry)}">
        </span>
      </div>

      <p>
        Organised by
        <a href="${pageForUser(t.organizer)}" rel="organizer mc:organisedBy" resource="mcr:${t.organizer}"
           typeof="Person mc:AdminUser" style="color:var(--primary)">
          <span property="name mc:username">${esc(org.username)}</span></a>
      </p>
    </div>

    <div class="glass-card" about="${subject}">
      <h3>Attendees</h3>
      <ul style="list-style:none; padding:0; margin:0; display:flex; gap:1rem; flex-wrap:wrap">
        ${attendees}
      </ul>
    </div>`;

  return layout({
    title: `${t.name} — ModellingClub`,
    jsonld: testRunGraph(t),
    active: "testrun",
    topComment:
      "<!-- Test run. schema:Event + Place + PostalAddress, dual-annotated with custom mc:TestRun. Generated from data/testruns.json. -->",
    body,
  });
}
