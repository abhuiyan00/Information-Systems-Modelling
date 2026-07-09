# Lab 7 — Modelling the ModellingClub System Life Cycle in BPMN 2.0

> PWR · ISM · Laboratory 7. **Aim:** practise BPMN by modelling the processes
> that surround the *ModellingClub* system over its lifetime — maintenance,
> deployment, migration, data governance, security and the business life cycle.
> These processes are governed by formal rules, good practice and external
> commitments, not by the application source code.

The system itself was built across the previous labs: a Spring Boot + Angular
community platform for RC / drone / scale-model builders (Lab 4), an RDF4J
ontology of its domain (Lab 5) and a semantic (RDFa / JSON-LD) publication of its
data (Lab 6). Lab 7 models what happens *around* that software in operation.

---

## What is delivered

| # | Deliverable | Path |
|---|-------------|------|
| 1 | **Report** (text + all 8 BPMN diagrams + legend + catalogue + refs) | `report/lab7-report.pdf` |
| 2 | **Editable BPMN 2.0 files** (open in Camunda Modeler) | `bpmn/*.bpmn` |
| 3 | Rendered diagrams as standalone vector images | `diagrams/*.svg` |

The PDF is self-contained and satisfies the assignment (diagrams + textual
description in one PDF). The `.bpmn` and `.svg` files are supporting artefacts.

---

## The eight processes

| # | Process | Theme | Highlights (BPMN) |
|---|---------|-------|-------------------|
| 1 | Scheduled Backup & Verification | Maintenance | timer start, parallel split/join, boundary error, error end, offsite message flow |
| 2 | Software Upgrade / Dependency Patch | Maintenance | message start, severity gateway, staging loop-back, maintenance-window timer, rollback |
| 3 | Release & Blue-Green Deployment (CI/CD) | Deployment | parallel build+test, approval gate, blue-green deploy, rollback, 5 lanes |
| 4 | H2 → PostgreSQL Database Migration | Deployment | maintenance-window timer, verification gateway, reversible cut-over to H2 |
| 5 | Data Archiving, Retention & GDPR Erasure | Data/Security | two start events, export vs erasure, legal-hold gateway, 30-day boundary timer |
| 6 | Security Incident Response | Data/Security | signal start, 3-way severity, parallel containment, 72h GDPR timer, post-mortem |
| 7 | Member Onboarding & Hosting Provisioning | Business | 3-pool collaboration, verification-email boundary timer, SLA accept/reject |
| 8 | System Decommissioning / End-of-Life | Business | notice & export-window timers, terminate end, contract termination message flow |

Each is a BPMN **collaboration** (pools, lanes, sequence flows, message flows).
Participants reach beyond admins/users: DevOps, Release Manager, DBA, Data
Protection Officer, Security on-call, Operations Committee, Cloud Provider, the
GDPR supervisory authority and offsite storage.

---

## How it is built

This is **not** a Maven/Java project — there is no `pom.xml`. A zero-dependency
Node generator holds the eight processes **once** as a data model and emits the
diagrams, the BPMN files and the report from it, so the rendered SVG and the
`.bpmn` diagram interchange can never drift.

```
src/specs.js ─► generator ─┬─► diagrams/*.svg            (rendered BPMN)
                           ├─► bpmn/*.bpmn               (editable, Camunda-ready, with DI)
                           └─► report/lab7-report.pdf    (via report.html + headless browser)
```

| File | Role |
|------|------|
| `src/specs.js` | the eight processes as one data model (single source of truth) |
| `src/layout.js` | automatic layout: layered ranking + lane tracks + orthogonal routing |
| `src/svg.js` | data + layout → rendered SVG, plus the notation legend |
| `src/bpmn.js` | data + layout → BPMN 2.0 XML with diagram interchange (DI) |
| `src/report-text.js` | the report prose (intro, system context, per-process narratives, refs) |
| `scripts/build.js` | writes `diagrams/*.svg` and `bpmn/*.bpmn` |
| `scripts/report.js` | writes `report/report.html` (embeds the SVGs + legend) |
| `scripts/pdf.js` | `report.html` → `report/lab7-report.pdf` (auto-locates Edge/Chrome) |

### Regenerate

```bash
npm run build     # diagrams/*.svg + bpmn/*.bpmn
npm run pdf       # build + report.html + lab7-report.pdf
```

Requirements: Node ≥ 18 (no `npm install` — zero runtime deps). The PDF step uses
a headless Chromium (Microsoft Edge or Chrome; Windows already ships Edge). See
`guide.txt` for full step-by-step instructions.

---

## Correctness

Every model was checked against BPMN execution semantics: each path reaches an
end event; parallel splits are matched by parallel joins; exclusive / event-based
gateways carry mutually-exclusive conditions; message flows only ever cross a pool
boundary. All eight `.bpmn` files import **without warnings** in `bpmn-moddle`,
the reference parser behind Camunda Modeler / bpmn.io.
