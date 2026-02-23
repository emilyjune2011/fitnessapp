const STORAGE_KEY = "fitnessProfiles";
const ACCOUNT_KEY = "fitnessUserAccounts";
const INVITE_KEY = "fitnessInviteTokens";
const SESSION_KEY = "fitnessSession";

const defaultProfiles = [
  { firstName: "Alex", lastName: "Johnson", goals: "Strength cycle week 6", restrictions: "Avoid deep knee flexion", phone: "555-100-2244", email: "alex.johnson@example.com", age: 31, birthday: "1994-03-18", createdAt: "2026-01-08" },
  { firstName: "Priya", lastName: "Shah", goals: "Weight loss phase", restrictions: "None", phone: "555-103-4002", email: "priya.shah@example.com", age: 29, birthday: "1996-09-02", createdAt: "2025-12-15" },
  { firstName: "Mateo", lastName: "Rivera", goals: "Mobility and recovery", restrictions: "Low back sensitivity", phone: "555-222-6005", email: "mateo.rivera@example.com", age: 37, birthday: "1988-04-26", createdAt: "2026-02-01" },
  { firstName: "Sophia", lastName: "Lee", goals: "Endurance progression", restrictions: "No overhead pressing", phone: "555-002-9012", email: "sophia.lee@example.com", age: 33, birthday: "1992-07-29", createdAt: "2025-11-05" },
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

function loadJson(key, fallback) {
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored);
  } catch (_error) {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadProfiles() {
  const profiles = loadJson(STORAGE_KEY, null);
  if (profiles) return profiles;
  saveJson(STORAGE_KEY, defaultProfiles);
  return defaultProfiles;
}

function saveProfiles(profiles) {
  saveJson(STORAGE_KEY, profiles);
}

function loadAccounts() {
  return loadJson(ACCOUNT_KEY, []);
}

function saveAccounts(accounts) {
  saveJson(ACCOUNT_KEY, accounts);
}

function loadInvites() {
  return loadJson(INVITE_KEY, {});
}

function saveInvites(invites) {
  saveJson(INVITE_KEY, invites);
}

function setSession(role, profileIndex = null) {
  saveJson(SESSION_KEY, { role, profileIndex });
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getSession() {
  return loadJson(SESSION_KEY, null);
}

function daysTraining(createdAt) {
  return Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)));
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function ensureTrainerPage() {
  const trainerPages = new Set(["trainer-home.html", "users.html", "new-user.html", "profile.html", "build-workout.html"]);
  const current = window.location.pathname.split("/").pop() || "index.html";
  if (!trainerPages.has(current)) return;
  const session = getSession();
  if (!session || session.role !== "trainer") {
    window.location.href = "index.html";
  }
}

function initLogout() {
  document.getElementById("logout-btn")?.addEventListener("click", () => {
    clearSession();
    window.location.href = "index.html";
  });
}

function renderProfiles() {
  const list = document.getElementById("user-list");
  if (!list) return;

  list.innerHTML = "";
  const profiles = loadProfiles();

  profiles.forEach((profile, index) => {
    const item = document.createElement("li");
    item.className = "user-item";

    const link = document.createElement("a");
    link.className = "user-link";
    link.href = `profile.html?index=${index}`;

    const info = document.createElement("div");
    info.innerHTML = `
      <h3>${profile.firstName}</h3>
      <p><strong>Age:</strong> ${profile.age ?? "—"}</p>
      <p><strong>Goals:</strong> ${profile.goals || "—"}</p>
      <p><strong>Restrictions:</strong> ${profile.restrictions || "None listed"}</p>
    `;

    const arrow = document.createElement("span");
    arrow.className = "user-arrow";
    arrow.textContent = "›";

    link.append(info, arrow);
    item.append(link);
    list.append(item);
  });

  const flash = document.getElementById("flash-message");
  if (flash && new URLSearchParams(window.location.search).get("created") === "1") {
    flash.hidden = false;
    window.history.replaceState({}, "", "users.html");
  }
}

