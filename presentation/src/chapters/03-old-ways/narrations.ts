import type { Narration } from "../../registry/types";
export const narrations: Narration[] = [
  "那要頻繁切換的時候，我們過去都怎麼做？三種。",
  "一種是暫時 commit 一個 WIP。好處是東西不會丟，切過去很快。",
  "缺點是把還沒整理好的狀態寫進 branch history。之後要切回來整理，甚至改寫歷史。",
  "另一種是 stash。好處是 working tree 立刻乾淨，不會留下半成品 commit。",
  "缺點是套回來可能衝突。stash 一多，也很容易取錯那一筆。",
  "還有一種是再 clone 一份。好處是隔離最完整，兩邊完全互不影響。",
  "每份 clone 都帶一套 repository。假設 Git repo 是 1GB，開三份就是 3GB，工作檔案還要另外算。",
  "你在這邊 commit，那邊看不到。要靠 fetch、push 才交換得到。",
];
