# Video Outline — Git Worktree 團隊分享

> **主題**：`we-bare-bears`（熊熊遇見你）—— 奶油紙張 + 天空藍強調色 + 圓潤手繪輪廓的親切協作感（CP-1 已確認）
> **總時長**：約 11 分 26 秒（口播 2880 字 ÷ 4.2 字/秒 = 686 秒）
> **章節數**：封面 + 13 章 / 76 步

---

## 進度看板

<!-- agent 每次接手先讀這一段；每過一個硬節點立刻回寫，不可延後。 -->

| # | Checkpoint | 狀態 | 備註 |
|---|---|---|---|
| CP-0 | 內容自檢（script.md / outline.md） | ✅ | 依用戶指定流程重排後重跑自檢並修復 |
| CP-1 | Checkpoint Plan（稿子 / outline / 主題 / 素材 / 模式） | ✅ | 主題：we-bare-bears ／ 講者：莊詠翔 ／ 開發模式：B |
| CP-2 | 封面 + 第 1 章驗收（硬節點） | ✅ | 用戶已回覆「繼續」 |
| CP-3 | 第 2~N 章驗收 | 🔵 | 模式 B：依用戶逐章反饋進行剩餘驗收校對 |
| CP-4 | Checkpoint Audio（是否合成音訊） | ⬜ | |
| CP-5 | Phase 4 錄屏路徑確認 | ⬜ | |

| 章節 | 狀態 | 備註 |
|---|---|---|
| 00-cover | ✅ | 講者：莊詠翔 ／ 日期：2026.08.29 |
| 01-scenes | 🔵 | 6 steps 完成；未 commit 插圖與多 branch 圖已逐畫面驗收 |
| 02-switch-cost | 🔵 | 1 step 完成；feature / hotfix 循環切換已驗收 |
| 03-old-ways | 🔵 | 8 steps 完成；重複 repo 容量插圖與 git log 頁已驗收 |
| 04-concept | 🔵 | repository → 三個資料夾橫向圖已驗收 |
| 05-vs-clone | 🔵 | 7 steps 完成；型別與逐畫面驗收通過 |
| 06-esim | 🔵 | 7 steps 完成；型別與逐畫面驗收通過 |
| 07-cmd-create | 🔵 | 5 steps 完成；型別與逐畫面驗收通過 |
| 08-cmd-manage | 🔵 | 7 steps 完成；型別與逐畫面驗收通過 |
| 09-traps | 🔵 | 7 steps 完成；型別與逐畫面驗收通過 |
| 10-vscode | 🔵 | 8 steps 完成；9 張實拍素材已接入並逐畫面驗收 |
| 11-agent-risk | 🔵 | 3 steps 完成；品牌 icon、workitem 對應與衝突插圖已驗收 |
| 12-agent-isolation | 🔵 | 4 steps 完成；資料夾 / branch 區別動畫與 Git icon 已驗收 |
| 13-closing | 🔵 | Agent icon 與獨立 worktree 收尾頁已驗收 |

狀態詞彙（固定，不得自創）：⬜ 未開始 ／ 🟡 進行中 ／ 🔵 待用戶驗收 ／ ✅ 已通過 ／ ⏭️ 已跳過

> **本版結構依用戶指定流程重排**：情境（含插圖）→ 切換代價 → 舊做法總覽與各自優缺點 →
> worktree 概念 → 跟 clone 的差異 → eSIM 比喻 → 每個指令獨立一步 → 共用的坑 →
> VS Code 擴充套件 → Coding Agent（共享目錄風險 / Task 隔離）→ 收尾。
> 原「團隊工作流建議」章節已依指示移除。

---

## 0. 00-cover — 封面（1 step · ~8s）

