# Video Outline — Git Worktree 團隊分享

> **主題**：`we-bare-bears`（熊熊遇見你）—— 奶油紙張 + 天空藍強調色 + 圓潤手繪輪廓的親切協作感（CP-1 已確認）
> **總時長**：約 11 分鐘
> **章節數**：封面 + 11 章 / 57 步

---

## 進度看板

<!-- agent 每次接手先讀這一段；每過一個硬節點立刻回寫，不可延後。 -->

| # | Checkpoint | 狀態 | 備註 |
|---|---|---|---|
| CP-0 | 內容自檢（script.md / outline.md） | ✅ | 依用戶指定流程重排後重跑自檢並修復 |
| CP-1 | Checkpoint Plan（稿子 / outline / 主題 / 素材 / 模式） | ✅ | 主題：we-bare-bears ／ 講者：莊詠翔 ／ 開發模式：B |
| CP-2 | 封面 + 第 1 章驗收（硬節點） | 🔵 | 封面三角色透明背景群像已放大重製，待用戶再次驗收 |
| CP-3 | 第 2~N 章驗收 | 🔵 | 模式 B；已完成一輪全片版型自檢（76 步逐步量測 + 目視），修正見下方「版型自檢紀錄」 |
| CP-4 | Checkpoint Audio（是否合成音訊） | ⬜ | |
| CP-5 | Phase 4 錄屏路徑確認 | ⬜ | |

| 章節 | 狀態 | 備註 |
|---|---|---|
| 00-cover | 🔵 | 講者：莊詠翔 ／ 日期：2026.09.12 ／ 三角色討論群像已改為真正透明 PNG，待驗收 |
| 01-scenes | 🔵 | 5 steps；原 2-6 已移除，原 2-1 群像頁移至章末，待驗收 |
| 02-switch-cost | 🔵 | 1 step 完成；feature / hotfix 循環切換已驗收 |
| 03-old-ways | 🔵 | 8 steps 完成；重複 repo 容量插圖與 git log 頁已驗收 |
| 04-concept | ✅ | 4 steps；5-5「修正誤解」依用戶指示移除 |
| 05-vs-clone | 🔵 | 10 steps；原 06-esim 章整段併入；6-1 / 6-2 依用戶指示移除，eSIM 比喻成為本章開場 |
| 07-cmd-create | 🔵 | 5 steps 完成；型別與逐畫面驗收通過 |
| 08-cmd-manage | 🔵 | 3 steps；8-4~8-7（move / repair / prune / lock）依用戶指示移除，本章只留移除相關 |
| 10-vscode | 🔵 | 8 steps 完成；10-1、10-5 的 VS Code icon 已逐畫面驗收 |
| 11-agent-risk | 🔵 | 3 steps 完成；品牌 icon、workitem 對應與衝突插圖已驗收 |
| 12-agent-isolation | 🔵 | 4 steps 完成；資料夾 / branch 區別動畫與 Git icon 已驗收 |
| 13-closing | 🔵 | Agent icon 與獨立 worktree 收尾頁已驗收 |

### 版型自檢紀錄（全片 76 步）

以 CHAPTER-CRAFT 完工自我檢查逐項執行：對 76 步逐一量測內容外框與舞台
（1920×1080）的四邊留白、溢出、字級，再逐頁目視。修正如下：

**系統性問題**：`.scene-pad` 是 flex 直列但沒有垂直分佈，內容一律靠上堆，
28/76 步下緣留下最多 411px 死區。base.css 補 `justify-content:center`；
另對 21 個把 `display` 覆寫成 grid 的場景補 `justify-content:normal`
（grid 的 justify-content 管的是欄的水平分佈，會把版面往中間擠）。

**個別修正**：
- 4-3 半成品寫入歷史：浮空不接任何節點的弧線 → 改成單一 SVG 座標系，
  時間軸／WIP 節點／回頭改寫箭頭全部對齊，箭頭有明確指向與標籤
- 11-4 放在專案同一層：藍框量的是被 letterbox 的容器而非圖片，永遠落在
  截圖外 → `.vs-shot` 鎖成圖片原生比例，標註改用截圖自身像素座標繪製
- 11-6 兩個視窗：截圖裡兩視窗是疊放不是左右對開，中央垂直藍線無對應物
  → 改成各自框出視窗範圍並掛標籤
- 11-7 主視窗立刻看見：斜線兩端沒接到 commit → 改成框出兩處同一個 commit
  並以帶箭頭曲線連接
- 5-2 一個 repository：`.ct-def-copy` grid 隱式排列把標題擠到右上角
  → 改用顯式 grid-areas
- 6-2 好幾個彼此獨立的 repository：島形 `<i>` 沒給 inset，被排到說明文字
  那一列再置中，把 "no shared history" 壓在島下緣切掉 → 島改 inset:0 置中
  當背景，卡片與說明用 flex 堆疊並重調比例
- 6-4 工作現場分開：整頁用舞台絕對座標畫，垂直置中後連接線脫離卡片
  → 該頁 opt-out 置中
- 4-7 每一份 clone：插圖 16:9 依寬度算出 866px 高，撞出舞台下緣
  → 容器與圖同尺寸，容量標籤按比例重新對到罐子中心
- 10-1 / 14-1 開場：右側大圓佔住畫面，標題壓在圖形上 → 收成文字靠左、
  圖形靠右
