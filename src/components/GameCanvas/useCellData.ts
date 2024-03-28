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
  const currentValues = useRef(new Int8Array(gridSize * gridSize));
  const nextValues = useRef(new Int8Array(gridSize * gridSize));

  // Initialize data randomly, or based on passed data
  useEffect(() => {
    if (!initialData) {
      for (let i = 0; i < currentValues.current.length; i++) {
        currentValues.current[i] = Math.random() >= 0.5 ? 1 : 0;
      }
      console.log("Initialized cells randomly");
    } else {
      // Initialize cells based on passed data
    }
  }, [initialData]);

  // Method for calculating next
  const computeNext = () => {
    // Use GoL rules to determine next state
    // For now just set to current
    nextValues.current.set(currentValues.current);
  };

  const cellData: CellData = {
    current: currentValues.current,
    next: nextValues.current,
    computeNext,
  };
  return cellData;
};

export default useCellData;
