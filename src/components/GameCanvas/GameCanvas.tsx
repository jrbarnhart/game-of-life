import useCellAnimation from "./useCellAnimation";
import useCellData from "./useCellData";
import useInitCanvas from "./useInitCanvas";

const GameCanvas = ({ height, width }: { height: number; width: number }) => {
  const cellData = useCellData(10);
  const { canvasInitialized, canvasRef, contextRef } = useInitCanvas();
  useCellAnimation(
    canvasRef.current,
    contextRef.current,
    canvasInitialized,
    cellData
  );
  return (
    <canvas
      className="bg-neutral-500 "
      height={height}
      width={width}
      ref={canvasRef}
    />
  );
};

export default GameCanvas;
