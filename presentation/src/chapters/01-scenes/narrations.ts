import type { Narration } from "../../registry/types";

export const narrations: Narration[] = [
  // 原 step 1（hotfix 插隊）與 step 2（未 commit 的修改）已合併成同一步：
  // 這兩句本來就是同一個節拍的前後半句，而且 uncommitted-interruption.png
  // 這張插圖本身就同時畫了「沒歸位的一堆紙」與「砸進來的火警通知」——
  // 拆成兩頁等於同一張圖的資訊被切成兩次講。合併後旁白精簡成一句。
  "你在 feature 分支寫到一半，production 出事、hotfix 插隊進來。但你手上還有一堆未 commit 的修改，這個現場根本還沒收完。",
  "另一種，PR 已經送審，review 還沒結束。你不能停在原地等，得先開始下一個工項。",
  "還有專案長期兩個版本並存。第一階段已經上線要維護，第二階段照新合約在開發。",
  "你一定遇過這些狀況。一個人手上，同時壓著好幾個工作。",
];
