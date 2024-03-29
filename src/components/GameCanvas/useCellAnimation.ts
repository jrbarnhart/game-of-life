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
      // All grids are square so this is sqrt of total length
      const rowsAndCols = Math.sqrt(cellData.current.length);
      const cellSize = canvas ? canvas.width / rowsAndCols : null;

      // Compute the next cell data state
      cellData.computeNext();

      // If restarting animation clear it and redraw current cell state
      if (options?.initialDraw && ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < cellData.current.length; i++) {
          if (cellSize) {
            const row = Math.floor(i / rowsAndCols);
            const col = i % rowsAndCols;
            const x = col * cellSize;
            const y = row * cellSize;

            ctx.fillStyle = cellData.next[i] === 0 ? "black" : "white";
            ctx.beginPath();
            ctx.rect(x, y, cellSize, cellSize);
            ctx.fill();
          }
        }
      } else {
        for (let i = 0; i < cellData.current.length; i++) {
          if (cellData.current[i] === cellData.next[i]) {
            continue;
          } else if (cellSize && ctx) {
            const row = Math.floor(i / rowsAndCols);
            const col = i % rowsAndCols;
            const x = col * cellSize;
            const y = row * cellSize;

            ctx.fillStyle = cellData.next[i] === 0 ? "black" : "white";
            ctx.beginPath();
            ctx.rect(x, y, cellSize, cellSize);
            ctx.fill();
          }
        }
      }

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
