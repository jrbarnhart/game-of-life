import Controls from "./Controls/Controls";
import GameCanvas from "./GameCanvas/GameCanvas";
import useCellData from "./GameCanvas/useCellData";
import useCanvasState from "./GameCanvas/useCanvasState";
import useInitCanvas from "./GameCanvas/useInitCanvas";
import useCellAnimation from "./GameCanvas/useCellAnimation";
import useControlRefs from "./GameCanvas/useControlRefs";
import useGridSize from "./GameCanvas/useGridSize";
import { useEffect, useRef, useState } from "react";
import useDisableFS from "./GameCanvas/useDisableFS";

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

  useEffect(() => {
    const handleOrientationChange = () => {
      if (
        screen.orientation.type === "portrait-primary" ||
        screen.orientation.type === "portrait-secondary"
      ) {
        setOutdatedBrowserFS(false);
      }
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  // Used to disable fullscreen for testing purposes
  useDisableFS({ use: false });

  return (
    <div
      ref={gameContainerRef}
      className={`${
        canvasState.windowAspect === "landscape"
          ? "relative self-center w-min"
          : "pt-5"
      } 
      ${outdatedBrowserFS ? "w-svw h-svh" : ""}
      grid justify-items-center w-full overflow-hidden relative`}
    >
      <div
        className={`${
          canvasState.windowAspect === "landscape" ? "" : "absolute"
        } ${outdatedBrowserFS ? "h-svh grid items-center" : "top-16"}`}
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
          outdatedBrowserFS={outdatedBrowserFS}
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
