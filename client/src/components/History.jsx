// components/History.jsx
// Fetches past sort results from MongoDB via the Express API

import { useEffect, useState } from 'react';
import { getHistory } from '../api/sortApi';

const algoBadgeClass = (algo) => `algo-badge algo-${algo}`;

const History = ({ refreshKey }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch history from backend whenever refreshKey changes (after each sort)
  useEffect(() => {
    setLoading(true);
    getHistory()
      .then((res) => {
        if (res.success) setHistory(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div className="card history-panel">
      <div className="card-title">Sort History — MongoDB Atlas</div>

      {loading ? (
        <div className="history-empty">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="history-empty">
          No runs yet — run a sort to save results here!
        </div>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Size</th>
                <th>Time</th>
                <th>Comparisons</th>
                <th>Swaps</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row._id}>
                  <td>
                    <span className={algoBadgeClass(row.algorithm)}>
                      {row.algorithm}
                    </span>
                  </td>
                  <td className="mono">{row.arraySize}</td>
                  <td className="mono">{row.timeTakenMs}ms</td>
                  <td className="mono">{row.comparisons.toLocaleString()}</td>
                  <td className="mono">{row.swaps.toLocaleString()}</td>
                  <td className="mono">
                    {new Date(row.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
