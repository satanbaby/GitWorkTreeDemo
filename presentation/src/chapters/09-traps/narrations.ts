export const narrations = [
  "開始用之前，有幾個坑要先知道。",
  "同一個 local branch，Git 預設不讓你同時 checkout 到兩棵 worktree。",
  "這是為了避免兩邊同時推進同一個 ref。",
  "refs 跟 object database 是共享的。",
  "刪 branch、改 tag、fetch、commit，其他 worktree 都看得到。它不是完全獨立的 clone。",
  "stash 通常也是整個 repository 共用的 refs/stash。命名跟取用都要小心。",
  "submodule 跟一些特殊工具鏈的支援程度不一樣。導入前用團隊自己的專案實測一次。",
];
