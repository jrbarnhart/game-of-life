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
  isPlayingRef: React.MutableRefObject<boolean>;
  isPausedRef: React.MutableRefObject<boolean>;
  isDrawingRef: React.MutableRefObject<boolean>;
  isErasingRef: React.MutableRefObject<boolean>;
  mirrorXRef: React.MutableRefObject<boolean>;
  mirrorYRef: React.MutableRefObject<boolean>;
  aspectRef: React.MutableRefObject<{ width: number; height: number }>;
  totalCellsRef: React.MutableRefObject<number>;
}

const useControlState = () => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [showOnlyDraw, setShowOnlyDraw] = useState<boolean>(false);
  const [showPlay, setShowPlay] = useState<boolean>(true);
  const [highlightPlay, setHighlightPlay] = useState<boolean>(false);
  const [highlightPause, setHighlightPause] = useState<boolean>(false);
  const [highlightDraw, setHighlightDraw] = useState<boolean>(false);
  // Number state: -1 dim, 0 normal, 1 highlight
  const [highlightErase, setHighlightErase] = useState<number>(-1);
  const [highlightMirrorX, setHighlightMirrorX] = useState<number>(-1);
  const [highlightMirrorY, setHighlightMirrorY] = useState<number>(-1);

  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const isDrawingRef = useRef(false);
  const isErasingRef = useRef(false);
  const mirrorXRef = useRef(false);
  const mirrorYRef = useRef(false);
  const aspectRef = useRef({ width: 3, height: 2 });
  const totalCellsRef = useRef(1350); // 45 x 30 default

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
    isPlayingRef,
    isPausedRef,
    isDrawingRef,
    isErasingRef,
    mirrorXRef,
    mirrorYRef,
    aspectRef,
    totalCellsRef,
  };

  return controlState;
};

export default useControlState;
