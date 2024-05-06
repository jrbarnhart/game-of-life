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
      if (screen.orientation.type === "portrait-primary") {
        setOutdatedBrowserFS(false);
      } else if (
        !document.fullscreenEnabled &&
        screen.orientation.type === "landscape-primary"
      ) {
        setOutdatedBrowserFS(true);
      }
    };

    const handleResize = () => {
      if (window.screen.availHeight > window.screen.availWidth) {
        setOutdatedBrowserFS(false);
      }
    };

    if (typeof screen.orientation !== "undefined") {
      screen.orientation.addEventListener("change", handleOrientationChange);
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof screen.orientation !== "undefined") {
        screen.orientation.removeEventListener(
          "change",
          handleOrientationChange
        );
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Used to disable fullscreen for testing purposes
  useDisableFS({ use: debugNoFs });

  return [outdatedBrowserFS, setOutdatedBrowserFS];
};

export default usePseudoFS;
