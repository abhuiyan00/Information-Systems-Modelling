// Automatic BPMN layout: layered (left->right) ranking + lane-banded rows.
// Produces absolute geometry shared by the SVG renderer and the BPMN DI emitter.

const SIZE = {
  task: { w: 130, h: 74 },
  event: { w: 36, h: 36 },
  boundary: { w: 30, h: 30 },
  gateway: { w: 52, h: 52 },
  dataObject: { w: 40, h: 56 },
  dataStore: { w: 54, h: 50 },
  annotation: { w: 150, h: 44 },
};
const COL_PITCH = 188;     // horizontal centre-to-centre between columns
const TRACK_PITCH = 112;   // vertical centre-to-centre between stacked nodes in a lane
const POOL_HEADER = 30;    // width of vertical pool title bar
const LANE_HEADER = 24;    // width of vertical lane title bar
const CONTENT_PAD_X = 36;  // padding left/right inside content area
const TRACK_PAD = 28;      // vertical padding top/bottom of a lane's node tracks
const DATA_ROW_H = 92;     // extra height when a lane carries data objects / annotations
const POOL_GAP = 26;       // vertical gap between pools

function sizeOf(node) {
  if (node.kind === 'task') return { ...SIZE.task };
  if (node.kind === 'boundaryEvent') return { ...SIZE.boundary };
  if (node.kind.endsWith('Gateway')) return { ...SIZE.gateway };
  return { ...SIZE.event };
}

