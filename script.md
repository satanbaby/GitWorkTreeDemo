feature 寫到一半，production 出事。這時候你會怎麼做？

---

你在 feature 分支寫到一半。production 出事，hotfix 插隊進來。

---

但你手上還有一堆未 commit 的修改。這個現場根本還沒收完。

---

另一種，PR 已經送審，review 還沒結束。你不能停在原地等，得先開始下一個工項。

---

還有專案長期兩個版本並存。第一階段已經上線要維護，第二階段照新合約在開發。

---

你一定遇過這些狀況。一個人手上，同時壓著好幾個工作。

---

問題在哪？一個 working directory，一次只能呈現一個 checkout。

---

那要頻繁切換的時候，我們過去都怎麼做？三種。

---

一種是暫時 commit 一個 WIP。好處是東西不會丟，切過去很快。

---

缺點是把還沒整理好的狀態寫進 branch history。之後要切回來整理，甚至改寫歷史。

---

另一種是 stash。好處是 working tree 立刻乾淨，不會留下半成品 commit。

---

缺點是套回來可能衝突。stash 一多，也很容易取錯那一筆。

---

還有一種是再 clone 一份。好處是隔離最完整，兩邊完全互不影響。

---

每份 clone 都帶一套 repository。假設 Git repo 是 1GB，開三份就是 3GB，工作檔案還要另外算。

---

你在這邊 commit，那邊看不到。要靠 fetch、push 才交換得到。

---

worktree 就是為了這件事做的。

---

Git 官方的定義是，同一個 repository 可以管理多個 working tree。

---

clone 出來的是 main worktree，add 開出來的是 linked worktree；它們各自 checkout 不同分支，但共用同一套 object database 與大部分 refs。

---

你可以把它想成，把分支實體化成另一個資料夾。

---

講到這裡，用手機跟 eSIM 來比喻會更好懂。

---

多 clone 像是每多一個門號，就再買一支手機。每支都有一整套自己的系統跟資料。

---

worktree 比較像一支手機裝好幾個 eSIM。

---

底層裝置只有一套，不同門號各自使用。

---

對應到 Git，共用的是 repository 的歷史跟物件。

---

開一棵新的通常更快，不用再抓一次完整歷史。

---

任何一棵做出的 commit，其他棵立刻看得到。

---

但比喻只到這裡。實體檔案還是各有一份。

---

node_modules、build output、.env、port，都要分別準備。它不是零磁碟成本。

---

這就是最大的差別。多 clone 是各過各的，worktree 是同一份歷史開多個現場。

---

指令不多，真的要記的就這幾個。

---

git worktree list。看目前這個 repo 底下所有的工作目錄。

---

git worktree add 加上 -b。從 main 開一個新分支，放到隔壁的資料夾。

---

分支已經存在的話更簡單。add 後面直接給目錄跟分支名。

---

切換就不用 git switch 了。你是切到另一個資料夾。或者直接用另一個 VS Code 視窗打開。

---

用完要收。移除相關的兩個動作，一個一個看。

---

git worktree remove。移除之前先確認變更都提交或妥善保存了。有沒提交或沒追蹤的檔案，它會直接拒絕。

---

注意，移除 worktree 不等於刪掉 branch。branch 要另外確認合併過，才用 git branch -d。

---

這些指令記不起來也沒關係。VS Code 裡有現成的擴充套件，不用硬背。

---

它叫 Git Worktree Manager，識別碼是 jackiotyu.git-worktree-manager。市集上搜得到。

---

從側邊欄按新增 Worktree，選建立新分支，再挑一個基準分支。

---

輸入 worktree 要放的目錄。命名習慣是放在專案同一層，加上 .worktrees。

---

建立後，直接用另一個 VS Code 視窗打開，不必切掉原本的現場。

---

兩個視窗，一個停在原本的 feature，一個停在 hotfix。各自編輯，各自提交。

---

hotfix 那邊一提交，主視窗的 git graph 立刻就看到了。這就是共用同一份歷史。

---

收工的時候，從 worktree 操作選單移除。移除之後，剛剛那個 commit 還在歷史裡。

---

再來講 Coding Agent。Codex、Claude、Copilot 都會遇到同一個並行問題。

---

Codex 一、Codex 二、Claude、Copilot，各自處理不同 work item，最後卻寫進同一個資料夾。

---

互相覆蓋，測試結果也跟著被污染。你根本分不出來是誰改壞的。

---

解法很簡單。一個 task 給一棵 worktree，也就是一個獨立資料夾。

---

檔案系統跟 checkout 狀態各自隔離，Git 歷史還是同一份。

---

失敗也好收。任務不要了，只移除那個 worktree 資料夾。branch 還留在 Git 裡，主工作目錄也不用動。

---

Claude Code 現在建立任務的時候，就有一個 worktree 選項可以勾。

---

worktree 不是每個任務都要用。

---

只改一個小功能、沒有並行需求，普通 branch 已經夠好。

---

當切換成本很高，或者要同時保留好幾個可執行環境。

---

又或者要讓 Codex、Claude、Copilot 並行跑不同 task。這時候它才真的有價值。

---

回去挑一個你手上真的在做的專案，開一棵 worktree 試一次。
