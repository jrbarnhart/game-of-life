import { useCallback, useEffect, useRef } from "react";
import { CellData, GridSize } from "./useCellData";

const useCellAnimation = (
  canvasSize: { width: number; height: number },
  canvas: HTMLCanvasElement | null,
  ctx: CanvasRenderingContext2D | null,
  overlay: HTMLCanvasElement | null,
  overlayCtx: CanvasRenderingContext2D | null,
  canvasInitialized: boolean,
  cellData: CellData,
  isPlaying: React.MutableRefObject<boolean>,
  isPaused: React.MutableRefObject<boolean>
) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  const animationLoop = useCallback(
    (
      ctx: CanvasRenderingContext2D | null,
      canvas: HTMLCanvasElement | null,
      cellData: CellData,
      isPlaying: React.MutableRefObject<boolean>,
      isPaused: React.MutableRefObject<boolean>,
      options?: { initialDraw: boolean }
    ) => {
      // Limit FPS
      const now = window.performance.now(); // Current timestamp
      const elapsed = now - lastFrameTimeRef.current; // Time elapsed since last frame
      const targetFrameRate = 1000 / 10;

      const cellWidth = canvas ? canvas.width / cellData.gridSize.width : 0;
      const cellHeight = canvas ? canvas.height / cellData.gridSize.height : 0;

      // Helper fn for drawing cells
      const drawCell = (ctx: CanvasRenderingContext2D, cellIndex: number) => {
        const row = Math.floor(cellIndex / cellData.gridSize.width);
        const col = cellIndex % cellData.gridSize.width;
        const x = col * cellWidth;
        const y = row * cellHeight;

        ctx.fillStyle = cellData.gameState[cellIndex] < 128 ? "black" : "white";
        ctx.beginPath();
        ctx.rect(x, y, cellWidth, cellHeight);
        ctx.fill();
      };

      // If restarting animation
      if (options?.initialDraw && ctx) {
        console.log("initial draw");
        for (const cellIndex of cellData.livingCells) {
          drawCell(ctx, cellIndex);
        }
      }

      if (elapsed > targetFrameRate && isPlaying.current && !isPaused.current) {
        lastFrameTimeRef.current = now;

        // Draw cells in changedCells set
        for (const cellIndex of cellData.changedCells) {
          if (ctx) {
            drawCell(ctx, cellIndex);
          }
        }

        // Compute the next cell data state
        cellData.computeNext();

        animationFrameRef.current = requestAnimationFrame(() => {
          animationLoop(ctx, canvas, cellData, isPlaying, isPaused);
        });
      } else {
        animationFrameRef.current = requestAnimationFrame(() => {
          animationLoop(ctx, canvas, cellData, isPlaying, isPaused);
        });
      }
    },
    []
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
    if (canvasInitialized && ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGridLines(overlay, overlayCtx, cellData.gridSize);
      animationLoop(ctx, canvas, cellData, isPlaying, isPaused, {
        initialDraw: true,
      });
      console.log("Animation started");
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    animationLoop,
    canvas,
    canvasInitialized,
    cellData,
    ctx,
    overlay,
    overlayCtx,
    canvasSize,
    isPlaying,
    isPaused,
  ]);
};

export default useCellAnimation;
