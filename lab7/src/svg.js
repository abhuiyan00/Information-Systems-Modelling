// Renders a laid-out BPMN process (from layout.js) to a self-contained SVG string.

const FONT = 'Segoe UI, Roboto, Helvetica, Arial, sans-serif';

const COL = {
  pool: '#ffffff', poolBar: '#eef1f6', poolStroke: '#7a869a',
  laneBar: '#f6f8fb', laneStroke: '#aab4c4',
  task: '#ffffff', taskStroke: '#5b6b8c', taskTop: '#eaf0fb',
  event: '#ffffff', eventStroke: '#4a7a3a', eventEndStroke: '#9a3b3b',
  gw: '#fff7e0', gwStroke: '#b08a2e',
  flow: '#3a4660', msg: '#7a4fae', data: '#f2f4f8', dataStroke: '#7a869a',
  anno: '#5b6b8c', cond: '#3a4660', label: '#1c2433',
};

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = []; let cur = '';
  for (const w of words) {
    if (!cur) { cur = w; }
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function multiline(cx, cy, text, max, fs, color, weight) {
  const lines = wrap(text, max);
  const lh = fs + 2.5;
  const startY = cy - ((lines.length - 1) * lh) / 2;
  return lines.map((ln, i) =>
    `<text x="${cx.toFixed(1)}" y="${(startY + i * lh).toFixed(1)}" font-family="${FONT}" font-size="${fs}" fill="${color || COL.label}" text-anchor="middle" dominant-baseline="central"${weight ? ` font-weight="${weight}"` : ''}>${esc(ln)}</text>`
  ).join('');
}

// ---- event markers (drawn centered at cx,cy) ----
function markerGlyph(marker, cx, cy, filled) {
  const f = filled ? '#3a4660' : 'none';
  const st = filled ? '#3a4660' : '#3a4660';
  switch (marker) {
    case 'timer': {
      const r = 9;
      let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${st}" stroke-width="1.3"/>`;
      for (let i = 0; i < 12; i++) { const a = (i * 30) * Math.PI / 180; const x1 = cx + Math.sin(a) * (r - 1); const y1 = cy - Math.cos(a) * (r - 1); const x2 = cx + Math.sin(a) * r; const y2 = cy - Math.cos(a) * r; s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${st}" stroke-width="0.8"/>`; }
      s += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r + 3}" stroke="${st}" stroke-width="1.1"/>`;
      s += `<line x1="${cx}" y1="${cy}" x2="${cx + 4}" y2="${cy + 2}" stroke="${st}" stroke-width="1.1"/>`;
      return s;
    }
    case 'message': {
      const w = 16, h = 11; const x = cx - w / 2, y = cy - h / 2;
      const bg = filled ? '#3a4660' : '#fff'; const fg = filled ? '#fff' : '#3a4660';
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}" stroke="#3a4660" stroke-width="1"/>`
        + `<path d="M${x} ${y} L${cx} ${y + h * 0.6} L${x + w} ${y}" fill="none" stroke="${fg}" stroke-width="1"/>`;
    }
    case 'signal': {
      const r = 9; return `<path d="M${cx} ${cy - r} L${cx + r} ${cy + r * 0.7} L${cx - r} ${cy + r * 0.7} Z" fill="${filled ? '#3a4660' : 'none'}" stroke="#3a4660" stroke-width="1.2"/>`;
    }
    case 'error': {
      const f2 = filled ? '#3a4660' : 'none';
      return `<path d="M${cx - 8} ${cy + 8} L${cx - 2} ${cy - 3} L${cx + 1} ${cy + 3} L${cx + 8} ${cy - 8} L${cx + 2} ${cy + 3} L${cx - 1} ${cy - 3} Z" fill="${f2}" stroke="#3a4660" stroke-width="1.2" stroke-linejoin="round"/>`;
    }
    case 'terminate': {
      return `<circle cx="${cx}" cy="${cy}" r="9" fill="#3a4660"/>`;
    }
    default: return '';
  }
}

