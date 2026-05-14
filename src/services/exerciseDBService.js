// src/services/exerciseDBService.js

const BASE_URL = "https://exercisedb.p.rapidapi.com";

function rapidHeaders() {
  const key = import.meta.env.VITE_RAPIDAPI_KEY;
  const host = import.meta.env.VITE_EXERCISEDB_HOST;

  if (!key || !host) {
    throw new Error(
      "Missing RapidAPI env vars. Add VITE_RAPIDAPI_KEY and VITE_EXERCISEDB_HOST in .env then restart the dev server."
    );
  }

  return {
    "x-rapidapi-key": key,
    "x-rapidapi-host": host,
  };
}

export async function searchExercisesByName(name) {
  const q = String(name || "").trim();
  if (!q) return [];

  const res = await fetch(`${BASE_URL}/exercises/name/${encodeURIComponent(q)}`, {
    method: "GET",
    headers: rapidHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ExerciseDB ${res.status}: ${text}`);
  }

  return res.json();
}

export async function getBodyParts() {
  const res = await fetch(`${BASE_URL}/exercises/bodyPartList`, {
    method: "GET",
    headers: rapidHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ExerciseDB ${res.status}: ${text}`);
  }

  return res.json();
}
