---
name: anujmishra.dev
description: A personal portfolio rendered as a real git commit log — every project a commit, every role a merge, every skill a diff.
colors:
  bg: "#0b0e11"
  bg-sunk: "#07090b"
  surface: "#12161c"
  surface-2: "#181d24"
  ink: "#e6e8eb"
  ink-2: "rgba(230, 232, 235, 0.82)"
  ink-3: "rgba(230, 232, 235, 0.6)"
  ink-4: "rgba(230, 232, 235, 0.58)"
  line: "rgba(230, 232, 235, 0.09)"
  line-2: "rgba(230, 232, 235, 0.18)"
  accent-head: "#f4858c"
  accent-head-hi: "#ffb3b8"
  accent-head-wash: "rgba(244, 133, 140, 0.14)"
  commit-green: "#3fb950"
  commit-green-wash: "rgba(63, 185, 80, 0.12)"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.08em"
  ledger-micro:
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
rounded:
  sm: "6px"
  lg: "12px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"
  xxxl: "44px"
components:
  commit-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.sm}"
    padding: "0.55rem 1.9rem 0.5rem 12px"
  commit-row-hover:
    backgroundColor: "{colors.surface}"
  ref-trigger:
    backgroundColor: "transparent"
    textColor: "{colors.accent-head}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  ref-trigger-hover:
    backgroundColor: "{colors.surface}"
  cmdk-dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    width: "min(560px, calc(100vw - 2rem))"
  cmdk-option-selected:
    backgroundColor: "{colors.accent-head-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.6rem 0.7rem"
  find-button:
    backgroundColor: "{colors.bg-sunk}"
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
---

# Design System: anujmishra.dev

## Overview

**Creative North Star: "Git History as Career"**

The site is Anuj's career rendered as a real, browsable commit log rather than a decorative metaphor: every project is a commit, every role is a merged branch, every skill surfaces as a diff line. One committed world — a near-black graphite ground read the way a repo is read, in a browser tab at a desk — with no light theme to hedge against it. The single ref selector (`main` / `experience` / `about`) is the entire navigation model: it redraws the same log in place rather than routing to new pages, so the whole site behaves like `git checkout <ref>`.

The system is monospace-ledger-first for anything that carries a fact (hashes, dates, refs, diff stats, command labels) and humanist-sans for anything that carries a claim (commit messages, prose, notes). Depth is conveyed by graphite tonal layering, not shadows, except for two floating overlays — the ref dropdown and the ⌘K dialog — which are the only elements allowed real elevation because they visually detach from the log's flow. The pink accent (`#f4858c`) is a pinned carry-over from the prior VS Code-titlebar design, repurposed here to mark the HEAD/active ref exclusively — it never decorates.

**Key Characteristics:**
- Dark-only, single committed world — no theme toggle.
- Ledger monospace for metadata, humanist sans for messages and prose.
- A single warm-pink accent, reserved for HEAD/active state only.
- Flat, tonally-layered surfaces; shadows appear only on the two floating overlays (ref list, ⌘K dialog).
- The commit log is the entire page; there is no hero image or centered name.

## Colors

A near-black graphite ground with a two-color signal system: green for shipped/growth, pink for HEAD/active — nothing else carries color.

### Primary
- **HEAD Pink** (`#f4858c`, hi state `#ffb3b8`): marks the HEAD commit dot, the active ref name in the selector, focus outlines, diff `−` (removed/retired) lines, links inside diffs, and the ⌘K prompt glyph/selected-row wash. Never used decoratively — its presence always means "this is the active/current one."

### Secondary
- **Commit Green** (`#3fb950`): marks ordinary (non-HEAD) commit dots and diff `+` (shipped) lines — the "this shipped" signal.

