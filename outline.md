# Video Outline

> **主題**：`待選`（Checkpoint Plan 決定）—— 技術分享、CLI 與 VS Code 實機畫面並重
> **總時長**：約 8 分 19 秒（口播約 2300 個有效字元，依中文約 4 字／秒校準）
> **章節數**：9 章 / 58 步

---

## 1. context-switch — Hotfix 插隊時，切分支不只一行指令（6 steps · ~57s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 情境：feature 尚未完成，production hotfix 突然插隊 —— 來源 article §典型困境
- 現場：未提交修改、執行中服務、已裝依賴、IDE 上下文 —— 來源 article §典型困境
- 傳統處理：WIP commit 或 stash，修完再切回並恢復現場 —— 來源 article §典型困境
- 風險：stash 套用衝突，讓緊急修復多出復原成本 —— 來源 article §典型困境
- 並行情境：前端 feature 等 API，同時需要開後端分支 —— 來源 article §典型困境

**開發計畫**：

- step 1 (~8s) — 冷開場：feature 進度被 production hotfix 強行切開，中央只留「現在敢切分支嗎？」
- step 2 (~10s) — 同一工作現場並列未完成檔案、執行中服務與仍在腦中的上下文
- step 3 (~11s) — WIP commit、stash、切回與恢復現場形成一條額外工作鏈
- step 4 (~8s) — stash conflict 成為 hotfix 前方的第一個阻塞點
- step 5 (~11s) — 前端與 API 兩個分支爭用同一個 working directory
- step 6 (~9s) — 整批檔案、build cache 與執行中服務出現版本錯位

口播節選：
> 你 feature 做到一半。線上突然出現 hotfix。你現在敢直接切分支嗎？

---

## 2. esim-analogy — 一支手機，不必為每個門號再買一支（7 steps · ~59s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 傳統替代方案：再 clone 一份 repository，隔離完整但重複保存底層資料 —— 來源 article §和多次 clone 的差異
- 使用者比喻：多門號不必購買多支手機，一支手機可管理多個 eSIM 設定 —— 來源 article §和多次 clone 的差異
- 對照：手機底層對應 repository，不同使用狀態對應各 worktree 呈現的 branch —— 來源 article §和多次 clone 的差異
- 比喻邊界：專案檔案、依賴與 build output 仍各占一份空間 —— 來源 article §和多次 clone 的差異
- Clone 優點：repository、remote、refs 與維護狀態完全隔離，可連不同 remote —— 來源 article §和多次 clone 的差異

**開發計畫**：

- step 1 (~7s) — 一份 repository 旁邊長出第二份完整 clone，標出重複成本
- step 2 (~8s) — 三個門號對應三支手機，凸顯「能用，但成本高」
- step 3 (~8s) — 畫面收斂成一支手機與多個 eSIM 門號設定
- step 4 (~10s) — repository 共用底層、各 worktree 呈現不同 branch 的映射圖
- step 5 (~8s) — 比喻邊界：每棵 worktree 仍保有一份實體專案檔案
- step 6 (~10s) — 兩份 clone 各自擁有 Git 歷史、refs、remote 與 fetch 狀態
- step 7 (~8s) — Clone 以較高成本換取最完整隔離與不同 remote 能力

口播節選：
> Worktree 比較像 eSIM。一支手機能管理多個門號設定。不用每個門號配一支手機。

---

## 3. mental-model — 把分支實體化成工作房間（6 steps · ~53s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 官方概念：一個 repository 可管理 main worktree 與零到多個 linked worktree —— 來源 article §Worktree 的心智模型
- 共用部分：Git object database 與大部分 refs —— 來源 article §Worktree 的心智模型
- 獨立部分：目錄、HEAD、index 與未提交工作現場 —— 來源 article §Worktree 的心智模型
- 心智模型：「把分支實體化成另一個資料夾」或「每個分支有自己的工作房間」 —— 來源 article §Worktree 的心智模型
- 技術邊界：branch 仍是 ref，worktree 才是工作目錄與獨立狀態 —— 來源 article §Worktree 的心智模型

**開發計畫**：

