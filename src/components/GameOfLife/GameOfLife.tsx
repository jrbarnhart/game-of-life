import Controls from "../Controls/Controls";
import GameCanvas from "./GameCanvas/GameCanvas";
import useCellData from "./GameCanvas/useCellData";

const GameOfLife = ({
  gridWidth,
  gridHeight,
}: {
  gridWidth: number;
  gridHeight: number;
}) => {
  const cellData = useCellData({ width: gridWidth, height: gridHeight });

  return (
    <div className="grid justify-items-center gap-y-5">
      <GameCanvas cellData={cellData} />
      <Controls />
    </div>
  );
};

export default GameOfLife;
