// components/AlgorithmInfo.jsx
// Shows Big O complexity, stability, and a description for the selected algorithm

const ALGO_DATA = {
  bubble: {
    name: 'Bubble Sort',
    best: 'O(n)', average: 'O(n²)', worst: 'O(n²)',
    space: 'O(1)', stable: true,
    description: 'Repeatedly compares adjacent elements and swaps them if out of order. Simple but slow — best for learning.',
    use: 'Small / nearly sorted data',
    color: '#818cf8',
  },
  selection: {
    name: 'Selection Sort',
    best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)',
    space: 'O(1)', stable: false,
    description: 'Finds the minimum element each pass and places it at the front. Makes fewer swaps than Bubble Sort.',
    use: 'Small datasets, minimizing swaps',
    color: '#fbbf24',
  },
  insertion: {
    name: 'Insertion Sort',
    best: 'O(n)', average: 'O(n²)', worst: 'O(n²)',
    space: 'O(1)', stable: true,
    description: 'Inserts each element into its correct position in the already-sorted portion. Excellent for nearly-sorted arrays.',
    use: 'Nearly sorted data, online sorting',
    color: '#2dd4bf',
  },
  merge: {
    name: 'Merge Sort',
    best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)',
    space: 'O(n)', stable: true,
    description: 'Divides the array into halves, sorts each recursively, then merges. Consistent performance on all inputs.',
    use: 'Large datasets, stable sort required',
    color: '#c084fc',
  },
  quick: {
    name: 'Quick Sort',
    best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)',
    space: 'O(log n)', stable: false,
    description: 'Picks a pivot and partitions elements around it. Very fast in practice — the industry standard general-purpose sort.',
    use: 'General purpose, large datasets',
    color: '#f87171',
  },
  heap: {
    name: 'Heap Sort',
    best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)',
    space: 'O(1)', stable: false,
    description: 'Builds a max-heap structure and repeatedly extracts the max. Guaranteed O(n log n) with no extra memory.',
    use: 'Memory-constrained systems',
    color: '#34d399',
  },
};

const AlgorithmInfo = ({ algorithm }) => {
  const info = ALGO_DATA[algorithm];
  if (!info) return null;

  return (
    <div className="card algo-info-card">
      <div className="card-title">Algorithm Info</div>

      <div className="algo-info-header">
        <span className="algo-info-name" style={{ color: info.color }}>
          {info.name}
        </span>
        <span className={`stability-badge ${info.stable ? 'stable' : 'unstable'}`}>
          {info.stable ? '✓ Stable' : '✗ Unstable'}
        </span>
      </div>

      <p className="algo-description">{info.description}</p>

      <div className="complexity-grid">
        <div className="complexity-item">
          <span className="complexity-label">Best</span>
          <span className="complexity-value best">{info.best}</span>
        </div>
        <div className="complexity-item">
          <span className="complexity-label">Average</span>
          <span className="complexity-value avg">{info.average}</span>
        </div>
        <div className="complexity-item">
          <span className="complexity-label">Worst</span>
          <span className="complexity-value worst">{info.worst}</span>
        </div>
        <div className="complexity-item">
          <span className="complexity-label">Space</span>
          <span className="complexity-value space">{info.space}</span>
        </div>
      </div>

      <div className="algo-use">
        <span className="algo-use-label">Best used for: </span>
        <span className="algo-use-value">{info.use}</span>
      </div>
    </div>
  );
};

export default AlgorithmInfo;
