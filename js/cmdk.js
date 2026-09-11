/* ==========================================================================
   COMMAND MENU: Ctrl/Cmd-K

   Everything the site can do, reachable from the keyboard. Built on a native
   <dialog>: showModal() gives focus trapping, Escape handling, backdrop
   inertness and focus restoration without a line of trap code.

   The combobox follows the ARIA authoring practice: focus stays in the text
   input and the active option is pointed at with aria-activedescendant, so
   screen readers announce each result as you arrow through them.

   Commands are read straight from data.js (SITE, REFS) so the palette can
   never drift from the commit log itself.
   ========================================================================== */

(function () {
  'use strict';

  var dlg = document.getElementById('cmdk');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  var input  = document.getElementById('cmdk-input');
  var list   = document.getElementById('cmdk-list');
  var empty  = dlg.querySelector('.cmdk__empty');
  var status = document.getElementById('cmdk-status');

  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var EMAIL = SITE.email;

  /* ------------------------------------------------------------- icons */
  /* Drawn to match the header's branch/search glyphs: same viewBox, stroke
     weight and currentColor — never a Unicode character standing in. */

  var ICONS = {
    branch: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="4" cy="4" r="1.8" stroke="currentColor" stroke-width="1.4"></circle><circle cx="4" cy="13" r="1.8" stroke="currentColor" stroke-width="1.4"></circle><circle cx="12" cy="8.5" r="1.8" stroke="currentColor" stroke-width="1.4"></circle><path d="M4 6v3a4 4 0 0 0 4 4h2M4 6v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path></svg>',
    mail: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9" rx="1.3" stroke="currentColor" stroke-width="1.3"></rect><path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>',
    external: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6.5 3H3.4A1.4 1.4 0 0 0 2 4.4v8.2A1.4 1.4 0 0 0 3.4 14h8.2A1.4 1.4 0 0 0 13 12.6V9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path><path d="M9.5 2h4.5v4.5M14 2 8 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    file: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 2h5l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"></path><path d="M9 2v3h3" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"></path></svg>'
  };

  /* ------------------------------------------------------------ commands */

  function open(url) {
    return function () {
      close();
      if (url) window.open(url, '_blank', 'noopener');
    };
  }

  function checkout(ref) {
    return function () {
      close();
      if (window.checkoutRef) window.checkoutRef(ref);
      var target = document.getElementById('log');
      if (target) target.scrollIntoView({ block: 'start' });
    };
  }

  var COMMANDS = [
    { g: 'Go', icon: ICONS.branch, label: 'git checkout main',       keys: 'projects home ref branch', run: checkout('main') },
    { g: 'Go', icon: ICONS.branch, label: 'git checkout experience', keys: 'roles jobs work ref branch', run: checkout('experience') },
    { g: 'Go', icon: ICONS.branch, label: 'git checkout about',      keys: 'education skills bio ref branch', run: checkout('about') },

    { g: 'Contact', icon: ICONS.mail, label: 'Copy email address', keys: 'clipboard mail contact', meta: EMAIL, run: copyEmail },
    { g: 'Contact', icon: ICONS.mail, label: 'Send an email',      keys: 'mailto contact write', run: function () { close(); location.href = 'mailto:' + EMAIL; } },
    { g: 'Contact', icon: ICONS.external, label: 'Open GitHub',    keys: 'code repos source anujmish1229', run: open(SITE.github) },
    { g: 'Contact', icon: ICONS.external, label: 'Open LinkedIn',  keys: 'profile connect anujmish', run: open(SITE.linkedin) },
    { g: 'Contact', icon: ICONS.file, label: 'Open resume',        keys: 'cv pdf export', run: function () { close(); toast('resume.pdf — untracked, not committed yet'); } }
  ];

  (REFS.main.commits || []).forEach(function (c) {
    if (!c.link) return;
    COMMANDS.push({
      g: 'Projects', icon: ICONS.external, label: 'Open ' + (c.id === 'myhighschool' ? 'myHighSchool.club' : c.message.replace(/^[a-z]+\(([^)]+)\):.*/, '$1')),
      keys: c.message + ' ' + (c.tags || []).join(' '),
      run: open(c.link)
    });
  });

  function copyEmail() {
    var done = function () { toast('Email copied'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done, fallback);
    } else { fallback(); }
    close();

    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = EMAIL;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:absolute;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed'); }
      document.body.removeChild(ta);
    }
  }

  /* --------------------------------------------------------------- toast */

  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2200);
  }

  /* --------------------------------------------------------------- match */

  /* Subsequence match: "gbe" finds "Game Boy Emulator". Returns a score and
     the indices that matched so they can be emboldened in the result. */
  function match(query, text) {
    if (!query) return { score: 0, hits: [] };
    var q = query.toLowerCase(), t = text.toLowerCase();
    var direct = t.indexOf(q);
    if (direct !== -1) {
      var hits = [];
      for (var d = 0; d < q.length; d++) hits.push(direct + d);
      // Whole-word or prefix matches outrank matches buried mid-string.
      return { score: 1000 - direct * 4 - (t.length - q.length), hits: hits };
    }
    var qi = 0, score = 0, out = [], prev = -2;
    for (var i = 0; i < t.length && qi < q.length; i++) {
      if (t[i] === q[qi]) {
        out.push(i);
        score += (i === prev + 1) ? 6 : 2;          // reward runs
        if (i === 0 || /[\s\-\/]/.test(t[i - 1])) score += 8;  // reward word starts
        prev = i; qi++;
      }
    }
    return qi === q.length ? { score: score, hits: out } : null;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function highlight(text, hits) {
    if (!hits || !hits.length) return escapeHtml(text);
    var out = '', set = {};
    hits.forEach(function (i) { set[i] = 1; });
    for (var i = 0; i < text.length; i++) {
      var ch = escapeHtml(text[i]);
      out += set[i] ? '<b>' + ch + '</b>' : ch;
    }
    return out;
  }

  /* --------------------------------------------------------------- render */

  var results = [], active = 0;

  function score(cmd, q) {
    if (!q) return { score: 0, hits: [] };
    var onLabel = match(q, cmd.label);
    if (onLabel) return onLabel;
    var onKeys = match(q, cmd.keys + ' ' + cmd.g);
    return onKeys ? { score: onKeys.score * 0.4, hits: [] } : null;
  }

  function render() {
    var q = input.value.trim();

    results = COMMANDS
      .map(function (c) { var m = score(c, q); return m ? { cmd: c, m: m } : null; })
      .filter(Boolean)
      .sort(function (a, b) { return b.m.score - a.m.score; });

    active = 0;
    list.innerHTML = '';

    if (!results.length) {
      empty.hidden = false;
      input.removeAttribute('aria-activedescendant');
      say('No matching commands');
      return;
    }
    empty.hidden = true;

    var lastGroup = null;
    results.forEach(function (r, i) {
      // Groups only make sense in the unfiltered list; once you have typed,
      // ranking beats category and the headers just add noise.
      if (!q && r.cmd.g !== lastGroup) {
        lastGroup = r.cmd.g;
        var h = document.createElement('li');
        h.className = 'cmdk__group';
        h.setAttribute('role', 'presentation');
        h.textContent = r.cmd.g;
        list.appendChild(h);
      }

      var li = document.createElement('li');
      li.className = 'cmdk__opt';
      li.id = 'cmdk-opt-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      li.innerHTML =
        '<span class="cmdk__glyph" aria-hidden="true">' + r.cmd.icon + '</span>' +
        '<span class="cmdk__label">' + highlight(r.cmd.label, r.m.hits) + '</span>' +
        (r.cmd.meta ? '<span class="cmdk__meta">' + escapeHtml(r.cmd.meta) + '</span>' : '');

      li.addEventListener('click', function () { run(i); });
      li.addEventListener('pointermove', function () { setActive(i); });
      list.appendChild(li);
    });

    input.setAttribute('aria-activedescendant', 'cmdk-opt-0');
    say(results.length + (results.length === 1 ? ' command' : ' commands'));
  }

  function say(msg) { if (status) status.textContent = msg; }

  function setActive(i) {
    if (!results.length) return;
    active = (i + results.length) % results.length;
    var opts = list.querySelectorAll('.cmdk__opt');
    opts.forEach(function (o, n) { o.setAttribute('aria-selected', n === active ? 'true' : 'false'); });
    var el = opts[active];
    if (el) {
      input.setAttribute('aria-activedescendant', el.id);
      el.scrollIntoView({ block: 'nearest' });
    }
  }

  function run(i) {
    var r = results[i];
    if (r) r.cmd.run();
  }

  /* ----------------------------------------------------------------- open */

  function show() {
    if (dlg.open) return;
    input.value = '';
    render();
    dlg.showModal();
    input.focus();
  }

  function close() { if (dlg.open) dlg.close(); }

  /* ----------------------------------------------------------------- wire */

  input.addEventListener('input', render);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown')      { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Home')      { e.preventDefault(); setActive(0); }
    else if (e.key === 'End')       { e.preventDefault(); setActive(results.length - 1); }
    else if (e.key === 'Enter')     { e.preventDefault(); run(active); }
  });

  // Clicking the backdrop closes. The dialog fills its own box, so a click
  // whose target is the dialog itself landed outside the panel.
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });

  document.addEventListener('keydown', function (e) {
    var mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); dlg.open ? close() : show(); }
    // "/" is a common jump-to-search idiom, but must not hijack typing.
    if (e.key === '/' && !dlg.open && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)
        && !document.activeElement.isContentEditable) {
      e.preventDefault(); show();
    }
  });

  [].forEach.call(document.querySelectorAll('[data-cmdk-open]'), function (b) {
    b.addEventListener('click', show);
  });

  // Label the trigger with the right modifier for the platform.
  [].forEach.call(document.querySelectorAll('[data-cmdk-key]'), function (el) {
    el.textContent = isMac ? '⌘K' : 'Ctrl K';
  });
})();
