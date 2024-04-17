import GameOfLife from "./components/GameOfLife/GameOfLife";
import InfoHeader from "./components/InfoHeader/InfoHeader";

function App() {
  return (
    <>
      <main className="text-neutral-50 h-full w-full grid grid-rows-[repeat(2,_min-content)] justify-items-center gap-y-5">
        <InfoHeader link="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" />
        <GameOfLife />
      </main>
    </>
  );
}

export default App;
