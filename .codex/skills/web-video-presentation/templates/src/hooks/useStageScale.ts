import { useEffect, useState } from "react";

function calculateScale(
  initialDpr: number,
  baseW: number,
  baseH: number,
  marginX: number,
  marginY: number,
) {
  const relativeBrowserZoom = (window.devicePixelRatio || 1) / initialDpr;
  const viewportW = window.innerWidth * relativeBrowserZoom;
  const viewportH = window.innerHeight * relativeBrowserZoom;
  const usefulW = Math.max(320, viewportW - marginX * 2);
  const usefulH = Math.max(180, viewportH - marginY * 2);

  return Math.min(usefulW / baseW, usefulH / baseH);
}

/**
 * Compute the scale needed to fit a 1920x1080 stage inside the current
 * viewport, leaving `marginX` / `marginY` of breathing room around it.
 *
 * Browser page zoom changes both `innerWidth` / `innerHeight` and
 * `devicePixelRatio` in opposite directions. Normalising the viewport back to
 * the DPR from when the page loaded keeps fit-to-window separate from browser
 * zoom: resizing the window still refits the stage, while Ctrl +/- is free to
 * enlarge or shrink the rendered result (and the margins) normally.
 */
export function useStageScale(
  baseW = 1920,
  baseH = 1080,
  marginX = 80,
  marginY = 100,
) {
  const [initialDpr] = useState(() => window.devicePixelRatio || 1);
  const [scale, setScale] = useState(() =>
    calculateScale(initialDpr, baseW, baseH, marginX, marginY),
  );

  useEffect(() => {
    function update() {
      setScale(calculateScale(initialDpr, baseW, baseH, marginX, marginY));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [initialDpr, baseW, baseH, marginX, marginY]);

  return scale;
}
