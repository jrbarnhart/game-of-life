import Controls from "./Controls/Controls";
import GameCanvas from "./GameCanvas/GameCanvas";
import useCellData from "./GameCanvas/useCellData";
import useCanvasState from "./GameCanvas/useCanvasState";
import useInitCanvas from "./GameCanvas/useInitCanvas";
import useCellAnimation from "./GameCanvas/useCellAnimation";
import useControlRefs from "./GameCanvas/useControlRefs";

const GameOfLife = () => {
  const controlRefs = useControlRefs();

  const canvasState = useCanvasState(12, 300, controlRefs);

  const cellData = useCellData({
    width: canvasState.gridSize.current.width,
    height: canvasState.gridSize.current.height,
  });

  const initialData = new Set<number>();

  const {
    canvasInitialized,
    canvasRef,
    contextRef,
    overlayRef,
    overlayContextRef,
    containerRef,
  } = useInitCanvas(
    canvasState.canvasSize.width,
    canvasState.canvasSize.height
  );

  const { clearCanvas, drawNext, drawInitialCell } = useCellAnimation(
    canvasState,
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
        canvasState={canvasState}
      />
    </div>
  );
};

export default GameOfLife;