**信息池**：
- 標題：Git Worktree ／ 副標題：一個 repo，同時開好幾個工作現場
- 講者或出處：莊詠翔（分享日期：2026.08.29）
- 重點清單預告：卡住的現場 → 舊做法的代價 → worktree 概念 → 指令 → VS Code → Coding Agent —— 來源 本 outline 章節結構
- 分享目標：看完能自己建立、切換、檢查與移除 worktree，也知道哪些情況不適合 —— 來源 article §分享目標 / L5
- 可用的一句話定義：同一個 repository 管理的多個 working trees —— 來源 article §Worktree 的心智模型 / L19

**開發計劃**：

- step 1 (~8s) — 主標題 + 副標 + 講者與日期 + 重點清單預告卡（六項，一次呈現不逐項揭示）

口播節選：
> feature 寫到一半，production 出事。這時候你會怎麼做？

---

## 1. 01-scenes — 日常就有這麼多切換現場（6 steps · ~52s）

**信息池**：
- 情境一（hotfix 插隊）現場細節：feature 尚有一批未提交修改，工作現場還沒收完 —— 來源 article §典型困境 / L9
- 情境二：PR 已送審、review 未結束，開發者必須先開始下一個工項 —— 來源 article §典型困境 / L13
- 情境三：同一專案長期並存兩個版本，第一階段已上線維護、第二階段依新合約開發 —— 來源 article §典型困境 / L13
- 技術限制：單一 working directory 不能同時保留 feature 與 hotfix 兩個 checkout —— 來源 article §典型困境 / L11
- 收束論點：這些不是偶發例外，而是同一位開發者同時背著多個工作現場 —— 來源 article §典型困境 / L13

**插圖描述**（寫了就必須在開發本章前生成素材）:
- [step 1] 主角坐在自己的工作桌前同時被塞進好幾件工作，桌面散落沒收完的資料夾、工具與紙張，一手還按在鍵盤上、另一手抱著東西，表情忙亂，背景是 Git 多個分支，要頻繁切換的示意圖；構圖把主角安排在畫面右半，左半留白給標題 → `illustrations/scenes/overloaded-dev.png`
- [step 3] 主角正在桌前處理 feature，本地資料夾裡堆著大量未提交變更，production hotfix 突然從旁插入；主角與工作桌偏右，左側保留標題空間 → `illustrations/scenes/uncommitted-interruption.png`

**開發計劃**：

- step 1 (~7s) — 章節開場：一個人手上同時壓著好幾個工作（插圖 + 標題，情境內容還沒展開）
- step 2 (~10s) — 情境一登場：feature 分支寫到一半，production 出事，hotfix 插隊
- step 3 (~8s) — 切走前只聚焦一個原因：本地堆著大量未 commit 修改，現場還沒收完
- step 4 (~10s) — 情境二：PR 送審中，review 未結束，人不能停在原地
- step 5 (~9s) — 情境三：同一專案衍生多個 branch 節點，第一階段維護與第二階段開發長期並存
- step 6 (~8s) — 收束：hotfix、PR review、雙版本三個現場疊在同一個人身上

口播節選：
> 這些不是偶發例外。是同一個人，同時背著好幾個工作現場。

---

## 2. 02-switch-cost — 切換到底貴在哪（1 step · ~10s）

**信息池**：
- 技術限制：單一 working directory 一次只能呈現一個 checkout —— 來源 article §典型困境 / L11
- checkout 代表工作目錄當下呈現的版本內容 —— 來源 article §典型困境 / L11
- feature 與 hotfix 只能輪流占用同一個工作目錄，無法並排保留 —— 來源 article §典型困境 / L11
- 呼應：需要同時保留多個可執行環境時，單一 checkout 不夠用 —— 來源 article §團隊工作流建議 / L103

**開發計劃**：

- step 1 (~10s) — 核心限制：同一個 working directory 的唯一 checkout 槽位，輪流呈現 feature 與 hotfix

口播節選：
> 問題在哪？一個 working directory，一次只能呈現一個 checkout。

---

## 3. 03-old-ways — 舊做法三種，各自的優缺點（8 steps · ~64s）

> 依指示：先一步做總覽，之後每種做法各自佔畫面，優點先亮、缺點再亮。

