// App.jsx
// Root component — manages all state and the animation loop
//
// KEY REACT CONCEPTS USED HERE:
//   useState  → reactive variables (auto-updates the UI when changed)
//   useEffect → side effects (runs code when dependencies change)
//   useRef    → holds a value WITHOUT triggering re-render (used for timers)

import { useState, useEffect, useRef, useCallback } from 'react';
import Controls      from './components/Controls';
import SortVisualizer from './components/SortVisualizer';
import MetricsPanel  from './components/MetricsPanel';
import History       from './components/History';
import { ALGORITHMS } from './algorithms';
import { saveSortResult } from './api/sortApi';
import './App.css';

// ── Helper: generate a random shuffled array ──────────────────
const randomArray = (size) =>
  Array.from({ length: size }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5);

// ─────────────────────────────────────────────────────────────
function App() {
  // ── UI Controls State ──────────────────────────────────────
  const [algorithm, setAlgorithm] = useState('bubble');
  const [arraySize, setArraySize] = useState(60);
  const [speed, setSpeed]         = useState(20);       // ms per frame

  // ── Visualizer State ───────────────────────────────────────
  const [array, setArray]         = useState(() => randomArray(60));
  const [comparing, setComparing] = useState([]);
  const [swapped, setSwapped]     = useState(false);

  // ── Metrics State ──────────────────────────────────────────
  const [comparisons, setComparisons] = useState(0);
  const [swapsCount, setSwapsCount]   = useState(0);
  const [timeMs, setTimeMs]           = useState(0);

  // ── Run State ──────────────────────────────────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone]       = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // triggers History refetch

  // ── Refs (values that persist without causing re-renders) ──
  const timerRef    = useRef(null);   // holds the setInterval ID
  const startTimeRef = useRef(null);  // holds the start timestamp
  const clockRef    = useRef(null);   // holds the elapsed-time interval ID

  // ── When arraySize changes, generate a new array ───────────
  useEffect(() => {
    if (!isRunning) handleReset(arraySize);
  }, [arraySize]);

  // ── Cleanup on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(clockRef.current);
    };
  }, []);

  // ── Generate a new random array ───────────────────────────
  const handleReset = useCallback((size = arraySize) => {
    clearInterval(timerRef.current);
    clearInterval(clockRef.current);
    setArray(randomArray(size));
    setComparing([]);
    setSwapped(false);
    setComparisons(0);
    setSwapsCount(0);
    setTimeMs(0);
    setIsRunning(false);
    setIsDone(false);
  }, [arraySize]);

  // ── Start the sort animation ──────────────────────────────
  const handleStart = useCallback(() => {
    if (isRunning) return;

    // Reset metrics
    setComparisons(0);
    setSwapsCount(0);
    setTimeMs(0);
    setIsDone(false);
    setIsRunning(true);

    // Create the generator from the chosen algorithm
    const generator = ALGORITHMS[algorithm].fn(array);

    // Record start time
    startTimeRef.current = Date.now();

    // Start elapsed clock (updates every 100ms)
    clockRef.current = setInterval(() => {
      setTimeMs(Date.now() - startTimeRef.current);
    }, 100);

    // Step through the generator frames at `speed` ms intervals
    timerRef.current = setInterval(() => {
      const { value, done } = generator.next();

      if (done || !value) {
        // ── Sort finished ───────────────────────────────────
        clearInterval(timerRef.current);
        clearInterval(clockRef.current);

        const finalTime = Date.now() - startTimeRef.current;
        setTimeMs(finalTime);
        setComparing([]);
        setSwapped(false);
        setIsRunning(false);
        setIsDone(true);

        // Save result to MongoDB via the backend API
        saveSortResult({
          algorithm,
          arraySize: array.length,
          timeTakenMs: finalTime,
          comparisons: value?.comparisons ?? 0,
          swaps: value?.swaps ?? 0,
        }).then(() => {
          setRefreshKey((k) => k + 1); // refresh History table
        });

        return;
      }

      // ── Apply this frame to the UI ─────────────────────────
      setArray(value.array);
      setComparing(value.comparing);
      setSwapped(value.swapped);
      setComparisons(value.comparisons);
      setSwapsCount(value.swaps);

    }, speed);

  }, [isRunning, algorithm, array, speed]);

  // ────────────────────────────────────────────────────────────
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

      {/* ── Main Content ── */}
      <main className="app-main">

        {/* Controls */}
        <Controls
          algorithm={algorithm}   setAlgorithm={setAlgorithm}
          arraySize={arraySize}   setArraySize={setArraySize}
          speed={speed}           setSpeed={setSpeed}
          onStart={handleStart}
          onReset={() => handleReset()}
          isRunning={isRunning}
          isDone={isDone}
        />

        {/* Animated Bar Chart */}
        <SortVisualizer
          array={array}
          comparing={comparing}
          swapped={swapped}
        />

        {/* Bottom Row: Metrics + History */}
        <div className="bottom-row">
          <MetricsPanel
            comparisons={comparisons}
            swaps={swapsCount}
            timeMs={timeMs}
            isRunning={isRunning}
            isDone={isDone}
          />
          <History refreshKey={refreshKey} />
        </div>

      </main>
    </div>
  );
}

export default App;
