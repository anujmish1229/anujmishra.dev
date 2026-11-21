/* Photo viewer on the personal page: a stage with the current shot over a
   blurred copy of itself, a caption bar, and a thumbnail strip to pick from.
   The order is shuffled on every visit so that no two neighbouring frames
   come from the same trip (data-group). Without JS the strip is just a row
   of thumbnails that open each photo. */
(function () {
  'use strict';

  var root = document.querySelector('[data-lens]');
  if (!root) return;

  var stage = root.querySelector('.lens__stage');
  var img = root.querySelector('.lens__img');
  var bg = root.querySelector('.lens__bg');
  var open = root.querySelector('.lens__open');
  var bar = root.querySelector('.lens__bar');
  var caption = root.querySelector('[data-lens-caption]');
  var count = root.querySelector('[data-lens-count]');
  var strip = root.querySelector('.lens__strip');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shuffle, keeping same-group photos apart. At each step pick at random
  // from the groups that differ from the last one, but if one group holds
  // more than half of what's left, it has to go now or it can't fit later.
  function arrange(items) {
    var pools = {};
    items.forEach(function (li) {
      var g = li.dataset.group || '';
      (pools[g] = pools[g] || []).push(li);
    });
    Object.keys(pools).forEach(function (g) {
      var p = pools[g];
      for (var i = p.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = p[i]; p[i] = p[j]; p[j] = t;
      }
    });
    var out = [], last = null, left = items.length;
    while (left) {
      var groups = Object.keys(pools).filter(function (g) { return pools[g].length; });
      var big = groups.filter(function (g) { return pools[g].length > left / 2 && g !== last; })[0];
      var ok = groups.filter(function (g) { return g !== last; });
      if (!ok.length) ok = groups; // only possible if one group dominates
      var g = big || ok[Math.floor(Math.random() * ok.length)];
      out.push(pools[g].pop()); last = g; left--;
    }
    return out;
  }

  arrange([].slice.call(strip.children)).forEach(function (li) { strip.appendChild(li); });

  var links = [].slice.call(strip.querySelectorAll('a'));
  var current = -1;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function preload(i) {
    var a = links[(i + links.length) % links.length];
    if (a && !a._pre) { a._pre = new Image(); a._pre.src = a.href; }
  }

  function show(i, focusThumb) {
    i = (i + links.length) % links.length;
    if (i === current) return;
    current = i;
    var a = links[i];
    var thumb = a.querySelector('img');

    stage.classList.add('is-swapping');
    var next = new Image();
    next.onload = next.onerror = function () {
      if (current !== i) return;
      img.src = bg.src = a.href;
      img.alt = thumb.alt;
      img.width = +a.dataset.w; img.height = +a.dataset.h;
      stage.classList.remove('is-swapping');
    };
    next.src = a.href;

    open.href = a.href;
    caption.textContent = a.dataset.caption;
    count.textContent = pad(i + 1) + ' / ' + pad(links.length);

    links.forEach(function (l, j) {
      if (j === i) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });

    // Centre the active frame in the strip without scrolling the page.
    var li = a.parentNode;
    strip.scrollTo({
      left: li.offsetLeft - (strip.clientWidth - li.offsetWidth) / 2,
      behavior: reduced ? 'auto' : 'smooth',
    });
    if (focusThumb) a.focus({ preventScroll: true });

    preload(i + 1); preload(i - 1);
  }

  links.forEach(function (a, i) {
    a.removeAttribute('target');
    // Name each frame by its caption and position.
    a.title = a.dataset.caption;
    a.setAttribute('aria-label', a.dataset.caption + ', photo ' + (i + 1) + ' of ' + links.length);
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      show(i);
    });
  });

  [].forEach.call(root.querySelectorAll('[data-lens-step]'), function (b) {
    b.addEventListener('click', function () { show(current + +b.dataset.lensStep); });
  });

  root.addEventListener('keydown', function (e) {
    if (modal.open) return;
    var d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (!d) return;
    e.preventDefault();
    show(current + d, strip.contains(document.activeElement));
  });

  // Swipe on touch screens.
  var x0 = null;
  stage.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  stage.addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
  });

  /* Modal: clicking the photo opens it large, with what's in it on the
     left and where it was taken on the right. Arrow keys and the side
     buttons step through, Escape or a click outside closes it. */
  var modal = document.createElement('dialog');
  modal.className = 'lens-modal';
  modal.setAttribute('aria-label', 'Photo');
  modal.tabIndex = -1;
  modal.innerHTML =
    '<div class="lens-modal__frame">' +
      '<img class="lens-modal__img" alt="">' +
      '<button type="button" class="lens-modal__close" aria-label="Close">\u00d7</button>' +
      '<button type="button" class="lens-modal__nav lens-modal__nav--prev" data-step="-1" aria-label="Previous photo">\u2190</button>' +
      '<button type="button" class="lens-modal__nav lens-modal__nav--next" data-step="1" aria-label="Next photo">\u2192</button>' +
    '</div>' +
    '<div class="lens-modal__info">' +
      '<p class="lens-modal__desc"></p>' +
      '<p class="lens-modal__place"></p>' +
    '</div>';
  document.body.appendChild(modal);
  var mImg = modal.querySelector('.lens-modal__img');
  var mDesc = modal.querySelector('.lens-modal__desc');
  var mPlace = modal.querySelector('.lens-modal__place');

  function fill() {
    var a = links[current];
    mImg.src = a.href;
    mImg.alt = a.querySelector('img').alt;
    mDesc.textContent = a.dataset.desc || a.dataset.caption;
    mPlace.textContent = a.dataset.place || '';
  }

  function openModal() {
    if (!modal.showModal) return false;
    fill();
    modal.showModal();
    modal.focus(); // keep the focus ring off the close button until someone tabs
    document.documentElement.classList.add('modal-open');
    return true;
  }

  open.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (openModal()) e.preventDefault();
  });

  [].forEach.call(modal.querySelectorAll('[data-step]'), function (b) {
    b.addEventListener('click', function () { show(current + +b.dataset.step); fill(); });
  });
  modal.querySelector('.lens-modal__close').addEventListener('click', function () { modal.close(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', function () { document.documentElement.classList.remove('modal-open'); });
  modal.addEventListener('keydown', function (e) {
    var d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (!d) return;
    e.preventDefault();
    e.stopPropagation();
    show(current + d); fill();
  });
  var mx0 = null;
  modal.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') mx0 = e.clientX; });
  modal.addEventListener('pointerup', function (e) {
    if (mx0 === null) return;
    var dx = e.clientX - mx0; mx0 = null;
    if (Math.abs(dx) > 40) { show(current + (dx < 0 ? 1 : -1)); fill(); }
  });

  stage.hidden = false;
  bar.hidden = false;
  root.classList.add('is-live');
  show(0);
})();
