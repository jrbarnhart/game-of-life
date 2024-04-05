import GameCanvas from "./GameCanvas/GameCanvas";

const GameOfLife = ({
  gridWidth,
  gridHeight,
}: {
  gridWidth: number;
  gridHeight: number;
}) => {
  return <GameCanvas gridWidth={gridWidth} gridHeight={gridHeight} />;
};

export default GameOfLife;
