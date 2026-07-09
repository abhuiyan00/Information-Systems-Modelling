# ISM Final Exam Prep — Quiz Trainer

A self-contained study app for the **Information Systems Modeling (ISM)** final
exam (PWR, Tomasz Kubik lectures). It's a single-page web app written in plain
HTML/CSS/JavaScript — **no build step, no server, no dependencies, no internet**.
Open one file and start revising.

If you've never touched this repo before, read this whole page once; it tells
you what's inside, how to run it, and how to actually use it to pass.

---

## TL;DR — just run it

1. Open `ism_final_exam_prep/index.html` in any modern browser (double-click it).
2. Pick a lecture from the left sidebar.
3. Answer questions, hit **Enter** to submit, arrow keys to move on.

Your progress is saved automatically in the browser. That's it.

---

## What's in the question bank

**570 questions** across **15 sets**, grouped into five themes:

| Theme | Lectures | What it covers |
|-------|----------|----------------|
| **Foundations & Modeling** | 01–02 | Requirements engineering, feasibility, functional vs non-functional requirements, OMG/ISO standards, UML & SysML diagrams |
| **Design Patterns** | 03–04 | REST & HTTP, statelessness, the GoF design patterns in Java, intro to Spring |
| **Java / Spring / Web** | 05–07 | Spring MVC/REST annotations, AngularJS, the DAO pattern, JDBC & JPA, Aspect-Oriented Programming (AOP) |
| **Semantic Web** | 08–11 | RDF, OWL2 knowledge modeling, publishing Linked Data & SKOS, SHACL shape constraints |
| **XML & Services** | 12–14 | XML / XSD / DTD / WSDL, Service-Oriented Architecture (SOA), the UDDI specification |
| **Test (Testownik)** | 15 | 220 real exam-style questions kept verbatim from the shared knowledge base |

Each lecture set has **25 questions** (14 × 25 = 350) and the **Test** set adds
the **220 Testownik** questions, for **570** total.

### Exam realism

The bank is tuned to feel like the real paper:

- Questions are **multiple-answer**. A question can have **1, 2, or 3** correct
  options, mixed roughly one-third each — you never know how many to pick.
- Correct options are **scattered** across positions A–D; there's no lazy "the
  answer is always C" pattern to exploit.
- Every question ships with a **reasoning** note explaining *why* the answer is
  right (and why the tempting wrong options are wrong).

---

## The four views

Switch between them with the tabs at the top.

