import Controls from "./Controls/Controls";
import GameCanvas from "./GameCanvas/GameCanvas";
import useCellData from "./GameCanvas/useCellData";
import useCanvasState from "./GameCanvas/useCanvasState";
import useInitCanvas from "./GameCanvas/useInitCanvas";
import useCellAnimation from "./GameCanvas/useCellAnimation";
import useControlRefs from "./GameCanvas/useControlRefs";
import useGridSize from "./GameCanvas/useGridSize";

const GameOfLife = () => {
  const controlRefs = useControlRefs();

  const canvasState = useCanvasState(300, controlRefs);

  const gridSize = useGridSize();

  const cellData = useCellData(gridSize);

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

  const cellAnimation = useCellAnimation(
    canvasRef.current,
    contextRef.current,
    overlayRef.current,
    overlayContextRef.current,
    canvasInitialized,
    controlRefs,
    gridSize,
    cellData
  );

  return (
    <div className="grid justify-items-center gap-y-5">
      <GameCanvas
        canvasRef={canvasRef}
        overlayRef={overlayRef}
        containerRef={containerRef}
        initialData={initialData}
        controlRefs={controlRefs}
        gridSize={gridSize}
        cellAnimation={cellAnimation}
      />
      <Controls
        controlRefs={controlRefs}
        cellData={cellData}
        cellAnimation={cellAnimation}
        initialData={initialData}
        canvasState={canvasState}
        gridSize={gridSize}
      />
    </div>
  );
};

export default GameOfLife;
