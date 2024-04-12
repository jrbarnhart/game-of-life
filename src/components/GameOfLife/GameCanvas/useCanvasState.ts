// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect, useCallback, useRef } from "react";
import { ControlRefs } from "./useControlRefs";

export interface CanvasStateInterface {
  canvasSize: { width: number; height: number };
  gridSize: React.MutableRefObject<{ width: number; height: number }>;
  handleResize: () => void;
}

export const CANVAS_WIDTHS = {
  xs: 300,
  sm: 498,
  md: 600,
  lg: 798,
  xl: 996,
  xxl: 996,
};

// TailwindCSS breakpoints
export const TW_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

// Hook
function useCanvasState(
  marginX: number,
  marginY: number,
  controlRefs: ControlRefs
) {
  const heightRatio =
    controlRefs.aspect.current.height / controlRefs.aspect.current.width;

  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_WIDTHS.xs,
    height: CANVAS_WIDTHS.xs * heightRatio,
  });

  const initGridWidth = Math.sqrt(
    (controlRefs.totalCells.current * controlRefs.aspect.current.width) /
      controlRefs.aspect.current.height
  );
  const initGridHeight =
    (initGridWidth * controlRefs.aspect.current.height) /
    controlRefs.aspect.current.width;

  const gridSize = useRef<{ width: number; height: number }>({
    width: initGridWidth,
    height: initGridHeight,
  });

  const handleResize = useCallback(() => {
    // Set canvas size based on window size and breakpoints
    const heightRatio =
      controlRefs.aspect.current.height / controlRefs.aspect.current.width;
    const availableWidth = window.innerWidth - marginX;
    const availableHeight = window.innerHeight - marginY;

    let newWidth = canvasSize.width;
    let newHeight = canvasSize.height;
    // Set width based on window width
    if (window.innerWidth >= TW_BREAKPOINTS.xxl + marginX) {
      newWidth = Math.min(CANVAS_WIDTHS.xxl, availableWidth);
    } else if (window.innerWidth >= TW_BREAKPOINTS.xl + marginX) {
      newWidth = Math.min(CANVAS_WIDTHS.xl, availableWidth);
    } else if (window.innerWidth >= TW_BREAKPOINTS.lg + marginX) {
      newWidth = Math.min(CANVAS_WIDTHS.lg, availableWidth);
    } else if (window.innerWidth >= TW_BREAKPOINTS.md + marginX) {
      newWidth = Math.min(CANVAS_WIDTHS.md, availableWidth);
    } else if (window.innerWidth >= TW_BREAKPOINTS.sm + marginX) {
      newWidth = Math.min(CANVAS_WIDTHS.sm, availableWidth);
    } else if (window.innerWidth < TW_BREAKPOINTS.sm + marginX) {
      newWidth = Math.min(CANVAS_WIDTHS.xs, availableWidth);
    }
    // Set height based on width
    newHeight = newWidth * heightRatio;
    // If it is too high then set to available height and size width proportionally
    if (newHeight > availableHeight) {
      newHeight = availableHeight;
      newWidth = newHeight / heightRatio;
    }

    if (newWidth !== canvasSize.width || newHeight !== canvasSize.height) {
      setCanvasSize({
        width: newWidth,
        height: newHeight,
      });
      console.log("Resized canvas", newWidth, newHeight);
    }
  }, [
    canvasSize.height,
    canvasSize.width,
    controlRefs.aspect,
    marginX,
    marginY,
  ]);

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
    gridSize,
    handleResize,
  };

  return canvasState;
}

export default useCanvasState;
