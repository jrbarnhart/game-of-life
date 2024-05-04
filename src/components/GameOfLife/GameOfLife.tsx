import Controls from "./Controls/Controls";
import GameCanvas from "./GameCanvas/GameCanvas";
import useCellData from "./GameCanvas/useCellData";
import useCanvasState from "./GameCanvas/useCanvasState";
import useInitCanvas from "./GameCanvas/useInitCanvas";
import useCellAnimation from "./GameCanvas/useCellAnimation";
import useControlRefs from "./GameCanvas/useControlRefs";
import useGridSize from "./GameCanvas/useGridSize";
import { useEffect, useRef, useState } from "react";

const GameOfLife = () => {
  const controlRefs = useControlRefs();

  const canvasState = useCanvasState();

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

  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  const [outdatedBrowserFS, setOutdatedBrowserFS] = useState<boolean>(false);

  // Disable fullscreen for testing purposes
  useEffect(() => {
    Object.defineProperty(Document.prototype, "fullscreenEnabled", {
      get: function () {
        return false;
      },
    });

    Element.prototype.requestFullscreen = function () {
      const err = new Error(
        "Sorry, your browser does not support the fullscreen API."
      );
      return Promise.reject(err);
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      className={`${
        canvasState.windowAspect === "landscape"
          ? "relative self-center w-min"
          : "pt-5"
      } 
      ${outdatedBrowserFS ? "bg-red-500" : ""}
      grid justify-items-center w-full overflow-hidden relative`}
    >
      <div
        className={
          canvasState.windowAspect === "landscape" ? "" : "absolute top-16"
        }
      >
        <GameCanvas
          canvasRef={canvasRef}
          overlayRef={overlayRef}
          containerRef={containerRef}
          initialData={initialData}
          controlRefs={controlRefs}
          gridSize={gridSize}
          cellAnimation={cellAnimation}
        />
      </div>
      <div
        className={`${
          canvasState.windowAspect === "landscape" ? "" : "self-end mb-10"
        } z-50`}
      >
        <Controls
          controlRefs={controlRefs}
          cellData={cellData}
          cellAnimation={cellAnimation}
          initialData={initialData}
          canvasState={canvasState}
          gridSize={gridSize}
          gameContainerRef={gameContainerRef}
          setOutdatedBrowserFS={setOutdatedBrowserFS}
        />
        {canvasState.windowAspect === "portrait" && (
          <p className="self-end p-5 text-center text-lg">
            Tip: Rotate device or expand window for better view.
          </p>
        )}
      </div>
    </div>
  );
};

export default GameOfLife;
