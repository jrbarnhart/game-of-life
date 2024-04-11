import { useRef } from "react";

export interface ControlRefs {
  isPlaying: React.MutableRefObject<boolean>;
  isPaused: React.MutableRefObject<boolean>;
  isDrawing: React.MutableRefObject<boolean>;
  isErasing: React.MutableRefObject<boolean>;
  mirrorX: React.MutableRefObject<boolean>;
  mirrorY: React.MutableRefObject<boolean>;
}

const useControlRefs = () => {
  const isPlaying = useRef<boolean>(false);
  const isPaused = useRef<boolean>(false);
  const isDrawing = useRef<boolean>(false);
  const isErasing = useRef<boolean>(false);
  const mirrorX = useRef<boolean>(false);
  const mirrorY = useRef<boolean>(false);

  const controlRefs: ControlRefs = {
    isPlaying,
    isPaused,
    isDrawing,
    isErasing,
    mirrorX,
    mirrorY,
  };

  return controlRefs;
};

export default useControlRefs;
