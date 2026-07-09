const fs = require('fs');
const path = require('path');
const specs = require('../src/specs');
const { layout } = require('../src/layout');
const { render } = require('../src/svg');
const { toBpmn } = require('../src/bpmn');

const ROOT = path.join(__dirname, '..');
const DIAG = path.join(ROOT, 'diagrams');
const BPMN = path.join(ROOT, 'bpmn');
fs.mkdirSync(DIAG, { recursive: true });
fs.mkdirSync(BPMN, { recursive: true });

const layouts = [];
for (const spec of specs) {
  const L = layout(spec);
  layouts.push(L);
  fs.writeFileSync(path.join(DIAG, spec.id + '.svg'), render(L));
  fs.writeFileSync(path.join(BPMN, spec.id + '.bpmn'), toBpmn(L));
  console.log(`${spec.id.padEnd(16)} ${String(spec.nodes.length).padStart(2)} nodes  ${String(L.width).padStart(4)}x${L.height}`);
}
console.log('done: ' + specs.length + ' diagrams + bpmn files');
