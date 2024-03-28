import { useCallback, useEffect, useRef } from "react";
import { CellData } from "./useCellData";

const useCellAnimation = (
  canvas: HTMLCanvasElement | null,
  ctx: CanvasRenderingContext2D | null,
  canvasInitialized: boolean,
  cellData: CellData
) => {
  const animationFrameRef = useRef<number | null>(null);
  // All grids are square so this is sqrt of total length
  const rowsAndCols = Math.sqrt(cellData.current.length);
  const cellSize = canvas ? canvas.width / rowsAndCols : null;

  const animationLoop = useCallback(() => {
    for (let i = 0; i < cellData.current.length; i++) {
      if (cellData.current[i] === cellData.next[i]) {
        continue;
      } else if (cellSize && ctx) {
        const row = Math.floor(i / rowsAndCols);
        const col = i % rowsAndCols;
        const x = col * cellSize;
        const y = row * cellSize;

        ctx.strokeStyle = cellData.next[i] === 0 ? "transparent" : "white";
        ctx.beginPath();
        ctx.rect(x, y, cellSize, cellSize);
        ctx.fill();
        console.log("Drew cell!");
      }
    }

    // Compute the next cell data state
    cellData.computeNext();

    animationFrameRef.current = requestAnimationFrame(() => {
      animationLoop();
    });
  }, [cellData, rowsAndCols, cellSize, ctx]);

  // Start the animation if canvas is initialized
  useEffect(() => {
    if (canvasInitialized) {
      animationLoop();
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
