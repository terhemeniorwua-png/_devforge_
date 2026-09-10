const USERS_KEY = "devforge_users";
const SESSION_KEY = "devforge_session";
const RESET_KEY = "devforge_reset";
const OTP_TTL_MS = 5 * 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SEED_USERS = [
  {
    id: "usr_demo",
    name: "Demo Developer",
    email: "demo@devforge.dev",
    track: "Fullstack (Web3)",
    password: "forge1234",
    createdAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: "usr_alex",
    name: "Alex Chen",
    email: "alex@devforge.dev",
    track: "Frontend (Web2)",
    password: "alex1234",
    createdAt: "2026-02-14T15:30:00.000Z",
  },
  {
    id: "usr_sam",
    name: "Sam Rivera",
    email: "sam@devforge.dev",
    track: "Backend (Web2)",
    password: "sam12345",
    createdAt: "2026-03-02T11:12:00.000Z",
  },
];

function read(key) {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  const stored = read(USERS_KEY);
  if (stored && Array.isArray(stored)) return stored;
  write(USERS_KEY, SEED_USERS);
  return [...SEED_USERS];
}

export function saveUsers(users) {
  write(USERS_KEY, users);
}

export function findUserByEmail(users, email) {
  const needle = String(email || "")
    .trim()
    .toLowerCase();
  return users.find((user) => user.email.toLowerCase() === needle);
}

export function createUser({ name, email, track, password }) {
  const users = getUsers();
  const user = {
    id: `usr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    name: String(name || "").trim(),
    email: String(email || "")
      .trim()
      .toLowerCase(),
    track,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export function getSession() {
  return read(SESSION_KEY);
}

export function setSession(user, remember = true) {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    track: user.track,
    remember,
    loginAt: new Date().toISOString(),
  };
  write(SESSION_KEY, session);
  return session;
}

export function clearSession() {
  write(SESSION_KEY, null);
  window.localStorage.removeItem(SESSION_KEY);
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function storeResetCode(email, code) {
  write(RESET_KEY, {
    email,
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

export function getResetCode(email) {
  const reset = read(RESET_KEY);
  if (!reset || !reset.code || !reset.expiresAt) return null;
  if (Date.now() > reset.expiresAt) {
    window.localStorage.removeItem(RESET_KEY);
    return null;
  }
  if (String(reset.email).toLowerCase() !== String(email).trim().toLowerCase()) {
    return null;
  }
  return reset.code;
}

export function clearResetCode() {
  window.localStorage.removeItem(RESET_KEY);
}

export function updatePassword(email, newPassword) {
  const users = getUsers();
  const user = findUserByEmail(users, email);
  if (!user) return false;
  user.password = newPassword;
  saveUsers(users);
  return true;
}

export function socialAccount(provider) {
  const users = getUsers();
  const email = `social.${provider}@devforge.dev`;
  const existing = findUserByEmail(users, email);
  if (existing) return existing;
  const user = createUser({
    name: `${provider === "github" ? "GitHub" : "Google"} Developer`,
    email,
    track: "Fullstack (Web2)",
    password: `social-${provider}-${Date.now()}`,
  });
  return user;
}

export function scorePassword(password) {
  const pw = String(password || "");
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(score, 4);
}

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email || "").trim());
}

export function formatOtp(code) {
  const digits = String(code || "").replace(/\D/g, "").slice(0, 6);
  return digits.length === 6
    ? `${digits.slice(0, 3)}-${digits.slice(3)}`
    : digits;
}