import { useEffect, useRef, useState } from "react";

const useInitCanvas = (width: number, height: number) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const overlayContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);

  // Initialize canvas
  useEffect(() => {
    // Set canvas context ref
    if (canvasRef.current && overlayRef.current && containerRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
      overlayContextRef.current = overlayRef.current.getContext("2d");
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      overlayRef.current.width = width;
      overlayRef.current.height = height;
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
    overlayRef,
    overlayContextRef,
    containerRef,
  };
};

export default useInitCanvas;
