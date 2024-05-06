import { useRef, useState } from "react";

export interface ControlRefs {
  showOnlyDraw: boolean;
  setShowOnlyDraw: React.Dispatch<React.SetStateAction<boolean>>;
  isPlaying: React.MutableRefObject<boolean>;
  isPaused: React.MutableRefObject<boolean>;
  isDrawing: React.MutableRefObject<boolean>;
  isErasing: React.MutableRefObject<boolean>;
  mirrorX: React.MutableRefObject<boolean>;
  mirrorY: React.MutableRefObject<boolean>;
  aspect: React.MutableRefObject<{ width: number; height: number }>;
  totalCells: React.MutableRefObject<number>;
}

const useControlRefs = () => {
  const [showOnlyDraw, setShowOnlyDraw] = useState<boolean>(false);
  const isPlaying = useRef(false);
  const isPaused = useRef(false);
  const isDrawing = useRef(false);
  const isErasing = useRef(false);
  const mirrorX = useRef(false);
  const mirrorY = useRef(false);
  const aspect = useRef({ width: 3, height: 2 });
  const totalCells = useRef(1350); // 45 x 30 default

  const controlRefs: ControlRefs = {
    showOnlyDraw,
    setShowOnlyDraw,
    isPlaying,
    isPaused,
    isDrawing,
    isErasing,
    mirrorX,
    mirrorY,
    aspect,
    totalCells,
  };

  return controlRefs;
};

export default useControlRefs;
