// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect } from "react";

export const CANVAS_SIZES = {
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
function useCanvasSize(margin: number) {
  const [canvasSize, setCanvasSize] = useState({
    width: CANVAS_SIZES.xs,
    height: CANVAS_SIZES.xs,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set canvas size based on window size and breakpoints
      let newWidth = canvasSize.width;

      if (window.innerWidth >= TW_BREAKPOINTS.xxl + margin) {
        newWidth = CANVAS_SIZES.xxl - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.xl + margin) {
        newWidth = CANVAS_SIZES.xl - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.lg + margin) {
        newWidth = CANVAS_SIZES.lg - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.md + margin) {
        newWidth = CANVAS_SIZES.md - margin;
      } else if (window.innerWidth >= TW_BREAKPOINTS.sm + margin) {
        newWidth = CANVAS_SIZES.sm - margin;
      } else if (window.innerWidth < TW_BREAKPOINTS.sm + margin) {
        newWidth = CANVAS_SIZES.xs - margin;
      }

      if (newWidth !== canvasSize.width) {
        setCanvasSize({ width: newWidth, height: newWidth });
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
  }, [canvasSize.width, margin]); // Empty array ensures that effect is only run on mount
  return canvasSize;
}

export default useCanvasSize;
