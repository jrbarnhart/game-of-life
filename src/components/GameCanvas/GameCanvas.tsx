import useCanvasSize from "./useCanvasSize";
import useCellAnimation from "./useCellAnimation";
import useCellData from "./useCellData";
import useInitCanvas from "./useInitCanvas";

const GameCanvas = () => {
  const canvasSize = useCanvasSize(12);

  const cellData = useCellData({ width: 20, height: 20 });

  const {
    canvasInitialized,
    canvasRef,
    contextRef,
    overlayRef,
    overlayContextRef,
  } = useInitCanvas();

  useCellAnimation(
    canvasRef.current,
    contextRef.current,
    overlayRef.current,
    overlayContextRef.current,
    canvasInitialized,
    cellData
  );

  return (
    <div
      className={`relative w-[${canvasSize.width.toString()}px] h-[${canvasSize.height.toString()}px]`}
    >
      <canvas
        className="absolute top-0 bg-transparent z-10"
        height={canvasSize.height}
        width={canvasSize.width}
        ref={overlayRef}
      />
      <canvas
        className="bg-black absolute top-0"
        height={canvasSize.height}
        width={canvasSize.width}
        ref={canvasRef}
      />
    </div>
  );
};

export default GameCanvas;