- 13-4 直接勾 worktree：`.ai-focus` 同樣是盲寫座標的絕對定位方框，落在截圖
  右下角空白處與小機器人上，沒標到工具列的「☑ worktree」→ 改用截圖原生
  座標（934×637）標註，並加一個 2.8 倍局部放大鏡讓那顆 checkbox 在錄影時
  看得清楚
- 2-6 是日常：版型是四象限放射但只有三個現場，右下角永遠空一塊，收尾句
  被塞進那個洞裡 → 改成對稱三輻條（左／上／右各一個現場，正下方放收尾句），
  四個方位都有內容；同時清掉遺留的 `.sc-site-d` 死規則
- 3-1 一個 working directory：viewport 的 feature／hotfix 用 4.8s 無限循環
  互換，但底下的 checkout slot 是靜態的，看不出當下裝著哪一個 → slot 加上
  分支名交叉淡入、圖例兩顆點亮暗同步、git switch chip 在切換瞬間閃動，
  所有 keyframes 百分比與 sw-feature-loop／sw-hotfix-loop 對齊
- 4-4 stash：原本是「檔案列 → 漏斗 → 暫存箱」的靜態示意，看不出 stash 對
  working tree 與 branch history 各做了什麼 → 改成圖示化的機制演示：分支線上
  四個 commit 節點 + working tree 三個未 commit 變更，`git stash push -u` 下達
  後三張變更卡片以動畫被「吸」進右側虛線的 stash 保險櫃、櫃蓋闔上並掛出
  `stash@{0}`，同時分支線一個節點都沒增加（標註「history 一行都沒動」）。
  分支線、節點與通往 stash 的虛線全部畫在同一個 1600×640 viewBox，HTML 卡片
  也用同一套座標定位，飛行終點必定落在櫃子上。
  同時清掉被取代的 `.ow-stash-stage` / `.ow-files` / `.ow-funnel` /
  `.ow-stash-box` / `.ow-clean` 等 9 條死規則

`npx tsc --noEmit` 通過，主控台無錯誤。

### 標註框：字被自己的底框切掉 + 字型不是主題字型

**10-6 兩個視窗標籤**：一行「第二階段 · feature」量到 342px 寬，底框只有 272px，
字左右各溢出 ~35px 被切掉。而後方視窗唯一的空白處（編輯區 x 310~625）只有
315px，一行怎麼排都塞不下。拆成兩行（第二階段 / feature），最寬的一行是
`feature`（147px），底框 214px 綽綽有餘，字級不必縮。

順手補了一支檢查：找「SVG 群組裡的 `<text>` 溢出同組 `<rect>`」。這種被自己底框
切掉的字，命中測試抓不到（底框在字下面，不是蓋在上面）。全片 74 步掃過，只有
10-6 這一處。

**標註框字型（10-4 / 10-6 / 10-7 / 12-4）**：這幾個框的文字寫死 `--font-mono`
（JetBrains Mono），但那支字型沒有中日韓字符，中文會掉到 fallback。用 canvas
逐像素比對「階」字確認：`JetBrains Mono` / `Noto Sans TC` / `Noto Sans SC` /
無效字型 四種算繪結果**互不相同** —— 所以標註框的中文跟旁邊 `--font-display-cn`
的標題確實是兩套字。字級 26~40px 又大，差異很明顯。

改成：中文走 `--font-display-cn`（900），分支名 `feature` / `hotfix` 這類識別字
維持 `--font-mono`。改完重量一次，四頁都沒有溢出、也沒有中文落在 mono。

同一次比對還測出兩件事：

- `--font-display-cn` 的第一順位 `Noto Sans TC` **確實載入生效**（跟 Noto Sans SC
  的算繪不同），正體字形沒有問題。
- `fonts.css` 匯入的 **`Noto Serif SC` 沒有生效**（算繪結果等同無效字型）。目前
  主題沒有用到它，先不動。

**尚未處理**：全片的小標籤（`sc-eyebrow` / `ow-kicker` / `ct-` 各章 kicker /
`cv-kicker` 等，約 20 步）也是 `--font-mono` 配中文，同樣落在 fallback。那是原本
就一致的版面語言（22px + 字距），改動範圍大，留著待決定。

### 遮蔽自檢（命中測試，全片 74 步）

前一輪的自檢只量「內容外框 vs 舞台」的四邊留白 —— 那種量法對**元素互相重疊**
完全無感（union bbox 一樣漂亮）。用戶回報 11-2 有字被蓋住之後補做這一輪：對每
個帶文字的葉節點取樣 5 個點，用 `elementFromPoint` 檢查命中的是不是自己，且
命中者必須真的有不透明背景才算數。

修正兩頁：

- **11-2「各自接任務」**：agent 卡牆（`top:245`）、連接線、`SHARED project/`
  全是舞台絕對座標，只有標籤與標題在流排裡。base.css 的
  `.scene-pad{justify-content:center}` 把這兩行從頂端推到 y 473 / 516，正好撞
  進 y 245~495 的卡牆底下。補 `.ar-many{justify-content:flex-start}`。
  這是前一輪漏掉的同類問題 —— 當時只替 grid 版面的場景補了覆寫，沒有涵蓋
  「flex 直列 + 絕對定位裝飾」這種頁（跟 `.vc-onebase` 同一個病）。
