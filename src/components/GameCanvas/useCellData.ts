import { useRef } from "react";

const useCellData = (gridSize: number) => {
  const currentValues = useRef(new Int8Array(gridSize * gridSize));
  const nextValues = useRef(new Int8Array(gridSize * gridSize));

  // Method for initializing data
  const initialize = () => {
    // Set values to random for now
    for (let i = 0; i < currentValues.current.length; i++) {
      currentValues.current[i] = Math.round(Math.random());
    }
  };

  // Method for calculating next
  const computeNext = () => {
    // Use GoL rules to determine next state
  };

  const cellData = {
    current: currentValues.current,
    next: nextValues.current,
    initialize,
    computeNext,
  };
  return cellData;
};

export default useCellData;
