import GameOfLife from "./components/GameOfLife/GameOfLife";
import InfoHeader from "./components/InfoHeader/InfoHeader";

function App() {
  return (
    <>
      <main className="text-neutral-50 h-full w-full grid grid-rows-[repeat(2,_min-content)] justify-items-center gap-y-5">
        <InfoHeader />
        <GameOfLife />
      </main>
    </>
  );
}

export default App;
