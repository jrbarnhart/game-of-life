// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect } from "react";

export const CANVAS_WIDTHS = {
  xs: 320,
  sm: 500,
  md: 600,
  lg: 750,
  xl: 850,
  xxl: 850,
};

export const CANVAS_HEIGHTS = {
  xs: 180,
  sm: 281,
  md: 338,
  lg: 422,
  xl: 478,
  xxl: 478,
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
function useCanvasSize(margin: number) {
  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_WIDTHS.xs,
    height: CANVAS_HEIGHTS.xs,
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
  }, [canvasSize.height, canvasSize.width, margin]); // Empty array ensures that effect is only run on mount
  return canvasSize;
}

export default useCanvasSize;
