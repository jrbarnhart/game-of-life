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
      const gridSize = Math.sqrt(cellData.changedCells.length);
      const paddedSize = gridSize + 2;
      const cellSize = canvas ? canvas.width / gridSize : 0;

      // Helper fn for drawing cells
      const drawCell = (
        ctx: CanvasRenderingContext2D,
        cellLocation: number
      ) => {
        const row = Math.floor(cellLocation / paddedSize) - 1;
        const col = (cellLocation % paddedSize) - 2;
        const x = col * cellSize;
        const y = row * cellSize;

        ctx.fillStyle =
          cellData.gameState[cellLocation - 1] < 128 ? "black" : "white";
        ctx.beginPath();
        ctx.rect(x, y, cellSize, cellSize);
        ctx.fill();
      };

      // If restarting animation clear it and redraw current cell state
      if (options?.initialDraw && ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const cellLocation of cellData.changedCells) {
          if (cellSize && cellLocation > 0) {
            // Subtract 1 for 0 based index
            drawCell(ctx, cellLocation);
          } else {
            break;
          }
        }
      } else if (ctx) {
        for (const cellLocation of cellData.changedCells) {
          if (cellSize && cellLocation > 0) {
            // Subtract 1 for 0 based index
            drawCell(ctx, cellLocation);
          } else {
            break;
          }
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