**信息池**：
- 做法一（暫時 commit）代價：把尚未整理好的狀態寫進 branch history，之後要切回、整理或重寫歷史 —— 來源 article §典型困境 / L15
- 做法二（stash）優點：能保持 working tree 乾淨 —— 來源 article §典型困境 / L15
- 做法二代價：套回時可能衝突，也容易在多筆 stash 中取錯 —— 來源 article §典型困境 / L15
- 做法三（額外 clone）優點：隔離最完整 —— 來源 article §典型困境 / L15
- 做法三代價：每份 clone 都複製一套 repository；假設一份 Git repo 為 1 GB，三份 clone 光 Git 物件就是 3 GB —— 來源 article §典型困境 / L15
- 做法三代價續：clone A 的新 commit 不會直接出現在 clone B 的 git log，仍要透過 fetch、push 交換 —— 來源 article §典型困境 / L15

**插圖描述**（寫了就必須在開發本章前生成素材）:
- [step 7] 三個巨大 Git repository 容器各自包住一套相同專案資料夾，並排擠滿儲存空間，清楚呈現重複實體的浪費；畫面不含文字 → `illustrations/old-ways/duplicate-repositories-v2.png`

**開發計劃**：

- step 1 (~5s) — 總覽頁：三種舊做法的標籤並列，內容還沒展開
- step 2 (~8s) — 做法一佔畫面：暫時 commit 一個 WIP，優點欄先亮（東西不會丟、切得快）
- step 3 (~10s) — 做法一的缺點欄亮起：WIP 寫進 branch history，之後要整理甚至改寫歷史
- step 4 (~10s) — 做法二佔畫面：stash，優點欄亮（working tree 立刻乾淨、不留半成品 commit）
- step 5 (~7s) — 做法二的缺點欄亮起：套回衝突、多筆容易取錯
- step 6 (~8s) — 做法三佔畫面：再 clone 一份，優點欄亮（隔離最完整、互不影響）
- step 7 (~8s) — 做法三的缺點欄亮起：三份完整 Git repo 並排，每份以 HTML 標示 1 GB，工作檔案仍另計
- step 8 (~8s) — 具體演示：這邊 commit，那邊 git log 看不到，要 fetch / push 才交換得到

口播節選：
> 缺點是套回來可能衝突。stash 一多，也很容易取錯那一筆。

---

## 4. 04-concept — worktree 的概念（7 steps · ~62s）

**信息池**：
- 官方定義：同一個 repository 所管理的多個 working trees —— 來源 article §Worktree 的心智模型 / L19
- 名詞對照：一般 clone 建立 main worktree；git worktree add 建立 linked worktree —— 來源 article §心智模型 / L19
- 各自獨立的東西：自己的目錄、HEAD 與 index，因此能同時 checkout 不同分支 —— 來源 article §心智模型 / L19
- 共享的東西：同一套 Git object database 與大部分 refs —— 來源 article §心智模型 / L19
- 心智模型與其邊界：把分支實體化成另一個資料夾；branch 本身仍只是一個 ref，worktree 是該版本內容的工作目錄加上 Git 為它保存的獨立狀態 —— 來源 article §心智模型 / L21
- 官方文件出處：git-scm.com/docs/git-worktree —— 來源 article §查證來源 / L107

**開發計劃**：

- step 1 (~4s) — 轉場句佔屏：worktree 就是為了這件事做的
- step 2 (~10s) — 官方定義卡：帶 Git icon 的 repository 橫向衍生 main、feature、hotfix 三個資料夾，附文件出處小字
- step 3 (~11s) — 兩種 worktree 的對照：main worktree 與 linked worktree
- step 4 (~12s) — 每棵 linked worktree 各自的目錄 / HEAD / index，兩棵同時停在不同分支
- step 5 (~8s) — 底層共享區浮現：object database 與大部分 refs
- step 6 (~5s) — 心智模型一句話：把分支實體化成另一個資料夾
- step 7 (~12s) — 修正誤解：branch 仍是 ref，worktree 是工作目錄加上獨立狀態

