import { useCallback, useRef } from "react";

export interface CellData {
  gameState: Uint8Array;
  changedCells: Set<number>;
  livingCells: Set<number>;
  initStateArrays: (width: number, height: number) => void;
  initData: (initialData?: Set<number> | undefined) => void;
  clear: () => void;
  computeNext: () => void;
}

const useCellData = (
  gridSize: React.MutableRefObject<{ width: number; height: number }>
) => {
  // Game State: Each Uint8 represents alive or dead (128 or 0) + number of living neighbors
  const currentState = useRef<Uint8Array>(
    new Uint8Array(gridSize.current.width * gridSize.current.height)
  );
  const nextState = useRef<Uint8Array>(
    new Uint8Array(gridSize.current.width * gridSize.current.height)
  );
  // Sets for keeping track of living cells and cells that have changed
  const livingCells = useRef<Set<number>>(new Set());
  const changedCells = useRef<Set<number>>(new Set());

  const countLivingNeighbors = useCallback(
    (
      gameState: Uint8Array,
      row: number,
      col: number,
      gridSize: React.MutableRefObject<{ width: number; height: number }>
    ) => {
      let livingNeighborCount = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (!(i === 0 && j === 0)) {
            const neighborRow =
              (row + i + gridSize.current.height) % gridSize.current.height;
            const neighborCol =
              (col + j + gridSize.current.width) % gridSize.current.width;
            const neighborIndex =
              neighborRow * gridSize.current.width + neighborCol;

            if (gameState[neighborIndex] >= 128) {
              livingNeighborCount++;
            }
          }
        }
      }
      return livingNeighborCount;
    },
    []
  );

  const incrementLivingNeighbors = (
    gameState: Uint8Array,
    index: number,
    gridSize: React.MutableRefObject<{ width: number; height: number }>,
    amount: number
  ) => {
    const row = Math.floor(index / gridSize.current.width);
    const col = index % gridSize.current.width;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!(i === 0 && j === 0)) {
          const neighborRow =
            (row + i + gridSize.current.height) % gridSize.current.height;
          const neighborCol =
            (col + j + gridSize.current.width) % gridSize.current.width;
          const neighborIndex =
            neighborRow * gridSize.current.width + neighborCol;

          // console.log("Increment living neighbors in:", neighborIndex);
          gameState[neighborIndex] += amount;
        }
      }
    }
  };

  const computeBirths = (
    currentState: Uint8Array,
    nextState: Uint8Array,
    index: number,
    gridSize: React.MutableRefObject<{ width: number; height: number }>
  ) => {
    const row = Math.floor(index / gridSize.current.width);
    const col = index % gridSize.current.width;
    const birthIndexes = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!(i === 0 && j === 0)) {
          const neighborRow =
            (row + i + gridSize.current.height) % gridSize.current.height;
          const neighborCol =
            (col + j + gridSize.current.width) % gridSize.current.width;
          const neighborIndex =
            neighborRow * gridSize.current.width + neighborCol;

          if (
            currentState[neighborIndex] === 3 &&
            nextState[neighborIndex] < 128
          ) {
            //console.log("Cell born!", neighborIndex);
            nextState[neighborIndex] += 128;
            birthIndexes.push(neighborIndex);
            changedCells.current.add(neighborIndex);
            incrementLivingNeighbors(nextState, neighborIndex, gridSize, 1);
          }
        }
      }
    }
    //console.log("Returning BI:", birthIndexes);
    return birthIndexes;
  };

  const initStateArrays = (width: number, height: number) => {
    // Recreate Uint8Arrays if needed
    if (currentState.current.length !== width * height) {
      console.log("Recreated Uint8s");
      currentState.current = new Uint8Array(width * height);
      nextState.current = new Uint8Array(width * height);
    }
  };

  // Method to initialize data randomly
  const initData = (initialData?: Set<number> | undefined) => {
    if (initialData) {
      // Initialize cells based on passed array of indexes
      for (const index of initialData) {
        currentState.current[index] = 128;
        livingCells.current.add(index);
      }
    } else {
      // Initialize cells to living or dead at 1:1 ratio
      for (let i = 0; i < currentState.current.length; i++) {
        const val = Math.random() >= 0.5 ? 128 : 0;
        currentState.current[i] = val;
        if (val === 128) {
          livingCells.current.add(i);
        }
        changedCells.current.add(i);
      }
    }

    // Initialize neighbor counts
    for (let row = 0; row < gridSize.current.height; row++) {
      for (let col = 0; col < gridSize.current.width; col++) {
        const index = row * gridSize.current.width + col;
        currentState.current[index] += countLivingNeighbors(
          currentState.current,
          row,
          col,
          gridSize
        );
      }
    }

    // Copy current state to next state for first calculations
    nextState.current.set(currentState.current);
    console.log("Initialized data");
  };

  // Method for clearing state data by setting values to 0
  const clear = () => {
    currentState.current.fill(0);
  };

  // Method for calculating next state using Game of Life rules
  const computeNext = () => {
    changedCells.current.clear();

    // For all the living cells
    //console.log(livingCells);
    let birthIndexes: number[] = [];
    for (const index of livingCells.current) {
      // Check for births around living cells
      birthIndexes = computeBirths(
        currentState.current,
        nextState.current,
        index,
        gridSize
      );

      // >= 128 && not 130 && not 131 it dies (-128) and is added to changedCells and removed from living cells
      if (
        currentState.current[index] >= 128 &&
        currentState.current[index] !== 130 &&
        currentState.current[index] !== 131
      ) {
        // console.log("Cell died!", index);
        nextState.current[index] -= 128;
        changedCells.current.add(index);
        livingCells.current.delete(index);
        incrementLivingNeighbors(nextState.current, index, gridSize, -1);
      }
      // console.log("Adding BI:", birthIndexes);
      for (const index of birthIndexes) {
        livingCells.current.add(index);
      }
    }

    currentState.current.set(nextState.current);
    // console.log(currentState.current);
  };

  const cellData: CellData = {
    gameState: currentState.current,
    changedCells: changedCells.current,
    livingCells: livingCells.current,
    initStateArrays,
    initData,
    clear,
    computeNext,
  };
  return cellData;
};

export default useCellData;
