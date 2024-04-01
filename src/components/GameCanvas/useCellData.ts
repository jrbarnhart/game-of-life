import { useCallback, useEffect, useRef } from "react";

export interface CellData {
  gameState: Uint8Array;
  changedCells: Uint32Array;
  computeNext: () => void;
}

const useCellData = (
  gridSize: number,
  initialData?: ArrayLike<number> | undefined
) => {
  // Grids are always square with one row of padding cells around the edges
  const paddedSize = gridSize + 2;
  // Each Uint8 represents alive or dead (128 or 0) + number of living neighbors
  const gameStateA = useRef<Uint8Array>(
    new Uint8Array(paddedSize * paddedSize)
  );
  const gameStateB = useRef<Uint8Array>(
    new Uint8Array(paddedSize * paddedSize)
  );
  const currentState = useRef(gameStateA.current);
  // Each Uint32 represents the location of a living cell (its index in gameState + 1)
  const changedCells = useRef<Uint32Array>(
    new Uint32Array(gridSize * gridSize)
  );
  const changedCellsIndex = useRef(0);

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

  const initializeNeighborCount = useCallback(
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
      gameState[index] += livingNeighborCount;
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
        changedCells.current[changedCellsIndex.current++] = index + 1;
      }
    }

    copyToPaddingCells(currentState.current, paddedSize);

    // Initialize neighbor counts (padding cells will have incorrect neighbor values after this)
    for (let i = 1; i <= gridSize; i++) {
      for (let j = 1; j <= gridSize; j++) {
        const index = i * paddedSize + j;
        initializeNeighborCount(currentState.current, index, paddedSize);
      }
    }

    // Copy updated padding cell values
    copyToPaddingCells(currentState.current, paddedSize);
  }, [
    copyToPaddingCells,
    gridSize,
    initialData,
    initializeNeighborCount,
    paddedSize,
  ]);

  // Method for calculating next state using Game of Life rules
  const computeNext = () => {
    // Logic
  };

  const cellData: CellData = {
    gameState: currentState.current,
    changedCells: changedCells.current,
    computeNext,
  };
  return cellData;
};

export default useCellData;