| View | What it's for |
|------|---------------|
| **Quiz** | The main mode. One question at a time, submit, get graded, see the reasoning, move on. Progress and score are tracked per set. |
| **Learn** | A flashcard-style read-through. Reveal all answers and reasoning at once and just *read* — no scoring, no pressure. Use this first pass on a new topic. |
| **Review** | Re-runs only the questions you got **wrong** (or haven't aced yet) in a set. This is your targeted second pass — spaced repetition on your weak spots. |
| **Search** | Full-text search across every question, option, and explanation. Type a term (e.g. `SHACL`, `idempotent`, `singleton`) to jump straight to it. |

---

## Scoring — read this, it's strict

Scoring is **all-or-nothing**. A question counts as correct **only if** your
selected options are *exactly* the correct set — same members, nothing extra,
nothing missing. There is **no partial credit**: pick 2 of 3 correct answers and
it still scores **0**. This mirrors how these exams are typically marked and
trains you not to leave a correct box unticked.

---

## Timer, shuffle & other controls

- **Section timer** — a **30-minute countdown** runs per section. The last
  **5 minutes** turn amber as a warning. It can go into overtime (negative) so
  you can see how far over you ran. Press **P** to pause/resume.
- **Shuffle** — toggle in the top bar to randomise question order (Fisher–Yates).
  Great for later passes so you learn the answers, not the positions.
- **Resume** — the app remembers the last question you were on **per set**, so
  you can close the tab and pick up where you left off.
- **Overall stats** — the sidebar shows your total answered/correct across all
  sets, plus a **Reset all progress** button.

### Keyboard shortcuts (Quiz view)

| Key | Action |
|-----|--------|
| `1`–`9` or `A`–`Z` | Toggle an option on/off (while the question is unanswered) |
| `Enter` / `Space` | Submit the answer — or advance to the next question if already submitted |
| `→` | Next question (after submitting) |
| `←` | Previous question |
| `P` | Pause / resume the section timer |

---

## How your progress is stored

Everything is kept in **`localStorage`** under a single key
(`ism-quiz-progress`), tagged with a **storage version**. If the app's data
shape changes in a future update, the version bumps and old saves are ignored
(auto-reset) so nothing breaks. Progress is **per browser / per device** — it
does not sync. Clearing your browser data, or hitting **Reset all progress**,
wipes it.

---

## Suggested study plan (for new people)

A workflow that actually works before an exam:

1. **Learn pass** — open a lecture in **Learn** view and read every question with
   its reasoning. No pressure, just absorb the material.
2. **Quiz pass** — switch to **Quiz**, turn **Shuffle off** the first time, and
   work through the set. Read the explanation on every question, right or wrong.
3. **Review pass** — use **Review** to redo only what you missed. Repeat until
   the set is clean.
4. **Shuffle & re-quiz** — turn **Shuffle on** and redo the set so you're
   learning the *concepts*, not memorising answer positions.
5. **Timed mock** — near exam day, do a set under the **30-minute timer** without
   pausing, then the big **Test (Testownik)** set as a full dress rehearsal.
6. **Search on demand** — whenever a term trips you up, jump to **Search** and
   read every question that mentions it.

Work theme by theme (Foundations → Design Patterns → Java/Spring → Semantic Web
→ XML & Services), then finish on the Test set.

---

## Files

```
ism_final_exam_prep/
├─ index.html     the page shell (sidebar + tabs + question area)
├─ chapters.js    the question bank — one global `quizData` object (570 questions)
├─ app.js         all app logic: state, scoring, views, timer, persistence
├─ styles.css     presentation (dark theme)
├─ qa_test.js     headless test harness (see below)
└─ README.md      this file
```

The three layers are cleanly separated: **`chapters.js`** is the data,
**`app.js`** is the logic (one module-scoped `state` object as the single source
of truth), and **`styles.css`** is presentation.

---

## Running the tests (optional, for contributors)

There's a headless QA harness that loads the **real** `chapters.js` + `app.js`
in a Node `vm` context behind a tiny DOM shim and drives the actual click /
keydown handlers — no browser, no jsdom required.

```bash
cd ism_final_exam_prep
node qa_test.js            # run the suite
ISM_POISON=1 node qa_test.js   # also exercise corrupted-save recovery
```

It asserts the scoring contract, view switching, persistence, the timer, and
recovery from a poisoned `localStorage` save. Requires **Node ≥ 18**.

---

## Editing / adding questions

Add a question object to the right set in `chapters.js`:

```js
{
  id: 571,                       // globally unique, sequential across ALL sets
  question: "…?",
  options: ["…", "…", "…", "…"], // 4 options (Test set may use 5–7)
  correct: [0, 2],               // 0-based indices of the correct option(s), length 1–3
  reasoning: "Why this is the answer."
}
```

Keep `id` globally unique. If you change the shape of stored state, bump
`STORAGE_VERSION` in `app.js` so stale saves auto-reset.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Page is blank / no questions | Open `index.html` from the folder itself so `chapters.js` and `app.js` load next to it; don't move the HTML out on its own. |
| Old progress looks wrong after an update | The storage version changed — it auto-resets. If not, click **Reset all progress**. |
| Fonts look plain | The Inter web font loads from Google Fonts; offline it falls back to a system font. Everything else works with no internet. |
| Timer hit 00:00 | It keeps going into overtime so you can see the overrun; press **P** to pause or just keep answering. |

Good luck on the exam. 🎯
