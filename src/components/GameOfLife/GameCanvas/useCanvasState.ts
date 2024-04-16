// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect, useCallback } from "react";
import { ControlRefs } from "./useControlRefs";

export interface CanvasStateInterface {
  canvasSize: { width: number; height: number };
  handleResize: () => void;
}

export const CANVAS_SIZES = {
  xs: { x: 300, y: 200 },
  sm: { x: 600, y: 400 },
  md: { x: 600, y: 400 },
  lg: { x: 900, y: 600 },
  xl: { x: 1200, y: 800 },
  xxl: { x: 1500, y: 1000 },
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
function useCanvasState(marginY: number, controlRefs: ControlRefs) {
  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_SIZES.xs.x,
    height: CANVAS_SIZES.xs.y,
  });

  const handleResize = useCallback(() => {
    // Set canvas size based on window size and breakpoints
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight - marginY;

    let newWidth = canvasSize.width;
    let newHeight = canvasSize.height;
    // Set width based on window width
    if (
      availableWidth >= TW_BREAKPOINTS.xxl &&
      availableHeight >= CANVAS_SIZES.xxl.y
    ) {
      newWidth = CANVAS_SIZES.xxl.x;
      newHeight = CANVAS_SIZES.xxl.y;
    } else if (
      availableWidth >= TW_BREAKPOINTS.xl &&
      availableHeight >= CANVAS_SIZES.xl.y
    ) {
      newWidth = CANVAS_SIZES.xl.x;
      newHeight = CANVAS_SIZES.xl.y;
    } else if (
      availableWidth >= TW_BREAKPOINTS.lg &&
      availableHeight >= CANVAS_SIZES.lg.y
    ) {
      newWidth = CANVAS_SIZES.lg.x;
      newHeight = CANVAS_SIZES.lg.y;
    } else if (
      availableWidth >= TW_BREAKPOINTS.md &&
      availableHeight >= CANVAS_SIZES.md.y
    ) {
      newWidth = CANVAS_SIZES.md.x;
      newHeight = CANVAS_SIZES.md.y;
    } else if (
      availableWidth >= TW_BREAKPOINTS.sm &&
      availableHeight >= CANVAS_SIZES.sm.y
    ) {
      newWidth = CANVAS_SIZES.sm.x;
      newHeight = CANVAS_SIZES.sm.y;
    } else if (availableWidth < TW_BREAKPOINTS.sm) {
      newWidth = CANVAS_SIZES.xs.x;
      newHeight = CANVAS_SIZES.xs.y;
    }

    if (newWidth !== canvasSize.width || newHeight !== canvasSize.height) {
      setCanvasSize({
        width: newWidth,
        height: newHeight,
      });
      console.log("Resized canvas", newWidth, newHeight);
    }
  }, [canvasSize.height, canvasSize.width, marginY]);

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
    handleResize,
  };

  return canvasState;
}

export default useCanvasState;