function layout(spec) {
  const nodes = spec.nodes.map((n) => ({ ...n }));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const flows = spec.flows.map(([from, to, label]) => ({ from, to, label }));

  // ---- 1. graph + back-edge detection (DFS) ----
  const adj = new Map(nodes.map((n) => [n.id, []]));
  for (const f of flows) if (adj.has(f.from)) adj.get(f.from).push(f.to);
  // boundary event: treat as sitting on its host for ranking purposes
  const hostRankSource = new Map(); // boundaryId -> hostId
  for (const n of nodes) if (n.kind === 'boundaryEvent') hostRankSource.set(n.id, n.attachedTo);

  const starts = nodes.filter((n) => n.kind === 'startEvent').map((n) => n.id);
  const color = new Map(); // 0 white,1 gray,2 black
  const backEdges = new Set();
  const dfs = (u) => {
    color.set(u, 1);
    for (const v of adj.get(u) || []) {
      if (color.get(v) === 1) backEdges.add(u + '->' + v);
      else if (!color.get(v)) dfs(v);
    }
    color.set(u, 2);
  };
  for (const s of starts) if (!color.get(s)) dfs(s);
  for (const n of nodes) if (!color.get(n.id)) dfs(n.id); // unreached components

  // ---- 2. longest-path rank over forward edges ----
  const rank = new Map();
  const fwd = new Map(nodes.map((n) => [n.id, []]));
  const indeg = new Map(nodes.map((n) => [n.id, 0]));
  for (const f of flows) {
    if (backEdges.has(f.from + '->' + f.to)) continue;
    fwd.get(f.from).push(f.to);
    indeg.set(f.to, indeg.get(f.to) + 1);
  }
  // boundary events inherit host rank, and are not ranked via indeg from host
  // seed ranks
  for (const n of nodes) rank.set(n.id, 0);
  // Kahn topological order on forward edges
  const q = [];
  for (const n of nodes) if (indeg.get(n.id) === 0) q.push(n.id);
  const topo = [];
  const indeg2 = new Map(indeg);
  while (q.length) {
    const u = q.shift();
    topo.push(u);
    for (const v of fwd.get(u)) {
      indeg2.set(v, indeg2.get(v) - 1);
      if (indeg2.get(v) === 0) q.push(v);
    }
  }
  for (const u of topo) {
    for (const v of fwd.get(u)) {
      if (rank.get(v) < rank.get(u) + 1) rank.set(v, rank.get(u) + 1);
    }
  }
  // boundary events -> host rank; their successors pushed one past host
  for (const [bid, hid] of hostRankSource) {
    rank.set(bid, rank.get(hid));
    for (const v of fwd.get(bid)) if (rank.get(v) <= rank.get(hid)) rank.set(v, rank.get(hid) + 1);
  }
  // propagate again for those bumped successors (small graphs: one more pass)
  for (let i = 0; i < 4; i++) {
    for (const u of topo) for (const v of fwd.get(u)) if (rank.get(v) < rank.get(u) + 1) rank.set(v, rank.get(u) + 1);
  }
  for (const n of nodes) n.col = rank.get(n.id);

  // ---- 3. pools / lanes ordering ----
  const pools = spec.pools.map((p) => ({ ...p }));
  // assign each node a (poolIdx, laneKey)
  const laneKey = (n) => n.pool + '::' + (n.lane || '_single');

  // ---- 4. track assignment within each lane ----
  // boundary events are not tracked (sit on host)
  const flowNodes = nodes.filter((n) => n.kind !== 'boundaryEvent');
  const laneTracks = new Map(); // laneKey -> occupancy: Map(col -> Set(track))
  const trackOf = new Map();
  // order: by pool order, lane order, then col, then id for determinism
  const poolOrder = new Map(pools.map((p, i) => [p.id, i]));
  const laneOrderInPool = (p) => (p.lanes && p.lanes.length ? p.lanes : ['_single']);
  flowNodes.sort((a, b) => {
    const pa = poolOrder.get(a.pool), pb = poolOrder.get(b.pool);
    if (pa !== pb) return pa - pb;
    const la = laneOrderInPool(byPool(a.pool)).indexOf(a.lane || '_single');
    const lb = laneOrderInPool(byPool(b.pool)).indexOf(b.lane || '_single');
    if (la !== lb) return la - lb;
    if (a.col !== b.col) return a.col - b.col;
    return a.id.localeCompare(b.id);
  });
  function byPool(id) { return pools.find((p) => p.id === id); }
  for (const n of flowNodes) {
    const k = laneKey(n);
    if (!laneTracks.has(k)) laneTracks.set(k, new Map());
    const occ = laneTracks.get(k);
    let t = 0;
    while (occ.has(n.col) && occ.get(n.col).has(t)) t++;
    if (!occ.has(n.col)) occ.set(n.col, new Set());
    occ.get(n.col).add(t);
    trackOf.set(n.id, t);
  }

  // lanes that carry data/annotations need an extra data row
  const laneHasData = new Set();
  const attachLaneKey = (nodeId) => {
    const n = byId.get(nodeId);
    if (!n) return null;
    const host = n.kind === 'boundaryEvent' ? byId.get(n.attachedTo) : n;
    return host.pool + '::' + (host.lane || '_single');
  };
  for (const d of spec.data || []) { const k = attachLaneKey(d.attached); if (k) laneHasData.add(k); }
  for (const a of spec.annotations || []) { const k = attachLaneKey(a.attached); if (k) laneHasData.add(k); }

  // ---- 5. vertical geometry: pool/lane bands ----
  const numCols = Math.max(...nodes.map((n) => n.col)) + 1;
  const contentLeft = (p) => p.x + POOL_HEADER + (p.lanes && p.lanes.length ? LANE_HEADER : 0);
  const colCenterX = (p, col) => contentLeft(p) + CONTENT_PAD_X + col * COL_PITCH + SIZE.task.w / 2;
  const poolContentW = CONTENT_PAD_X * 2 + (numCols - 1) * COL_PITCH + SIZE.task.w;
  const poolW = Math.max(...pools.map((p) => POOL_HEADER + (p.lanes && p.lanes.length ? LANE_HEADER : 0))) + poolContentW;
  const fullPoolW = poolW; // uniform width

  let cursorY = 10;
  const laneGeom = new Map(); // laneKey -> {top, nodeTracksH, height}
  for (const p of pools) {
    p.x = 10;
    p.y = cursorY;
    p.w = fullPoolW;
    p.laneRects = [];
    const laneNames = p.lanes && p.lanes.length ? p.lanes : ['_single'];
    let laneTop = cursorY;
    let poolH = 0;
    for (const ln of laneNames) {
      const k = p.id + '::' + ln;
      const occ = laneTracks.get(k);
      let maxTrack = 0;
      if (occ) for (const set of occ.values()) for (const t of set) maxTrack = Math.max(maxTrack, t);
      const tracks = (occ ? maxTrack + 1 : 1);
      const nodeTracksH = tracks * TRACK_PITCH + TRACK_PAD * 0; // centres need pad both sides
      const dataH = laneHasData.has(k) ? DATA_ROW_H : 0;
      const height = TRACK_PAD + tracks * TRACK_PITCH + dataH;
      laneGeom.set(k, { top: laneTop, tracks, nodeTracksH: tracks * TRACK_PITCH, dataTop: laneTop + TRACK_PAD / 2 + tracks * TRACK_PITCH, height });
      p.laneRects.push({ name: ln === '_single' ? null : ln, x: p.x + POOL_HEADER, y: laneTop, w: p.w - POOL_HEADER, h: height });
      laneTop += height;
      poolH += height;
    }
    p.h = poolH;
    cursorY = p.y + poolH + POOL_GAP;
    p.contentLeftX = contentLeft(p);
  }
  const totalH = cursorY - POOL_GAP + 10;
  const totalW = 10 + fullPoolW + 10;

  // ---- 6. node coordinates ----
  for (const n of flowNodes) {
    const p = byPool(n.pool);
    const k = laneKey(n);
    const g = laneGeom.get(k);
    const t = trackOf.get(n.id);
    const sz = sizeOf(n);
    n.w = sz.w; n.h = sz.h;
    n.cx = colCenterX(p, n.col);
    n.cy = g.top + TRACK_PAD / 2 + t * TRACK_PITCH + TRACK_PITCH / 2;
    n.x = n.cx - n.w / 2;
    n.y = n.cy - n.h / 2;
  }
  // boundary events: place on bottom border of host
  for (const n of nodes.filter((x) => x.kind === 'boundaryEvent')) {
    const host = byId.get(n.attachedTo);
    const sz = sizeOf(n); n.w = sz.w; n.h = sz.h;
    n.cx = host.x + host.w * 0.72;
    n.cy = host.y + host.h;
    n.x = n.cx - n.w / 2; n.y = n.cy - n.h / 2;
  }

  // ---- 7. data objects & annotations placement ----
  const artifacts = [];
  const dataColUse = new Map(); // laneKey+col -> count for x stagger
  const placeArtifact = (attachedId, kind, label, sizeKey) => {
    const host = byId.get(attachedId);
    if (!host) return null;
    const lk = (host.kind === 'boundaryEvent' ? byId.get(host.attachedTo) : host);
    const k = lk.pool + '::' + (lk.lane || '_single');
    const g = laneGeom.get(k);
    const sz = { ...SIZE[sizeKey] };
    const ckey = k + '::' + lk.col;
    const idx = dataColUse.get(ckey) || 0;
    dataColUse.set(ckey, idx + 1);
    const cx = lk.cx + (idx === 0 ? 0 : (idx % 2 ? 1 : -1) * Math.ceil(idx / 2) * (sz.w + 18));
    const cy = g.dataTop + DATA_ROW_H / 2;
    return { kind, label, attached: attachedId, w: sz.w, h: sz.h, cx, cy, x: cx - sz.w / 2, y: cy - sz.h / 2 };
  };
  for (const d of spec.data || []) {
    const a = placeArtifact(d.attached, d.kind, d.label, d.kind === 'dataStore' ? 'dataStore' : 'dataObject');
    if (a) { a.id = d.id; artifacts.push(a); }
  }
  const annotations = [];
  for (const an of spec.annotations || []) {
    const a = placeArtifact(an.attached, 'annotation', an.text, 'annotation');
    if (a) annotations.push(a);
  }

  // ---- 8. sequence-flow routing ----
  const PORT = { right: (n) => ({ x: n.x + n.w, y: n.cy }), left: (n) => ({ x: n.x, y: n.cy }), top: (n) => ({ x: n.cx, y: n.y }), bottom: (n) => ({ x: n.cx, y: n.y + n.h }) };
  let backIdx = 0;
  for (const f of flows) {
    const s = byId.get(f.from), t = byId.get(f.to);
    if (!s || !t) { f.waypoints = []; continue; }
    const isBack = backEdges.has(f.from + '->' + f.to) || t.col < s.col;
    if (s.kind === 'boundaryEvent') {
      // exit downward from boundary, then route to target
      const start = { x: s.cx, y: s.y + s.h };
      if (t.col > s.col) {
        const midX = (start.x + t.x) / 2;
        f.waypoints = [start, { x: start.x, y: t.cy }, { x: t.x, y: t.cy }];
        f.waypoints = [start, { x: start.x, y: (s.y + s.h + t.cy) / 2 }, { x: t.cx, y: (s.y + s.h + t.cy) / 2 }, PORT.top(t)];
      } else {
        const ch = Math.max(s.y + s.h, t.y + t.h) + 26 + (backIdx++ % 3) * 12;
        f.waypoints = [start, { x: start.x, y: ch }, { x: t.cx, y: ch }, PORT.bottom(t)];
      }
      continue;
    }
    if (isBack) {
      const sp = PORT.bottom(s), tp = PORT.bottom(t);
      const ch = Math.max(s.y + s.h, t.y + t.h) + 24 + (backIdx++ % 3) * 12;
      f.waypoints = [sp, { x: sp.x, y: ch }, { x: tp.x, y: ch }, tp];
      continue;
    }
    if (t.col === s.col) {
      // vertical neighbour
      if (t.cy > s.cy) f.waypoints = [PORT.bottom(s), PORT.top(t)];
      else f.waypoints = [PORT.top(s), PORT.bottom(t)];
      continue;
    }
    // forward
    const sp = PORT.right(s), tp = PORT.left(t);
    if (Math.abs(sp.y - tp.y) < 2) {
      f.waypoints = [sp, tp];
    } else {
      const midX = (sp.x + tp.x) / 2;
      f.waypoints = [sp, { x: midX, y: sp.y }, { x: midX, y: tp.y }, tp];
    }
  }

  // ---- 9. message-flow routing (cross-pool, vertical) ----
  const messages = (spec.messages || []).map((m) => ({ ...m }));
  const endpoint = (ref, otherY) => {
    const n = byId.get(ref);
    if (n) return n;
    const p = byPool(ref);
    return { isPool: true, pool: p };
  };
  for (const m of messages) {
    const sRef = endpoint(m.from), tRef = endpoint(m.to);
    // determine y positions of pools to know direction
    const yOf = (ref) => ref.isPool ? (ref.pool.y + ref.pool.h / 2) : ref.cy;
    const sy = yOf(sRef), ty = yOf(tRef);
    const goingDown = ty > sy;
    const sPoint = (() => {
      if (sRef.isPool) {
        const x = tRef.isPool ? sRef.pool.x + sRef.pool.w / 2 : tRef.cx;
        return { x: Math.min(Math.max(x, sRef.pool.x + 40), sRef.pool.x + sRef.pool.w - 40), y: goingDown ? sRef.pool.y + sRef.pool.h : sRef.pool.y };
      }
      return goingDown ? { x: sRef.cx, y: sRef.y + sRef.h } : { x: sRef.cx, y: sRef.y };
    })();
    const tPoint = (() => {
      if (tRef.isPool) {
        const x = sRef.isPool ? tRef.pool.x + tRef.pool.w / 2 : sRef.cx;
        return { x: Math.min(Math.max(x, tRef.pool.x + 40), tRef.pool.x + tRef.pool.w - 40), y: goingDown ? tRef.pool.y : tRef.pool.y + tRef.pool.h };
      }
      return goingDown ? { x: tRef.cx, y: tRef.y } : { x: tRef.cx, y: tRef.y + tRef.h };
    })();
    const midY = (sPoint.y + tPoint.y) / 2;
    if (Math.abs(sPoint.x - tPoint.x) < 2) m.waypoints = [sPoint, tPoint];
    else m.waypoints = [sPoint, { x: sPoint.x, y: midY }, { x: tPoint.x, y: midY }, tPoint];
  }

  return { spec, pools, nodes, byId, flows, messages, artifacts, annotations, width: totalW, height: totalH, backEdges };
}

module.exports = { layout, SIZE };
