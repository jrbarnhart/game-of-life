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
  const livingCells = useRef<Uint32Array>(new Uint32Array(gridSize * gridSize));
  const newLivingCells = useRef<Uint32Array>(
    new Uint32Array(gridSize * gridSize)
  );
  const changedCells = useRef<Uint32Array>(
    new Uint32Array(gridSize * gridSize)
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

  // Helper fn for adjusting living neighbors for all of a cell's neighbors
  const adjustLivingNeighbors = (amount: number, cellLocation: number) => {
    // Check 3x3 around cell omitting cell itself
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        // Don't update query cell as it is not its own neighbor
        if (!(i === 0 && j === 0)) {
          // Adjust the cell by the passed amount
          gameState.current[cellLocation - 1 + i * paddedSize + j] += amount;
        }
      }
    }
  };

  // Method for calculating next using Game of Life rules
  const computeNext = () => {
    // Set changedCells and newLivingCells to 0's
    changedCells.current.fill(0);
    newLivingCells.current.fill(0);
    // Init indexes for cell lists
    let newLivingCellsIndex = 0;
    let changedCellsIndex = 0;
    // Iterate through living cells
    for (const cellLocation of livingCells.current) {
      const cell = gameState.current[cellLocation - 1];
      // If 128+ (alive) but without correct neighbor count (128 + 2 or 3) it dies
      if (cell >= 128 && (cell < 130 || cell > 131)) {
        // Cell died (-128) so add its location to changedCells
        gameState.current[cellLocation - 1] -= 128;
        changedCells.current[changedCellsIndex++] -= cellLocation;
        // Update neighbor cells living neighbors by subtracting one
        adjustLivingNeighbors(-1, cellLocation);
      } else {
        // It didn't die so add to new living cells
        newLivingCells.current[newLivingCellsIndex++] = cellLocation;
      }
    }

    //Check if changedCells cause cell births in neighbors
    for (const cellLocation of changedCells.current) {
      // Break when encountering 0 indicating end of list
      if (cellLocation === 0) break;
      // Check 3x3 around cell omitting cell itself
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // If it is 3 (dead with 3 living neighbors)
          if (
            !(i === 0 && j === 0) &&
            gameState.current[cellLocation - 1 + i * paddedSize + j] === 3
          ) {
            // Cell comes alive (+128) so add it to new living cells and changed cells
            gameState.current[cellLocation - 1 + i * paddedSize + j] += 128;
            newLivingCells.current[newLivingCellsIndex++] = cellLocation;
            changedCells.current[changedCellsIndex++] = cellLocation;
          }
        }
      }
    }

    // Copy the padding cells
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

    // Set living cells to new living cells
    livingCells.current.set(newLivingCells.current);
  };

  const cellData: CellData = {
    gameState: gameState.current,
    changedCells: changedCells.current,
    computeNext,
  };
  return cellData;
};

export default useCellData;
