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
      for (let i = 0; i < currentValues.current.length; i++) {
        currentValues.current[i] = initialData[i];
      }
    }
  }, [initialData]);

  // Method for calculating next
  const computeNext = () => {
    // For now just set the next values to current values
    const current = currentValues.current;
    const next = nextValues.current;
    next.set(current);

    // Use GoL rules to determine next state
    /*
    Modify the initialization logic to iterate through the provided initial data and record the index of living cells + 1 (starting with 1) as an integer in the currentValues typed array. If no initial data is provided, generate random data based on the grid size.

    In the computeNext function, iterate over the currentValues array to determine the state of each cell based on the rules of the Game of Life. If a cell is living, record its location (index + 1 so 0 can be used for "empty values") in the nextValues array. If an index value of zero is reached, stop reading currentValues.

    Ensure that all values after the last living cell insertion in nextValues are set to zero to prevent "false positive reads" in future calculations. (can be optimized further?)
    */

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
