import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Cursor } from "../hooks/useStepper";
import type { ChapterDef } from "../registry/types";

interface Props {
  chapters: ChapterDef[];
  cursor: Cursor;
  /**
   * 往後預載幾個 step。多數 step 是純文字沒有圖，窗口開 3 步才足以在
   * 下一張大插圖出現前就把它抓完。
   */
  lookahead?: number;
  /**
   * 等目前這頁把自己的資源抓完再開工的「間隙」。0 會讓預載跟當前畫面
   * 搶頻寬，反而讓使用者看到的那一頁變慢。
   */
  delayMs?: number;
}

/** 把游標往後推 n 步（會跨章）。超出最後一步回傳 null。 */
function advance(
  chapters: ChapterDef[],
  cur: Cursor,
  n: number,
): Cursor | null {
  let { chapter, step } = cur;
  for (let i = 0; i < n; i++) {
    if (step < chapters[chapter]!.narrations.length - 1) {
      step++;
    } else if (chapter < chapters.length - 1) {
      chapter++;
      step = 0;
    } else {
      return null;
    }
  }
  return { chapter, step };
}

/**
 * 靜態資源的預載窗口 —— 概念上就是虛擬滾動的 overscan：只多算未來幾個
 * step，不是整場全抓。
 *
 * 做法是把接下來幾個 step 再 render 一次到一個 `document.createElement`
 * 出來、但永遠不掛進文件的容器裡。因為不在文件中：
 *   - 不參與 layout / paint，CSS 動畫也不會在背景空轉
 *   - 不會產生重複的 SVG `id`（OldWays 與 Vscode 各有一個 <marker>，
 *     若掛進文件，`url(#id)` 可能會解析到這份隱藏副本）
 *   - 章節元件一行都不用改，也不用另外維護一份 step → 資產的對照表
 *
 * 前提：章節元件必須是純函式（目前 12 章都沒有 state / effect）。哪天
 * 某章開始有副作用，就把那一章排除在這裡的 render 之外。
 *
 * 注意這裡刻意「不」在 cursor 變動時清空窗口 —— key 用 chapter-step，
 * 窗口往前滑時 React 會沿用仍在窗口內的那幾棵樹，正在下載中的請求才
 * 不會被中斷後重抓。
 */
export function PrefetchAhead({
  chapters,
  cursor,
  lookahead = 3,
  delayMs = 800,
}: Props) {
  const [sink] = useState(() => document.createElement("div"));
  const [armed, setArmed] = useState<Cursor | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setArmed(cursor), delayMs);
    return () => window.clearTimeout(id);
  }, [cursor, delayMs]);

  const targets = useMemo(() => {
    if (!armed) return [];
    const out: Cursor[] = [];
    for (let n = 1; n <= lookahead; n++) {
      const t = advance(chapters, armed, n);
      if (!t) break;
      out.push(t);
    }
    return out;
  }, [armed, chapters, lookahead]);

  if (targets.length === 0) return null;

  return createPortal(
    targets.map((t) => {
      const Cmp = chapters[t.chapter]!.Component;
      return <Cmp key={`${t.chapter}-${t.step}`} step={t.step} />;
    }),
    sink,
  );
}