function renderProfileDetail() {
  const title = document.getElementById("profile-name");
  if (!title) return;

  const index = Number(new URLSearchParams(window.location.search).get("index"));
  const profile = loadProfiles()[index];
  const card = document.getElementById("profile-card");
  const missing = document.getElementById("missing-profile");

  if (!profile) {
    if (card) card.hidden = true;
    if (missing) missing.hidden = false;
    title.textContent = "Profile not found";
    return;
  }

  title.textContent = `${profile.firstName} ${profile.lastName}`;

  const details = [
    ["First name", profile.firstName],
    ["Age", String(profile.age ?? "—")],
    ["Goals", profile.goals || "—"],
    ["Restrictions", profile.restrictions || "None listed"],
    ["Email", profile.email || "—"],
    ["Phone", profile.phone || "—"],
    ["Birthday", formatDate(profile.birthday)],
    ["Profile created", formatDate(profile.createdAt)],
    ["Training days", `${daysTraining(profile.createdAt)} days`],
  ];

  const grid = document.getElementById("profile-detail-grid");
  if (grid) {
    grid.innerHTML = "";
    for (const [label, value] of details) {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      grid.append(dt, dd);
    }
  }

  const buildWorkoutLink = document.getElementById("build-workout-link");
  if (buildWorkoutLink) {
    buildWorkoutLink.href = `build-workout.html?assignTo=${index}`;
  }

  document.getElementById("log-saved-workout")?.addEventListener("click", () => {
    const msg = document.getElementById("saved-workout-message");
    if (msg) msg.hidden = false;
  });

  document.getElementById("generate-user-link")?.addEventListener("click", async () => {
    const token = `invite-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const invites = loadInvites();
    invites[token] = { profileIndex: index, createdAt: Date.now() };
    saveInvites(invites);

    const url = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}signup.html?token=${encodeURIComponent(token)}`;
    const message = document.getElementById("invite-message");
    try {
      await navigator.clipboard.writeText(url);
      if (message) {
        message.textContent = `Signup link copied: ${url}`;
        message.hidden = false;
      }
    } catch (_error) {
      if (message) {
        message.textContent = `Share this signup link: ${url}`;
        message.hidden = false;
      }
    }
  });

  if (card) card.hidden = false;
  if (missing) missing.hidden = true;
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
      email: String(formData.get("email") || "").trim().toLowerCase(),
      age: Number(formData.get("age")) || "",
      birthday: String(formData.get("birthday") || "").trim(),
      goals: String(formData.get("goals") || "").trim(),
      restrictions: String(formData.get("restrictions") || "").trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    });
    saveProfiles(profiles);
    window.location.href = "users.html?created=1";
  });
}

function initAuth() {
  document.getElementById("trainer-login")?.addEventListener("click", () => {
    setSession("trainer");
    window.location.href = "trainer-home.html";
  });

  const userForm = document.getElementById("user-login-form");
  if (userForm) {
    userForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(userForm);
      const email = String(formData.get("email") || "").trim().toLowerCase();
      const password = String(formData.get("password") || "");
      const msg = document.getElementById("login-message");

      const account = loadAccounts().find((item) => item.email === email && item.password === password);
      if (!account) {
        if (msg) {
          msg.textContent = "Invalid login. Use your invite link to set up access first.";
          msg.hidden = false;
        }
        return;
      }

      setSession("user", account.profileIndex);
      window.location.href = `user-dashboard.html?index=${account.profileIndex}`;
    });
  }
}

function initSignup() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const token = new URLSearchParams(window.location.search).get("token") || "";
  const invite = loadInvites()[token];
  const msg = document.getElementById("signup-message");
  const subtitle = document.getElementById("signup-subtitle");

  if (!invite) {
    if (msg) {
      msg.textContent = "Invalid or expired signup link.";
      msg.hidden = false;
    }
    form.querySelector("button")?.setAttribute("disabled", "true");
    return;
  }

  const profile = loadProfiles()[invite.profileIndex];
  if (profile && subtitle) subtitle.textContent = `Create access for ${profile.firstName}.`;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();

    const accounts = loadAccounts().filter((a) => a.profileIndex !== invite.profileIndex);
    accounts.push({ profileIndex: invite.profileIndex, email, password });
    saveAccounts(accounts);

    const invites = loadInvites();
    delete invites[token];
    saveInvites(invites);

    if (msg) {
      msg.textContent = "Account created. You can now log in from the login page.";
      msg.hidden = false;
    }
  });
}

function renderUserDashboard() {
  const grid = document.getElementById("user-dashboard-grid");
  if (!grid) return;

  const session = getSession();
  if (!session || session.role !== "user") {
    window.location.href = "index.html";
    return;
  }

  const index = Number(new URLSearchParams(window.location.search).get("index"));
  if (index !== session.profileIndex) {
    window.location.href = `user-dashboard.html?index=${session.profileIndex}`;
    return;
  }

  const profile = loadProfiles()[index];
  if (!profile) {
    document.getElementById("user-dashboard-missing")?.removeAttribute("hidden");
    return;
  }

  document.getElementById("user-dashboard-name").textContent = `${profile.firstName}'s Profile`;
  const details = [
    ["First name", profile.firstName],
    ["Age", String(profile.age ?? "—")],
    ["Goals", profile.goals || "—"],
    ["Restrictions", profile.restrictions || "None listed"],
    ["Training since", formatDate(profile.createdAt)],
    ["Training days", `${daysTraining(profile.createdAt)} days`],
  ];

  grid.innerHTML = "";
  for (const [k, v] of details) {
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    grid.append(dt, dd);
  }
  document.getElementById("user-dashboard-card").hidden = false;
}

