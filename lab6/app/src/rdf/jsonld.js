// Builds JSON-LD graphs straight from the data model. The SAME functions feed
// both the <script type="application/ld+json"> blocks and the content-negotiated
// `application/ld+json` responses, so a crawler and an RDF client see identical
// triples. schema.org terms are the default @vocab; anything schema.org cannot
// express uses the custom mc: vocabulary.

import { CONTEXT_FULL, CONTEXT_LITE, PREFIXES } from "../ns.js";
import {
  builds,
  buildsByAuthor,
  communityById,
  listings,
  pageForBuild,
  pageForUser,
  site,
  userById,
} from "../model.js";

const mcr = (id) => `mcr:${id}`;
const decimal = (v) => ({ "@type": "xsd:decimal", "@value": String(v) });
const integer = (v) => ({ "@type": "xsd:integer", "@value": String(v) });
const dateTime = (v) => ({ "@type": "xsd:dateTime", "@value": String(v) });
// mc:DroneBuild -> full ontology IRI, for schema:additionalType.
const fullMc = (curie) => PREFIXES.mc + curie.split(":")[1];

// ── People / communities ────────────────────────────────────────────────────
export function personNode(id, { withUrl = false } = {}) {
  const u = userById(id);
  const node = { "@id": mcr(id), "@type": u.types, name: u.username };
  if (withUrl) node.url = pageForUser(id);
  return node;
}

function communityNode(id) {
  const c = communityById(id);
  return { "@id": mcr(id), "@type": c.types, name: c.name };
}

function reputationNode(rep) {
  return {
    "@id": mcr(rep.id),
    "@type": "mc:ReputationRecord",
    "mc:builderScore": integer(rep.builderScore),
    "mc:helperScore": integer(rep.helperScore),
    "mc:organiserScore": integer(rep.organiserScore),
    "mc:reliabilityScore": integer(rep.reliabilityScore),
  };
}

// ── Builds ──────────────────────────────────────────────────────────────────
// Compact reference to a build (used inside ItemLists and author lists).
export function buildRef(b, { withUrl = false } = {}) {
  const node = {
    "@id": mcr(b.id),
    "@type": ["CreativeWork", b.mcType],
    name: b.name,
  };
  if (withUrl) node.url = pageForBuild(b);
  return node;
}

// Full build graph (showcase detail page). Only emits the sections the build
// actually has data for — a draft with no telemetry simply omits it.
export function buildGraph(b) {
  const node = {
    "@id": mcr(b.id),
    "@type": ["CreativeWork", b.mcType],
    additionalType: fullMc(b.mcType),
    name: b.name,
    description: b.description,
    genre: b.genre,
  };
  if (b.dateCreated) node.dateCreated = b.dateCreated;
  if (b.status) {
    node.creativeWorkStatus = b.status.label;
    if (b.status.individual) node["mc:hasStatus"] = { "@id": mcr(b.status.individual) };
  }
  node.author = personNode(b.author, { withUrl: true });

  if (b.image) {
    node.image = {
      "@id": mcr(b.image.id),
      "@type": b.image.types,
      contentUrl: b.image.contentUrl,
    };
  }
  if (b.aggregateRating) {
    node.aggregateRating = { "@type": "AggregateRating", ...b.aggregateRating };
  }
  if (b.votes) {
    node.interactionStatistic = [
      counter("https://schema.org/LikeAction", b.votes.like),
      counter("https://schema.org/DislikeAction", b.votes.dislike),
    ];
  }
  if (b.specs) {
    node.additionalProperty = b.specs.map((s) => {
      const pv = { "@type": "PropertyValue", name: s.name, value: s.value };
      if (s.unitText) pv.unitText = s.unitText;
      return pv;
    });
  }
  if (b.comments) {
    node.comment = b.comments.map((c) => ({
      "@id": mcr(c.id),
      "@type": ["Comment", "mc:Comment"],
      text: c.text,
      author: personNode(c.author),
    }));
  }
  if (b.flightLog) {
    node["mc:hasFlightLog"] = {
      "@id": mcr(b.flightLog.id),
      "@type": "mc:FlightLog",
      "mc:flightAltitude": decimal(b.flightLog.altitude),
      "mc:pilotLicenseId": b.flightLog.pilotLicenseId,
    };
  }
  if (b.telemetry) {
    node["mc:hasTelemetry"] = {
      "@id": mcr(b.telemetry.id),
      "@type": "mc:TelemetryRecord",
      "mc:topSpeed": decimal(b.telemetry.topSpeed),
      "mc:maxRange": decimal(b.telemetry.maxRange),
      "mc:crashCount": integer(b.telemetry.crashCount),
    };
  }
  return node;
}

