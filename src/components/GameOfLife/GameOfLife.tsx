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
  const isPlaying = useRef<boolean>(false);
  const isPaused = useRef<boolean>(false);
  const isDrawing = useRef<boolean>(false);

  const cellData = useCellData({ width: gridWidth, height: gridHeight });

  const initialData = new Set<number>();

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
    isPaused,
    isDrawing
  );

  return (
    <div className="grid justify-items-center gap-y-5">
      <GameCanvas
        canvasRef={canvasRef}
        overlayRef={overlayRef}
        containerRef={containerRef}
        initialData={initialData}
        isDrawing={isDrawing}
        cellData={cellData}
      />
      <Controls
        isPlaying={isPlaying}
        isPaused={isPaused}
        isDrawing={isDrawing}
        cellData={cellData}
        clearCanvas={clearCanvas}
        drawNext={drawNext}
      />
    </div>
  );
};

export default GameOfLife;
