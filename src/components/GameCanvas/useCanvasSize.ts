// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect } from "react";

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [canvasSize, setCanvasSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // TailwindCSS default breakpoints
      const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 };
      // Set canvas size based on window size and breakpoints
      let newWidth;

      if (window.innerWidth >= breakpoints.xxl) {
        newWidth = breakpoints.xxl;
      } else if (window.innerWidth >= breakpoints.xl) {
        newWidth = breakpoints.xl;
      } else if (window.innerWidth >= breakpoints.lg) {
        newWidth = breakpoints.lg;
      } else if (window.innerWidth >= breakpoints.md) {
        newWidth = breakpoints.md;
      } else {
        newWidth = breakpoints.sm;
      }

      setCanvasSize({ width: newWidth, height: newWidth });
      console.log("Updated canvas size");
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty array ensures that effect is only run on mount
  return canvasSize;
}

export default useWindowSize;
