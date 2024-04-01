import { useEffect, useRef, useState } from "react";

const useInitCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const overlayContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);

  // Initialize canvas
  useEffect(() => {
    // Set canvas context ref
    if (canvasRef.current && overlayRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
      overlayContextRef.current = overlayRef.current.getContext("2d");
      setCanvasInitialized(true);
      console.log("Canvas intialized.");
    }
  }, []);

  return {
    canvasInitialized,
    canvasRef,
    contextRef,
    overlayRef,
    overlayContextRef,
  };
};

export default useInitCanvas;
