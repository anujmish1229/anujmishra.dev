// Real content only. Every fact here traces to Anuj's GitHub (github.com/anujmish1229)
// or the LinkedIn profile he provided — nothing here is invented.
var SITE = {
    email: 'a85mishr@uwaterloo.ca',
    github: 'https://github.com/anujmish1229',
    linkedin: 'https://www.linkedin.com/in/anujmish/'
};

var REFS = {
    main: {
        label: 'main',
        desc: 'projects',
        commits: [
            {
                id: 'head',
                head: true,
                type: 'status',
                message: 'status: first-year @ Waterloo (Math + Business) — open to internships & collabs',
                date: 'now',
                tags: ['status'],
                diff: [
                    { kind: 'meta', text: '[user]' },
                    { kind: 'add', text: 'name = Anuj Mishra' },
                    { kind: 'add', text: 'email = ' + SITE.email, href: 'mailto:' + SITE.email },
                    { kind: 'add', text: 'github = github.com/anujmish1229', href: SITE.github },
                    { kind: 'add', text: 'linkedin = linkedin.com/in/anujmish', href: SITE.linkedin },
                    { kind: 'untracked', text: 'resume = (untracked)' }
                ]
            },
            {
                id: 'myhighschool',
                hash: null,
                type: 'feat',
                message: 'feat(myhighschool.club): lead production & deployment of a web-presence platform for HS clubs',
                date: 'Jul 2025 → present',
                tags: ['project', 'lead', 'ongoing'],
                link: 'https://myhighschool.club',
                diff: [
                    { kind: 'add', text: 'centralizes website production & web presence creation for student orgs' },
                    { kind: 'add', text: 'led production and deployment of the web app' },
                    { kind: 'add', text: 'integrated features alongside a small contributor team' },
                    { kind: 'add', text: 'live at myhighschool.club', href: 'https://myhighschool.club' }
                ]
            },
            {
                id: 'hccd',
                hash: '909e1cb',
                type: 'feat',
                message: 'feat(hccd): rebuild the Hindu Community Centre of Durham site',
                date: 'pushed Sep 4, 2026',
                tags: ['project', 'community'],
                link: 'https://github.com/anujmish1229/hccd',
                diff: [
                    { kind: 'add', text: 'built while serving as CEO of HCCD' },
                    { kind: 'add', text: 'org recognized by the City of Pickering & Town of Ajax' },
                    { kind: 'add', text: 'TypeScript' },
                    { kind: 'add', text: 'repo: github.com/anujmish1229/hccd', href: 'https://github.com/anujmish1229/hccd' }
                ]
            },
            {
                id: 'seniorbuddies',
                hash: '4ddf1b8',
                type: 'feat',
                message: 'feat(seniorbuddies): ship the Senior Buddies Durham website',
                date: 'pushed Sep 4, 2026',
                tags: ['project', 'community'],
                link: 'https://github.com/anujmish1229/seniorBuddies',
                diff: [
                    { kind: 'add', text: 'bridging generations in Durham Region' },
                    { kind: 'add', text: 'built while serving as Director (since May 2023)' },
                    { kind: 'add', text: 'TypeScript' },
                    { kind: 'add', text: 'repo: github.com/anujmish1229/seniorBuddies', href: 'https://github.com/anujmish1229/seniorBuddies' }
                ]
            },
            {
                id: 'diwali',
                hash: '8205eaf',
                type: 'feat',
                message: 'feat(diwalifestdurham): rebuild the Durham Diwali Festival site in React',
                date: 'pushed Sep 4, 2026',
                tags: ['project', 'community'],
                link: 'https://github.com/anujmish1229/diwalifestdurham',
                diff: [
                    { kind: 'add', text: 'rebuilt from the org’s original Wix site — React + TypeScript + Tailwind CSS' },
                    { kind: 'add', text: 'carries mission, vision, team, sponsorship tiers & vendor packages' },
                    { kind: 'add', text: 'Netlify Forms wired for newsletter & contact submissions' },
                    { kind: 'add', text: 'repo: github.com/anujmish1229/diwalifestdurham', href: 'https://github.com/anujmish1229/diwalifestdurham' }
                ]
            },
            {
                id: 'eugene',
                hash: 'ae4dcb5',
                type: 'feat',
                message: 'feat(eugene): program autonomous routine for Skills Ontario VEX regional',
                date: 'Nov 2025 → May 2026',
                tags: ['project', 'robotics'],
                link: 'https://github.com/anujmish1229/eugene',
                diff: [
                    { kind: 'add', text: 'built for Pickering HS’s VEX V5RC entry in "Push Back"' },
                    { kind: 'add', text: 'autonomous run: sensor input + a predetermined path' },
                    { kind: 'add', text: '1st place, Skills Ontario Durham Regional' },
                    { kind: 'add', text: 'advanced to Skills Ontario Provincials' },
                    { kind: 'add', text: 'repo: github.com/anujmish1229/eugene', href: 'https://github.com/anujmish1229/eugene' }
                ]
            },
            {
                id: 'ramrider',
                hash: null,
                type: 'feat',
                message: 'feat(ram-rider): program 22108A Mechaknights’ VEX V5RC autonomous run',
                date: 'Aug 2025 → Feb 2026',
                tags: ['project', 'robotics'],
                diff: [
                    { kind: 'add', text: 'competition bot for the 2025–26 RECF "Push Back" season' },
                    { kind: 'add', text: 'autonomous routine driven by sensor input + a predetermined path' }
                ]
            },
            {
                id: 'deeporbit',
                hash: null,
                type: 'feat',
                message: 'feat(deep-orbit-ai): train an exoplanet-detection model on NASA datasets',
                date: 'Oct 2025',
                tags: ['project', 'ml', 'hackathon'],
                diff: [
                    { kind: 'add', text: 'NASA Space Apps Challenge submission' },
                    { kind: 'add', text: 'flagship model reached 99.7% accuracy' }
                ]
            }
        ]
    },
    experience: {
        label: 'experience',
        desc: 'roles, merged',
        commits: [
            {
                id: 'exp-hccd',
                merge: true,
                type: 'merge',
                message: "merge branch 'ceo/hccd' → main",
                date: 'Jul 2025 → present',
                tags: ['leadership'],
                diff: [
                    { kind: 'meta', text: 'Chief Executive Officer · Hindu Community Centre of Durham' },
                    { kind: 'add', text: 'ran community events: a summer sports day, a day-trip to Niagara Falls' },
                    { kind: 'add', text: 'recognized by the City of Pickering & Town of Ajax' }
                ]
            },
            {
                id: 'exp-seniorbuddies',
                merge: true,
                type: 'merge',
                message: "merge branch 'director/senior-buddies' → main",
                date: 'May 2023 → present',
                tags: ['leadership'],
                diff: [
                    { kind: 'meta', text: 'Director · Senior Buddies' },
                    { kind: 'add', text: 'bridging generations in Durham Region' }
                ]
            },
            {
                id: 'exp-zebra',
                merge: true,
                type: 'merge',
                message: "merge branch 'coach/zebra-robotics' → main",
                date: 'Sep 2025 → Feb 2026 · Ajax, ON',
                tags: ['robotics'],
                diff: [
                    { kind: 'meta', text: 'Robotics Coach · Zebra Robotics' },
                    { kind: 'add', text: 'Python' },
                    { kind: 'add', text: 'Robotics' }
                ]
            },
            {
                id: 'exp-iqbrainers',
                merge: true,
                type: 'merge',
                message: "merge branch 'tutor/iq-brainers' → main",
                date: 'Jul 2024 → Apr 2025 · on-call, Ajax, ON',
                tags: ['tutoring'],
                diff: [
                    { kind: 'meta', text: 'Mathematics / Robotics Tutor · IQ Brainers Academy Inc.' }
                ]
            },
            {
                id: 'exp-han',
                merge: true,
                type: 'merge',
                message: "merge branch 'volunteer/han-durham' → main",
                date: 'Oct 2024 → Jun 2025',
                tags: ['volunteer'],
                diff: [
                    { kind: 'meta', text: 'Volunteer · Hindu Affinity Network of Durham' }
                ]
            }
        ]
    },
    about: {
        label: 'about',
        desc: 'education, skills',
        commits: [
            {
                id: 'about-bio',
                type: 'docs',
                message: 'docs(about): who is this',
                date: 'now',
                tags: ['about'],
                diff: [
                    { kind: 'add', text: 'Honours Mathematics and Business Administration Double Degree' },
                    { kind: 'add', text: '@ University of Waterloo + Wilfrid Laurier University' },
                    { kind: 'add', text: 'passionate about robotics and software development' },
                    { kind: 'add', text: 'reach out — ' + SITE.email, href: 'mailto:' + SITE.email }
                ]
            },
            {
                id: 'about-education',
                type: 'docs',
                message: 'docs(about): education',
                date: 'now',
                tags: ['education'],
                diff: [
                    { kind: 'add', text: 'University of Waterloo — B. Math, Mathematics (Sep 2026 → Aug 2031)' },
                    { kind: 'add', text: 'Wilfrid Laurier University, Lazaridis School of Business & Economics — BBA (Sep 2026 → Aug 2031)' },
                    { kind: 'add', text: 'Pickering High School — Diploma (Sep 2022 → Jun 2026)' }
                ],
                note: 'Pickering HS activities: CS Club Executive, Robotics team lead, DECA provincial competitor, HSA President, Trivia team captain, Band (Clarinet lead, Jazz Baritone Sax), Math team, Badminton team, EASA vice-president, Skills Ontario trades competition, CS peer tutoring.'
            },
            {
                id: 'about-skills',
                type: 'chore',
                message: 'chore(deps): add skills',
                date: 'now',
                tags: ['skills'],
                diff: [
                    { kind: 'add', text: 'Python' },
                    { kind: 'add', text: 'React' },
                    { kind: 'add', text: 'TypeScript' },
                    { kind: 'add', text: 'Tailwind CSS' },
                    { kind: 'add', text: 'Machine Learning' },
                    { kind: 'add', text: 'VEX / Robotics' },
                    { kind: 'add', text: 'Back-End Web Development' },
                    { kind: 'add', text: 'Leadership' },
                    { kind: 'add', text: 'Strategic Planning' },
                    { kind: 'add', text: 'Communication' }
                ]
            }
        ]
    }
};
