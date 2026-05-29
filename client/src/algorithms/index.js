// algorithms/index.js
// Generator functions — each yield is one animation "frame"

// ─── Bubble Sort ───────────────────────────────────────────────
export function* bubbleSort(inputArr) {
  const a = [...inputArr];
  let comparisons = 0, swaps = 0;
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        yield { array: [...a], comparing: [j, j + 1], swapped: true, comparisons, swaps };
      } else {
        yield { array: [...a], comparing: [j, j + 1], swapped: false, comparisons, swaps };
      }
    }
  }
  return { array: [...a], comparisons, swaps };
}

// ─── Selection Sort ────────────────────────────────────────────
export function* selectionSort(inputArr) {
  const a = [...inputArr];
  let comparisons = 0, swaps = 0;
  const n = a.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      if (a[j] < a[minIdx]) minIdx = j;
      yield { array: [...a], comparing: [minIdx, j], swapped: false, comparisons, swaps };
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps++;
      yield { array: [...a], comparing: [i, minIdx], swapped: true, comparisons, swaps };
    }
  }
  return { array: [...a], comparisons, swaps };
}

// ─── Insertion Sort ────────────────────────────────────────────
export function* insertionSort(inputArr) {
  const a = [...inputArr];
  let comparisons = 0, swaps = 0;
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      comparisons++;
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      swaps++;
      j--;
      yield { array: [...a], comparing: [j, j + 1], swapped: true, comparisons, swaps };
    }
    if (j > 0) comparisons++;
  }
  return { array: [...a], comparisons, swaps };
}

// ─── Merge Sort (iterative generator) ─────────────────────────
export function* mergeSort(inputArr) {
  const a = [...inputArr];
  let comparisons = 0, swaps = 0;
  const n = a.length;

  for (let size = 1; size < n; size *= 2) {
    for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {
      const mid = Math.min(leftStart + size - 1, n - 1);
      const rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);
      if (mid >= rightEnd) continue;

      // Merge a[leftStart..mid] and a[mid+1..rightEnd]
      const left = a.slice(leftStart, mid + 1);
      const right = a.slice(mid + 1, rightEnd + 1);
      let i = 0, j = 0, k = leftStart;

      while (i < left.length && j < right.length) {
        comparisons++;
        if (left[i] <= right[j]) {
          a[k++] = left[i++];
        } else {
          a[k++] = right[j++];
          swaps++;
        }
        yield { array: [...a], comparing: [k - 1, mid + 1 + j - 1], swapped: swaps > 0, comparisons, swaps };
      }
      while (i < left.length) { a[k++] = left[i++]; }
      while (j < right.length) { a[k++] = right[j++]; }
      yield { array: [...a], comparing: [], swapped: false, comparisons, swaps };
    }
  }
  return { array: [...a], comparisons, swaps };
}

// ─── Quick Sort (iterative generator) ─────────────────────────
export function* quickSort(inputArr) {
  const a = [...inputArr];
  let comparisons = 0, swaps = 0;
  const stack = [[0, a.length - 1]];

  while (stack.length) {
    const [low, high] = stack.pop();
    if (low >= high) continue;

    // Partition
    const pivot = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      yield { array: [...a], comparing: [j, high], swapped: false, comparisons, swaps };
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        swaps++;
        yield { array: [...a], comparing: [i, j], swapped: true, comparisons, swaps };
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    swaps++;
    yield { array: [...a], comparing: [i + 1, high], swapped: true, comparisons, swaps };
    const pi = i + 1;
    stack.push([low, pi - 1]);
    stack.push([pi + 1, high]);
  }
  return { array: [...a], comparisons, swaps };
}

// ─── Heap Sort ────────────────────────────────────────────────
export function* heapSort(inputArr) {
  const a = [...inputArr];
  let comparisons = 0, swaps = 0;
  const n = a.length;

  function* heapify(arr, size, root) {
    let largest = root;
    const l = 2 * root + 1;
    const r = 2 * root + 2;
    if (l < size) { comparisons++; if (arr[l] > arr[largest]) largest = l; }
    if (r < size) { comparisons++; if (arr[r] > arr[largest]) largest = r; }
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      swaps++;
      yield { array: [...arr], comparing: [root, largest], swapped: true, comparisons, swaps };
      yield* heapify(arr, size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(a, n, i);

  // Extract one by one
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    swaps++;
    yield { array: [...a], comparing: [0, i], swapped: true, comparisons, swaps };
    yield* heapify(a, i, 0);
  }
  return { array: [...a], comparisons, swaps };
}

// ─── Algorithm Registry ────────────────────────────────────────
export const ALGORITHMS = {
  bubble:    { name: 'Bubble Sort',    fn: bubbleSort    },
  selection: { name: 'Selection Sort', fn: selectionSort },
  insertion: { name: 'Insertion Sort', fn: insertionSort },
  merge:     { name: 'Merge Sort',     fn: mergeSort     },
  quick:     { name: 'Quick Sort',     fn: quickSort     },
  heap:      { name: 'Heap Sort',      fn: heapSort      },
};
