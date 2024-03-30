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
  // For now grids are always square
  // Each Uint8 represents alive or dead (128 or 0) + number of living neighbors
  const gameState = useRef<Uint8Array>(new Uint8Array(gridSize * gridSize));
  // Each Uint32 represents the location of a living cell (its index in gameState + 1)
  const livingCells = useRef<Uint32Array>(new Uint32Array(gridSize * gridSize));
  // Each Uint32 represents the location of a changed cell (its index in gameState + 1)
  const changedCells = useRef<Uint32Array>(
    new Uint32Array(gridSize * gridSize)
  );

  // Initialize data randomly, or based on passed initialData
  useEffect(() => {
    // Used for counting neighbors during initialization
    const countNeighbors = () => {
      // Iterate over every cell and add its neighbor count to its gameState data
      for (let i = 0; i < gameState.current.length; i++) {
        let livingNeighborCount = 0;
        // Check if cell to right is alive
        if (gameState.current[i + 1] >= 128) {
          livingNeighborCount++;
        }
        // Check bottom right
        if (gameState.current[i + gridSize + 1] >= 128) {
          livingNeighborCount++;
        }
        // Check bottom
        if (gameState.current[i + gridSize] >= 128) {
          livingNeighborCount++;
        }
        // Check bottom left
        if (gameState.current[i + gridSize - 1] >= 128) {
          livingNeighborCount++;
        }
        // Check left
        if (gameState.current[i - 1] >= 128) {
          livingNeighborCount++;
        }
        // Check top left
        if (gameState.current[i - gridSize - 1] >= 128) {
          livingNeighborCount++;
        }
        // Check top
        if (gameState.current[i - gridSize] >= 128) {
          livingNeighborCount++;
        }
        // Check top right
        if (gameState.current[i - gridSize] >= 128) {
          livingNeighborCount++;
        }
        // Add neighbor count to gameState
        gameState.current[i] += livingNeighborCount;
      }
    };

    if (!initialData) {
      // Randomize the gameState
      const livingCellsValues = livingCells.current.values();
      for (let i = 0; i < gameState.current.length; i++) {
        gameState.current[i] = Math.random() >= 0.5 ? 128 : 0;
        if (gameState.current[i] >= 128) {
          livingCellsValues.next().value = i + 1;
        }
      }
      countNeighbors();
    } else {
      // Set game state based on initialData
      const livingCellsValues = livingCells.current.values();
      for (let i = 0; i < gameState.current.length; i++) {
        gameState.current[i] = initialData[i] === 1 ? 128 : 0;
        if (gameState.current[i] >= 128) {
          livingCellsValues.next().value = i + 1;
        }
      }
      countNeighbors();
    }
  }, [gridSize, initialData]);

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
