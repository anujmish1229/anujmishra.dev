# anujmishra.dev

Personal portfolio of Anuj Mishra (Math + Business at the University of Waterloo and Wilfrid Laurier University), presented as an interactive git commit log.

**Live:** [anujmishra.dev](https://anujmishra.dev)

![Screenshot of anujmishra.dev](images/og.png)

## Who it's for

Recruiters, hackathon organizers and collaborators who want a quick view of my projects, experience, awards and contact details.

## My role

Designed and built from scratch: concept, visual design, vanilla JS rendering, a command palette, accessibility work, and deployment.

## Features

- **Commit-log layout:** projects, experience, awards and education render as "commits" on a branch rail, with expandable diffs for details
- **Command palette** (<kbd>⌘K</kbd> / <kbd>Ctrl K</kbd>) to jump between sections, open links or copy my email
- **One-time boot animation**, skipped for `prefers-reduced-motion` and on repeat visits in a session
- **Accessible:** Lighthouse 100 for accessibility, performance, best practices and SEO, with keyboard navigation, ARIA states and a `<noscript>` fallback
- Self-hosted variable fonts, with no frameworks and no third-party scripts

## Tech stack

Plain HTML, CSS and JavaScript, with no build step and no dependencies. Fonts are Archivo and JetBrains Mono (self-hosted WOFF2). CI is a GitHub Actions link check ([lychee](https://github.com/lycheeverse/lychee)).

## Architecture

```
index.html        Shell: meta/OG tags, header, empty <ol id="log-list">, command palette <dialog>
js/data.js        All site content: SITE (contact links) and REFS (sections → commits)
js/app.js         Renders the current ref (projects / experience / about) into the log
js/cmdk.js        Command palette: fuzzy filtering, keyboard navigation, actions
js/cursor.js      Custom trailing cursor ring
css/style.css     Layout, theme, commit-log styles
css/cmdk.css      Command palette styles
fonts/  images/   Self-hosted assets (og.png is the social preview)
resume.pdf        Linked from the header
```

To update content, edit `js/data.js`. Each commit is `{ title, summary?, date?, lines? }`, and lines can be strings or `{ text, href, note }`.

## Local setup

```sh
git clone https://github.com/anujmish1229/anujmishra.dev.git
cd anujmishra.dev
npx serve        # or open index.html directly
```

## Environment variables

None.
