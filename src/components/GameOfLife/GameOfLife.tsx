import { useRef } from "react";
import Controls from "./Controls/Controls";
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
  const isPlaying = useRef<boolean>(false);
  const isPaused = useRef<boolean>(false);

  return (
    <div className="grid justify-items-center gap-y-5">
      <GameCanvas
        cellData={cellData}
        isPlaying={isPlaying}
        isPaused={isPaused}
      />
      <Controls isPlaying={isPlaying} isPaused={isPaused} />
    </div>
  );
};

export default GameOfLife;
