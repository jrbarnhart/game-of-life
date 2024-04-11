import { useState } from "react";
import { CellData } from "../GameCanvas/useCellData";
import { ControlRefs } from "../GameCanvas/useControlRefs";

const Controls = ({
  controlRefs,
  cellData,
  clearCanvas,
  drawNext,
  initialData,
}: {
  controlRefs: ControlRefs;
  cellData: CellData;
  clearCanvas: () => void;
  drawNext: () => void;
  initialData: Set<number>;
}) => {
  const [highlightPlay, setHighlightPlay] = useState<boolean>(false);
  const [highlightPause, setHighlightPause] = useState<boolean>(false);
  const [highlightDraw, setHighlightDraw] = useState<boolean>(false);
  // Number state: -1 dim, 0 normal, 1 highlight
  const [highlightErase, setHighlightErase] = useState<number>(-1);
  const [highlightMirrorX, setHighlightMirrorX] = useState<number>(-1);
  const [highlightMirrorY, setHighlightMirrorY] = useState<number>(-1);

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
    clearCanvas();
    initialData.clear();
  };

  const handleNextClick = () => {
    if (controlRefs.isPlaying.current) {
      controlRefs.isPaused.current = true;
      setHighlightPlay(false);
      setHighlightPause(true);
      drawNext();
    }
  };

  const handleDrawClick = () => {
    if (controlRefs.isPlaying.current) {
      controlRefs.isPlaying.current = false;
      controlRefs.isPaused.current = false;
      setHighlightPlay(false);
      setHighlightPause(false);
      cellData.clear();
      clearCanvas();
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
    // Handle erase
  };

  const handleMirrorClick = (allignment: "x" | "y") => {
    if (!controlRefs.isDrawing.current) {
      handleDrawClick();
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

  return (
    <div>
      <div className="w-96 p-1 grid grid-flow-col gap-x-1 bg-neutral-400 rounded-sm border-2 border-b-0 border-black">
        <button
          aria-label="play"
          onClick={handlePlayClick}
          className={`${
            highlightPlay
              ? "border-orange-400 text-neutral-50"
              : "border-black text-neutral-950"
          } h-10 hover:text-neutral-50 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center`}
        >
          <svg
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            className="h-full w-full"
          >
            <path
              fill="currentColor"
              d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"
            />
          </svg>
        </button>
        <button
          aria-label="pause"
          onClick={handlePauseClick}
          className={`${
            highlightPause
              ? "border-orange-400 text-neutral-50"
              : "border-black text-neutral-950"
          } h-10 hover:text-neutral-50 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center`}
        >
          <svg
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            className="h-full w-full"
          >
            <path
              fill="currentColor"
              d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"
            />
          </svg>
        </button>
        <button
          aria-label="next frame"
          onClick={handleNextClick}
          className="h-10 text-neutral-950 hover:text-neutral-50 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 border-black hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center"
        >
          <svg
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            className="h-full w-full"
          >
            <path
              fill="currentColor"
              d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z"
            />
          </svg>
        </button>
        <button
          aria-label="stop"
          onClick={handleStopClick}
          className="h-10 text-neutral-950 hover:text-neutral-50 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 border-black hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center"
        >
          <svg
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            className="h-full w-full"
          >
            <path
              fill="currentColor"
              d="M320-640v320-320Zm-80 400v-480h480v480H240Zm80-80h320v-320H320v320Z"
            />
          </svg>
        </button>
      </div>
      <div className="w-96 p-1 grid grid-flow-col gap-x-1 grid-cols-4 bg-neutral-400 border-2 border-t-0 border-black">
        <button
          onClick={handleDrawClick}
          className={`${
            highlightDraw
              ? "text-orange-400 border-orange-400"
              : "text-white border-black"
          } h-10 hover:text-orange-400 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center`}
        >
          Draw
        </button>
        <button
          onClick={handleEraseClick}
          className={`${
            highlightErase === 1
              ? "text-orange-400 bg-neutral-700 border-orange-400"
              : highlightErase === -1
              ? "text-neutral-950 bg-neutral-400 active:bg-red-500 border-neutral-700"
              : "text-white hover:text-orange-400  bg-neutral-700 active:bg-neutral-600  border-black hover:border-orange-400"
          } h-10  rounded-md border-2  grid items-center justify-items-center`}
        >
          Erase
        </button>
        <button
          onClick={() => {
            handleMirrorClick("x");
          }}
          className={`${
            highlightMirrorX === 1
              ? "text-orange-400 bg-neutral-700 border-orange-400"
              : highlightMirrorX === -1
              ? "text-neutral-950 bg-neutral-400 active:bg-red-500 border-neutral-700"
              : "text-white hover:text-orange-400  bg-neutral-700 active:bg-neutral-600  border-black hover:border-orange-400"
          } h-10  rounded-md border-2  grid items-center justify-items-center`}
        >
          Horizontal
        </button>
        <button
          onClick={() => {
            handleMirrorClick("y");
          }}
          className={`${
            highlightMirrorY === 1
              ? "text-orange-400 bg-neutral-700 border-orange-400"
              : highlightMirrorY === -1
              ? "text-neutral-950 bg-neutral-400 active:bg-red-500 border-neutral-700"
              : "text-white hover:text-orange-400  bg-neutral-700 active:bg-neutral-600  border-black hover:border-orange-400"
          } h-10  rounded-md border-2  grid items-center justify-items-center`}
        >
          Vertical
        </button>
      </div>
    </div>
  );
};

export default Controls;
