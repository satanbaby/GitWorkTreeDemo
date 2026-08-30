# Git Worktree 團隊分享原始素材

## 分享目標

這場分享要讓團隊理解 Git worktree 解決什麼問題、和重複 clone 有什麼差異，以及如何把它放進日常開發與 Coding Agent 工作流。希望成員看完後，能自己建立、切換、檢查與移除 worktree，也知道哪些情況不適合直接使用。

## 典型困境

開發者常在 feature 分支做到一半時，臨時收到 production hotfix。當前工作還堆著一批未提交修改，傳統切法通常是先 commit 一個不完整的 WIP，或 stash 變更，再 checkout hotfix 分支。修完後還要切回去、套回 stash；如果 stash 套用衝突，原本只想修一個緊急問題，卻多出一次復原現場的工作。

問題在於單一 working directory 一次只能呈現一個 checkout。feature 與 hotfix 只能輪流占用同一個工作目錄，不能把兩個版本的實體檔案同時留在眼前。

團隊日常還有兩種常見切換。一種是 PR 已送審，但 review 尚未結束，開發者不能停在原地，必須先開始下一個工項。另一種是同一專案長期並存兩個版本，例如第一階段已上線、持續維護，第二階段則依新合約開發。這些情境不是偶發例外，而是同一位開發者同時背著多個工作現場。

既有做法各有代價。暫時 commit 會把尚未整理好的狀態寫進 branch history，之後還要切回、整理或重寫歷史。stash 能保持 working tree 乾淨，但套回時可能衝突，也容易在多筆 stash 中取錯。額外 clone 能提供完整隔離，卻會把 repository 與工作檔案整套複製；假設一份 Git repository 就有 1 GB，三份 clone 光 Git 物件就會占 3 GB，工作檔案還要另外計算。在 clone A 產生的新 commit，clone B 的 `git log` 也不會直接看到，仍要透過 fetch、push 或其他 Git 操作交換。

## Worktree 的心智模型

Git 官方把 worktree 定義為同一個 repository 所管理的多個 working trees。一般 clone 建立的是 main worktree；`git worktree add` 建立的是 linked worktree。每個 linked worktree 有自己的目錄、HEAD 與 index，因此能同時 checkout 不同分支；它們共享同一套 Git object database 與大部分 refs。

對開發者可以把它想成「把分支實體化成另一個資料夾」。這是心智模型，不是嚴格定義。branch 本身仍只是一個 ref；worktree 是該版本內容的工作目錄，加上 Git 為它保存的獨立狀態。

## 和多次 clone 的差異

多次 clone 會得到多個彼此獨立的 repository。每份 clone 都有自己的 object database、remote 設定、refs 與 maintenance 狀態。好處是隔離最完整，也能連到不同 remote；代價是重複下載和保存 Git 物件，branch 與 fetch 狀態也要各自同步。

Worktree 則共用同一個 repository 的歷史與 refs。新 worktree 通常建立得更快，也不必再抓一次完整歷史。任何一棵 worktree 做出的 commit，其他 worktree 立即看得到。但每個工作目錄的實體檔案仍各有一份，`node_modules`、build output、未追蹤檔案與本機環境通常也要分別準備，所以它不是零磁碟成本。

可以用手機和 eSIM 幫助理解。多次 clone 像是每多一個門號，就再買一支手機：每支手機都有自己的一整套系統與資料。Worktree 比較像一支手機安裝多個 eSIM 設定：底層裝置只有一套，但不同門號能各自使用。對應到 Git，共用的是 repository 的歷史與物件，不同 worktree 則各自呈現一個 checkout。這個比喻只用來說明「共享底層、分開使用」；worktree 的專案檔案和依賴仍會占額外空間。

## 基本操作

查看目前所有工作目錄：

```bash
git worktree list
```

從 `main` 建立新 hotfix 分支並放到相鄰目錄：

```bash
git worktree add -b hotfix/payment-timeout ../project-hotfix main
```

把既有分支開成另一個工作目錄：

```bash
git worktree add ../project-feature feature/account-page
```

