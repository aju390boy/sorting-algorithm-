// components/SortVisualizer.jsx
// Animated bar chart with color legend and sorted-state support

const LEGEND = [
  { cls: 'bar-default', label: 'Unsorted'   },
  { cls: 'bar-compare', label: 'Comparing'  },
  { cls: 'bar-swap',    label: 'Swapping'   },
  { cls: 'bar-sorted',  label: 'Sorted'     },
];

const SortVisualizer = ({ array, comparing, swapped, isSorted }) => {
  const maxVal = array.length ? Math.max(...array) : 1;

  return (
    <div className="card visualizer-panel">
      {/* Header row */}
      <div className="visualizer-header">
        <div className="card-title" style={{ margin: 0 }}>
          Visualizer {array.length > 0 && `— ${array.length} elements`}
        </div>
        {/* Color Legend */}
        <div className="legend">
          {LEGEND.map(({ cls, label }) => (
            <div key={cls} className="legend-item">
              <div className={`legend-swatch ${cls}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
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
            let colorClass = 'bar-default';
            if (isSorted) {
              colorClass = 'bar-sorted';
            } else if (comparing.includes(idx)) {
              colorClass = swapped ? 'bar-swap' : 'bar-compare';
            }
            return (
              <div
                key={idx}
                className={`bar ${colorClass}`}
                style={{ height: `${(value / maxVal) * 100}%` }}
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
