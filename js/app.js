(function () {
    'use strict';

    var logList = document.getElementById('log-list');
    var tabs = document.querySelectorAll('[data-ref]');

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function link(text, href, className) {
        var a = el('a', className, text);
        a.href = href;
        if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
        return a;
    }

    function shell(modifier) {
        var li = el('li', 'commit' + (modifier ? ' commit--' + modifier : ''));
        var rail = el('div', 'commit__rail');
        rail.setAttribute('aria-hidden', 'true');
        rail.appendChild(el('span', 'commit__dot'));
        li.appendChild(rail);
        var body = el('div', 'commit__body');
        li.appendChild(body);
        return { li: li, body: body };
    }

    // HEAD: who this is and how to reach him, on top of every ref.
    function renderHead() {
        var c = shell('head');
        c.body.appendChild(el('h1', 'head__name', 'Anuj Mishra'));
        c.body.appendChild(el('p', 'head__bio', 'Math + Business at Waterloo and Laurier. I work across full-stack web, machine learning, and robotics, and I’m most interested in where software meets business. Open to internships and collaborations.'));
        var links = el('p', 'head__links');
        links.appendChild(link(SITE.email, 'mailto:' + SITE.email));
        links.appendChild(link('GitHub', SITE.github));
        links.appendChild(link('LinkedIn', SITE.linkedin));
        var resume = link('Resume', SITE.resume);
        resume.target = '_blank';
        links.appendChild(resume);
        c.body.appendChild(links);
        return c.li;
    }

    function renderLines(lines) {
        var pre = el('pre', 'diff');
        lines.forEach(function (line) {
            var row = el('span', 'diff__line');
            row.appendChild(el('span', 'diff__marker', '+'));
            if (typeof line === 'string') row.appendChild(el('span', 'diff__text', line));
            else row.appendChild(link(line.text, line.href, 'diff__text diff__link'));
            if (line.note) row.appendChild(el('span', 'diff__text', ' — ' + line.note));
            pre.appendChild(row);
        });
        return pre;
    }

    function renderCommit(commit) {
        var c = shell(commit.merge ? 'merge' : '');
        var expandable = commit.lines && !commit.open;

        var row = el(expandable ? 'button' : commit.goto ? 'a' : 'div', 'commit__row');
        var top = el('span', 'commit__top');
        top.appendChild(el('span', 'commit__msg', commit.title));
        if (commit.date) top.appendChild(el('span', 'commit__date', commit.date));
        row.appendChild(top);
        if (commit.summary) row.appendChild(el('span', 'commit__summary', commit.summary));
        c.body.appendChild(row);

        if (commit.goto) {
            row.href = '#' + commit.goto;
            row.classList.add('commit__row--link');
            row.insertAdjacentHTML('beforeend', '<svg class="commit__chevron commit__chevron--go" width="11" height="11" viewBox="0 0 10 10" aria-hidden="true"><path d="M3.5 2 6.5 5 3.5 8" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>');
            row.addEventListener('click', function (e) { e.preventDefault(); go(commit.goto); });
        }

        if (!commit.lines) return c.li;

        var detail = el('div', 'commit__detail');
        detail.appendChild(renderLines(commit.lines));
        c.body.appendChild(detail);
        if (!expandable) return c.li;

        detail.id = 'detail-' + commit.id;
        detail.hidden = true;
        row.type = 'button';
        row.setAttribute('aria-expanded', 'false');
        row.setAttribute('aria-controls', detail.id);
        row.insertAdjacentHTML('beforeend', '<svg class="commit__chevron" width="11" height="11" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>');
        row.addEventListener('click', function () {
            var open = row.getAttribute('aria-expanded') === 'true';
            row.setAttribute('aria-expanded', String(!open));
            detail.hidden = open;
        });
        return c.li;
    }

    function renderRef(key) {
        var ref = REFS[key] ? key : 'home';
        logList.innerHTML = '';
        logList.appendChild(renderHead());
        REFS[ref].commits.forEach(function (c) { logList.appendChild(renderCommit(c)); });
        tabs.forEach(function (t) {
            if (t.getAttribute('data-ref') === ref) t.setAttribute('aria-current', 'page');
            else t.removeAttribute('aria-current');
        });
    }

    // Each ref gets its own URL (#projects, …; home is the bare path) so
    // back/forward and shared links work.
    function go(key) {
        var url = key === 'home' ? location.pathname : '#' + key;
        if (url !== location.pathname + location.hash) history.pushState(null, '', url);
        renderRef(key);
        window.scrollTo(0, 0);
    }
    window.checkoutRef = go;

    function fromUrl() { renderRef(location.hash.slice(1) || 'home'); }
    window.addEventListener('popstate', fromUrl);

    tabs.forEach(function (t) {
        t.addEventListener('click', function () { go(t.getAttribute('data-ref')); });
    });

    document.querySelectorAll('[data-cmdk-checkout]').forEach(function (node) {
        node.addEventListener('click', function (e) {
            e.preventDefault();
            go(node.getAttribute('data-cmdk-checkout'));
        });
    });

    // boot sequence — skip on any interaction
    var boot = document.getElementById('boot');
    function skipBoot() {
        if (!boot) return;
        boot.style.transition = 'opacity .15s ease';
        boot.style.opacity = '0';
        boot.style.pointerEvents = 'none';
        setTimeout(function () { boot.style.display = 'none'; }, 160);
    }
    if (boot) {
        boot.addEventListener('click', skipBoot);
        document.addEventListener('keydown', skipBoot, { once: true });
    }

    fromUrl();
})();
