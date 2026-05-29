// api/sortApi.js
// PURPOSE: All functions that call the backend API
// Think of this like a "service layer" — keeps fetch() calls in one place

const API_BASE = 'http://localhost:5000/api/sort';

// Save a sort result to the database
export const saveSortResult = async (data) => {
  const response = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// Get all past sort results (history)
export const getHistory = async () => {
  const response = await fetch(`${API_BASE}/history`);
  return response.json();
};

// Get aggregated stats per algorithm
export const getStats = async () => {
  const response = await fetch(`${API_BASE}/stats`);
  return response.json();
};
