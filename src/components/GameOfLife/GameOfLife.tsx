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

  return <GameCanvas cellData={cellData} />;
};

export default GameOfLife;
