import GameOfLife from "./GameOfLife";
import useCellData from "./GameCanvas/useCellData";
import useGridSize from "./GameCanvas/useGridSize";

const GameHookContainer = () => {
  const gridSize = useGridSize();

  const cellData = useCellData(gridSize);

  const initialData = new Set<number>();

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
