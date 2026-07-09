/* =========================================================================
 * qa_test.js — headless QA harness for the ISM quiz app.
 *
 * NO browser, NO jsdom. A tiny DOM shim loads the REAL chapters.js + app.js
 * (concatenated and run in a Node `vm` context, so app.js sees the global
 * `quizData`). Tests drive user flows through the ACTUAL click/keydown event
 * handlers and assert via the DOM and the persisted state.
 *
 * Run:  node qa_test.js
 * Poison-save mode (also runs as part of the suite):  ISM_POISON=1 node qa_test.js
 * ========================================================================= */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

/* ---------------------------------------------------------------- counters */
var pass = 0, fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fail++; console.log('  ✗ FAIL: ' + msg); }
}
function section(t) { console.log('\n== ' + t + ' =='); }

/* ====================================================================== */
/* Tiny DOM shim                                                          */
/* ====================================================================== */
function makeDom() {
  function TextNode(text) { this.nodeType = 3; this.nodeValue = String(text); this.parentNode = null; }

  function Element(tag) {
    this.tagName = String(tag).toUpperCase();
    this.nodeType = 1;
    this.childNodes = [];
    this.parentNode = null;
    this.attributes = {};
    this.dataset = {};
    this._cls = {};
    this.id = '';
    this._innerHTML = null;
    this.value = '';
    this.checked = false;
    this.disabled = false;
    this._listeners = {};
    var self = this;
    this.classList = {
      add: function (c) { self._cls[c] = true; },
      remove: function (c) { delete self._cls[c]; },
      toggle: function (c) { if (self._cls[c]) delete self._cls[c]; else self._cls[c] = true; },
      contains: function (c) { return !!self._cls[c]; }
    };
  }
  Object.defineProperty(Element.prototype, 'className', {
    get: function () { return Object.keys(this._cls).join(' '); },
    set: function (v) { this._cls = {}; String(v).split(/\s+/).forEach(function (c) { if (c) this._cls[c] = true; }, this); }
  });
  Object.defineProperty(Element.prototype, 'textContent', {
    get: function () {
      if (this._innerHTML !== null) return this._innerHTML;
      var out = '';
      for (var i = 0; i < this.childNodes.length; i++) {
        var c = this.childNodes[i];
        out += (c.nodeType === 3) ? c.nodeValue : c.textContent;
      }
      return out;
    },
    set: function (v) {
      this.childNodes = [];
      this._innerHTML = null;
      if (v !== '' && v !== null && v !== undefined) this.appendChild(new TextNode(v));
    }
  });
  Object.defineProperty(Element.prototype, 'innerHTML', {
    get: function () { return this._innerHTML !== null ? this._innerHTML : ''; },
    set: function (v) { this.childNodes = []; this._innerHTML = (v === '' ? null : String(v)); }
  });
  Element.prototype.appendChild = function (node) { node.parentNode = this; this._innerHTML = null; this.childNodes.push(node); return node; };
  Element.prototype.removeChild = function (node) { var i = this.childNodes.indexOf(node); if (i >= 0) this.childNodes.splice(i, 1); return node; };
  Element.prototype.setAttribute = function (k, v) { this.attributes[k] = String(v); if (k === 'id') this.id = String(v); if (k === 'type') this.type = String(v); };
  Element.prototype.getAttribute = function (k) { return this.attributes.hasOwnProperty(k) ? this.attributes[k] : null; };
  Element.prototype.addEventListener = function (t, fn) { (this._listeners[t] || (this._listeners[t] = [])).push(fn); };
  Element.prototype.removeEventListener = function (t, fn) {
    var arr = this._listeners[t]; if (!arr) return; var i = arr.indexOf(fn); if (i >= 0) arr.splice(i, 1);
  };
  Element.prototype.dispatchEvent = function (evt) {
    var arr = this._listeners[evt.type] || [];
    for (var i = 0; i < arr.length; i++) arr[i].call(this, evt);
    return true;
  };
  Element.prototype.click = function () { this.dispatchEvent({ type: 'click', target: this, preventDefault: function () {} }); };
  Element.prototype.focus = function () {};

  function descendants(node, out) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var c = node.childNodes[i];
      if (c.nodeType === 1) { out.push(c); descendants(c, out); }
    }
    return out;
  }
  function matchToken(elm, token) {
    var idM = token.match(/#([\w-]+)/);
    if (idM && elm.id !== idM[1]) return false;
    var tagM = token.match(/^([a-zA-Z][\w-]*)/);
    if (tagM && elm.tagName !== tagM[1].toUpperCase()) return false;
    var clsRe = /\.([\w-]+)/g, m;
    while ((m = clsRe.exec(token))) { if (!elm.classList.contains(m[1])) return false; }
    return true;
  }
  Element.prototype.querySelectorAll = function (selector) {
    var tokens = String(selector).trim().split(/\s+/);
    var current = descendants(this, []);
    for (var t = 0; t < tokens.length; t++) {
      var tok = tokens[t];
      var matched = current.filter(function (e) { return matchToken(e, tok); });
      if (t === tokens.length - 1) return matched;
      // descend further for the next token
      var next = [];
      matched.forEach(function (e) { descendants(e, next); });
      current = next;
    }
    return [];
  };
  Element.prototype.querySelector = function (sel) { var r = this.querySelectorAll(sel); return r.length ? r[0] : null; };

  var documentElement = new Element('html');
  var body = new Element('body');
  body.tagName = 'BODY';
  documentElement.appendChild(body);

  var docListeners = {};
  var document = {
    body: body,
    documentElement: documentElement,
    createElement: function (t) { return new Element(t); },
    createTextNode: function (t) { return new TextNode(t); },
    getElementById: function (id) {
      var all = descendants(documentElement, []);
      for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
      return null;
    },
    querySelector: function (s) { return documentElement.querySelector(s); },
    querySelectorAll: function (s) { return documentElement.querySelectorAll(s); },
    addEventListener: function (t, fn) { (docListeners[t] || (docListeners[t] = [])).push(fn); }
  };

  /* fire a keydown through the real document handler(s) */
  function fireKey(key, target) {
    var evt = { type: 'keydown', key: key, target: target || { tagName: 'BODY' }, preventDefault: function () {} };
    (docListeners.keydown || []).forEach(function (fn) { fn(evt); });
  }

  /* ---- build the static page structure app.js expects (mirrors index.html) ---- */
  function mk(tag, id) { var e = new Element(tag); if (id) e.setAttribute('id', id); body.appendChild(e); return e; }
  var setList = mk('nav', 'set-list');
  var overall = mk('div', 'overall-stats');
  var tabs = mk('div', 'view-tabs');
  ['quiz', 'learn', 'search'].forEach(function (v) {
    var b = new Element('button'); b.className = 'tab'; b.dataset.view = v; tabs.appendChild(b);
  });
  var shuffle = mk('input', 'shuffle-toggle'); shuffle.type = 'checkbox';
  mk('div', 'timer');
  mk('section', 'main');

  return { document: document, fireKey: fireKey };
}

