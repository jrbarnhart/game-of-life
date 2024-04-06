import { useRef } from "react";
import Controls from "./Controls/Controls";
import GameCanvas from "./GameCanvas/GameCanvas";
import useCellData from "./GameCanvas/useCellData";
import useCanvasSize from "./GameCanvas/useCanvasSize";
import useInitCanvas from "./GameCanvas/useInitCanvas";
import useCellAnimation from "./GameCanvas/useCellAnimation";

const GameOfLife = ({
  gridWidth,
  gridHeight,
}: {
  gridWidth: number;
  gridHeight: number;
}) => {
  const cellData = useCellData({ width: gridWidth, height: gridHeight });
  const isPlaying = useRef<boolean>(false);
  const isPaused = useRef<boolean>(false);

  const canvasSize = useCanvasSize(12);

  const {
    canvasInitialized,
    canvasRef,
    contextRef,
    overlayRef,
    overlayContextRef,
    containerRef,
  } = useInitCanvas(canvasSize.width, canvasSize.height);

  const { clearCanvas, drawNext } = useCellAnimation(
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
    <div className="grid justify-items-center gap-y-5">
      <GameCanvas
        canvasRef={canvasRef}
        overlayRef={overlayRef}
        containerRef={containerRef}
      />
      <Controls
        isPlaying={isPlaying}
        isPaused={isPaused}
        cellData={cellData}
        clearCanvas={clearCanvas}
        drawNext={drawNext}
      />
    </div>
  );
};

export default GameOfLife;
