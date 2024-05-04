import { useEffect, useRef, useState } from "react";

const useInitCanvas = (width: number, height: number) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);

  // Initialize canvas
  useEffect(() => {
    // Set canvas context ref
    if (canvasRef.current && containerRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      containerRef.current.style.width = `${width.toString()}px`;
      containerRef.current.style.height = `${height.toString()}px`;
      setCanvasInitialized(true);
      console.log("Canvas intialized.");
    }
  }, [width, height]);

  return {
    canvasInitialized,
    canvasRef,
    contextRef,
    containerRef,
  };
};

export default useInitCanvas;
