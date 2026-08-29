export const narrations = [
  "解法很簡單。一個 task 給一棵 worktree。",
  "檔案系統跟 checkout 狀態各自隔離，Git 歷史還是同一份。",
  "收尾的時候用 diff、commit、merge 檢查每個 task 的結果。",
  "失敗也好收。任務不要了就把那棵 worktree 移掉，主工作目錄完全不用動。",
  "Claude Code 現在建立任務的時候，就有一個 worktree 選項可以勾。",
  "但要注意，worktree 只隔離工作目錄，不隔離外部資源。",
  "資料庫、port、Docker container、cache 還是共用的。這些要另外命名跟管理。",
];
