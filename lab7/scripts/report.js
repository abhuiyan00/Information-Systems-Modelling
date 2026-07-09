const fs = require('fs');
const path = require('path');
const specs = require('../src/specs');
const { layout } = require('../src/layout');
const { render, renderLegend } = require('../src/svg');
const T = require('../src/report-text');

const ROOT = path.join(__dirname, '..');
const DIAG = path.join(ROOT, 'diagrams');
const REPORT = path.join(ROOT, 'report');
fs.mkdirSync(REPORT, { recursive: true });

const byId = Object.fromEntries(specs.map((s) => [s.id, s]));
function svgInline(id) {
  let s = fs.readFileSync(path.join(DIAG, id + '.svg'), 'utf8');
  s = s.replace(/<\?xml[^>]*\?>\s*/, '').replace('<svg ', '<svg class="bpmn" ');
  return s;
}
function participants(spec) {
  return spec.pools.map((p) => p.name + (p.blackbox ? ' (external)' : '')).join(' · ');
}

const css = `
  @page { size: A4 landscape; margin: 13mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1c2433; font-size: 10.5pt; line-height: 1.5; margin: 0; }
  h1 { font-size: 25pt; margin: 0 0 4pt; color: #1d2a44; letter-spacing: -.3pt; }
  h2 { font-size: 15pt; margin: 0 0 8pt; color: #1d2a44; border-bottom: 2px solid #c9d3e4; padding-bottom: 4pt; }
  h3 { font-size: 12.5pt; margin: 0 0 3pt; color: #233; }
  p { margin: 0 0 8pt; text-align: justify; }
  code { background: #eef1f6; padding: 0 3px; border-radius: 3px; font-size: 9.2pt; font-family: "Cascadia Code", Consolas, monospace; }
  .sub { color: #5b6b8c; }
  .cover { display: flex; flex-direction: column; justify-content: center; height: 178mm; }
  .cover .kicker { letter-spacing: 3pt; text-transform: uppercase; font-size: 10pt; font-weight: 600; color:#6675a0; }
  .cover .lead { font-size: 12pt; max-width: 220mm; }
  .meta-line { color:#46536e; font-size: 10pt; margin-top: 14pt; }
  .section { page-break-before: always; }
  .twocol { column-count: 2; column-gap: 12mm; }
  .legend { text-align:center; margin: 6pt 0; }
  .legend svg { max-width: 100%; height: auto; max-height: 114mm; }
  table { width: 100%; border-collapse: collapse; font-size: 9pt; }
  th, td { border: 1px solid #c9d3e4; padding: 5pt 7pt; vertical-align: top; text-align: left; }
  th { background: #eef1f6; color:#33405a; }
  td.id { font-weight:600; white-space:nowrap; color:#1d2a44; }
  .process { page-break-before: always; height: 181mm; display: flex; flex-direction: column; }
  .process h2 { margin-bottom: 6pt; }
  .process p { margin: 0 0 5pt; font-size: 10pt; line-height: 1.4; }
  .pmeta { background:#f6f8fb; border:1px solid #dce3ef; border-radius:6px; padding:7pt 10pt; margin:0 0 6pt; font-size:9.2pt; line-height:1.4; }
  .pmeta b { color:#33405a; }
  .pmeta div { margin: 1pt 0; }
  .figwrap { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; }
  .figwrap svg.bpmn { max-width: 100%; max-height: 100%; width: auto; height: auto; border:1px solid #e3e8f0; border-radius:4px; }
  .cap { flex: 0 0 auto; font-size: 8.6pt; color:#6a7690; margin-top: 4pt; text-align:center; }
  .cap { font-size: 8.6pt; color:#6a7690; margin-top: 3pt; }
  .grouphdr { page-break-before: always; }
  .grouphdr .big { font-size: 19pt; color:#6675a0; font-weight:700; }
  a { color:#3a5a9a; text-decoration:none; }
  .refs li { margin-bottom: 4pt; font-size: 9.5pt; }
`;

