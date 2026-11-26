// =====================================================
// HackMate - basic JavaScript (CSE326 Units IV and V)
// Uses: variables, functions, if/else, loops, arrays, objects,
// strings, Date, DOM, events, localStorage, sessionStorage, JSON
// =====================================================


// ---------- 1. SETTINGS AND DEFAULT DATA ----------
const PASSCODE = "mate2026";                  // organizer passcode
const DEFAULT_DEADLINE = "2026-12-15T18:00";  // used until the organizer changes it
const PREFIX = "hackmate_";                   // every saved key starts with this

const pages = ["home", "matcher", "recruitment", "schedule", "problems", "projects", "submission", "organizer"];
const skills = ["Frontend", "Backend", "AI/ML", "UI/UX", "Hardware/IoT"];
const icons = ["🎨", "⚙️", "🤖", "✏️", "🔌"];
const columnClasses = ["col-frontend", "col-backend", "col-aiml", "col-uiux", "col-hardware"];
const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// first-time data (arrays of objects)
const defaultParticipants = [
    { name: "Rahul Sharma", skill: "Frontend", level: "Intermediate", bio: "Interested in web development." },
    { name: "Aman Verma", skill: "Backend", level: "Advanced", bio: "Passionate about server development." },
    { name: "Priya Singh", skill: "AI/ML", level: "Intermediate", bio: "Interested in Artificial Intelligence." },
    { name: "Neha Gupta", skill: "UI/UX", level: "Beginner", bio: "Creative UI/UX designer." },
    { name: "Arjun Kumar", skill: "Hardware/IoT", level: "Intermediate", bio: "Works with Arduino and IoT devices." }
];

// the first member of every team is the team leader
const defaultTeams = [
    { name: "Team PixelForge", project: "Hackathon Event Tracker", skill: "Frontend", looking: "Frontend Developer", problemId: null, members: [
        { name: "Nikhil Arora", role: "Backend Developer", task: "Building the REST API for events and schedules." },
        { name: "Pooja Iyer", role: "UI Designer", task: "Creating wireframes and the colour system." } ] },
    { name: "Team Innovators", project: "AI Healthcare Assistant", skill: "Backend", looking: "Backend Developer", problemId: null, members: [
        { name: "Rohan Mehta", role: "Frontend Lead", task: "Building the patient dashboard and chat interface." },
        { name: "Sneha Kapoor", role: "AI/ML Engineer", task: "Training the symptom-analysis model." },
        { name: "Karan Malhotra", role: "Project Manager", task: "Planning tasks, deadlines and the final pitch." } ] },
    { name: "Team NeuralNest", project: "Smart Study Planner", skill: "AI/ML", looking: "AI/ML Developer", problemId: null, members: [
        { name: "Ishaan Bose", role: "Full-Stack Developer", task: "Connecting the web app to the recommendation engine." },
        { name: "Lavanya Reddy", role: "Data Analyst", task: "Cleaning study-habit data and building features." } ] },
    { name: "Team Coders", project: "Smart Finance App", skill: "UI/UX", looking: "UI/UX Designer", problemId: null, members: [
        { name: "Anjali Nair", role: "Backend Developer", task: "Creating APIs for expense tracking and budgets." },
        { name: "Vikram Rao", role: "Frontend Developer", task: "Implementing charts and the transaction screens." } ] },
    { name: "Team Tech Warriors", project: "Smart Agriculture System", skill: "Hardware/IoT", looking: "Hardware Developer", problemId: null, members: [
        { name: "Manish Yadav", role: "IoT Engineer", task: "Wiring soil-moisture sensors to the Arduino." },
        { name: "Divya Joshi", role: "Data & Backend", task: "Storing sensor data and sending crop alerts." },
        { name: "Tanya Bhatia", role: "UI Developer", task: "Designing the farmer-friendly monitoring dashboard." } ] }
];

const defaultProblems = [
    { id: 1, title: "Rural Healthcare Access", track: "Best Healthcare AI", desc: "Build a tool that helps people in remote areas get basic health guidance and find nearby clinics." },
    { id: 2, title: "Smarter Personal Finance", track: "Best FinTech Hack", desc: "Create an app that helps students track spending, save money and avoid online scams." },
    { id: 3, title: "Open Source for Good", track: "Best Open Source Tool", desc: "Build a free developer tool that other hackathon teams can reuse." }
];