口播節選：
> 每個 linked worktree 有自己的目錄、HEAD 跟 index。所以能同時 checkout 不同分支。

---

## 5. 05-vs-clone — 跟剛剛那個多 clone 一份差在哪（7 steps · ~47s）

**信息池**：
- 多次 clone 的結果：多個彼此獨立的 repository，各有 object database、remote 設定、refs 與 maintenance 狀態 —— 來源 article §和多次 clone 的差異 / L25
- 多次 clone 的代價：重複下載和保存 Git 物件，branch 與 fetch 狀態要各自同步 —— 來源 article §差異 / L25
- worktree 的差別：共用同一個 repository 的歷史與 refs，新 worktree 建立更快，不必再抓一次完整歷史 —— 來源 article §差異 / L27
- 關鍵好處：任何一棵 worktree 做出的 commit，其他 worktree 立即看得到 —— 來源 article §差異 / L27
- 可佐證的實拍：hotfix worktree 提交後，主視窗 git graph 立刻出現該 commit —— 來源 素材/vscode新增worktree_step7.png

**開發計劃**：

- step 1 (~5s) — 回扣第 3 章的第三種舊做法，提出比較問題
- step 2 (~7s) — 左側立起來：多 clone 等於好幾個彼此獨立的 repository
- step 3 (~9s) — 每份 clone 自帶的三樣東西逐個亮起：object database、remote 設定、refs
- step 4 (~6s) — 右側立起來：worktree 共用同一份歷史與 refs
- step 5 (~5s) — 建立速度差：不用再抓一次完整歷史
- step 6 (~5s) — 決定性差異演示：一棵做的 commit，另一棵立刻出現
- step 7 (~10s) — 收束對照：各過各的，對上同一份歷史開多個現場

口播節選：
> 這就是最大的差別。多 clone 是各過各的，worktree 是同一份歷史開多個現場。

---

## 6. 06-esim — 手機與 eSIM 的比喻（7 steps · ~48s）

**信息池**：
- 比喻主體：多次 clone 像每多一個門號就再買一支手機，每支手機都有自己的一整套系統與資料 —— 來源 article §差異 / L29
- 比喻對照：worktree 像一支手機安裝多個 eSIM 設定，底層裝置只有一套，不同門號各自使用 —— 來源 article §差異 / L29
- 對應回 Git：共用的是 repository 的歷史與物件，不同 worktree 各自呈現一個 checkout —— 來源 article §差異 / L29
- 比喻的邊界（必說）：只說明共享底層、分開使用；worktree 的專案檔案和依賴仍會占額外空間 —— 來源 article §差異 / L29
- 各自要準備的東西：node_modules、build output、未追蹤檔案與本機環境；每棵 worktree 都要處理自己的依賴、`.env`、port —— 來源 article §差異 / L27、§限制 / L94

**開發計劃**：

- step 1 (~5s) — 比喻登場：一支手機的輪廓進畫面
- step 2 (~9s) — 多 clone 側：一個門號配一支手機，手機一支一支增加，每支各自帶著整套系統
- step 3 (~6s) — worktree 側：一支手機，多張 eSIM 設定
- step 4 (~4s) — 底層裝置只有一套，不同門號各自使用
- step 5 (~7s) — 比喻對應回 Git：共用的是 repository 的歷史與物件
- step 6 (~5s) — 比喻的邊界警示：實體檔案還是各有一份
- step 7 (~12s) — 各自要準備的清單：node_modules、build output、.env、port，不是零磁碟成本

口播節選：
> worktree 比較像一支手機裝好幾個 eSIM。底層裝置只有一套，不同門號各自使用。

---

## 7. 07-cmd-create — 指令：查看與建立（5 steps · ~39s）

> 依指示：**一個指令佔一步**，每一步都要有動畫演示該指令做了什麼（目錄樹長出新節點 / 分支線分岔 / 終端機輸出逐行落下等）。

