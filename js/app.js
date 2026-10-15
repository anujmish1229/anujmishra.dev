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
        c.body.appendChild(el('p', 'head__bio', 'Math + Business at Waterloo and Laurier. I build websites and robots. Open to internships and collaborations.'));
        var links = el('p', 'head__links');
        links.appendChild(link(SITE.email, 'mailto:' + SITE.email));
        links.appendChild(link('GitHub', SITE.github));
        links.appendChild(link('LinkedIn', SITE.linkedin));
        var resume = el('span', 'head__soon', 'resume soon');
        resume.title = 'not committed yet';
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

        var row = el(expandable ? 'button' : 'div', 'commit__row');
        var top = el('span', 'commit__top');
        top.appendChild(el('span', 'commit__msg', commit.title));
        if (commit.date) top.appendChild(el('span', 'commit__date', commit.date));
        row.appendChild(top);
        if (commit.summary) row.appendChild(el('span', 'commit__summary', commit.summary));
        c.body.appendChild(row);

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
        var ref = REFS[key];
        if (!ref) return;
        logList.innerHTML = '';
        logList.appendChild(renderHead());
        ref.commits.forEach(function (c) { logList.appendChild(renderCommit(c)); });
        tabs.forEach(function (t) {
            if (t.getAttribute('data-ref') === key) t.setAttribute('aria-current', 'page');
            else t.removeAttribute('aria-current');
        });
    }
    window.checkoutRef = renderRef;

    tabs.forEach(function (t) {
        t.addEventListener('click', function () { renderRef(t.getAttribute('data-ref')); });
    });

    document.querySelectorAll('[data-cmdk-checkout]').forEach(function (node) {
        node.addEventListener('click', function (e) {
            e.preventDefault();
            renderRef(node.getAttribute('data-cmdk-checkout'));
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

    renderRef('projects');
})();
