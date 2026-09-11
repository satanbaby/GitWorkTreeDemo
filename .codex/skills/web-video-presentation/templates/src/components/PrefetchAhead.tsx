import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Cursor } from "../hooks/useStepper";
import type { ChapterDef } from "../registry/types";

interface Props {
  chapters: ChapterDef[];
  cursor: Cursor;
  /**
   * 往後預載幾個 step。多數 step 是純文字沒有資源，窗口開 3 步才足以
   * 在下一張大插圖出現前就把它抓完。
   */
  lookahead?: number;
  /**
   * 等目前這頁抓完自己的資源再開工的「間隙」。設 0 會讓預載跟當前畫面
   * 搶頻寬，使用者正在看的那一頁反而變慢。
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
 * 為什麼需要它：插圖與截圖放在 `public/`，章節用 `import.meta.env.BASE_URL`
 * 在執行期把 URL 組出來，Vite 建置期看不到這些檔案，所以產不出任何 preload
 * 提示 —— 瀏覽器只在 `<img>` mount 那一刻才發請求。錄影或現場播放時，切到
 * 目標 step 會看到圖片「慢一拍」才出現。
 *
 * 做法是把接下來幾個 step 再 render 一次到一個 `document.createElement`
 * 出來、但**永遠不掛進文件**的容器裡。因為不在文件中：
 *   - 不參與 layout / paint，CSS 動畫也不會在背景空轉
 *   - 不會產生重複的 SVG `id`（若章節用 `<marker>` / `<clipPath>` 等需要
 *     `url(#id)` 參照的定義，掛進文件後可能會解析到這份隱藏副本）
 *   - 章節元件一行都不用改，也不用另外維護一份 step → 資產的對照表；
 *     新增章節或換圖會自動被涵蓋
 *
 * `<img>` 只要 `src` 被設定就會發請求，元素在不在文件裡都一樣 —— 這正是
 * `new Image().src = url` 一直以來的原理。
 *
 * ⚠️ 前提：章節元件必須是 `step` 的**純函式**（沒有 state / effect /
 * 計時器）—— 這本來就是本框架的硬規則，見 CHAPTER-CRAFT.md「其它工程
 * 紅線」。哪天某章開始有副作用，就得把那章排除在這裡的 render 之外。
 *
 * 注意這裡刻意「不」在 cursor 變動時清空窗口 —— key 用 `chapter-step`，
 * 窗口往前滑時 React 會沿用仍在窗口內的那幾棵樹，正在下載中的請求才不會
 * 被中斷後重抓（一旦 remount，大圖就白抓一半）。
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
