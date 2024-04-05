import Controls from "./components/Controls/Controls";
import GameCanvas from "./components/GameCanvas/GameCanvas";

function App() {
  return (
    <>
      <main className="text-neutral-50 h-full w-full grid grid-rows-[repeat(3,_min-content)] justify-items-center gap-y-5">
        <h1 className="font-bold text-4xl pt-4">Game of Life</h1>
        <GameCanvas gridWidth={12} gridHeight={8} />
        <Controls />
      </main>
    </>
  );
}

export default App;
