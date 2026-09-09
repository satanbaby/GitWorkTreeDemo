import { useEffect } from "react";
import type { ChapterDef } from "../registry/types";
import "./PrintView.css";

interface Props {
  chapters: ChapterDef[];
  /** Called when the browser's print dialog closes (saved or cancelled). */
  onDone(): void;
}

/**
 * Off-screen print sheet: every narration step of every chapter rendered as
 * its own 1920×1080 page, then handed to the browser's print dialog so the
 * user can "Save as PDF".
 *
 * Why off-screen instead of `display: none`: hidden elements do not lay out
 * at all. Parked at `left: -20000px` they lay out normally, and PrintView.css
 * freezes every chapter animation on its final frame so each page shows the
 * settled slide rather than a half-played one.
 *
 * Page geometry (16:9, zero bleed) is locked by `@page` in PrintView.css —
 * the user does not need to touch the dialog's margin settings.
 */
/** One frame for React to commit + the browser to lay out 74 pages. */
const SETTLE_MS = 600;

export function PrintView({ chapters, onDone }: Props) {
  useEffect(() => {
    window.addEventListener("afterprint", onDone);
    const timer = window.setTimeout(() => window.print(), SETTLE_MS);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("afterprint", onDone);
    };
  }, [onDone]);

  return (
    <div className="print-root" aria-hidden="true">
      {chapters.flatMap((c) =>
        c.narrations.map((_, s) => (
          <div className="print-page" key={`${c.id}-${s}`}>
            <div className="stage-frame print-frame">
              <div className="scene">
                <c.Component step={s} />
              </div>
            </div>
          </div>
        )),
      )}
    </div>
  );
}
