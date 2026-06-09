"""Count RDF triples in each page's embedded JSON-LD (offline check, Lab 6)."""
import re, glob, os, rdflib

os.chdir(os.path.dirname(os.path.abspath(__file__)))  # scan the script's folder

PATTERN = re.compile(
    r'<script type="application/ld\+json">(.*?)</script>', re.S)

for path in sorted(glob.glob("*.html")):
    html = open(path, encoding="utf-8").read()
    blocks = PATTERN.findall(html)
    if not blocks:
        print(f"{path:22} no JSON-LD block")
        continue
    total = 0
    for block in blocks:
        g = rdflib.Graph().parse(data=block, format="json-ld")
        total += len(g)
    print(f"{path:22} {total} triples")