**信息池**：
- 查看：`git worktree list` —— 來源 article §基本操作 / L36
- 建立新分支到相鄰目錄：`git worktree add -b hotfix/payment-timeout ../project-hotfix main` —— 來源 article §基本操作 / L42
- 既有分支開成工作目錄：`git worktree add ../project-feature feature/account-page` —— 來源 article §基本操作 / L48
- 切換方式：`cd ../project-hotfix`，或直接用另一個 VS Code 視窗開啟，而不是在同一資料夾反覆 `git switch` —— 來源 article §基本操作 / L51-54
- 實務效益：保留原本視窗與服務，另開 hotfix worktree —— 來源 article §實務情境 / L77

**開發計劃**：

- step 1 (~4s) — 指令清單登場，位置先留空
- step 2 (~8s) — `git worktree list`：終端機輸出目前所有工作目錄
- step 3 (~10s) — `git worktree add -b`：從 main 分出新分支，隔壁長出一個新資料夾
- step 4 (~6s) — `git worktree add`（既有分支版）：目錄與分支名直接對接
- step 5 (~11s) — 切換演示：不再是同一資料夾反覆 `git switch`，而是換資料夾或換視窗

口播節選：
> git worktree add 加上 -b。從 main 開一個新分支，放到隔壁的資料夾。

---

## 8. 08-cmd-manage — 指令：移除與維護（7 steps · ~69s）

> 依指示：**一個指令佔一步**，每一步都要有動畫演示（資料夾消失 / 關聯線修復 / 過期節點被清掉 / 鎖扣上等）。

**信息池**：
- 移除前提：先確認變更已提交或已妥善保存，再 `git worktree remove ../project-hotfix` —— 來源 article §基本操作 / L57-60
- remove 的保護：linked worktree 有未提交或未追蹤檔案時會拒絕，不要習慣用 `--force` —— 來源 article §限制 / L93
- 關鍵區分：移除 worktree 不等於刪除 branch；確認已合併後才 `git branch -d hotfix/payment-timeout` —— 來源 article §基本操作 / L63-66
- `git worktree move`：平常搬家用它，不要直接拖曳資料夾 —— 來源 article §基本操作 / L69
- `git worktree repair`：曾手動移動過，優先用它修復關聯 —— 來源 article §基本操作 / L69
- `git worktree prune`：曾手動刪除資料夾，用它清掉過期管理資訊 —— 來源 article §基本操作 / L69
- `git worktree lock --reason`：放在隨身碟或偶爾離線的網路磁碟時防止被 prune —— 來源 article §限制 / L96

**開發計劃**：

- step 1 (~4s) — 維護指令清單登場，位置先留空
- step 2 (~13s) — `git worktree remove`：資料夾被移除；有未提交或未追蹤檔案時被擋下
- step 3 (~13s) — 對照演示：worktree 消失了但 branch 還在，`git branch -d` 是另一個獨立動作
- step 4 (~8s) — `git worktree move`：資料夾整個搬位置，關聯跟著更新
- step 5 (~8s) — `git worktree repair`：斷掉的關聯線被接回去
- step 6 (~10s) — `git worktree prune`：過期的管理資訊節點被清掉
- step 7 (~13s) — `git worktree lock --reason`：鎖扣上，prune 掃過去也不會動它

口播節選：
> 注意，移除 worktree 不等於刪掉 branch。branch 要另外確認合併過，才用 git branch -d。

---

## 9. 09-traps — 共用帶來的坑（7 steps · ~60s）

**信息池**：
- 坑一：Git 預設不允許同一個 local branch 同時 checkout 到兩棵 worktree，避免兩邊同時推進同一 ref —— 來源 article §限制與注意事項 / L90
- 坑二：refs 與 object database 是共享的，刪 branch、改 tag、fetch、commit 等動作會被其他 worktree 看見 —— 來源 article §限制 / L91
- 坑二的誤解：不要把它誤認成完全獨立的 clone —— 來源 article §限制 / L91
- 坑三：stash 通常也是 repository 共用的 `refs/stash`，命名與取用要小心避免拿錯 —— 來源 article §限制 / L92
- 導入前提：submodule 與特殊工具鏈對多 worktree 的支援程度不一，導入前要用團隊專案實測 —— 來源 article §限制 / L97
- 反向佐證：移除 worktree 之後，它做的 commit 仍留在共享歷史裡 —— 來源 素材/vscode新增worktree_step9.png

