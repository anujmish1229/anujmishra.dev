(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel) { return document.querySelector(sel); };
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  (function cursor() {
    if (!fine.matches || reduced.matches) return;

    var el = $('.cursor');
    var dot = $('.cursor__dot');
    var ring = $('.cursor__ring');
    if (!el || !dot || !ring) return;

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var rx = tx, ry = ty;
    var raf = 0, awake = false;
    var hotEl = null;
    var RING_PAD = 8;

    // While hovering something hot, the ring's target is that element's
    // center rather than the raw pointer position, so it snaps to it.
    function ringTarget() {
      if (!hotEl) return { x: tx, y: ty };
      var r = hotEl.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function loop() {
      var t = ringTarget();
      rx += (t.x - rx) * 0.18;
      ry += (t.y - ry) * 0.18;
      // translate(-50%,-50%) self-centers on the element's current
      // rendered size, so it can't drift out of sync with the width/height
      // setHot() sets below.
      dot.style.transform  = 'translate3d(' + tx + 'px,' + ty + 'px,0) translate(-50%,-50%)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
      raf = requestAnimationFrame(loop);
    }

    // Grows/reshapes the ring to frame the hovered element, like a
    // selection outline, instead of staying a small fixed circle.
    function setHot(target) {
      hotEl = target;
      el.classList.add('is-hot');
      var r = target.getBoundingClientRect();
      var w = r.width + RING_PAD * 2;
      var h = r.height + RING_PAD * 2;
      var radius = parseFloat(window.getComputedStyle(target).borderRadius);
      ring.style.width = w + 'px';
      ring.style.height = h + 'px';
      ring.style.borderRadius = (radius > 0 ? radius + RING_PAD : 10) + 'px';
    }

    function clearHot() {
      hotEl = null;
      el.classList.remove('is-hot');
      ring.style.width = '';
      ring.style.height = '';
      ring.style.borderRadius = '';
    }

    window.addEventListener('pointermove', function (e) {
      // A touch or pen user should never lose the native cursor, and nobody
      // should see a stray ring parked mid-screen before they've moved.
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (!awake) {
        awake = true;
        rx = tx; ry = ty;
        root.classList.add('has-cursor');
        el.classList.add('is-awake');
      }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    window.addEventListener('pointerdown', function () { el.classList.add('is-down'); }, { passive: true });
    window.addEventListener('pointerup',   function () { el.classList.remove('is-down'); }, { passive: true });

    var HOT = 'a, button, [role="button"], .part, .tag, input, textarea, select, summary';
    document.addEventListener('pointerover', function (e) {
      var target = e.target.closest && e.target.closest(HOT);
      if (target) setHot(target);
    });
    document.addEventListener('pointerout', function (e) {
      var target = e.target.closest && e.target.closest(HOT);
      if (target && target === hotEl) clearHot();
    });

    // Never strand the cursor off-screen.
    document.addEventListener('mouseleave', function () { el.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { el.style.opacity = '1'; });
  })();

})();