const defaultSchedule = [
    { title: "Opening Ceremony", time: "2026-12-13T10:00", desc: "Theme reveal, rules and sponsor introductions." },
    { title: "Team Formation", time: "2026-12-13T11:30", desc: "Use Find Team and the Recruitment board to build your squad." },
    { title: "Hacking Begins", time: "2026-12-13T13:00", desc: "Start building! Commit often and keep your repo public." },
    { title: "Mentor Sessions", time: "2026-12-14T11:00", desc: "Get feedback on your idea, code and pitch from mentors." },
    { title: "Mid-Point Check-In", time: "2026-12-14T20:00", desc: "Quick progress update from every team." },
    { title: "Submission Deadline", time: "2026-12-15T18:00", desc: "Submit your project on the Submit Project page. No late entries." },
    { title: "Judging & Demos", time: "2026-12-15T19:00", desc: "Teams present their projects to the judges." },
    { title: "Closing Ceremony & Prizes", time: "2026-12-15T21:00", desc: "Winners announced for every sponsor track." }
];


// ---------- 2. SAVING AND LOADING (localStorage + JSON) ----------
function getData(key, defaultValue) {
    let saved = localStorage.getItem(PREFIX + key);
    if (saved === null) {
        return defaultValue;
    }
    return JSON.parse(saved);                       // text -> array / object
}

function saveData(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));   // array / object -> text
}

// load everything when the page opens
let participants = getData("participants", defaultParticipants);
let teams = getData("teams", defaultTeams);
let problems = getData("problems", defaultProblems);
let schedule = getData("schedule", defaultSchedule);
let projects = getData("projects", []);
let announcements = getData("announcements", []);
let voted = getData("voted", []);       // ids of projects this browser already voted for
let requested = [];                     // teams the visitor asked to join (this visit only)


// ---------- 3. SMALL HELPER FUNCTIONS ----------
// makes typed text safe before it is placed inside HTML
function clean(text) {
    text = String(text);
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/"/g, "&quot;");
    return text;
}

// 5 -> "05"
function pad(n) {
    if (n < 10) {
        return "0" + n;
    }
    return String(n);
}

// "2026-12-13T10:00" -> "SUN 13 DEC · 10:00 AM"
function formatTime(text) {
    let d = new Date(text);
    if (isNaN(d)) {
        return text;
    }
    let hours = d.getHours();
    let ampm = "AM";
    if (hours >= 12) {
        ampm = "PM";
    }
    hours = hours % 12;
    if (hours === 0) {
        hours = 12;
    }
    return weekDays[d.getDay()] + " " + d.getDate() + " " + monthNames[d.getMonth()] + " · " + hours + ":" + pad(d.getMinutes()) + " " + ampm;
}

function findProblem(id) {
    for (let i = 0; i < problems.length; i++) {
        if (problems[i].id === id) {
            return problems[i];
        }
    }
    return null;
}

// the <option> tags for a list of all teams (value = position of the team in the array)
function teamOptions() {
    let html = "";
    for (let i = 0; i < teams.length; i++) {
        html += '<option value="' + i + '">' + clean(teams[i].name) + '</option>';
    }
    return html;
}

function getDeadlineText() {
    return getData("deadline", DEFAULT_DEADLINE);
}

function sortSchedule() {
    schedule.sort(function(a, b) {          // callback function (Unit V)
        if (a.time > b.time) { return 1; }
        if (a.time < b.time) { return -1; }
        return 0;
    });
}

// only normal web links are allowed as clickable links
function isWebLink(url) {
    return url.startsWith("http://") || url.startsWith("https://");
}