function eventShape(n) {
  const { cx, cy } = n; const r = n.w / 2;
  let s = '';
  const isEnd = n.kind === 'endEvent';
  const isInter = n.kind === 'intermediateCatch' || n.kind === 'intermediateThrow' || n.kind === 'boundaryEvent';
  const stroke = isEnd ? COL.eventEndStroke : COL.eventStroke;
  const sw = isEnd ? 3.2 : (isInter ? 1.4 : 1.8);
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" stroke="${stroke}" stroke-width="${sw}"/>`;
  if (isInter) s += `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="${stroke}" stroke-width="1.1"/>`;
  const filled = n.kind === 'intermediateThrow' || (isEnd && (n.marker === 'message'));
  s += markerGlyph(n.marker, cx, cy, n.kind === 'intermediateThrow');
  return s;
}

function taskTypeGlyph(sub, x, y) {
  // 16x16 glyph at top-left (x,y)
  const c = '#5b6b8c';
  switch (sub) {
    case 'user': return `<circle cx="${x + 8}" cy="${y + 5}" r="3" fill="none" stroke="${c}" stroke-width="1.2"/><path d="M${x + 2} ${y + 15} q6 -8 12 0" fill="none" stroke="${c}" stroke-width="1.2"/>`;
    case 'service': { let g = ''; const cx = x + 8, cy = y + 8, r = 5; for (let i = 0; i < 8; i++) { const a = i * 45 * Math.PI / 180; g += `<rect x="${(cx + Math.cos(a) * r - 1).toFixed(1)}" y="${(cy + Math.sin(a) * r - 1).toFixed(1)}" width="2.2" height="2.2" fill="${c}"/>`; } g += `<circle cx="${cx}" cy="${cy}" r="4" fill="#fff" stroke="${c}" stroke-width="1.3"/><circle cx="${cx}" cy="${cy}" r="1.6" fill="${c}"/>`; return g; }
    case 'send': return `<rect x="${x + 1}" y="${y + 3}" width="15" height="10" fill="${c}" stroke="${c}"/><path d="M${x + 1} ${y + 3} L${x + 8.5} ${y + 9} L${x + 16} ${y + 3}" fill="none" stroke="#fff" stroke-width="1"/>`;
    case 'receive': return `<rect x="${x + 1}" y="${y + 3}" width="15" height="10" fill="#fff" stroke="${c}" stroke-width="1.1"/><path d="M${x + 1} ${y + 3} L${x + 8.5} ${y + 9} L${x + 16} ${y + 3}" fill="none" stroke="${c}" stroke-width="1"/>`;
    case 'manual': return `<path d="M${x + 2} ${y + 9} l3 -1 l1 -4 l1 4 l2 -1 l1 1 l1 -1 l1 1 v4 q0 3 -4 3 h-3 q-3 0 -4 -3 z" fill="none" stroke="${c}" stroke-width="1.1" stroke-linejoin="round"/>`;
    case 'script': return `<rect x="${x + 2}" y="${y + 1}" width="12" height="15" rx="1" fill="#fff" stroke="${c}" stroke-width="1.1"/><line x1="${x + 4}" y1="${y + 4}" x2="${x + 12}" y2="${y + 4}" stroke="${c}" stroke-width="1"/><line x1="${x + 4}" y1="${y + 7}" x2="${x + 12}" y2="${y + 7}" stroke="${c}" stroke-width="1"/><line x1="${x + 4}" y1="${y + 10}" x2="${x + 10}" y2="${y + 10}" stroke="${c}" stroke-width="1"/>`;
    case 'business': return `<rect x="${x + 1}" y="${y + 2}" width="15" height="12" fill="#fff" stroke="${c}" stroke-width="1.1"/><line x1="${x + 1}" y1="${y + 6}" x2="${x + 16}" y2="${y + 6}" stroke="${c}" stroke-width="1"/><line x1="${x + 6}" y1="${y + 2}" x2="${x + 6}" y2="${y + 14}" stroke="${c}" stroke-width="1"/>`;
    default: return '';
  }
}

