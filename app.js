const STORAGE_KEY = "fitnessProfiles";

const defaultProfiles = [
  { firstName: "Alex", lastName: "Johnson", goals: "Strength cycle week 6", phone: "555-100-2244", email: "alex.johnson@example.com", age: 31, birthday: "1994-03-18", createdAt: "2026-01-08" },
  { firstName: "Priya", lastName: "Shah", goals: "Weight loss phase", phone: "555-103-4002", email: "priya.shah@example.com", age: 29, birthday: "1996-09-02", createdAt: "2025-12-15" },
  { firstName: "Mateo", lastName: "Rivera", goals: "Mobility and recovery", phone: "555-222-6005", email: "mateo.rivera@example.com", age: 37, birthday: "1988-04-26", createdAt: "2026-02-01" },
  { firstName: "Sophia", lastName: "Lee", goals: "Endurance progression", phone: "555-002-9012", email: "sophia.lee@example.com", age: 33, birthday: "1992-07-29", createdAt: "2025-11-05" },
];

const equipmentExercises = {
  Bodyweight: ["Push-up", "Plank", "Crunch", "Air Squat", "Lunge", "Burpee", "Mountain Climber", "Glute Bridge"],
  Dumbbell: ["Goblet Squat", "Dumbbell Bench Press", "Dumbbell Row", "Shoulder Press", "Romanian Deadlift", "Curl", "Triceps Extension"],
  Barbell: ["Back Squat", "Deadlift", "Bench Press", "Overhead Press", "Bent-Over Row", "Hip Thrust", "Front Squat"],
  Kettlebell: ["Kettlebell Swing", "Turkish Get-Up", "Goblet Squat", "Clean and Press", "Single-Arm Row", "Snatch"],
  Machine: ["Leg Press", "Leg Extension", "Leg Curl", "Chest Press", "Lat Pulldown", "Seated Row", "Cable Fly"],
  Cable: ["Cable Row", "Cable Press", "Face Pull", "Triceps Pushdown", "Cable Curl", "Woodchop"],
  "Resistance Band": ["Band Squat", "Band Row", "Band Chest Press", "Band Pull-Apart", "Band Deadlift", "Band Lateral Walk"],
  "Medicine Ball": ["Medicine Ball Slam", "Wall Ball", "Russian Twist", "Medicine Ball Sit-Up", "Chest Pass"],
  "Stability Ball": ["Stability Ball Crunch", "Hamstring Curl", "Stir the Pot", "Back Extension"],
  TRX: ["TRX Row", "TRX Push-up", "TRX Split Squat", "TRX Hamstring Curl", "TRX Pike"],
  "Smith Machine": ["Smith Squat", "Smith Bench Press", "Smith Row", "Smith Split Squat"],
  Landmine: ["Landmine Press", "Landmine Squat", "Landmine Row", "Landmine Rotation"],
  Sandbag: ["Sandbag Carry", "Sandbag Clean", "Sandbag Front Squat", "Sandbag Lunge"],
  "Battle Rope": ["Alternating Waves", "Double Waves", "Slam Waves", "Side-to-Side Waves"],
  Sled: ["Sled Push", "Sled Pull", "Backward Sled Drag"],
  Treadmill: ["Run Intervals", "Incline Walk", "Tempo Run", "Recovery Walk"],
  Bike: ["Bike Sprint", "Steady Ride", "Hill Intervals", "Recovery Spin"],
  Rower: ["500m Row", "Power Strokes", "Steady Row", "Interval Row"],
  Elliptical: ["Resistance Intervals", "Steady Cardio", "Reverse Elliptical"],
  "Jump Rope": ["Basic Jump", "Single-Leg Jump", "Double Under Practice", "Interval Skips"],
};

function loadProfiles() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (_error) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfiles));
      return defaultProfiles;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfiles));
  return defaultProfiles;
}

function saveProfiles(profiles) { localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)); }

