// Generates the "VOCAB MAP" provenance comment by WALKING the JSON-LD graph
// instead of hand-maintaining a list per page. For any page it reports which
// schema.org terms and which custom mc: terms are present, and flags the
// custom-ONLY sub-graphs (mc: types with no schema.org sibling) — the heart of
// the lab: "schema.org first, custom vocabulary where schema.org has no term".

const RESERVED = new Set(["@id", "@type", "@value", "@graph", "@context"]);

function walk(node, acc) {
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, acc));
    return;
  }
  if (!node || typeof node !== "object") return;

  const types = node["@type"];
  if (types) {
    const list = (Array.isArray(types) ? types : [types]).filter(
      (t) => typeof t === "string"
    );
    // A schema.org class is unprefixed (resolves via @vocab). mc: = custom.
    // Anything else with a prefix (xsd:decimal etc.) is a datatype, not a class.
    const isSchema = (t) => !t.includes(":");
    const isMc = (t) => t.startsWith("mc:");
    list.forEach((t) => {
      if (isMc(t)) acc.mcTypes.add(t);
      else if (isSchema(t)) acc.schemaTypes.add(t);
    });
    // A node typed ONLY with mc: classes is a custom-only sub-graph.
    if (list.some(isMc) && !list.some(isSchema)) {
      list.filter(isMc).forEach((t) => acc.customOnly.add(t));
    }
  }

  for (const [key, value] of Object.entries(node)) {
    if (RESERVED.has(key)) continue;
    if (key.startsWith("mc:")) acc.mcProps.add(key);
    else if (key !== "additionalType") acc.schemaProps.add(key);
    walk(value, acc);
  }
}

export function vocabMap(jsonld) {
  const acc = {
    schemaTypes: new Set(),
    mcTypes: new Set(),
    schemaProps: new Set(),
    mcProps: new Set(),
    customOnly: new Set(),
  };
  walk(jsonld, acc);

  const fmt = (set) => (set.size ? [...set].sort().join(", ") : "—");
  const lines = [
    "  ════ VOCAB MAP (generated from this page's graph) ════════════════════",
    `       schema.org types : ${fmt(acc.schemaTypes)}`,
    `       schema.org props : ${fmt(acc.schemaProps)}`,
    `       custom mc: types : ${fmt(acc.mcTypes)}`,
    `       custom mc: props : ${fmt(acc.mcProps)}`,
    `       custom-ONLY      : ${fmt(acc.customOnly)}  (mc: with no schema.org sibling)`,
    "  ══════════════════════════════════════════════════════════════════════",
  ];
  return `  <!--\n${lines.join("\n")}\n  -->`;
}
