# Video Outline

> **主題**：`we-bare-bears`（熊熊遇見你）—— 技術分享、CLI 與 VS Code 實機畫面並重
> **總時長**：約 7 分 33 秒（53 個口播節拍，依中文約 4 字／秒逐步校準）
> **章節數**：11 章 / 53 步

---

## 1. overloaded-developer — 分支切換不是例外，是日常（5 steps · ~43s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- Hotfix：feature 開發到一半，production 問題突然插隊 —— 來源 article §典型困境
- PR 銜接：PR 還在 review，下一個工項已經必須開始 —— 來源 article §典型困境
- 雙版本：第一階段已上線維護，第二階段同步開發新合約需求 —— 來源 article §典型困境
- 現場成本：未提交修改、執行中服務、依賴、IDE 與腦中上下文 —— 來源 article §典型困境
- 主角設定：一位開發者同時背著三份必須保留的工作現場 —— 來源 article §典型困境

**開發計畫**：

- step 1 (~8s) — 冷開場：工作從四面八方飛向一位正在寫程式的開發者
- step 2 (~9s) — 開發中的 feature 被 production hotfix 緊急插隊
- step 3 (~8s) — PR 停在 review，下一個工項已經送到開發者手上
- step 4 (~9s) — 同一專案並列第一階段已上線版與第二階段新合約版
- step 5 (~9s) — 主角被 hotfix、PR 後續工項與雙版本工作包圍，呈現手忙腳亂的完整插圖

口播節選：
> 畫面上只有一位開發者。身邊卻同時堆著三份工作。每一份都要保留自己的現場。

---

## 2. existing-options — 既有做法都能用，也都有代價（7 steps · ~60s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 暫時 commit：能立刻切分支，但未整理狀態先進入 branch history —— 來源 article §典型困境
- Commit 收尾：切回後仍要整理 commit 或重寫歷史 —— 來源 article §典型困境
- Stash：能暫時清空工作目錄，但套回可能衝突，多筆時也可能取錯 —— 來源 article §典型困境
- Clone：隔離最完整，但 repository、工作檔案與依賴重複占用空間 —— 來源 article §和多次 clone 的差異
- 歷史同步：兩份 clone 起初歷史相同，後續 commit 與 `git log` 不會自動同步 —— 來源 article §典型困境
- 同步責任：需要 fetch、push 或其他 Git 操作交換進度，remote 也各自管理 —— 來源 article §典型困境、§和多次 clone 的差異

**開發計畫**：

- step 1 (~8s) — 暫時 commit 完成切走與切回，但留下未整理的 branch history
- step 2 (~10s) — 切回原分支後，未整理 commit 仍需再次收尾
- step 3 (~8s) — Stash 清空工作目錄，套回時出現 conflict 風險
- step 4 (~8s) — 多筆 stash 增加取錯內容與復原現場的成本
- step 5 (~7s) — 額外 clone 建立完整隔離，同時複製 repository 與工作檔案成本
- step 6 (~10s) — 兩邊 `git log` 顯示不同進度，明確標出不會自動同步
- step 7 (~9s) — fetch、push 與分開管理的 remote 成為額外同步工作

口播節選：
> 兩份 clone 起初歷史相同。之後各自新增的 commit，不會自動出現在另一份 log。

---

## 3. mental-model — 把分支實體化成工作房間（5 steps · ~44s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 官方概念：一個 repository 可管理 main worktree 與零到多個 linked worktree —— 來源 article §Worktree 的心智模型
- 共用部分：Git object database 與大部分 refs —— 來源 article §Worktree 的心智模型
- 獨立部分：目錄、HEAD、index 與未提交工作現場 —— 來源 article §Worktree 的心智模型
- 心智模型：「把分支實體化成另一個資料夾」或「每個分支有自己的工作房間」 —— 來源 article §Worktree 的心智模型
- 技術邊界：branch 仍是 ref，worktree 才是工作目錄與獨立狀態 —— 來源 article §Worktree 的心智模型

**開發計畫**：

- step 1 (~9s) — Worktree 方案先呈現「共用 Git 歷史、分開工作目錄」的核心差異
- step 2 (~7s) — 「把分支實體化」成多個並排工作房間的核心心智模型
- step 3 (~10s) — branch ref 與 worktree 的 directory、HEAD、index 做精確拆分
- step 4 (~10s) — main worktree、linked worktree 與 shared Git objects 的關係總圖
- step 5 (~8s) — 任一 worktree 建立的 commit 可從共享歷史查到，且不需重抓歷史

