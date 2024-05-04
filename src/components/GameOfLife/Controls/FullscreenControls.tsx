import { ControlRefs } from "../GameCanvas/useControlRefs";
import { GRID_SIZES } from "../GameCanvas/useGridSize";

const FullscreenControls = ({
  isFullscreen,
  controlRefs,
}: {
  isFullscreen: boolean;
  controlRefs: ControlRefs;
}) => {
  return (
    <div className="absolute top-0 left-0 size-full">
      <button aria-label={!controlRefs.isPlaying.current ? "play" : "pause"}>
        {!controlRefs.isPlaying.current && (
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
        )}
        {controlRefs.isPlaying.current && (
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
        )}
      </button>
      <button aria-label="next frame">
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
      <button aria-label="stop">
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
      <button aria-label="draw">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 32 17 54.5t46 39.5Z" />
        </svg>
      </button>
      <button aria-label="erase">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M690-240h190v80H610l80-80Zm-500 80-85-85q-23-23-23.5-57t22.5-58l440-456q23-24 56.5-24t56.5 23l199 199q23 23 23 57t-23 57L520-160H190Zm296-80 314-322-198-198-442 456 64 64h262Zm-6-240Z" />
        </svg>
      </button>
      <button aria-label="mirror vertical drawing">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M360-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160v80H200v560h160v80Zm80 80v-880h80v880h-80Zm160-80v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80q0 33-23.5 56.5T760-120Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80q33 0 56.5 23.5T840-760h-80Z" />
        </svg>
      </button>
      <button aria-label="mirror horizontal drawing" className="rotate-90">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M360-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160v80H200v560h160v80Zm80 80v-880h80v880h-80Zm160-80v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80q0 33-23.5 56.5T760-120Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80q33 0 56.5 23.5T840-760h-80Z" />
        </svg>
      </button>
      <button aria-label="toggle fullscreen">
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
      <label htmlFor="total-cells">
        Cells:{" "}
        <select id="total-cells">
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
      </label>
    </div>
  );
};

export default FullscreenControls;
