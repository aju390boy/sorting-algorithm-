// components/Controls.jsx
// The top control panel — algorithm selector, array size, speed, start/reset

import { ALGORITHMS } from '../algorithms';

const Controls = ({
  algorithm, setAlgorithm,
  arraySize, setArraySize,
  speed, setSpeed,
  onStart, onReset,
  isRunning, isDone,
}) => {
  return (
    <div className="card controls-panel">

      {/* Algorithm Selector */}
      <div className="control-group">
        <label className="control-label">Algorithm</label>
        <select
          id="algorithm-select"
          className="control-select"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={isRunning}
        >
          {Object.entries(ALGORITHMS).map(([key, { name }]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      {/* Array Size */}
      <div className="control-group">
        <label className="control-label">
          Array Size
          <span className="control-value">{arraySize}</span>
        </label>
        <input
          id="array-size-slider"
          type="range"
          className="control-slider"
          min={10} max={200} step={5}
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
          disabled={isRunning}
        />
      </div>

      {/* Speed */}
      <div className="control-group">
        <label className="control-label">
          Speed
          <span className="control-value">
            {speed <= 10 ? 'Fast' : speed <= 40 ? 'Medium' : 'Slow'}
          </span>
        </label>
        <input
          id="speed-slider"
          type="range"
          className="control-slider"
          min={1} max={100} step={1}
          value={101 - speed}                          /* invert so right = faster */
          onChange={(e) => setSpeed(101 - Number(e.target.value))}
        />
      </div>

      {/* Buttons */}
      <div className="btn-group">
        <button
          id="start-btn"
          className="btn btn-primary"
          onClick={onStart}
          disabled={isRunning}
        >
          {isDone ? '▶ Restart' : '▶ Start'}
        </button>
        <button
          id="reset-btn"
          className="btn btn-danger"
          onClick={onReset}
          disabled={isRunning}
        >
          ↺ New Array
        </button>
      </div>

    </div>
  );
};

export default Controls;
