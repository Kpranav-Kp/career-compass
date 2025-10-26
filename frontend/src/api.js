const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/extract-skills";

async function postJSON(path, body) {
  const token = localStorage.getItem("access");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

async function postForm(path, formData) {
  const token = localStorage.getItem("access");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: formData, // browser sets Content-Type multipart/form-data boundary
  });
  return res.json();
}

export { postJSON, postForm, BASE };