import type { Narration } from "../../registry/types";
export const narrations: Narration[]=[
  "worktree 就是為了這件事做的。",
  "Git 官方的定義是，同一個 repository 可以管理多個 working tree。",
  "clone 出來的是 main worktree，add 開出來的是 linked worktree；它們各自 checkout 不同分支，但共用同一套 object database 與大部分 refs。",
  "你可以把它想成，把分支實體化成另一個資料夾。",
];
