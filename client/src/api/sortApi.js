// api/sortApi.js — All backend API calls in one place

const API_BASE = 'http://localhost:5000/api/sort';

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