function nodeShape(n) {
  if (n.kind === 'task') {
    let s = `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="9" ry="9" fill="${COL.task}" stroke="${COL.taskStroke}" stroke-width="1.4"/>`;
    s += taskTypeGlyph(n.sub, n.x + 6, n.y + 6);
    s += multiline(n.cx, n.cy + 4, n.label, 19, 10.5, COL.label);
    return s;
  }
  if (n.kind.endsWith('Gateway')) {
    const { cx, cy } = n; const r = n.w / 2;
    let s = `<path d="M${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} L${cx - r} ${cy} Z" fill="${COL.gw}" stroke="${COL.gwStroke}" stroke-width="1.5"/>`;
    if (n.kind === 'exclusiveGateway') s += `<path d="M${cx - 7} ${cy - 7} L${cx + 7} ${cy + 7} M${cx + 7} ${cy - 7} L${cx - 7} ${cy + 7}" stroke="#8a6a1e" stroke-width="2.4" stroke-linecap="round"/>`;
    else if (n.kind === 'parallelGateway') s += `<path d="M${cx} ${cy - 9} L${cx} ${cy + 9} M${cx - 9} ${cy} L${cx + 9} ${cy}" stroke="#8a6a1e" stroke-width="2.6" stroke-linecap="round"/>`;
    else if (n.kind === 'eventBasedGateway') { s += `<circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="#8a6a1e" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="6" fill="none" stroke="#8a6a1e" stroke-width="1"/><path d="M${cx} ${cy - 6} L${cx + 5.5} ${cy - 1.5} L${cx + 3.5} ${cy + 5} L${cx - 3.5} ${cy + 5} L${cx - 5.5} ${cy - 1.5} Z" fill="none" stroke="#8a6a1e" stroke-width="1"/>`; }
    s += multiline(cx, cy + r + 13, n.label, 22, 9.8, COL.label);
    return s;
  }
  // events
  let s = eventShape(n);
  s += multiline(n.cx, n.cy + n.h / 2 + 12, n.label, 20, 9.8, COL.label);
  return s;
}

function polyMid(points) {
  // midpoint by accumulated length, plus the segment it lies on
  let total = 0; const segs = [];
  for (let i = 1; i < points.length; i++) { const d = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y); segs.push(d); total += d; }
  let acc = 0; const half = total / 2;
  for (let i = 1; i < points.length; i++) {
    const d = segs[i - 1];
    if (acc + d >= half) { const t = d === 0 ? 0 : (half - acc) / d; const a = points[i - 1], b = points[i]; const horiz = Math.abs(b.x - a.x) >= Math.abs(b.y - a.y); return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, horiz }; }
    acc += d;
  }
  const m = points[Math.floor(points.length / 2)]; return { x: m.x, y: m.y, horiz: true };
}

function arrow(points, opts = {}) {
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const dash = opts.dash ? ` stroke-dasharray="${opts.dash}"` : '';
  return `<path d="${d}" fill="none" stroke="${opts.stroke}" stroke-width="${opts.sw || 1.4}"${dash} marker-end="url(#${opts.marker})"${opts.markerStart ? ` marker-start="url(#${opts.markerStart})"` : ''}/>`;
}

function dataShape(a) {
  if (a.kind === 'dataStore') {
    const { x, y, w, h } = a; const ry = 6;
    let s = `<path d="M${x} ${y + ry} Q${x} ${y} ${x + w / 2} ${y} Q${x + w} ${y} ${x + w} ${y + ry} L${x + w} ${y + h - ry} Q${x + w} ${y + h} ${x + w / 2} ${y + h} Q${x} ${y + h} ${x} ${y + h - ry} Z" fill="${COL.data}" stroke="${COL.dataStroke}" stroke-width="1.2"/>`;
    s += `<path d="M${x} ${y + ry} Q${x + w / 2} ${y + ry * 2} ${x + w} ${y + ry}" fill="none" stroke="${COL.dataStroke}" stroke-width="1"/>`;
    s += multiline(a.cx, a.cy + 6, a.label, 11, 8.5, COL.anno);
    return s;
  }
  if (a.kind === 'annotation') {
    const { x, y, w, h } = a;
    let s = `<path d="M${x + 8} ${y} L${x} ${y} L${x} ${y + h} L${x + 8} ${y + h}" fill="none" stroke="${COL.anno}" stroke-width="1.1"/>`;
    s += multiline(x + w / 2 + 4, y + h / 2, a.label, 26, 8.6, COL.anno);
    return s;
  }
  // dataObject (page with folded corner)
  const { x, y, w, h } = a; const fold = 11;
  let s = `<path d="M${x} ${y} L${x + w - fold} ${y} L${x + w} ${y + fold} L${x + w} ${y + h} L${x} ${y + h} Z" fill="${COL.data}" stroke="${COL.dataStroke}" stroke-width="1.2"/>`;
  s += `<path d="M${x + w - fold} ${y} L${x + w - fold} ${y + fold} L${x + w} ${y + fold}" fill="none" stroke="${COL.dataStroke}" stroke-width="1"/>`;
  s += multiline(a.cx, a.cy + h / 2 + 9, a.label, 13, 8.3, COL.anno);
  return s;
}

