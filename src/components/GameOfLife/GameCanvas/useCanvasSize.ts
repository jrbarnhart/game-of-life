// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect, SetStateAction } from "react";
import { ControlRefs } from "./useControlRefs";

export interface CanvasState {
  canvasSize: { width: number; height: number };
  gridSize: { width: number; height: number };
  setGridSize: React.Dispatch<
    SetStateAction<{ width: number; height: number }>
  >;
}

export const CANVAS_WIDTHS = {
  xs: 300,
  sm: 498,
  md: 600,
  lg: 798,
  xl: 996,
  xxl: 996,
};

export const CANVAS_HEIGHTS = {
  xs: 200,
  sm: 332,
  md: 400,
  lg: 532,
  xl: 664,
  xxl: 664,
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
function useCanvasSize(margin: number, controlRefs: ControlRefs) {
  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_WIDTHS.xs,
    height: CANVAS_HEIGHTS.xs,
  });

  const initGridWidth = Math.sqrt(
    (controlRefs.totalCells.current * controlRefs.aspect.current.width) /
      controlRefs.aspect.current.height
  );
  const initGridHeight =
    (initGridWidth * controlRefs.aspect.current.height) /
    controlRefs.aspect.current.width;
  const [gridSize, setGridSize] = useState<{ width: number; height: number }>({
    width: initGridWidth,
    height: initGridHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set canvas size based on window size and breakpoints
      let newWidth = canvasSize.width;
      let newHeight = canvasSize.height;
      if (window.innerWidth >= TW_BREAKPOINTS.xxl + margin) {
        newWidth = CANVAS_WIDTHS.xxl - margin;
        newHeight = CANVAS_HEIGHTS.xxl - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.xl + margin) {
        newWidth = CANVAS_WIDTHS.xl - margin;
        newHeight = CANVAS_HEIGHTS.xl - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.lg + margin) {
        newWidth = CANVAS_WIDTHS.lg - margin;
        newHeight = CANVAS_HEIGHTS.lg - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.md + margin) {
        newWidth = CANVAS_WIDTHS.md - margin;
        newHeight = CANVAS_HEIGHTS.md - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.sm + margin) {
        newWidth = CANVAS_WIDTHS.sm - margin;
        newHeight = CANVAS_HEIGHTS.sm - margin;
      } else if (window.innerWidth < TW_BREAKPOINTS.sm + margin) {
        newWidth = CANVAS_WIDTHS.xs - margin;
        newHeight = CANVAS_HEIGHTS.xs - margin;
      }

      if (newWidth !== canvasSize.width) {
        setCanvasSize({
          width: newWidth,
          height: newHeight,
        });
        console.log("Resized window");
      }
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasSize.height, canvasSize.width, margin]);

  const canvasState: CanvasState = {
    canvasSize,
    gridSize,
    setGridSize,
  };

  return canvasState;
}

export default useCanvasSize;
