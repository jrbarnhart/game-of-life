import { useState, useEffect, SetStateAction } from "react";
import { CellData } from "../GameCanvas/useCellData";
import { ControlRefs } from "../GameCanvas/useControlRefs";
import { CanvasStateInterface } from "../GameCanvas/useCanvasState";
import { CellAnimation } from "../GameCanvas/useCellAnimation";
import DefaultControls from "./DefaultControls";
import FullscreenControls from "./FullscreenControls";

const Controls = ({
  controlRefs,
  cellData,
  cellAnimation,
  initialData,
  canvasState,
  gridSize,
  gameContainerRef,
  setOutdatedBrowserFS,
}: {
  controlRefs: ControlRefs;
  cellData: CellData;
  cellAnimation: CellAnimation;
  initialData: Set<number>;
  canvasState: CanvasStateInterface;
  gridSize: React.MutableRefObject<{ width: number; height: number }>;
  gameContainerRef: React.MutableRefObject<HTMLDivElement | null>;
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
    if (!controlRefs.isPlaying.current) {
      controlRefs.isPlaying.current = true;
      if (initialData.size > 0) {
        cellData.initData(initialData);
      } else {
        cellData.initData();
      }
      initialData.clear();
    }
    if (controlRefs.isPaused.current) {
      controlRefs.isPaused.current = false;
    }
    controlRefs.isDrawing.current = false;
    controlRefs.isErasing.current = false;
    controlRefs.mirrorX.current = false;
    controlRefs.mirrorY.current = false;
    setHighlightDraw(false);
    setHighlightErase(-1);
    setHighlightMirrorX(-1);
    setHighlightMirrorY(-1);
    setHighlightPlay(true);
    setHighlightPause(false);
  };

  const handlePauseClick = () => {
    if (!controlRefs.isPaused.current && controlRefs.isPlaying.current) {
      controlRefs.isPaused.current = true;
      setHighlightPause(true);
      setHighlightPlay(false);
    } else if (controlRefs.isPaused.current && controlRefs.isPlaying.current) {
      controlRefs.isPaused.current = false;
      setHighlightPause(false);
      setHighlightPlay(true);
    }
  };

  const handleStopClick = () => {
    controlRefs.isPlaying.current = false;
    controlRefs.isPaused.current = false;
    controlRefs.isDrawing.current = false;
    controlRefs.isErasing.current = false;
    controlRefs.mirrorX.current = false;
    controlRefs.mirrorY.current = false;
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
    if (controlRefs.isPlaying.current) {
      controlRefs.isPaused.current = true;
      setHighlightPlay(false);
      setHighlightPause(true);
      cellAnimation.drawNext();
    }
  };

  const handleDrawClick = () => {
    if (controlRefs.isPlaying.current) {
      controlRefs.isPlaying.current = false;
      controlRefs.isPaused.current = false;
      setHighlightPlay(false);
      setHighlightPause(false);
      cellData.clear();
      cellAnimation.clearCanvas();
    }
    controlRefs.isDrawing.current = !controlRefs.isDrawing.current;
    setHighlightDraw(controlRefs.isDrawing.current);
    if (!controlRefs.isDrawing.current) {
      controlRefs.isErasing.current = false;
      controlRefs.mirrorX.current = false;
      controlRefs.mirrorY.current = false;
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
    if (!controlRefs.isDrawing.current) {
      return;
    }

    controlRefs.isErasing.current = !controlRefs.isErasing.current;
    setHighlightErase(controlRefs.isErasing.current ? 1 : 0);
  };

  const handleMirrorClick = (allignment: "x" | "y") => {
    if (!controlRefs.isDrawing.current) {
      return;
    }

    if (allignment === "x") {
      controlRefs.mirrorX.current = !controlRefs.mirrorX.current;
      setHighlightMirrorX(controlRefs.mirrorX.current ? 1 : 0);
    }
    if (allignment === "y") {
      controlRefs.mirrorY.current = !controlRefs.mirrorY.current;
      setHighlightMirrorY(controlRefs.mirrorY.current ? 1 : 0);
    }
  };

  const handleFullscreenClick = () => {
    // Handle Safari being an out of date piece of garbage
    if (!document.fullscreenEnabled) {
      console.log("Shitty browser detected.");
      setOutdatedBrowserFS((prev) => !prev);
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
    controlRefs.totalCells.current = newTotal;

    const width = Math.sqrt(
      (controlRefs.totalCells.current * controlRefs.aspect.current.width) /
        controlRefs.aspect.current.height
    );
    const height =
      (width * controlRefs.aspect.current.height) /
      controlRefs.aspect.current.width;

    gridSize.current = { width, height };
    cellData.initStateArrays(width, height);
    cellAnimation.startAnimation();
  };

  return (
    <>
      {canvasState.windowAspect === "portrait" && (
        <DefaultControls
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
          isFullscreen={isFullscreen}
          handleTotalCellsSelect={handleTotalCellsSelect}
        />
      )}
      {canvasState.windowAspect === "landscape" && (
        <FullscreenControls
          isFullscreen={isFullscreen}
          controlRefs={controlRefs}
          handlePlayClick={handlePlayClick}
          handlePauseClick={handlePauseClick}
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
    </>
  );
};

export default Controls;
