// components/SortVisualizer.jsx
// 3D-style vibrant bars + SVG trend line overlay + progress bar + legend

const LEGEND = [
  { type: 'rainbow', label: 'Value height' },
  { cls: 'bar-compare', label: 'Comparing'  },
  { cls: 'bar-swap',    label: 'Swapping'   },
  { cls: 'bar-sorted',  label: 'Sorted'     },
];

// Vibrant HSL color per bar value (purple → blue → cyan → green → yellow → red)
const getBarColor = (value, maxVal) => {
  const ratio = value / maxVal;
  const hue   = Math.round(270 - ratio * 270);
  return `hsl(${hue}, 88%, 60%)`;
};

// Lighter shade for top face (3D effect)
const getBarTopColor = (value, maxVal) => {
  const ratio = value / maxVal;
  const hue   = Math.round(270 - ratio * 270);
  return `hsl(${hue}, 80%, 80%)`;
};

// Darker shade for right face (3D effect)
const getBarSideColor = (value, maxVal) => {
  const ratio = value / maxVal;
  const hue   = Math.round(270 - ratio * 270);
  return `hsl(${hue}, 85%, 38%)`;
};

const SortVisualizer = ({
  array, comparing, swapped, isSorted,
  progress, isRunning, isPaused, isDone,
}) => {
  const maxVal = array.length ? Math.max(...array) : 1;

  const progressState = isDone    ? 'progress-done'
    : isPaused                    ? 'progress-paused'
    : isRunning                   ? 'progress-running'
    :                               'progress-idle';

  // SVG trend line points  (x = index center, y = inverted value %)
  const trendPoints = array
    .map((v, i) => `${i + 0.5},${100 - (v / maxVal) * 100}`)
    .join(' ');

  // Polygon area under the trend line (closed shape)
  const areaPoints = [
    ...array.map((v, i) => `${i + 0.5},${100 - (v / maxVal) * 100}`),
    `${array.length - 0.5},100`,
    `0.5,100`,
  ].join(' ');

  return (
    <div className="card visualizer-panel">

      {/* ── Header: title + legend ── */}
      <div className="visualizer-header">
        <div className="card-title" style={{ margin: 0 }}>
          Visualizer {array.length > 0 && `— ${array.length} elements`}
        </div>
        <div className="legend">
          {LEGEND.map(({ type, cls, label }) => (
            <div key={label} className="legend-item">
              {type === 'rainbow'
                ? <div className="legend-swatch legend-rainbow" />
                : <div className={`legend-swatch ${cls}`} />}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Vibrant Progress Bar ── */}
      <div className="progress-wrap">
        <div className="progress-track">
          <div className={`progress-fill ${progressState}`} style={{ width: `${progress}%` }} />
          {isRunning && <div className="progress-shimmer" />}
        </div>
        <div className="progress-labels">
          <span className="progress-label-left">
            {isDone ? '✓ Sort Complete' : isPaused ? '⏸ Paused' : isRunning ? '⚡ Sorting…' : 'Ready'}
          </span>
          <span className={`progress-pct ${progressState}`}>{progress}%</span>
        </div>
      </div>

      {/* ── Bar Chart + SVG Trend Line ── */}
      {array.length === 0 ? (
        <div className="visualizer-area">
          <div className="visualizer-empty">
            <div className="visualizer-empty-icon">📊</div>
            <p>Configure settings above and press Start</p>
          </div>
        </div>
      ) : (
        <div className="visualizer-area">

          {/* 3D Bars */}
          {array.map((value, idx) => {
            const heightPct  = `${(value / maxVal) * 100}%`;
            const isActive   = comparing.includes(idx);

            // Special state overrides
            if (isSorted) {
              return (
                <div key={idx} className="bar bar-3d bar-sorted" style={{ height: heightPct }}
                  title={`Value: ${value}`}>
                  <div className="bar-top  bar-top-sorted"  />
                  <div className="bar-side bar-side-sorted" />
                </div>
              );
            }
            if (isActive && swapped) {
              return (
                <div key={idx} className="bar bar-3d bar-swap" style={{ height: heightPct }}
                  title={`Value: ${value}`}>
                  <div className="bar-top  bar-top-swap"  />
                  <div className="bar-side bar-side-swap" />
                </div>
              );
            }
            if (isActive) {
              return (
                <div key={idx} className="bar bar-3d bar-compare" style={{ height: heightPct }}
                  title={`Value: ${value}`}>
                  <div className="bar-top  bar-top-compare"  />
                  <div className="bar-side bar-side-compare" />
                </div>
              );
            }

            // Rainbow 3D bar
            const base = getBarColor(value, maxVal);
            const top  = getBarTopColor(value, maxVal);
            const side = getBarSideColor(value, maxVal);
            return (
              <div
                key={idx}
                className="bar bar-3d"
                style={{ height: heightPct, background: base }}
                title={`Value: ${value}`}
              >
                <div className="bar-top"  style={{ background: top  }} />
                <div className="bar-side" style={{ background: side }} />
              </div>
            );
          })}

          {/* SVG Trend Line Overlay */}
          {array.length > 1 && (
            <svg
              className="trend-line-svg"
              viewBox={`0 0 ${array.length} 100`}
              preserveAspectRatio="none"
            >
              <defs>
                {/* Gradient stroke: purple → cyan → yellow → red */}
                <linearGradient id="trendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#7c3aed" />
                  <stop offset="30%"  stopColor="#06b6d4" />
                  <stop offset="60%"  stopColor="#10b981" />
                  <stop offset="80%"  stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>

                {/* Area fill gradient (top-to-bottom fade) */}
                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0"    />
                </linearGradient>

                {/* Glow filter */}
                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Arrowhead marker */}
                <marker id="arrowHead" markerWidth="5" markerHeight="5"
                  refX="4" refY="2.5" orient="auto">
                  <polygon points="0,0 5,2.5 0,5" fill="#f59e0b" />
                </marker>
              </defs>

              {/* Shaded area under the line */}
              <polygon points={areaPoints} fill="url(#areaGrad)" />

              {/* The trend line */}
              <polyline
                points={trendPoints}
                fill="none"
                stroke="url(#trendGrad)"
                strokeWidth="1.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#lineGlow)"
                markerEnd="url(#arrowHead)"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default SortVisualizer;
