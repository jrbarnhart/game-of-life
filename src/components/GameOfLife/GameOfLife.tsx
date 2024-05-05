import Controls from "./Controls/Controls";
import GameCanvas from "./GameCanvas/GameCanvas";
import useCanvasState from "./GameCanvas/useCanvasState";
import useInitCanvas from "./GameCanvas/useInitCanvas";
import useCellAnimation from "./GameCanvas/useCellAnimation";
import useControlRefs from "./GameCanvas/useControlRefs";
import { useRef } from "react";
import usePseudoFS from "./GameCanvas/usePseudoFS";
import { GridSize } from "./GameCanvas/useGridSize";
import { CellData } from "./GameCanvas/useCellData";

const GameOfLife = ({
  gridSize,
  cellData,
  initialData,
}: {
  gridSize: React.MutableRefObject<GridSize>;
  cellData: CellData;
  initialData: Set<number>;
}) => {
  const controlRefs = useControlRefs();

  const canvasState = useCanvasState();

  const { canvasInitialized, canvasRef, contextRef, containerRef } =
    useInitCanvas(canvasState.canvasSize.width, canvasState.canvasSize.height);

  const cellAnimation = useCellAnimation(
    canvasState,
    canvasRef.current,
    contextRef.current,
    canvasInitialized,
    controlRefs,
    gridSize,
    cellData,
    initialData
  );

  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  const [outdatedBrowserFS, setOutdatedBrowserFS] = usePseudoFS({
    debugNoFs: false,
  });

  return (
    <div
      ref={gameContainerRef}
      className={`${
        canvasState.windowAspect === "landscape" ? "self-center w-min" : "pt-5"
      } 
      ${outdatedBrowserFS ? "w-svw h-svh" : ""}
      grid justify-items-center w-full overflow-hidden relative`}
    >
      <div
        className={
          canvasState.windowAspect === "portrait"
            ? "absolute top-16 bottom-0"
            : ""
        }
      >
        <GameCanvas
          canvasRef={canvasRef}
          containerRef={containerRef}
          initialData={initialData}
          controlRefs={controlRefs}
          gridSize={gridSize}
          cellAnimation={cellAnimation}
        />
      </div>
      {canvasState.windowAspect === "portrait" && (
        <div className="self-end grid content-end auto-rows-min mb-10 z-50 h-fit">
          <Controls
            controlRefs={controlRefs}
            cellData={cellData}
            cellAnimation={cellAnimation}
            initialData={initialData}
            canvasState={canvasState}
            gridSize={gridSize}
            gameContainerRef={gameContainerRef}
            outdatedBrowserFS={outdatedBrowserFS}
            setOutdatedBrowserFS={setOutdatedBrowserFS}
          />

          <p className="self-end p-5 text-center text-lg">
            Tip: Rotate device or expand window for better view.
          </p>
        </div>
      )}
      {canvasState.windowAspect === "landscape" && (
        <div
          className={`${
            controlRefs.showOnlyDraw ? "pointer-events-none" : ""
          } z-50 absolute top-0 left-0 h-full w-full`}
        >
          <Controls
            controlRefs={controlRefs}
            cellData={cellData}
            cellAnimation={cellAnimation}
            initialData={initialData}
            canvasState={canvasState}
            gridSize={gridSize}
            gameContainerRef={gameContainerRef}
            outdatedBrowserFS={outdatedBrowserFS}
            setOutdatedBrowserFS={setOutdatedBrowserFS}
          />
        </div>
      )}
    </div>
  );
};

export default GameOfLife;
