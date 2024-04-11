import Controls from "./Controls/Controls";
import GameCanvas from "./GameCanvas/GameCanvas";
import useCellData from "./GameCanvas/useCellData";
import useCanvasSize from "./GameCanvas/useCanvasSize";
import useInitCanvas from "./GameCanvas/useInitCanvas";
import useCellAnimation from "./GameCanvas/useCellAnimation";
import useControlRefs from "./GameCanvas/useControlRefs";

const GameOfLife = () => {
  const controlRefs = useControlRefs();

  const cellData = useCellData({
    width: controlRefs.resolution.current.x,
    height: controlRefs.resolution.current.y,
  });

  const initialData = new Set<number>();

  const canvasSize = useCanvasSize(12);

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
      />
    </div>
  );
};

export default GameOfLife;
