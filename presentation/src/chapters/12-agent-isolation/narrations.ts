export const narrations = [
  "解法很簡單。一個 task 給一棵 worktree，也就是一個獨立資料夾。",
  "檔案系統跟 checkout 狀態各自隔離，Git 歷史還是同一份。",
  "失敗也好收。任務不要了，只移除那個 worktree 資料夾。branch 還留在 Git 裡，主工作目錄也不用動。",
  "Claude Code 現在建立任務的時候，就有一個 worktree 選項可以勾。",
  "Codex 也一樣。工作位置選單裡選「新增本機工作樹」，這個任務就會開在自己的資料夾。",
  "GitHub Copilot 則是在送出任務前，把下面的「新增工作樹」勾起來，agent 就不會跟你搶同一個工作目錄。",
];
