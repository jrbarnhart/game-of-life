import React from "react";
import { useRef } from "react";
import { CellData } from "./useCellData";

const GameCanvas = ({
  canvasRef,
  overlayRef,
  containerRef,
  initialData,
  isDrawing,
  cellData,
  drawOverlayCell,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  overlayRef: React.MutableRefObject<HTMLCanvasElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  initialData: Set<number>;
  isDrawing: React.MutableRefObject<boolean>;
  cellData: CellData;
  drawOverlayCell: (
    cellIndex: number,
    cellWidth: number,
    cellHeight: number
  ) => void;
}) => {
  const previousIndex = useRef<number | null>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDrawing.current && canvasRef.current && event.buttons === 1) {
      // On click add the cell at the mouse location's index to initial data
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const cellWidth = canvasRef.current.width / cellData.gridSize.width;
      const cellHeight = canvasRef.current.height / cellData.gridSize.height;
      const boundingRect = canvasRef.current.getBoundingClientRect();
      const canvasX = mouseX - boundingRect.left;
      const canvasY = mouseY - boundingRect.top;
      const gridX = Math.floor(canvasX / cellWidth);
      const gridY = Math.floor(canvasY / cellHeight);
      const index = gridY * cellData.gridSize.width + gridX;

      if (index !== previousIndex.current) {
        initialData.add(index);
        drawOverlayCell(index, cellWidth, cellHeight);
      }
    }
  };

  const handleMouseUp = () => {
    previousIndex.current = null;
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (isDrawing.current && canvasRef.current && event.buttons === 1) {
      // On click add the cell at the mouse location's index to initial data
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const cellWidth = canvasRef.current.width / cellData.gridSize.width;
      const cellHeight = canvasRef.current.height / cellData.gridSize.height;
      const boundingRect = canvasRef.current.getBoundingClientRect();
      const canvasX = mouseX - boundingRect.left;
      const canvasY = mouseY - boundingRect.top;
      const gridX = Math.floor(canvasX / cellWidth);
      const gridY = Math.floor(canvasY / cellHeight);
      const index = gridY * cellData.gridSize.width + gridX;
      initialData.add(index);
      drawOverlayCell(index, cellWidth, cellHeight);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <canvas
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bg-transparent z-10"
        ref={overlayRef}
      />
      <canvas className="bg-black absolute top-0" ref={canvasRef} />
    </div>
  );
};

export default GameCanvas;
