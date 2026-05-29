// components/MetricsPanel.jsx
// Live stats — comparisons, swaps, elapsed time, status

const MetricsPanel = ({ comparisons, swaps, timeMs, isRunning, isDone }) => {
  const status = isRunning ? 'running' : isDone ? 'done' : 'idle';

  const statusLabel = {
    idle:    '● Idle',
    running: '● Sorting...',
    done:    '● Complete',
  }[status];

  return (
    <div className="card">
      <div className="card-title">Live Metrics</div>
      <div className="metrics-grid">

        <div className="metric-card">
          <div className="metric-label">Comparisons</div>
          <div className="metric-value comparisons mono">
            {comparisons.toLocaleString()}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Swaps</div>
          <div className="metric-value swaps mono">
            {swaps.toLocaleString()}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Time Elapsed</div>
          <div className="metric-value time mono">
            {timeMs < 1000
              ? `${timeMs}ms`
              : `${(timeMs / 1000).toFixed(2)}s`}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Status</div>
          <div className="metric-value status">
            <span className={`status-badge status-${status}`}>
              <span className={`dot ${isRunning ? 'pulse' : ''}`} />
              {statusLabel}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetricsPanel;