口播節選：
> Worktree 把分支實體化了。每個分支有自己的工作房間。

---

## 4. esim-analogy — 一支手機，不必為每個門號再買一支（4 steps · ~34s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 使用者比喻：三個門號不必購買三支手機，一支手機可管理多個 eSIM 設定 —— 來源 article §和多次 clone 的差異
- 共享底層：手機本體對應同一 repository 的 Git 歷史與 objects —— 來源 article §和多次 clone 的差異
- 分開使用：不同門號各自使用，對應不同 worktree 呈現各自 branch —— 來源 article §和多次 clone 的差異
- 比喻邊界：worktree 的專案檔案、依賴與 build output 仍各自占用空間 —— 來源 article §和多次 clone 的差異

**開發計畫**：

- step 1 (~7s) — 三個門號對應三支手機，凸顯「能用，但成本高」
- step 2 (~10s) — 畫面收斂成一支手機與多個 eSIM 門號設定
- step 3 (~8s) — 手機共用底層與不同門號各自使用的映射，對應 repository 與 branch
- step 4 (~9s) — 比喻邊界：每棵 worktree 仍保有專案檔案、依賴與 build output

口播節選：
> Worktree 比較像 eSIM。一支手機能管理多個門號設定。不用每個門號配一支手機。

---

## 5. cli-create — 建立、查看與切換 Worktree（6 steps · ~50s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 查看命令：`git worktree list` —— 來源 article §基本操作
- 新分支命令：`git worktree add -b hotfix/payment-timeout ../project-hotfix main` —— 來源 article §基本操作
- 既有分支命令：`git worktree add ../project-feature feature/account-page` —— 來源 article §基本操作
- 操作差異：切換工作是進入另一個資料夾，不是在原目錄反覆 `git switch` —— 來源 article §基本操作
- 並行狀態：feature 與 hotfix 可各自保有終端、服務與編輯器視窗 —— 來源 article §典型困境、§基本操作

**開發計畫**：

- step 1 (~10s) — 模擬終端顯示 `git worktree list` 與兩棵工作目錄的位置
- step 2 (~10s) — `git worktree add` 指令骨架拆成新目錄、新 branch 與起點 commit
- step 3 (~5s) — 完整 hotfix 建立命令置中，`-b` 與 `main` 成為主要閱讀焦點
- step 4 (~7s) — 既有 branch 建立方式與新 branch 建立方式並排對照
- step 5 (~9s) — 從 `git switch` 的單目錄切換改成走進另一個實體資料夾
- step 6 (~9s) — feature 與 hotfix 各自擁有終端與服務的雙工作現場

口播節選：
> 所謂切換，也變得很直覺。你不用來回 git switch。直接走進另一個資料夾。

---

## 6. cli-cleanup — 收尾不是直接刪資料夾（4 steps · ~37s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 收尾前檢查：確認修改已 commit、push 或妥善保存 —— 來源 article §基本操作
- 移除命令：`git worktree remove ../project-hotfix` —— 來源 article §基本操作
- 保護機制：有 tracked 修改或 untracked 檔案時 remove 會拒絕 —— 來源 article §限制與注意事項
- Branch 生命週期：移除 worktree 不等於刪 branch，合併後再用 `git branch -d` —— 來源 article §基本操作

**開發計畫**：

- step 1 (~9s) — worktree 收尾檢查表只保留 status、commit 與 push 三個狀態
- step 2 (~10s) — `git worktree remove` 對準已乾淨的 linked worktree 路徑
- step 3 (~8s) — dirty worktree 被 Git 拒絕移除，`--force` 標為非常態手段
- step 4 (~10s) — worktree 目錄消失但 branch ref 保留，合併後才另行刪除

口播節選：
> 注意，worktree 消失了，branch 不會跟著消失。確認合併後再另外刪 branch。

---

