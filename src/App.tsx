import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import GameHookContainer from "./components/GameOfLife/GameHookContainer";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <GameHookContainer />
    </ErrorBoundary>
  );
}

export default App;
