"""
Task 3 — Verify, convert and serialise ModellingClub RDF files.
Run from lab5/ folder:  python convert.py
"""

from rdflib import Graph, ConjunctiveGraph

ONTOLOGY = "ontology.ttl"
INSTANCES = "instances.ttl"

# ─── 1. Validate each file individually ───────────────────────────────────────

print("=" * 60)
print("STEP 1 — Parsing & validation")
print("=" * 60)

g_onto = Graph()
try:
    g_onto.parse(ONTOLOGY, format="turtle")
    print(f"[OK] {ONTOLOGY} — {len(g_onto)} triples loaded")
except Exception as e:
    print(f"[ERROR] {ONTOLOGY}: {e}")

g_inst = Graph()
try:
    g_inst.parse(INSTANCES, format="turtle")
    print(f"[OK] {INSTANCES} — {len(g_inst)} triples loaded")
except Exception as e:
    print(f"[ERROR] {INSTANCES}: {e}")

# ─── 2. Merge into one graph ──────────────────────────────────────────────────

print()
print("=" * 60)
print("STEP 2 — Merging graphs")
print("=" * 60)

g_all = Graph()
g_all.parse(ONTOLOGY, format="turtle")
g_all.parse(INSTANCES, format="turtle")
print(f"[OK] Combined graph — {len(g_all)} triples total")

# ─── 3. Convert to RDF/XML ────────────────────────────────────────────────────

print()
print("=" * 60)
print("STEP 3 — Serialising to RDF/XML")
print("=" * 60)

try:
    g_all.serialize(destination="ontology_instances.rdf", format="xml")
    print("[OK] Written: ontology_instances.rdf")
except Exception as e:
    print(f"[ERROR] RDF/XML: {e}")

# ─── 4. Convert to JSON-LD ────────────────────────────────────────────────────

print()
print("=" * 60)
print("STEP 4 — Serialising to JSON-LD")
print("=" * 60)

try:
    g_all.serialize(destination="ontology_instances.jsonld", format="json-ld", indent=2)
    print("[OK] Written: ontology_instances.jsonld")
except Exception as e:
    print(f"[ERROR] JSON-LD: {e}")

# ─── 5. Quick sanity stats ────────────────────────────────────────────────────

print()
print("=" * 60)
print("STEP 5 — Sanity check (class counts)")
print("=" * 60)

from rdflib.namespace import RDF

query = """
PREFIX mc: <http://modellingclub.local/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?class (COUNT(?inst) AS ?count)
WHERE {
    ?inst rdf:type ?class .
    FILTER(STRSTARTS(STR(?class), "http://modellingclub.local/ontology#"))
}
GROUP BY ?class
ORDER BY DESC(?count)
"""

results = g_all.query(query)
for row in results:
    print(f"  {str(row['class']).split('#')[1]:<30} {row['count']}")

print()
print("All done. Check the lab4/ folder for:")
print("  ontology_instances.rdf    (RDF/XML)")
print("  ontology_instances.jsonld (JSON-LD)")