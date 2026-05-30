// components/Controls.jsx
// Algorithm selector, array type, custom input, size/speed sliders, playback buttons

import { useState } from 'react';
import { ALGORITHMS } from '../algorithms';

const ARRAY_TYPES = [
  { key: 'random',        label: '🎲 Random'        },
  { key: 'nearly-sorted', label: '📶 Nearly Sorted'  },
  { key: 'reversed',      label: '🔽 Reversed'       },
  { key: 'few-unique',    label: '🔢 Few Unique'     },
  { key: 'custom',        label: '✏️ Custom'         },
];

const Controls = ({
  algorithm,    setAlgorithm,
  arrayType,    setArrayType,
  arraySize,    setArraySize,
  speed,        setSpeed,
  customInput,  setCustomInput,
  onApplyCustom,
  customError,
  onStart, onPause, onResume, onReset, onStep,
  isRunning, isPaused, isDone,
}) => {
  return (
    <div className="card controls-wrap">
      {/* ── Row 1: Algorithm + Array Type + Size + Speed + Buttons ── */}
      <div className="controls-row">

        {/* Algorithm */}
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
            <span className="control-value">{arrayType === 'custom' ? 'custom' : arraySize}</span>
          </label>
          <input
            id="array-size-slider"
            type="range"
            className="control-slider"
            min={10} max={200} step={5}
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isRunning || arrayType === 'custom'}
          />
        </div>

        {/* Speed */}
        <div className="control-group">
          <label className="control-label">
            Speed
            <span className="control-value">
              {speed <= 10 ? '⚡ Fast' : speed <= 40 ? '▶ Medium' : '🐢 Slow'}
            </span>
          </label>
          <input
            id="speed-slider"
            type="range"
            className="control-slider"
            min={1} max={150} step={1}
            value={151 - speed}
            onChange={(e) => setSpeed(151 - Number(e.target.value))}
          />
        </div>

        {/* Buttons */}
        <div className="btn-cluster">
          {/* Start / Pause / Resume */}
          {!isRunning && !isPaused && (
            <button id="start-btn" className="btn btn-primary" onClick={onStart}>
              ▶ {isDone ? 'Restart' : 'Start'}
            </button>
          )}
          {isRunning && (
            <button id="pause-btn" className="btn btn-warning" onClick={onPause}>
              ⏸ Pause
            </button>
          )}
          {isPaused && (
            <>
              <button id="resume-btn" className="btn btn-primary" onClick={onResume}>
                ▶ Resume
              </button>
              <button id="step-btn" className="btn btn-secondary" onClick={onStep}>
                ⏭ Step
              </button>
            </>
          )}
          {/* Reset */}
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

      {/* ── Row 2: Array Type Pills ── */}
      <div className="array-type-row">
        <span className="control-label" style={{ marginBottom: 0 }}>Array Type:</span>
        <div className="type-pills">
          {ARRAY_TYPES.map(({ key, label }) => (
            <button
              key={key}
              className={`type-pill ${arrayType === key ? 'active' : ''}`}
              onClick={() => setArrayType(key)}
              disabled={isRunning}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 3: Custom Array Input (only when type = custom) ── */}
      {arrayType === 'custom' && (
        <div className="custom-input-row">
          <input
            id="custom-array-input"
            type="text"
            className="custom-array-input"
            placeholder="Enter numbers separated by commas: 5, 3, 8, 1, 9, 2, 7"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={isRunning}
          />
          <button
            className="btn btn-secondary"
            onClick={onApplyCustom}
            disabled={isRunning}
          >
            Apply
          </button>
          {customError && <span className="custom-error">⚠ {customError}</span>}
        </div>
      )}
    </div>
  );
};

export default Controls;
