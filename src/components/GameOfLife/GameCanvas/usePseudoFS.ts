import { useState, useEffect } from "react";
import useDisableFS from "./useDisableFS";

const usePseudoFS = ({
  debugNoFs = false,
}: {
  debugNoFs: boolean;
}): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [outdatedBrowserFS, setOutdatedBrowserFS] = useState<boolean>(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (
        screen.orientation.type === "portrait-primary" ||
        screen.orientation.type === "portrait-secondary"
      ) {
        setOutdatedBrowserFS(false);
      }
    };

    screen.orientation.addEventListener("change", handleOrientationChange);

    return () => {
      screen.orientation.removeEventListener("change", handleOrientationChange);
    };
  }, []);

  // Used to disable fullscreen for testing purposes
  useDisableFS({ use: debugNoFs });

  return [outdatedBrowserFS, setOutdatedBrowserFS];
};

export default usePseudoFS;