### Neutral
- **Graphite Ground** (`#0b0e11`): page background.
- **Sunk Graphite** (`#07090b`): recessed surfaces — the boot screen, the diff block background, the `find` button, the ⌘K footer strip.
- **Surface** (`#12161c`): raised/hover surface — hovered commit rows, the ⌘K dialog body, the ref dropdown panel.
- **Surface 2** (`#181d24`): a step further raised — hovered list items inside the ref dropdown, unselected commit tags.
- **Ink** (`#e6e8eb`): primary text.
- **Ink 82%** (`rgba(230,232,235,.82)`): secondary text — diff `+` line text.
- **Ink 60%** (`rgba(230,232,235,.6)`): tertiary text — hashes, notes, boot-sequence lines.
- **Ink 58%** (`rgba(230,232,235,.58)`): the quietest text tier — diff metadata, disabled-feeling labels (e.g. "untracked" resume line), scrollbar-thumb hover, chevron icons. Tuned during the finish-review fix round specifically to clear contrast against the graphite ground; treat this value, not a lighter placeholder, as canonical.
- **Line / Line 2** (`rgba(230,232,235,.09)` / `.18`): hairline dividers and control borders at two opacities — `.09` for structural rules (top bar bottom border, diff block border), `.18` for interactive-control borders (ref trigger, find button, ⌘K kbd chips).

### Named Rules
**The Two-Signal Rule.** Only two hues carry meaning on this site: green for shipped/ordinary, pink for HEAD/active. No third accent is introduced for any future section — a new state reuses one of these two rather than inventing a color.