## 7. vscode-manager — 在 VS Code 用按鈕完成整段流程（8 steps · ~59s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 擴充套件：Git Worktree Manager，識別碼 `jackiotyu.git-worktree-manager` —— 來源 article §VS Code 實作素材、素材/擴充套件截圖.png
- 建立入口：側邊欄「新增 Worktree」與 Worktree 清單 —— 來源 article §VS Code 實作素材、素材/vscode新增worktree.png
- 建立流程：選新分支、挑基準 branch、輸入 `.worktrees` 下的目錄 —— 來源 article §VS Code 實作素材、素材/vscode新增worktree_step2.png、step3.png
- 雙視窗結果：原 feature 與 hotfix 分開開啟，終端與 Source Control 各自獨立 —— 來源 article §VS Code 實作素材、素材/vscode新增worktree_step4.png 至 step7.png
- 移除流程：Worktree 操作選單選「移除 Worktree」，清單恢復乾淨 —— 來源 article §VS Code 實作素材、素材/vscode新增worktree_step8.png、step9.png

**開發計畫**：

- step 1 (~10s) — 擴充套件詳情截圖聚焦 Worktree Manager 名稱與安裝後的側邊欄清單
- step 2 (~5s) — 「新增 Worktree」入口與「建立新分支」選項
- step 3 (~4s) — 基準 branch 選擇畫面
- step 4 (~9s) — 目錄輸入截圖聚焦 `.worktrees/第一階段hotfix` 路徑
- step 5 (~8s) — Worktree 清單新增 hotfix，提供在新視窗開啟的入口
- step 6 (~7s) — 兩個 VS Code 視窗並排，feature 與 hotfix 各停在自己的資料夾
- step 7 (~8s) — 兩側 Source Control、終端與 branch 狀態各自保持獨立
- step 8 (~8s) — 操作選單選擇移除 Worktree，最後回到只剩主工作目錄的清單

口播節選：
> 現在兩個 VS Code 並排。一邊留在原功能。一邊處理緊急調整。

---

## 8. real-world-cases — Hotfix、Review 與實驗分流（3 steps · ~30s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- Hotfix：保留原 feature 的檔案、服務、視窗與思考上下文 —— 來源 article §實務情境
- Code review：PR branch 在旁邊測試，完成後直接移除 —— 來源 article §實務情境
- 實驗工作：spike、migration、大型重構與穩定工作目錄分開 —— 來源 article §實務情境

**開發計畫**：

- step 1 (~10s) — Hotfix 插隊時，原 feature 的檔案、服務與視窗完整留在原地
- step 2 (~10s) — PR branch 成為可隨時建立與回收的 code review 工作區
- step 3 (~10s) — 大型重構與 spike 放進可丟棄的獨立工作目錄

口播節選：
> 大型重構和 spike 也適合。實驗失敗就移除。主目錄不用收拾殘局。

---

## 9. shared-git-limits — 共用 Git，也共用狀態（4 steps · ~35s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- Branch 限制：同一 local branch 預設不能同時 checkout 到兩棵 worktree —— 來源 article §限制與注意事項
- 共用狀態：大部分 refs 與 Git objects 在 repository 範圍共享 —— 來源 article §限制與注意事項
- Stash：`refs/stash` 通常在 repository 範圍共用 —— 來源 article §限制與注意事項
- 環境隔離：每棵 worktree 仍需自己的 `.env`、依賴、port 與資料庫名稱 —— 來源 article §限制與注意事項

**開發計畫**：

- step 1 (~8s) — 同一 local branch 嘗試被兩棵 worktree 同時 checkout，第二棵被拒絕
- step 2 (~10s) — 大部分 refs 與 Git objects 從中央 repository 同時連到所有 worktree
- step 3 (~8s) — 共用 stash 池中標出容易拿錯的多筆暫存內容
- step 4 (~9s) — 每棵工作目錄各自列出環境檔、依賴、port 與本機資料庫名稱

口播節選：
> 同一個 local branch，預設不能同時開兩棵。

---

## 10. maintenance-limits — 移動、清理與放心刪除（3 steps · ~26s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 正常移動：linked worktree 應使用 `git worktree move`，不要直接拖曳或刪除資料夾 —— 來源 article §限制與注意事項
- 修復命令：手動刪除後用 `prune`，手動移動後用 `repair` —— 來源 article §基本操作
- 移除的方便性：移除 worktree 不等於刪除 branch，branch 與歷史仍完整保留，可以隨時重新建立 worktree 接續 —— 來源 article §基本操作

**開發計畫**：

- step 1 (~8s) — 檔案管理器直接拖曳與刪除 linked worktree 被列為錯誤操作
- step 2 (~9s) — `move`、`prune`、`repair` 三個命令對應各自的維護情境
- step 3 (~9s) — 移除 worktree 後 branch 與 commit 仍在，隨時能重新開一棵接續進度

