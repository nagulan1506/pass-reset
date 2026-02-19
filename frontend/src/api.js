const BASE = import.meta.env.VITE_API_URL || '';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const api = {
  get: (path) => fetch(`${BASE}${path}`, { headers: getHeaders() }).then((r) => r.json()),
  post: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then((r) => r.json()),
};
