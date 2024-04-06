import React from "react";

const GameCanvas = ({
  canvasRef,
  overlayRef,
  containerRef,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  overlayRef: React.MutableRefObject<HTMLCanvasElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  return (
    <div ref={containerRef} className="relative">
      <canvas className="absolute top-0 bg-transparent z-10" ref={overlayRef} />
      <canvas className="bg-black absolute top-0" ref={canvasRef} />
    </div>
  );
};

export default GameCanvas;
