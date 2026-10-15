// Real content only. Every fact here traces to Anuj's GitHub (github.com/anujmish1229)
// or the LinkedIn profile he provided — nothing here is invented.
var SITE = {
    email: 'a85mishr@uwaterloo.ca',
    github: 'https://github.com/anujmish1229',
    linkedin: 'https://www.linkedin.com/in/anujmish/',
    resume: 'resume.pdf'
};

// Each commit: title, optional summary and date, optional detail lines
// (strings or { text, href }). `open` renders the lines inline, no toggle.
// `goto` turns the row into a link to another ref.
var REFS = {
    home: {
        label: 'home',
        commits: [
            {
                id: 'home-projects',
                title: 'Projects',
                summary: 'Deep Orbit AI · myHighSchool.club · 5 community websites · VEX robotics',
                goto: 'projects'
            },
            {
                id: 'home-experience',
                title: 'Experience',
                summary: 'Deployment and full-stack lead at myHighSchool.club · CEO, Hindu Community Centre of Durham · Director, Senior Buddies',
                goto: 'experience'
            },
            {
                id: 'home-awards',
                title: 'Awards',
                summary: 'Bronze at Skills Ontario 2026 · 1st at Skills Durham 2026 · 1st at the Ontario Tech CTF',
                goto: 'about'
            },
            {
                id: 'home-education',
                title: 'Education',
                summary: 'University of Waterloo (B.Math) + Wilfrid Laurier University (BBA), 2026–2031',
                goto: 'about'
            }
        ]
    },
    projects: {
        label: 'projects',
        commits: [
            {
                id: 'deeporbit',
                title: 'Deep Orbit AI',
                summary: 'Exoplanet-detection model for the NASA Space Apps Challenge.',
                date: 'Oct 2025',
                link: 'https://www.spaceappschallenge.org/2025/find-a-team/outspace2/?tab=project',
                lines: [
                    '99.7% accuracy on NASA datasets',
                    { text: 'Space Apps project page', href: 'https://www.spaceappschallenge.org/2025/find-a-team/outspace2/?tab=project' }
                ]
            },
            {
                id: 'myhighschool',
                title: 'myHighSchool.club',
                summary: 'A web platform that gives high-school clubs their own sites.',
                date: 'Jul 2025 – now',
                link: 'https://myhighschool.club',
                lines: [
                    'Led production and deployment with a small team',
                    { text: 'myhighschool.club', href: 'https://myhighschool.club' }
                ]
            },
            {
                id: 'orgsites',
                title: 'Community organization websites',
                summary: 'Sites for five community organizations in Durham and Uganda, still maintained.',
                date: '2022 – now',
                lines: [
                    { text: 'Hindu Community Centre of Durham', note: 'built as CEO', href: 'https://hccd.ca' },
                    { text: 'Senior Buddies Durham', note: 'built as Director', href: 'https://seniorbuddiesdurham.ca' },
                    { text: 'Durham Diwali Festival', note: 'rebuilt from Wix in React + Tailwind', href: 'https://github.com/anujmish1229/diwalifestdurham' },
                    { text: 'OFTAC', note: 'beekeeping livelihoods for refugee families in Uganda', href: 'https://github.com/anujmish1229/oftac' },
                    { text: 'Elimu Bright Schools', note: 'a school for underserved children in western Uganda', href: 'https://github.com/anujmish1229/Elimu-Bright-Schools' }
                ]
            },
            {
                id: 'vex',
                title: 'VEX robotics',
                summary: 'Autonomous routines for two VEX V5RC competition robots.',
                date: 'Aug 2025 – May 2026',
                lines: [
                    { text: 'Eugene', note: 'Pickering HS · 1st at Skills Ontario Durham Regional, advanced to Provincials', href: 'https://github.com/anujmish1229/eugene' },
                    'Ram Rider — team 22108A Mechaknights'
                ]
            }
        ]
    },
    experience: {
        label: 'experience',
        commits: [
            {
                id: 'exp-myhighschool',
                merge: true,
                title: 'myHighSchool.club',
                summary: 'Deployment Lead and Full-Stack Development Lead · startup',
                date: 'Jul 2025 – now'
            },
            {
                id: 'exp-hccd',
                merge: true,
                title: 'Hindu Community Centre of Durham',
                summary: 'CEO',
                date: 'Jul 2025 – now',
                lines: [
                    'Ran community events, from a sports day to a Niagara Falls trip',
                    'Recognized by the City of Pickering and Town of Ajax'
                ]
            },
            {
                id: 'exp-seniorbuddies',
                merge: true,
                title: 'Senior Buddies',
                summary: 'Director',
                date: 'May 2023 – now'
            },
            {
                id: 'exp-zebra',
                merge: true,
                title: 'Zebra Robotics',
                summary: 'Robotics Coach',
                date: 'Sep 2025 – Feb 2026'
            },
            {
                id: 'exp-iqbrainers',
                merge: true,
                title: 'IQ Brainers Academy',
                summary: 'Math and Robotics Tutor',
                date: 'Jul 2024 – Apr 2025'
            }
        ]
    },
    about: {
        label: 'about',
        commits: [
            {
                id: 'about-education',
                title: 'Education',
                open: true,
                lines: [
                    'University of Waterloo — B.Math, 2026–2031',
                    'Wilfrid Laurier University — BBA, 2026–2031',
                    'Pickering High School — 2022–2026'
                ]
            },
            {
                id: 'about-awards',
                title: 'Awards',
                open: true,
                lines: [
                    'Bronze (3rd) — Skills Ontario, Web Design & Development, May 2026',
                    '1st — Skills Durham, Web Design & Development, Mar 2026',
                    '1st — Ontario Tech University × Sun Life CTF, Oct 2025',
                    '4th — Skills Ontario, Web Design & Development, May 2025',
                    '2nd — Skills Durham, Web Design & Development, Mar 2025',
                    '3rd — NASA Space Apps Challenge, Oct 2024'
                ]
            },
            {
                id: 'about-skills',
                title: 'Skills',
                open: true,
                lines: ['Python · React · TypeScript · Tailwind CSS · Machine learning · VEX robotics']
            }
        ]
    }
};
