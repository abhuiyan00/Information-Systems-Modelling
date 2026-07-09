// Emits Camunda-compatible BPMN 2.0 XML (semantics + diagram interchange)
// from a laid-out process. Coordinates are shared with the SVG renderer so the
// .bpmn opens in Camunda Modeler / bpmn.io with the same layout as the report.

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

const TASK_EL = { user: 'userTask', service: 'serviceTask', send: 'sendTask', receive: 'receiveTask', manual: 'manualTask', script: 'scriptTask', business: 'businessRuleTask' };

function eventDef(marker) {
  switch (marker) {
    case 'timer': return '<bpmn:timerEventDefinition/>';
    case 'message': return '<bpmn:messageEventDefinition/>';
    case 'signal': return '<bpmn:signalEventDefinition/>';
    case 'error': return '<bpmn:errorEventDefinition/>';
    case 'terminate': return '<bpmn:terminateEventDefinition/>';
    default: return '';
  }
}

function nodeXml(n) {
  const a = `id="${n.id}" name="${esc(n.label)}"`;
  switch (n.kind) {
    case 'startEvent': return `    <bpmn:startEvent ${a}>${eventDef(n.marker)}</bpmn:startEvent>`;
    case 'endEvent': return `    <bpmn:endEvent ${a}>${eventDef(n.marker)}</bpmn:endEvent>`;
    case 'intermediateCatch': return `    <bpmn:intermediateCatchEvent ${a}>${eventDef(n.marker)}</bpmn:intermediateCatchEvent>`;
    case 'intermediateThrow': return `    <bpmn:intermediateThrowEvent ${a}>${eventDef(n.marker)}</bpmn:intermediateThrowEvent>`;
    case 'boundaryEvent': return `    <bpmn:boundaryEvent ${a} attachedToRef="${n.attachedTo}" cancelActivity="${n.interrupting === false ? 'false' : 'true'}">${eventDef(n.marker)}</bpmn:boundaryEvent>`;
    case 'exclusiveGateway': return `    <bpmn:exclusiveGateway ${a}/>`;
    case 'parallelGateway': return `    <bpmn:parallelGateway ${a}/>`;
    case 'eventBasedGateway': return `    <bpmn:eventBasedGateway ${a}/>`;
    case 'task': return `    <bpmn:${TASK_EL[n.sub] || 'task'} ${a}/>`;
    default: return `    <bpmn:task ${a}/>`;
  }
}

function bounds(o) { return `<dc:Bounds x="${o.x.toFixed(0)}" y="${o.y.toFixed(0)}" width="${o.w.toFixed(0)}" height="${o.h.toFixed(0)}"/>`; }
function wpts(points) { return points.map((p) => `<di:waypoint x="${p.x.toFixed(0)}" y="${p.y.toFixed(0)}"/>`).join(''); }

