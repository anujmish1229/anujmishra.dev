// Real content only. Every fact here traces to Anuj's GitHub (github.com/anujmish1229)
// or the LinkedIn profile he provided — nothing here is invented.
var SITE = {
    email: 'a85mishr@uwaterloo.ca',
    github: 'https://github.com/anujmish1229',
    linkedin: 'https://www.linkedin.com/in/anujmish/'
};

// Each commit: title, optional summary and date, optional detail lines
// (strings or { text, href }). `open` renders the lines inline, no toggle.
var REFS = {
    projects: {
        label: 'projects',
        commits: [
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
                summary: 'Sites for three Durham community organizations.',
                lines: [
                    { text: 'Hindu Community Centre of Durham', note: 'built as CEO', href: 'https://github.com/anujmish1229/hccd' },
                    { text: 'Senior Buddies Durham', note: 'built as Director', href: 'https://github.com/anujmish1229/seniorBuddies' },
                    { text: 'Durham Diwali Festival', note: 'rebuilt from Wix in React + Tailwind', href: 'https://github.com/anujmish1229/diwalifestdurham' }
                ]
            },
            {
                id: 'eugene',
                title: 'Eugene',
                summary: 'Autonomous routine for Pickering HS’s Skills Ontario VEX robot.',
                date: 'Nov 2025 – May 2026',
                link: 'https://github.com/anujmish1229/eugene',
                lines: [
                    '1st place, Skills Ontario Durham Regional',
                    'Advanced to Provincials',
                    { text: 'github.com/anujmish1229/eugene', href: 'https://github.com/anujmish1229/eugene' }
                ]
            },
            {
                id: 'ramrider',
                title: 'Ram Rider',
                summary: 'Autonomous routine for VEX team 22108A Mechaknights.',
                date: 'Aug 2025 – Feb 2026'
            },
            {
                id: 'deeporbit',
                title: 'Deep Orbit AI',
                summary: 'Exoplanet-detection model for the NASA Space Apps Challenge.',
                date: 'Oct 2025',
                lines: ['99.7% accuracy on NASA datasets']
            }
        ]
    },
    experience: {
        label: 'experience',
        commits: [
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
            },
            {
                id: 'exp-han',
                merge: true,
                title: 'Hindu Affinity Network of Durham',
                summary: 'Volunteer',
                date: 'Oct 2024 – Jun 2025'
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
                id: 'about-skills',
                title: 'Skills',
                open: true,
                lines: ['Python · React · TypeScript · Tailwind CSS · Machine learning · VEX robotics']
            }
        ]
    }
};
