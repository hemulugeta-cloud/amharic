// auth.js — Membership & session management.
//
// IMPORTANT (read this before shipping): this file implements a LOCAL DEMO
// provider only. Accounts are stored in the browser's localStorage on the
// current device — nothing is sent to a server, passwords are not hashed
// with a real KDF, and there is no email verification, password reset, or
// parental-consent flow. This is intentionally built behind the same
// `AuthProvider` interface a production backend would use, so swapping in
// a real provider (Firebase Auth, Supabase Auth, Auth0, or a custom API)
// only requires rewriting this file — no UI or game code needs to change.
//
// See README.md → "Making membership production-ready" for the recommended
// real implementation and child-safety/legal requirements (COPPA, Apple's
// Kids Category, Google Play Families Policy).

const STORAGE_KEY = "fidelTemari.accounts.v1";
const SESSION_KEY = "fidelTemari.session.v1";

function loadAccounts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

// Very small non-cryptographic hash — good enough to avoid storing plaintext
// in this demo, NOT a substitute for bcrypt/argon2 in production.
async function weakHash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export const AuthProvider = {
  async signUp({ name, email, password, role, ageGroup }) {
    const accounts = loadAccounts();
    const key = email.trim().toLowerCase();
    if (accounts[key]) throw new Error("An account with that email already exists.");
    const passwordHash = await weakHash(password);
    accounts[key] = {
      name, email: key, passwordHash, role: role || "learner",
      ageGroup: ageGroup || "children",
      createdAt: new Date().toISOString(),
      profile: { points: 0, stars: 0, streak: 0, lastDay: "", history: [], types: {}, badges: [] },
      children: [], // for a parent/teacher account managing multiple child profiles
    };
    saveAccounts(accounts);
    this._setSession(key);
    return accounts[key];
  },

  async signIn({ email, password }) {
    const accounts = loadAccounts();
    const key = email.trim().toLowerCase();
    const account = accounts[key];
    if (!account) throw new Error("No account found with that email.");
    const passwordHash = await weakHash(password);
    if (passwordHash !== account.passwordHash) throw new Error("Incorrect password.");
    this._setSession(key);
    return account;
  },

  signInAsGuest() {
    this._setSession(null, true);
    return { name: "Guest", email: null, role: "guest", ageGroup: "children",
      profile: { points: 0, stars: 0, streak: 0, lastDay: "", history: [], types: {}, badges: [] } };
  },

  signOut() {
    localStorage.removeItem(SESSION_KEY);
  },

  currentSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  },

  currentAccount() {
    const session = this.currentSession();
    if (!session) return null;
    if (session.guest) return this.signInAsGuest();
    const accounts = loadAccounts();
    return accounts[session.email] || null;
  },

  saveProfile(email, profile) {
    if (!email) return; // guest sessions are not persisted across visits
    const accounts = loadAccounts();
    if (!accounts[email]) return;
    accounts[email].profile = profile;
    saveAccounts(accounts);
  },

  _setSession(email, guest = false) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, guest, since: Date.now() }));
  },
};
