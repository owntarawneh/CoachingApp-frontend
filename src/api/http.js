const BASE_URL = import.meta.env.VITE_API_BASE 
async function safeJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export async function httpGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

export async function httpPut(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

export async function httpPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}
