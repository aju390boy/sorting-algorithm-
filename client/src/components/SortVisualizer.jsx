// components/SortVisualizer.jsx
// Animated bar chart — each number in the array becomes a bar

const SortVisualizer = ({ array, comparing, swapped }) => {
  if (!array || array.length === 0) {
    return (
      <div className="card visualizer-panel">
        <div className="card-title">Visualizer</div>
        <div className="visualizer-area">
          <div className="visualizer-empty">
            <div className="visualizer-empty-icon">📊</div>
            <p>Press Start to begin visualization</p>
          </div>
        </div>
      </div>
    );
  }

  const maxVal = Math.max(...array);

  return (
    <div className="card visualizer-panel">
      <div className="card-title">Visualizer — {array.length} elements</div>
      <div className="visualizer-area">
        {array.map((value, idx) => {
          // Determine bar color class
          let colorClass = 'bar-default';
          if (comparing.includes(idx)) {
            colorClass = swapped ? 'bar-swap' : 'bar-compare';
          }

          return (
            <div
              key={idx}
              className={`bar ${colorClass}`}
              style={{ height: `${(value / maxVal) * 100}%` }}
              title={value}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SortVisualizer;
