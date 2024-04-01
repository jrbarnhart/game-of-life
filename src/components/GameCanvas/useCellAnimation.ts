import { useCallback, useEffect, useRef } from "react";
import { CellData, GridSize } from "./useCellData";

const useCellAnimation = (
  canvas: HTMLCanvasElement | null,
  ctx: CanvasRenderingContext2D | null,
  overlay: HTMLCanvasElement | null,
  overlayCtx: CanvasRenderingContext2D | null,
  canvasInitialized: boolean,
  cellData: CellData
) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  const animationLoop = useCallback(
    (options?: { initialDraw: boolean }) => {
      // Limit FPS
      const now = window.performance.now(); // Current timestamp
      const elapsed = now - lastFrameTimeRef.current; // Time elapsed since last frame
      const targetFrameRate = 1000 / 10;

      if (elapsed > targetFrameRate) {
        lastFrameTimeRef.current = now;

        const cellSize = canvas ? canvas.width / cellData.gridSize.width : 0;

        // Helper fn for drawing cells
        const drawCell = (ctx: CanvasRenderingContext2D, cellIndex: number) => {
          const row = Math.floor(cellIndex / cellData.gridSize.height);
          const col = cellIndex % cellData.gridSize.width;
          const x = col * cellSize;
          const y = row * cellSize;

          ctx.fillStyle =
            cellData.gameState[cellIndex] < 128 ? "black" : "white";
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
      } else {
        animationFrameRef.current = requestAnimationFrame(() => {
          animationLoop();
        });
      }
    },
    [ctx, canvas, cellData]
  );

  const drawGridLines = (
    overlay: HTMLCanvasElement | null,
    overlayCtx: CanvasRenderingContext2D | null,
    gridSize: GridSize
  ) => {
    if (!overlay || !overlayCtx) return;
    console.log("Lines!");

    const cellWidth = overlay.width / gridSize.width;
    const cellHeight = overlay.height / gridSize.height;

    overlayCtx.strokeStyle = "grey";

    for (let x = 0; x <= overlay.width; x += cellWidth) {
      overlayCtx.beginPath();
      overlayCtx.moveTo(x, 0);
      overlayCtx.lineTo(x, overlay.height);
      overlayCtx.stroke();
    }

    for (let y = 0; y <= overlay.height; y += cellHeight) {
      overlayCtx.beginPath();
      overlayCtx.moveTo(0, y);
      overlayCtx.lineTo(overlay.width, y);
      overlayCtx.stroke();
    }
  };

  // Start the animation if canvas is initialized
  useEffect(() => {
    if (canvasInitialized) {
      animationLoop({ initialDraw: true });
      drawGridLines(overlay, overlayCtx, cellData.gridSize);
      console.log("Animation started");
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    animationLoop,
    canvasInitialized,
    cellData.gridSize,
    overlay,
    overlayCtx,
  ]);
};

export default useCellAnimation;
