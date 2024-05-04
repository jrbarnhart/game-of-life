import { useRef } from "react";

export const GRID_SIZES = {
  sm: { x: 30, y: 20 },
  md: { x: 75, y: 50 },
  lg: { x: 150, y: 100 },
  xl: { x: 300, y: 200 },
};

export interface GridSize {
  width: number;
  height: number;
}

const useGridSize = () => {
  const gridSize = useRef<GridSize>({
    width: GRID_SIZES.sm.x,
    height: GRID_SIZES.sm.y,
  });

  return gridSize;
};

export default useGridSize;
