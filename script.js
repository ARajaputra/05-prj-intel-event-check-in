const form = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountElement = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const celebration = document.getElementById("celebration");
const attendeeList = document.getElementById("attendeeList");

const maxGoal = 50;
const teamKeys = ["water", "zero", "power"];
let attendeeCount = 0;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
let attendeeRecords = [];

const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

function loadSavedData() {
  const savedTotal = localStorage.getItem("intelSummitAttendeeCount");
  const savedTeamCounts = localStorage.getItem("intelSummitTeamCounts");
  const savedAttendees = localStorage.getItem("intelSummitAttendeeList");

  if (savedTotal !== null) {
    attendeeCount = Number(savedTotal);
  }

  if (savedTeamCounts !== null) {
    const parsedCounts = JSON.parse(savedTeamCounts);

    teamKeys.forEach(function (team) {
      teamCounts[team] = Number(parsedCounts[team]) || 0;
    });
  }

  if (savedAttendees !== null) {
    attendeeRecords = JSON.parse(savedAttendees);
  }
}

function saveData() {
  localStorage.setItem("intelSummitAttendeeCount", String(attendeeCount));
  localStorage.setItem("intelSummitTeamCounts", JSON.stringify(teamCounts));
  localStorage.setItem(
    "intelSummitAttendeeList",
    JSON.stringify(attendeeRecords),
  );
}

function updateAttendeeCount() {
  attendeeCountElement.textContent = attendeeCount;

  const percentage = (attendeeCount / maxGoal) * 100;
  progressBar.style.width = `${Math.min(percentage, 100)}%`;
}

function updateTeamCounts() {
  teamKeys.forEach(function (team) {
    const countElement = document.getElementById(team + "Count");
    countElement.textContent = teamCounts[team];
  });
}

function getWinningTeam() {
  let winningTeam = "water";

  teamKeys.forEach(function (team) {
    if (teamCounts[team] > teamCounts[winningTeam]) {
      winningTeam = team;
    }
  });

  return winningTeam;
}

function updateCelebration() {
  if (attendeeCount >= maxGoal) {
    const winner = getWinningTeam();
    celebration.textContent = `🎉 Goal reached! ${teamLabels[winner]} wins the sustainability challenge!`;
    celebration.style.display = "block";
    return;
  }

  celebration.textContent = "";
  celebration.style.display = "none";
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  attendeeRecords.forEach(function (person) {
    const listItem = document.createElement("li");
    listItem.className = "attendee-item";

    const nameElement = document.createElement("span");
    nameElement.className = "attendee-name";
    nameElement.textContent = person.name;

    const teamElement = document.createElement("span");
    teamElement.className = "attendee-team";
    teamElement.textContent = person.team;

    listItem.appendChild(nameElement);
    listItem.appendChild(teamElement);
    attendeeList.appendChild(listItem);
  });
}

function refreshStats() {
  updateAttendeeCount();
  updateTeamCounts();
  updateCelebration();
  renderAttendeeList();
}

loadSavedData();
refreshStats();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (attendeeName === "" || selectedTeam === "") {
    return;
  }

  attendeeCount++;
  teamCounts[selectedTeam]++;

  attendeeRecords.push({
    name: attendeeName,
    team: teamLabels[selectedTeam],
  });

  saveData();
  refreshStats();

  greeting.textContent = `Welcome ${attendeeName}! You’re checked in for ${teamLabels[selectedTeam]}.`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  form.reset();
});
