// components/StatsChart.jsx
// Horizontal bar chart comparing avg sort time per algorithm (data from MongoDB)

import { useEffect, useState } from 'react';
import { getStats } from '../api/sortApi';

const ALGO_COLORS = {
  bubble:    '#818cf8',
  selection: '#fbbf24',
  insertion: '#2dd4bf',
  merge:     '#c084fc',
  quick:     '#f87171',
  heap:      '#34d399',
};

const StatsChart = ({ refreshKey }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStats()
      .then((res) => { if (res.success) setStats(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const maxTime = stats.length ? Math.max(...stats.map((s) => s.avgTime)) : 1;

  return (
    <div className="card stats-chart-card">
      <div className="card-title">
        Performance Comparison
        <span className="stats-subtitle">avg time across all runs</span>
      </div>

      {loading ? (
        <div className="stats-empty">Loading stats...</div>
      ) : stats.length === 0 ? (
        <div className="stats-empty">Run some sorts to see comparisons here!</div>
      ) : (
        <div className="chart-rows">
          {stats.map((s) => (
            <div key={s._id} className="chart-row">
              <div className="chart-label">
                <span className="chart-algo-dot" style={{ background: ALGO_COLORS[s._id] }} />
                <span className="chart-algo-name">{s._id}</span>
              </div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{
                    width: `${(s.avgTime / maxTime) * 100}%`,
                    background: ALGO_COLORS[s._id],
                  }}
                />
              </div>
              <div className="chart-meta">
                <span className="chart-time">{Math.round(s.avgTime)}ms</span>
                <span className="chart-runs">{s.totalRuns} run{s.totalRuns > 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatsChart;
