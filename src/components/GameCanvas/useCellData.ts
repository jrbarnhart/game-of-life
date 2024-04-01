import { useCallback, useEffect, useRef } from "react";

export interface CellData {
  gameState: Uint8Array;
  changedCells: Set<number>;
  computeNext: () => void;
}

const useCellData = (
  gridSize: number,
  initialData?: ArrayLike<number> | undefined
) => {
  // Grids are always square with one row of padding cells around the edges
  const paddedSize = gridSize + 2;
  // Game State: Each Uint8 represents alive or dead (128 or 0) + number of living neighbors
  const currentState = useRef<Uint8Array>(
    new Uint8Array(paddedSize * paddedSize)
  );
  const nextState = useRef<Uint8Array>(new Uint8Array(paddedSize * paddedSize));
  // Sets for keeping track of living cells and cells that have changed
  const livingCells = useRef<Set<number>>(new Set());
  const changedCells = useRef<Set<number>>(new Set());

  const copyToPaddingCells = useCallback(
    (gameState: Uint8Array, paddedSize: number) => {
      for (let i = 0; i < paddedSize; i++) {
        // Copy left edge to right padding cells
        gameState[i * paddedSize + paddedSize - 1] =
          gameState[i * paddedSize + 1];
        // Copy right edge to left padding cells
        gameState[i * paddedSize] = gameState[i * paddedSize + paddedSize - 2];
      }
      for (let j = 0; j < paddedSize; j++) {
        // Copy top edge to bottom padding cells
        gameState[j] = gameState[(paddedSize - 2) * paddedSize + j];
        // Copy bottom edge to top padding cells
        gameState[(paddedSize - 1) * paddedSize + j] =
          gameState[paddedSize + j];
      }
    },
    []
  );

  const countLivingNeighbors = useCallback(
    (gameState: Uint8Array, index: number, paddedSize: number) => {
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

      let livingNeighborCount = 0;
      for (const offset of neighborOffsets) {
        if (gameState[index + offset] >= 128) {
          livingNeighborCount++;
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
    // Initialize gameState and livingCells while ignoring padding cells
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = (i + 1) * paddedSize + (j + 1);
        if (initialData) {
          // Initialize using provided data
          const val = initialData[i * gridSize + j];
          currentState.current[index] = val === 1 ? 128 : 0;
          if (val === 1) {
            livingCells.current.add(index);
          }
        } else {
          // Initialize randomly
          const val = Math.random() >= 0.5 ? 128 : 0;
          currentState.current[index] = val;
          if (val === 128) {
            livingCells.current.add(index);
          }
        }

        // Add cell to changed cells for initial render
        changedCells.current.add(index);
      }
    }

    copyToPaddingCells(currentState.current, paddedSize);

    // Initialize neighbor counts
    for (let i = 1; i <= gridSize; i++) {
      for (let j = 1; j <= gridSize; j++) {
        const index = i * (gridSize + 2) + j;
        currentState.current[index] += countLivingNeighbors(
          currentState.current,
          index,
          paddedSize
        );
      }
    }

    // Copy updated padding cell values
    copyToPaddingCells(currentState.current, paddedSize);
  }, [
    copyToPaddingCells,
    gridSize,
    initialData,
    countLivingNeighbors,
    paddedSize,
  ]);

  // Method for calculating next state using Game of Life rules
  const computeNext = () => {
    changedCells.current.clear();

    // For all the living cells
    console.log(livingCells);
    for (const index of livingCells.current) {
      console.log(index);
      // Check for births around living cells
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
  };

  const cellData: CellData = {
    gameState: currentState.current,
    changedCells: changedCells.current,
    computeNext,
  };
  return cellData;
};

export default useCellData;
