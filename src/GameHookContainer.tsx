import GameOfLife from "./components/GameOfLife/GameOfLife";
import useCellData from "./components/GameOfLife/GameCanvas/useCellData";
import useGridSize from "./components/GameOfLife/GameCanvas/useGridSize";
import { useEffect } from "react";

const GameHookContainer = () => {
  const gridSize = useGridSize();

  const cellData = useCellData(gridSize);

  const initialData = new Set<number>();

  useEffect(() => {
    throw new Error("Test");
  });

  return (
    <main className="text-neutral-50 h-full grid justify-items-center">
      <GameOfLife
        gridSize={gridSize}
        cellData={cellData}
        initialData={initialData}
      />
    </main>
  );
};

export default GameHookContainer;
