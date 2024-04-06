import React, { useState } from "react";
import { CellData } from "../GameCanvas/useCellData";

const Controls = ({
  isPlaying,
  isPaused,
  isDrawing,
  cellData,
  clearCanvas,
  drawNext,
  initialData,
}: {
  isPlaying: React.MutableRefObject<boolean>;
  isPaused: React.MutableRefObject<boolean>;
  isDrawing: React.MutableRefObject<boolean>;
  cellData: CellData;
  clearCanvas: () => void;
  drawNext: () => void;
  initialData: Set<number>;
}) => {
  const [highlightPlay, setHighlightPlay] = useState<boolean>(false);
  const [highlightPause, setHighlightPause] = useState<boolean>(false);
  const [highlightDrawing, setHighlightDrawing] = useState<boolean>(false);

  const handlePlayClick = () => {
    if (!isPlaying.current) {
      isPlaying.current = true;
      if (initialData.size > 0) {
        cellData.initData(initialData);
      } else {
        cellData.initData();
      }
      initialData.clear();
    }
    if (isPaused.current) {
      isPaused.current = false;
    }
    isDrawing.current = false;
    setHighlightPlay(true);
    setHighlightPause(false);
    setHighlightDrawing(false);
  };

  const handlePauseClick = () => {
    if (!isPaused.current && isPlaying.current) {
      isPaused.current = true;
      setHighlightPause(true);
      setHighlightPlay(false);
    } else if (isPaused.current && isPlaying.current) {
      isPaused.current = false;
      setHighlightPause(false);
      setHighlightPlay(true);
    }
  };

  const handleStopClick = () => {
    isPlaying.current = false;
    isPaused.current = false;
    isDrawing.current = false;
    setHighlightPlay(false);
    setHighlightPause(false);
    setHighlightDrawing(false);
    cellData.clear();
    clearCanvas();
    initialData.clear();
  };

  const handleNextClick = () => {
    if (isPlaying.current) {
      isPaused.current = true;
      setHighlightPlay(false);
      setHighlightPause(true);
      drawNext();
    }
  };

  const handleDrawClicked = () => {
    if (isPlaying.current) {
      isPlaying.current = false;
      isPaused.current = false;
      setHighlightPlay(false);
      setHighlightPause(false);
      cellData.clear();
      clearCanvas();
    }
    isDrawing.current = !isDrawing.current;
    if (isDrawing.current) {
      setHighlightDrawing(true);
    } else {
      setHighlightDrawing(false);
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
          onClick={handleDrawClicked}
          className={`${
            highlightDrawing
              ? "text-orange-400 border-orange-400"
              : "text-white border-black"
          } h-10 hover:text-orange-400 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center`}
        >
          Draw
        </button>
        <p className="h-10 text-lg font-bold text-black text-center grid items-center">
          Mirror:{" "}
        </p>
        <button className="h-10 text-white hover:text-orange-400 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 border-black hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center">
          Horizontal
        </button>
        <button className="h-10 text-white hover:text-orange-400 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 border-black hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center">
          Vertical
        </button>
      </div>
    </div>
  );
};

export default Controls;
