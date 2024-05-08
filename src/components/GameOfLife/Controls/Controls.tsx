import { useEffect, SetStateAction } from "react";
import { CellData } from "../GameCanvas/useCellData";
import { ControlState } from "../GameCanvas/useControlState";
import { CanvasStateInterface } from "../GameCanvas/useCanvasState";
import { CellAnimation } from "../GameCanvas/useCellAnimation";
import DefaultControls from "./DefaultControls";
import FullscreenControls from "./FullscreenControls";
import { GRID_SIZES } from "../GameCanvas/useGridSize";

const Controls = ({
  controlState,
  cellData,
  cellAnimation,
  initialData,
  canvasState,
  gridSize,
  gameContainerRef,
  outdatedBrowserFS,
  setOutdatedBrowserFS,
}: {
  controlState: ControlState;
  cellData: CellData;
  cellAnimation: CellAnimation;
  initialData: Set<number>;
  canvasState: CanvasStateInterface;
  gridSize: React.MutableRefObject<{ width: number; height: number }>;
  gameContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  outdatedBrowserFS: boolean;
  setOutdatedBrowserFS: React.Dispatch<SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    const onFullscreenChange = () => {
      controlState.setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [controlState]);

  const handlePlayClick = () => {
    controlState.setShowPlay(false);
    if (!controlState.isPlayingRef.current) {
      controlState.isPlayingRef.current = true;
      if (initialData.size > 0) {
        cellData.initData(initialData);
      } else {
        cellData.initData();
      }
      initialData.clear();
    }
    if (controlState.isPausedRef.current) {
      controlState.isPausedRef.current = false;
    }
    controlState.isDrawingRef.current = false;
    controlState.setShowOnlyDraw(false);
    controlState.isErasingRef.current = false;
    controlState.mirrorXRef.current = false;
    controlState.mirrorYRef.current = false;
    controlState.setHighlightDraw(false);
    controlState.setHighlightErase(-1);
    controlState.setHighlightMirrorX(-1);
    controlState.setHighlightMirrorY(-1);
    controlState.setHighlightPlay(true);
    controlState.setHighlightPause(false);
  };

  const handlePauseClick = () => {
    if (
      !controlState.isPausedRef.current &&
      controlState.isPlayingRef.current
    ) {
      controlState.isPausedRef.current = true;
      controlState.setShowPlay(true);
      controlState.setHighlightPause(true);
      controlState.setHighlightPlay(false);
    } else if (
      controlState.isPausedRef.current &&
      controlState.isPlayingRef.current
    ) {
      controlState.isPausedRef.current = false;
      controlState.setShowPlay(false);
      controlState.setHighlightPause(false);
      controlState.setHighlightPlay(true);
    }
  };

  const handleStopClick = () => {
    controlState.isPlayingRef.current = false;
    controlState.isPausedRef.current = false;
    controlState.isDrawingRef.current = false;
    controlState.isErasingRef.current = false;
    controlState.mirrorXRef.current = false;
    controlState.mirrorYRef.current = false;
    controlState.setShowPlay(true);
    controlState.setShowOnlyDraw(false);
    controlState.setHighlightPlay(false);
    controlState.setHighlightPause(false);
    controlState.setHighlightDraw(false);
    controlState.setHighlightErase(-1);
    controlState.setHighlightMirrorX(-1);
    controlState.setHighlightMirrorY(-1);
    cellData.clear();
    cellAnimation.startAnimation();
    initialData.clear();
  };

  const handleNextClick = () => {
    if (controlState.isPlayingRef.current) {
      controlState.isPausedRef.current = true;
      controlState.setShowPlay(true);
      controlState.setHighlightPlay(false);
      controlState.setHighlightPause(true);
      cellAnimation.drawNext();
    }
  };

  const handleDrawClick = () => {
    if (controlState.isPlayingRef.current) {
      controlState.isPlayingRef.current = false;
      controlState.isPausedRef.current = false;
      controlState.setShowPlay(true);
      controlState.setHighlightPlay(false);
      controlState.setHighlightPause(false);
      cellData.clear();
      cellAnimation.clearCanvas();
    }
    controlState.isDrawingRef.current = !controlState.isDrawingRef.current;
    controlState.setShowOnlyDraw(controlState.isDrawingRef.current);
    controlState.setHighlightDraw(controlState.isDrawingRef.current);
    if (!controlState.isDrawingRef.current) {
      controlState.isErasingRef.current = false;
      controlState.mirrorXRef.current = false;
      controlState.mirrorYRef.current = false;
      controlState.setHighlightErase(-1);
      controlState.setHighlightMirrorX(-1);
      controlState.setHighlightMirrorY(-1);
    } else {
      controlState.setHighlightErase(0);
      controlState.setHighlightMirrorX(0);
      controlState.setHighlightMirrorY(0);
    }
  };

  const handleEraseClick = () => {
    if (!controlState.isDrawingRef.current) {
      return;
    }

    controlState.isErasingRef.current = !controlState.isErasingRef.current;
    controlState.setHighlightErase(controlState.isErasingRef.current ? 1 : 0);
  };

  const handleMirrorClick = (allignment: "x" | "y") => {
    if (!controlState.isDrawingRef.current) {
      return;
    }

    if (allignment === "x") {
      controlState.mirrorXRef.current = !controlState.mirrorXRef.current;
      controlState.setHighlightMirrorX(controlState.mirrorXRef.current ? 1 : 0);
    }
    if (allignment === "y") {
      controlState.mirrorYRef.current = !controlState.mirrorYRef.current;
      controlState.setHighlightMirrorY(controlState.mirrorYRef.current ? 1 : 0);
    }
  };

  const handleFullscreenClick = () => {
    // Handle Safari being an out of date piece of garbage
    if (
      !document.fullscreenEnabled &&
      canvasState.windowAspect === "landscape"
    ) {
      console.error(
        "Your browser does not support the fullscreen API. Experience will be sub-optimal."
      );
      setOutdatedBrowserFS((prev) => !prev);
      return;
    } else if (!document.fullscreenEnabled) {
      return;
    }

    // Fullscreen API that literally every other browser implements
    if (!controlState.fullscreen && gameContainerRef.current) {
      // Just in case of weirdness remove safari only classes
      setOutdatedBrowserFS(false);
      gameContainerRef.current.requestFullscreen().catch((err: unknown) => {
        console.error(err);
      });
    } else {
      document.exitFullscreen().catch((err: unknown) => {
        console.error(err);
      });
    }
  };

  const handleTotalCellsSelect: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    // "click" stop to handle ref and highlight state updates
    handleStopClick();

    const value = parseInt(event.target.value);
    const selectedSize = GRID_SIZES[value];
    const width = selectedSize.x;
    const height = selectedSize.y;
    const newTotalCells = width * height;
    controlState.totalCellsRef.current = newTotalCells;
    gridSize.current = { width, height };
    cellData.initStateArrays(width, height);
    cellAnimation.startAnimation();
  };

  return (
    <>
      {canvasState.windowAspect === "portrait" && (
        <DefaultControls
          controlState={controlState}
          handlePlayClick={handlePlayClick}
          handlePauseClick={handlePauseClick}
          handleNextClick={handleNextClick}
          handleStopClick={handleStopClick}
          handleDrawClick={handleDrawClick}
          handleEraseClick={handleEraseClick}
          handleMirrorClick={handleMirrorClick}
          handleFullscreenClick={handleFullscreenClick}
          handleTotalCellsSelect={handleTotalCellsSelect}
        />
      )}
      {canvasState.windowAspect === "landscape" && (
        <FullscreenControls
          controlState={controlState}
          handlePlayClick={handlePlayClick}
          handlePauseClick={handlePauseClick}
          handleNextClick={handleNextClick}
          handleStopClick={handleStopClick}
          handleDrawClick={handleDrawClick}
          handleEraseClick={handleEraseClick}
          handleMirrorClick={handleMirrorClick}
          handleFullscreenClick={handleFullscreenClick}
          handleTotalCellsSelect={handleTotalCellsSelect}
          outdatedBrowserFS={outdatedBrowserFS}
        />
      )}
    </>
  );
};

export default Controls;
