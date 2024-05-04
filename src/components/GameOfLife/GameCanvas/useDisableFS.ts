import { useEffect } from "react";

const useDisableFS = ({ use }: { use: boolean }) => {
  useEffect(() => {
    if (!use) return;

    Object.defineProperty(Document.prototype, "fullscreenEnabled", {
      get: function () {
        return false;
      },
    });
  }, [use]);
};

export default useDisableFS;
