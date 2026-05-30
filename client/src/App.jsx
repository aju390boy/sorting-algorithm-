// App.jsx — Root component with full state + pause/resume/step + array types

import { useState, useEffect, useRef, useCallback } from 'react';
import Controls       from './components/Controls';
import SortVisualizer from './components/SortVisualizer';
import MetricsPanel   from './components/MetricsPanel';
import AlgorithmInfo  from './components/AlgorithmInfo';
import StatsChart     from './components/StatsChart';
import History        from './components/History';
import { ALGORITHMS } from './algorithms';
import { saveSortResult } from './api/sortApi';
import './App.css';

// ── Array Generators ──────────────────────────────────────────
const makeRandom       = (n) => Array.from({ length: n }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
const makeReversed     = (n) => Array.from({ length: n }, (_, i) => n - i);
const makeNearlySorted = (n) => {
  const a = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = 0; i < Math.max(1, Math.floor(n * 0.05)); i++) {
    const x = Math.floor(Math.random() * n);
    const y = Math.floor(Math.random() * n);
    [a[x], a[y]] = [a[y], a[x]];
  }
  return a;
};
const makeFewUnique = (n) =>
  Array.from({ length: n }, () => Math.ceil(Math.random() * 5) * Math.floor(n / 5));

const generateArray = (type, size) => {
  switch (type) {
    case 'reversed':      return makeReversed(size);
    case 'nearly-sorted': return makeNearlySorted(size);
    case 'few-unique':    return makeFewUnique(size);
    default:              return makeRandom(size);
  }
};

