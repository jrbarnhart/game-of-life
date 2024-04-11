import { useRef } from "react";

export interface ControlRefs {
  isPlaying: React.MutableRefObject<boolean>;
  isPaused: React.MutableRefObject<boolean>;
  isDrawing: React.MutableRefObject<boolean>;
  isErasing: React.MutableRefObject<boolean>;
  mirrorX: React.MutableRefObject<boolean>;
  mirrorY: React.MutableRefObject<boolean>;
  aspect: React.MutableRefObject<{ width: number; height: number }>;
  resolution: React.MutableRefObject<{ width: number; height: number }>;
}

const useControlRefs = () => {
  const isPlaying = useRef(false);
  const isPaused = useRef(false);
  const isDrawing = useRef(false);
  const isErasing = useRef(false);
  const mirrorX = useRef(false);
  const mirrorY = useRef(false);
  const aspect = useRef({ width: 3, height: 2 });
  const resolution = useRef({ width: 45, height: 30 });

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