function daysTraining(createdAt) {
  return Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)));
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function renderProfiles() {
  const list = document.getElementById("user-list");
  if (!list) return;

  list.innerHTML = "";
  for (const profile of loadProfiles()) {
    const item = document.createElement("li");
    item.className = "user-item";
    item.innerHTML = `<div><h3>${profile.firstName} ${profile.lastName}</h3><p>${profile.goals}</p><p class="profile-meta">Training since ${formatDate(profile.createdAt)} • ${daysTraining(profile.createdAt)} days</p></div><span class="status">Active</span>`;
    list.append(item);
  }

  const flash = document.getElementById("flash-message");
  if (flash && new URLSearchParams(window.location.search).get("created") === "1") {
    flash.hidden = false;
    window.history.replaceState({}, "", "users.html");
  }
}

function attachFormHandler() {
  const form = document.getElementById("new-profile-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const profiles = loadProfiles();
    profiles.push({
      firstName: String(formData.get("firstName") || "").trim(),
      lastName: String(formData.get("lastName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      age: Number(formData.get("age")),
      birthday: String(formData.get("birthday") || "").trim(),
      goals: String(formData.get("goals") || "").trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    });
    saveProfiles(profiles);
    window.location.href = "users.html?created=1";
  });
}

function setStep(row, step) {
  row.dataset.step = step;
  for (const panel of row.querySelectorAll("[data-step-panel]")) {
    panel.hidden = panel.dataset.stepPanel !== step;
  }
}

function fillExerciseOptions(row) {
  const equipment = row.querySelector(".equipment-select");
  const exercise = row.querySelector(".exercise-select");
  if (!equipment || !exercise) return;

  equipment.innerHTML = Object.keys(equipmentExercises)
    .map((name) => `<option value="${name}">${name}</option>`)
    .join("");

  const refreshExercises = () => {
    const selected = equipmentExercises[equipment.value] || [];
    exercise.innerHTML = selected.map((item) => `<option value="${item}">${item}</option>`).join("");
  };

  equipment.addEventListener("change", () => {
    refreshExercises();
    setStep(row, "exercise");
  });

  exercise.addEventListener("change", () => setStep(row, "metrics"));

  refreshExercises();
}

function addWorkoutRow(type) {
  const container = document.getElementById("exercise-rows");
  const template = document.getElementById(type === "rest" ? "rest-row-template" : "exercise-row-template");
  if (!container || !template) return;

  const fragment = template.content.cloneNode(true);
  const row = fragment.querySelector(".exercise-row");
  container.append(row);

  if (type === "exercise") {
    fillExerciseOptions(row);
    setStep(row, "equipment");
  }

  const remove = row.querySelector(".remove-row-btn");
  if (remove) {
    remove.addEventListener("click", () => row.remove());
  }
}

function validateWorkoutForm(form) {
  for (const row of form.querySelectorAll(".exercise-row")) {
    const type = row.dataset.type;
    const sets = row.querySelector('input[name="sets"]');
    const reps = row.querySelector('input[name="reps"]');
    const time = row.querySelector('input[name="time"]');

    if (!sets?.value) {
      sets.reportValidity();
      return false;
    }

    if (type === "exercise") {
      reps?.setCustomValidity("");
      time?.setCustomValidity("");
      if (!reps?.value && !time?.value) {
        reps?.setCustomValidity("Enter reps or time.");
        reps?.reportValidity();
        return false;
      }
    }

    if (type === "rest" && !time?.value) {
      time?.setCustomValidity("Enter rest time in seconds.");
      time?.reportValidity();
      return false;
    }
  }
  return form.querySelectorAll(".exercise-row").length > 0;
}

function initWorkoutBuilder() {
  const form = document.getElementById("workout-form");
  if (!form) return;

  document.getElementById("add-exercise")?.addEventListener("click", () => addWorkoutRow("exercise"));
  document.getElementById("add-rest")?.addEventListener("click", () => addWorkoutRow("rest"));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.getElementById("workout-message");
    if (!validateWorkoutForm(form)) {
      if (message) message.hidden = true;
      return;
    }
    if (message) message.hidden = false;
  });
}

renderProfiles();
attachFormHandler();
initWorkoutBuilder();
