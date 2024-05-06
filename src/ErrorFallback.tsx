import { FallbackProps } from "react-error-boundary";

function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="h-dvh w-dvw grid items-center justify-items-center"
    >
      <div className="bg-neutral-50 rounded-lg p-2 grid max-w-[90dvw] max-h-[90dvh]">
        <p className="p-3">Something went wrong while loading the page.</p>
        <button
          onClick={resetErrorBoundary}
          className="w-min text-nowrap justify-self-center border-2 rounded-md border-black p-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;