口播節選：
> Worktree 拿掉，不可惜。Branch 和 commit 都留著。想接著做，再開一棵就好。

---

## 11. coding-agents — 給每個 Agent Task 一個房間（4 steps · ~35s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- Agent 行為：修改檔案、格式化、測試、build，甚至建立 commit —— 來源 article §Coding Agent 為何使用 worktree
- 共享目錄風險：多 agent 會互改檔案、切 branch 與污染測試輸出 —— 來源 article §Coding Agent 為何使用 worktree
- Task 隔離：每個 task 擁有獨立 checkout 與檔案現場 —— 來源 article §Coding Agent 為何使用 worktree
- 房間隱喻收束：worktree 給每個分支一個房間，也給每個 agent task 一個房間 —— 來源 article §Worktree 的心智模型、§Coding Agent 為何使用 worktree

**開發計畫**：

- step 1 (~8s) — Coding Agent 對檔案系統執行修改、格式化、測試與 build
- step 2 (~8s) — 兩個 agent 共用同一目錄時，修改與測試輸出互相碰撞
- step 3 (~10s) — 每個 task 對應一棵 worktree，形成多條並行工作線
- step 4 (~9s) — 全片收尾定格：不只 branch 有自己的房間，agent 的每個 task 也是

口播節選：
> 每個 task，也有自己的房間。不只是 branch，agent 也是。你的上下文，都留得住。

---

## 素材清單

### 1. overloaded-developer
- ⚠️ 主角在開發時被 hotfix、PR 後續工項與雙版本需求包圍的插圖（待製作）
- ⚠️ 第一階段已上線版與第二階段新合約版的專案標記（待製作）

### 2. existing-options
- ⚠️ 暫時 commit、stash、額外 clone 三方案對照（待製作）
- ⚠️ stash conflict 與多筆 stash 取錯的 Git 狀態畫面（待製作）
- ⚠️ 兩份 clone 的 `git log` 從共同起點分岔畫面（待製作）

### 3. mental-model
- ⚠️ repository、refs、HEAD、index 與多 worktree 關係圖（待製作）
- ⚠️ 多個「工作房間」的心智模型畫面（待製作）

### 4. esim-analogy
- ⚠️ 手機與多 eSIM 的主視覺（待製作；不使用特定手機品牌）
- ⚠️ 多支手機對照單一手機的構圖（待製作）

### 5. cli-create
- ⚠️ `git worktree list`、`add -b` 與既有分支的模擬終端（待製作）
- ⚠️ feature / hotfix 雙終端與雙服務畫面（待製作）

### 6. cli-cleanup
- ⚠️ clean / dirty worktree 的 remove 對照（待製作）
- ⚠️ worktree 目錄與 branch ref 分離的關係圖（待製作）

### 7. vscode-manager
- ✓ 擴充套件詳情頁（`素材/擴充套件截圖.png`）
- ✓ 建立 Worktree 起始畫面（`素材/vscode新增worktree.png`）
- ✓ 選擇基準分支（`素材/vscode新增worktree_step2.png`）
- ✓ 輸入 Worktree 目錄（`素材/vscode新增worktree_step3.png`）
- ✓ 建立結果與新視窗入口（`素材/vscode新增worktree_step4.png`）
- ✓ 雙 VS Code 視窗與獨立終端（`素材/vscode新增worktree_step5.png`）
- ✓ 雙分支修改與 Source Control（`素材/vscode新增worktree_step6.png`、`素材/vscode新增worktree_step7.png`）
- ✓ 移除 Worktree 選單與完成結果（`素材/vscode新增worktree_step8.png`、`素材/vscode新增worktree_step9.png`）

### 8. real-world-cases
- ⚠️ Hotfix、code review、spike 三種實務情境圖（待製作）

### 9. shared-git-limits
- ⚠️ 同一 branch 重複 checkout 的錯誤訊息（待以模擬終端呈現）
- ⚠️ 共用的大部分 refs、Git objects 與 stash 關係圖（待製作）

### 10. maintenance-limits
- ⚠️ `move` / `prune` / `repair` 的維護情境圖（待製作）
- ⚠️ worktree 移除後 branch／commit 保留、可重新建立的示意（待製作）

### 11. coding-agents
- ⚠️ Coding Agent 多 task / 多 worktree 關係圖（待製作）
- ⚠️ 呼應「工作房間」隱喻的全片收尾畫面（待製作）
