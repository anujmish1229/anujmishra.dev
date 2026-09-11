/* ==========================================================================
   CUSTOM CURSOR

   A ring that trails the pointer, feeding difference-blended into the page
   so it reads against any color it crosses without per-surface tuning; it
   grows and tints on anything actionable, and shrinks on press. Position,
   scale and press state all animate through one `transform`, never width
   or height, so resizing never costs a layout pass — deliberate given some
   hoverable rows on this page span the whole column, where a ring sized to
   match the element's own box would swallow the viewport. Only on devices
   with a real mouse and no reduced-motion preference; everywhere else this
   file no-ops and the OS cursor is used.
   ========================================================================== */

(function () {
    'use strict';

    var supportsCursor = window.matchMedia &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!supportsCursor) return;

    document.documentElement.classList.add('has-cursor');

    var cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    var ring = document.createElement('div');
    ring.className = 'cursor__ring';
    var dot = document.createElement('div');
    dot.className = 'cursor__dot';
    cursor.appendChild(ring);
    cursor.appendChild(dot);
    document.body.appendChild(cursor);

    var HOVER_SELECTOR = 'a, button, [role="option"], input, [tabindex]:not([tabindex="-1"])';

    var mouse = { x: -100, y: -100 };
    var ringPos = { x: -100, y: -100 };
    var scale = 1;
    var awake = false, hot = false, down = false;

    function loop() {
        ringPos.x += (mouse.x - ringPos.x) * 0.22;
        ringPos.y += (mouse.y - ringPos.y) * 0.22;

        // Eased toward its target every frame, same as position — a CSS
        // transition can't drive this because the inline transform is
        // already being rewritten every frame for position, so the scale
        // has to ease inside the same loop or the grow would just snap.
        var targetScale = down ? 0.72 : hot ? 1.35 : 1;
        scale += (targetScale - scale) * 0.2;

        ring.style.transform = 'translate3d(' + (ringPos.x - 15) + 'px,' + (ringPos.y - 15) + 'px,0) scale(' + scale + ')';
        dot.style.transform = 'translate3d(' + (mouse.x - 2.5) + 'px,' + (mouse.y - 2.5) + 'px,0)';
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    document.addEventListener('pointermove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if (!awake) { awake = true; cursor.classList.add('is-awake'); }
    });

    document.addEventListener('pointerdown', function () { down = true; cursor.classList.add('is-down'); });
    document.addEventListener('pointerup', function () { down = false; cursor.classList.remove('is-down'); });

    document.addEventListener('pointerover', function (e) {
        var target = e.target.closest && e.target.closest(HOVER_SELECTOR);
        if (!target) return;
        hot = true;
        cursor.classList.add('is-hot');
    });

    document.addEventListener('pointerout', function (e) {
        var target = e.target.closest && e.target.closest(HOVER_SELECTOR);
        if (!target) return;
        var related = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(HOVER_SELECTOR);
        if (related === target) return;
        hot = false;
        cursor.classList.remove('is-hot');
    });

    document.addEventListener('mouseleave', function () {
        awake = false;
        cursor.classList.remove('is-awake');
    });
})();