// ---------- 4. PAGE NAVIGATION (uses the #hash in the address bar) ----------
function showPage(id) {
    if (!pages.includes(id)) {
        id = "home";
    }

    for (let i = 0; i < pages.length; i++) {
        let page = document.getElementById(pages[i]);
        if (pages[i] === id) {
            page.classList.add("active");
        } else {
            page.classList.remove("active");
        }
    }

    // highlight the matching menu link
    let links = document.querySelectorAll("nav a");
    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute("data-page") === id) {
            links[i].classList.add("active");
        } else {
            links[i].classList.remove("active");
        }
    }

    window.scrollTo(0, 0);

    // refresh the content of the page we are opening
    if (id === "home") { showAnnouncements(); }
    if (id === "matcher") { filterParticipants(); }
    if (id === "recruitment") { showTeams(); }
    if (id === "schedule") { showSchedule(); }
    if (id === "problems") { showProblems(); }
    if (id === "projects") { renderProjects(); }
    if (id === "organizer") { showOrganizer(); }
}


// ---------- 5. COUNTDOWN (Date object) ----------
function updateCountdown() {
    let deadline = new Date(getDeadlineText());
    let diff = deadline - new Date();            // difference in milliseconds

    if (diff <= 0) {
        diff = 0;
        document.getElementById("cdLabel").innerText = "SUBMISSIONS ARE CLOSED";
    } else {
        document.getElementById("cdLabel").innerText = "SUBMISSIONS CLOSE IN";
    }

    let totalSeconds = Math.floor(diff / 1000);
    document.getElementById("cdDays").innerText = Math.floor(totalSeconds / 86400);
    document.getElementById("cdHours").innerText = pad(Math.floor((totalSeconds % 86400) / 3600));
    document.getElementById("cdMins").innerText = pad(Math.floor((totalSeconds % 3600) / 60));
    document.getElementById("cdSecs").innerText = pad(totalSeconds % 60);
}


// ---------- 6. ANNOUNCEMENTS (shown on the home page) ----------
function showAnnouncements() {
    let html = "";
    for (let i = announcements.length - 1; i >= 0; i--) {      // newest first
        html += '<div class="announce"><p>' + clean(announcements[i].text) + '</p><small>' + announcements[i].time + '</small></div>';
    }

    document.getElementById("announceList").innerHTML = html;
    if (html === "") {
        document.getElementById("announceSection").style.display = "none";
    } else {
        document.getElementById("announceSection").style.display = "block";
    }
}


// ---------- 7. FIND TEAM (participants) ----------
function filterParticipants() {
    let search = document.getElementById("searchName").value.toLowerCase().trim();
    let skill = document.getElementById("skillFilter").value;
    let html = "";

    for (let i = 0; i < participants.length; i++) {
        let p = participants[i];
        let nameMatch = p.name.toLowerCase().includes(search);
        let skillMatch = (skill === "All" || p.skill === skill);

        if (nameMatch && skillMatch) {
            html += '<div class="card participant">';
            html += '<h3>' + clean(p.name) + '</h3>';
            html += '<p>' + clean(p.bio) + '</p>';
            html += '<span class="skill">' + p.skill + '</span>';
            html += '<p>Experience: ' + p.level + '</p>';
            html += '<button class="btn" onclick="connect(' + i + ')">Connect</button>';
            html += '</div>';
        }
    }

    if (html === "") {
        html = '<p class="no-results">🔍 No Participants Found!<br>Sorry, we couldn\'t find anyone matching your search. Try another name or skill.</p>';
    }
    document.getElementById("participantList").innerHTML = html;
}

function connect(i) {
    alert("Connection request sent to " + participants[i].name + "!");
}

function registerParticipant(event) {
    event.preventDefault();               // stop the page from reloading

    let name = document.getElementById("regName").value.trim();

    participants.push({
        name: name,
        skill: document.getElementById("regSkill").value,
        level: document.getElementById("regLevel").value,
        bio: document.getElementById("regBio").value.trim()
    });
    saveData("participants", participants);

    document.getElementById("registerMessage").innerText = "Welcome, " + name + "! You are now listed in the lounge.";
    document.getElementById("registerForm").reset();
    filterParticipants();
}


