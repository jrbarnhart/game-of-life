// Based on solution from https://stackoverflow.com/questions/74215349/trying-to-update-ref-on-resize-in-react-js

import { useState, useEffect } from "react";

// Hook
function useCanvasSize(margin: number) {
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

      if (window.innerWidth >= breakpoints.xxl - margin) {
        newWidth = breakpoints.xxl - margin;
      } else if (window.innerWidth >= breakpoints.xl + margin) {
        newWidth = breakpoints.xl - margin;
      } else if (window.innerWidth >= breakpoints.lg + margin) {
        newWidth = breakpoints.lg - margin;
      } else if (window.innerWidth >= breakpoints.md + margin) {
        newWidth = breakpoints.md - margin;
      } else if (window.innerWidth >= breakpoints.sm + margin) {
        newWidth = breakpoints.sm - margin;
      } else {
        newWidth = 300;
      }

      setCanvasSize({ width: newWidth, height: newWidth });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [margin]); // Empty array ensures that effect is only run on mount
  return canvasSize;
}

export default useCanvasSize;