- step 1 (~8s) — 單一 Git 歷史連到多個彼此分開的工作目錄
- step 2 (~8s) — 在一棵 worktree 產生 commit，另一棵立刻能看見同一 commit
- step 3 (~10s) — 專案檔案、依賴與 build output 的額外磁碟成本明確列出
- step 4 (~7s) — 「把分支實體化」成多個並排工作房間的核心心智模型
- step 5 (~11s) — branch ref 與 worktree 的 directory、HEAD、index 做精確拆分
- step 6 (~9s) — main worktree、linked worktree 與 shared Git objects 的關係總圖

口播節選：
> Worktree 把分支實體化了。每個分支有自己的工作房間。

---

## 4. cli-create — 建立、查看與切換 Worktree（6 steps · ~47s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 查看命令：`git worktree list` —— 來源 article §基本操作
- 新分支命令：`git worktree add -b hotfix/payment-timeout ../project-hotfix main` —— 來源 article §基本操作
- 既有分支命令：`git worktree add ../project-feature feature/account-page` —— 來源 article §基本操作
- 操作差異：切換工作是進入另一個資料夾，不是在原目錄反覆 `git switch` —— 來源 article §基本操作
- 並行狀態：feature 與 hotfix 可各自保有終端、服務與編輯器視窗 —— 來源 article §典型困境、§基本操作

**開發計畫**：

- step 1 (~7s) — 模擬終端顯示 `git worktree list` 與兩棵工作目錄的位置
- step 2 (~9s) — `git worktree add` 指令骨架拆成新目錄、新 branch 與起點 commit
- step 3 (~7s) — 完整 hotfix 建立命令置中，`-b` 與 `main` 成為主要閱讀焦點
- step 4 (~8s) — 既有 branch 建立方式與新 branch 建立方式並排對照
- step 5 (~8s) — 從 `git switch` 的單目錄切換改成走進另一個實體資料夾
- step 6 (~8s) — feature 與 hotfix 各自擁有終端與服務的雙工作現場

口播節選：
> 所謂切換，也變得很直覺。你不用來回 git switch。直接走進另一個資料夾。

---

## 5. cli-cleanup — 收尾不是直接刪資料夾（4 steps · ~33s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 收尾前檢查：確認修改已 commit、push 或妥善保存 —— 來源 article §基本操作
- 移除命令：`git worktree remove ../project-hotfix` —— 來源 article §基本操作
- 保護機制：有 tracked 修改或 untracked 檔案時 remove 會拒絕 —— 來源 article §限制與注意事項
- Branch 生命週期：移除 worktree 不等於刪 branch，合併後再用 `git branch -d` —— 來源 article §基本操作

**開發計畫**：

- step 1 (~8s) — worktree 收尾檢查表只保留 status、commit 與 push 三個狀態
- step 2 (~8s) — `git worktree remove` 對準已乾淨的 linked worktree 路徑
- step 3 (~9s) — dirty worktree 被 Git 拒絕移除，`--force` 標為非常態手段
- step 4 (~8s) — worktree 目錄消失但 branch ref 保留，合併後才另行刪除

口播節選：
> 注意，worktree 消失了，branch 不會跟著消失。確認合併後再另外刪 branch。

---

## 6. vscode-manager — 在 VS Code 用按鈕完成整段流程（8 steps · ~69s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 擴充套件：Git Worktree Manager，識別碼 `jackiotyu.git-worktree-manager` —— 來源 article §VS Code 實作素材、素材/擴充套件截圖.png
- 建立入口：側邊欄「新增 Worktree」與 Worktree 清單 —— 來源 article §VS Code 實作素材、素材/vscode新增worktree.png
- 建立流程：選新分支、挑基準 branch、輸入 `.worktrees` 下的目錄 —— 來源 article §VS Code 實作素材、素材/vscode新增worktree_step2.png、step3.png
- 雙視窗結果：原 feature 與 hotfix 分開開啟，終端與 Source Control 各自獨立 —— 來源 article §VS Code 實作素材、素材/vscode新增worktree_step4.png 至 step7.png
- 移除流程：Worktree 操作選單選「移除 Worktree」，清單恢復乾淨 —— 來源 article §VS Code 實作素材、素材/vscode新增worktree_step8.png、step9.png

**開發計畫**：