// ---------- 8. RECRUITMENT BOARD (teams) ----------
function teamCard(i) {
    let t = teams[i];
    let html = '<div class="card">';
    html += '<h3>' + clean(t.name) + '</h3>';
    html += '<p>Project: ' + clean(t.project) + '</p>';
    html += '<p>Looking for: ' + clean(t.looking) + '</p>';
    html += '<span class="skill">' + t.skill + '</span>';

    let problem = findProblem(t.problemId);
    if (problem !== null) {
        html += '<span class="assigned-problem">📌 Problem: ' + clean(problem.title) + '</span>';
    }

    // one circle per member; the details appear when the mouse is over it
    html += '<div class="team-members"><span class="team-members-title">TEAM MEMBERS (hover)</span><div class="member-list">';
    for (let m = 0; m < t.members.length; m++) {
        let member = t.members[m];
        html += '<div class="member" tabindex="0">';
        html += '<div class="member-avatar">' + clean(member.name.charAt(0).toUpperCase()) + '</div>';
        html += '<div class="member-tooltip"><strong>' + clean(member.name) + '</strong>';
        html += '<span class="member-role">' + clean(member.role) + '</span>';
        html += '<span class="member-task">' + clean(member.task) + '</span></div></div>';
    }
    html += '</div></div>';

    if (requested.includes(i)) {
        html += '<button class="btn" disabled>Request Sent</button>';
    } else {
        html += '<button class="btn" onclick="joinTeam(' + i + ')">Join Team</button>';
    }
    return html + '</div>';
}

function showTeams() {
    let html = "";

    for (let s = 0; s < skills.length; s++) {
        let cards = "";
        let count = 0;

        for (let i = 0; i < teams.length; i++) {
            if (teams[i].skill === skills[s]) {
                cards += teamCard(i);
                count++;
            }
        }

        let word = " teams working";
        if (count === 1) {
            word = " team working";
        }
        if (count === 0) {
            cards = '<div class="column-empty">No teams looking for this skill yet.</div>';
        }

        html += '<div class="board-column ' + columnClasses[s] + '">';
        html += '<div class="column-header"><span>' + icons[s] + ' ' + skills[s] + '</span>';
        html += '<span class="column-count">' + count + word + '</span></div>';
        html += cards + '</div>';
    }

    document.getElementById("teamList").innerHTML = html;
}

function joinTeam(i) {
    requested.push(i);
    document.getElementById("joinMessage").innerText = "You have requested to join " + teams[i].name + "!";
    showTeams();
}

function createTeam(event) {
    event.preventDefault();

    let skill = document.getElementById("newTeamSkill").value;
    let lead = document.getElementById("newTeamLead").value.trim();

    teams.push({
        name: document.getElementById("newTeamName").value.trim(),
        project: document.getElementById("newTeamProject").value.trim(),
        skill: skill,
        looking: skill + " teammate",
        problemId: null,
        members: [ { name: lead, role: "Team Lead", task: document.getElementById("newTeamTask").value.trim() } ]
    });
    saveData("teams", teams);

    document.getElementById("teamMessage").innerText = "Team posted! It now appears in the " + skill + " column.";
    document.getElementById("teamForm").reset();
    showTeams();
}


// ---------- 9. SCHEDULE ----------
function showSchedule() {
    let html = "";
    let now = new Date();

    for (let i = 0; i < schedule.length; i++) {
        let e = schedule[i];
        let css = "timeline-item";
        if (new Date(e.time) < now) {
            css = "timeline-item done";          // this event is already over
        }
        html += '<div class="' + css + '"><div class="timeline-time">' + formatTime(e.time) + '</div>';
        html += '<h3>' + clean(e.title) + '</h3><p>' + clean(e.desc) + '</p></div>';
    }

    if (html === "") {
        html = '<p class="section-description">No events scheduled yet.</p>';
    }
    document.getElementById("timeline").innerHTML = html;
}


