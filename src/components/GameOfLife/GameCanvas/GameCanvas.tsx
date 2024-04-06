import React from "react";

const GameCanvas = ({
  canvasRef,
  overlayRef,
  containerRef,
  initialData,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  overlayRef: React.MutableRefObject<HTMLCanvasElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  initialData: Set<number>;
}) => {
  const addInitialData = () => {
    // On click add the cell at the mouse location's index to initial data
    console.log(initialData);
  };

  return (
    <div ref={containerRef} className="relative">
      <canvas
        onClick={addInitialData}
        className="absolute top-0 bg-transparent z-10"
        ref={overlayRef}
      />
      <canvas className="bg-black absolute top-0" ref={canvasRef} />
    </div>
  );
};

export default GameCanvas;
