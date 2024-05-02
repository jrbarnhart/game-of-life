import GameOfLife from "./components/GameOfLife/GameOfLife";
import InfoHeader from "./components/InfoHeader/InfoHeader";

function App() {
  return (
    <>
      <main className="text-neutral-50 h-full w-full grid justify-items-center items-center">
        <div className="absolute top-0 left-0 z-10 w-full">
          <InfoHeader link="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" />
        </div>
        <GameOfLife />
      </main>
    </>
  );
}

export default App;
