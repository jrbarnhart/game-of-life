import { useEffect } from "react";

const useDisableFS = ({ use }: { use: boolean }) => {
  useEffect(() => {
    if (!use) return;
    Object.defineProperty(Document.prototype, "fullscreenEnabled", {
      get: function () {
        return false;
      },
    });

    Element.prototype.requestFullscreen = function () {
      const err = new Error(
        "Sorry, your browser does not support the fullscreen API."
      );
      return Promise.reject(err);
    };
  }, [use]);
};

export default useDisableFS;