**開發計劃**：

- step 1 (~4s) — 坑的清單登場，位置先留空
- step 2 (~11s) — 坑一：同一個 local branch 被兩棵 worktree 同時 checkout 時被擋下
- step 3 (~5s) — 擋下的理由：避免兩邊同時推進同一個 ref
- step 4 (~6s) — 坑二：refs 與 object database 的共享區被點亮
- step 5 (~13s) — 會被其他 worktree 看見的動作逐個亮起：刪 branch、改 tag、fetch、commit
- step 6 (~11s) — 坑三：refs/stash 也是整個 repository 共用，命名與取用要小心
- step 7 (~10s) — 導入前提：submodule 與特殊工具鏈支援程度不一，要用團隊專案實測

口播節選：
> 刪 branch、改 tag、fetch、commit，其他 worktree 都看得到。它不是完全獨立的 clone。

---

## 10. 10-vscode — 不用背指令：VS Code 擴充套件（8 steps · ~76s）

**信息池**：
- 擴充套件名稱與識別碼：Git Worktree Manager，`jackiotyu.git-worktree-manager` —— 來源 article §VS Code 實作素材 / L73
- 市集頁中繼資料：作者 jackiotyu、版本 3.25.0、MIT 授權、下載數 44k —— 來源 素材/擴充套件截圖.png
- 示範流程：側邊欄按新增 Worktree、選建立新分支、挑基準分支、輸入 worktree 目錄、在另一個 VS Code 視窗開啟 —— 來源 article §VS Code 實作素材 / L73
- 實拍目錄命名：`d:\個人專案\Test.worktrees\第一階段hotfix`，對應 `<repo>.worktrees/` 的命名習慣 —— 來源 素材/vscode新增worktree_step3.png、article §團隊工作流建議 / L101
- 兩視窗並存實拍：各自的檔案總管、終端機與原始檔控制，分別提交 —— 來源 素材/vscode新增worktree_step5.png、_step6.png
- 共享歷史實證：hotfix 視窗提交後，主視窗 git graph 立即出現該 commit —— 來源 素材/vscode新增worktree_step7.png
- 移除入口與移除後狀態：操作選單含移動 / 修復 / 移除 / 鎖定；移除後該 commit 仍在歷史裡 —— 來源 素材/vscode新增worktree_step8.png、_step9.png

**開發計劃**：

- step 1 (~9s) — 轉場：指令不用背，畫面換成 VS Code
- step 2 (~15s) — 擴充套件市集頁截圖：名稱、識別碼、授權與版本
- step 3 (~8s) — 新增 Worktree 與選擇基準分支的截圖
- step 4 (~10s) — 輸入 worktree 目錄的截圖，`.worktrees` 命名習慣被標註出來
- step 5 (~4s) — 在另一個 VS Code 視窗開啟
- step 6 (~10s) — 兩個視窗並存的截圖，各自編輯與提交
- step 7 (~10s) — 共享歷史實證截圖：hotfix 一提交，主視窗 git graph 立刻出現
- step 8 (~10s) — 移除操作選單截圖，加上移除後歷史仍在的截圖

口播節選：
> hotfix 那邊一提交，主視窗的 git graph 立刻就看到了。這就是共用同一份歷史。

---

## 11. 11-agent-risk — Coding Agent：共享目錄的風險（3 steps · ~25s）

