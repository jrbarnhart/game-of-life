import React from "react";
import { useRef } from "react";
import { ControlRefs } from "./useControlRefs";
import { CellAnimation } from "./useCellAnimation";

const GameCanvas = ({
  canvasRef,
  overlayRef,
  containerRef,
  initialData,
  controlRefs,
  gridSize,
  cellAnimation,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  overlayRef: React.MutableRefObject<HTMLCanvasElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  initialData: Set<number>;
  controlRefs: ControlRefs;
  gridSize: React.MutableRefObject<{ width: number; height: number }>;
  cellAnimation: CellAnimation;
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
      const boundingRect = canvasRef.current.getBoundingClientRect();
      let mouseX = 0;
      let mouseY = 0;
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

      const isErasing = controlRefs.isErasing.current;
      const mirrorX = controlRefs.mirrorX.current;
      const mirrorY = controlRefs.mirrorY.current;
      const gridWidth = gridSize.current.width;
      const gridHeight = gridSize.current.height;
      const cellWidth = cellAnimation.cellSize.current.width;
      const cellHeight = cellAnimation.cellSize.current.height;
      const offX = cellAnimation.cellSize.current.offX;
      const offY = cellAnimation.cellSize.current.offY;
      const canvasX = mouseX - boundingRect.left - offX;
      const canvasY = mouseY - boundingRect.top - offY;
      const posX = Math.floor(canvasX / cellWidth);
      const posY = Math.floor(canvasY / cellHeight);
      const index = posY * gridSize.current.width + posX;

      if (index !== previousIndex.current) {
        if (isErasing) {
          initialData.delete(index);
          cellAnimation.drawInitialCell(index, {
            erase: true,
          });
        } else {
          initialData.add(index);
          cellAnimation.drawInitialCell(index);
        }
        if (mirrorX || mirrorY) {
          const rowIndex = Math.floor(index / gridWidth);
          const colIndex = index % gridWidth;
          const mirroredRowIndex = gridHeight - 1 - rowIndex;
          const mirroredColIndex = gridWidth - 1 - colIndex;
          if (mirrorX && mirrorY) {
            const mirroredIndexX = rowIndex * gridWidth + mirroredColIndex;
            const mirroredIndexY = mirroredRowIndex * gridWidth + colIndex;
            const mirroredIndexXY =
              mirroredRowIndex * gridWidth + mirroredColIndex;
            if (isErasing) {
              initialData.delete(mirroredIndexX);
              initialData.delete(mirroredIndexY);
              initialData.delete(mirroredIndexXY);
              cellAnimation.drawInitialCell(mirroredIndexX, {
                erase: true,
              });
              cellAnimation.drawInitialCell(mirroredIndexY, {
                erase: true,
              });
              cellAnimation.drawInitialCell(mirroredIndexXY, {
                erase: true,
              });
            } else {
              initialData.add(mirroredIndexX);
              initialData.add(mirroredIndexY);
              initialData.add(mirroredIndexXY);
              cellAnimation.drawInitialCell(mirroredIndexX);
              cellAnimation.drawInitialCell(mirroredIndexY);
              cellAnimation.drawInitialCell(mirroredIndexXY);
            }
          } else if (mirrorX) {
            const mirroredIndex = rowIndex * gridWidth + mirroredColIndex;
            if (isErasing) {
              initialData.delete(mirroredIndex);
              cellAnimation.drawInitialCell(mirroredIndex, {
                erase: true,
              });
            } else {
              initialData.add(mirroredIndex);
              cellAnimation.drawInitialCell(mirroredIndex);
            }
          } else if (mirrorY) {
            const mirroredIndex = mirroredRowIndex * gridWidth + colIndex;
            if (isErasing) {
              initialData.delete(mirroredIndex);
              cellAnimation.drawInitialCell(mirroredIndex, {
                erase: true,
              });
            } else {
              initialData.add(mirroredIndex);
              cellAnimation.drawInitialCell(mirroredIndex);
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
