// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect } from "react";

export const CANVAS_WIDTHS = {
  xs: 300,
  sm: 500,
  md: 600,
  lg: 750,
  xl: 850,
  xxl: 850,
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
function useCanvasSize(margin: number, gridWidth: number, gridHeight: number) {
  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_WIDTHS.xs,
    height: (gridHeight * CANVAS_WIDTHS.xs) / gridWidth > 1 ? gridWidth : 1,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set canvas size based on window size and breakpoints
      let newWidth = canvasSize.width;

      if (window.innerWidth >= TW_BREAKPOINTS.xxl + margin) {
        newWidth = CANVAS_WIDTHS.xxl - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.xl + margin) {
        newWidth = CANVAS_WIDTHS.xl - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.lg + margin) {
        newWidth = CANVAS_WIDTHS.lg - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.md + margin) {
        newWidth = CANVAS_WIDTHS.md - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.sm + margin) {
        newWidth = CANVAS_WIDTHS.sm - margin;
      } else if (window.innerWidth < TW_BREAKPOINTS.sm + margin) {
        newWidth = CANVAS_WIDTHS.xs - margin;
      }

      if (newWidth !== canvasSize.width) {
        setCanvasSize({
          width: newWidth,
          height: (gridHeight * newWidth) / gridWidth > 0 ? gridWidth : 1,
        });
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
  }, [canvasSize.width, gridHeight, gridWidth, margin]); // Empty array ensures that effect is only run on mount
  return canvasSize;
}

export default useCanvasSize;
