import { useCallback, useEffect, useRef } from "react";
import { CellData } from "./useCellData";
import { ControlRefs } from "./useControlRefs";
import { CanvasStateInterface } from "./useCanvasState";

export interface CellAnimation {
  cellSize: React.MutableRefObject<{
    width: number;
    height: number;
    offX: number;
    offY: number;
  }>;
  clearCanvas: () => void;
  drawNext: () => void;
  drawInitialCell: (
    cellIndex: number,
    options?: { erase: boolean } | undefined
  ) => void;
  drawCurrentCells: () => void;
  startAnimation: () => void;
}

const useCellAnimation = (
  canvasState: CanvasStateInterface,
  canvas: HTMLCanvasElement | null,
  ctx: CanvasRenderingContext2D | null,
  canvasInitialized: boolean,
  controlRefs: ControlRefs,
  gridSize: React.MutableRefObject<{ width: number; height: number }>,
  cellData: CellData,
  initialData: Set<number>
) => {
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const cellSize = useRef<{
    width: number;
    height: number;
    offX: number;
    offY: number;
  }>({
    width: 0,
    height: 0,
    offX: 0,
    offY: 0,
  });

  const updateCellSize = useCallback(() => {
    if (!canvas) return;
    // Rounded to prevent sub-pixel drawing, and down to prevent draws off canvas
    cellSize.current.width = Math.floor(canvas.width / gridSize.current.width);
    cellSize.current.height = Math.floor(
      canvas.height / gridSize.current.height
    );

    cellSize.current.offX = Math.floor(
      (canvas.width - gridSize.current.width * cellSize.current.width) / 2
    );
    cellSize.current.offY = Math.floor(
      (canvas.height - gridSize.current.height * cellSize.current.height) / 2
    );
  }, [canvas, gridSize]);

  const drawCell = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      gridSize: { width: number; height: number },
      gameState: Uint8Array,
      cellIndex: number
    ) => {
      // Prevent divide by 0 leading to NaN draw calls
      if (gridSize.height === 0 || gridSize.width === 0) {
        return;
      }

      const row = Math.floor(cellIndex / gridSize.width);
      const col = cellIndex % gridSize.width;
      const x = col * cellSize.current.width + cellSize.current.offX;
      const y = row * cellSize.current.height + cellSize.current.offY;

      ctx.fillStyle = gameState[cellIndex] < 128 ? "black" : "white";
      ctx.beginPath();
      ctx.rect(x, y, cellSize.current.width, cellSize.current.height);
      ctx.fill();
    },
    []
  );

  const drawInitialCell = useCallback(
    (cellIndex: number, options?: { erase: boolean } | undefined) => {
      if (
        !ctx ||
        !canvas ||
        gridSize.current.height === 0 ||
        gridSize.current.width === 0
      ) {
        return;
      }

      const row = Math.floor(cellIndex / gridSize.current.width);
      const col = cellIndex % gridSize.current.width;
      const x = col * cellSize.current.width + cellSize.current.offX;
      const y = row * cellSize.current.height + cellSize.current.offY;

      if (options?.erase) {
        ctx.fillStyle = "black";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.beginPath();
      ctx.rect(x, y, cellSize.current.width, cellSize.current.height);
      ctx.fill();
    },
    [canvas, ctx, gridSize]
  );

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
      const now = window.performance.now();
      const elapsed = now - lastFrameTimeRef.current;
      const targetFrameRate = 1000 / 10;

      if (options?.initialDraw && canvas && ctx) {
        console.log("initial draw");
        for (const cellIndex of cellData.livingCells) {
          drawCell(
            ctx,
            gridSize.current,
            cellData.gameState.current,
            cellIndex
          );
        }
      }

      if (elapsed > targetFrameRate && isPlaying.current && !isPaused.current) {
        lastFrameTimeRef.current = now;

        for (const cellIndex of cellData.changedCells) {
          if (canvas && ctx) {
            drawCell(
              ctx,
              gridSize.current,
              cellData.gameState.current,
              cellIndex
            );
          }
        }

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
    [drawCell, gridSize]
  );

  /*   const drawGridLines = (
    overlay: HTMLCanvasElement | null,
    overlayCtx: CanvasRenderingContext2D | null,
    gridSize: React.MutableRefObject<{ width: number; height: number }>
  ) => {
    if (!overlay || !overlayCtx) return;
    console.log("Lines!");

    const cellWidth = Math.floor(overlay.width / gridSize.current.width);
    const cellHeight = Math.floor(overlay.height / gridSize.current.height);

    const offX = Math.floor(
      (overlay.width - gridSize.current.width * cellWidth) / 2
    );
    const offY = Math.floor(
      (overlay.height - gridSize.current.height * cellHeight) / 2
    );

    overlayCtx.strokeStyle = "grey";

    for (let x = 0 + offX; x <= overlay.width - offX; x += cellWidth) {
      overlayCtx.beginPath();
      overlayCtx.moveTo(x, offY);
      overlayCtx.lineTo(x, overlay.height - offY);
      overlayCtx.stroke();
    }

    for (let y = 0 + offY; y <= overlay.height - offY; y += cellHeight) {
      overlayCtx.beginPath();
      overlayCtx.moveTo(offX, y);
      overlayCtx.lineTo(overlay.width - offX, y);
      overlayCtx.stroke();
    }
  }; */

  const drawCurrentCells = useCallback(() => {
    if (!controlRefs.isPlaying.current && ctx) {
      console.log("Drawing current initial cells.", initialData);
      for (const cellIndex of initialData) {
        drawInitialCell(cellIndex);
      }
    } else if (ctx) {
      console.log("Drawing current living cells.", cellData.livingCells);
      for (const cellIndex of cellData.livingCells) {
        drawCell(ctx, gridSize.current, cellData.gameState.current, cellIndex);
      }
    }
  }, [
    cellData.gameState,
    cellData.livingCells,
    controlRefs.isPlaying,
    ctx,
    drawCell,
    drawInitialCell,
    gridSize,
    initialData,
  ]);

  const clearCanvas = useCallback(() => {
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [canvas, ctx]);

  const drawNext = () => {
    for (const cellIndex of cellData.changedCells) {
      if (canvas && ctx) {
        drawCell(ctx, gridSize.current, cellData.gameState.current, cellIndex);
        cellData.computeNext;
      }
    }

    cellData.computeNext();
  };

  const startAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    updateCellSize();

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
    updateCellSize,
  ]);

  // Start the animation if canvas is initialized
  useEffect(() => {
    startAnimation();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startAnimation, canvasState.windowAspect]);

  useEffect(() => {
    console.log("Fuck Safari");
    drawCurrentCells();
  }, [canvasState.windowAspect, controlRefs.showOnlyDraw, drawCurrentCells]);

  const cellAnimation: CellAnimation = {
    cellSize,
    clearCanvas,
    drawNext,
    drawInitialCell,
    drawCurrentCells,
    startAnimation,
  };

  return cellAnimation;
};

export default useCellAnimation;
