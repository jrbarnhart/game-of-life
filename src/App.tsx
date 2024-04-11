import GameOfLife from "./components/GameOfLife/GameOfLife";

function App() {
  return (
    <>
      <main className="text-neutral-50 h-full w-full grid grid-rows-[repeat(2,_min-content)] justify-items-center gap-y-5">
        <h1 className="font-bold text-4xl pt-4">Game of Life</h1>
        <GameOfLife />
      </main>
    </>
  );
}

export default App;
