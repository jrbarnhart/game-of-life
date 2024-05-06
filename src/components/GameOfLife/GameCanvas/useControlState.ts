import { useRef, useState } from "react";

export interface ControlState {
  fullscreen: boolean;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  showOnlyDraw: boolean;
  setShowOnlyDraw: React.Dispatch<React.SetStateAction<boolean>>;
  showPlay: boolean;
  setShowPlay: React.Dispatch<React.SetStateAction<boolean>>;
  highlightPlay: boolean;
  setHighlightPlay: React.Dispatch<React.SetStateAction<boolean>>;
  highlightPause: boolean;
  setHighlightPause: React.Dispatch<React.SetStateAction<boolean>>;
  highlightDraw: boolean;
  setHighlightDraw: React.Dispatch<React.SetStateAction<boolean>>;
  highlightErase: number;
  setHighlightErase: React.Dispatch<React.SetStateAction<number>>;
  highlightMirrorX: number;
  setHighlightMirrorX: React.Dispatch<React.SetStateAction<number>>;
  highlightMirrorY: number;
  setHighlightMirrorY: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: React.MutableRefObject<boolean>;
  isPaused: React.MutableRefObject<boolean>;
  isDrawing: React.MutableRefObject<boolean>;
  isErasing: React.MutableRefObject<boolean>;
  mirrorX: React.MutableRefObject<boolean>;
  mirrorY: React.MutableRefObject<boolean>;
  aspect: React.MutableRefObject<{ width: number; height: number }>;
  totalCells: React.MutableRefObject<number>;
}

const useControlState = () => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [showOnlyDraw, setShowOnlyDraw] = useState<boolean>(false);
  const [showPlay, setShowPlay] = useState<boolean>(false);
  const [highlightPlay, setHighlightPlay] = useState<boolean>(false);
  const [highlightPause, setHighlightPause] = useState<boolean>(false);
  const [highlightDraw, setHighlightDraw] = useState<boolean>(false);
  // Number state: -1 dim, 0 normal, 1 highlight
  const [highlightErase, setHighlightErase] = useState<number>(-1);
  const [highlightMirrorX, setHighlightMirrorX] = useState<number>(-1);
  const [highlightMirrorY, setHighlightMirrorY] = useState<number>(-1);

  const isPlaying = useRef(false);
  const isPaused = useRef(false);
  const isDrawing = useRef(false);
  const isErasing = useRef(false);
  const mirrorX = useRef(false);
  const mirrorY = useRef(false);
  const aspect = useRef({ width: 3, height: 2 });
  const totalCells = useRef(1350); // 45 x 30 default

  const controlState: ControlState = {
    fullscreen,
    setFullscreen,
    showOnlyDraw,
    setShowOnlyDraw,
    showPlay,
    setShowPlay,
    highlightPlay,
    setHighlightPlay,
    highlightPause,
    setHighlightPause,
    highlightDraw,
    setHighlightDraw,
    highlightErase,
    setHighlightErase,
    highlightMirrorX,
    setHighlightMirrorX,
    highlightMirrorY,
    setHighlightMirrorY,
    isPlaying,
    isPaused,
    isDrawing,
    isErasing,
    mirrorX,
    mirrorY,
    aspect,
    totalCells,
  };

  return controlState;
};

export default useControlState;
