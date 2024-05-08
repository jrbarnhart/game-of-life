import { useRef } from "react";

export const GRID_SIZES = [
  { x: 16, y: 9 },
  { x: 32, y: 18 },
  { x: 128, y: 72 },
  { x: 192, y: 108 },
];

export interface GridSize {
  width: number;
  height: number;
}

const useGridSize = () => {
  const gridSize = useRef<GridSize>({
    width: GRID_SIZES[0].x,
    height: GRID_SIZES[0].y,
  });

  return gridSize;
};

export default useGridSize;
