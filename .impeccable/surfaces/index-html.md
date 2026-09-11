---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

## Scope & Mode
Whole-site ground-up redesign. Mode: Experience — the visitor's success is encountering the artifact itself as proof of craft, with fast secondary paths to contact/resume folded in.

## Audience & Job
Recruiters/hiring managers (primary), general network (secondary), collaborators/clients (tertiary), in that priority — see PRODUCT.md Users. Job: form an impression of Anuj's craft and reach him, fast.

## Action / Task
Scan the commit log, expand one or two diffs as proof of real work, then act: open a project link, copy or send email, open GitHub/LinkedIn, or grab the resume — all reachable through the kept ⌘K command palette.

## Proof / Content
Full portfolio scope: projects, experience/education, and skills sections all need real content (titles, dates, descriptions, links) from the user — none exists yet (see PRODUCT.md Evidence on Hand). GitHub/LinkedIn links are placeholders and resume.pdf does not exist. Do not fabricate any of this; author structure and copy shell, wait on real facts before shipping those regions.

## Constraints
Plain static HTML/CSS/JS, no framework, no build step (PRODUCT.md Capabilities and Constraints). The ⌘K command palette is a kept core interaction — rewrite its implementation to match the new world rather than porting the old one. The panda mark stays as the logo. The VS Code editor-chrome identity is retired by this redesign — user confirmed it is not locked in. Code-led build: no comp is produced; ambition lives in this contract and is audited at the finish review.

## Direction contract

THESIS: The site is Anuj's own version-control history made visible — every project a commit, every skill a diff, every role a branch merged into main — refusing the templated hero-plus-project-grid arrangement every dev portfolio ships.

OWN-WORLD: Near-black graphite ground (#0b0e11), soft off-white ink (#e6e8eb), a single commit-green (#39d353) marking growth and shipped work, one warm amber (#ffb86b) marking the HEAD/active ref only — never decorative. Monospace ledger type for metadata (hashes, dates, refs); a plain humanist sans for prose. Every entry is a commit row: short hash, ref-colored dot, one-line message, expandable into a diff-styled detail (green `+` lines for what shipped, muted `−` lines for what changed/retired). One ref selector, styled like `git checkout <ref>`, switches the whole page between main / projects / experience / about, redrawing the graph in place rather than navigating to a new page.

STORY: A recruiter or collaborator understands within seconds this is a real commit history, not a decorative metaphor — they scan HEAD, see the newest project as the newest commit, expand one or two diffs for proof, and reach contact, resume, or GitHub through the same log. They leave believing Anuj thinks and builds like a systems person, and act immediately via the ⌘K palette (kept, rewritten) or the log's own links.

FIRST VIEWPORT: Full-height near-black graphite ground. Top-left: panda mark + name, rebuilt in the new world's chrome (no VS Code menu bar). Top-center: a slim ref selector reading `main` with a caret — the single primary control. Directly below, the commit log begins immediately: an amber HEAD pointer beside the newest commit (Anuj's current headline/status framed as the latest commit message), with hash, relative timestamp, and a one-line diff stat (+/−) at ledger scale. The log scrolls down through prior commits (contact links, then earlier entries). No hero image, no centered giant name — the log is the hero, and the primary action (contact/resume via ⌘K) is reachable from the first commit row without scrolling.

FORM: Git commit graph / diff narrative — assigned index 3 of the ordered grounded list, seed key b3c13555.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved decisions
- Real project entries (title, one-line description, tech, link, dates) — pending from user.
- Real experience/education entries (role/program, dates, one line) — pending from user.
- Real skills list — pending from user.
- Real GitHub username/URL and LinkedIn URL — currently placeholder root URLs.
- Real resume.pdf — does not exist in the repo yet.