function toBpmn(L) {
  const spec = L.spec;
  const id = spec.id.replace(/[^a-zA-Z0-9_]/g, '_');
  const realPools = spec.pools.filter((p) => !p.blackbox);
  const out = [];
  out.push('<?xml version="1.0" encoding="UTF-8"?>');
  out.push(`<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Defs_${id}" targetNamespace="http://modellingclub.local/bpmn" exporter="ModellingClub Lab7 generator" exporterVersion="1.0">`);

  // data stores live at definitions level
  for (const d of spec.data || []) if (d.kind === 'dataStore') out.push(`  <bpmn:dataStore id="STORE_${d.id}" name="${esc(d.label)}"/>`);

  // ---- collaboration ----
  out.push(`  <bpmn:collaboration id="Collab_${id}">`);
  for (const p of spec.pools) {
    if (p.blackbox) out.push(`    <bpmn:participant id="Part_${p.id}" name="${esc(p.name)}"/>`);
    else out.push(`    <bpmn:participant id="Part_${p.id}" name="${esc(p.name)}" processRef="Proc_${p.id}"/>`);
  }
  (spec.messages || []).forEach((m, i) => {
    const src = L.byId.get(m.from) ? m.from : `Part_${m.from}`;
    const tgt = L.byId.get(m.to) ? m.to : `Part_${m.to}`;
    out.push(`    <bpmn:messageFlow id="Msg_${id}_${i}" name="${esc(m.label || '')}" sourceRef="${src}" targetRef="${tgt}"/>`);
  });
  out.push(`  </bpmn:collaboration>`);

  // ---- one process per real pool ----
  for (const p of realPools) {
    const poolNodes = spec.nodes.filter((n) => n.pool === p.id);
    const flowNodeIds = poolNodes.map((n) => n.id);
    const poolFlows = spec.flows.map(([f, t, l], i) => ({ f, t, l, i })).filter((x) => flowNodeIds.includes(x.f) && flowNodeIds.includes(x.t));
    const poolData = (spec.data || []).filter((d) => poolNodes.some((n) => n.id === d.attached));
    const poolAnno = (spec.annotations || []).filter((an) => poolNodes.some((n) => n.id === an.attached));
    out.push(`  <bpmn:process id="Proc_${p.id}" isExecutable="false">`);
    // lane set
    const lanes = p.lanes && p.lanes.length ? p.lanes : [];
    if (lanes.length) {
      out.push(`    <bpmn:laneSet id="LaneSet_${p.id}">`);
      lanes.forEach((ln, li) => {
        const refs = poolNodes.filter((n) => (n.lane || null) === ln).map((n) => `<bpmn:flowNodeRef>${n.id}</bpmn:flowNodeRef>`).join('');
        out.push(`      <bpmn:lane id="Lane_${p.id}_${li}" name="${esc(ln)}">${refs}</bpmn:lane>`);
      });
      out.push(`    </bpmn:laneSet>`);
    }
    // nodes
    for (const n of poolNodes) out.push(nodeXml(n));
    // sequence flows
    for (const x of poolFlows) out.push(`    <bpmn:sequenceFlow id="Flow_${id}_${x.i}" ${x.l ? `name="${esc(x.l)}" ` : ''}sourceRef="${x.f}" targetRef="${x.t}"/>`);
    // data references + associations
    for (const d of poolData) {
      if (d.kind === 'dataStore') out.push(`    <bpmn:dataStoreReference id="${d.id}" name="${esc(d.label)}" dataStoreRef="STORE_${d.id}"/>`);
      else { out.push(`    <bpmn:dataObject id="OBJ_${d.id}"/>`); out.push(`    <bpmn:dataObjectReference id="${d.id}" name="${esc(d.label)}" dataObjectRef="OBJ_${d.id}"/>`); }
      out.push(`    <bpmn:association id="Assoc_${d.id}" sourceRef="${d.attached}" targetRef="${d.id}"/>`);
    }
    // annotations
    poolAnno.forEach((an, ai) => {
      out.push(`    <bpmn:textAnnotation id="Anno_${p.id}_${ai}"><bpmn:text>${esc(an.text)}</bpmn:text></bpmn:textAnnotation>`);
      out.push(`    <bpmn:association id="AnnoAssoc_${p.id}_${ai}" sourceRef="${an.attached}" targetRef="Anno_${p.id}_${ai}"/>`);
    });
    out.push(`  </bpmn:process>`);
  }

  // ---- diagram interchange ----
  out.push(`  <bpmndi:BPMNDiagram id="Diag_${id}">`);
  out.push(`    <bpmndi:BPMNPlane id="Plane_${id}" bpmnElement="Collab_${id}">`);
  // participants
  for (const p of L.pools) out.push(`      <bpmndi:BPMNShape id="DI_Part_${p.id}" bpmnElement="Part_${p.id}" isHorizontal="true">${bounds(p)}</bpmndi:BPMNShape>`);
  // lanes
  for (const p of L.pools) (p.laneRects || []).forEach((lr, li) => { if (lr.name) out.push(`      <bpmndi:BPMNShape id="DI_Lane_${p.id}_${li}" bpmnElement="Lane_${p.id}_${li}" isHorizontal="true">${bounds(lr)}</bpmndi:BPMNShape>`); });
  // nodes
  for (const n of L.nodes) out.push(`      <bpmndi:BPMNShape id="DI_${n.id}" bpmnElement="${n.id}">${bounds(n)}</bpmndi:BPMNShape>`);
  // data + annotation shapes
  for (const a of L.artifacts) out.push(`      <bpmndi:BPMNShape id="DI_${a.id}" bpmnElement="${a.id}">${bounds(a)}</bpmndi:BPMNShape>`);
  L.annotations.forEach((a, ai) => {
    // find owning pool index for stable id
    const host = L.byId.get(a.attached); const pid = host ? (host.kind === 'boundaryEvent' ? L.byId.get(host.attachedTo).pool : host.pool) : L.pools[0].id;
    const idx = L.annotations.filter((x) => { const h = L.byId.get(x.attached); const pp = h ? (h.kind === 'boundaryEvent' ? L.byId.get(h.attachedTo).pool : h.pool) : null; return pp === pid; }).indexOf(a);
    out.push(`      <bpmndi:BPMNShape id="DI_Anno_${pid}_${idx}" bpmnElement="Anno_${pid}_${idx}">${bounds(a)}</bpmndi:BPMNShape>`);
  });
  // sequence flow edges
  spec.flows.forEach(([f, t, l], i) => { const fl = L.flows[i]; if (fl && fl.waypoints && fl.waypoints.length) out.push(`      <bpmndi:BPMNEdge id="DI_Flow_${id}_${i}" bpmnElement="Flow_${id}_${i}">${wpts(fl.waypoints)}</bpmndi:BPMNEdge>`); });
  // message flow edges
  (L.messages || []).forEach((m, i) => { if (m.waypoints && m.waypoints.length) out.push(`      <bpmndi:BPMNEdge id="DI_Msg_${id}_${i}" bpmnElement="Msg_${id}_${i}">${wpts(m.waypoints)}</bpmndi:BPMNEdge>`); });
  // association edges (data + annotations)
  for (const a of L.artifacts) { const host = L.byId.get(a.attached); if (host) out.push(`      <bpmndi:BPMNEdge id="DI_Assoc_${a.id}" bpmnElement="Assoc_${a.id}"><di:waypoint x="${host.cx.toFixed(0)}" y="${host.cy.toFixed(0)}"/><di:waypoint x="${a.cx.toFixed(0)}" y="${a.cy.toFixed(0)}"/></bpmndi:BPMNEdge>`); }
  L.annotations.forEach((a) => {
    const host = L.byId.get(a.attached); if (!host) return;
    const pid = host.kind === 'boundaryEvent' ? L.byId.get(host.attachedTo).pool : host.pool;
    const idx = L.annotations.filter((x) => { const h = L.byId.get(x.attached); const pp = h ? (h.kind === 'boundaryEvent' ? L.byId.get(h.attachedTo).pool : h.pool) : null; return pp === pid; }).indexOf(a);
    out.push(`      <bpmndi:BPMNEdge id="DI_AnnoAssoc_${pid}_${idx}" bpmnElement="AnnoAssoc_${pid}_${idx}"><di:waypoint x="${host.cx.toFixed(0)}" y="${host.cy.toFixed(0)}"/><di:waypoint x="${a.cx.toFixed(0)}" y="${a.cy.toFixed(0)}"/></bpmndi:BPMNEdge>`);
  });
  out.push(`    </bpmndi:BPMNPlane>`);
  out.push(`  </bpmndi:BPMNDiagram>`);
  out.push(`</bpmn:definitions>`);
  return out.join('\n');
}

module.exports = { toBpmn };