**信息池**：
- agent 角色：Codex 1、Codex 2、Claude、Copilot 各自處理不同 work item —— 來源 article §Coding Agent / L84
- 共用目錄的衝突：多個 agent 雖然任務不同，仍同時寫進同一個工作目錄 —— 來源 article §Coding Agent / L84
- 衝突的後果：多個 agent 同時修改相同資料夾，彼此覆蓋或污染測試結果 —— 來源 article §Coding Agent / L84
- 對照前文：這正是第 2 章「單一 working directory 一次只能一個 checkout」的多人版本 —— 來源 article §典型困境 / L11
- 相關實務情境：spike、migration 或大型重構，實驗與穩定工作目錄要分開 —— 來源 article §實務情境 / L80

**插圖描述**（寫了就必須在開發本章前生成素材）:
- [step 3] 四位熊熊 coding agent 從四個方向同時修改中央同一個專案資料夾，檔案與紙張互相覆蓋、測試指示燈混亂，呈現並行衝突；畫面不含文字 → `illustrations/agent-risk/shared-folder-conflict.png`

**開發計劃**：

- step 1 (~6s) — Coding Agent 章節封面：Claude、Codex、Copilot 三個品牌 icon 登場
- step 2 (~10s) — Codex 1、Codex 2、Claude、Copilot 各自標示 workitem 1～4，卻共同指向同一個資料夾
- step 3 (~9s) — 熊熊主題插圖呈現四個 agent 同時改同一資料夾，HTML 疊加覆蓋與測試污染結果

口播節選：
> Codex 一、Codex 二、Claude、Copilot，各自處理不同 work item，最後卻寫進同一個資料夾。

---

## 12. 12-agent-isolation — Coding Agent：一個 task 一棵 worktree（4 steps · ~33s）

**信息池**：
- 解法：給每個 task 一棵 worktree，隔離檔案系統與 checkout 狀態，同時保留同一份 Git 歷史 —— 來源 article §Coding Agent / L84
- 失敗回收：任務不要了只移除 worktree 資料夾；branch 仍留在 Git 裡，主工作目錄不必復原 —— 來源 article §Coding Agent / L86
- 工具現況：Claude Code 建立任務時可勾選 worktree 選項，畫面同時顯示專案名與 main 分支 —— 來源 素材/claude_worktree.png
- branch 與 worktree 是不同實體：移除工作目錄不等於刪除 branch —— 來源 article §基本操作 / L59
- 相關出處：OpenAI Developers developers.openai.com —— 來源 article §查證來源 / L108

**開發計劃**：

- step 1 (~7s) — 一個 task 一棵 worktree：每個 coding agent icon 都落在獨立資料夾
- step 2 (~7s) — 現場各自隔離；底層 SHARED GIT HISTORY 加入 Git icon
- step 3 (~10s) — 動畫區分 worktree 資料夾與 branch ref：移除資料夾後，branch 仍留在 Git 歷史
- step 4 (~9s) — Claude Code 建立任務畫面截圖，worktree 選項被標出

口播節選：
> 失敗也好收。任務不要了，只移除那個 worktree 資料夾。branch 還留在 Git 裡，主工作目錄也不用動。

---

## 13. 13-closing — 什麼時候不該用（5 steps · ~31s）

**信息池**：
- 反面命題：worktree 不是每個任務都必須使用 —— 來源 article §團隊工作流建議 / L103
- 不需要的情況：只改一個小功能、沒有並行需求時，普通 branch 已經夠好 —— 來源 article §團隊工作流建議 / L103
- 真正有價值的訊號：上下文切換成本高、需要同時保留多個可執行環境、Coding Agent 要並行處理不同 task —— 來源 article §團隊工作流建議 / L103
- 分享目標回扣：成員看完後能自己建立、切換、檢查與移除 worktree —— 來源 article §分享目標 / L5
- 可留給團隊的連結：git-scm.com/docs/git-worktree 與擴充套件市集頁 —— 來源 article §查證來源 / L107

**開發計劃**：

- step 1 (~4s) — 反面命題佔屏：不是每個任務都要用
- step 2 (~7s) — 不需要的情況：小功能、沒有並行需求，普通 branch 就夠
- step 3 (~6s) — 該用的訊號一：切換成本高、要同時保留多個可執行環境
- step 4 (~7s) — 該用的訊號二：Claude、Codex、Copilot icon 對應並行 task
- step 5 (~7s) — 行動呼籲：挑一個手上的專案，開一棵 worktree 試一次

