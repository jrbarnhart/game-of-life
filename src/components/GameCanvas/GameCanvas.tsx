import useCanvasSize from "./useCanvasSize";
import useCellAnimation from "./useCellAnimation";
import useCellData from "./useCellData";
import useInitCanvas from "./useInitCanvas";

const GameCanvas = () => {
  const canvasSize = useCanvasSize(12);

  const cellData = useCellData({ width: 4, height: 4 });

  const { canvasInitialized, canvasRef, contextRef } = useInitCanvas();

  useCellAnimation(
    canvasRef.current,
    contextRef.current,
    canvasInitialized,
    cellData
  );

  return (
    <canvas
      className="bg-white"
      height={canvasSize.height}
      width={canvasSize.width}
      ref={canvasRef}
    />
  );
};

export default GameCanvas;
