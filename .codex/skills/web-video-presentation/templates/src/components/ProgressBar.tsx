import { useEffect, useRef } from "react";
import type { ChapterDef } from "../registry/types";
import "./ProgressBar.css";

interface Props {
  chapters: ChapterDef[];
  cursor: { chapter: number; step: number };
  onJumpChapter(idx: number, step?: number): void;
  /**
   * Optional GitHub link rendered next to the bar; reveals/hides together
   * with the chapter list on hover. Pass `null` to hide.
   */
  githubUrl?: string | null;
}

const DEFAULT_GITHUB_URL =
  "https://github.com/ConardLi/garden-skills";

/**
 * Hidden-on-hover progress bar, fixed to the bottom of the viewport.
 * Click a story marker or footprint to jump.
 *
 * Width is content-adaptive and leaves room for the source link; if total
 * chapters (or an active chapter's step pips) overflow, the chapter track
 * scrolls horizontally instead of squeezing items. The active chapter is
 * auto-scrolled into view on chapter change.
 *
 * A GitHub link sits to the right of the viewport, sharing the same hover
 * trigger so it appears/disappears in sync with the bar.
 */
export function ProgressBar({
  chapters,
  cursor,
  onJumpChapter,
  githubUrl = DEFAULT_GITHUB_URL,
}: Props) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [cursor.chapter]);

  return (
    <div className="pb-hover" data-no-advance>
      <nav className="pb" aria-label="簡報章節與段落進度">
        <div className="pb-overview">
          <button
            className="pb-overview-trigger"
            type="button"
            aria-label="預覽全部章節"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="5" cy="6" r="1.6" />
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="5" cy="18" r="1.6" />
              <path d="M9 6h10M9 12h10M9 18h10" />
            </svg>
          </button>

          <section className="pb-overview-panel" aria-label="全部章節">
            <div className="pb-overview-head">
              <span>全部章節</span>
              <span>
                {String(cursor.chapter + 1).padStart(2, "0")} /{" "}
                {String(chapters.length).padStart(2, "0")}
              </span>
            </div>
            <div className="pb-overview-grid">
              {chapters.map((c, i) => {
                const isActive = i === cursor.chapter;
                const isPast = i < cursor.chapter;
                const stepTotal = c.narrations.length;
                return (
                  <button
                    key={c.id}
                    className={`pb-overview-item ${
                      isActive ? "is-active" : ""
                    } ${isPast ? "is-past" : ""}`}
                    type="button"
                    aria-current={isActive ? "step" : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      onJumpChapter(i, 0);
                      e.currentTarget.blur();
                    }}
                  >
                    <span className="pb-overview-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pb-overview-copy">
                      <strong>{c.title}</strong>
                      <small>
                        {isActive
                          ? `目前在第 ${cursor.step + 1} 段`
                          : isPast
                            ? "已走過"
                            : "尚未開始"}
                      </small>
                    </span>
                    <span className="pb-overview-status">
                      {isPast
                        ? "✓"
                        : isActive
                          ? `${cursor.step + 1}/${stepTotal}`
                          : `${stepTotal} 段`}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="pb-track">
          {chapters.map((c, i) => {
            const isActive = i === cursor.chapter;
            return (
              <div
                key={c.id}
                className={`pb-chapter ${isActive ? "pb-active" : ""}`}
              >
                <button
                  ref={isActive ? activeRef : undefined}
                  className="pb-chapter-main"
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`前往第 ${i + 1} 章：${c.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onJumpChapter(i, 0);
                    e.currentTarget.blur();
                  }}
                >
                  <span className="pb-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pb-title">{c.title}</span>
                </button>
                {isActive && c.narrations.length > 1 && (
                  <div className="pb-pips">
                    {Array.from({ length: c.narrations.length }, (_, s) => (
                      <button
                        key={s}
                        type="button"
                        className={`pb-pip ${
                          s <= cursor.step ? "pb-pip-on" : ""
                        }`}
                        aria-label={`前往「${c.title}」第 ${s + 1} 段`}
                        aria-current={s === cursor.step ? "step" : undefined}
                        onClick={(e) => {
                          e.stopPropagation();
                          onJumpChapter(i, s);
                          e.currentTarget.blur();
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
      {githubUrl && (
        <a
          className="pb-github"
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="在 GitHub 查看原始碼"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.68.8.56 4.56-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5Z"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
