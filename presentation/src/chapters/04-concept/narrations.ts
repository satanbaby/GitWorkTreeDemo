import type { Narration } from "../../registry/types";
export const narrations: Narration[]=[
  "worktree 就是為了這件事做的。",
  "Git 官方的定義是，同一個 repository 可以管理多個 working tree。",
  "clone 出來的那個是 main worktree，add 開出來的是 linked worktree。",
  "每個 linked worktree 有自己的目錄、HEAD 跟 index。所以能同時 checkout 不同分支。",
  "但它們共用同一套 object database，還有大部分的 refs。",
  "你可以把它想成，把分支實體化成另一個資料夾。",
  "這是心智模型，不是嚴格定義。branch 還是那個 ref，worktree 是它的工作目錄加上獨立狀態。",
];
