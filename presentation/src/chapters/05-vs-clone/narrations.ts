/**
 * 原 06-esim 章整段併入本章（step 3~7 與 step 10~11）。
 *
 * 併章前，「多 clone 各自一整套 / worktree 共用底層」這個論點在兩章各講了一
 * 輪：本章用 Git 術語講，第 7 章用手機與 eSIM 再講一次。併入後比喻改在「多
 * clone 是什麼」之後、「worktree 是什麼」之前登場，當成理解的鏡頭。
 *
 * 為此收掉兩句重複的旁白：
 *   - 「各自的 object database、各自的 remote 設定、各自的 refs。」
 *     → 併進 step 3 的手機螢幕（三個名詞刻在螢幕裡）
 *   - 「worktree 不一樣。它共用同一份歷史跟 refs。」
 *     → 與 step 6「對應到 Git，共用的是 repository 的歷史跟物件」同句
 */
export const narrations = [
  "那它跟剛剛說的多 clone 一份，差在哪？",
  "多 clone 會得到好幾個彼此獨立的 repository。",
  "講到這裡，用手機跟 eSIM 來比喻會更好懂。",
  "多 clone 像是每多一個門號，就再買一支手機。每支都有一整套自己的系統跟資料。",
  "worktree 比較像一支手機裝好幾個 eSIM。",
  "底層裝置只有一套，不同門號各自使用。",
  "對應到 Git，共用的是 repository 的歷史跟物件。",
  "開一棵新的通常更快，不用再抓一次完整歷史。",
  "任何一棵做出的 commit，其他棵立刻看得到。",
  "但比喻只到這裡。實體檔案還是各有一份。",
  "node_modules、build output、.env、port，都要分別準備。它不是零磁碟成本。",
  "這就是最大的差別。多 clone 是各過各的，worktree 是同一份歷史開多個現場。",
];