- **4-5「套回會衝突」**：疊卡每張只往右錯開 150px，但 `stash@{n}` 含左內距要
  ~155px，五個編號有四個被下一張切掉尾巴。錯開量拉到 212px（容器 1400 →
  1470）。另外每張卡右下的 `which one?` 永遠被下一張蓋住，只有最上面那張看得
  到 —— 改成只有最上面那張掛牌，不再放看不見的字。

已知且刻意保留的命中測試結果（非缺陷）：

- `10-vscode` 三步與 `12-agent-isolation` 一步的標註文字命中到 `<img>` ——
  標註 SVG 疊層是 `pointer-events:none`，`elementFromPoint` 會穿透到底下的截
  圖。視覺上沒有被遮，這幾頁先前已逐一目視確認。
- `8-1` 背景那個 430px 的裝飾 `# Video Outline — Git Worktree 團隊分享

> **主題**：`we-bare-bears`（熊熊遇見你）—— 奶油紙張 + 天空藍強調色 + 圓潤手繪輪廓的親切協作感（CP-1 已確認）
> **總時長**：約 11 分鐘
> **章節數**：封面 + 11 章 / 57 步

---

## 進度看板

<!-- agent 每次接手先讀這一段；每過一個硬節點立刻回寫，不可延後。 -->

| # | Checkpoint | 狀態 | 備註 |
|---|---|---|---|
| CP-0 | 內容自檢（script.md / outline.md） | ✅ | 依用戶指定流程重排後重跑自檢並修復 |
| CP-1 | Checkpoint Plan（稿子 / outline / 主題 / 素材 / 模式） | ✅ | 主題：we-bare-bears ／ 講者：莊詠翔 ／ 開發模式：B |
| CP-2 | 封面 + 第 1 章驗收（硬節點） | 🔵 | 封面三角色透明背景群像已放大重製，待用戶再次驗收 |
| CP-3 | 第 2~N 章驗收 | 🔵 | 模式 B；已完成一輪全片版型自檢（76 步逐步量測 + 目視），修正見下方「版型自檢紀錄」 |
| CP-4 | Checkpoint Audio（是否合成音訊） | ⬜ | |
| CP-5 | Phase 4 錄屏路徑確認 | ⬜ | |

| 章節 | 狀態 | 備註 |
|---|---|---|
| 00-cover | 🔵 | 講者：莊詠翔 ／ 日期：2026.09.12 ／ 三角色討論群像已改為真正透明 PNG，待驗收 |
| 01-scenes | 🔵 | 5 steps；原 2-6 已移除，原 2-1 群像頁移至章末，待驗收 |
| 02-switch-cost | 🔵 | 1 step 完成；feature / hotfix 循環切換已驗收 |
| 03-old-ways | 🔵 | 8 steps 完成；重複 repo 容量插圖與 git log 頁已驗收 |
| 04-concept | ✅ | 4 steps；5-5「修正誤解」依用戶指示移除 |
| 05-vs-clone | 🔵 | 10 steps；原 06-esim 章整段併入；6-1 / 6-2 依用戶指示移除，eSIM 比喻成為本章開場 |
| 07-cmd-create | 🔵 | 5 steps 完成；型別與逐畫面驗收通過 |
| 08-cmd-manage | 🔵 | 3 steps；8-4~8-7（move / repair / prune / lock）依用戶指示移除，本章只留移除相關 |
| 10-vscode | 🔵 | 8 steps 完成；10-1、10-5 的 VS Code icon 已逐畫面驗收 |
| 11-agent-risk | 🔵 | 3 steps 完成；品牌 icon、workitem 對應與衝突插圖已驗收 |
| 12-agent-isolation | 🔵 | 4 steps 完成；資料夾 / branch 區別動畫與 Git icon 已驗收 |
| 13-closing | 🔵 | Agent icon 與獨立 worktree 收尾頁已驗收 |

### 版型自檢紀錄（全片 76 步）

以 CHAPTER-CRAFT 完工自我檢查逐項執行：對 76 步逐一量測內容外框與舞台
（1920×1080）的四邊留白、溢出、字級，再逐頁目視。修正如下：

**系統性問題**：`.scene-pad` 是 flex 直列但沒有垂直分佈，內容一律靠上堆，
28/76 步下緣留下最多 411px 死區。base.css 補 `justify-content:center`；
另對 21 個把 `display` 覆寫成 grid 的場景補 `justify-content:normal`
（grid 的 justify-content 管的是欄的水平分佈，會把版面往中間擠）。

**個別修正**：
- 4-3 半成品寫入歷史：浮空不接任何節點的弧線 → 改成單一 SVG 座標系，
  時間軸／WIP 節點／回頭改寫箭頭全部對齊，箭頭有明確指向與標籤
- 11-4 放在專案同一層：藍框量的是被 letterbox 的容器而非圖片，永遠落在
  截圖外 → `.vs-shot` 鎖成圖片原生比例，標註改用截圖自身像素座標繪製
- 11-6 兩個視窗：截圖裡兩視窗是疊放不是左右對開，中央垂直藍線無對應物
  → 改成各自框出視窗範圍並掛標籤
- 11-7 主視窗立刻看見：斜線兩端沒接到 commit → 改成框出兩處同一個 commit
  並以帶箭頭曲線連接
- 5-2 一個 repository：`.ct-def-copy` grid 隱式排列把標題擠到右上角
  → 改用顯式 grid-areas
- 6-2 好幾個彼此獨立的 repository：島形 `<i>` 沒給 inset，被排到說明文字
  那一列再置中，把 "no shared history" 壓在島下緣切掉 → 島改 inset:0 置中
  當背景，卡片與說明用 flex 堆疊並重調比例
- 6-4 工作現場分開：整頁用舞台絕對座標畫，垂直置中後連接線脫離卡片
  → 該頁 opt-out 置中
- 4-7 每一份 clone：插圖 16:9 依寬度算出 866px 高，撞出舞台下緣
  → 容器與圖同尺寸，容量標籤按比例重新對到罐子中心
- 10-1 / 14-1 開場：右側大圓佔住畫面，標題壓在圖形上 → 收成文字靠左、
  圖形靠右
- 13-4 直接勾 worktree：`.ai-focus` 同樣是盲寫座標的絕對定位方框，落在截圖
  右下角空白處與小機器人上，沒標到工具列的「☑ worktree」→ 改用截圖原生
  座標（934×637）標註，並加一個 2.8 倍局部放大鏡讓那顆 checkbox 在錄影時
  看得清楚
- 2-6 是日常：版型是四象限放射但只有三個現場，右下角永遠空一塊，收尾句
  被塞進那個洞裡 → 改成對稱三輻條（左／上／右各一個現場，正下方放收尾句），
  四個方位都有內容；同時清掉遺留的 `.sc-site-d` 死規則
- 3-1 一個 working directory：viewport 的 feature／hotfix 用 4.8s 無限循環
  互換，但底下的 checkout slot 是靜態的，看不出當下裝著哪一個 → slot 加上
  分支名交叉淡入、圖例兩顆點亮暗同步、git switch chip 在切換瞬間閃動，
  所有 keyframes 百分比與 sw-feature-loop／sw-hotfix-loop 對齊
- 4-4 stash：原本是「檔案列 → 漏斗 → 暫存箱」的靜態示意，看不出 stash 對
  working tree 與 branch history 各做了什麼 → 改成圖示化的機制演示：分支線上
  四個 commit 節點 + working tree 三個未 commit 變更，`git stash push -u` 下達
  後三張變更卡片以動畫被「吸」進右側虛線的 stash 保險櫃、櫃蓋闔上並掛出
  `stash@{0}`，同時分支線一個節點都沒增加（標註「history 一行都沒動」）。
  分支線、節點與通往 stash 的虛線全部畫在同一個 1600×640 viewBox，HTML 卡片
  也用同一套座標定位，飛行終點必定落在櫃子上。
  同時清掉被取代的 `.ow-stash-stage` / `.ow-files` / `.ow-funnel` /
  `.ow-stash-box` / `.ow-clean` 等 9 條死規則

（`accent-soft`）被內容壓住一部分，本來就是
  水印。
- `9-6` 的 `refs/stash` 三張疊卡只露出最上面的 `stash@{0}`，另外兩個標籤藏在
  底下。視覺上讀起來就是「一疊，只拿得到最上面那張」，符合該頁論點，但那兩個
  標籤等於死字 —— 留著待決定。

檢測方法上有一個環境陷阱要記著：Browser pane 在被 JS 驅動時會凍住 document
timeline（`playState` 是 running 但 `currentTime` 永遠 0），等再久動畫也不會前
進，量到的會是動畫的**起始**狀態。要用 `getAnimations().forEach(a => a.finish())`
把動畫 seek 到結束，狀態才是確定的。

### 章節合併：06-esim → 05-vs-clone（13 章 → 12 章，76 步 → 74 步）

自檢時發現的重複：`05-vs-clone` 用 Git 術語講「多 clone 各自一整套 vs worktree
共用底層」，`06-esim` 再用手機 / eSIM 把同一個論點講一次 —— 原第 6 章的 2~5 步
（約 26s）等於第 5 章 2~4 步的比喻復述。而且比喻排在機制**之後**，觀眾已經懂了
才給比喻，只有複述沒有增益。

依用戶指示整段併入，比喻改在「多 clone 是什麼」與「worktree 是什麼」之間登場：

- 收掉兩句重複旁白（詳見 `05-vs-clone/narrations.ts` 的說明）；被收掉的三個 Git
  名詞（objects / remote / refs）改刻進手機螢幕，內容沒有流失。
- 原 6-6「比喻只到這裡」／ 6-7「不是零磁碟成本」移到 step 10 / 11 —— 原位插入會
  排成「先潑冷水 → 再講兩個優點 → 收束」，語氣會斷。
- 刪掉被取代的 `.vc-onebase` / `.vc-lines` / `.vc-base` / `.vc-sim*` 與對應
  keyframes；`.es-` 前綴隨章節併入 `05-vs-clone`，擁有者仍唯一。
- 併入時順手修掉原 06-esim 帶進來的兩個問題：`.es-sim-stack small` 只有 15px
  （低於 19px 下限）；`.es-many` 右欄固定 600px 但機身只有 410px，右留白 245px
  對上左邊 150px。
- `chapters.ts` 移除該章、`useStepper.ts` 的 `STORAGE_KEY` bump 到 v19。
- 章節序號刻意留下 06 的缺口（`05` → `07`），缺口本身就是「這一章被併走」的
  紀錄，比把 07~13 七個資料夾全部改名安全。

### 章節刪減：依用戶指示移除 7 步 + 整章 09-traps（71 步 → 57 步）

用戶指定移除的段落，編號依簡報進度列（1-based 章 / 段，與 UI 顯示一致）：

| 指定 | 對應檔案位置 | 內容 |
|---|---|---|
| 5-5 | `04-concept` step 5 | 修正誤解：branch 仍是 ref，worktree 是工作目錄加上獨立狀態 |
| 6-1 | `05-vs-clone` step 1 | 「那它跟剛剛說的多 clone 一份，差在哪？」 |
| 6-2 | `05-vs-clone` step 2 | 「多 clone 會得到好幾個彼此獨立的 repository。」 |
| 8-4 | `08-cmd-manage` step 4 | `git worktree move` |
| 8-5 | `08-cmd-manage` step 5 | `git worktree repair` |
| 8-6 | `08-cmd-manage` step 6 | `git worktree prune` |
| 8-7 | `08-cmd-manage` step 7 | `git worktree lock --reason` |
| 第 9 章 | `09-traps` 整章 7 步 | 共用帶來的坑（同 branch 雙 checkout、共享 refs、`refs/stash`、submodule 實測） |

連帶調整（刪掉步驟後不改就會變成假訊息的地方）：

- `05-vs-clone` 的 eSIM 比喻升格成本章開場 —— 原本比喻是接在「多 clone 是什麼」
  之後登場，那兩步被移除後，`es-intro` 直接開場，旁白「講到這裡」仍接得上第 4 章
  的第三種舊做法。
- `08-cmd-manage` 的開場輪盤原本刻著五個指令（remove / move / repair / prune /
  lock），只留 remove 會變成宣告了四個沒登場的指令 —— 輪盤改成
  `worktree remove` / `branch -d` 兩顆、旁白由「這幾個指令一樣一個一個看」改成
  「移除相關的兩個動作，一個一個看」，章名由「指令：移除與維護」改成
  「指令：移除 worktree」。
- 被移除步驟專屬的 CSS 規則與 keyframes 一併刪除（`.ct-correction*`、
  `.vc-question` / `.vc-islands` / `.vc-repo` 一族、`.cm-move-demo` /
  `.cm-repair-demo` / `.cm-prune-demo` / `.cm-lock-demo` 及其動畫），
  `05-vs-clone` 不再使用的 `<Repo>` 元件也移除。
- `script.md` 由各章 `narrations.ts` 重新產生，71 段 → 57 段。

驗收：`tsc -b` 與 `vite build` 皆通過，dev server 逐章逐段走完 57 步，
每一步都有畫面（`5-3`、`4-7` 為純插圖頁，本身無文字），console 無錯誤。

### 比喻家族收斂（05-vs-clone × 06-esim）

全片原本有兩套互不相干的比喻在講同一件事：`05-vs-clone` step 3 的「三套 Git
行李」與 `06-esim` 的「手機 / eSIM」。依用戶指示收斂成 eSIM 一套。

- **05-vs-clone step 3 重做**：行李 → SIM 卡特寫。一張卡的卡面刻著 object
  database / remote / refs 三條，逐條刻上；接著後方發出第二、第三張一模一樣的
  卡（clone B / clone C），落到「下載 × N ・ 保存 × N ・ 同步 × N」。
- **順帶修掉節奏重複**：前一步 step 2 已經是「三個並排的島」，原本 step 3 又是
  「三張並排的行李」，連兩步同一種版型會讀成在重講。改成單卡特寫 = 鏡頭從外部
  形狀推進到卡面內容，兩步的關係變成遞進而不是並列。
- **旁白不動**：step 3 的旁白（「各自的 object database、各自的 remote 設定、
  各自的 refs。」）本身沒有任何比喻字眼，SIM 卡只作視覺伏筆，`06-esim` 開場的
  「用手機跟 eSIM 來比喻會更好懂」仍然是比喻的正式登場。`06-esim` 完全未動。
- 卡面、接點、三條刻印、後方兩張卡全部畫在同一個 `viewBox`（850×675），文字不
  可能飄出卡外；動畫止於 2.3s，短於該步旁白約 6.5s。
- 清掉 `.vc-baggage` / `.vc-bag-row` / `.vc-bag` / `.vc-bag-title` / `.vc-handle`
  與 `@keyframes vc-bag` 等被取代的規則。


狀態詞彙（固定，不得自創）：⬜ 未開始 ／ 🟡 進行中 ／ 🔵 待用戶驗收 ／ ✅ 已通過 ／ ⏭️ 已跳過

> **本版結構依用戶指定流程重排**：情境（含插圖）→ 切換代價 → 舊做法總覽與各自優缺點 →
> worktree 概念 → 跟 clone 的差異（含 eSIM 比喻）→ 每個指令獨立一步 → 共用的坑 →
> VS Code 擴充套件 → Coding Agent（共享目錄風險 / Task 隔離）→ 收尾。
> 原「團隊工作流建議」章節已依指示移除。

---

## 0. 00-cover — 封面（1 step · ~8s）

**信息池**：
- 標題：Git Worktree ／ 副標題：一個 repo，同時開好幾個工作現場
- 講者或出處：莊詠翔（分享日期：2026.09.12）
- 重點清單預告：卡住的現場 → 舊做法的代價 → worktree 概念 → 指令 → VS Code → Coding Agent —— 來源 本 outline 章節結構
- 分享目標：看完能自己建立、切換、檢查與移除 worktree，也知道哪些情況不適合 —— 來源 article §分享目標 / L5
- 可用的一句話定義：同一個 repository 管理的多個 working trees —— 來源 article §Worktree 的心智模型 / L19

**插圖描述**：

- [step 1] 灰熊、白熊與熊貓三位主角靠近成一組討論，灰熊主動說明，白熊與熊貓面向他回應；真正透明背景、無文字，作為封面右側的大型群像 → `illustrations/cover/bears-discussing-transparent-v3.png`

**開發計劃**：

- step 1 (~8s) — 主標題 + 副標 + 講者與日期 + 重點清單預告卡（六項，一次呈現不逐項揭示）

口播節選：
> feature 寫到一半，production 出事。這時候你會怎麼做？

---

## 1. 01-scenes — 日常就有這麼多切換現場（5 steps · ~44s）

**信息池**：
- 情境一（hotfix 插隊）現場細節：feature 尚有一批未提交修改，工作現場還沒收完 —— 來源 article §典型困境 / L9
- 情境二：PR 已送審、review 未結束，開發者必須先開始下一個工項 —— 來源 article §典型困境 / L13
- 情境三：同一專案長期並存兩個版本，第一階段已上線維護、第二階段依新合約開發 —— 來源 article §典型困境 / L13
- 技術限制：單一 working directory 不能同時保留 feature 與 hotfix 兩個 checkout —— 來源 article §典型困境 / L11
- 收束論點：這些不是偶發例外，而是同一位開發者同時背著多個工作現場 —— 來源 article §典型困境 / L13

**插圖描述**（寫了就必須在開發本章前生成素材）:
- [step 2] 主角正在桌前處理 feature，本地資料夾裡堆著大量未提交變更，production hotfix 突然從旁插入；主角與工作桌偏右，左側保留標題空間 → `illustrations/scenes/uncommitted-interruption.png`
- [step 5] 主角坐在自己的工作桌前，被 stash、commit、switch branch 與多條帶 commit 節點的 Git branch 包圍；完整 16:9 場景置於畫面右側，左半保留標題留白，不再另外疊加自畫 SVG 線條 → `illustrations/scenes/overloaded-dev-git-scene.png`

**開發計劃**：

- step 1 (~10s) — 情境一登場：feature 分支寫到一半，production 出事，hotfix 插隊
- step 2 (~8s) — 切走前只聚焦一個原因：本地堆著大量未 commit 修改，現場還沒收完
- step 3 (~10s) — 情境二：PR 送審中，review 未結束，人不能停在原地
- step 4 (~9s) — 情境三：同一專案衍生多個 branch 節點，第一階段維護與第二階段開發長期並存
- step 5 (~7s) — 原章節群像頁移至最後：用一個人同時壓著好幾個工作，收束前述切換情境

口播節選：
> 你一定遇過這些狀況。一個人手上，同時壓著好幾個工作。

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
- [step 7] 完整 16:9 場景直接呈現 Clone A／B／C 各自帶一份工作目錄與 `.git`（history、objects、refs），並以三隻熊與空間成本總結重複 clone 的問題；圖內已含標題與說明，不再疊加 HTML 標籤 → `illustrations/old-ways/duplicate-git-clone-problem.png`

**開發計劃**：

- step 1 (~5s) — 總覽頁：三種舊做法的標籤並列，內容還沒展開
- step 2 (~8s) — 做法一佔畫面：暫時 commit 一個 WIP，優點欄先亮（東西不會丟、切得快）
- step 3 (~10s) — 做法一的缺點欄亮起：WIP 寫進 branch history，之後要整理甚至改寫歷史
- step 4 (~10s) — 做法二佔畫面：stash，優點欄亮（working tree 立刻乾淨、不留半成品 commit）
- step 5 (~7s) — 做法二的缺點欄亮起：套回衝突、多筆容易取錯
- step 6 (~8s) — 做法三佔畫面：再 clone 一份，優點欄亮（隔離最完整、互不影響）
- step 7 (~8s) — 做法三的缺點：完整場景圖呈現三份 clone 各自複製工作目錄與 `.git`，空間與維護成本隨份數增加
- step 8 (~8s) — 具體演示：這邊 commit，那邊 git log 看不到，要 fetch / push 才交換得到

口播節選：
> 缺點是套回來可能衝突。stash 一多，也很容易取錯那一筆。

---

## 4. 04-concept — worktree 的概念（4 steps · ~38s）

**信息池**：
- 官方定義：同一個 repository 所管理的多個 working trees —— 來源 article §Worktree 的心智模型 / L19
- 名詞對照：一般 clone 建立 main worktree；git worktree add 建立 linked worktree —— 來源 article §心智模型 / L19
- 各自獨立的東西：自己的目錄、HEAD 與 index，因此能同時 checkout 不同分支 —— 來源 article §心智模型 / L19
- 共享的東西：同一套 Git object database 與大部分 refs —— 來源 article §心智模型 / L19
- 心智模型與其邊界：把分支實體化成另一個資料夾；branch 本身仍只是一個 ref，worktree 是該版本內容的工作目錄加上 Git 為它保存的獨立狀態 —— 來源 article §心智模型 / L21
- 官方文件出處：git-scm.com/docs/git-worktree —— 來源 article §查證來源 / L107

**插圖描述**：

- [step 3] 一份共享 `.git`（history、objects、refs）向上延伸 main、feature/login、hotfix 三個獨立工作目錄，以三隻熊呈現同一專案並行開發；完整 16:9 圖內已含標題與說明 → `illustrations/concept/worktree-concept-overview.png`

**開發計劃**：

- step 1 (~4s) — 轉場句佔屏：worktree 就是為了這件事做的
- step 2 (~10s) — 官方定義卡：帶 Git icon 的 repository 橫向衍生 main、feature、hotfix 三個資料夾，附文件出處小字
- step 3 (~19s) — 完整概念場景：main worktree 與 linked worktree 各自 checkout 不同分支，並共用一份 `.git`、object database 與大部分 refs
- step 4 (~5s) — 心智模型一句話：把分支實體化成另一個資料夾

口播節選：
> clone 出來的是 main worktree，add 開出來的是 linked worktree；它們各自 checkout 不同分支，但共用同一套 object database 與大部分 refs。

---

## 5. 05-vs-clone — 跟多 clone 的差異（含手機 / eSIM 比喻）（10 steps · ~68s）

> **原第 6 章 `06-esim` 已整段併入這一章，全片 13 章 → 12 章、76 步 → 74 步。**
> 兩章講的是同一個論點：「多 clone 各自一整套 vs worktree 共用底層」，本章用 Git
> 術語講一次，原第 6 章再用手機與 eSIM 講一次 —— 同一件事講兩輪。而且比喻落在
> 機制**之後**，觀眾已經懂了才給比喻，等於只有複述沒有增益。併入後比喻改在
> 「多 clone 是什麼」與「worktree 是什麼」之間登場，當成理解的鏡頭。
>
> 併章時收掉兩句重複旁白：
> - 「各自的 object database、各自的 remote 設定、各自的 refs。」→ 與「每支都有一
>   整套自己的系統跟資料」同義，三個名詞改刻進 step 4 的手機螢幕裡。
> - 「worktree 不一樣。它共用同一份歷史跟 refs。」→ 與 step 7「對應到 Git，共用的
>   是 repository 的歷史跟物件」同句。
>
> 比喻的邊界與磁碟成本（原 6-6 / 6-7）移到 step 10 / 11，排在兩個「只有 worktree
> 做得到」的證據之後、收束之前 —— 原位插入會變成「先潑冷水、再講優點、再收束」。

**信息池**：
- 多次 clone 的結果：多個彼此獨立的 repository，各有 object database、remote 設定、refs 與 maintenance 狀態 —— 來源 article §和多次 clone 的差異 / L25
- 多次 clone 的代價：重複下載和保存 Git 物件，branch 與 fetch 狀態要各自同步 —— 來源 article §差異 / L25
- worktree 的差別：共用同一個 repository 的歷史與 refs，新 worktree 建立更快，不必再抓一次完整歷史 —— 來源 article §差異 / L27
- 關鍵好處：任何一棵 worktree 做出的 commit，其他 worktree 立即看得到 —— 來源 article §差異 / L27
- 可佐證的實拍：hotfix worktree 提交後，主視窗 git graph 立刻出現該 commit —— 來源 素材/vscode新增worktree_step7.png
- 比喻主體：多次 clone 像每多一個門號就再買一支手機，每支手機都有自己的一整套系統與資料 —— 來源 article §差異 / L29
- 比喻對照：worktree 像一支手機安裝多個 eSIM 設定，底層裝置只有一套，不同門號各自使用 —— 來源 article §差異 / L29
- 對應回 Git：共用的是 repository 的歷史與物件，不同 worktree 各自呈現一個 checkout —— 來源 article §差異 / L29
- 比喻的邊界（必說）：只說明共享底層、分開使用；worktree 的專案檔案和依賴仍會占額外空間 —— 來源 article §差異 / L29
- 各自要準備的東西：node_modules、build output、未追蹤檔案與本機環境；每棵 worktree 都要處理自己的依賴、`.env`、port —— 來源 article §差異 / L27、§限制 / L94

**開發計劃**：

- step 1 (~5s) — 比喻登場：一支手機的輪廓進畫面（原 step 1 / 2 的「差在哪」與「彼此獨立的 repository」依用戶指示移除，比喻直接當開場）
- step 2 (~10s) — 多 clone 側：一個門號配一支手機，手機逐支增加；每支螢幕裡刻著 objects / remote / refs（承接被收掉的那句旁白）
- step 3 (~5s) — worktree 側：一支手機，多張 eSIM 設定
- step 4 (~5s) — 底層裝置只有一套，不同門號各自使用
- step 5 (~6s) — 比喻對應回 Git：共用的是 repository 的歷史與物件
- step 6 (~6s) — 建立速度差：不用再抓一次完整歷史
- step 7 (~5s) — 決定性差異演示：一棵做的 commit，另一棵立刻出現
- step 8 (~5s) — 比喻的邊界警示：實體檔案還是各有一份
- step 9 (~11s) — 各自要準備的清單：node_modules、build output、.env、port，不是零磁碟成本
- step 10 (~10s) — 收束對照：各過各的，對上同一份歷史開多個現場

口播節選：
> 多 clone 像是每多一個門號，就再買一支手機。每支都有一整套自己的系統跟資料。
> ……這就是最大的差別。多 clone 是各過各的，worktree 是同一份歷史開多個現場。

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

## 8. 08-cmd-manage — 指令：移除 worktree（3 steps · ~30s）

> 依指示：**一個指令佔一步**，每一步都要有動畫演示（資料夾消失 / branch 線仍在等）。
>
> 原 step 4~7（`move` / `repair` / `prune` / `lock`）依用戶指示移除，本章只留
> 「移除 worktree」與「移除 worktree ≠ 刪 branch」這組對照；開場的輪盤也從五個
> 指令收成這兩個動作。

**信息池**：
- 移除前提：先確認變更已提交或已妥善保存，再 `git worktree remove ../project-hotfix` —— 來源 article §基本操作 / L57-60
- remove 的保護：linked worktree 有未提交或未追蹤檔案時會拒絕，不要習慣用 `--force` —— 來源 article §限制 / L93
- 關鍵區分：移除 worktree 不等於刪除 branch；確認已合併後才 `git branch -d hotfix/payment-timeout` —— 來源 article §基本操作 / L63-66

**開發計劃**：

- step 1 (~4s) — 兩個動作登場，位置先留空
- step 2 (~13s) — `git worktree remove`：資料夾被移除；有未提交或未追蹤檔案時被擋下
- step 3 (~13s) — 對照演示：worktree 消失了但 branch 還在，`git branch -d` 是另一個獨立動作

口播節選：
> 注意，移除 worktree 不等於刪掉 branch。branch 要另外確認合併過，才用 git branch -d。

---

## 10. 10-vscode — 不用背指令：VS Code 擴充套件（8 steps · ~79s）

**信息池**：
- 擴充套件名稱與識別碼：Git Worktree Manager，`jackiotyu.git-worktree-manager` —— 來源 article §VS Code 實作素材 / L73
- 市集頁中繼資料：作者 jackiotyu、版本 3.25.0、MIT 授權、下載數 44k —— 來源 素材/擴充套件截圖.png
- 示範流程：側邊欄按新增 Worktree、選建立新分支、挑基準分支、輸入 worktree 目錄、在另一個 VS Code 視窗開啟 —— 來源 article §VS Code 實作素材 / L73
- 實拍目錄命名：`d:\個人專案\Test.worktrees\第一階段hotfix`，對應 `<repo>.worktrees/` 的命名習慣 —— 來源 素材/vscode新增worktree_step3.png、article §團隊工作流建議 / L101
- 兩視窗並存實拍：各自的檔案總管、終端機與原始檔控制，分別提交 —— 來源 素材/vscode新增worktree_step5.png、_step6.png
- 共享歷史實證：hotfix 視窗提交後，主視窗 git graph 立即出現該 commit —— 來源 素材/vscode新增worktree_step7.png
- 移除入口與移除後狀態：操作選單含移動 / 修復 / 移除 / 鎖定；移除後該 commit 仍在歷史裡 —— 來源 素材/vscode新增worktree_step8.png、_step9.png

**開發計劃**：

- step 1 (~9s) — 轉場：指令不用背，以 VS Code icon 明確標示編輯器
- step 2 (~15s) — 擴充套件市集頁截圖：名稱、識別碼、授權與版本
- step 3 (~8s) — 新增 Worktree 與選擇基準分支的截圖
- step 4 (~10s) — 輸入 worktree 目錄的截圖，`.worktrees` 命名習慣被標註出來
- step 5 (~7s) — 以 VS Code icon 標示在另一個 VS Code 視窗開啟，原本現場不被切掉
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
- ✓ 講者：莊詠翔／分享日期：2026.09.12
- ✓ 三位主角靠近討論的透明背景大型群像（`illustrations/cover/bears-discussing-transparent-v3.png`）

### 1. 01-scenes
- ✓ 主角被多個 Git branch 與切換工作壓住、手忙腳亂的完整場景（`illustrations/scenes/overloaded-dev-git-scene.png`）
- ✓ 主角工作到一半、未 commit 變更堆滿本地，hotfix 臨時插入（`illustrations/scenes/uncommitted-interruption.png`）
- ✓ 情境切換的視覺演示由章節自己用 CSS / SVG 畫

### 2. 02-switch-cost
- ✓ 純 CSS / SVG 演示，無外部素材

### 3. 03-old-ways
- ✓ 三份完整 Git clone 重複工作目錄與 `.git` 的全頁場景（`illustrations/old-ways/duplicate-git-clone-problem.png`）
- ✓ Git log 不同步仍以 CSS / SVG 演示

### 4. 04-concept
- ✓ 一份共享 `.git` 延伸三個獨立 worktree 的全頁場景（`illustrations/concept/worktree-concept-overview.png`）
- ✓ 主題角色圖 `grizzly-presenting`（可選，用在心智模型那一步）
- ✓ Git 與資料夾 icon 使用專案內品牌圖示素材

### 5. 05-vs-clone
- ✓ 純 CSS / SVG 演示，手機與 eSIM 圖形自己畫，無外部素材

### 7. 07-cmd-create
- ✓ 純 CSS / SVG 模擬終端機與目錄樹，無外部素材

### 8. 08-cmd-manage
- ✓ 純 CSS / SVG 模擬終端機與目錄樹，無外部素材

### 10. 10-vscode
- ✓ 10-1、10-5 使用 VS Code icon 標示編輯器與新視窗
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
