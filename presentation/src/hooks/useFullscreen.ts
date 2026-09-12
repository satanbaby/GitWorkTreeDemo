import { useCallback, useEffect, useState } from "react";

/**
 * Keep React in sync with the browser's Fullscreen API. The presentation
 * enters fullscreen as a whole so fixed controls remain available.
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenSupported =
    typeof document !== "undefined" &&
    typeof document.documentElement.requestFullscreen === "function" &&
    typeof document.exitFullscreen === "function";

  useEffect(() => {
    if (!fullscreenSupported) return;

    const syncFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    syncFullscreenState();
    document.addEventListener("fullscreenchange", syncFullscreenState);
    document.addEventListener("fullscreenerror", syncFullscreenState);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
      document.removeEventListener("fullscreenerror", syncFullscreenState);
    };
  }, [fullscreenSupported]);

  const toggleFullscreen = useCallback(() => {
    if (!fullscreenSupported) return;

    void (async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        setIsFullscreen(document.fullscreenElement !== null);
        console.warn("Unable to toggle presentation fullscreen mode.", error);
      }
    })();
  }, [fullscreenSupported]);

  return { isFullscreen, fullscreenSupported, toggleFullscreen };
}
