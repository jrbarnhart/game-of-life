import { useRef } from "react";

const useControlState = () => {
  const isPlaying = useRef<boolean>(false);
  const isPaused = useRef<boolean>(false);
  const isDrawing = useRef<boolean>(false);
  const isErasing = useRef<boolean>(false);
  const mirrorX = useRef<boolean>(false);
  const mirrorY = useRef<boolean>(false);

  const controlState = {
    isPlaying,
    isPaused,
    isDrawing,
    isErasing,
    mirrorX,
    mirrorY,
  };

  return controlState;
};

export default useControlState;
