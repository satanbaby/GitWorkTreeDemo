import type { CSSProperties, ReactNode } from "react";
import { useStageScale } from "../hooks/useStageScale";
import "./Stage.css";

interface Props {
  onAdvance(): void;
  onBack(): void;
  canGoBack: boolean;
  canGoForward: boolean;
  showNavigation: boolean;
  children: ReactNode;
}

interface NavigationButtonProps {
  direction: "back" | "forward";
  onNavigate(): void;
}

function NavigationButton({
  direction,
  onNavigate,
}: NavigationButtonProps) {
  const isBack = direction === "back";

  return (
    <button
      className={`stage-nav stage-nav--${direction}`}
      type="button"
      aria-label={isBack ? "上一段" : "下一段"}
      title={isBack ? "上一段" : "下一段"}
      onKeyDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onNavigate();
      }}
    >
      <span className="stage-nav-face" aria-hidden="true">
        <svg
          className="stage-nav-arrow"
          viewBox="0 0 64 64"
          focusable="false"
        >
          <path d="M39 15 22 32l17 17M23 32h25" />
        </svg>
      </span>
    </button>
  );
}

/**
 * The 16:9 stage. Click anywhere except interactive children = advance.
 *
 * Layout structure (3 nested elements):
 *   .app-shell    ← full viewport, flex-centers the fitter
 *   .stage-fitter ← sized to ACTUAL VISIBLE px (1920*scale × 1080*scale)
 *                   so the layout system honestly sees what's on screen
 *                   and centers it bulletproof on every viewport / DPR.
 *   .stage-frame  ← raw 1920×1080 box, layout-scaled with CSS zoom into the
 *                   fitter. Using zoom avoids compositor resampling blur on
 *                   screenshots caused by an ancestor transform: scale().
 *
 * Surface colors come from the active theme's CSS custom properties
 * (var(--shell), var(--surface)) — see themes/<id>/tokens.css.
 */
export function Stage({
  onAdvance,
  onBack,
  canGoBack,
  canGoForward,
  showNavigation,
  children,
}: Props) {
  const scale = useStageScale();
  const fitterStyle: CSSProperties = {
    width: 1920 * scale,
    height: 1080 * scale,
  };
  const frameStyle: CSSProperties = {
    zoom: scale,
  };
  return (
    <div className="app-shell">
      <div className="stage-fitter" style={fitterStyle}>
        <div
          className="stage-frame"
          style={frameStyle}
          onClick={(e) => {
            const t = e.target as HTMLElement;
            if (t.closest("button, a, input, [data-no-advance]")) return;
            onAdvance();
          }}
        >
          {children}
          {showNavigation && canGoBack && (
            <NavigationButton direction="back" onNavigate={onBack} />
          )}
          {showNavigation && canGoForward && (
            <NavigationButton direction="forward" onNavigate={onAdvance} />
          )}
        </div>
      </div>
    </div>
  );
}
