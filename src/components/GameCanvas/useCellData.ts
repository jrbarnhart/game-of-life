import { useRef } from "react";

export interface CellData {
  current: Int8Array;
  next: Int8Array;
  initialize: () => void;
  computeNext: () => void;
}

const useCellData = (gridSize: number) => {
  const currentValues = useRef(new Int8Array(gridSize * gridSize));
  const nextValues = useRef(new Int8Array(gridSize * gridSize));

  // Method for initializing data
  const initialize = () => {
    // Set values to random for now. Later update for default random or provided data.
    for (let i = 0; i < currentValues.current.length; i++) {
      currentValues.current[i] = Math.random() >= 0.5 ? 1 : 0;
    }
  };

  // Method for calculating next
  const computeNext = () => {
    // Use GoL rules to determine next state
  };

  const cellData: CellData = {
    current: currentValues.current,
    next: nextValues.current,
    initialize,
    computeNext,
  };
  return cellData;
};

export default useCellData;
