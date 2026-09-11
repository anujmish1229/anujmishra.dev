# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary users are visitors evaluating or connecting with Anuj Mishra, in this priority order:
1. Recruiters / hiring managers assessing him for an internship or job — need fast proof of skill (projects, experience, resume) and a way to reach him.
2. General network — classmates, friends, LinkedIn connections — casual browsing, no evaluation pressure.
3. Collaborators or potential clients considering working with him on something.

## Product Purpose
A personal portfolio site for Anuj Mishra (Math + Business @ University of Waterloo). It exists to establish credibility and make it fast for a visitor to see what he's built and reach him. Success is a recruiter or collaborator quickly forming a positive impression, finding proof of his work, and getting to his contact info or resume without friction.

## Positioning
Presents Anuj as a builder with technical craft rather than a generic templated "student portfolio" — the current VS Code-editor conceit (titlebar menu, command palette, custom cursor) is one way of signaling developer-tool fluency; the specific device is open to change (see Brand Commitments), but the underlying claim — this person builds real, well-crafted software, and the site itself is proof — is durable.

## Operating Context
Today the site is a single hero view: name, quick-links (email, GitHub, LinkedIn, resume), a decorative VS Code-style titlebar menu, a command-palette-style search/actions dialog, a custom cursor, and a light/dark theme toggle. It is set to grow into a full portfolio with dedicated sections — projects, experience/education, skills — making the current hero one entry point into a larger site rather than the whole site. The command palette's action list should grow into real navigation once those sections exist.

## Capabilities and Constraints
- Plain static HTML/CSS/JS: no framework, no build step, no package manager (no package.json in the repo). Ships as-is.
- Real GitHub: `https://github.com/anujmish1229`. Real LinkedIn: `https://www.linkedin.com/in/anujmish/` (blocks automated fetches — HTTP 999 — so future refreshes need the user to paste updated profile text; it cannot be scraped in-session).
- `resume.pdf` still does not exist — the user has not written a resume yet ("I will need to make my resume after"). Treat the resume link as a real future feature (untracked/pending), not a broken link to fake or silently drop from the design forever.
- Contact email used in site copy is `a85mishr@uwaterloo.ca` — confirmed directly by the user's own LinkedIn About text.

## Brand Commitments
- Panda mark (`images/panda.png`) as the site's current logo.
- The VS Code-editor pastiche (titlebar menu, command palette, custom cursor) was replaced in the 2026-09 ground-up redesign (see [[../.impeccable/surfaces/index-html.md|surface brief]] direction contract: "Git History as Career"). The ⌘K command palette itself was kept and rewritten; the custom cursor and light/dark toggle were retired along with the old visual world.
- The site's accent pink (`#f4858c` / hi `#ffb3b8`) from the original design is a pinned, carried-over material: the user explicitly asked to keep it through the redesign, so it now marks the active/HEAD state in the new commit-log world rather than being replaced by an invented accent.

## Evidence on Hand
Real project and experience content gathered 2026-09-11 from the user's public GitHub (`github.com/anujmish1229`, 7 public repos) and pasted LinkedIn content (experience, education, project entries). Confirmed, usable facts:
- **Projects:** myHighSchool.club (web app for school club/org web presence, led production & deployment, Jul 2025–present); Hindu Community Centre of Durham website (`hccd` repo); Senior Buddies Durham website (`seniorBuddies` repo); Durham Diwali Festival site rebuild, React+TS+Tailwind from the org's old Wix site (`diwalifestdurham` repo, has a detailed real README); Deep Orbit AI — NASA Space Apps Challenge exoplanet-detection ML model, 99.7% accuracy (Oct 2025); Eugene — Pickering HS Skills Ontario VEX V5RC robot, 1st place Skills Durham Regional, advanced to Provincials (Nov 2025–May 2026); Ram Rider — 22108A Mechaknights VEX V5RC competition bot (Aug 2025–Feb 2026).
- **Not yet confirmed, excluded from the current build:** two more public repos, `Elimu-Bright-Schools` (no description available) and `outspace` (empty Lovable-generated scaffold, no real content) — need a one-line description from the user before either can be shown as a real project.
- **Experience:** CEO, Hindu Community Centre of Durham (Jul 2025–present); Director, Senior Buddies (May 2023–present); Robotics Coach, Zebra Robotics (Sep 2025–Feb 2026, Ajax ON); Mathematics/Robotics Tutor, IQ Brainers Academy Inc. (Jul 2024–Apr 2025, on-call, Ajax ON); Volunteer, Hindu Affinity Network of Durham (Oct 2024–Jun 2025).
- **Education:** University of Waterloo, Bachelor of Mathematics (Honours Math + Business double-degree program, Sep 2026–Aug 2031); Wilfrid Laurier University, Lazaridis School of Business & Economics, BBA (same double-degree, Sep 2026–Aug 2031); Pickering High School, diploma (Sep 2022–Jun 2026, extensive activities list on file).
- **Skills confirmed by name** (LinkedIn hid the rest behind "+N skills," never invent the hidden ones): Python, VEX/Robotics, Strategic Planning, Leadership, Back-End Web Development, Communication; React/TypeScript/Tailwind CSS are verifiable directly from the GitHub repos' own language stats, not a LinkedIn claim.
- **Still missing:** resume file (user will produce it later).

## Product Principles
- Speed to credibility: a recruiter should form an impression and find contact/resume within seconds, without hunting.
- The site is itself the proof: its own execution (interactions, performance, polish) is evidence of the builder's skill, so sloppy craft undermines the pitch more than a plain page would.
- Real content over placeholder content: links, projects, and resume must reflect real facts; an overselling or fabricated portfolio is worse than an honest, smaller one.
- Grow without burying the fast path: adding projects/experience/skills should extend the entry experience, not bury the contact/resume path recruiters need first.
