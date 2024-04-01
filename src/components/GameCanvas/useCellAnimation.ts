import { useCallback, useEffect, useRef } from "react";
import { CellData } from "./useCellData";

const useCellAnimation = (
  canvas: HTMLCanvasElement | null,
  ctx: CanvasRenderingContext2D | null,
  canvasInitialized: boolean,
  cellData: CellData
) => {
  const animationFrameRef = useRef<number | null>(null);

  const animationLoop = useCallback(
    (options?: { initialDraw: boolean }) => {
      // Sqrt of total length of changedCells (instead of gameState), since padded cells won't be drawn
      const gridSize = Math.sqrt(cellData.changedCells.size);
      const paddedSize = gridSize + 2;
      const cellSize = canvas ? canvas.width / gridSize : 0;

      // Helper fn for drawing cells
      const drawCell = (ctx: CanvasRenderingContext2D, cellIndex: number) => {
        const row = Math.floor(cellIndex / paddedSize) - 1;
        const col = (cellIndex % paddedSize) - 1;
        const x = col * cellSize;
        const y = row * cellSize;

        ctx.fillStyle = cellData.gameState[cellIndex] < 128 ? "black" : "white";
        ctx.beginPath();
        ctx.rect(x, y, cellSize, cellSize);
        ctx.fill();
      };

      // If restarting animation clear canvas
      if (options?.initialDraw && ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Draw cells in changedCells set
      for (const cellIndex of cellData.changedCells) {
        if (cellSize && ctx) {
          drawCell(ctx, cellIndex);
        }
      }

      // Compute the next cell data state
      cellData.computeNext();

      animationFrameRef.current = requestAnimationFrame(() => {
        animationLoop();
      });
    },
    [ctx, canvas, cellData]
  );

  // Start the animation if canvas is initialized
  useEffect(() => {
    if (canvasInitialized) {
      animationLoop({ initialDraw: true });
      console.log("Animation started");
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationLoop, canvasInitialized]);
};

export default useCellAnimation;
