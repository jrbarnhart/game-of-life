import React from "react";
import { useRef } from "react";
import { CellData } from "./useCellData";

const GameCanvas = ({
  canvasRef,
  overlayRef,
  containerRef,
  initialData,
  isDrawing,
  mirrorX,
  mirrorY,
  cellData,
  drawOverlayCell,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  overlayRef: React.MutableRefObject<HTMLCanvasElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  initialData: Set<number>;
  isDrawing: React.MutableRefObject<boolean>;
  mirrorX: React.MutableRefObject<boolean>;
  mirrorY: React.MutableRefObject<boolean>;
  cellData: CellData;
  drawOverlayCell: (
    cellIndex: number,
    cellWidth: number,
    cellHeight: number
  ) => void;
}) => {
  const previousIndex = useRef<number | null>(null);
  const isMouseOrTouchDown = useRef<boolean>(false);

  const handleMouseOrTouch = (event: React.MouseEvent | React.TouchEvent) => {
    if (isDrawing.current && canvasRef.current && isMouseOrTouchDown.current) {
      // On click add the cell at the mouse location's index to initial data
      let mouseX = 0;
      let mouseY = 0;
      const boundingRect = canvasRef.current.getBoundingClientRect();

      if (event.nativeEvent instanceof MouseEvent && `clientX` in event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
      } else if (
        event.nativeEvent instanceof TouchEvent &&
        `touches` in event
      ) {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
        if (
          mouseX < boundingRect.left ||
          mouseX > boundingRect.right ||
          mouseY < boundingRect.top ||
          mouseY > boundingRect.bottom
        ) {
          return;
        }
      }

      const cellWidth = canvasRef.current.width / cellData.gridSize.width;
      const cellHeight = canvasRef.current.height / cellData.gridSize.height;
      const canvasX = mouseX - boundingRect.left;
      const canvasY = mouseY - boundingRect.top;
      const gridX = Math.floor(canvasX / cellWidth);
      const gridY = Math.floor(canvasY / cellHeight);
      const index = gridY * cellData.gridSize.width + gridX;

      if (index !== previousIndex.current) {
        initialData.add(index);
        drawOverlayCell(index, cellWidth, cellHeight);
        if (mirrorX.current || mirrorY.current) {
          const rowIndex = Math.floor(index / cellData.gridSize.width);
          const colIndex = index % cellData.gridSize.width;
          const mirroredRowIndex = cellData.gridSize.height - 1 - rowIndex;
          const mirroredColIndex = cellData.gridSize.width - 1 - colIndex;
          if (mirrorX.current && mirrorY.current) {
            const mirroredIndexX =
              rowIndex * cellData.gridSize.width + mirroredColIndex;
            const mirroredIndexY =
              mirroredRowIndex * cellData.gridSize.width + colIndex;
            const mirroredIndexXY =
              mirroredRowIndex * cellData.gridSize.width + mirroredColIndex;
            initialData.add(mirroredIndexX);
            initialData.add(mirroredIndexY);
            initialData.add(mirroredIndexXY);
            drawOverlayCell(mirroredIndexX, cellWidth, cellHeight);
            drawOverlayCell(mirroredIndexY, cellWidth, cellHeight);
            drawOverlayCell(mirroredIndexXY, cellWidth, cellHeight);
          } else if (mirrorX.current) {
            const mirroredIndex =
              rowIndex * cellData.gridSize.width + mirroredColIndex;
            initialData.add(mirroredIndex);
            drawOverlayCell(mirroredIndex, cellWidth, cellHeight);
          } else if (mirrorY.current) {
            const mirroredIndex =
              mirroredRowIndex * cellData.gridSize.width + colIndex;
            initialData.add(mirroredIndex);
            drawOverlayCell(mirroredIndex, cellWidth, cellHeight);
          }
        }
      }
    }
  };

  const handleMouseOrTouchStart = (
    event: React.MouseEvent | React.TouchEvent
  ) => {
    isMouseOrTouchDown.current = true;
    handleMouseOrTouch(event);

    if (event.nativeEvent instanceof MouseEvent && `clientX` in event) {
      window.addEventListener("mouseup", handleMouseUpOrTouchEnd);
    } else if (event.nativeEvent instanceof TouchEvent && `touches` in event) {
      window.addEventListener("touchend", handleMouseUpOrTouchEnd);
    }
  };

  const handleMouseUpOrTouchEnd = () => {
    previousIndex.current = null;
    isMouseOrTouchDown.current = false;
  };

  return (
    <div ref={containerRef} className="relative">
      <canvas
        onMouseDown={handleMouseOrTouchStart}
        onMouseMove={handleMouseOrTouch}
        onTouchStart={handleMouseOrTouchStart}
        onTouchMove={handleMouseOrTouch}
        className="absolute top-0 bg-transparent z-10 touch-none"
        ref={overlayRef}
      />
      <canvas className="bg-black absolute top-0 touch-none" ref={canvasRef} />
    </div>
  );
};

export default GameCanvas;
