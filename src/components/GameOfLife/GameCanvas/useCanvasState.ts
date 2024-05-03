// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect, useCallback } from "react";

export interface CanvasStateInterface {
  canvasSize: {
    width: number;
    height: number;
  };
  windowAspect: "portrait" | "landscape";
  handleResize: () => void;
}

export const CANVAS_SIZES = [
  { width: 384, height: 216 },
  { width: 432, height: 243 },
  { width: 512, height: 288 },
  { width: 640, height: 360 },
  { width: 768, height: 432 },
  { width: 896, height: 504 },
  { width: 960, height: 540 },
  { width: 1024, height: 576 },
  { width: 1152, height: 648 },
  { width: 1280, height: 720 },
  { width: 1360, height: 765 },
  { width: 1408, height: 792 },
  { width: 1536, height: 864 },
  { width: 1664, height: 936 },
  { width: 1792, height: 1008 },
  { width: 1920, height: 1080 },
  { width: 2048, height: 1152 },
  { width: 2560, height: 1440 },
  { width: 3072, height: 1728 },
  { width: 3200, height: 1800 },
  { width: 3840, height: 2160 },
  { width: 4096, height: 2304 },
  { width: 5120, height: 2880 },
  { width: 7680, height: 4320 },
  { width: 8192, height: 4608 },
  { width: 15360, height: 8640 },
  { width: 16384, height: 9216 },
];

// Hook
function useCanvasState() {
  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_SIZES[0].width,
    height: CANVAS_SIZES[0].height,
  });

  const [windowAspect, setWindowAspect] = useState<"portrait" | "landscape">(
    "portrait"
  );

  const handleResize = useCallback(() => {
    const availWidth = Math.min(window.screen.availWidth, window.innerWidth);
    const availHeight = Math.min(window.screen.availHeight, window.innerHeight);

    if (availWidth > availHeight && windowAspect !== "landscape") {
      setWindowAspect("landscape");
    } else if (availWidth <= availHeight && windowAspect !== "portrait") {
      setWindowAspect("portrait");
    }

    // Get the max viable width index
    let maxWidthIndex = 0;
    for (let i = 0; i < CANVAS_SIZES.length; i++) {
      if (CANVAS_SIZES[i].width <= availWidth) {
        continue;
      } else if (i > 0) {
        maxWidthIndex = i - 1;
        break;
      } else {
        maxWidthIndex = 0;
        break;
      }
    }

    // Get the max viable size index
    let sizeIndex = 0;
    for (let i = maxWidthIndex; i > 0; i--) {
      if (CANVAS_SIZES[i].height <= availHeight) {
        sizeIndex = i;
        break;
      }
    }

    const newWidth = CANVAS_SIZES[sizeIndex].width;
    const newHeight = CANVAS_SIZES[sizeIndex].height;

    if (newWidth !== canvasSize.width || newHeight !== canvasSize.height) {
      setCanvasSize({
        width: newWidth,
        height: newHeight,
      });
      console.log("Resized canvas", newWidth, newHeight);
    }
  }, [canvasSize.height, canvasSize.width, windowAspect]);

  useEffect(() => {
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const canvasState: CanvasStateInterface = {
    canvasSize,
    windowAspect,
    handleResize,
  };

  return canvasState;
}

export default useCanvasState;