const counter = (type, count) => ({
  "@type": "InteractionCounter",
  interactionType: type,
  userInteractionCount: count,
});

// ── Members ─────────────────────────────────────────────────────────────────
export function memberGraph(id) {
  const u = userById(id);
  const node = { "@id": mcr(id), "@type": u.types, name: u.username };
  if (u.email) node.email = u.email;
  node.url = pageForUser(id);
  if (u.memberOf) node.memberOf = communityNode(u.memberOf);
  if (u.knows?.length) {
    const k = u.knows.map((kid) => personNode(kid));
    node.knows = k.length === 1 ? k[0] : k;
  }
  if (u.registeredAt) node["mc:registeredAt"] = dateTime(u.registeredAt);
  if (u.reputation) node["mc:hasReputation"] = reputationNode(u.reputation);
  const authored = buildsByAuthor(id);
  if (authored.length) {
    node.author = authored.map((b) => buildRef(b, { withUrl: true }));
  }
  return node;
}

// ── Marketplace ─────────────────────────────────────────────────────────────
export function listingNode(l) {
  return {
    "@id": mcr(l.id),
    "@type": l.types,
    name: l.name,
    category: l.category,
    additionalType: fullMc(l.categoryType),
    offers: {
      "@type": "Offer",
      price: l.offer.price,
      priceCurrency: l.offer.priceCurrency,
      availability: l.offer.availability,
      itemCondition: l.offer.itemCondition,
      seller: personNode(l.seller),
    },
  };
}

export function marketplaceGraph() {
  return {
    "@context": CONTEXT_LITE,
    "@type": "ItemList",
    name: "Marketplace listings",
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: listingNode(l),
    })),
  };
}

// ── Test runs ───────────────────────────────────────────────────────────────
export function testRunGraph(t) {
  return {
    "@context": CONTEXT_FULL,
    "@id": mcr(t.id),
    "@type": t.types,
    name: t.name,
    startDate: t.startDate,
    eventStatus: t.eventStatus,
    eventAttendanceMode: t.eventAttendanceMode,
    location: {
      "@type": "Place",
      name: t.location.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: t.location.addressLocality,
        addressCountry: t.location.addressCountry,
      },
    },
    organizer: personNode(t.organizer),
    attendee: t.attendees.map((a) => personNode(a)),
    "mc:testRunLocation": t.location.name,
    "mc:testRunDate": dateTime(t.startDate),
  };
}

// ── Site-level graphs (home, explore) ───────────────────────────────────────
export function homeGraph() {
  const recent = builds.filter((b) => b.featured);
  return {
    "@context": CONTEXT_LITE,
    "@graph": [
      {
        "@id": site.website.id,
        "@type": "WebSite",
        name: site.website.name,
        url: site.website.url,
        description: site.website.description,
        publisher: { "@id": site.org.id },
      },
      {
        "@id": site.org.id,
        "@type": "Organization",
        name: site.org.name,
        url: site.org.url,
        description: site.org.description,
        additionalType: fullMc(site.org.additionalType),
      },
      {
        "@type": "ItemList",
        name: "Recently Published Builds",
        numberOfItems: recent.length,
        itemListElement: recent.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: pageForBuild(b),
          item: buildRef(b),
        })),
      },
    ],
  };
}

export function exploreGraph() {
  return {
    "@context": CONTEXT_LITE,
    "@type": "CollectionPage",
    name: "Explore builds",
    url: "builds.html",
    mainEntity: {
      "@type": "ItemList",
      name: "All community builds",
      numberOfItems: builds.length,
      itemListElement: builds.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: pageForBuild(b),
        item: {
          ...buildRef(b),
          author: personNode(b.author),
          creativeWorkStatus: b.status.label,
        },
      })),
    },
  };
}

// Wrap a bare node with the full @context (for detail / member pages).
export const withContext = (node, ctx = CONTEXT_FULL) => ({
  "@context": ctx,
  ...node,
});
