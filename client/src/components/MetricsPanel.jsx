// components/MetricsPanel.jsx

const MetricsPanel = ({ comparisons, swaps, timeMs, isRunning, isDone, isPaused }) => {
  const status = isRunning ? 'running' : isPaused ? 'paused' : isDone ? 'done' : 'idle';

  const STATUS_CONFIG = {
    idle:    { label: 'Idle',      cls: 'status-idle'    },
    running: { label: 'Sorting…',  cls: 'status-running' },
    paused:  { label: 'Paused',    cls: 'status-paused'  },
    done:    { label: 'Complete',  cls: 'status-done'    },
  };

  const { label, cls } = STATUS_CONFIG[status];

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
          <div className="metric-label">Swaps / Writes</div>
          <div className="metric-value swaps mono">
            {swaps.toLocaleString()}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Time Elapsed</div>
          <div className="metric-value time mono">
            {timeMs < 1000 ? `${timeMs}ms` : `${(timeMs / 1000).toFixed(2)}s`}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Status</div>
          <div className="metric-value status">
            <span className={`status-badge ${cls}`}>
              <span className={`dot ${isRunning ? 'pulse' : ''}`} />
              {label}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetricsPanel;
