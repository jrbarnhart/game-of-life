import { GRID_SIZES } from "../GameCanvas/useGridSize";
import InfoHeader from "../../InfoHeader/InfoHeader";
import React from "react";

const DefaultControls = ({
  handlePlayClick,
  highlightPlay,
  handlePauseClick,
  highlightPause,
  handleNextClick,
  handleStopClick,
  handleDrawClick,
  highlightDraw,
  handleEraseClick,
  highlightErase,
  handleMirrorClick,
  highlightMirrorX,
  highlightMirrorY,
  handleFullscreenClick,
  isFullscreen,
  handleTotalCellsSelect,
}: {
  handlePlayClick: () => void;
  highlightPlay: boolean;
  handlePauseClick: () => void;
  highlightPause: boolean;
  handleNextClick: () => void;
  handleStopClick: () => void;
  handleDrawClick: () => void;
  highlightDraw: boolean;
  handleEraseClick: () => void;
  highlightErase: number;
  handleMirrorClick: (allignment: "x" | "y") => void;
  highlightMirrorX: number;
  highlightMirrorY: number;
  handleFullscreenClick: () => void;
  isFullscreen: boolean;
  handleTotalCellsSelect: React.ChangeEventHandler;
}) => {
  return (
    <div className="grid auto-rows-min">
      <div className="w-full grid justify-items-center items-center p-2">
        <div className="bg-zinc-800 p-2 rounded-lg">
          <InfoHeader
            text="Conway's Game of Life"
            link="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          />
        </div>
      </div>
      <div className="grid justify-self-center">
        <div className="h-12 w-72 p-1 grid grid-flow-col content-center gap-x-1 bg-neutral-400 rounded-sm border-2 border-b-0 lg:border-b-2 border-black">
          <button
            aria-label="play"
            onClick={handlePlayClick}
            className={`${
              highlightPlay
                ? "border-orange-400 text-orange-400"
                : "border-black text-neutral-50"
            } h-9 focus:outline-none focus:ring-4 focus:ring-orange-500 hover:text-orange-400 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center`}
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
                ? "border-orange-400 text-orange-400"
                : "border-black text-neutral-50"
            } h-9 focus:outline-none focus:ring-4 focus:ring-orange-500 hover:text-orange-400 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center`}
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
            className="h-9 focus:outline-none focus:ring-4 focus:ring-orange-500 text-neutral-50 hover:text-orange-400 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 border-black hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center"
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
            className="h-9 focus:outline-none focus:ring-4 focus:ring-orange-500 text-neutral-50 hover:text-orange-400 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 border-black hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center"
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
        <div className="h-12 w-72 p-1 grid grid-flow-col gap-x-1 grid-cols-4 bg-neutral-400 border-2 border-t-0 border-b-0 lg:border-b-2 lg:border-t-2 lg:border-l-0 lg:border-r-0 border-black">
          <button
            onClick={handleDrawClick}
            className={`${
              highlightDraw
                ? "text-orange-400 border-orange-400"
                : "text-white border-black"
            } h-full focus:outline-none focus:ring-4 focus:ring-orange-500 hover:text-orange-400 bg-neutral-700 active:bg-neutral-600 rounded-md border-2 hover:border-orange-400 active:border-orange-500 grid items-center justify-items-center`}
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
            } h-full focus:outline-none focus:ring-4 focus:ring-orange-500 rounded-md border-2  grid items-center justify-items-center`}
            aria-disabled={highlightMirrorX === -1 ? true : false}
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
            } h-full focus:outline-none focus:ring-4 focus:ring-orange-500 rounded-md border-2  grid items-center justify-items-center`}
            aria-disabled={highlightMirrorX === -1 ? true : false}
          >
            Mirror X
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
            } h-full focus:outline-none focus:ring-4 focus:ring-orange-500 rounded-md border-2  grid items-center justify-items-center`}
            aria-disabled={highlightMirrorX === -1 ? true : false}
          >
            Mirror Y
          </button>
        </div>
        <div className="h-12 w-72 p-1 grid grid-flow-col gap-x-1 grid-cols-4 bg-neutral-400 border-2 border-t-0 lg:border-t-2 border-black">
          <button
            aria-label="toggle fullscreen"
            onClick={handleFullscreenClick}
            className="h-full focus:outline-none focus:ring-4 focus:ring-orange-500 rounded-md border-2  grid items-center justify-items-center text-white hover:text-orange-400  bg-neutral-700 active:bg-neutral-600  border-black hover:border-orange-400"
          >
            {!isFullscreen && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z" />
              </svg>
            )}
            {isFullscreen && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z" />
              </svg>
            )}
          </button>
          <label
            htmlFor="total-cells"
            className="h-full text-center grid items-center text-black"
          >
            Cells:
          </label>
          <select
            onChange={handleTotalCellsSelect}
            name="totalCells"
            id="total-cells"
            className="h-full focus:outline-none focus:ring-4 focus:ring-orange-500 rounded-md col-span-2 text-white hover:text-orange-400  bg-neutral-700 active:bg-neutral-600 border-2 border-black hover:border-orange-400"
          >
            {/* Min canvas size is 300, meaning 300x200 is the max cells possible w/o subpixel rendering
                Values must fit this size AND ratio or game will not function. */}
            <option value={GRID_SIZES.sm.x * GRID_SIZES.sm.y}>
              {(GRID_SIZES.sm.x * GRID_SIZES.sm.y).toLocaleString()}
            </option>
            <option value={GRID_SIZES.md.x * GRID_SIZES.md.y}>
              {(GRID_SIZES.md.x * GRID_SIZES.md.y).toLocaleString()}
            </option>
            <option value={GRID_SIZES.lg.x * GRID_SIZES.lg.y}>{`${(
              GRID_SIZES.lg.x * GRID_SIZES.lg.y
            ).toLocaleString()} (No Grid)`}</option>
            <option value={GRID_SIZES.xl.x * GRID_SIZES.xl.y}>{`${(
              GRID_SIZES.xl.x * GRID_SIZES.xl.y
            ).toLocaleString()} (No Grid)`}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DefaultControls;