**The Accent-Is-State Rule.** Pink is never decorative. Every pixel of `#f4858c` on the page corresponds to "this is the currently active thing" (HEAD dot, active ref, focused control, an actively-open diff's removed lines). If a future element needs pink and isn't marking active state, that's a misuse.

## Typography

**Display/Body Font:** Archivo (variable, 400–800, with a true italic cut), falling back to `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`.
**Label/Mono Font:** JetBrains Mono (variable, 400–700, with a true italic cut), falling back to `ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace`.

**Character:** A plain, unfussy humanist sans carries every human claim (commit messages, prose, notes); a ledger monospace carries every machine-legible fact (hashes, refs, dates, diff stats, command labels). The pairing is functional, not stylistic — the split itself is the design language, mirroring how a real terminal separates a commit subject line from its metadata.

### Hierarchy
- **Headline** (Archivo 500, 17px / `--step-1`, line-height 1.5): the HEAD commit's message only — the one row given a size bump over ordinary commits.
- **Body** (Archivo 500, 15px / `--step-0`, line-height 1.5): ordinary commit messages, the page's base text size.
- **Label** (JetBrains Mono 400, 13px / `--step--1`, letter-spacing 0.08em where uppercase, e.g. `.cmdk__group`): ref names, commit hashes, badges, ⌘K input and prompt, the `find` control.
- **Ledger-micro** (JetBrains Mono 400, 12px / `--step--2`, line-height 1.75 in diff blocks): diff stat counts, diff body lines, EOF marker, ref dropdown descriptions, ⌘K meta/footer hints — the smallest, densest tier, reserved for data a user references rather than reads.

### Named Rules
**The Ledger/Prose Split Rule.** If a piece of text is a fact about a commit (hash, timestamp, ref, stat count), it renders in JetBrains Mono. If it's a claim a human wrote (a commit message, a note, a prose sentence), it renders in Archivo. Never mix the two roles onto the same string.

## Layout

The log is a single centered column, `max-width: 46rem`, with generous top/bottom padding (`--sp-7` / `--sp-8`) and no secondary sidebar or grid — the commit log is the whole page. Each commit is a two-column grid: a fixed `--rail-w` (26px, 18px at ≤640px) gutter carrying the graph rail and dot, then a flexible body column. The rail is a single continuous vertical line (`1px`, `--color-line-2`) running through all dot centers, giving the visual sense of one branch history rather than a disconnected list.

The top bar is `52px`, sticky, with a translucent blurred graphite background (`color-mix` at 88% opacity + `backdrop-filter: blur(8px)`) so the log content is legible scrolling underneath it. Three bar regions: identity (panda mark + `user/repo` path, flexible), the ref selector (fixed width, centered), and the `find` control (flexible up to 220px, collapses to icon-only under 640px).

Spacing follows an 8px-rooted scale: 8 / 12 / 16 / 20 / 24 / 32 / 44px (`--sp-2` through `--sp-8`). Below 640px the rail narrows, the bar's gaps and padding compress one step, and the ref dropdown re-anchors to the right edge instead of centering under its trigger.

## Elevation & Depth

Flat by default, layered by tone: the log, top bar, and commit rows carry no shadow at rest — depth reads through three graphite lightness steps (sunk → base → surface → surface-2) rather than drop shadows. Shadows are reserved for the two elements that visually float above the log's flow: the ref dropdown list and the ⌘K dialog, both of which detach from the page and need a literal floating cue.

### Shadow Vocabulary
- **Popover float** (`box-shadow: 0 16px 40px rgba(0,0,0,.45)`): the ref selector's open dropdown list.
- **Dialog float** (`box-shadow: 0 24px 80px rgba(0,0,0,.55), 0 0 0 1px var(--color-line)`): the ⌘K command dialog.
- **Toast float** (`box-shadow: 0 12px 32px rgba(0,0,0,.45)`): the bottom-anchored copy-confirmation toast.
- **HEAD halo** (`box-shadow: 0 0 0 4px var(--color-bg), 0 0 0 6px var(--color-accent-wash)`): a soft double-ring around the HEAD commit dot only — the one "elevation" applied to inline content rather than an overlay, used to make HEAD read as active without adding a badge.

### Named Rules
**The Overlay-Only Shadow Rule.** Shadows exist only on things that detach from the page's normal flow (dropdown, dialog, toast) or on the single HEAD-marker halo. No card, row, or button at rest carries a shadow — depth there comes from the graphite tonal steps alone.

## Shapes

Two radii cover the whole system: `6px` (`--radius`) for nearly everything interactive — buttons, commit rows, tags, dropdown items, diff blocks, toasts — and `12px` (`--radius-lg`) reserved for the two floating overlays (ref dropdown panel, ⌘K dialog) to read as a distinct, larger "surface" tier. Borders are hairline and single-purpose: `1px` at low opacity (`--color-line`) for structural dividers, `1px` at higher opacity (`--color-line-2`) for interactive-control outlines. The HEAD commit dot and merge-commit markers are the only non-circular/non-rectangular forms: the merge dot is a `45°`-rotated square (a diamond), distinguishing a merged-role entry from an ordinary circular commit dot at a glance.

## Components

### Buttons / Controls
- **Shape:** 6px radius, hairline `--color-line-2` border, transparent or `--color-bg-sunk` background at rest.
- **Ref trigger:** transparent background, mono ref name in HEAD pink, hover fills `--color-surface`; an open state turns the border pink and rotates the caret 180°. No colored border-left is used on this or any control — a border-left accent stripe was flagged and removed during the finish-review fix round and must not be reintroduced.
- **Find (⌘K opener):** sunk-graphite background, ink-3 text, hover brightens border to HEAD pink and text to full ink; renders a mono `kbd` chip for the platform shortcut.
- **Hover / Focus:** all interactive controls transition `border-color`/`background` over 200ms (`--ease-out`); focus-visible everywhere is a solid 2px HEAD-pink outline with 2px offset — one universal focus treatment, no per-component variants.

### Commit Row (signature component)
The atomic unit of the entire site. A full-width, left-aligned disclosure button: a graph dot in the rail column, then a top line (mono ref badge if tagged + sans commit message), a meta line (mono hash, relative date, `+add`/`−del` diff-stat counts, optional tag chips), and a chevron that rotates 180° when expanded. Expanding reveals a `.diff`-styled detail block: sunk-graphite background, hairline border, mono text at 1.75 line-height, with `+` lines in commit-green and `−`/untracked lines in ink-4 (untracked entries additionally get a dashed underline to read as "not yet real"). The HEAD row is distinguished only by a larger message size and the pink halo dot — no badge, no border, no background tint.

### Cards / Containers
- **Corner Style:** 6px (diff blocks, toasts) or 12px (ref dropdown, ⌘K dialog).
- **Background:** `--color-surface` for dropdowns/dialogs, `--color-bg-sunk` for diff blocks and the ⌘K footer strip.
- **Shadow Strategy:** see Elevation & Depth — floating containers only.
- **Border:** 1px hairline in `--color-line` or `--color-line-2`, always present on floating containers; commit rows and inline content carry no border.
- **Internal Padding:** 6–24px depending on density (dropdown items 7px, diff blocks 12–16px, ⌘K bar 16–20px).

### Inputs / Fields
- **Style:** borderless, transparent background, mono type, sit inside a bordered parent (the ⌘K bar) rather than carrying their own border.
- **Focus:** no visible focus ring on the ⌘K text input itself (the dialog border stands in); the global focus-visible outline governs every other focusable control.

### Navigation
- **Style:** the ref selector is the sole primary navigation control — a listbox-pattern popover, mono type, current selection marked with a pink wash + inset ring and pink-hi text. Switching a ref redraws the log in place; there is no separate page navigation, breadcrumb, or nav bar beyond the top bar's three regions.
- **Mobile:** ref dropdown re-anchors right-edge instead of center; the `find` control collapses to an icon-only square; the top bar's rail column narrows.

### Command Menu ⌘K (signature component)
A native `<dialog>` opened via `showModal()` for free focus-trapping/backdrop-inertness, styled as a floating terminal prompt: a `>` mono prompt glyph, borderless mono input, and a scrollable grouped result list (Go / Contact / Projects, generated live from the same data the commit log renders from, so it can never drift out of sync). Every result row carries a hand-drawn SVG icon (branch/mail/external-link/file — matched to the header's own branch-glyph stroke weight and viewBox) rather than a Unicode character standing in for an icon; this was a finish-review fix and is now the fixed rule — no Unicode glyph icon may be reintroduced anywhere in the palette. Selected rows get a pink wash + inset ring; the footer strip shows mono `kbd` hints for arrow/Enter/Esc.

### Custom Cursor
A 30px ring plus a 5px dot, both `position:fixed` and `mix-blend-mode:difference` so a single ink-toned ring reads against any surface it crosses with no per-region tuning. The dot tracks the pointer exactly; the ring lags with a 0.22 lerp for a soft trailing feel. On any actionable element (`a`, `button`, `[role="option"]`, `input`, focusable `[tabindex]`) the ring scales to 1.35× and tints to the pink wash/border (the same active-state accent used everywhere else); on press it scales to 0.72×. Position, scale and press state are driven together as one `transform` string every animation frame — never `width`/`height` — a deliberate choice because several hoverable rows on this page (commit rows) span the full content column, where a ring sized to literally match the hovered element's box would swallow the viewport; a constant-size ring that only scales and tints reads as a control, not a hitbox outline. JS gates the whole feature behind `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`, adding a `has-cursor` class to `<html>` only when all three hold; CSS uses that class to also set `cursor: none` on the page and every actionable element. No markup ships in `index.html` — `js/cursor.js` builds the two nodes only when the feature will actually run.

## Do's and Don'ts

### Do:
- **Do** treat pink (`#f4858c`) as an active-state signal only — HEAD dot, active ref, focus, diff `−` lines — never as decoration.
- **Do** render every command-palette result icon as a hand-drawn SVG matched to the header's branch/search glyph stroke weight, never a Unicode character.
- **Do** keep every diff stat (`+add`/`−del`) sourced from real content data, never a placeholder count.
- **Do** use `--color-ink-4` (`rgba(230,232,235,.58)`) as the canonical quietest-text value — it was tuned during the finish-review fix round specifically to clear contrast on the graphite ground; don't substitute a dimmer ad hoc value.
- **Do** reserve 12px radius and real box-shadow for the two floating overlays (ref dropdown, ⌘K dialog) only; everything else at rest is flat and 6px-radius.
- **Do** animate the custom cursor's ring through `transform` (translate + scale) only, gated behind `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)` — never `width`/`height`, which would both force a layout pass every frame and look wrong against full-width hoverable rows.

### Don't:
- **Don't** add a colored border-left (or any left-edge accent stripe) to the ref selector or any other control — this was a finish-review finding, removed, and must not recur.
- **Don't** fabricate a build/deploy step in the boot sequence that this static, no-build-step site doesn't actually perform (the shipped boot copy — clone, push to main, open the live URL — describes only real, literal actions).
- **Don't** introduce a third accent hue; the system is a strict two-signal palette (green = shipped, pink = active).
- **Don't** add drop shadows to commit rows, buttons, or any element at rest — depth here comes from graphite tonal layering, not shadow.
