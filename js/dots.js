/* Interactive dot field behind the page.
   - A sparse grid of dots everywhere, plus 米行远 (Mǐ Xíngyuǎn) as a brush-script
     scroll in the right margin, drawn from images/name.png (a 1-bit mask).
   - Dots part around every line of text: they thin out over a few pixels from the
     letters, with a ragged edge, and ease back in as the text moves.
   - Dots near the cursor light up and lean away from it.
   - Ambient life: dots twinkle; every few seconds ink runs down the name as if it
     were being brushed; and small travellers (行远, "to travel far") wander the grid.
   Wide screens only; a single static frame for prefers-reduced-motion. */
(function () {
  'use strict';

  var MIN_WIDTH = 1000;
  var GAP = 6;            // grid spacing in CSS px
  var DOT = 2;            // dot size in CSS px
  var AMBIENT = 0.07;     // share of grid cells that get an ambient dot
  var CURSOR_R = 110;     // cursor influence radius
  var FPS = 40;
  var FALL = 7;           // px past a text line over which dots come back
  var EASE_MS = 90;       // how quickly the clearing follows the text

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.querySelector('.page');
  if (!page || !window.requestAnimationFrame) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'dots';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0, cols = 0, rows = 0, dpr = 1;
  var dots = null;        // Float32Array: x, y, base, r, g, b, phase, kind
  var count = 0;
  var target = null;      // Float32Array cols*rows: how cleared each cell should be (0 to 1)
  var clear = null;       // the same, eased towards target every frame
  var jit = null;         // fixed per-cell jitter, so the edge of a clearing is ragged
  var textRects = [];     // document coords [x0, y0, x1, y1]
  var mouse = { x: -9999, y: -9999, on: false };
  var box = { x0: 0, y0: 0, w: 0, h: 0, on: false };   // where the name sits
  var ink = -1, nextInk = 1500;                          // start time of the current ink pass
  var INK_MS = 2600, INK_TAIL = 80;
  var travellers = [], nextTraveller = 800, nextStep = 0;
  var STEP_MS = 55, TRAIL = 14, MAX_TRAVELLERS = 3;
  var colors = { fg: [31, 35, 40], accent: [9, 105, 218], dark: false };
  var glyph = null;       // { data, w, h } from images/name.png
  var NAME_SRC = new URL('../images/name.png', (document.currentScript && document.currentScript.src) || location.href).href;
  var running = false, last = 0, raf = 0, prev = 0;

  /* ------------------------------------------------------------ colours */

  function rgb(str) {
    var m = str.match(/\d+(\.\d+)?/g);
    return m ? [+m[0], +m[1], +m[2]] : [128, 128, 128];
  }
  function readColors() {
    var cs = getComputedStyle(document.body);
    colors.fg = rgb(cs.color);
    var bg = rgb(cs.backgroundColor);
    colors.dark = (bg[0] + bg[1] + bg[2]) / 3 < 128;
    colors.accent = colors.dark ? [68, 147, 248] : [9, 105, 218];
  }

  /* --------------------------------------------------------------- name */

  function loadGlyph(done) {
    var img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      var x = c.getContext('2d');
      x.drawImage(img, 0, 0);
      glyph = { data: x.getImageData(0, 0, img.width, img.height).data, w: img.width, h: img.height };
      done();
    };
    img.onerror = done;
    img.src = NAME_SRC;
  }

  // Share of a grid cell (centred on cx, cy inside the w x h name box) that the brush covers.
  // Sampling a 4x4 patch keeps thin strokes solid instead of breaking them into stray dots.
  function covered(cx, cy, w, h) {
    var hits = 0;
    for (var a = 0; a < 4; a++) {
      for (var b = 0; b < 4; b++) {
        var u = Math.floor((cx + (a - 1.5) * GAP / 4) / w * glyph.w);
        var v = Math.floor((cy + (b - 1.5) * GAP / 4) / h * glyph.h);
        if (u >= 0 && v >= 0 && u < glyph.w && v < glyph.h && glyph.data[(v * glyph.w + u) * 4] > 127) hits++;
      }
    }
    return hits >= 4;
  }

  /* --------------------------------------------------------------- grid */

  function build() {
    W = innerWidth; H = innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / GAP) + 1; rows = Math.ceil(H / GAP) + 1;
    target = new Float32Array(cols * rows);
    clear = new Float32Array(cols * rows);
    jit = new Float32Array(cols * rows);
    for (var c = 0; c < jit.length; c++) jit[c] = hash(c % cols, Math.floor(c / cols), 3);
    travellers = [];                                   // grid changed; old paths no longer apply

    // Name scroll: vertical, in the right margin, clear of the 620px text column.
    var gx0 = 0, gy0 = 0, gw = 0, gh = 0, showGlyph = false;
    if (glyph) {
      var room = W / 2 - 380;                       // free width right of the column
      gh = Math.min(H * 0.86, room * 0.92 * glyph.h / glyph.w);
      gw = gh * glyph.w / glyph.h;
      gx0 = W / 2 + 360 + Math.max(0, (room - gw) / 2);
      gy0 = (H - gh) / 2;
      showGlyph = gw >= 90;
    }
    box = { x0: gx0, y0: gy0, w: gw, h: gh, on: showGlyph };

    var list = [];
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var x = i * GAP, y = j * GAP;
        if (showGlyph && x >= gx0 && x < gx0 + gw && y >= gy0 && y < gy0 + gh) {
          if (covered(x - gx0, y - gy0, gw, gh)) {        // on/off: every dot the same size
            list.push(x, y, 0.7, -1, 0, 0, hash(i, j, 2) * 6.28, 1);
            continue;
          }
        }
        // Seeded per cell, so rebuilding the field never re-rolls the pattern.
        if (hash(i, j, 1) < AMBIENT) list.push(x, y, 0.22, -1, 0, 0, hash(i, j, 2) * 6.28, 0);
      }
    }
    dots = new Float32Array(list);
    count = list.length / 8;
  }

  // Stable pseudo-random number in [0, 1) for a grid cell.
  function hash(i, j, k) {
    var h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263) ^ Math.imul(k, 2147483647);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  /* ----------------------------------------------------- text knockouts */

  function measureText() {
    textRects = [];
    var sx = scrollX, sy = scrollY, PAD_X = 0, PAD_Y = 0;
    function add(r) {
      if (r.width < 1 || r.height < 1) return;
      textRects.push(r.left + sx - PAD_X, r.top + sy - PAD_Y, r.right + sx + PAD_X, r.bottom + sy + PAD_Y);
    }
    var walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
    });
    var range = document.createRange(), n;
    while ((n = walker.nextNode())) {
      range.selectNodeContents(n);
      var rs = range.getClientRects();
      for (var i = 0; i < rs.length; i++) add(rs[i]);
    }
    [].forEach.call(page.querySelectorAll('.badge, .stack__bar, img, .live, .lang, .years__row, .foot, .lens'), function (el) {
      // The photo viewer clears exactly its own card: its blurred backdrop is
      // scaled past the edges and off-screen thumbnails sit outside it.
      if (el.tagName === 'IMG' && el.closest('.lens')) return;
      if (el.offsetParent !== null) add(el.getBoundingClientRect());
    });
    fillMask();
  }

  // The clearing map: 1 on a text line, falling to 0 over FALL px past it.
  function fillMask() {
    if (!target) return;
    target.fill(0);
    var sx = scrollX, sy = scrollY;
    for (var k = 0; k < textRects.length; k += 4) {
      var l = textRects[k] - sx, t = textRects[k + 1] - sy, r = textRects[k + 2] - sx, b = textRects[k + 3] - sy;
      if (b < -FALL || t > H + FALL) continue;
      var i0 = Math.max(0, Math.floor((l - FALL) / GAP)), i1 = Math.min(cols - 1, Math.ceil((r + FALL) / GAP));
      var j0 = Math.max(0, Math.floor((t - FALL) / GAP)), j1 = Math.min(rows - 1, Math.ceil((b + FALL) / GAP));
      for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) {
        var x = i * GAP, y = j * GAP;
        var dx = Math.max(l - x, 0, x - r), dy = Math.max(t - y, 0, y - b), dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= FALL) continue;
        var f = 1 - dist / FALL, v = f * f * (3 - 2 * f), c = j * cols + i;
        if (v > target[c]) target[c] = v;
      }
    }
    if (reduce || !running) clear.set(target);
  }

  // Ease the clearing towards the map, so dots part and close up smoothly.
  function ease(dt) {
    var k = 1 - Math.exp(-dt / EASE_MS);
    for (var c = 0; c < clear.length; c++) {
      var d = target[c] - clear[c];
      clear[c] = d > 0.01 || d < -0.01 ? clear[c] + d * k : target[c];
    }
  }

  // A dot gives way once the clearing passes its own threshold, so the edge is
  // ragged and a few strays hang on just outside the letters.
  function gone(c) { return clear[c] > 0.35 + 0.6 * jit[c]; }

  /* --------------------------------------------------------------- draw */

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var fg = colors.fg, ac = colors.accent;
    var mx = mouse.on ? mouse.x : -9999, my = mouse.on ? mouse.y : -9999;
    var R2 = CURSOR_R * CURSOR_R;

    // Ink pass: a glowing band runs down the name, top to bottom.
    var front = ink >= 0 ? box.y0 - 20 + (t - ink) / INK_MS * (box.h + INK_TAIL + 40) : -1e9;

    for (var d = 0; d < count; d++) {
      var o = d * 8, x = dots[o], y = dots[o + 1];
      var cell = Math.round(y / GAP) * cols + Math.round(x / GAP);
      if (gone(cell)) continue;

      var a = dots[o + 2] * (1 - 0.7 * clear[cell]), kind = dots[o + 7];
      if (!reduce) a *= 0.7 + 0.3 * Math.sin(t * (kind ? 0.0012 : 0.002) + dots[o + 6]);

      var boost = 0, ox = 0, oy = 0;
      if (!reduce) {
        if (kind === 1) {
          var behind = front - y;                      // dots the ink has just passed glow, then settle
          if (behind >= 0 && behind < INK_TAIL) boost += (1 - behind / INK_TAIL) * 0.95;
        }
        var cx = x - mx, cy = y - my, c2 = cx * cx + cy * cy;
        if (c2 < R2) {
          var cd = Math.sqrt(c2), f = 1 - cd / CURSOR_R;
          boost += f * 1.1;
          if (cd > 0.1) { ox = cx / cd * f * 7; oy = cy / cd * f * 7; }
        }
      }

      var r, g, b;
      if (dots[o + 3] < 0) { r = fg[0]; g = fg[1]; b = fg[2]; } else { r = dots[o + 3]; g = dots[o + 4]; b = dots[o + 5]; }
      if (boost > 0.05) {
        var m = Math.min(1, boost);
        r += (ac[0] - r) * m; g += (ac[1] - g) * m; b += (ac[2] - b) * m;
      }
      a = Math.min(1, a + boost * 0.8);
      if (a < 0.03) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';
      ctx.fillRect(x + ox - DOT / 2, y + oy - DOT / 2, DOT, DOT);
    }
    drawTravellers();
    ctx.globalAlpha = 1;
  }

  /* --------------------------------------------------------- travellers */
  /* A lit dot that sets off from an edge and wanders the grid one cell at a
     time, mostly straight with the odd turn, trailing a fading tail.
     Same dot size as everything else; hidden wherever text sits. */

  function spawnTraveller() {
    var side = Math.floor(Math.random() * 4), i, j, di = 0, dj = 0;
    if (side === 0) { i = 0; j = Math.floor(Math.random() * rows); di = 1; }
    else if (side === 1) { i = cols - 1; j = Math.floor(Math.random() * rows); di = -1; }
    else if (side === 2) { j = 0; i = Math.floor(Math.random() * cols); dj = 1; }
    else { j = rows - 1; i = Math.floor(Math.random() * cols); dj = -1; }
    travellers.push({ i: i, j: j, di: di, dj: dj, trail: [], life: 160 + Math.floor(Math.random() * 120) });
  }

  function stepTravellers() {
    for (var n = travellers.length - 1; n >= 0; n--) {
      var tr = travellers[n];
      if (tr.life > 0) {
        tr.trail.unshift(tr.j * cols + tr.i);
        if (Math.random() < 0.07) {                // turn left or right
          var turn = Math.random() < 0.5 ? 1 : -1, di = tr.di;
          tr.di = -tr.dj * turn; tr.dj = di * turn;
        }
        tr.i += tr.di; tr.j += tr.dj; tr.life--;
        if (tr.i < 0 || tr.j < 0 || tr.i >= cols || tr.j >= rows) tr.life = 0;
      }
      if (tr.trail.length > TRAIL || (tr.life <= 0 && tr.trail.length)) tr.trail.pop();
      if (tr.life <= 0 && !tr.trail.length) travellers.splice(n, 1);
    }
  }

  function drawTravellers() {
    var ac = colors.accent;
    ctx.fillStyle = 'rgb(' + ac[0] + ',' + ac[1] + ',' + ac[2] + ')';
    for (var n = 0; n < travellers.length; n++) {
      var trail = travellers[n].trail;
      for (var k = 0; k < trail.length; k++) {
        var cell = trail[k];
        if (gone(cell)) continue;
        ctx.globalAlpha = (1 - k / TRAIL) * 0.95;
        var x = (cell % cols) * GAP, y = Math.floor(cell / cols) * GAP;
        ctx.fillRect(x - DOT / 2, y - DOT / 2, DOT, DOT);
      }
    }
  }

  function frame(t) {
    raf = 0;
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (t - last < 1000 / FPS) return;
    last = t;
    if (box.on && t > nextInk) { ink = t; nextInk = t + INK_MS + 7000 + Math.random() * 3000; }
    if (t > nextTraveller) {
      if (travellers.length < MAX_TRAVELLERS) spawnTraveller();
      nextTraveller = t + 2500 + Math.random() * 3500;
    }
    if (t > nextStep) { stepTravellers(); nextStep = t + STEP_MS; }
    ease(t - (prev || t)); prev = t;
    draw(t);
  }

  /* -------------------------------------------------------------- state */

  function active() { return innerWidth >= MIN_WIDTH && !document.hidden; }

  function start() {
    var on = active();
    canvas.style.display = innerWidth >= MIN_WIDTH ? '' : 'none';
    if (!on) { running = false; return; }
    if (reduce) { draw(0); return; }
    if (!running) { running = true; last = 0; if (!raf) raf = requestAnimationFrame(frame); }
  }

  function relayout() {
    if (innerWidth < MIN_WIDTH) { start(); return; }
    readColors(); build(); measureText(); start();
    if (reduce) draw(0);
  }

  var pending = 0;
  function soon() { clearTimeout(pending); pending = setTimeout(relayout, 120); }

  addEventListener('resize', soon);
  addEventListener('scroll', function () { fillMask(); if (reduce) draw(0); }, { passive: true });
  addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = e.pointerType !== 'touch'; }, { passive: true });
  document.addEventListener('pointerleave', function () { mouse.on = false; });
  document.addEventListener('visibilitychange', start);

  // Content that moves the text (Spotify filling in, year tabs, captions)
  // only re-measures the knockouts; the dots themselves stay put.
  var pendingText = 0;
  function soonText() { clearTimeout(pendingText); pendingText = setTimeout(function () { if (innerWidth >= MIN_WIDTH) { measureText(); if (reduce) draw(0); } }, 120); }
  new MutationObserver(soonText).observe(page, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(soon).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', soon);
  }

  loadGlyph(function () {
    relayout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
  });
})();
