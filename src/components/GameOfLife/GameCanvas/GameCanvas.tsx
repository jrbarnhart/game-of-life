import React from "react";
import { useRef } from "react";
import { CellData } from "./useCellData";
import { ControlRefs } from "./useControlRefs";

const GameCanvas = ({
  canvasRef,
  overlayRef,
  containerRef,
  initialData,
  controlRefs,
  cellData,
  drawInitialCell,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  overlayRef: React.MutableRefObject<HTMLCanvasElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  initialData: Set<number>;
  controlRefs: ControlRefs;
  cellData: CellData;
  drawInitialCell: (
    cellIndex: number,
    cellWidth: number,
    cellHeight: number,
    options?: { erase: boolean } | undefined
  ) => void;
}) => {
  const previousIndex = useRef<number | null>(null);
  const isMouseOrTouchDown = useRef<boolean>(false);

  const handleMouseOrTouch = (event: React.MouseEvent | React.TouchEvent) => {
    if (
      controlRefs.isDrawing.current &&
      canvasRef.current &&
      isMouseOrTouchDown.current
    ) {
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
          mouseX >= boundingRect.right ||
          mouseY < boundingRect.top ||
          mouseY > boundingRect.bottom
        ) {
          return;
        }
      }

      const cellWidth =
        canvasRef.current.width / cellData.gridSize.current.width;
      const cellHeight =
        canvasRef.current.height / cellData.gridSize.current.height;
      const canvasX = mouseX - boundingRect.left;
      const canvasY = mouseY - boundingRect.top;
      const gridX = Math.floor(canvasX / cellWidth);
      const gridY = Math.floor(canvasY / cellHeight);
      const index = gridY * cellData.gridSize.current.width + gridX;

      if (index !== previousIndex.current) {
        if (controlRefs.isErasing.current) {
          initialData.delete(index);
          drawInitialCell(index, cellWidth, cellHeight, { erase: true });
        } else {
          initialData.add(index);
          drawInitialCell(index, cellWidth, cellHeight);
        }
        if (controlRefs.mirrorX.current || controlRefs.mirrorY.current) {
          const rowIndex = Math.floor(index / cellData.gridSize.current.width);
          const colIndex = index % cellData.gridSize.current.width;
          const mirroredRowIndex =
            cellData.gridSize.current.height - 1 - rowIndex;
          const mirroredColIndex =
            cellData.gridSize.current.width - 1 - colIndex;
          if (controlRefs.mirrorX.current && controlRefs.mirrorY.current) {
            const mirroredIndexX =
              rowIndex * cellData.gridSize.current.width + mirroredColIndex;
            const mirroredIndexY =
              mirroredRowIndex * cellData.gridSize.current.width + colIndex;
            const mirroredIndexXY =
              mirroredRowIndex * cellData.gridSize.current.width +
              mirroredColIndex;
            if (controlRefs.isErasing.current) {
              initialData.delete(mirroredIndexX);
              initialData.delete(mirroredIndexY);
              initialData.delete(mirroredIndexXY);
              drawInitialCell(mirroredIndexX, cellWidth, cellHeight, {
                erase: true,
              });
              drawInitialCell(mirroredIndexY, cellWidth, cellHeight, {
                erase: true,
              });
              drawInitialCell(mirroredIndexXY, cellWidth, cellHeight, {
                erase: true,
              });
            } else {
              initialData.add(mirroredIndexX);
              initialData.add(mirroredIndexY);
              initialData.add(mirroredIndexXY);
              drawInitialCell(mirroredIndexX, cellWidth, cellHeight);
              drawInitialCell(mirroredIndexY, cellWidth, cellHeight);
              drawInitialCell(mirroredIndexXY, cellWidth, cellHeight);
            }
          } else if (controlRefs.mirrorX.current) {
            const mirroredIndex =
              rowIndex * cellData.gridSize.current.width + mirroredColIndex;
            if (controlRefs.isErasing.current) {
              initialData.delete(mirroredIndex);
              drawInitialCell(mirroredIndex, cellWidth, cellHeight, {
                erase: true,
              });
            } else {
              initialData.add(mirroredIndex);
              drawInitialCell(mirroredIndex, cellWidth, cellHeight);
            }
          } else if (controlRefs.mirrorY.current) {
            const mirroredIndex =
              mirroredRowIndex * cellData.gridSize.current.width + colIndex;
            if (controlRefs.isErasing.current) {
              initialData.delete(mirroredIndex);
              drawInitialCell(mirroredIndex, cellWidth, cellHeight, {
                erase: true,
              });
            } else {
              initialData.add(mirroredIndex);
              drawInitialCell(mirroredIndex, cellWidth, cellHeight);
            }
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
