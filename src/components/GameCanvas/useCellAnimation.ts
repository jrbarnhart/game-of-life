import { useCallback, useRef } from "react";
import { CellData } from "./useCellData";

const useCellAnimation = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  cellData: CellData
) => {
  const animationFrameRef = useRef<number | null>(null);

  const animationLoop = useCallback(() => {
    // All grids are square so this is sqrt of total length
    const rowsAndCols = Math.sqrt(cellData.current.length);
    const cellSize = canvas.width / rowsAndCols;

    // Compute the next cell data state
    cellData.computeNext();

    for (let i = 0; i < cellData.current.length; i++) {
      if (cellData.current[i] === cellData.next[i]) {
        continue;
      } else {
        const row = Math.floor(i / rowsAndCols);
        const col = i % rowsAndCols;
        const x = col * cellSize;
        const y = row * cellSize;

        ctx.strokeStyle = cellData.next[i] === 0 ? "transparent" : "white";
        ctx.beginPath();
        ctx.rect(x, y, cellSize, cellSize);
        ctx.fill();
      }
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      animationLoop();
    });
  }, [cellData, ctx, canvas]);
};

export default useCellAnimation;