- step 1 (~10s) — VS Code 側邊欄與 Git Worktree Manager 名稱並列，常用操作集中在單一面板
- step 2 (~9s) — 擴充套件詳情截圖聚焦名稱、作者與識別碼
- step 3 (~9s) — 建立流程截圖依序呈現「新增 Worktree」、建立新分支與選基準 branch
- step 4 (~8s) — 目錄輸入截圖聚焦 `.worktrees/第一階段hotfix` 路徑
- step 5 (~8s) — Worktree 清單新增 hotfix，提供在新視窗開啟的入口
- step 6 (~8s) — 兩個 VS Code 視窗並排，feature 與 hotfix 各停在自己的資料夾
- step 7 (~9s) — 兩側 Source Control、終端與 branch 狀態各自保持獨立
- step 8 (~8s) — 操作選單選擇移除 Worktree，最後回到只剩主工作目錄的清單

口播節選：
> 現在兩個 VS Code 並排。一邊留在原功能。一邊處理緊急調整。

---

## 7. real-world-agents — 從 Hotfix 到 Coding Agent 的隔離工作區（8 steps · ~68s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- Hotfix：保留原 feature 的檔案、服務、視窗與思考上下文 —— 來源 article §實務情境
- Code review：PR branch 在旁邊測試，完成後直接移除 —— 來源 article §實務情境
- 實驗工作：spike、migration、大型重構與穩定工作目錄分開 —— 來源 article §實務情境
- Agent 行為：會修改檔案、格式化、測試、build，甚至建立 commit —— 來源 article §Coding Agent 為何使用 worktree
- Agent 價值：每個 task 擁有獨立 checkout，最後用 diff、commit 或 merge 檢查成果 —— 來源 article §Coding Agent 為何使用 worktree
- 隔離邊界：資料庫、port、container、cloud credential 與 cache 仍需額外管理 —— 來源 article §Coding Agent 為何使用 worktree

**開發計畫**：

- step 1 (~9s) — Hotfix 插隊時，原 feature 的檔案、服務與視窗完整留在原地
- step 2 (~8s) — PR branch 成為可隨時建立與回收的 code review 工作區
- step 3 (~8s) — 大型重構與 spike 放進可丟棄的獨立工作目錄
- step 4 (~8s) — Coding Agent 對檔案系統執行修改、格式化、測試與 build
- step 5 (~10s) — 兩個 agent 共用同一目錄時，修改、branch 與測試輸出互相碰撞
- step 6 (~8s) — 每個 task 對應一棵 worktree，形成多條並行工作線
- step 7 (~9s) — Agent 成果以 diff、commit 與 merge 決定採用或回收
- step 8 (~8s) — 檔案隔離之外，資料庫、port 與 container 仍落在共享外部環境

口播節選：
> 每個 task 分一棵 worktree，就有獨立的 checkout 和檔案現場。多個任務可以同時進行。

---

## 8. limitations — 共用 Git，也共用風險（8 steps · ~67s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- Branch 限制：同一 local branch 預設不能同時 checkout 到兩棵 worktree —— 來源 article §限制與注意事項
- 共用狀態：refs、Git objects 與 `refs/stash` 在 repository 範圍共享 —— 來源 article §限制與注意事項
- 環境隔離：每棵 worktree 仍需自己的 `.env`、依賴、build output、port 與資料庫名稱 —— 來源 article §限制與注意事項
- 維護命令：日常移動用 `move`，手動刪除後用 `prune`，手動移動後用 `repair` —— 來源 article §限制與注意事項
- 離線目錄：隨身碟或網路磁碟可用 `lock --reason` 防止管理資訊被清理 —— 來源 article §限制與注意事項
- 相容性：submodule 與特殊工具鏈導入前要用真實專案驗證 —— 來源 article §限制與注意事項

**開發計畫**：

- step 1 (~8s) — 同一 local branch 嘗試被兩棵 worktree 同時 checkout，第二棵被拒絕
- step 2 (~9s) — refs 與 Git objects 從中央 repository 同時連到所有 worktree
- step 3 (~8s) — 共用 stash 池中標出容易拿錯的多筆暫存內容
- step 4 (~9s) — 每棵工作目錄各自列出環境檔、依賴、port 與本機資料庫名稱
- step 5 (~7s) — 檔案管理器直接拖曳與刪除 linked worktree 被列為錯誤操作
- step 6 (~9s) — `move`、`prune`、`repair` 三個命令對應各自的維護情境
- step 7 (~8s) — 隨身碟與網路磁碟情境配對 `lock --reason`
- step 8 (~9s) — submodule 與特殊工具鏈進入團隊前先通過真實專案驗證

