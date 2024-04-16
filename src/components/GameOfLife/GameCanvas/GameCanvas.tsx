import React from "react";
import { useRef } from "react";
import { ControlRefs } from "./useControlRefs";
import { CanvasStateInterface } from "./useCanvasState";
import { CellAnimation } from "./useCellAnimation";

const GameCanvas = ({
  canvasRef,
  overlayRef,
  containerRef,
  initialData,
  controlRefs,
  canvasState,
  cellAnimation,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  overlayRef: React.MutableRefObject<HTMLCanvasElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  initialData: Set<number>;
  controlRefs: ControlRefs;
  canvasState: CanvasStateInterface;
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

      const cellWidth = cellAnimation.cellSize.current.width;
      const cellHeight = cellAnimation.cellSize.current.height;
      const canvasX = mouseX - boundingRect.left;
      const canvasY = mouseY - boundingRect.top;
      const gridX = Math.floor(canvasX / cellWidth);
      const gridY = Math.floor(canvasY / cellHeight);
      const index = gridY * canvasState.gridSize.current.width + gridX;

      if (index !== previousIndex.current) {
        if (controlRefs.isErasing.current) {
          initialData.delete(index);
          cellAnimation.drawInitialCell(index, {
            erase: true,
          });
        } else {
          initialData.add(index);
          cellAnimation.drawInitialCell(index);
        }
        if (controlRefs.mirrorX.current || controlRefs.mirrorY.current) {
          const rowIndex = Math.floor(
            index / canvasState.gridSize.current.width
          );
          const colIndex = index % canvasState.gridSize.current.width;
          const mirroredRowIndex =
            canvasState.gridSize.current.height - 1 - rowIndex;
          const mirroredColIndex =
            canvasState.gridSize.current.width - 1 - colIndex;
          if (controlRefs.mirrorX.current && controlRefs.mirrorY.current) {
            const mirroredIndexX =
              rowIndex * canvasState.gridSize.current.width + mirroredColIndex;
            const mirroredIndexY =
              mirroredRowIndex * canvasState.gridSize.current.width + colIndex;
            const mirroredIndexXY =
              mirroredRowIndex * canvasState.gridSize.current.width +
              mirroredColIndex;
            if (controlRefs.isErasing.current) {
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
          } else if (controlRefs.mirrorX.current) {
            const mirroredIndex =
              rowIndex * canvasState.gridSize.current.width + mirroredColIndex;
            if (controlRefs.isErasing.current) {
              initialData.delete(mirroredIndex);
              cellAnimation.drawInitialCell(mirroredIndex, {
                erase: true,
              });
            } else {
              initialData.add(mirroredIndex);
              cellAnimation.drawInitialCell(mirroredIndex);
            }
          } else if (controlRefs.mirrorY.current) {
            const mirroredIndex =
              mirroredRowIndex * canvasState.gridSize.current.width + colIndex;
            if (controlRefs.isErasing.current) {
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
