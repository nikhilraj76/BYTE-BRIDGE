# HackMate 🚀

**Connecting Hackers. Creating Innovations.**

HackMate is a single-page hackathon platform where participants find teammates, join teams, pick problem statements, and submit projects, while organizers manage the schedule, problems, and announcements. It's built with plain **HTML, CSS, and JavaScript** in one file, with no frameworks, no build step, and no backend.

> College project (CSE326), written using only basic HTML/CSS/JS concepts.

---

## Features

### For participants
- **Find Team (Matchmaking Lounge):** register yourself with a skill, experience level, and bio. Search participants by name and filter by skill (Frontend, Backend, AI/ML, UI/UX, Hardware/IoT).
- **Recruitment Board:** teams are grouped by the skill they need. Create a team, post what you're looking for, and send join requests. Hover over a member to see what they're handling.
- **Schedule:** a timeline of hackathon events. Past events are highlighted in green.
- **Problem Statements:** browse challenges set by the organizers. A team leader can choose one problem for their team.
- **Project Gallery:** browse submitted projects, filter by sponsor track, and upvote favourites (one vote per project per browser). The most upvoted appears first.
- **Submit Project:** submit team name, title, GitHub repo, live demo, video pitch, description, and sponsor track.
- **Live countdown** to the submission deadline on the home page.

### For organizers (passcode protected)
- Set the **submission deadline**
- Add, edit, and delete **schedule events**
- Add, edit, and delete **problem statements**
- **Assign** or unassign problems to teams
- Post and delete **announcements** (shown on the home page)
- **Export** all data as `hackmate-data.json`
- **Reset** all saved data

---

## Getting Started

No installation needed.

1. Download `hackmate_final.html`.
2. Open it in any modern browser (Chrome, Edge, Firefox, Safari).

That's it. You can also host it on any static host (GitHub Pages, Netlify, etc.).

### Organizer access
Open the **Organizer** page and enter the passcode:

```
mate2026
```

The passcode is defined by the `PASSCODE` constant at the top of the script. Change it there. Note that it is visible in the page source, so this is a demo-level lock, not real security.

---

## Pages

| Page | Hash | Purpose |
|------|------|---------|
| Home | `#home` | Hero, countdown, announcements, feature overview |
| Find Team | `#matcher` | Register and search participants |
| Recruitment | `#recruitment` | Create teams, request to join |
| Schedule | `#schedule` | Event timeline |
| Problems | `#problems` | Problem statements, team leaders choose |
| Projects | `#projects` | Gallery with voting and track filter |
| Submit Project | `#submission` | Project pitch form |
| Organizer | `#organizer` | Admin dashboard (passcode - mate2026) |

Navigation uses the URL `#hash`, so each page is directly linkable.

---

## How It Works

- **Storage:** all data is saved in the browser's `localStorage` as JSON under keys prefixed with `hackmate_` (participants, teams, problems, schedule, projects, announcements, votes, deadline). Organizer login state lives in `sessionStorage`, so it ends when the tab closes.
- **Default data:** on first load, sample participants, five teams, three problem statements, and an 8-event schedule (13–15 Dec 2026) are pre-filled.
- **Team leaders:** the first member of each team is the leader. Only the leader (matched by name) can choose a problem, and a team can choose only one. Organizers can change it afterward.
- **Safety:** user-typed text is escaped before being rendered into HTML, and only `http://` / `https://` links are made clickable.
- **Responsive design:** flexbox and grid layout, CSS variables for theming, with transitions and a floating-card animation.

### Sponsor tracks
- Best FinTech Hack
- Best Healthcare AI
- Best Open Source Tool

---

## Limitations

- **No backend:** data is stored per browser and per device, so it is **not shared between users**. Votes, registrations, and submissions are only visible on the browser that created them.
- "Connect" and "Join Team" requests are demonstrations (an alert/message); nothing is actually sent.
- Clearing browser data erases everything. Use the organizer **Export** button to keep a copy.
- Join requests are kept for the current visit only.

---

## Tech Stack

- HTML5 (semantic sections, forms, `<details>`)
- CSS3 (variables, grid, flexbox, pseudo-classes, transitions, keyframe animations)
- Vanilla JavaScript (DOM, events, arrays/objects, `Date`, `localStorage`, `sessionStorage`, JSON)

---

## Project Structure

```
hackmate_final.html   # the entire app: markup, styles, and scripts
README.md
```

---

## Future Ideas

- Real backend and database so data is shared across users
- Proper authentication for participants and organizers
- Real join/connect requests with notifications
- Judge scoring panel and winner announcements

---

© 2026 HackMate | College Hackathon Project