口播節選：
> 同一個 local branch，預設不能開在兩棵 worktree。

---

## 9. team-workflow — 把 Worktree 變成團隊習慣（5 steps · ~46s）

**信息池**（chapter agent 按需掛角標 / 副標 / pull-quote / mono cue）：
- 目錄規則：worktree 集中放在 repository 同層的 `<repo>.worktrees/` —— 來源 article §團隊工作流建議
- 命名規則：資料夾名稱與 branch 或 ticket 對齊，例如 `PROJ-123-hotfix` —— 來源 article §團隊工作流建議
- 建立清單：配置 `.env`、專用 port、依賴與本機資源名稱 —— 來源 article §團隊工作流建議
- 收尾清單：確認 commit、push、PR 與合併狀態，再移除 worktree —— 來源 article §團隊工作流建議
- 選用原則：普通小修改使用 branch；上下文切換、並行環境與 Agent task 才優先使用 worktree —— 來源 article §團隊工作流建議

**開發計畫**：

- step 1 (~10s) — 團隊目錄樹展示集中式 worktrees 位置與 ticket／branch 命名規則
- step 2 (~13s) — 建立到回收的工作流只保留環境、依賴、commit、push、PR、merge 六個檢查點
- step 3 (~8s) — Branch 與 Worktree 的關係收束為「不是替代，而是同時在桌面」
- step 4 (~8s) — 普通 branch 與 worktree 的選用門檻做成二選一判斷
- step 5 (~7s) — 結尾定格：「給那個 branch 一個自己的房間」與「保留你的上下文」

口播節選：
> 下次 hotfix 插隊時，別急著 stash。給那個 branch 一個自己的房間。

---

## 素材清單

### 1. context-switch
- ⚠️ feature 被 hotfix 打斷的工作現場（待以 CSS / 模擬終端呈現）
- ⚠️ stash conflict 的 Git 狀態畫面（待以 CSS / 模擬終端呈現）

### 2. esim-analogy
- ⚠️ 手機與多 eSIM 的主視覺（待製作；可用 CSS / SVG，不使用品牌手機照片）
- ⚠️ 多支手機對照單一手機的構圖（待製作）

### 3. mental-model
- ⚠️ repository、refs、HEAD、index 與多 worktree 關係圖（待製作）
- ⚠️ 多個「工作房間」的心智模型畫面（待製作）

### 4. cli-create
- ⚠️ `git worktree list`、`add -b` 與既有分支的模擬終端（待製作）
- ⚠️ feature / hotfix 雙終端與雙服務畫面（待製作）

### 5. cli-cleanup
- ⚠️ clean / dirty worktree 的 remove 對照（待製作）
- ⚠️ worktree 目錄與 branch ref 分離的關係圖（待製作）

### 6. vscode-manager
- ✓ 擴充套件詳情頁（`素材/擴充套件截圖.png`）
- ✓ 建立 Worktree 起始畫面（`素材/vscode新增worktree.png`）
- ✓ 選擇基準分支（`素材/vscode新增worktree_step2.png`）
- ✓ 輸入 Worktree 目錄（`素材/vscode新增worktree_step3.png`）
- ✓ 建立結果與新視窗入口（`素材/vscode新增worktree_step4.png`）
- ✓ 雙 VS Code 視窗與獨立終端（`素材/vscode新增worktree_step5.png`）
- ✓ 雙分支修改與 Source Control（`素材/vscode新增worktree_step6.png`、`素材/vscode新增worktree_step7.png`）
- ✓ 移除 Worktree 選單與完成結果（`素材/vscode新增worktree_step8.png`、`素材/vscode新增worktree_step9.png`）

### 7. real-world-agents
- ⚠️ Hotfix、code review、spike 三種實務情境圖（待製作）
- ⚠️ Coding Agent 多 task / 多 worktree 關係圖（待製作）
- ⚠️ 資料庫、port、container 外部資源衝突示意（待製作）

### 8. limitations
- ⚠️ 同一 branch 重複 checkout 的錯誤訊息（待以模擬終端呈現）
- ⚠️ `move` / `prune` / `repair` / `lock` 情境圖（待製作）
- ⚠️ submodule 與工具鏈相容性驗證提示（待製作）

### 9. team-workflow
- ⚠️ 團隊 worktrees 目錄範例（待以模擬目錄樹呈現）
- ⚠️ 建立與回收 checklist（待製作）
