import Controls from "./components/Controls/Controls";
import GameCanvas from "./components/GameCanvas/GameCanvas";

function App() {
  return (
    <>
      <h1>Game of Life</h1>
      <main className="text-neutral-50 h-full w-full">
        <Controls />
        <GameCanvas />
      </main>
    </>
  );
}

export default App;
