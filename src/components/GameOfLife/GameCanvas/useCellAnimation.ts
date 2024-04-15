import { useCallback, useEffect, useRef } from "react";
import { CellData } from "./useCellData";
import { ControlRefs } from "./useControlRefs";
import { CanvasStateInterface } from "./useCanvasState";

export interface CellAnimation {
  clearCanvas: () => void;
  drawNext: () => void;
  drawInitialCell: (
    cellIndex: number,
    cellWidth: number,
    cellHeight: number,
    options?: { erase: boolean } | undefined
  ) => void;
  startAnimation: () => void;
}

const useCellAnimation = (
  canvas: HTMLCanvasElement | null,
  ctx: CanvasRenderingContext2D | null,
  overlay: HTMLCanvasElement | null,
  overlayCtx: CanvasRenderingContext2D | null,
  canvasInitialized: boolean,
  controlRefs: ControlRefs,
  canvasState: CanvasStateInterface,
  cellData: CellData
) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Helper fn for drawing cells
  const drawCell = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      cellIndex: number,
      gameState: Uint8Array,
      gridWidth: number,
      canvas: HTMLCanvasElement,
      gridSize: { width: number; height: number }
    ) => {
      // Prevent divide by 0 leading to NaN draw calls
      if (gridSize.height === 0 || gridSize.width === 0) {
        return;
      }

      const cellWidth = canvas.width / gridSize.width;
      const cellHeight = canvas.height / gridSize.height;

      const row = Math.floor(cellIndex / gridWidth);
      const col = cellIndex % gridWidth;
      const x = col * cellWidth;
      const y = row * cellHeight;

      ctx.fillStyle = gameState[cellIndex] < 128 ? "black" : "white";
      ctx.beginPath();
      ctx.rect(x, y, cellWidth, cellHeight);
      ctx.fill();
    },
    []
  );

  const drawInitialCell = (
    cellIndex: number,
    cellWidth: number,
    cellHeight: number,
    options?: { erase: boolean } | undefined
  ) => {
    if (!ctx) return;

    const row = Math.floor(cellIndex / canvasState.gridSize.current.width);
    const col = cellIndex % canvasState.gridSize.current.width;
    const x = col * cellWidth;
    const y = row * cellHeight;

    if (options?.erase) {
      ctx.fillStyle = "black";
    } else {
      ctx.fillStyle = "white";
    }
    ctx.beginPath();
    ctx.rect(x, y, cellWidth, cellHeight);
    ctx.fill();
  };

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

      // If initial draw
      if (options?.initialDraw && canvas && ctx) {
        console.log("initial draw");
        for (const cellIndex of cellData.livingCells) {
          drawCell(
            ctx,
            cellIndex,
            cellData.gameState.current,
            canvasState.gridSize.current.width,
            canvas,
            canvasState.gridSize.current
          );
        }
      }

      if (elapsed > targetFrameRate && isPlaying.current && !isPaused.current) {
        lastFrameTimeRef.current = now;

        // Draw cells in changedCells set
        for (const cellIndex of cellData.changedCells) {
          if (canvas && ctx) {
            drawCell(
              ctx,
              cellIndex,
              cellData.gameState.current,
              canvasState.gridSize.current.width,
              canvas,
              canvasState.gridSize.current
            );
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
    [canvasState.gridSize, drawCell]
  );

  const drawGridLines = (
    overlay: HTMLCanvasElement | null,
    overlayCtx: CanvasRenderingContext2D | null,
    gridSize: React.MutableRefObject<{ width: number; height: number }>
  ) => {
    if (!overlay || !overlayCtx) return;
    console.log("Lines!");

    const cellWidth = overlay.width / gridSize.current.width;
    const cellHeight = overlay.height / gridSize.current.height;

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

  const clearCanvas = useCallback(() => {
    if (canvas && ctx && overlay && overlayCtx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
      drawGridLines(overlay, overlayCtx, canvasState.gridSize);
    }
  }, [canvas, canvasState.gridSize, ctx, overlay, overlayCtx]);

  const drawNext = () => {
    // Draw cells in changedCells set
    for (const cellIndex of cellData.changedCells) {
      if (canvas && ctx) {
        drawCell(
          ctx,
          cellIndex,
          cellData.gameState.current,
          canvasState.gridSize.current.width,
          canvas,
          canvasState.gridSize.current
        );
        cellData.computeNext;
      }
    }

    // Compute the next cell data state
    cellData.computeNext();
  };

  const startAnimation = useCallback(() => {
    // Stop old animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (canvasInitialized && ctx && canvas) {
      clearCanvas();
      animationLoop(
        ctx,
        canvas,
        cellData,
        controlRefs.isPlaying,
        controlRefs.isPaused,
        {
          initialDraw: true,
        }
      );
      console.log("Animation started");
    }
  }, [
    animationLoop,
    canvas,
    canvasInitialized,
    cellData,
    clearCanvas,
    controlRefs.isPaused,
    controlRefs.isPlaying,
    ctx,
  ]);

  // Start the animation if canvas is initialized
  useEffect(() => {
    startAnimation();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    animationLoop,
    canvas,
    canvasInitialized,
    canvasState.gridSize,
    cellData,
    clearCanvas,
    controlRefs.isPaused,
    controlRefs.isPlaying,
    ctx,
    overlay,
    overlayCtx,
    startAnimation,
  ]);

  const cellAnimation = {
    clearCanvas,
    drawNext,
    drawInitialCell,
    startAnimation,
  };

  return cellAnimation;
};

export default useCellAnimation;