/* ====================================================================== */
/* Sandbox factory: loads the REAL chapters.js + app.js                    */
/* ====================================================================== */
function makeApp(seedStorage) {
  var dom = makeDom();

  var store = {};
  if (seedStorage) for (var k in seedStorage) store[k] = seedStorage[k];
  var localStorage = {
    getItem: function (k) { return store.hasOwnProperty(k) ? store[k] : null; },
    setItem: function (k, v) { store[k] = String(v); },
    removeItem: function (k) { delete store[k]; },
    clear: function () { store = {}; }
  };

  var sandbox = {
    document: dom.document,
    localStorage: localStorage,
    console: console,
    setTimeout: function (fn) { if (typeof fn === 'function') fn(); return 0; }, // run debounce synchronously
    clearTimeout: function () {},
    setInterval: function () { return 1; }, // timer must not tick during tests
    clearInterval: function () {},
    confirm: function () { return true; },
    Math: Math, Date: Date, JSON: JSON, RegExp: RegExp, parseInt: parseInt, Object: Object, Array: Array, String: String
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  var dir = __dirname;
  var code =
    fs.readFileSync(path.join(dir, 'chapters.js'), 'utf8') +
    '\n;\n' +
    fs.readFileSync(path.join(dir, 'app.js'), 'utf8');
  vm.runInContext(code, sandbox, { filename: 'ism-bundle.js' });

  return { sandbox: sandbox, doc: dom.document, fireKey: dom.fireKey, ISM: sandbox.ISM, store: store };
}

/* ---------------------------------------------------------------- helpers */
function q(doc, sel) { return doc.querySelector(sel); }
function qa(doc, sel) { return doc.querySelectorAll(sel); }
function btn(doc, action) {
  var bs = qa(doc, 'button');
  for (var i = 0; i < bs.length; i++) if (bs[i].dataset && bs[i].dataset.action === action) return bs[i];
  return null;
}
function clickOption(doc, idx) {
  var opts = qa(doc, '.option');
  for (var i = 0; i < opts.length; i++) if (opts[i].dataset && opts[i].dataset.idx === String(idx)) { opts[i].click(); return true; }
  return false;
}
function answeredCount(state) { return Object.keys(state.answered).length; }

/* ====================================================================== */
/* MAIN SUITE                                                              */
/* ====================================================================== */
function runMainSuite() {
  var app = makeApp(null);
  var doc = app.doc, ISM = app.ISM, S = app.ISM.state;

  section('1. Initial render');
  assert(!!ISM, 'app exposed window.ISM');
  assert(S.view === 'quiz', 'default view is quiz');
  assert(S.currentSetId === 'lec01', 'first set selected on load');
  assert(!!q(doc, '.card'), 'a card is rendered');
  assert(!!q(doc, '.q-text'), 'question text rendered');
  assert(q(doc, '.set-item.active') !== null, 'active set item shown in sidebar');

  // data-driven: read the ACTUAL correct sets from chapters.js (no hard-coded indices,
  // since the bank uses a randomized 1/2/3-correct distribution)
  var lec01 = require('./chapters.js').sets[0];
  var q1 = lec01.questions[0];
  var q2 = lec01.questions[1];

  section('2. Multi-answer question scored FULL marks (all correct selected)');
  q1.correct.forEach(function (i) { clickOption(doc, i); });   // select EXACTLY the correct set
  btn(doc, 'submit').click();
  var key1 = 'lec01-' + q1.id;
  assert(!!S.answered[key1], 'answer recorded under composite key set-question');
  assert(S.answered[key1].isFullyCorrect === true, 'exact correct set => full marks');
  assert(!!q(doc, '.feedback.full'), 'full-marks feedback shown');
  assert(!!q(doc, '.option.correct'), 'correct+selected options coloured green');

  section('3. Multi-answer question scored ZERO (one wrong selected, all correct missed)');
  btn(doc, 'next').click();           // go to lec01 q2
  var wrongIdx = -1;
  for (var wi = 0; wi < q2.options.length; wi++) if (q2.correct.indexOf(wi) === -1) { wrongIdx = wi; break; }
  clickOption(doc, wrongIdx);         // pick a single INCORRECT option, nothing else
  btn(doc, 'submit').click();
  var key2 = 'lec01-' + q2.id;
  assert(!!S.answered[key2], 'second answer recorded');
  assert(S.answered[key2].isFullyCorrect === false, 'wrong extra selected => zero');
  assert(!!q(doc, '.feedback.partial'), 'not-full-marks feedback shown');
  assert(!!q(doc, '.option.wrong'), 'wrong+selected option coloured red');
  assert(!!q(doc, '.option.missed'), 'correct-but-missed option flagged');

  section('4. Previous-section navigation ACROSS set boundaries');
  // jump to set 2 (lec02) via sidebar, then Prev should cross into lec01
  var setItems = qa(doc, '.set-item');
  setItems[1].click(); // lec02 at position 0
  assert(S.currentSetId === 'lec02' && S.currentQuestionIndex === 0, 'on lec02 question 1');
  btn(doc, 'prev').click();
  assert(S.currentSetId === 'lec01', 'Prev crossed back into previous set (lec01)');
  assert(S.currentQuestionIndex === S.currentOrder.length - 1, 'landed on previous set LAST question');

  section('5. Prev sweep over every set');
  // start at the LAST set, first question, then sweep backwards across all sets
  var sets = ISM.state ? require('./chapters.js').sets : null;
  var allSetIds = require('./chapters.js').sets.map(function (s) { return s.id; });
  var lastIdx = allSetIds.length - 1;
  qa(doc, '.set-item')[lastIdx].click(); // last set, q0
  var visited = {};
  var totalQuestions = require('./chapters.js').sets.reduce(function (a, s) { return a + s.questions.length; }, 0);
  var guard = totalQuestions + allSetIds.length + 10;
  for (var step = 0; step < guard; step++) {
    visited[S.currentSetId] = true;
    var p = btn(doc, 'prev');
    if (!p || p.disabled) break;
    p.click();
  }
  visited[S.currentSetId] = true;
  var allVisited = allSetIds.every(function (id) { return visited[id]; });
  assert(allVisited, 'Prev sweep visited every set (' + Object.keys(visited).length + '/' + allSetIds.length + ')');
  assert(S.currentSetId === 'lec01' && S.currentQuestionIndex === 0, 'sweep ended at first set, first question');

  section('6. Learn + Search rendering');
  qa(doc, '.tab')[1].click(); // learn
  assert(S.view === 'learn', 'switched to learn view');
  assert(qa(doc, '.learn-item').length > 0, 'learn view lists Q&A items');
  var toggle = btn(doc, 'toggle-answers');
  toggle.click();
  assert(S.showLearnAnswers === true, 'show-answers toggled on');
  assert(!!q(doc, '.learn-opts .correct'), 'correct options highlighted in learn mode');

  qa(doc, '.tab')[2].click(); // search
  assert(S.view === 'search', 'switched to search view');
  var box = q(doc, '.search-box');
  box.value = 'singleton';
  box.dispatchEvent({ type: 'input', target: box });
  assert(!!q(doc, '#search-results'), 'search results container present');
  assert(qa(doc, '.result').length > 0, 'search for "singleton" returns matches');

  section('7. HTML-escaping in search (mandatory)');
  // questions about WSDL contain literal "<portType>" etc; rendered output MUST be escaped
  box.value = 'portType';
  box.dispatchEvent({ type: 'input', target: box });
  var resultsHtml = qa(doc, '.result .r-opt').map(function (e) { return e.innerHTML; }).join(' ') +
                    qa(doc, '.result .r-q').map(function (e) { return e.innerHTML; }).join(' ');
  assert(resultsHtml.indexOf('&lt;') !== -1, 'angle brackets escaped to &lt; in search output');
  assert(resultsHtml.indexOf('<portType>') === -1, 'raw <portType> tag NOT injected as HTML');
  assert(resultsHtml.indexOf('<mark>') !== -1, 'query matches wrapped in <mark> highlight');

  section('8. Keyboard input ignored outside the quiz view');
  qa(doc, '.tab')[1].click(); // learn view
  var beforeAnswered = answeredCount(S);
  var beforeIdx = S.currentQuestionIndex;
  app.fireKey('1'); app.fireKey('Enter'); app.fireKey('ArrowRight'); app.fireKey('ArrowLeft');
  assert(answeredCount(S) === beforeAnswered, 'keys did not change answers in learn view');
  assert(S.currentQuestionIndex === beforeIdx, 'keys did not navigate in learn view');

  // and in quiz view keys DO work
  qa(doc, '.tab')[0].click(); // quiz view
  // navigate to a fresh (unanswered) question: lec01 q3
  ISM_goToFresh(doc, ISM);
  var draftBefore = S.draftSelected.length;
  app.fireKey('1'); // toggle option A
  assert(S.draftSelected.length === draftBefore + 1, 'number key toggles an option in quiz view');
  app.fireKey('a'); // letter A toggles it back off
  assert(S.draftSelected.length === draftBefore, 'letter key toggles the same option off');

  section('9. Reset');
  // ensure something is answered, then reset via the sidebar handler
  assert(answeredCount(S) >= 2, 'there are recorded answers before reset');
  var resetBtn = q(doc, '#overall-stats .btn');
  assert(!!resetBtn, 'reset button present in sidebar');
  resetBtn.click(); // confirm() shim returns true
  assert(answeredCount(S) === 0, 'reset cleared all answers');
  assert(S.currentSetId === 'lec01' && S.currentQuestionIndex === 0, 'reset returned to first set, q1');
  assert(app.store['ism-quiz-progress'] === undefined, 'reset removed the localStorage save');

  return { pass: pass, fail: fail };
}

/* navigate the quiz to the first not-yet-answered question of the current set */
function ISM_goToFresh(doc, ISM) {
  var S = ISM.state;
  var set = null, sets = require('./chapters.js').sets;
  for (var i = 0; i < sets.length; i++) if (sets[i].id === S.currentSetId) set = sets[i];
  for (var pos = 0; pos < S.currentOrder.length; pos++) {
    var qid = set.questions[S.currentOrder[pos]].id;
    if (!S.answered[S.currentSetId + '-' + qid]) { S.currentQuestionIndex = pos; S.draftSelected = []; ISM.render(); return; }
  }
}

/* ====================================================================== */
/* POISON-SAVE TEST: init() must survive stale / out-of-range saves        */
/* ====================================================================== */
function runPoisonTest() {
  section('10. Poison-save mode: init() survives bad localStorage');

  // (a) version mismatch -> save must be ignored, app resets cleanly
  var stale = { 'ism-quiz-progress': JSON.stringify({ version: 999, currentSetId: 'nonsense', currentQuestionIndex: 9999, answered: { 'x-1': { selected: [9], isFullyCorrect: true } } }) };
  var threw = false, app1;
  try { app1 = makeApp(stale); } catch (e) { threw = true; console.log('    error: ' + e.message); }
  assert(!threw, 'init() did not throw on stale (version-mismatch) save');
  if (app1) {
    var S1 = app1.ISM.state;
    assert(S1.currentSetId === 'lec01', 'stale save ignored -> first set selected');
    assert(S1.currentQuestionIndex >= 0 && S1.currentQuestionIndex <= S1.currentOrder.length, 'question index clamped in range');
    assert(Object.keys(S1.answered).length === 0, 'stale answers discarded');
    assert(!!app1.doc.querySelector('.card'), 'app still renders a card');
  }

  // (b) matching version but OUT-OF-RANGE set id + index -> clamp without crash
  var bad = { 'ism-quiz-progress': JSON.stringify({ version: 2, currentSetId: 'does-not-exist', currentQuestionIndex: 100000, answered: {} }) };
  var threw2 = false, app2;
  try { app2 = makeApp(bad); } catch (e) { threw2 = true; console.log('    error: ' + e.message); }
  assert(!threw2, 'init() did not throw on out-of-range set id');
  if (app2) {
    var S2 = app2.ISM.state;
    assert(app2.ISM.state.currentSetId === 'lec01', 'unknown set id clamped to first set');
    assert(S2.currentQuestionIndex <= S2.currentOrder.length, 'huge index clamped into range');
    assert(!!app2.doc.querySelector('.q-text'), 'app still renders a question');
  }
}

/* ====================================================================== */
/* Run                                                                     */
/* ====================================================================== */
console.log('ISM quiz — headless QA harness\n');

if (process.env.ISM_POISON) {
  runPoisonTest();
} else {
  runMainSuite();
  runPoisonTest();
}

console.log('\n--------------------------------------------');
console.log('  PASSED: ' + pass + '   FAILED: ' + fail);
console.log('--------------------------------------------');
process.exit(fail ? 1 : 0);
