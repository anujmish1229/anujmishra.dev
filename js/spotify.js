/* Spotify, filled from /api/spotify (a Netlify Function).
   - [data-spotify]: a "Listening to / Last listened to" line
   - [data-spotify-repeat]: an "on repeat this month" track list (optional)
   Everything stays hidden if the function is unavailable, e.g. on a plain
   local server, so the page never shows a broken state. */
(function () {
  'use strict';

  var line = document.querySelector('[data-spotify]');
  var repeat = document.querySelector('[data-spotify-repeat]');
  if ((!line && !repeat) || !window.fetch) return;

  function ago(iso) {
    var mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (!(mins >= 0)) return '';
    if (mins < 60) return mins <= 1 ? 'just now' : mins + ' min ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + (hrs === 1 ? ' hour ago' : ' hours ago');
    var days = Math.round(hrs / 24);
    return days + (days === 1 ? ' day ago' : ' days ago');
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function art(src, size) {
    var img = el('img');
    img.src = src; img.alt = ''; img.width = size; img.height = size; img.loading = 'lazy';
    return img;
  }

  function link(url, cls) {
    var a = el(url ? 'a' : 'span', cls);
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }

  function show(sel) {
    var n = document.querySelector(sel);
    if (n) n.hidden = false;
  }

  function renderLine(d) {
    if (!line || (d.status !== 'playing' && d.status !== 'recent') || !d.track) return;
    var t = d.track;
    line.textContent = '';
    line.appendChild(document.createTextNode(d.status === 'playing' ? 'Listening to ' : 'Last listened to '));
    var badge = link(t.url, 'badge');
    if (t.image) badge.appendChild(art(t.image, 16));
    badge.appendChild(document.createTextNode(t.name));
    line.appendChild(badge);
    if (t.artists && t.artists.length) line.appendChild(document.createTextNode(' by ' + t.artists.join(', ')));
    if (d.status === 'playing') {
      var live = el('span', 'live');
      live.setAttribute('aria-hidden', 'true');
      line.appendChild(live);
    } else if (d.playedAt) {
      line.appendChild(document.createTextNode(' '));
      line.appendChild(el('span', 'when', ago(d.playedAt)));
    }
    line.hidden = false;
    show('[data-spotify-section]');
  }

  function renderRepeat(d) {
    if (!repeat || !d.onRepeat || !d.onRepeat.length) return;
    d.onRepeat.forEach(function (t) {
      var li = el('li');
      if (t.image) li.appendChild(art(t.image, 36));
      var text = el('span');
      var name = link(t.url, 't-name');
      name.textContent = t.name;
      text.appendChild(name);
      text.appendChild(el('span', 't-artist', (t.artists || []).join(', ')));
      li.appendChild(text);
      repeat.appendChild(li);
    });
    show('[data-spotify-repeat-title]');
    show('[data-spotify-section]');
  }

  fetch('/api/spotify', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d) return;
      renderLine(d);
      renderRepeat(d);
    })
    .catch(function () { /* stay hidden */ });
})();
