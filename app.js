const SESSION_KEY = 'fitnessSimpleSession';

function setSession(email) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function initSimpleLogin() {
  const form = document.getElementById('simple-login-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const password = String(data.get('password') || '').trim();
    const message = document.getElementById('login-message');

    if (!email || !password) {
      if (message) {
        message.textContent = 'Please enter both email and password.';
        message.hidden = false;
      }
      return;
    }

    setSession(email);
    window.location.href = 'dashboard.html';
  });
}

function ensureDashboardAccess() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (page !== 'dashboard.html') return;

  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
  }
}

function initDashboardActions() {
  const trigger = document.getElementById('log-workout-trigger');
  const options = document.getElementById('workout-options');
  if (trigger && options) {
    trigger.addEventListener('click', () => {
      options.hidden = !options.hidden;
      if (!options.hidden) {
        options.querySelector('a,button')?.focus();
      }
    });
  }

  const saved = document.getElementById('log-saved-workout');
  const savedMessage = document.getElementById('saved-workout-message');
  if (saved && savedMessage) {
    saved.addEventListener('click', () => {
      savedMessage.hidden = false;
    });
  }

  const logout = document.getElementById('logout-btn');
  if (logout) {
    logout.addEventListener('click', () => {
      clearSession();
      window.location.href = 'index.html';
    });
  }
}

ensureDashboardAccess();
initSimpleLogin();
initDashboardActions();