// ---------- 10. PROBLEM STATEMENTS ----------
function showProblems() {
    let html = "";

    for (let i = 0; i < problems.length; i++) {
        let p = problems[i];
        html += '<div class="card"><h3>' + clean(p.title) + '</h3>';
        html += '<span class="skill">' + p.track + '</span>';
        html += '<p>' + clean(p.desc) + '</p>';

        // which teams are working on this problem?
        let names = "";
        for (let t = 0; t < teams.length; t++) {
            if (teams[t].problemId === p.id) {
                names += '<span class="skill">' + clean(teams[t].name) + '</span>';
            }
        }
        if (names === "") {
            html += '<p>Not assigned to any team yet.</p>';
        } else {
            html += '<p>Assigned teams:</p>' + names;
        }

        // "choose" button + hidden panel for the team leader
        html += '<button class="btn" style="margin-top:14px;" onclick="togglePanel(' + i + ')">Choose this problem</button>';
        html += '<div class="choose-panel" id="panel' + i + '">';
        html += '<p>Team leaders only: pick your team and enter your name.</p>';
        html += '<select id="chooseTeam' + i + '">' + teamOptions() + '</select>';
        html += '<input type="text" id="chooseLeader' + i + '" placeholder="Team leader name">';
        html += '<button class="btn" onclick="chooseProblem(' + i + ')">Confirm Choice</button>';
        html += '<p class="message" id="chooseMsg' + i + '"></p></div></div>';
    }

    if (html === "") {
        html = '<p class="no-results">🧩 No problem statements yet. Check back soon!</p>';
    }
    document.getElementById("problemList").innerHTML = html;
}

function togglePanel(i) {
    let panel = document.getElementById("panel" + i);
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
}

function chooseProblem(i) {
    let team = teams[document.getElementById("chooseTeam" + i).value];
    let name = document.getElementById("chooseLeader" + i).value.trim().toLowerCase();
    let message = document.getElementById("chooseMsg" + i);

    if (team === undefined || name === "") {
        message.innerText = "Pick your team and enter your name.";
        return;
    }

    // only the leader (the first member) may choose
    if (name !== team.members[0].name.toLowerCase()) {
        message.innerText = "Only the team leader of " + team.name + " can choose a problem.";
        return;
    }

    // a team can choose only one problem
    if (team.problemId !== null) {
        let current = findProblem(team.problemId);
        let title = "a problem";
        if (current !== null) {
            title = '"' + current.title + '"';
        }
        message.innerText = team.name + " already chose " + title + ". Ask an organizer to change it.";
        return;
    }

    team.problemId = problems[i].id;
    saveData("teams", teams);
    showProblems();
    document.getElementById("chooseMessage").innerText = team.name + ' chose "' + problems[i].title + '"!';
}


// ---------- 11. PROJECT GALLERY AND VOTING ----------
function renderProjects() {
    let filter = document.getElementById("trackFilter").value;

    let sorted = projects.slice();               // a copy, so the saved order does not change
    sorted.sort(function(a, b) {
        return b.votes - a.votes;                // most votes first
    });

    let html = "";
    let shown = 0;

    for (let i = 0; i < sorted.length; i++) {
        let p = sorted[i];
        if (filter !== "All" && p.track !== filter) {
            continue;                            // skip projects of other tracks
        }

        let css = "card";
        let trophy = "";
        if (shown === 0 && p.votes > 0) {
            css = "card top-project";
            trophy = "🏆 ";
        }
        shown++;

        html += '<div class="' + css + '"><h3>' + trophy + clean(p.title) + '</h3>';
        html += '<p>Team: ' + clean(p.team) + '</p>';
        html += '<span class="skill">' + p.track + '</span>';
        html += '<p>' + clean(p.description) + '</p><div class="project-links">';
        if (isWebLink(p.github)) { html += '<a href="' + clean(p.github) + '" target="_blank">GitHub ↗</a>'; }
        if (isWebLink(p.demo)) { html += '<a href="' + clean(p.demo) + '" target="_blank">Live Demo ↗</a>'; }
        if (isWebLink(p.video)) { html += '<a href="' + clean(p.video) + '" target="_blank">Video Pitch ↗</a>'; }
        html += '</div>';

        if (voted.includes(p.id)) {
            html += '<button class="btn" disabled>▲ Voted · ' + p.votes + '</button>';
        } else {
            html += '<button class="btn" onclick="upvote(' + p.id + ')">▲ Upvote · ' + p.votes + '</button>';
        }
        html += '</div>';
    }

    if (html === "") {
        html = '<p class="no-results">📭 No projects here yet! Be the first to submit one.</p>';
    }
    document.getElementById("projectList").innerHTML = html;
}

