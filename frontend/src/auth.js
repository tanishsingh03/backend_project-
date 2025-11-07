// src/auth.js
export function setAuth(token, role) {
  if (token) localStorage.setItem("token", token);
  if (role) localStorage.setItem("role", role);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}

export function isAuthed() {
  return !!localStorage.getItem("token");
}
