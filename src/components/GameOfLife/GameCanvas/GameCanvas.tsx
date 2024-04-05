import useCanvasSize from "./useCanvasSize";
import useCellAnimation from "./useCellAnimation";
import { CellData } from "./useCellData";
import useInitCanvas from "./useInitCanvas";

const GameCanvas = ({
  cellData,
  isPlaying,
  isPaused,
}: {
  cellData: CellData;
  isPlaying: React.MutableRefObject<boolean>;
  isPaused: React.MutableRefObject<boolean>;
}) => {
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
    canvasSize,
    canvasRef.current,
    contextRef.current,
    overlayRef.current,
    overlayContextRef.current,
    canvasInitialized,
    cellData,
    isPlaying,
    isPaused
  );

  return (
    <div ref={containerRef} className="relative">
      <canvas className="absolute top-0 bg-transparent z-10" ref={overlayRef} />
      <canvas className="bg-black absolute top-0" ref={canvasRef} />
    </div>
  );
};

export default GameCanvas;