口播節選：
> 回去挑一個你手上真的在做的專案，開一棵 worktree 試一次。

---

## 素材清單

### 0. 00-cover
- ✓ 主題封面版式參考圖（脚手架自動複製到 `public/theme-assets/title-page-style-reference.png`）
- ✓ 講者：莊詠翔／分享日期：2026.08.29

### 1. 01-scenes
- ✓ 主角被多個工作壓住、手忙腳亂的場景（`illustrations/scenes/overloaded-dev.png`）
- ✓ 主角工作到一半、未 commit 變更堆滿本地，hotfix 臨時插入（`illustrations/scenes/uncommitted-interruption.png`）
- ✓ 情境切換的視覺演示由章節自己用 CSS / SVG 畫

### 2. 02-switch-cost
- ✓ 純 CSS / SVG 演示，無外部素材

### 3. 03-old-ways
- ✓ 三份完整 Git repository 重複占用實體空間（`illustrations/old-ways/duplicate-repositories-v2.png`）
- ✓ Git log 不同步仍以 CSS / SVG 演示

### 4. 04-concept
- ✓ 純 CSS / SVG 演示，無外部素材
- ✓ 主題角色圖 `grizzly-presenting`（可選，用在心智模型那一步）
- ✓ Git 與資料夾 icon 使用專案內品牌圖示素材

### 5. 05-vs-clone
- ✓ 純 CSS / SVG 演示，無外部素材

### 6. 06-esim
- ✓ 純 CSS / SVG 演示，手機與 eSIM 圖形自己畫，無外部素材

### 7. 07-cmd-create
- ✓ 純 CSS / SVG 模擬終端機與目錄樹，無外部素材

### 8. 08-cmd-manage
- ✓ 純 CSS / SVG 模擬終端機與目錄樹，無外部素材

### 9. 09-traps
- ✓ 移除後歷史仍在（`素材/vscode新增worktree_step9.png`，可選佐證）

### 10. 10-vscode
- ✓ 擴充套件市集頁（`素材/擴充套件截圖.png`）
- ✓ 建立 Worktree 選擇分支（`素材/vscode新增worktree.png`）
- ✓ 基於既有分支建立新分支（`素材/vscode新增worktree_step2.png`）
- ✓ 輸入 Worktree 目錄（`素材/vscode新增worktree_step3.png`）
- ✓ Worktree 清單兩棵並存（`素材/vscode新增worktree_step4.png`）
- ✓ 兩個 VS Code 視窗並存（`素材/vscode新增worktree_step5.png`）
- ✓ hotfix 視窗獨立提交（`素材/vscode新增worktree_step6.png`）
- ✓ 主視窗立即看到該 commit（`素材/vscode新增worktree_step7.png`）
- ✓ Worktree 操作選單（`素材/vscode新增worktree_step8.png`）
- ✓ 移除後清單剩一棵、歷史仍在（`素材/vscode新增worktree_step9.png`）

### 11. 11-agent-risk
- ✓ 熊熊 coding agents 同時修改同一資料夾造成衝突（`illustrations/agent-risk/shared-folder-conflict.png`）
- ✓ Claude、Codex、Copilot icon 使用專案內品牌圖示素材

### 12. 12-agent-isolation
- ✓ Claude Code 任務建立畫面含 worktree 選項（`素材/claude_worktree.png`）
- ✓ Git、資料夾、Claude、Codex、Copilot icon 使用專案內圖示素材

### 13. 13-closing
- ✓ Claude、Codex、Copilot icon 使用專案內品牌圖示素材

> 三張生成插圖只負責具象情境與氛圍；分支線、資料夾、Git 關係、終端機、手機與
> eSIM、共享區示意、指令動畫仍由章節自己用 CSS / SVG / Canvas 繪製，
> 不以生成圖替代。主題自帶角色圖只在口播確實描述人物行動時穿插。
