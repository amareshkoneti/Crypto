const API_BASE = process.env.REACT_APP_API_BASE || "https://cry-backend.onrender.com/api";

async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API error:", err.message, "=>", url);
    throw err;
  }
}

export function checkExists(user_id) {
  return safeFetch(`${API_BASE}/exists/${encodeURIComponent(user_id)}`);
}

export function getUserById(user_id) {
  return safeFetch(`${API_BASE}/by-id/${encodeURIComponent(user_id)}`);
}

export function registerUser(payload) {
  return safeFetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function fetchTree() {
  return safeFetch(`${API_BASE}/tree`);
}
