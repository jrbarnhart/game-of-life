import useCanvasSize from "./useCanvasSize";
import useCellAnimation from "./useCellAnimation";
import { CellData } from "./useCellData";
import useInitCanvas from "./useInitCanvas";

const GameCanvas = ({ cellData }: { cellData: CellData }) => {
  const canvasSize = useCanvasSize(12);

  const {
    canvasInitialized,
    canvasRef,
    contextRef,
    overlayRef,
    overlayContextRef,
    containerRef,
  } = useInitCanvas(canvasSize.width, canvasSize.height);

  useCellAnimation(
    canvasRef.current,
    contextRef.current,
    overlayRef.current,
    overlayContextRef.current,
    canvasInitialized,
    cellData
  );

  return (
    <div ref={containerRef} className="relative">
      <canvas className="absolute top-0 bg-transparent z-10" ref={overlayRef} />
      <canvas className="bg-black absolute top-0" ref={canvasRef} />
    </div>
  );
};

export default GameCanvas;