function upvote(id) {
    if (voted.includes(id)) {
        return;
    }
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].id === id) {
            projects[i].votes = projects[i].votes + 1;
        }
    }
    voted.push(id);
    saveData("projects", projects);
    saveData("voted", voted);
    renderProjects();
}


// ---------- 12. SUBMIT A PROJECT ----------
function submitProject(event) {
    event.preventDefault();
    let message = document.getElementById("successMessage");

    // no new projects after the deadline
    if (new Date() > new Date(getDeadlineText())) {
        message.innerText = "Submissions are closed. The deadline has passed.";
        return;
    }

    projects.push({
        id: Date.now(),                          // current time in milliseconds = a unique number
        team: document.getElementById("teamName").value.trim(),
        title: document.getElementById("projectTitle").value.trim(),
        github: document.getElementById("github").value.trim(),
        demo: document.getElementById("demo").value.trim(),
        video: document.getElementById("video").value.trim(),
        track: document.getElementById("track").value,
        description: document.getElementById("description").value.trim(),
        votes: 0
    });
    saveData("projects", projects);

    message.innerText = "Project submitted successfully! Best of luck!";
    document.getElementById("projectForm").reset();
}


// ---------- 13. ORGANIZER: LOGIN ----------
function login(event) {
    event.preventDefault();

    if (document.getElementById("orgPass").value === PASSCODE) {
        sessionStorage.setItem(PREFIX + "organizer", "yes");     // remembered until the tab is closed
        document.getElementById("orgLoginMessage").innerText = "";
        document.getElementById("orgLoginForm").reset();
        showOrganizer();
    } else {
        document.getElementById("orgLoginMessage").innerText = "Wrong passcode. Please try again.";
    }
}

function logout() {
    sessionStorage.removeItem(PREFIX + "organizer");
    showOrganizer();
}

function showOrganizer() {
    if (sessionStorage.getItem(PREFIX + "organizer") === "yes") {
        document.getElementById("orgLogin").style.display = "none";
        document.getElementById("orgPanel").style.display = "block";
        document.getElementById("orgDeadline").value = getDeadlineText();
        showScheduleEditor();
        showProblemEditor();
        showAssign();
        showAnnounceEditor();
    } else {
        document.getElementById("orgLogin").style.display = "block";
        document.getElementById("orgPanel").style.display = "none";
    }
}


// ---------- 14. ORGANIZER: DEADLINE ----------
function saveDeadline() {
    let value = document.getElementById("orgDeadline").value;
    if (value === "") {
        document.getElementById("deadlineMessage").innerText = "Please choose a date and time.";
        return;
    }
    saveData("deadline", value);
    updateCountdown();
    document.getElementById("deadlineMessage").innerText = "Deadline updated. The Home countdown now uses it.";
}


// ---------- 15. ORGANIZER: SCHEDULE ----------
function showScheduleEditor() {
    let html = "";
    for (let i = 0; i < schedule.length; i++) {
        let e = schedule[i];
        html += '<div class="org-row">';
        html += '<input type="text" id="editTitle' + i + '" value="' + clean(e.title) + '">';
        html += '<input type="datetime-local" id="editTime' + i + '" value="' + e.time + '">';
        html += '<input type="text" id="editDesc' + i + '" value="' + clean(e.desc) + '">';
        html += '<button class="btn" onclick="saveEvent(' + i + ')">Save</button>';
        html += '<button class="btn danger" onclick="deleteEvent(' + i + ')">Delete</button></div>';
    }
    if (html === "") {
        html = '<p class="section-description">No events yet. Add one above.</p>';
    }
    document.getElementById("orgScheduleList").innerHTML = html;
}

function saveEvent(i) {
    let title = document.getElementById("editTitle" + i).value.trim();
    let time = document.getElementById("editTime" + i).value;

    if (title === "" || time === "") {
        document.getElementById("scheduleMessage").innerText = "Title and time are required.";
        return;
    }
    schedule[i].title = title;
    schedule[i].time = time;
    schedule[i].desc = document.getElementById("editDesc" + i).value.trim();

    sortSchedule();
    saveData("schedule", schedule);
    showScheduleEditor();
    document.getElementById("scheduleMessage").innerText = "Event updated.";
}

