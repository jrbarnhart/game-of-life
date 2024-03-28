import GameCanvas from "./components/GameCanvas/GameCanvas";
import useCanvasSize from "./components/GameCanvas/useCanvasSize";
import useCellData from "./components/GameCanvas/useCellData";

function App() {
  const canvasSize = useCanvasSize(12);
  const cellData = useCellData(10);

  return (
    <>
      <h1>Game of Life</h1>
      <main className="text-neutral-50 h-full w-full">
        <GameCanvas width={canvasSize.width} height={canvasSize.height} />
      </main>
    </>
  );
}

export default App;
