import { useEffect, useRef } from "react";

export interface CellData {
  gameState: Uint8Array;
  changedCells: Uint32Array;
  computeNext: () => void;
}

const useCellData = (
  gridSize: number,
  initialData?: ArrayLike<number> | undefined
) => {
  // For now grids are always square with one row of padding cell surroudning the edges
  const paddedSize = gridSize + 2;
  // Each Uint8 represents alive or dead (128 or 0) + number of living neighbors
  const gameState = useRef<Uint8Array>(new Uint8Array(paddedSize * paddedSize));
  // Each Uint32 represents the location of a living cell (its index in gameState + 1)
  const livingCells = useRef<Uint32Array>(
    new Uint32Array(paddedSize * paddedSize)
  );
  // Each Uint32 represents the location of a changed cell (its index in gameState + 1)
  const changedCells = useRef<Uint32Array>(
    new Uint32Array(paddedSize * paddedSize)
  );

  // Initialize data randomly, or based on passed initialData
  useEffect(() => {
    // Used for counting neighbors during initialization
    const initializeNeighborCount = (index: number) => {
      // Iterate over every neighbor to check for living cells
      let livingNeighborCount = 0;
      // Check if cell to right is alive
      if (gameState.current[index + 1] >= 128) {
        livingNeighborCount++;
      }
      // Check bottom right
      if (gameState.current[index + paddedSize + 1] >= 128) {
        livingNeighborCount++;
      }
      // Check bottom
      if (gameState.current[index + paddedSize] >= 128) {
        livingNeighborCount++;
      }
      // Check bottom left
      if (gameState.current[index + paddedSize - 1] >= 128) {
        livingNeighborCount++;
      }
      // Check left
      if (gameState.current[index - 1] >= 128) {
        livingNeighborCount++;
      }
      // Check top left
      if (gameState.current[index - paddedSize - 1] >= 128) {
        livingNeighborCount++;
      }
      // Check top
      if (gameState.current[index - paddedSize] >= 128) {
        livingNeighborCount++;
      }
      // Check top right
      if (gameState.current[index - paddedSize + 1] >= 128) {
        livingNeighborCount++;
      }
      // Add neighbor count to gameState
      gameState.current[index] += livingNeighborCount;
    };

    const copyToPaddingCells = () => {
      // Copy data to padding cells
      for (let i = 0; i < paddedSize; i++) {
        // Copy left edge to right edge
        gameState.current[i * paddedSize + paddedSize - 1] =
          gameState.current[i * paddedSize + 1];
        // Copy right edge to left edge
        gameState.current[i * paddedSize] =
          gameState.current[i * paddedSize + paddedSize - 2];
      }
      for (let j = 0; j < paddedSize; j++) {
        // Copy top edge to bottom edge
        gameState.current[j] =
          gameState.current[(paddedSize - 2) * paddedSize + j];
        // Copy bottom edge to top edge
        gameState.current[(paddedSize - 1) * paddedSize + j] =
          gameState.current[paddedSize + j];
      }
    };

    // Initialize gameState and livingCells while ignoring padding cells
    let livingCellsIndex = 0;
    let changedCellsIndex = 0;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = (i + 1) * paddedSize + (j + 1);
        if (initialData) {
          // Initialize using provided data
          gameState.current[index] =
            initialData[i * gridSize + j] === 1 ? 128 : 0;
        } else {
          // Initialize randomly
          gameState.current[index] = Math.random() >= 0.5 ? 128 : 0;
        }

        // Add cell to changed cells for initial render
        changedCells.current[changedCellsIndex++] = index + 1;

        // If the cell is alive store it in the next livingCellsIndex
        if (gameState.current[index] >= 128) {
          livingCells.current[livingCellsIndex++] = index + 1;
        }
      }
    }

    copyToPaddingCells();

    // Initialize neighbor counts
    for (let i = 1; i <= gridSize; i++) {
      for (let j = 1; j <= gridSize; j++) {
        const index = i * paddedSize + j;
        initializeNeighborCount(index);
      }
    }
    // Copy updated padding cell values
    copyToPaddingCells();
  }, [gridSize, initialData, paddedSize]);

  // Method for calculating next
  const computeNext = () => {
    // Logic NYI. Ignore for now and just focus on data initialization logic.
  };

  const cellData: CellData = {
    gameState: gameState.current,
    changedCells: changedCells.current,
    computeNext,
  };
  return cellData;
};

export default useCellData;