function deleteEvent(i) {
    schedule.splice(i, 1);                       // remove 1 item at position i
    saveData("schedule", schedule);
    showScheduleEditor();
    document.getElementById("scheduleMessage").innerText = "Event deleted.";
}

function addEvent(event) {
    event.preventDefault();

    schedule.push({
        title: document.getElementById("evTitle").value.trim(),
        time: document.getElementById("evTime").value,
        desc: document.getElementById("evDesc").value.trim()
    });
    sortSchedule();
    saveData("schedule", schedule);
    showScheduleEditor();
    document.getElementById("addEventForm").reset();
    document.getElementById("scheduleMessage").innerText = "Event added to the schedule.";
}


// ---------- 16. ORGANIZER: PROBLEM STATEMENTS ----------
function showProblemEditor() {
    let html = "";
    for (let i = 0; i < problems.length; i++) {
        let p = problems[i];
        html += '<div class="org-row">';
        html += '<input type="text" id="editPrTitle' + i + '" value="' + clean(p.title) + '">';
        html += '<span class="org-track">' + p.track + '</span>';
        html += '<input type="text" id="editPrDesc' + i + '" value="' + clean(p.desc) + '">';
        html += '<button class="btn" onclick="saveProblem(' + i + ')">Save</button>';
        html += '<button class="btn danger" onclick="deleteProblem(' + i + ')">Delete</button></div>';
    }
    if (html === "") {
        html = '<p class="section-description">No problem statements yet. Add one above.</p>';
    }
    document.getElementById("orgProblemList").innerHTML = html;
}

function saveProblem(i) {
    let title = document.getElementById("editPrTitle" + i).value.trim();
    if (title === "") {
        document.getElementById("problemMessage").innerText = "Title is required.";
        return;
    }
    problems[i].title = title;
    problems[i].desc = document.getElementById("editPrDesc" + i).value.trim();
    saveData("problems", problems);
    showOrganizer();
    document.getElementById("problemMessage").innerText = "Problem statement updated.";
}

function deleteProblem(i) {
    let id = problems[i].id;
    problems.splice(i, 1);

    // teams that had chosen this problem become free again
    for (let t = 0; t < teams.length; t++) {
        if (teams[t].problemId === id) {
            teams[t].problemId = null;
        }
    }
    saveData("problems", problems);
    saveData("teams", teams);
    showOrganizer();
    document.getElementById("problemMessage").innerText = "Problem statement deleted.";
}

function addProblem(event) {
    event.preventDefault();

    problems.push({
        id: Date.now(),
        title: document.getElementById("prTitle").value.trim(),
        track: document.getElementById("prTrack").value,
        desc: document.getElementById("prDesc").value.trim()
    });
    saveData("problems", problems);
    document.getElementById("addProblemForm").reset();
    showOrganizer();
    document.getElementById("problemMessage").innerText = "Problem statement added.";
}


// ---------- 17. ORGANIZER: ASSIGN A PROBLEM TO A TEAM ----------
function showAssign() {
    document.getElementById("assignTeam").innerHTML = teamOptions();

    let options = "";
    for (let i = 0; i < problems.length; i++) {
        options += '<option value="' + problems[i].id + '">' + clean(problems[i].title) + '</option>';
    }
    document.getElementById("assignProblem").innerHTML = options;

    // list of teams that already have a problem
    let html = "";
    for (let t = 0; t < teams.length; t++) {
        let problem = findProblem(teams[t].problemId);
        if (problem !== null) {
            html += '<div class="org-line"><span>' + clean(teams[t].name) + '  →  ' + clean(problem.title) + '</span>';
            html += '<button class="btn danger" onclick="unassign(' + t + ')">Unassign</button></div>';
        }
    }
    document.getElementById("assignmentList").innerHTML = html;
}

