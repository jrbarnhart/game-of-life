import { useState, useEffect, SetStateAction } from "react";
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
  const [highlightPlay, setHighlightPlay] = useState<boolean>(false);
  const [highlightPause, setHighlightPause] = useState<boolean>(false);
  const [highlightDraw, setHighlightDraw] = useState<boolean>(false);
  // Number state: -1 dim, 0 normal, 1 highlight
  const [highlightErase, setHighlightErase] = useState<number>(-1);
  const [highlightMirrorX, setHighlightMirrorX] = useState<number>(-1);
  const [highlightMirrorY, setHighlightMirrorY] = useState<number>(-1);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const handlePlayClick = () => {
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
    setHighlightDraw(false);
    setHighlightErase(-1);
    setHighlightMirrorX(-1);
    setHighlightMirrorY(-1);
    setHighlightPlay(true);
    setHighlightPause(false);
  };

  const handlePauseClick = () => {
    if (!controlState.isPaused.current && controlState.isPlaying.current) {
      controlState.isPaused.current = true;
      setHighlightPause(true);
      setHighlightPlay(false);
    } else if (
      controlState.isPaused.current &&
      controlState.isPlaying.current
    ) {
      controlState.isPaused.current = false;
      setHighlightPause(false);
      setHighlightPlay(true);
    }
  };

  const handleStopClick = () => {
    controlState.isPlaying.current = false;
    controlState.isPaused.current = false;
    controlState.isDrawing.current = false;
    controlState.isErasing.current = false;
    controlState.mirrorX.current = false;
    controlState.mirrorY.current = false;
    setHighlightPlay(false);
    setHighlightPause(false);
    setHighlightDraw(false);
    setHighlightErase(-1);
    setHighlightMirrorX(-1);
    setHighlightMirrorY(-1);
    cellData.clear();
    cellAnimation.clearCanvas();
    initialData.clear();
  };

  const handleNextClick = () => {
    if (controlState.isPlaying.current) {
      controlState.isPaused.current = true;
      setHighlightPlay(false);
      setHighlightPause(true);
      cellAnimation.drawNext();
    }
  };

  const handleDrawClick = () => {
    if (controlState.isPlaying.current) {
      controlState.isPlaying.current = false;
      controlState.isPaused.current = false;
      setHighlightPlay(false);
      setHighlightPause(false);
      cellData.clear();
      cellAnimation.clearCanvas();
    }
    controlState.isDrawing.current = !controlState.isDrawing.current;
    controlState.setShowOnlyDraw(controlState.isDrawing.current);
    setHighlightDraw(controlState.isDrawing.current);
    if (!controlState.isDrawing.current) {
      controlState.isErasing.current = false;
      controlState.mirrorX.current = false;
      controlState.mirrorY.current = false;
      setHighlightErase(-1);
      setHighlightMirrorX(-1);
      setHighlightMirrorY(-1);
    } else {
      setHighlightErase(0);
      setHighlightMirrorX(0);
      setHighlightMirrorY(0);
    }
  };

  const handleEraseClick = () => {
    if (!controlState.isDrawing.current) {
      return;
    }

    controlState.isErasing.current = !controlState.isErasing.current;
    setHighlightErase(controlState.isErasing.current ? 1 : 0);
  };

  const handleMirrorClick = (allignment: "x" | "y") => {
    if (!controlState.isDrawing.current) {
      return;
    }

    if (allignment === "x") {
      controlState.mirrorX.current = !controlState.mirrorX.current;
      setHighlightMirrorX(controlState.mirrorX.current ? 1 : 0);
    }
    if (allignment === "y") {
      controlState.mirrorY.current = !controlState.mirrorY.current;
      setHighlightMirrorY(controlState.mirrorY.current ? 1 : 0);
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
    if (!isFullscreen && gameContainerRef.current) {
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
          isFullscreen={isFullscreen}
          controlState={controlState}
          handlePlayClick={handlePlayClick}
          highlightPlay={highlightPlay}
          handlePauseClick={handlePauseClick}
          highlightPause={highlightPause}
          handleNextClick={handleNextClick}
          handleStopClick={handleStopClick}
          handleDrawClick={handleDrawClick}
          highlightDraw={highlightDraw}
          handleEraseClick={handleEraseClick}
          highlightErase={highlightErase}
          handleMirrorClick={handleMirrorClick}
          highlightMirrorX={highlightMirrorX}
          highlightMirrorY={highlightMirrorY}
          handleFullscreenClick={handleFullscreenClick}
          handleTotalCellsSelect={handleTotalCellsSelect}
        />
      )}
      {canvasState.windowAspect === "landscape" && (
        <FullscreenControls
          isFullscreen={isFullscreen}
          controlState={controlState}
          handlePlayClick={handlePlayClick}
          handlePauseClick={handlePauseClick}
          handleNextClick={handleNextClick}
          handleStopClick={handleStopClick}
          handleDrawClick={handleDrawClick}
          handleEraseClick={handleEraseClick}
          highlightErase={highlightErase}
          handleMirrorClick={handleMirrorClick}
          highlightMirrorX={highlightMirrorX}
          highlightMirrorY={highlightMirrorY}
          handleFullscreenClick={handleFullscreenClick}
          handleTotalCellsSelect={handleTotalCellsSelect}
          outdatedBrowserFS={outdatedBrowserFS}
        />
      )}
    </>
  );
};

export default Controls;
