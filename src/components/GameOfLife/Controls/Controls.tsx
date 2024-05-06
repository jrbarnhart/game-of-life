import { useEffect, SetStateAction } from "react";
import { CellData } from "../GameCanvas/useCellData";
import { ControlState } from "../GameCanvas/useControlState";
import { CanvasStateInterface } from "../GameCanvas/useCanvasState";
import { CellAnimation } from "../GameCanvas/useCellAnimation";
import DefaultControls from "./DefaultControls";
import FullscreenControls from "./FullscreenControls";

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
    if (!controlState.isPlaying.current) {
      controlState.isPlaying.current = true;
      if (initialData.size > 0) {
        cellData.initData(initialData);
      } else {
        cellData.initData();
      }
      initialData.clear();
    }
    if (controlState.isPaused.current) {
      controlState.isPaused.current = false;
    }
    controlState.isDrawing.current = false;
    controlState.setShowOnlyDraw(false);
    controlState.isErasing.current = false;
    controlState.mirrorX.current = false;
    controlState.mirrorY.current = false;
    controlState.setHighlightDraw(false);
    controlState.setHighlightErase(-1);
    controlState.setHighlightMirrorX(-1);
    controlState.setHighlightMirrorY(-1);
    controlState.setHighlightPlay(true);
    controlState.setHighlightPause(false);
  };

  const handlePauseClick = () => {
    if (!controlState.isPaused.current && controlState.isPlaying.current) {
      controlState.isPaused.current = true;
      controlState.setShowPlay(true);
      controlState.setHighlightPause(true);
      controlState.setHighlightPlay(false);
    } else if (
      controlState.isPaused.current &&
      controlState.isPlaying.current
    ) {
      controlState.isPaused.current = false;
      controlState.setShowPlay(false);
      controlState.setHighlightPause(false);
      controlState.setHighlightPlay(true);
    }
  };

  const handleStopClick = () => {
    controlState.isPlaying.current = false;
    controlState.isPaused.current = false;
    controlState.isDrawing.current = false;
    controlState.isErasing.current = false;
    controlState.mirrorX.current = false;
    controlState.mirrorY.current = false;
    controlState.setShowPlay(true);
    controlState.setHighlightPlay(false);
    controlState.setHighlightPause(false);
    controlState.setHighlightDraw(false);
    controlState.setHighlightErase(-1);
    controlState.setHighlightMirrorX(-1);
    controlState.setHighlightMirrorY(-1);
    cellData.clear();
    cellAnimation.clearCanvas();
    initialData.clear();
  };

  const handleNextClick = () => {
    if (controlState.isPlaying.current) {
      controlState.isPaused.current = true;
      controlState.setShowPlay(true);
      controlState.setHighlightPlay(false);
      controlState.setHighlightPause(true);
      cellAnimation.drawNext();
    }
  };

  const handleDrawClick = () => {
    if (controlState.isPlaying.current) {
      controlState.isPlaying.current = false;
      controlState.isPaused.current = false;
      controlState.setShowPlay(true);
      controlState.setHighlightPlay(false);
      controlState.setHighlightPause(false);
      cellData.clear();
      cellAnimation.clearCanvas();
    }
    controlState.isDrawing.current = !controlState.isDrawing.current;
    controlState.setShowOnlyDraw(controlState.isDrawing.current);
    controlState.setHighlightDraw(controlState.isDrawing.current);
    if (!controlState.isDrawing.current) {
      controlState.isErasing.current = false;
      controlState.mirrorX.current = false;
      controlState.mirrorY.current = false;
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
    if (!controlState.isDrawing.current) {
      return;
    }

    controlState.isErasing.current = !controlState.isErasing.current;
    controlState.setHighlightErase(controlState.isErasing.current ? 1 : 0);
  };

  const handleMirrorClick = (allignment: "x" | "y") => {
    if (!controlState.isDrawing.current) {
      return;
    }

    if (allignment === "x") {
      controlState.mirrorX.current = !controlState.mirrorX.current;
      controlState.setHighlightMirrorX(controlState.mirrorX.current ? 1 : 0);
    }
    if (allignment === "y") {
      controlState.mirrorY.current = !controlState.mirrorY.current;
      controlState.setHighlightMirrorY(controlState.mirrorY.current ? 1 : 0);
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

    const newTotal = parseInt(event.target.value);
    controlState.totalCells.current = newTotal;

    const width = Math.sqrt(
      (controlState.totalCells.current * controlState.aspect.current.width) /
        controlState.aspect.current.height
    );
    const height =
      (width * controlState.aspect.current.height) /
      controlState.aspect.current.width;

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
