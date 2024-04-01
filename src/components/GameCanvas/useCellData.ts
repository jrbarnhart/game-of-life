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
  const gameStateA = useRef<Uint8Array>(
    new Uint8Array(paddedSize * paddedSize)
  );
  const gameStateB = useRef<Uint8Array>(
    new Uint8Array(paddedSize * paddedSize)
  );
  const currentState = useRef(gameStateA.current);
  const nextState = useRef(gameStateB.current);
  // Sets for keeping track of living cells and cells that have changed
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
      neighborOffsets.forEach((offset) => {
        if (gameState[index + offset] >= 128) {
          livingNeighborCount++;
        }
      });
      return livingNeighborCount;
    },
    []
  );

  // Initialize data randomly, or based on passed initialData
  useEffect(() => {
    // Initialize gameState and livingCells while ignoring padding cells
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = (i + 1) * paddedSize + (j + 1);
        if (initialData) {
          // Initialize using provided data
          currentState.current[index] =
            initialData[i * gridSize + j] === 1 ? 128 : 0;
        } else {
          // Initialize randomly
          currentState.current[index] = Math.random() >= 0.5 ? 128 : 0;
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

    // Set next to current values
    nextState.current.set(currentState.current);

    // For all the living cells
    //    Count living neighbors in currentState and add to nextState values (+1 per neighbor)
    //    Iterate over non-padding cells in currentState and apply GoL rules updates to nextState
    //      3 = comes to life (+128) and is added to changedCells
    //      >= 128 && not 130 && not 131 it dies (-128) and is added to changedCells

    // Update padding cells in nextState

    // Swap current and next array refs rather than writing next to current
    const temp = currentState.current;
    currentState.current = nextState.current;
    nextState.current = temp;
  };

  const cellData: CellData = {
    gameState: currentState.current,
    changedCells: changedCells.current,
    computeNext,
  };
  return cellData;
};

export default useCellData;