// ─────────────────────────────────────────────────────────────
function App() {
  // ── Controls state ─────────────────────────────────────────
  const [algorithm,    setAlgorithm]    = useState('bubble');
  const [arrayType,    setArrayType]    = useState('random');
  const [arraySize,    setArraySize]    = useState(60);
  const [speed,        setSpeed]        = useState(20);
  const [customInput,  setCustomInput]  = useState('');
  const [customError,  setCustomError]  = useState('');

  // ── Visualizer state ───────────────────────────────────────
  const [array,      setArray]      = useState(() => makeRandom(60));
  const [comparing,  setComparing]  = useState([]);
  const [swapped,    setSwapped]    = useState(false);
  const [isSorted,   setIsSorted]   = useState(false);

  // ── Metrics state ──────────────────────────────────────────
  const [comparisons, setComparisons] = useState(0);
  const [swapsCount,  setSwapsCount]  = useState(0);
  const [timeMs,      setTimeMs]      = useState(0);

  // ── Playback state ─────────────────────────────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused,  setIsPaused]  = useState(false);
  const [isDone,    setIsDone]    = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ── Refs ───────────────────────────────────────────────────
  const timerRef       = useRef(null);
  const clockRef       = useRef(null);
  const generatorRef   = useRef(null);
  const startTimeRef   = useRef(null);
  const pausedElapsed  = useRef(0);   // accumulated elapsed when paused

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(clockRef.current);
  }, []);

  // Regenerate array when arrayType or arraySize changes (not for custom)
  useEffect(() => {
    if (arrayType !== 'custom' && !isRunning) {
      resetAll(generateArray(arrayType, arraySize));
    }
  }, [arrayType, arraySize]);

  // ── Helpers ────────────────────────────────────────────────
  const resetAll = (newArray) => {
    clearInterval(timerRef.current);
    clearInterval(clockRef.current);
    generatorRef.current = null;
    setArray(newArray);
    setComparing([]);
    setSwapped(false);
    setIsSorted(false);
    setComparisons(0);
    setSwapsCount(0);
    setTimeMs(0);
    setIsRunning(false);
    setIsPaused(false);
    setIsDone(false);
    pausedElapsed.current = 0;
  };

  const applyFrame = (frame) => {
    setArray(frame.array);
    setComparing(frame.comparing);
    setSwapped(frame.swapped);
    setComparisons(frame.comparisons);
    setSwapsCount(frame.swaps);
  };

  const finishSort = useCallback((lastValue) => {
    clearInterval(timerRef.current);
    clearInterval(clockRef.current);

    const finalTime = pausedElapsed.current + (Date.now() - startTimeRef.current);
    setTimeMs(finalTime);
    setComparing([]);
    setSwapped(false);
    setIsSorted(true);
    setIsRunning(false);
    setIsPaused(false);
    setIsDone(true);

    saveSortResult({
      algorithm,
      arraySize: array.length,
      timeTakenMs: finalTime,
      comparisons: lastValue?.comparisons ?? 0,
      swaps: lastValue?.swaps ?? 0,
    }).then(() => setRefreshKey((k) => k + 1));
  }, [algorithm, array.length]);

  // ── Start animation ────────────────────────────────────────
  const startInterval = useCallback((gen) => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const { value, done } = gen.next();
      if (done || !value) { finishSort(value); return; }
      applyFrame(value);
    }, speed);
  }, [speed, finishSort]);

  const handleStart = useCallback(() => {
    if (isRunning || isPaused) return;
    pausedElapsed.current = 0;
    setComparisons(0);
    setSwapsCount(0);
    setTimeMs(0);
    setIsSorted(false);
    setIsDone(false);
    setIsRunning(true);
    setIsPaused(false);

    const gen = ALGORITHMS[algorithm].fn(array);
    generatorRef.current = gen;
    startTimeRef.current = Date.now();

    clockRef.current = setInterval(() => {
      setTimeMs(pausedElapsed.current + (Date.now() - startTimeRef.current));
    }, 100);

    startInterval(gen);
  }, [isRunning, isPaused, algorithm, array, startInterval]);

  // ── Pause ──────────────────────────────────────────────────
  const handlePause = () => {
    clearInterval(timerRef.current);
    clearInterval(clockRef.current);
    pausedElapsed.current += Date.now() - startTimeRef.current;
    setIsRunning(false);
    setIsPaused(true);
  };

  // ── Resume ─────────────────────────────────────────────────
  const handleResume = useCallback(() => {
    if (!generatorRef.current) return;
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();

    clockRef.current = setInterval(() => {
      setTimeMs(pausedElapsed.current + (Date.now() - startTimeRef.current));
    }, 100);

    startInterval(generatorRef.current);
  }, [startInterval]);

  // ── Step (one frame at a time when paused) ─────────────────
  const handleStep = useCallback(() => {
    if (!generatorRef.current) return;
    const { value, done } = generatorRef.current.next();
    if (done || !value) { finishSort(value); return; }
    applyFrame(value);
    pausedElapsed.current += speed;
    setTimeMs(pausedElapsed.current);
  }, [finishSort, speed]);

  // ── Reset ──────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    const newArr = arrayType === 'custom'
      ? array
      : generateArray(arrayType, arraySize);
    resetAll(newArr);
  }, [arrayType, arraySize, array]);

  // ── Custom array ───────────────────────────────────────────
  const handleApplyCustom = () => {
    setCustomError('');
    const nums = customInput
      .split(/[,\s]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    if (nums.length < 2)   return setCustomError('Enter at least 2 valid positive numbers');
    if (nums.length > 300) return setCustomError('Maximum 300 elements allowed');
    resetAll(nums);
  };

  // ── Array type change ──────────────────────────────────────
  const handleSetArrayType = (type) => {
    setArrayType(type);
    if (type !== 'custom') {
      setCustomError('');
      if (!isRunning) resetAll(generateArray(type, arraySize));
    }
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-icon">⚡</div>
          <h1>Sorting Algorithm Visualizer</h1>
        </div>
        <span className="header-badge">MERN Stack</span>
      </header>

      <main className="app-main">

        {/* Controls */}
        <Controls
          algorithm={algorithm}     setAlgorithm={setAlgorithm}
          arrayType={arrayType}     setArrayType={handleSetArrayType}
          arraySize={arraySize}     setArraySize={setArraySize}
          speed={speed}             setSpeed={setSpeed}
          customInput={customInput} setCustomInput={setCustomInput}
          customError={customError}
          onApplyCustom={handleApplyCustom}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onStep={handleStep}
          onReset={handleReset}
          isRunning={isRunning}
          isPaused={isPaused}
          isDone={isDone}
        />

        {/* Visualizer */}
        <SortVisualizer
          array={array}
          comparing={comparing}
          swapped={swapped}
          isSorted={isSorted}
        />

        {/* Middle Row: Algorithm Info + Metrics */}
        <div className="middle-row">
          <AlgorithmInfo algorithm={algorithm} />
          <MetricsPanel
            comparisons={comparisons}
            swaps={swapsCount}
            timeMs={timeMs}
            isRunning={isRunning}
            isPaused={isPaused}
            isDone={isDone}
          />
        </div>

        {/* Bottom Row: Stats Chart + History */}
        <div className="bottom-row">
          <StatsChart refreshKey={refreshKey} />
          <History
            refreshKey={refreshKey}
            onRefresh={() => setRefreshKey((k) => k + 1)}
          />
        </div>

      </main>
    </div>
  );
}

export default App;
