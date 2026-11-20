/* Light/dark toggle. The system preference is the default; clicking stores
   an explicit choice. The pre-paint snippet in <head> re-applies it. */
(function () {
  'use strict';

  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function current() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return mq && mq.matches ? 'dark' : 'light';
  }

  function toggleTheme() {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  }

  window.toggleTheme = toggleTheme;

  [].forEach.call(document.querySelectorAll('[data-theme-toggle]'), function (b) {
    b.addEventListener('click', toggleTheme);
  });
})();
