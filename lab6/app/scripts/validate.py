"""Validate the generated semantic data.

For every page in app/dist/ this parses the embedded JSON-LD with rdflib and
reports the triple count, proving the markup yields real RDF. (RDFa is validated
externally with RDFa Play / the schema.org validator.)

Run:  python scripts/validate.py        (after `npm run build`)
"""
import glob
import os
import re
import sys

try:
    import rdflib
except ImportError:
    sys.exit("rdflib not installed. Run: pip install rdflib")

DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")
PATTERN = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)

if not os.path.isdir(DIST):
    sys.exit("app/dist/ not found. Run `npm run build` first.")

total = 0
failures = 0
for path in sorted(glob.glob(os.path.join(DIST, "*.html"))):
    name = os.path.basename(path)
    with open(path, encoding="utf-8") as fh:
        blocks = PATTERN.findall(fh.read())
    if not blocks:
        print(f"  {name:22} no JSON-LD block")
        continue
    triples = 0
    for block in blocks:
        try:
            g = rdflib.Graph().parse(data=block, format="json-ld")
            triples += len(g)
        except Exception as exc:  # noqa: BLE001
            failures += 1
            print(f"  {name:22} PARSE ERROR: {exc}")
    total += triples
    print(f"  {name:22} {triples:>3} triples")

print(f"\n  total: {total} triples across all pages")
sys.exit(1 if failures else 0)
