import { useCallback, useEffect, useRef } from "react";

export interface CellData {
  gameState: Uint8Array;
  changedCells: Set<number>;
  computeNext: () => void;
}

const useCellData = (
  gridSize: { width: number; height: number },
  initialData?: ArrayLike<number> | undefined
) => {
  // Game State: Each Uint8 represents alive or dead (128 or 0) + number of living neighbors
  const currentState = useRef<Uint8Array>(
    new Uint8Array(gridSize.width * gridSize.height)
  );
  const nextState = useRef<Uint8Array>(
    new Uint8Array(gridSize.width * gridSize.height)
  );
  // Sets for keeping track of living cells and cells that have changed
  const livingCells = useRef<Set<number>>(new Set());
  const changedCells = useRef<Set<number>>(new Set());

  const countLivingNeighbors = useCallback(
    (
      gameState: Uint8Array,
      row: number,
      col: number,
      gridSize: { width: number; height: number }
    ) => {
      let livingNeighborCount = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (!(i === 0 && j === 0)) {
            const neighborRow = (row + i + gridSize.height) % gridSize.height;
            const neighborCol = (col + j + gridSize.width) % gridSize.width;
            const neighborIndex = neighborRow * gridSize.width + neighborCol;

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

  const updateBirthNeighbors = (
    gameState: Uint8Array,
    index: number,
    paddedSize: number
  ) => {
    const neighborOffsets = [
      -1,
      1,
      -paddedSize,
      paddedSize,
      -paddedSize - 1,
      -paddedSize + 1,
      paddedSize - 1,
      paddedSize + 1,
    ];

    // Increment by one since one new living neighbor
    for (const offset of neighborOffsets) {
      gameState[index + offset]++;
      console.log("Incremented neighbor count", index + offset);
    }
  };

  const checkBirths = (
    currentState: Uint8Array,
    nextState: Uint8Array,
    index: number,
    paddedSize: number
  ) => {
    const neighborOffsets = [
      -1,
      1,
      -paddedSize,
      paddedSize,
      -paddedSize - 1,
      -paddedSize + 1,
      paddedSize - 1,
      paddedSize + 1,
    ];

    // If the neighbor itself has 3 living neighbors it comes to life
    // ### Need to figure out how to avoid padding cells ###
    for (const offset of neighborOffsets) {
      if (
        currentState[index + offset] === 3 &&
        nextState[index + offset] < 128
      ) {
        console.log("Cell birthed!", index + offset);
        nextState[index + offset] += 128;
        updateBirthNeighbors(nextState, index + offset, paddedSize);
        livingCells.current.add(index + offset);
      }
    }
  };

  // Initialize data randomly, or based on passed initialData
  useEffect(() => {
    // Initialize currentState, changedCells, and livingCells with provided or random data
    if (initialData) {
      for (let i = 0; i < currentState.current.length; i++) {
        const val = initialData[i];
        currentState.current[i] = val === 1 ? 128 : 0;
        if (val === 1) {
          livingCells.current.add(i);
        }
        changedCells.current.add(i);
      }
    } else {
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
    for (let row = 0; row < gridSize.height; row++) {
      for (let col = 0; col < gridSize.width; col++) {
        const index = row * gridSize.width + col;
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
  }, [gridSize, initialData, countLivingNeighbors]);

  // Method for calculating next state using Game of Life rules
  const computeNext = () => {
    changedCells.current.clear();

    // For all the living cells
    console.log(livingCells);
    for (const index of livingCells.current) {
      // Check for births around living cells
      //### This is not working because of how padding cell values are not really synced to the cells they mirror ###
      checkBirths(currentState.current, nextState.current, index, paddedSize);

      // >= 128 && not 130 && not 131 it dies (-128) and is added to changedCells and removed from living cells
      if (
        currentState.current[index] >= 128 &&
        currentState.current[index] !== 130 &&
        currentState.current[index] !== 131
      ) {
        nextState.current[index] -= 128;
        changedCells.current.add(index);
        livingCells.current.delete(index);
        console.log("Cell died!", index);
      }
    }

    // Update padding cells in nextState
    copyToPaddingCells(nextState.current, paddedSize);

    currentState.current.set(nextState.current);
    console.log(currentState.current);
  };

  const cellData: CellData = {
    gameState: currentState.current,
    changedCells: changedCells.current,
    computeNext,
  };
  return cellData;
};

export default useCellData;