function assignProblem() {
    let team = teams[document.getElementById("assignTeam").value];
    let problemId = Number(document.getElementById("assignProblem").value);    // text -> number

    if (team === undefined || findProblem(problemId) === null) {
        document.getElementById("assignMessage").innerText = "Pick a team and a problem statement first.";
        return;
    }
    team.problemId = problemId;
    saveData("teams", teams);
    showAssign();
    document.getElementById("assignMessage").innerText = team.name + " has been assigned a problem statement.";
}

function unassign(t) {
    teams[t].problemId = null;
    saveData("teams", teams);
    showAssign();
}


// ---------- 18. ORGANIZER: ANNOUNCEMENTS ----------
function showAnnounceEditor() {
    let html = "";
    for (let i = announcements.length - 1; i >= 0; i--) {
        html += '<div class="org-line"><span>' + clean(announcements[i].text) + '</span>';
        html += '<button class="btn danger" onclick="deleteAnnouncement(' + i + ')">Delete</button></div>';
    }
    document.getElementById("orgAnnounceList").innerHTML = html;
}

function addAnnouncement(event) {
    event.preventDefault();

    announcements.push({
        text: document.getElementById("announceText").value.trim(),
        time: new Date().toLocaleString()
    });
    saveData("announcements", announcements);
    document.getElementById("announceForm").reset();
    showAnnounceEditor();
    showAnnouncements();
    document.getElementById("announceMessage").innerText = "Announcement posted on the Home page.";
}

function deleteAnnouncement(i) {
    announcements.splice(i, 1);
    saveData("announcements", announcements);
    showAnnounceEditor();
    showAnnouncements();
}


// ---------- 19. ORGANIZER: DOWNLOAD DATA AND RESET ----------
function exportData() {
    // which team chose which problem
    let assignments = {};
    for (let t = 0; t < teams.length; t++) {
        if (teams[t].problemId !== null) {
            assignments[teams[t].name] = teams[t].problemId;
        }
    }

    let everything = {
        exportedAt: new Date().toISOString(),
        deadline: getDeadlineText(),
        schedule: schedule,
        problems: problems,
        assignments: assignments,
        participants: participants,
        teams: teams,
        projects: projects,
        announcements: announcements
    };

    // turn the object into text and download it as a .json file
    let text = JSON.stringify(everything, null, 2);
    let link = document.createElement("a");
    link.href = "data:application/json;charset=utf-8," + encodeURIComponent(text);
    link.download = "hackmate-data.json";
    link.click();

    document.getElementById("dataMessage").innerText = "Data downloaded as hackmate-data.json.";
}

function resetAll() {
    if (confirm("Delete ALL saved HackMate data (teams, projects, votes, schedule edits)?")) {
        let keys = ["participants", "teams", "projects", "voted", "schedule", "problems", "announcements", "deadline"];
        for (let i = 0; i < keys.length; i++) {
            localStorage.removeItem(PREFIX + keys[i]);
        }
        location.reload();
    }
}


// ---------- 20. EVENTS: CONNECT BUTTONS AND FORMS TO FUNCTIONS ----------
window.addEventListener("hashchange", function() {
    showPage(location.hash.replace("#", ""));
});

document.getElementById("registerForm").addEventListener("submit", registerParticipant);
document.getElementById("teamForm").addEventListener("submit", createTeam);
document.getElementById("projectForm").addEventListener("submit", submitProject);
document.getElementById("orgLoginForm").addEventListener("submit", login);
document.getElementById("orgLogout").addEventListener("click", logout);
document.getElementById("saveDeadline").addEventListener("click", saveDeadline);
document.getElementById("addEventForm").addEventListener("submit", addEvent);
document.getElementById("addProblemForm").addEventListener("submit", addProblem);
document.getElementById("assignBtn").addEventListener("click", assignProblem);
document.getElementById("announceForm").addEventListener("submit", addAnnouncement);
document.getElementById("exportBtn").addEventListener("click", exportData);
document.getElementById("resetBtn").addEventListener("click", resetAll);


// ---------- 21. START THE PAGE ----------
sortSchedule();
updateCountdown();
setInterval(updateCountdown, 1000);        // run the countdown again every 1000 ms
showPage(location.hash.replace("#", ""));