function setStep(row, step) {
  row.dataset.step = step;
  for (const panel of row.querySelectorAll("[data-step-panel]")) {
    panel.hidden = panel.dataset.stepPanel !== step;
  }
}

function updateWorkoutEmptyState() {
  const rows = document.querySelectorAll("#exercise-rows .exercise-row").length;
  const empty = document.getElementById("empty-state");
  if (empty) empty.hidden = rows > 0;
}

function fillExerciseOptions(row) {
  const equipment = row.querySelector(".equipment-select");
  const exercise = row.querySelector(".exercise-select");
  const title = row.querySelector(".row-title");
  if (!equipment || !exercise) return;

  equipment.innerHTML = [
    '<option value="" selected disabled>Select equipment</option>',
    ...Object.keys(equipmentExercises).map((name) => `<option value="${name}">${name}</option>`),
  ].join("");

  const refreshExercises = () => {
    const selected = equipmentExercises[equipment.value] || [];
    exercise.innerHTML = [
      '<option value="" selected disabled>Select exercise</option>',
      ...selected.map((item) => `<option value="${item}">${item}</option>`),
    ].join("");
  };

  equipment.addEventListener("change", () => {
    refreshExercises();
    setStep(row, "exercise");
  });

  exercise.addEventListener("change", () => {
    if (exercise.value) {
      if (title) title.textContent = exercise.value;
      setStep(row, "metrics");
    }
  });
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
    remove.addEventListener("click", () => {
      row.classList.add("anim-exit");
      setTimeout(() => {
        row.remove();
        updateWorkoutEmptyState();
      }, 180);
    });
  }

  updateWorkoutEmptyState();
}

function initAssignmentSelector() {
  const mode = document.getElementById("assignment-mode");
  const userWrap = document.getElementById("assigned-user-wrap");
  const userSelect = document.getElementById("assigned-user");
  if (!mode || !userWrap || !userSelect) return;

  const profiles = loadProfiles();
  userSelect.innerHTML = profiles.map((profile, index) => `<option value="${index}">${profile.firstName} ${profile.lastName}</option>`).join("");

  const updateMode = () => {
    const isUserMode = mode.value === "user";
    userWrap.hidden = !isUserMode;
    userSelect.hidden = !isUserMode;
    userSelect.required = isUserMode;
  };

  const assignQuery = Number(new URLSearchParams(window.location.search).get("assignTo"));
  if (Number.isInteger(assignQuery) && assignQuery >= 0 && assignQuery < profiles.length) {
    mode.value = "user";
    userSelect.value = String(assignQuery);
  }

  mode.addEventListener("change", updateMode);
  updateMode();
}

function validateWorkoutForm(form) {
  for (const row of form.querySelectorAll(".exercise-row")) {
    const type = row.dataset.type;
    const sets = row.querySelector('input[name="sets"]');
    const reps = row.querySelector('input[name="reps"]');
    const time = row.querySelector('input[name="time"]');

    reps?.setCustomValidity("");
    time?.setCustomValidity("");

    if (!sets?.value) {
      sets.reportValidity();
      return false;
    }

    if (type === "exercise" && !reps?.value && !time?.value) {
      reps?.setCustomValidity("Enter reps or time.");
      reps?.reportValidity();
      return false;
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

  initAssignmentSelector();

  document.getElementById("add-exercise")?.addEventListener("click", () => addWorkoutRow("exercise"));
  document.getElementById("add-rest")?.addEventListener("click", () => addWorkoutRow("rest"));
  document.getElementById("empty-add-exercise")?.addEventListener("click", () => addWorkoutRow("exercise"));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.getElementById("workout-message");
    if (!validateWorkoutForm(form)) {
      if (message) message.hidden = true;
      return;
    }

    if (message) {
      message.hidden = false;
      setTimeout(() => {
        message.hidden = true;
      }, 4500);
    }
  });

  updateWorkoutEmptyState();
}

ensureTrainerPage();
initLogout();
renderProfiles();
renderProfileDetail();
attachFormHandler();
initAuth();
initSignup();
renderUserDashboard();
initWorkoutBuilder();
