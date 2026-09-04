(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'theme';

  function preferredTheme() {
    var stored = localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }

  // Applied synchronously, before the body paints, so there's no flash of
  // the wrong theme on load.
  apply(preferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      apply(next);
      localStorage.setItem(KEY, next);
    });
  });
})();
