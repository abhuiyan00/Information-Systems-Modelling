// Central namespace registry. One place defines every prefix; RDFa @prefix,
// JSON-LD @context and the Turtle/JSON-LD serialisers all derive from here, so
// the page markup and the embedded data can never drift apart.

export const SCHEMA = "https://schema.org/";

export const PREFIXES = {
  mc: "http://modellingclub.local/ontology#",
  mcr: "http://modellingclub.local/resource/",
  schema: SCHEMA,
  xsd: "http://www.w3.org/2001/XMLSchema#",
  dc: "http://purl.org/dc/elements/1.1/",
};

// Value for the RDFa <html prefix="..."> attribute.
export const RDFA_PREFIX = Object.entries(PREFIXES)
  .map(([p, iri]) => `${p}: ${iri}`)
  .join("\n              ");

// JSON-LD @context variants. mcr: is always declared — an undefined prefix in a
// JSON-LD @context is read as a literal scheme IRI, which silently corrupts the
// subject IRIs (the classic "mcr: is missing" bug).
export const CONTEXT_FULL = {
  "@vocab": SCHEMA,
  schema: SCHEMA,
  mc: PREFIXES.mc,
  mcr: PREFIXES.mcr,
  xsd: PREFIXES.xsd,
};

export const CONTEXT_LITE = {
  "@vocab": SCHEMA,
  mc: PREFIXES.mc,
  mcr: PREFIXES.mcr,
};

// Expand a compact IRI ("mc:DroneBuild") to a full IRI.
export function expand(curie) {
  const i = curie.indexOf(":");
  if (i === -1) return curie;
  const prefix = curie.slice(0, i);
  const local = curie.slice(i + 1);
  return PREFIXES[prefix] ? PREFIXES[prefix] + local : curie;
}