切換工作的方式不是在同一資料夾反覆 `git switch`，而是切到另一個資料夾，或直接用另一個 VS Code 視窗開啟：

```bash
cd ../project-hotfix
```

完成後先確認變更已提交或已妥善保存，再移除 linked worktree：

```bash
git worktree remove ../project-hotfix
```

移除 worktree 不等於刪除 branch。確認 branch 已合併後，才另外執行：

```bash
git branch -d hotfix/payment-timeout
```

如果曾手動刪除資料夾，可用 `git worktree prune` 清掉過期管理資訊。若曾手動移動 linked worktree，應優先使用 `git worktree repair` 修復關聯；平常則應使用 `git worktree move`，不要直接拖曳資料夾。

## VS Code 實作素材

素材目錄已有 Git Worktree Manager 擴充套件畫面。擴充套件識別碼為 `jackiotyu.git-worktree-manager`。示範流程是從側邊欄按「新增 Worktree」，選擇「建立新分支」，挑基準分支，輸入 worktree 目錄，然後在另一個 VS Code 視窗開啟。兩個視窗可以分別停在原本 feature 與 hotfix，獨立編輯和提交。最後從 worktree 操作選單移除 linked worktree。

## 實務情境

- feature 做到一半，production hotfix 插隊：保留未提交修改，另開 hotfix worktree。
- code review 或版本比對：把 PR branch 開到另一棵 worktree，不干擾正在開發的內容。
- spike、migration 或大型重構：實驗工作和穩定工作目錄分開，失敗時直接移除實驗 worktree。

## Coding Agent 為何使用 worktree

Coding Agent 會直接修改檔案、執行指令與產生輸出。Codex 1、Codex 2、Claude、Copilot 若各自處理不同 work item，卻共用同一個 working directory，仍可能同時改到相同檔案或清理同一批輸出，彼此覆蓋並污染測試結果。給每個 task 一棵 worktree，就能讓檔案系統與 checkout 狀態隔離，同時保留同一份 Git 歷史。

這種模式也讓失敗更容易回收：任務不要了，只移除該 worktree 的資料夾即可；branch 仍保留在 Git 裡，主工作目錄也不必先救回乾淨狀態。

## 限制與注意事項

- Git 預設不允許同一個 local branch 同時 checkout 到兩棵 worktree，避免兩邊同時推進同一 ref。
- refs 與 object database 是共享的。刪 branch、改 tag、fetch、commit 等動作會被其他 worktree 看見；不要把它誤認成完全獨立的 clone。
- stash 通常也是 repository 共用的 `refs/stash`，命名與取用要小心，避免拿錯。
- linked worktree 有未提交或未追蹤檔案時，`git worktree remove` 會拒絕；不要習慣用 `--force` 跳過保護。
- 每棵 worktree 都要處理自己的依賴、`.env`、build output、port 與本機資料庫名稱。
- 不要直接刪除或搬動 linked worktree 資料夾。使用 `remove`、`move`、`repair` 與 `prune` 維護 Git 的管理資訊。
- 放在隨身碟或偶爾離線的網路磁碟時，可以用 `git worktree lock --reason` 防止管理資訊被 prune。
- submodule 與特殊工具鏈對多 worktree 的支援程度不一，導入前要用團隊專案實測。

## 團隊工作流建議

團隊可以約定 worktree 集中放在 repository 同層的 `<repo>.worktrees/`，資料夾名稱跟 branch 或 ticket 對齊，例如 `project.worktrees/PROJ-123-hotfix`。建立後先配置 `.env` 與專用 port，再安裝依賴。工作完成後確認 commit、push、PR 與合併狀態，再移除 worktree；branch 是否刪除則是下一個獨立決定。

Worktree 不是每個任務都必須使用。只改一個小功能、沒有並行需求時，普通 branch 已經夠好。當上下文切換成本高、需要同時保留多個可執行環境，或 Coding Agent 要並行處理不同 task 時，worktree 才真正有價值。

## 查證來源

- Git 官方文件：https://git-scm.com/docs/git-worktree
- OpenAI Developers：https://developers.openai.com/