function render(L) {
  const parts = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${L.width}" height="${L.height}" viewBox="0 0 ${L.width} ${L.height}" font-family="${FONT}">`);
  parts.push(`<defs>
    <marker id="seqArr" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L9 4 L0 8 Z" fill="${COL.flow}"/></marker>
    <marker id="msgArr" markerWidth="12" markerHeight="12" refX="9" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L10 5 L1 9" fill="none" stroke="${COL.msg}" stroke-width="1.2"/></marker>
    <marker id="msgStart" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3.2" fill="#fff" stroke="${COL.msg}" stroke-width="1.2"/></marker>
    <marker id="assoc" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 1 L7 4 L0 7" fill="none" stroke="${COL.dataStroke}" stroke-width="1"/></marker>
  </defs>`);
  parts.push(`<rect x="0" y="0" width="${L.width}" height="${L.height}" fill="#ffffff"/>`);

  // pools + lanes
  for (const p of L.pools) {
    parts.push(`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${COL.pool}" stroke="${COL.poolStroke}" stroke-width="1.4"/>`);
    parts.push(`<rect x="${p.x}" y="${p.y}" width="30" height="${p.h}" fill="${COL.poolBar}" stroke="${COL.poolStroke}" stroke-width="1.4"/>`);
    const ptitle = p.name + (p.blackbox ? '  ▪' : '');
    const pfs = Math.max(8.5, Math.min(12, (p.h - 12) / (ptitle.length * 0.62)));
    parts.push(`<text x="${p.x + 16}" y="${p.y + p.h / 2}" font-family="${FONT}" font-size="${pfs.toFixed(1)}" font-weight="600" fill="#33405a" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 ${p.x + 16} ${p.y + p.h / 2})">${esc(ptitle)}</text>`);
    for (const lr of p.laneRects) {
      if (!lr.name) continue;
      parts.push(`<rect x="${lr.x}" y="${lr.y}" width="${lr.w}" height="${lr.h}" fill="none" stroke="${COL.laneStroke}" stroke-width="1"/>`);
      parts.push(`<rect x="${lr.x}" y="${lr.y}" width="24" height="${lr.h}" fill="${COL.laneBar}" stroke="${COL.laneStroke}" stroke-width="1"/>`);
      parts.push(`<text x="${lr.x + 13}" y="${lr.y + lr.h / 2}" font-family="${FONT}" font-size="10.5" font-weight="500" fill="#46536e" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 ${lr.x + 13} ${lr.y + lr.h / 2})">${esc(lr.name)}</text>`);
    }
  }

  // associations (data/annotation -> node), drawn first (under nodes)
  for (const a of [...L.artifacts, ...L.annotations]) {
    const host = L.byId.get(a.attached);
    if (!host) continue;
    const hx = host.cx, hy = host.cy;
    parts.push(arrow([{ x: hx, y: hy }, { x: a.cx, y: a.cy }], { stroke: COL.dataStroke, sw: 1, dash: '2 3', marker: a.kind === 'annotation' ? 'assoc' : 'assoc' }));
  }

  // sequence flows
  for (const f of L.flows) {
    if (!f.waypoints || !f.waypoints.length) continue;
    parts.push(arrow(f.waypoints, { stroke: COL.flow, sw: 1.5, marker: 'seqArr' }));
    if (f.label) {
      const mp = polyMid(f.waypoints);
      const lx = mp.x; const ly = mp.y + (mp.horiz ? -8 : 0);
      const w = f.label.length * 5.4 + 8;
      parts.push(`<rect x="${(lx - w / 2).toFixed(1)}" y="${(ly - 8).toFixed(1)}" width="${w.toFixed(1)}" height="14" rx="3" fill="#ffffff" opacity="0.95"/>`);
      parts.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-family="${FONT}" font-size="9.2" fill="${COL.cond}" text-anchor="middle" dominant-baseline="central">${esc(f.label)}</text>`);
    }
  }

  // message flows
  for (const m of L.messages) {
    if (!m.waypoints || !m.waypoints.length) continue;
    parts.push(arrow(m.waypoints, { stroke: COL.msg, sw: 1.3, dash: '6 4', marker: 'msgArr', markerStart: 'msgStart' }));
    if (m.label) {
      const mid = polyMid(m.waypoints);
      const w = m.label.length * 5.2 + 8;
      parts.push(`<rect x="${(mid.x - w / 2).toFixed(1)}" y="${(mid.y - 7).toFixed(1)}" width="${w.toFixed(1)}" height="13" rx="3" fill="#f6effc" stroke="#d9c6ec" stroke-width="0.6"/>`);
      parts.push(`<text x="${mid.x.toFixed(1)}" y="${(mid.y - 0.5).toFixed(1)}" font-family="${FONT}" font-size="8.8" fill="${COL.msg}" text-anchor="middle" dominant-baseline="central">${esc(m.label)}</text>`);
    }
  }

  // data + annotations
  for (const a of L.artifacts) parts.push(dataShape(a));
  for (const a of L.annotations) parts.push(dataShape(a));

  // nodes on top
  for (const n of L.nodes) parts.push(nodeShape(n));

  parts.push(`</svg>`);
  return parts.join('\n');
}

// ---- BPMN notation legend (for the report) ----
function renderLegend() {
  const W = 980, cell = 196, rowH = 96, cols = 5;
  const items = [
    { type: 'event', kind: 'startEvent', marker: 'none', label: 'Start event' },
    { type: 'event', kind: 'startEvent', marker: 'timer', label: 'Timer start' },
    { type: 'event', kind: 'startEvent', marker: 'message', label: 'Message start' },
    { type: 'event', kind: 'startEvent', marker: 'signal', label: 'Signal start' },
    { type: 'event', kind: 'intermediateCatch', marker: 'message', label: 'Message catch' },
    { type: 'event', kind: 'intermediateCatch', marker: 'timer', label: 'Timer (catch)' },
    { type: 'event', kind: 'endEvent', marker: 'none', label: 'End event' },
    { type: 'event', kind: 'endEvent', marker: 'message', label: 'Message end' },
    { type: 'event', kind: 'endEvent', marker: 'error', label: 'Error end' },
    { type: 'event', kind: 'endEvent', marker: 'terminate', label: 'Terminate end' },
    { type: 'event', kind: 'boundaryEvent', marker: 'error', label: 'Boundary error' },
    { type: 'event', kind: 'boundaryEvent', marker: 'timer', label: 'Boundary timer' },
    { type: 'gw', kind: 'exclusiveGateway', label: 'Exclusive (XOR)' },
    { type: 'gw', kind: 'parallelGateway', label: 'Parallel (AND)' },
    { type: 'gw', kind: 'eventBasedGateway', label: 'Event-based' },
    { type: 'task', sub: 'user', label: 'User task' },
    { type: 'task', sub: 'service', label: 'Service task' },
    { type: 'task', sub: 'send', label: 'Send task' },
    { type: 'task', sub: 'receive', label: 'Receive task' },
    { type: 'task', sub: 'manual', label: 'Manual task' },
    { type: 'task', sub: 'script', label: 'Script task' },
    { type: 'task', sub: 'business', label: 'Business-rule task' },
    { type: 'data', kind: 'dataObject', label: 'Data object' },
    { type: 'data', kind: 'dataStore', label: 'Data store' },
    { type: 'flow', kind: 'seq', label: 'Sequence flow' },
    { type: 'flow', kind: 'msg', label: 'Message flow' },
    { type: 'flow', kind: 'assoc', label: 'Association' },
    { type: 'anno', label: 'Text annotation' },
  ];
  const rows = Math.ceil(items.length / cols);
  const H = rows * rowH + 20;
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">`];
  parts.push(`<defs>
    <marker id="seqArr" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L9 4 L0 8 Z" fill="${COL.flow}"/></marker>
    <marker id="msgArr" markerWidth="12" markerHeight="12" refX="9" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L10 5 L1 9" fill="none" stroke="${COL.msg}" stroke-width="1.2"/></marker>
    <marker id="msgStart" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3.2" fill="#fff" stroke="${COL.msg}" stroke-width="1.2"/></marker>
    <marker id="assoc" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 1 L7 4 L0 7" fill="none" stroke="${COL.dataStroke}" stroke-width="1"/></marker>
  </defs>`);
  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>`);
  items.forEach((it, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const gx = c * cell + 14, gy = r * rowH + 18;
    const cx = gx + 34, cy = gy + 28;
    if (it.type === 'event') parts.push(nodeShape({ kind: it.kind, marker: it.marker, label: '', x: cx - 18, y: cy - 18, w: 36, h: 36, cx, cy, attachedTo: null }));
    else if (it.type === 'gw') parts.push(nodeShape({ kind: it.kind, label: '', x: cx - 22, y: cy - 22, w: 44, h: 44, cx, cy }));
    else if (it.type === 'task') parts.push(`<rect x="${cx - 30}" y="${cy - 18}" width="60" height="40" rx="7" fill="${COL.task}" stroke="${COL.taskStroke}" stroke-width="1.3"/>` + taskTypeGlyph(it.sub, cx - 26, cy - 14));
    else if (it.type === 'data') parts.push(dataShape({ kind: it.kind, label: '', x: cx - (it.kind === 'dataStore' ? 25 : 18), y: cy - 22, w: it.kind === 'dataStore' ? 50 : 36, h: 44, cx, cy: cy - (it.kind === 'dataStore' ? 0 : 6) }));
    else if (it.type === 'anno') parts.push(`<path d="M${cx - 20} ${cy - 16} L${cx - 28} ${cy - 16} L${cx - 28} ${cy + 16} L${cx - 20} ${cy + 16}" fill="none" stroke="${COL.anno}" stroke-width="1.1"/><line x1="${cx - 22}" y1="${cy - 6}" x2="${cx + 18}" y2="${cy - 6}" stroke="${COL.anno}" stroke-width="1"/><line x1="${cx - 22}" y1="${cy}" x2="${cx + 12}" y2="${cy}" stroke="${COL.anno}" stroke-width="1"/>`);
    else if (it.type === 'flow') {
      if (it.kind === 'seq') parts.push(arrow([{ x: cx - 26, y: cy }, { x: cx + 24, y: cy }], { stroke: COL.flow, sw: 1.6, marker: 'seqArr' }));
      else if (it.kind === 'msg') parts.push(arrow([{ x: cx - 26, y: cy }, { x: cx + 24, y: cy }], { stroke: COL.msg, sw: 1.3, dash: '6 4', marker: 'msgArr', markerStart: 'msgStart' }));
      else parts.push(arrow([{ x: cx - 26, y: cy }, { x: cx + 24, y: cy }], { stroke: COL.dataStroke, sw: 1, dash: '2 3', marker: 'assoc' }));
    }
    const lx = gx + 70;
    parts.push(`<text x="${lx}" y="${cy}" font-family="${FONT}" font-size="11.5" fill="${COL.label}" dominant-baseline="central">${esc(it.label)}</text>`);
  });
  parts.push(`</svg>`);
  return parts.join('\n');
}

module.exports = { render, renderLegend };
