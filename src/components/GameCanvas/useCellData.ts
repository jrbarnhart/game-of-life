import { useEffect, useRef } from "react";

export interface CellData {
  current: Int8Array;
  next: Int8Array;
  computeNext: () => void;
}

const useCellData = (
  gridSize: number,
  initialData?: ArrayLike<number> | undefined
) => {
  // Two arrays used to skip redudant cell draws
  const valuesA = useRef(new Int8Array(gridSize * gridSize));
  const valuesB = useRef(new Int8Array(gridSize * gridSize));
  const currentValues = useRef(valuesA.current);
  const nextValues = useRef(valuesB.current);

  // Initialize data randomly, or based on passed data
  useEffect(() => {
    if (!initialData) {
      for (let i = 0; i < currentValues.current.length; i++) {
        currentValues.current[i] = Math.random() >= 0.5 ? 1 : 0;
      }
    } else {
      // Initialize cells based on passed data
    }
  }, [initialData]);

  // Method for calculating next
  const computeNext = () => {
    // Use GoL rules to determine next state

    // For now just set the next values to current values
    const current = currentValues.current;
    const next = nextValues.current;
    next.set(current);

    // Swap current and next references
    const temp = currentValues.current;
    currentValues.current = nextValues.current;
    nextValues.current = temp;
  };

  const cellData: CellData = {
    current: currentValues.current,
    next: nextValues.current,
    computeNext,
  };
  return cellData;
};

export default useCellData;
