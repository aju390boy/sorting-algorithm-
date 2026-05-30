// components/History.jsx
// Shows sort history from MongoDB with filter, delete, and clear-all

import { useEffect, useState } from 'react';
import { getHistory, deleteRun, clearHistory } from '../api/sortApi';

const ALGO_NAMES = {
  bubble: 'Bubble', selection: 'Selection',
  insertion: 'Insertion', merge: 'Merge',
  quick: 'Quick', heap: 'Heap',
};

const History = ({ refreshKey, onRefresh }) => {
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [clearing, setClearing]   = useState(false);

  const fetchHistory = () => {
    setLoading(true);
    getHistory()
      .then((res) => { if (res.success) setHistory(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHistory(); }, [refreshKey]);

  // Find fastest run (by timeTakenMs)
  const fastestId = history.length
    ? history.reduce((a, b) => (a.timeTakenMs < b.timeTakenMs ? a : b))._id
    : null;

  const filtered = filter === 'all'
    ? history
    : history.filter((r) => r.algorithm === filter);

  const handleDelete = async (id) => {
    await deleteRun(id);
    setHistory((prev) => prev.filter((r) => r._id !== id));
    onRefresh();
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all history? This cannot be undone.')) return;
    setClearing(true);
    await clearHistory();
    setHistory([]);
    onRefresh();
    setClearing(false);
  };

  const uniqueAlgos = [...new Set(history.map((r) => r.algorithm))];

  return (
    <div className="card history-panel">
      {/* Header */}
      <div className="history-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="card-title" style={{ margin: 0 }}>
            Sort History
          </div>
          <span className="run-count-badge">{history.length} runs</span>
        </div>

        <div className="history-actions">
          {/* Filter */}
          <select
            className="control-select history-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Algorithms</option>
            {uniqueAlgos.map((a) => (
              <option key={a} value={a}>{ALGO_NAMES[a] || a}</option>
            ))}
          </select>

          {/* Clear All */}
          {history.length > 0 && (
            <button
              className="btn btn-danger btn-sm"
              onClick={handleClearAll}
              disabled={clearing}
            >
              {clearing ? '…' : '🗑 Clear All'}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="history-empty">Loading history…</div>
      ) : filtered.length === 0 ? (
        <div className="history-empty">
          {history.length === 0
            ? 'No runs yet — run a sort to save results here!'
            : 'No results for this filter.'}
        </div>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th></th>
                <th>Algorithm</th>
                <th>Size</th>
                <th>Time</th>
                <th>Comparisons</th>
                <th>Swaps</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row._id} className={row._id === fastestId ? 'fastest-row' : ''}>
                  <td>
                    {row._id === fastestId && (
                      <span title="Fastest run!" className="fastest-badge">🏆</span>
                    )}
                  </td>
                  <td>
                    <span className={`algo-badge algo-${row.algorithm}`}>
                      {row.algorithm}
                    </span>
                  </td>
                  <td className="mono">{row.arraySize}</td>
                  <td className="mono time-cell">{row.timeTakenMs}ms</td>
                  <td className="mono">{row.comparisons.toLocaleString()}</td>
                  <td className="mono">{row.swaps.toLocaleString()}</td>
                  <td className="mono muted">
                    {new Date(row.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(row._id)}
                      title="Delete this record"
                    >
                      ×
                    </button>
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
