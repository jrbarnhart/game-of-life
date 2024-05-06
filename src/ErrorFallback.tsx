import { FallbackProps } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="h-dvh w-dvw grid items-center justify-items-center"
    >
      <div className="bg-neutral-50 rounded-lg p-2 grid max-w-[90dvw] max-h-[90dvh]">
        <p>Something went wrong while loading.</p>
        <p>
          If the error persists your browser may be unsupported or out of date.
        </p>
        <pre>
          <span className="text-lg text-red-500">Error: </span>
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
          {error.message}
        </pre>
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
