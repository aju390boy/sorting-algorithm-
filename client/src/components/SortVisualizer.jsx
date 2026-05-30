// components/SortVisualizer.jsx
// Bars colored by value using rainbow gradient (purple→blue→cyan→green→yellow→red)
// Comparing = yellow | Swapping = red | Sorted = all green

const LEGEND = [
  { type: 'rainbow', label: 'Value height' },
  { cls: 'bar-compare', label: 'Comparing'  },
  { cls: 'bar-swap',    label: 'Swapping'   },
  { cls: 'bar-sorted',  label: 'Sorted'     },
];

// Map a 0–1 ratio to a vibrant HSL hue (270=purple → 0=red through the spectrum)
// Short bars → purple/blue  |  Tall bars → yellow/red
const getBarGradient = (value, maxVal) => {
  const ratio = value / maxVal;
  const hue   = Math.round(270 - ratio * 270); // 270 (purple) → 0 (red)
  return `linear-gradient(180deg,
    hsl(${hue}, 85%, 68%) 0%,
    hsl(${hue}, 90%, 52%) 100%)`;
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
              {type === 'rainbow' ? (
                /* Rainbow swatch for value-height legend entry */
                <div className="legend-swatch legend-rainbow" />
              ) : (
                <div className={`legend-swatch ${cls}`} />
              )}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Vibrant Progress Bar ── */}
      <div className="progress-wrap">
        <div className="progress-track">
          <div
            className={`progress-fill ${progressState}`}
            style={{ width: `${progress}%` }}
          />
          {isRunning && <div className="progress-shimmer" />}
        </div>
        <div className="progress-labels">
          <span className="progress-label-left">
            {isDone ? '✓ Sort Complete'
              : isPaused  ? '⏸ Paused'
              : isRunning ? '⚡ Sorting…'
              :             'Ready'}
          </span>
          <span className={`progress-pct ${progressState}`}>{progress}%</span>
        </div>
      </div>

      {/* ── Bar Chart ── */}
      {array.length === 0 ? (
        <div className="visualizer-area">
          <div className="visualizer-empty">
            <div className="visualizer-empty-icon">📊</div>
            <p>Configure settings above and press Start</p>
          </div>
        </div>
      ) : (
        <div className="visualizer-area">
          {array.map((value, idx) => {
            const heightPct = `${(value / maxVal) * 100}%`;
            const isActive  = comparing.includes(idx);

            /* Priority: sorted > swap > compare > rainbow-by-value */
            if (isSorted) {
              return (
                <div
                  key={idx}
                  className="bar bar-sorted"
                  style={{ height: heightPct }}
                  title={`Value: ${value}`}
                />
              );
            }

            if (isActive && swapped) {
              return (
                <div
                  key={idx}
                  className="bar bar-swap"
                  style={{ height: heightPct }}
                  title={`Value: ${value}`}
                />
              );
            }

            if (isActive) {
              return (
                <div
                  key={idx}
                  className="bar bar-compare"
                  style={{ height: heightPct }}
                  title={`Value: ${value}`}
                />
              );
            }

            /* Default: rainbow color mapped to bar's value */
            return (
              <div
                key={idx}
                className="bar"
                style={{
                  height: heightPct,
                  background: getBarGradient(value, maxVal),
                }}
                title={`Value: ${value}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortVisualizer;
