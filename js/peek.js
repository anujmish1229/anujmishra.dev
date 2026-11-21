/* Hovering a project link with a mouse shows a small screenshot of the
   site next to the pointer, with its address underneath. Touch and
   keyboard users just follow the link, so the preview is only a nicety. */
(function () {
  'use strict';

  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var links = [].slice.call(document.querySelectorAll('[data-peek]'));
  if (!links.length) return;

  var box = document.createElement('div');
  box.className = 'peek';
  box.setAttribute('aria-hidden', 'true');
  var shot = document.createElement('img');
  shot.alt = '';
  var url = document.createElement('span');
  url.className = 'peek__url';
  box.appendChild(shot);
  box.appendChild(url);
  document.body.appendChild(box);

  // Warm the images so the first hover isn't an empty box.
  links.forEach(function (a) { new Image().src = a.getAttribute('data-peek'); });

  var current = null;

  function host(a) {
    return (a.hostname.replace(/^www\./, '') + a.pathname).replace(/\/$/, '');
  }

  function show(a) {
    current = a;
    shot.src = a.getAttribute('data-peek');
    url.textContent = host(a);
    box.classList.add('is-on');
  }

  function hide() {
    current = null;
    box.classList.remove('is-on');
  }

  // Sit below and to the right of the pointer, flipping to stay on screen.
  function move(e) {
    var w = box.offsetWidth, h = box.offsetHeight;
    var x = e.clientX + 16, y = e.clientY + 20;
    if (x + w > innerWidth - 12) x = e.clientX - w - 16;
    if (y + h > innerHeight - 12) y = e.clientY - h - 20;
    box.style.transform = 'translate(' + Math.max(12, x) + 'px,' + Math.max(12, y) + 'px)';
  }

  links.forEach(function (a) {
    a.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      show(a);
      move(e);
    });
    a.addEventListener('pointermove', function (e) { if (current === a) move(e); });
    a.addEventListener('pointerleave', hide);
  });

  addEventListener('scroll', hide, { passive: true });
})();
