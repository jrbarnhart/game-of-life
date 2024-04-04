import Controls from "./components/Controls/Controls";
import GameCanvas from "./components/GameCanvas/GameCanvas";

function App() {
  return (
    <>
      <main className="text-neutral-50 h-full w-full">
        <h1>Game of Life</h1>
        <Controls />
        <GameCanvas />
      </main>
    </>
  );
}

export default App;
