import { useRef } from "react";

export interface ControlRefs {
  isPlaying: React.MutableRefObject<boolean>;
  isPaused: React.MutableRefObject<boolean>;
  isDrawing: React.MutableRefObject<boolean>;
  isErasing: React.MutableRefObject<boolean>;
  mirrorX: React.MutableRefObject<boolean>;
  mirrorY: React.MutableRefObject<boolean>;
  aspect: React.MutableRefObject<{ x: number; y: number }>;
  resolution: React.MutableRefObject<{ x: number; y: number }>;
}

const useControlRefs = () => {
  const isPlaying = useRef(false);
  const isPaused = useRef(false);
  const isDrawing = useRef(false);
  const isErasing = useRef(false);
  const mirrorX = useRef(false);
  const mirrorY = useRef(false);
  const aspect = useRef({ x: 3, y: 2 });
  const resolution = useRef({ x: 45, y: 30 });

  const controlRefs: ControlRefs = {
    isPlaying,
    isPaused,
    isDrawing,
    isErasing,
    mirrorX,
    mirrorY,
    aspect,
    resolution,
  };

  return controlRefs;
};

export default useControlRefs;
