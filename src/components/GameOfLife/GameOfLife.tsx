import GameCanvas from "./GameCanvas/GameCanvas";
import useCanvasSize from "./GameCanvas/useCanvasSize";
import useCellData from "./GameCanvas/useCellData";

const GameOfLife = ({
  gridWidth,
  gridHeight,
}: {
  gridWidth: number;
  gridHeight: number;
}) => {
  const canvasSize = useCanvasSize(12);

  const cellData = useCellData({ width: gridWidth, height: gridHeight });

  return (
    <GameCanvas
      gridWidth={gridWidth}
      gridHeight={gridHeight}
      canvasSize={canvasSize}
      cellData={cellData}
    />
  );
};

export default GameOfLife;
