(function () {
    'use strict';

    var state = { ref: 'main' };
    var logList = document.getElementById('log-list');
    var refName = document.getElementById('ref-name');
    var refTrigger = document.getElementById('ref-trigger');
    var refListEl = document.getElementById('ref-list');

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function renderDiffLine(line) {
        var row = el('span', 'diff__line diff__line--' + line.kind);
        var marker = el('span', 'diff__marker', line.kind === 'add' ? '+' : line.kind === 'untracked' ? '?' : ' ');
        row.appendChild(marker);
        if (line.href) {
            var a = el('a', 'diff__text diff__link', line.text);
            a.href = line.href;
            if (/^https?:/.test(line.href)) { a.target = '_blank'; a.rel = 'noopener'; }
            row.appendChild(a);
        } else if (line.kind === 'untracked') {
            var span = el('span', 'diff__text', line.text);
            span.setAttribute('aria-disabled', 'true');
            span.title = 'not committed yet';
            row.appendChild(span);
        } else {
            row.appendChild(el('span', 'diff__text', line.text));
        }
        return row;
    }

    function renderCommit(commit) {
        var li = el('li', 'commit' + (commit.head ? ' commit--head' : commit.merge ? ' commit--merge' : ''));
        li.id = 'commit-' + commit.id;

        var rail = el('div', 'commit__rail');
        rail.setAttribute('aria-hidden', 'true');
        rail.appendChild(el('span', 'commit__dot'));
        li.appendChild(rail);

        var body = el('div', 'commit__body');

        var row = el('button', 'commit__row');
        row.type = 'button';
        row.setAttribute('aria-expanded', 'false');
        row.setAttribute('aria-controls', 'detail-' + commit.id);

        var top = el('span', 'commit__top');
        if (commit.head) top.appendChild(el('span', 'commit__badge', 'HEAD → main'));
        top.appendChild(el('span', 'commit__msg', commit.message));
        row.appendChild(top);

        var meta = el('span', 'commit__meta');
        if (commit.hash) meta.appendChild(el('span', 'commit__hash', commit.hash));
        meta.appendChild(el('span', 'commit__date', commit.date));

        var added = 0, removed = 0;
        (commit.diff || []).forEach(function (l) {
            if (l.kind === 'add') added++;
            else if (l.kind === 'remove') removed++;
        });
        var stat = el('span', 'commit__stat');
        stat.appendChild(el('span', 'commit__stat-add', '+' + added));
        if (removed) stat.appendChild(el('span', 'commit__stat-del', '−' + removed));
        meta.appendChild(stat);

        (commit.tags || []).forEach(function (t) {
            meta.appendChild(el('span', 'commit__tag', t));
        });
        row.appendChild(meta);

        var chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chevron.setAttribute('class', 'commit__chevron');
        chevron.setAttribute('width', '11');
        chevron.setAttribute('height', '11');
        chevron.setAttribute('viewBox', '0 0 10 10');
        chevron.setAttribute('aria-hidden', 'true');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M2 3.5 5 6.5 8 3.5');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '1.4');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        chevron.appendChild(path);
        row.appendChild(chevron);

        body.appendChild(row);

        var detail = el('div', 'commit__detail');
        detail.id = 'detail-' + commit.id;
        detail.hidden = true;
        var pre = el('pre', 'diff');
        commit.diff.forEach(function (line) { pre.appendChild(renderDiffLine(line)); pre.appendChild(document.createTextNode('\n')); });
        detail.appendChild(pre);
        if (commit.note) detail.appendChild(el('p', 'commit__note', commit.note));
        body.appendChild(detail);

        row.addEventListener('click', function () {
            var open = row.getAttribute('aria-expanded') === 'true';
            row.setAttribute('aria-expanded', String(!open));
            detail.hidden = open;
        });

        li.appendChild(body);
        return li;
    }

    function renderRef(key) {
        var ref = REFS[key];
        if (!ref) return;
        state.ref = key;
        refName.textContent = ref.label;
        logList.innerHTML = '';
        ref.commits.forEach(function (c) { logList.appendChild(renderCommit(c)); });
        Array.prototype.forEach.call(refListEl.children, function (li) {
            li.setAttribute('aria-selected', String(li.getAttribute('data-ref') === key));
        });
    }
    window.checkoutRef = renderRef;

    // ref selector
    refTrigger.addEventListener('click', function () {
        var open = refTrigger.getAttribute('aria-expanded') === 'true';
        refTrigger.setAttribute('aria-expanded', String(!open));
        refListEl.hidden = open;
    });
    refListEl.addEventListener('click', function (e) {
        var li = e.target.closest('[data-ref]');
        if (!li) return;
        renderRef(li.getAttribute('data-ref'));
        refTrigger.setAttribute('aria-expanded', 'false');
        refListEl.hidden = true;
        refTrigger.focus();
    });
    document.addEventListener('click', function (e) {
        if (!document.getElementById('ref').contains(e.target)) {
            refTrigger.setAttribute('aria-expanded', 'false');
            refListEl.hidden = true;
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && refTrigger.getAttribute('aria-expanded') === 'true') {
            refTrigger.setAttribute('aria-expanded', 'false');
            refListEl.hidden = true;
            refTrigger.focus();
        }
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

    renderRef('main');
})();
