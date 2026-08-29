你 feature 做到一半。

線上突然出現 hotfix。

你現在敢直接切分支嗎？

---

檔案還沒改完。

服務還在跑。

腦中上下文正熱著。

這時切分支，代價不只一行指令。

---

你得先做一個 WIP commit。

或者把修改塞進 stash。

修完再切回來。

還要把現場拼回去。

---

如果 stash 剛好衝突，

緊急修復還沒開始，

你先修了一場自己的災難。

---

同時開發兩個分支也一樣。

前端做到一半，要等 API。

你想先去改後端。

單一資料夾卻只能放一個 checkout。

---

頻繁切換會換掉整批檔案。

build cache 可能留錯版本。

跑著的服務也可能對不上程式碼。

---

很多人會再 clone 一份。

這招能用。

但你也複製了一整套 repository。

---

想像你有三個門號。

為了多門號，買三支手機當然能用。

只是成本很高。

---

Worktree 比較像 eSIM。

一支手機能管理多個門號設定。

不用每個門號配一支手機。

---

手機共用同一套底層。

就像同一個 repository。

每棵 worktree 都有自己的畫面。

各自呈現一個 branch。

---

這個比喻有一個邊界。

Worktree 的專案檔案仍各有一份。

它不是完全不占空間。

---

兩份 clone 各有 Git 歷史。

各自有 refs 和 remote 設定。

fetch 過什麼，也要各自同步。

---

Clone 的成本比較高。

但隔離也最完整。

甚至能各自連不同 remote。

---

Worktree 走的是另一條路。

Git 歷史和 refs 共用。

工作目錄則分開。

---

新目錄不用再抓完整歷史。

一邊做出的 commit，

另一邊馬上看得到。

---

但別把它當成免費複製。

專案檔案仍有另一份。

依賴通常要重裝。

Build output 也會重建。

---

Worktree 把分支實體化了。

每個分支有自己的工作房間。

---

技術上再精確一點。

Branch 還是一個 ref。

Worktree 是另一個工作目錄。

它有自己的 HEAD 和 index。

---

一般 clone 會建立第一棵。

後來新增的，是連結工作目錄。

它們共用 Git objects。

---

我們直接開一棵。

先看現在有哪些 worktree。

`git worktree list`。

---

假設 main 上要開 hotfix。

指令是 `git worktree add`。

加上 `-b` 建立新分支。

---

完整指令放在畫面上。

注意 `-b` 是建立新分支。

---

如果分支已經存在，

就拿掉 `-b`。

路徑後面直接放 branch 名稱。

---

所謂切換，也變得很直覺。

你不用來回 `git switch`。

直接走進另一個資料夾。

---

一個終端留在 feature。

另一個終端進 hotfix。

兩套服務可以同時跑。

---

工作完成後，先確認狀態。

該 commit 的先 commit。

該 push 的先 push。

---

接著執行 remove。

後面放 worktree 路徑。

乾淨的 worktree 就會移除。

---

裡面還有未提交檔案，

Git 會拒絕移除。

先處理乾淨，別習慣用 force。

---

注意，worktree 消失了，

branch 不會跟著消失。

確認合併後再另外刪 branch。

---

VS Code 也能用按鈕操作。

擴充套件名稱在畫面上。

它叫 Git Worktree Manager。

它把常用操作放進側邊欄。

---

這是擴充套件頁面。

搜尋 Worktree Manager。

就能找到。

安裝後會多一個 Worktree 清單。

---

按下新增 Worktree。

這裡選建立新分支。

再挑它要從哪個 branch 開始。

---

接著輸入新目錄。

我把它放進 `.worktrees`。

資料夾名稱對齊 hotfix。

---

建立完成後，清單多出一棵。

點一下就能開新視窗。

原本視窗完全不用關。

---

現在兩個 VS Code 並排。

一邊留在原功能。

一邊處理緊急調整。

---

兩邊各有自己的終端。

原始碼控制也各看各的修改。

兩邊不必反覆切換。

---

做完以後，打開操作選單。

選擇移除 Worktree。

清單就回到乾淨狀態。

---

這套流程最適合插隊 hotfix。

原本 feature 的檔案、服務、視窗，

全部留在原地。

---

它也適合 code review。

把 PR branch 開到旁邊。

測完直接移除，不干擾開發中內容。

---

大型重構和 spike 也很好用。

實驗失敗，就回收那棵 worktree。

主工作目錄不用收拾殘局。

---

Agent 真的會動你的檔案。

兩個任務一起跑時，

隔離就變得很重要。

---

它會格式化、跑測試、做 build。

有時還會建立 commit。

兩個 agent 共用目錄，

檔案很快就互相踩到。

---

每個 task 分一棵 worktree，

就有獨立的 checkout 和檔案現場。

多個任務可以同時進行。

---

完成後再看 diff 和 commit。

要採用就 merge。

不要的任務直接回收 worktree。

---

但檔案之外，還是共用現實世界。

資料庫、連接埠和容器，

都要另外命名。

---

你還要知道幾個限制。

同一個 local branch，

預設不能開在兩棵 worktree。

---

它們共用 refs。

Git objects 也共用。

你刪 branch 或改 tag，

其他 worktree 也會看見。

---

Stash 通常也是共用的。

多棵同時用 stash，

名稱和內容要看清楚。

---

每個目錄仍要準備環境。

像是環境檔、依賴和專用 port。

別讓兩個服務搶同一個位置。

---

也別直接拖走或刪除資料夾。

平常移動請用 worktree move。

---

手動刪過資料夾，

用 prune 清理紀錄。

手動搬過位置，

用 repair 修復關聯。

---

如果目錄偶爾會離線，

可以用 lock 保留管理資訊。

像是隨身碟或網路磁碟。

---

Submodule 和某些工具鏈，

不一定懂多 worktree。

導入團隊前，先拿真專案跑一次。

---

團隊最好統一放置規則。

例如集中到 worktrees 目錄。

名稱對齊 ticket。

也可以對齊 branch。

---

建立後先配環境和 port。

需要的依賴也要裝好。

完成後確認 commit、push、PR。

也要確認合併狀態。

再移除 worktree。

---

Worktree 不會取代 branch。

它讓多個 branch 同時出現在桌面。

---

沒有並行需求，普通 branch 就夠。

但下次 hotfix 插隊時，

別急著 stash。

---

給那個 branch 一個自己的房間。

你的上下文，值得被保留下來。
