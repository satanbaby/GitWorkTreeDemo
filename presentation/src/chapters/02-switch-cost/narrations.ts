import type { Narration } from "../../registry/types";

export const narrations: Narration[] = [
  "問題在哪？一個 working directory，一次只能呈現一個 checkout。",
  "你切分支，整批檔案就跟著換。",
  "build cache、產生出來的檔案、node_modules，很容易跟現在的分支對不上。",
  "還在跑的服務也一樣。切過去就不是原來那個環境了。",
];