const out = [];
out.push(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>ModellingClub — Life-Cycle Processes in BPMN</title><style>${css}</style></head><body>`);

// cover
out.push(`<div class="cover">
  <div class="kicker">PWR · ISM · Laboratory 7 — BPMN</div>
  <h1>Modelling the Life Cycle of the<br><span style="color:#3a5a9a">ModellingClub</span> System in BPMN&nbsp;2.0</h1>
  <p class="lead sub">Eight business processes covering maintenance, deployment, migration, data governance, security and the business life cycle of the full-stack platform built in Labs&nbsp;4–6 — modelled as BPMN collaborations, with editable <code>.bpmn</code> sources.</p>
  <div class="meta-line">Deliverables: this report (PDF) · 8 BPMN diagrams · 8 Camunda-compatible <code>.bpmn</code> files &nbsp;|&nbsp; Generated 2026-06-13</div>
</div>`);

// section 1 — aim
out.push(`<div class="section"><h2>1 · Aim &amp; scope</h2>`);
out.push(`<p>${T.intro}</p><p>${T.why}</p></div>`);

// section 2 — system
out.push(`<div class="section"><h2>2 · The system under study</h2><p>${T.systemContext}</p></div>`);

// section 3 — notation
out.push(`<div class="section"><h2>3 · BPMN notation used in this report</h2><p>${T.primer}</p>`);
out.push(`<div class="legend">${renderLegend()}</div>`);
out.push(`<p class="cap">Legend — the BPMN&nbsp;2.0 element palette used across the eight models.</p></div>`);

// section 4 — overview table
out.push(`<div class="section"><h2>4 · Process catalogue</h2>`);
out.push(`<table><thead><tr><th style="width:12%">Process</th><th style="width:24%">Trigger</th><th style="width:30%">Participants (pools)</th><th>Key BPMN constructs</th></tr></thead><tbody>`);
for (const g of T.groups) {
  for (const id of g.ids) {
    const s = byId[id];
    out.push(`<tr><td class="id">${s.num}. ${s.title}</td><td>${s.trigger}</td><td>${participants(s)}</td><td>${s.constructs}</td></tr>`);
  }
}
out.push(`</tbody></table>`);
out.push(`<p class="cap" style="margin-top:8pt">The eight processes are organised in four themes: (A) maintenance &amp; operations, (B) deployment &amp; migration, (C) data governance &amp; security, (D) business life cycle.</p></div>`);

// process sections
let sectionNo = 4;
for (const g of T.groups) {
  for (let k = 0; k < g.ids.length; k++) {
    const id = g.ids[k];
    const s = byId[id];
    out.push(`<div class="process">`);
    out.push(`<h2>${s.num} · ${s.title}</h2>`);
    out.push(`<div class="pmeta">
      <div><b>Goal.</b> ${s.goal}</div>
      <div><b>Trigger.</b> ${s.trigger}</div>
      <div><b>Participants.</b> ${participants(s)}</div>
      <div><b>BPMN constructs.</b> ${s.constructs}</div>
    </div>`);
    out.push(`<p>${T.narratives[id]}</p>`);
    out.push(`<div class="figwrap">${svgInline(id)}</div>`);
    out.push(`<div class="cap">Figure ${s.num} — ${s.title} (BPMN collaboration). Editable source: <code>bpmn/${id}.bpmn</code>.</div>`);
    out.push(`</div>`);
  }
}

// closing + references
out.push(`<div class="section"><h2>5 · Correctness &amp; deliverables</h2><p>${T.closing}</p>`);
out.push(`<h3 style="margin-top:10pt">Deliverables in this submission</h3><ul>
  <li><code>lab7-report.pdf</code> — this report (textual description + all eight BPMN diagrams).</li>
  <li><code>bpmn/*.bpmn</code> — eight editable BPMN&nbsp;2.0 files (open in Camunda Modeler).</li>
  <li><code>diagrams/*.svg</code> — the rendered diagrams as standalone vector images.</li>
  <li><code>src/</code>, <code>scripts/</code> — the generator that produces the diagrams and this report from a single model.</li>
</ul></div>`);

out.push(`<div class="section"><h2>References</h2><ol class="refs">`);
for (const [org, title, url] of T.references) out.push(`<li><b>${org}.</b> ${title}. <a href="${url}">${url}</a></li>`);
out.push(`</ol></div>`);

out.push(`</body></html>`);

fs.writeFileSync(path.join(REPORT, 'report.html'), out.join('\n'));
console.log('report/report.html written (' + (out.join('').length / 1024).toFixed(0) + ' KB)');
