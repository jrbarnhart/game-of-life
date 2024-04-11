import Controls from "./Controls/Controls";
import GameCanvas from "./GameCanvas/GameCanvas";
import useCellData from "./GameCanvas/useCellData";
import useCanvasSize from "./GameCanvas/useCanvasSize";
import useInitCanvas from "./GameCanvas/useInitCanvas";
import useCellAnimation from "./GameCanvas/useCellAnimation";
import useControlRefs from "./GameCanvas/useControlRefs";
import { useState } from "react";

const GameOfLife = () => {
  const controlRefs = useControlRefs();
  const canvasSize = useCanvasSize(12);

  const initGridWidth = Math.sqrt(
    (controlRefs.totalCells.current * controlRefs.aspect.current.width) /
      controlRefs.aspect.current.height
  );
  const initGridHeight =
    (initGridWidth * controlRefs.aspect.current.height) /
    controlRefs.aspect.current.width;
  const [gridSize, setGridSize] = useState<{ width: number; height: number }>({
    width: initGridWidth,
    height: initGridHeight,
  });

  const cellData = useCellData({
    width: gridSize.width,
    height: gridSize.height,
  });

  const initialData = new Set<number>();

  const {
    canvasInitialized,
    canvasRef,
    contextRef,
    overlayRef,
    overlayContextRef,
    containerRef,
  } = useInitCanvas(canvasSize.width, canvasSize.height);

  const { clearCanvas, drawNext, drawInitialCell } = useCellAnimation(
    canvasSize,
    canvasRef.current,
    contextRef.current,
    overlayRef.current,
    overlayContextRef.current,
    canvasInitialized,
    cellData,
    controlRefs
  );

  return (
    <div className="grid justify-items-center gap-y-5">
      <GameCanvas
        canvasRef={canvasRef}
        overlayRef={overlayRef}
        containerRef={containerRef}
        initialData={initialData}
        controlRefs={controlRefs}
        cellData={cellData}
        drawInitialCell={drawInitialCell}
      />
      <Controls
        controlRefs={controlRefs}
        cellData={cellData}
        clearCanvas={clearCanvas}
        drawNext={drawNext}
        initialData={initialData}
        setGridSize={setGridSize}
      />
    </div>
  );
};

export default GameOfLife;
