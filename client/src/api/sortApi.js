// api/sortApi.js
// VITE_API_URL is set in Vercel dashboard for production
// Falls back to localhost for local development

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/sort`
  : 'http://localhost:5000/api/sort';

export const saveSortResult = async (data) => {
  const res = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getHistory = async () => {
  const res = await fetch(`${API_BASE}/history`);
  return res.json();
};

export const getStats = async () => {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
};

export const deleteRun = async (id) => {
  const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  return res.json();
};

export const clearHistory = async () => {
  const res = await fetch(`${API_BASE}/history`, { method: 'DELETE' });
  return res.json();
};
