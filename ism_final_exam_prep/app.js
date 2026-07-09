/* =========================================================================
 * ISM Quiz — app logic (vanilla JS, no framework, no build)
 *
 * Three layers:
 *   chapters.js  -> global `quizData` (the question bank)
 *   app.js       -> this file: one module-scoped `state` + all logic
 *   styles.css   -> presentation
 *
 * MULTI-ANSWER SCORING CONTRACT (all-or-nothing):
 *   A question is full marks (1.0) iff the set of selected option indices
 *   EXACTLY equals `question.correct` (same members, no extras, none missing).
 *   Otherwise it scores 0. There is no partial credit.
 *
 * Persistence: one localStorage key, tagged with STORAGE_VERSION. Saves whose
 * version != STORAGE_VERSION are ignored (auto-reset). Bump STORAGE_VERSION
 * whenever the data/state shape changes.
 * ========================================================================= */
(function () {
  'use strict';

  var STORAGE_VERSION = 4;
  var STORAGE_KEY = 'ism-quiz-progress';
  var SECTION_SECONDS = 30 * 60;   // 30-minute countdown per section
  var WARNING_SECONDS = 5 * 60;    // last 5 minutes -> amber warning

  /* ---- module-scoped state (the single source of truth) ---- */
  var state = {
    view: 'quiz',                 // 'quiz' | 'learn' | 'search' | 'review'
    currentSetId: null,
    currentOrder: [],             // array of indices into the current set's questions[]
    currentQuestionIndex: 0,      // POSITION within currentOrder (== length -> summary)
    draftSelected: [],            // tentative selection for the current (unanswered) question
    answered: {},                 // `${setId}-${qId}` -> { selected:[idx...], isFullyCorrect:bool }
    positions: {},                // setId -> last currentQuestionIndex (resume where you left off)
    shuffle: false,
    showLearnAnswers: false,
    searchQuery: '',
    // countdown timer: per-section remaining seconds (can go negative = overtime)
    timer: { perSection: {}, running: true, id: null }
  };

  /* expose for the headless QA harness (and debugging) */
  var api = { state: state, STORAGE_VERSION: STORAGE_VERSION, STORAGE_KEY: STORAGE_KEY };
  if (typeof window !== 'undefined') window.ISM = api;
  if (typeof globalThis !== 'undefined') globalThis.ISM = api;

  /* =====================================================================
   * Pure helpers
   * ===================================================================== */
  function flatSets() { return quizData.sets; }

  function getSet(setId) {
    var sets = flatSets();
    for (var i = 0; i < sets.length; i++) if (sets[i].id === setId) return sets[i];
    return null;
  }
  function getSetIndex(setId) {
    var sets = flatSets();
    for (var i = 0; i < sets.length; i++) if (sets[i].id === setId) return i;
    return -1;
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var sa = a.slice().sort(function (x, y) { return x - y; });
    var sb = b.slice().sort(function (x, y) { return x - y; });
    for (var i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return false;
    return true;
  }

  function isFullyCorrect(question, selected) {
    return sameSet(selected, question.correct);
  }

  function fisherYates(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function keyFor(setId, qId) { return setId + '-' + qId; }

  // counts derived ENTIRELY from state.answered + array lengths (never stored separately)
  function setStats(set) {
    var total = set.questions.length, answered = 0, correct = 0;
    for (var i = 0; i < total; i++) {
      var ans = state.answered[keyFor(set.id, set.questions[i].id)];
      if (ans) {
        answered++;
        if (ans.isFullyCorrect) correct++;
      }
    }
    return { total: total, answered: answered, correct: correct };
  }

  function overallStats() {
    var sets = flatSets(), total = 0, answered = 0, correct = 0;
    for (var i = 0; i < sets.length; i++) {
      var s = setStats(sets[i]);
      total += s.total; answered += s.answered; correct += s.correct;
    }
    return { total: total, answered: answered, correct: correct };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* =====================================================================
   * Order management
   * ===================================================================== */
  function buildOrder(set, onlyIncorrect) {
    var idx = [];
    for (var i = 0; i < set.questions.length; i++) {
      if (onlyIncorrect) {
        var ans = state.answered[keyFor(set.id, set.questions[i].id)];
        if (ans && ans.isFullyCorrect) continue; // skip the ones already aced
      }
      idx.push(i);
    }
    return state.shuffle ? fisherYates(idx) : idx;
  }

  // indices (into set.questions[]) of every question answered but NOT full marks
  function incorrectIndices(set) {
    var idx = [];
    for (var i = 0; i < set.questions.length; i++) {
      var ans = state.answered[keyFor(set.id, set.questions[i].id)];
      if (ans && !ans.isFullyCorrect) idx.push(i);
    }
    return idx;
  }

  function ensureTimer(setId) {
    if (typeof state.timer.perSection[setId] !== 'number') {
      state.timer.perSection[setId] = SECTION_SECONDS;
    }
  }

  // remember the position the user is currently parked at in the active set,
  // so a later sidebar click resumes there instead of snapping back to page 1.
  function rememberPosition() {
    if (state.currentSetId != null) state.positions[state.currentSetId] = state.currentQuestionIndex;
  }

  // Retry the wrong ones FRESH: drop their saved answers so they unlock, then
  // load a quiz order containing exactly those previously-incorrect questions.
  function retryIncorrect(setId) {
    var set = getSet(setId);
    if (!set) return;
    var idx = incorrectIndices(set);
    if (!idx.length) return;
    for (var i = 0; i < idx.length; i++) {
      delete state.answered[keyFor(set.id, set.questions[idx[i]].id)];
    }
    state.view = 'quiz';
    state.currentSetId = setId;
    ensureTimer(setId);
    state.currentOrder = state.shuffle ? fisherYates(idx) : idx;
    state.currentQuestionIndex = 0;
    state.draftSelected = [];
    syncDraftFromAnswered();
    saveProgress();
    render();
  }
  api.retryIncorrect = retryIncorrect;

  function selectSet(setId, position, onlyIncorrect) {
    var set = getSet(setId);
    if (!set) return;
    state.currentSetId = setId;
    ensureTimer(setId);
    state.currentOrder = buildOrder(set, !!onlyIncorrect);
    if (state.currentOrder.length === 0) state.currentOrder = []; // guard
    var max = state.currentOrder.length;
    if (position === 'last') state.currentQuestionIndex = Math.max(0, max - 1);
    else state.currentQuestionIndex = Math.min(Math.max(0, position || 0), max);
    state.draftSelected = [];
    syncDraftFromAnswered();
  }

  function currentSet() { return getSet(state.currentSetId); }

  function currentQuestion() {
    var set = currentSet();
    if (!set) return null;
    if (state.currentQuestionIndex >= state.currentOrder.length) return null; // summary
    var realIdx = state.currentOrder[state.currentQuestionIndex];
    return set.questions[realIdx];
  }

  function syncDraftFromAnswered() {
    var q = currentQuestion();
    if (!q) { state.draftSelected = []; return; }
    var ans = state.answered[keyFor(state.currentSetId, q.id)];
    state.draftSelected = ans ? ans.selected.slice() : [];
  }

  /* =====================================================================
   * Persistence
   * ===================================================================== */
  function saveProgress() {
    try {
      rememberPosition();
      var payload = {
        version: STORAGE_VERSION,
        answered: state.answered,
        positions: state.positions,
        currentSetId: state.currentSetId,
        currentQuestionIndex: state.currentQuestionIndex,
        view: state.view,
        shuffle: state.shuffle,
        timer: { perSection: state.timer.perSection, running: state.timer.running }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) { /* storage unavailable -> ignore */ }
  }

  function loadProgress() {
    var raw;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { return false; }
    if (!raw) return false;
    var data;
    try { data = JSON.parse(raw); } catch (e) { return false; }
    // IGNORE stale saves (version mismatch) -> auto-reset
    if (!data || data.version !== STORAGE_VERSION) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      return false;
    }
    state.answered = (data.answered && typeof data.answered === 'object') ? data.answered : {};
    state.positions = (data.positions && typeof data.positions === 'object') ? data.positions : {};
    state.currentSetId = data.currentSetId;
    state.currentQuestionIndex = typeof data.currentQuestionIndex === 'number' ? data.currentQuestionIndex : 0;
    state.view = (data.view === 'learn' || data.view === 'search' || data.view === 'review') ? data.view : 'quiz';
    state.shuffle = !!data.shuffle;
    if (data.timer && data.timer.perSection && typeof data.timer.perSection === 'object') {
      state.timer.perSection = data.timer.perSection;
    }
    if (data.timer && typeof data.timer.running === 'boolean') state.timer.running = data.timer.running;
    return true;
  }

  function resetProgress() {
    state.answered = {};
    state.positions = {};
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state.timer.perSection = {};
    state.timer.running = true;
    var first = flatSets()[0];
    selectSet(first.id, 0);
    render();
  }
  api.resetProgress = resetProgress;

  /* =====================================================================
   * Tiny DOM builder
   * ===================================================================== */
  function el(tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    for (var k in attrs) {
      if (!attrs.hasOwnProperty(k)) continue;
      var v = attrs[k];
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'onClick') node.addEventListener('click', v);
      else if (k === 'dataset') { for (var d in v) if (v.hasOwnProperty(d)) node.dataset[d] = v[d]; }
      else if (k === 'disabled') { if (v) node.disabled = true; }
      else if (k === 'checked') { if (v) node.checked = true; }
      else node.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    }
    return node;
  }

  function clear(node) { node.textContent = ''; }
  function byId(id) { return document.getElementById(id); }

  /* =====================================================================
   * Rendering
   * ===================================================================== */
  function render() {
    renderTabs();
    renderSidebar();
    renderTimerVisibility();
    var main = byId('main');
    if (!main) return;
    clear(main);
    if (state.view === 'quiz') renderQuiz(main);
    else if (state.view === 'learn') renderLearn(main);
    else if (state.view === 'search') renderSearch(main);
    else if (state.view === 'review') renderReview(main);
    var sh = byId('shuffle-toggle');
    if (sh) sh.checked = state.shuffle;
  }
  api.render = render;

  function renderTabs() {
    var tabs = byId('view-tabs');
    if (!tabs) return;
    var btns = tabs.querySelectorAll('.tab');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (b.dataset.view === state.view) b.classList.add('active');
      else b.classList.remove('active');
    }
  }

  function renderSidebar() {
    var list = byId('set-list');
    if (!list) return;
    clear(list);
    var sets = flatSets();
    var lastGroup = null;
    for (var i = 0; i < sets.length; i++) {
      var set = sets[i];
      if (set.group !== lastGroup) {
        lastGroup = set.group;
        list.appendChild(el('div', { class: 'group-header', text: set.group }));
      }
      var st = setStats(set);
      var pct = st.total ? Math.round((st.answered / st.total) * 100) : 0;
      var item = el('button', {
        class: 'set-item' + (set.id === state.currentSetId ? ' active' : ''),
        dataset: { setId: String(set.id) }
      });
      item.appendChild(el('span', { class: 'set-title', text: set.title }));
      item.appendChild(el('span', { class: 'set-meta', text: st.answered + '/' + st.total + ' answered · ' + st.correct + ' correct' }));
      var bar = el('div', { class: 'mini-bar' });
      bar.appendChild(el('span', { style: 'width:' + pct + '%' }));
      item.appendChild(bar);
      (function (id) {
        item.addEventListener('click', function () {
          rememberPosition();                  // park the set we're leaving
          state.view = 'quiz';
          // resume where we last were in that set (summary page if it was finished)
          var pos = (typeof state.positions[id] === 'number') ? state.positions[id] : 0;
          selectSet(id, pos);
          saveProgress();
          render();
        });
      })(set.id);
      list.appendChild(item);
    }

    var ov = byId('overall-stats');
    if (ov) {
      var o = overallStats();
      clear(ov);
      ov.appendChild(el('div', {}, el('strong', { text: o.correct + ' / ' + o.total }), ' full-mark questions'));
      ov.appendChild(el('div', { text: o.answered + ' answered across all sets' }));
      ov.appendChild(el('button', { class: 'btn secondary', text: 'Reset all progress', style: 'margin-top:10px', onClick: function () {
        if (typeof confirm === 'function' && !confirm('Reset all answers and progress?')) return;
        resetProgress();
      } }));
    }
  }

  /* ---------- QUIZ view ---------- */
  function renderQuiz(main) {
    var set = currentSet();
    if (!set) { main.appendChild(el('p', { class: 'empty', text: 'No set selected.' })); return; }

    if (state.currentQuestionIndex >= state.currentOrder.length) {
      renderSummary(main, set);
      return;
    }

    var q = currentQuestion();
    var key = keyFor(set.id, q.id);
    var ans = state.answered[key];
    var submitted = !!ans;
    var selected = submitted ? ans.selected : state.draftSelected;

    var card = el('div', { class: 'card' });

    var prog = el('div', { class: 'q-progress' });
    prog.appendChild(el('span', { class: 'q-set-title', text: set.title }));
    prog.appendChild(el('span', { text: 'Question ' + (state.currentQuestionIndex + 1) + ' of ' + state.currentOrder.length }));
    card.appendChild(prog);

    card.appendChild(el('div', { class: 'q-text', text: q.question }));
    card.appendChild(el('div', { class: 'q-hint', text: 'Select all that apply (1–3 may be correct), then press Check.' }));

    var opts = el('div', { class: 'options' });
    var letters = [];
    for (var li = 0; li < q.options.length; li++) letters.push(String.fromCharCode(65 + li));
    for (var i = 0; i < q.options.length; i++) {
      (function (i) {
        var isSel = selected.indexOf(i) !== -1;
        var isCorrect = q.correct.indexOf(i) !== -1;
        var cls = 'option';
        if (submitted) {
          if (isCorrect && isSel) cls += ' correct';
          else if (isCorrect && !isSel) cls += ' missed';
          else if (!isCorrect && isSel) cls += ' wrong';
        } else if (isSel) {
          cls += ' selected';
        }
        var btn = el('button', { class: cls, dataset: { idx: String(i) }, disabled: submitted });
        btn.appendChild(el('span', { class: 'box', text: isSel ? '✓' : letters[i] }));
        var lab = el('span', {});
        lab.appendChild(el('span', { class: 'opt-key', text: letters[i] + '.' }));
        lab.appendChild(document.createTextNode(' ' + q.options[i]));
        btn.appendChild(lab);
        if (!submitted) btn.addEventListener('click', function () { toggleOption(i); });
        opts.appendChild(btn);
      })(i);
    }
    card.appendChild(opts);

    var actions = el('div', { class: 'actions' });
    var prevBtn = el('button', { class: 'btn secondary', text: '← Prev', dataset: { action: 'prev' },
      disabled: (state.currentQuestionIndex === 0 && getSetIndex(set.id) === 0) });
    prevBtn.addEventListener('click', prevQuestion);
    actions.appendChild(prevBtn);

    if (!submitted) {
      var submitBtn = el('button', { class: 'btn', text: 'Check answer', dataset: { action: 'submit' } });
      submitBtn.addEventListener('click', submitAnswer);
      actions.appendChild(submitBtn);
    } else {
      var nextBtn = el('button', { class: 'btn', text: (state.currentQuestionIndex + 1 >= state.currentOrder.length ? 'See summary →' : 'Next →'), dataset: { action: 'next' } });
      nextBtn.addEventListener('click', nextQuestion);
      actions.appendChild(nextBtn);
    }
    card.appendChild(actions);

    if (submitted) {
      var fb = el('div', { class: 'feedback ' + (ans.isFullyCorrect ? 'full' : 'partial') });
      fb.appendChild(el('div', { class: 'verdict', text: ans.isFullyCorrect ? '✓ Full marks' : '✗ Not full marks (all-or-nothing)' }));
      fb.appendChild(el('div', { class: 'reasoning', text: q.reasoning }));
      card.appendChild(fb);
    }

    main.appendChild(card);
  }

  function renderSummary(main, set) {
    var st = setStats(set);
    var card = el('div', { class: 'card summary' });
    card.appendChild(el('h2', { text: set.title + ' — summary' }));
    card.appendChild(el('div', { class: 'score-big', text: st.correct + ' / ' + st.total }));
    card.appendChild(el('div', { class: 'score-line', text: 'full-mark questions (' + st.answered + ' answered, all-or-nothing scoring)' }));

    var actions = el('div', { class: 'actions' });
    var review = el('button', { class: 'btn secondary', text: 'Review from start', dataset: { action: 'restart' } });
    review.addEventListener('click', function () { selectSet(set.id, 0); saveProgress(); render(); });
    actions.appendChild(review);

    var incorrectCount = st.answered - st.correct;
    if (incorrectCount > 0) {
      var retry = el('button', { class: 'btn', text: 'Retry incorrect (' + incorrectCount + ')', dataset: { action: 'retry' } });
      retry.addEventListener('click', function () { retryIncorrect(set.id); });
      actions.appendChild(retry);
    }

    var sets = flatSets();
    var idx = getSetIndex(set.id);
    if (idx + 1 < sets.length) {
      var nextSet = sets[idx + 1];
      var go = el('button', { class: 'btn', text: 'Next set: ' + nextSet.title + ' →', dataset: { action: 'next-set' } });
      go.addEventListener('click', function () { selectSet(nextSet.id, 0); saveProgress(); render(); });
      actions.appendChild(go);
    }
    card.appendChild(actions);
    main.appendChild(card);
  }

  /* ---------- LEARN view ---------- */
  function renderLearn(main) {
    var set = currentSet();
    if (!set) { main.appendChild(el('p', { class: 'empty', text: 'No set selected.' })); return; }

    var controls = el('div', { class: 'learn-controls' });
    controls.appendChild(el('h2', { text: set.title, style: 'margin:0;flex:1;color:var(--maroon)' }));
    var toggle = el('button', { class: 'btn secondary', text: state.showLearnAnswers ? 'Hide answers' : 'Show answers', dataset: { action: 'toggle-answers' } });
    toggle.addEventListener('click', function () { state.showLearnAnswers = !state.showLearnAnswers; render(); });
    controls.appendChild(toggle);
    main.appendChild(controls);

    var card = el('div', { class: 'card' });
    var letters = ['A', 'B', 'C', 'D'];
    for (var i = 0; i < set.questions.length; i++) {
      var q = set.questions[i];
      var item = el('div', { class: 'learn-item' });
      item.appendChild(el('div', { class: 'learn-q', text: (i + 1) + '. ' + q.question }));
      var ul = el('ul', { class: 'learn-opts' });
      for (var j = 0; j < q.options.length; j++) {
        var correct = q.correct.indexOf(j) !== -1;
        var li = el('li', { class: state.showLearnAnswers && correct ? 'correct' : '' });
        li.appendChild(el('span', { class: 'opt-key', text: letters[j] + '. ' }));
        li.appendChild(document.createTextNode(q.options[j] + (state.showLearnAnswers && correct ? '  ✓' : '')));
        ul.appendChild(li);
      }
      item.appendChild(ul);
      if (state.showLearnAnswers) item.appendChild(el('div', { class: 'learn-reason', text: q.reasoning }));
      card.appendChild(item);
    }
    main.appendChild(card);
  }

  /* ---------- REVIEW view (captures every incorrect question) ---------- */
  function renderReview(main) {
    var sets = flatSets();
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    // collect sets that currently hold at least one wrong answer
    var groups = [];
    var grandTotal = 0;
    for (var s = 0; s < sets.length; s++) {
      var set = sets[s];
      var idx = incorrectIndices(set);
      if (idx.length) { groups.push({ set: set, idx: idx }); grandTotal += idx.length; }
    }

    var controls = el('div', { class: 'learn-controls' });
    controls.appendChild(el('h2', { text: 'Review mistakes', style: 'margin:0;flex:1;color:var(--maroon)' }));
    controls.appendChild(el('span', { class: 'search-meta', text: grandTotal + ' incorrect across ' + groups.length + ' section' + (groups.length === 1 ? '' : 's') }));
    main.appendChild(controls);

    if (!grandTotal) {
      main.appendChild(el('p', { class: 'empty', text: 'No mistakes captured yet. Answer some questions — anything you miss shows up here to retry.' }));
      return;
    }

    for (var g = 0; g < groups.length; g++) {
      (function (group) {
        var set = group.set, idx = group.idx;
        var card = el('div', { class: 'card' });

        var head = el('div', { class: 'learn-controls' });
        head.appendChild(el('h3', { text: set.title + ' — ' + idx.length + ' wrong', style: 'margin:0;flex:1;color:var(--maroon)' }));
        var retry = el('button', { class: 'btn', text: 'Retry these (' + idx.length + ')', dataset: { action: 'retry-review' } });
        retry.addEventListener('click', function () { retryIncorrect(set.id); });
        head.appendChild(retry);
        card.appendChild(head);

        for (var k = 0; k < idx.length; k++) {
          var qn = set.questions[idx[k]];
          var ans = state.answered[keyFor(set.id, qn.id)];
          var item = el('div', { class: 'learn-item' });
          item.appendChild(el('div', { class: 'learn-q', text: (idx[k] + 1) + '. ' + qn.question }));
          var ul = el('ul', { class: 'learn-opts' });
          for (var j = 0; j < qn.options.length; j++) {
            var isCorrect = qn.correct.indexOf(j) !== -1;
            var wasPicked = ans && ans.selected.indexOf(j) !== -1;
            var li = el('li', { class: isCorrect ? 'correct' : (wasPicked ? 'wrong' : '') });
            li.appendChild(el('span', { class: 'opt-key', text: letters[j] + '. ' }));
            var tag = isCorrect ? '  ✓' : (wasPicked ? '  ✗ your pick' : '');
            li.appendChild(document.createTextNode(qn.options[j] + tag));
            ul.appendChild(li);
          }
          item.appendChild(ul);
          item.appendChild(el('div', { class: 'learn-reason', text: qn.reasoning }));
          card.appendChild(item);
        }
        main.appendChild(card);
      })(groups[g]);
    }
  }

  /* ---------- SEARCH view ---------- */
  var searchDebounce = null;
  function renderSearch(main) {
    var box = el('input', { class: 'search-box', type: 'text', placeholder: 'Search every question, answer, and explanation…' });
    box.value = state.searchQuery;
    box.addEventListener('input', function (e) {
      var v = (e && e.target ? e.target.value : box.value);
      if (searchDebounce) clearTimeout(searchDebounce);
      searchDebounce = setTimeout(function () {
        state.searchQuery = v;
        renderSearchResults();
      }, 180);
    });
    main.appendChild(box);
    main.appendChild(el('div', { id: 'search-results' }));
    renderSearchResults();
    if (box.focus) try { box.focus(); } catch (e) {}
  }

  function highlight(text, query) {
    var safe = escapeHtml(text);
    if (!query) return safe;
    // escape regex metachars in the query, then wrap matches (on the escaped text)
    var q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      return safe.replace(new RegExp('(' + q + ')', 'gi'), '<mark>$1</mark>');
    } catch (e) { return safe; }
  }

  function renderSearchResults() {
    var box = byId('search-results');
    if (!box) return;
    clear(box);
    var query = (state.searchQuery || '').trim();
    if (!query) { box.appendChild(el('p', { class: 'empty', text: 'Type to search the whole question bank.' })); return; }

    var ql = query.toLowerCase();
    var sets = flatSets();
    var results = [];
    for (var s = 0; s < sets.length; s++) {
      var set = sets[s];
      for (var i = 0; i < set.questions.length; i++) {
        var q = set.questions[i];
        var hay = (q.question + ' ' + q.options.join(' ') + ' ' + q.reasoning).toLowerCase();
        if (hay.indexOf(ql) !== -1) results.push({ set: set, q: q });
      }
    }

    box.appendChild(el('div', { class: 'search-meta', text: results.length + ' match' + (results.length === 1 ? '' : 'es') }));
    for (var r = 0; r < results.length; r++) {
      var res = results[r];
      var div = el('div', { class: 'result' });
      div.appendChild(el('div', { class: 'r-set', text: res.set.title }));
      // HTML-ESCAPED + <mark> highlight (never inject raw text as innerHTML)
      div.appendChild(el('div', { class: 'r-q', html: highlight(res.q.question, query) }));
      for (var o = 0; o < res.q.options.length; o++) {
        div.appendChild(el('div', { class: 'r-opt', html: highlight(res.q.options[o], query) }));
      }
      div.appendChild(el('div', { class: 'r-opt', html: highlight(res.q.reasoning, query) }));
      box.appendChild(div);
    }
  }

  /* =====================================================================
   * Interaction handlers
   * ===================================================================== */
  function toggleOption(i) {
    var q = currentQuestion();
    if (!q) return;
    if (state.answered[keyFor(state.currentSetId, q.id)]) return; // locked
    var pos = state.draftSelected.indexOf(i);
    if (pos === -1) state.draftSelected.push(i);
    else state.draftSelected.splice(pos, 1);
    render();
  }

  function submitAnswer() {
    var q = currentQuestion();
    if (!q) return;
    var key = keyFor(state.currentSetId, q.id);
    if (state.answered[key]) return;
    var sel = state.draftSelected.slice();
    state.answered[key] = { selected: sel, isFullyCorrect: isFullyCorrect(q, sel) };
    saveProgress();
    render();
  }
  api.submitAnswer = submitAnswer;

  function nextQuestion() {
    if (state.currentQuestionIndex < state.currentOrder.length) {
      state.currentQuestionIndex++;
      syncDraftFromAnswered();
      saveProgress();
      render();
    }
  }

  function prevQuestion() {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      syncDraftFromAnswered();
      saveProgress();
      render();
      return;
    }
    // at first question of this set -> cross into the previous set's LAST question
    var idx = getSetIndex(state.currentSetId);
    if (idx > 0) {
      var prev = flatSets()[idx - 1];
      selectSet(prev.id, 'last');
      saveProgress();
      render();
    }
  }
  api.nextQuestion = nextQuestion;
  api.prevQuestion = prevQuestion;

  /* =====================================================================
   * Keyboard shortcuts (guarded to the quiz view only)
   * ===================================================================== */
  function onKeydown(e) {
    if (state.view !== 'quiz') return;                 // guard: quiz view only
    var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') return; // don't hijack typing

    var key = e.key;
    var q = currentQuestion();
    var submitted = q && !!state.answered[keyFor(state.currentSetId, q.id)];

    // digit (1-9) or letter (A-Z) toggles an option (only while unanswered);
    // bounds are checked against q.options.length below, so sets with >4 options work too.
    var optIndex = -1;
    if (/^[1-9]$/.test(key)) optIndex = parseInt(key, 10) - 1;
    else if (/^[a-zA-Z]$/.test(key)) optIndex = key.toLowerCase().charCodeAt(0) - 97;

    if (optIndex >= 0 && q && !submitted && optIndex < q.options.length) {
      toggleOption(optIndex); if (e.preventDefault) e.preventDefault();
      return;
    }

    if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      if (q) { submitted ? nextQuestion() : submitAnswer(); }
      else { nextQuestion(); } // e.g. on summary, no-op
      if (e.preventDefault) e.preventDefault();
      return;
    }
    if (key === 'ArrowRight') { if (submitted) nextQuestion(); if (e.preventDefault) e.preventDefault(); return; }
    if (key === 'ArrowLeft') { prevQuestion(); if (e.preventDefault) e.preventDefault(); return; }
    if (key === 'p' || key === 'P') { toggleTimer(); if (e.preventDefault) e.preventDefault(); return; }
  }

  /* =====================================================================
   * Study timer (pausable; shown only in quiz view)
   * ===================================================================== */
  function fmt(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  function remainingForCurrent() {
    if (!state.currentSetId) return SECTION_SECONDS;
    var r = state.timer.perSection[state.currentSetId];
    return typeof r === 'number' ? r : SECTION_SECONDS;
  }
  // paints the timer node from the current section's remaining seconds
  function paintTimer() {
    var t = byId('timer');
    if (!t) return;
    var rem = remainingForCurrent();
    t.classList.remove('warning', 'expired');
    if (rem <= 0) {
      // time's up — keep going, show overtime as "+MM:SS" and flash red
      t.textContent = '+' + fmt(Math.abs(rem));
      t.classList.add('expired');
    } else {
      t.textContent = fmt(rem);
      if (rem <= WARNING_SECONDS) t.classList.add('warning');
    }
    if (state.timer.running) t.classList.remove('paused'); else t.classList.add('paused');
  }
  function renderTimerVisibility() {
    var wrap = byId('timer-wrap') || byId('timer');
    if (wrap) {
      if (state.view === 'quiz') wrap.classList.remove('hidden');
      else wrap.classList.add('hidden');
    }
    paintTimer();
    paintPauseButton();
  }
  function paintPauseButton() {
    var p = byId('timer-pause');
    if (!p) return;
    p.textContent = state.timer.running ? '⏸' : '▶';
    p.setAttribute('title', state.timer.running ? 'Pause (P)' : 'Resume (P)');
  }
  function tickTimer() {
    // countdown only while actively taking the quiz and not paused
    if (!state.timer.running || state.view !== 'quiz' || !state.currentSetId) return;
    ensureTimer(state.currentSetId);
    state.timer.perSection[state.currentSetId]--;   // may go negative = overtime
    paintTimer();
  }
  function toggleTimer() {
    state.timer.running = !state.timer.running;
    saveProgress();
    renderTimerVisibility();
  }
  function startTimer() {
    if (state.timer.id) return;
    if (typeof setInterval === 'function') state.timer.id = setInterval(tickTimer, 1000);
  }
  api.toggleTimer = toggleTimer;

  /* =====================================================================
   * Bootstrap
   * ===================================================================== */
  function wireTabs() {
    var tabs = byId('view-tabs');
    if (!tabs) return;
    var btns = tabs.querySelectorAll('.tab');
    for (var i = 0; i < btns.length; i++) {
      (function (b) {
        b.addEventListener('click', function () {
          state.view = b.dataset.view;
          saveProgress();
          render();
        });
      })(btns[i]);
    }
    var sh = byId('shuffle-toggle');
    if (sh) sh.addEventListener('change', function () {
      state.shuffle = !!sh.checked;
      // rebuild order for the current set, keeping the user near the start
      selectSet(state.currentSetId, 0);
      saveProgress();
      render();
    });
    var pause = byId('timer-pause');
    if (pause) pause.addEventListener('click', toggleTimer);
  }

  function init() {
    if (typeof quizData === 'undefined' || !quizData.sets || !quizData.sets.length) return;
    var loaded = loadProgress();
    var sets = flatSets();

    // clamp any set-id from a (possibly stale) save into range before first render
    if (!loaded || !getSet(state.currentSetId)) {
      state.currentSetId = sets[0].id;
      state.currentQuestionIndex = 0;
    }
    selectSet(state.currentSetId, 0);
    // clamp question index into the freshly-built order range
    if (state.currentQuestionIndex > state.currentOrder.length) state.currentQuestionIndex = state.currentOrder.length;
    if (state.currentQuestionIndex < 0) state.currentQuestionIndex = 0;
    syncDraftFromAnswered();

    wireTabs();
    if (typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('keydown', onKeydown);
    }
    startTimer();
    render();
  }
  api.init = init;

  // run immediately on load (script lives at end of <body>)
  init();
})();
