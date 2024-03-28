// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect } from "react";

// Hook
function useCanvasSize() {
  const [canvasSize, setCanvasSize] = useState({
    width: 300,
    height: 300,
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
      } else if (window.innerWidth >= breakpoints.sm) {
        newWidth = breakpoints.sm;
      } else {
        newWidth = 300;
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

export default useCanvasSize;
