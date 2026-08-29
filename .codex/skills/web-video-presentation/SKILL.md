---
name: web-video-presentation
description: 把一篇文章或旁白稿，做成「看起來像影片」的點擊驅動 16:9 網頁簡報，可選擇合成旁白音檔。流程：原始文章 → **一次產出**旁白稿 + outline 開發計畫（含**跨 agent 進度看板**）→ 使用者**一次對齊** 5 件事（稿子 / outline / 主題 / 素材 / 開發模式）→ 網頁開發（**封面 00-cover + 第 1 章主執行緒強制驗收**，其餘逐章 / 循序 / 平行）→ 選擇性音檔合成（provider-agnostic：內建 MiniMax mmx-cli + OpenAI TTS，可換 ElevenLabs / edge-tts / Azure / 自備 TTS）。技術線 Vite + React + TS，套件管理器 pnpm 優先 npm 備援。**outline 只規劃節奏與資訊密度，不規劃動畫** —— 動畫由章節開發時依 PRINCIPLES + ANTI-AI 法則即時設計；outline 可選填**插圖描述**，寫了就在開發該章前呼叫圖片生成工具（ImageGen）依主題畫風產出插圖素材。每次點擊推進旁白稿的一個節拍，每一步獨佔整個畫面；進度控制平時隱藏、滑到畫面底邊時顯示橫向章節列，最左側清單 icon 可展開全部章節總覽。適用情境：用網頁做影片（動態簡報但不像簡報）、把旁白稿 / 文章變成可互動的解說、為 YouTube / Instagram Reels / TikTok 錄製教學、做有電影感的產品 / talk demo。本 Skill 沉澱的是設計方法論 + 協作流程 —— 不綁定任何特定樣式 / 字體 / 顏色 —— 因此能重用到任意主題與美學。
---

# Web Video Presentation

把一篇文章或旁白稿，一步步做成可錄影的「偽裝成影片的網頁」，可選擇合成
旁白音檔。產出物 = Vite + React + TS 專案 + 依章節切分的音檔。

## 適用情境

- 「我有旁白稿 / 一篇文章，幫我做成影片」—— 旁白驅動的內容
- 想做「動態簡報」
- 16:9 橫向螢幕錄影，大字級、留白、每個畫面都要有動態效果
- 教學 / 產品展示 / keynote 想要電影感
- YouTube / Instagram Reels / TikTok 影片內容

本 Skill **以方法論 + 協作流程為核心**。scaffold 樣板提供 token 和原語，
但每個美學決策（配色、字體、動態調性）都應該針對你的主題重新設計 ——
不要照搬。

---

## 工作流總覽

```
Phase 1   內容撰寫
   1.1  辨識使用者輸入
   1.2  一次產出 script.md + outline.md
        （旁白稿 + 開發計畫 + 頂部進度看板）
   ▼
   [CP-0] 內容自我檢查（script / outline）
   ▼
[Checkpoint Plan · CP-1]  ← 必須停。一次對齊 5 件事：
                            稿子 / outline / 主題 / 素材 / 開發模式
   ▼
Phase 2   網頁開發
   2.1  scaffold（依確認的主題）
   2.2  封面 00-cover + 第 1 章 = 主執行緒 + 完整版本（強制 anchor）
        ▼
        [硬節點 · CP-2] 使用者驗收封面 + 第 1 章 ← 不可跳過
        ▼
   2.3  第 2~N 章（依選定模式：A 逐章 / B 循序 / C 平行）
        ▼
        [CP-3] 第 2~N 章驗收
   ▼
[Checkpoint Audio · CP-4] ← 必須停。是否合成音檔
   ▼
Phase 3   音檔合成（選擇性）
   ▼
Phase 4   螢幕錄影 + 後製 → [CP-5] 錄影路徑確認
```

> **每個 CP 的狀態都寫在 `outline.md` 頂部「進度看板」裡**，不是只存在
> 對話裡。見下文「進度看板協定」。

工作目錄慣例（agent 在使用者當前目錄下建立 / 編輯）：

```
my-video/
├── article.md          # 使用者給原文時必有 —— 不刪！開發階段畫面資訊來源
├── script.md           # 必有：保持原文語言的平台化旁白稿（決定節拍）
├── outline.md          # 必有：★ 進度看板 + 開發計畫
│                       #   （章節切分 + 每步內容 + 資訊池 + 選填插圖描述）
└── presentation/       # scaffold 產出的 Vite + React + TS 專案
    ├── .theme / .pm          # 起步用的主題 id / 套件管理器（pnpm 或 npm）
    ├── src/chapters/00-cover/    # ★ 封面固定為第一章，內容章節從 01- 起
    ├── src/chapters/<NN>-<id>/
    │   ├── <Chapter>.tsx     # 視覺實作
    │   ├── <Chapter>.css
    │   └── narrations.ts     # ★ step 數 + 旁白文字的唯一真相來源
    ├── scripts/
    │   ├── extract-narrations.ts   # 掃描所有 narrations.ts → audio-segments.json
    │   ├── synthesize-audio.sh     # provider-agnostic runner（迴圈跑 segments）
    │   └── tts-providers/          # 每個 provider 一個 .sh（內建 2 個）
    │       ├── README.md           # 三函式契約 + 5 段現成程式碼片段（11labs / edge-tts / say / azure / gcloud）
    │       ├── minimax.sh          # 預設 provider，用 mmx-cli
    │       └── openai.sh           # 內建 OpenAI TTS（curl + OPENAI_API_KEY）
    ├── audio-segments.json         # extract 產出（合成前 review）
    └── public/audio/<id>/<N>.mp3   # 選擇性：合成的音檔
```

> **關鍵**：`narrations.ts` 是 step 數和音檔合成的**唯一真相來源**。
> 章節 `.tsx` 裡的 `if (step === N)` 出現的最大 N + 1 必須等於
> `narrations.length`。這保證 5 個地方（script / outline / 章節程式碼 /
> chapters.ts / 音檔）永遠不會漂移。

---

## 技術線

| 項目 | 用什麼 | 說明 |
|---|---|---|
| 前端 | **Vite + React + TypeScript** | scaffold 用官方 `create-vite` 的 `react-ts` 樣板 |
| **套件管理器** | **pnpm 優先，npm 備援** | `scaffold.sh` 自動偵測：有 `pnpm` 就用 pnpm，沒有才退回 npm。`--pm=pnpm` / `--pm=npm` 可強制指定 |
| 套件管理器紀錄 | `<project>/.pm` | scaffold 把選中的寫進去。**後續所有指令（含 subagent、音檔階段）先讀它，別猜** |
| 指令碼執行環境 | `tsx`（devDependency） | 跑 `scripts/extract-narrations.ts` |
| package.json 注入 | `node -e`（scaffold 內） | 把 `extract-narrations` / `synthesize-audio` 掛進 scripts |
| TTS runner | `bash` + 每個 provider 一個 `.sh` | 見 [`AUDIO.md`](references/AUDIO.md) |
| 生成插圖 | 當前 agent 的圖片生成工具 | 見 [`ILLUSTRATIONS.md`](references/ILLUSTRATIONS.md)，呼叫不到就降級為 placeholder |

指令寫法（本 Skill 全文統一）：

```bash
pnpm run dev              # npm run dev 亦可
pnpm exec tsc --noEmit    # 或 npx tsc --noEmit
```

---

## 強制自我檢查協定（貫穿整個 Skill）

下面三個產出，每一個**完成後必須走自我檢查 → 修正 → 再回報 / 推進**：

| 產出 | 檢查清單出處 |
|---|---|
| `script.md` | [`SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) 三層自我檢查（形式 / 風骨 / 唸出來） |
| `outline.md` | [`OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md) 自我檢查 |
| 單章實作完成 | [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) 完工自我檢查 |

**執行方式**（依能力降級，**優先用更隔離的方式**）：

1. **Agent Teams（最佳）**：開一個獨立的 reviewer agent，給它「產出檔案
   路徑 + 對應清單 + 關鍵脈絡」，讓它逐項檢核並**嚴格回報結論**
   （哪幾條 pass / 哪幾條 fail + 證據 + 改寫建議）。
2. **subAgent（次佳）**：沒有 Teams 能力但能開 subagent 就用 subagent
   走同樣流程。
3. **自我檢查（保底）**：當前 agent 都沒有上述能力，就自己**嚴格逐項**
   檢核 —— 不允許目視掃一遍就放行。

**鐵則**：拿到結論後**先照 fail 項把產出改完**，再向使用者回報「做完了
+ 自我檢查結論 + 改了什麼」。**直接拿原始結論回報但不修正 = 違規**。

---

## 進度看板協定（跨 agent 接續）

**所有人工 Checkpoint 的狀態都外部化在 `outline.md` 頂部的「進度看板」**
（格式 spec 見 [`OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md)）。
理由很實際：換 agent、接續 session、平行 subagent 都看不到之前的對話，
**只有檔案裡的狀態是可靠的**。

| 規則 | 內容 |
|---|---|
| **接手先讀** | 任何 agent（新 session / subagent / 接續）動手前**先讀進度看板**，以看板判斷從哪一步開始 —— 不靠對話記憶，也不靠「看起來做到哪了」 |
| **過節點就回寫** | 每過一個硬節點（含每章驗收）**立刻**回寫看板，回寫完才准推進下一步 |
| **subagent 由主執行緒回寫** | 模式 C 的 subagent prompt 必須帶上看板當前狀態；subagent **自己不寫** `outline.md`（避免並行寫入衝突），完工回報後由主執行緒統一回寫 |
| **狀態詞彙固定** | ⬜ 未開始 ／ 🟡 進行中 ／ 🔵 待使用者驗收 ／ ✅ 已通過 ／ ⏭️ 已跳過 |
| **禁止** | 看板未回寫就進入下一階段；用自創狀態詞；只在對話裡說「第 3 章過了」卻不寫進檔案 |

六個 checkpoint：

| # | 含義 | 什麼時候變 ✅ |
|---|---|---|
| CP-0 | 內容自我檢查（script.md / outline.md） | 自我檢查結論的 fail 項全部改完 |
| CP-1 | Checkpoint Plan（5 件事對齊） | 使用者確認稿子 / outline / 主題 / 素材 / 模式 |
| CP-2 | 封面 + 第 1 章驗收 | 使用者明確說 OK / 繼續 |
| CP-3 | 第 2~N 章驗收 | 所有內容章節都 ✅（逐章模式下每章單獨在章節表裡更新） |
| CP-4 | Checkpoint Audio | 使用者選了合成或不合成（不合成記 ⏭️） |
| CP-5 | Phase 4 錄影路徑確認 | 已告知使用者該走 Auto 還是 Manual 路徑 |

---

## 各階段檔案閱讀指南

不同階段讀不同的檔案。**長對話裡 agent 容易忘記原則**，特別是
Phase 2.4 的「實作單章」會重複 N 次 —— 每次都要回頭看核心限制。

| 階段 | 必讀（每次都看） | 一次性看完 / 依需求查 |
|---|---|---|
| **任何階段 · 接手時** | `outline.md` 頂部**進度看板**（判斷從哪一步開始） | —— |
| Phase 1.1-1.2 內容撰寫 | `references/SCRIPT-STYLE.md` + `references/OUTLINE-FORMAT.md` + `article.md`（使用者原文，如有） | —— |
| **Checkpoint Plan 確認主題** | —— | `themes/*/theme.json`（動態讀全部，列清單 + `bestFor` + `descriptionZh`）；`references/THEMES.md`（使用者想了解主題系統 / 想衍生新主題時） |
| Phase 2.1 scaffold | —— | SKILL.md 本節看一次 |
| **Phase 2.4 實作單章（×N 次，被 2.2 / 2.3 呼叫）** | **`references/CHAPTER-CRAFT.md`** 單一入口 —— Part 0 十條原則 / Part 1 開工 5 問 / Part 2 關係→動作決策樹 / Part 3 視覺工具箱 / Part 4 時長參考 / Part 5 反 AI 味反模式 / Part 6 程式碼硬規則（**含 narrations.ts 強制限制**）/ Part 7 完工自我檢查 / Part 8 回饋速查 + 封面章節規格（做 00-cover 時）+ 當前主題的 `themes/<id>/theme.json`（若有 `illustrations` 依情境挑選；若有 `styleReference` 依它決定封面版型 / 插圖畫風）+ 當前章節的 outline.md 段落 + **`article.md` 本章對應段落** + 素材清單 | **`references/ILLUSTRATIONS.md`（該章 outline 寫了「插圖描述」時**必讀**）**；`references/EXAMPLES/`（結構示意，不是抄襲樣板）；`references/THEMES.md` 完整 token 契約 |
| Phase 3 音檔合成 | `references/AUDIO.md`（含 narrations.ts → segments.json → 任意 provider 流程，內建 minimax + openai） | `templates/scripts/tts-providers/README.md`（換 provider / 自備 TTS 時） |
| Phase 4 螢幕錄影 + 後製 | `references/RECORDING.md`（含 `?auto=1` 自動錄影） | —— |
| 選 / 做 / 換主題 | —— | `references/THEMES.md` |

> **寫章節時只讀一份 `CHAPTER-CRAFT.md`**。十條原則 / 開工 self-prompting /
> 決策樹 / 反 AI 味反模式 / 完工自我檢查全部併入這一份單一入口。`EXAMPLES/`
> **不是必讀** —— 先依內容自由設計，卡住才翻（依 anchor 參考「形」，不要照搬）。

---

## Phase 1 —— 內容撰寫（一次產出）

### 1.1 辨識使用者輸入

| 使用者給的東西 | 該做的 |
|---|---|
| 原始文章（書面語 / 電子報 / 論文 / 部落格） | 一次產出 `script.md` + `outline.md`（1.2），過 Checkpoint Plan |
| 直接的旁白稿 / 影片腳本 | 寫入 `script.md`，一次產出 `outline.md`（1.2 簡化版），過 Checkpoint Plan |
| 什麼都沒有，只說「幫我做個 X 主題的影片」 | **反問**：先給一段素材或大綱。Skill 不替使用者構思內容 |

### 1.2 一次產出 script.md + outline.md

**兩份產出物在一次思考中完成**：

1. **產生 `script.md`**：依 [`references/SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md)
   的規則把 article 轉成保持原文語言的平台化旁白稿。**保留 `article.md` 不刪**——它是
   outline 寫資訊池和章節實作畫面時的細節來源（雙來源原則）。
2. **產生 `outline.md`**：依 [`references/OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md)
   規則建立**進度看板** + 切章節（**第一個固定 `00-cover` 封面**）+ 切 step
   + 每章首段抽出**資訊池** + 需要具象圖的章節寫**插圖描述**。

**outline 的邊界**（關鍵）：

| outline 必須寫 | outline 不要寫 |
|---|---|
| 頂部**進度看板**（CP-0~CP-5 + 逐章狀態，初始全 ⬜） | 具體動畫類型（blur clear / wipe / 彈簧） |
| 章節切分（**含 `00-cover`**）/ 每章 step 數 / 估時 | CSS 實作手段（filter / SVG / clip-path） |
| 每步畫面內容（hero / 數據 / 標語 / 列表項） | 時長數值（不寫 ~2.5s / 80~120ms） |
| 章節級**資訊池**：從 article 抽的數字 / 引用 / 案例 / 標籤 | 持續微動 / 錯開時間量等微觀節奏 |
| 章節級**插圖描述**（選填，只寫「畫什麼」） | 插圖畫風 / 生圖 prompt（畫風由主題 `styleReference` 決定） |
| 步級關係名前綴（「對比反差」/「遞進列表」/「金句」等可選 hint） | —— |

> **outline 不寫動畫的理由**：寫死動畫 = chapter agent 退化成翻譯機；
> 留白讓 chapter agent 在每步開工時依 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
> 的「內容驅動決策樹」自由設計，才有真正的影片感。詳見
> [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) Part 0 原則 7。

**寫入檔案後必須先走自我檢查再進 Checkpoint Plan**：依上文「強制自我檢查協定」分別
對 `script.md` / `outline.md` 執行（優先 Agent Teams → subAgent → 自我檢查），
依結論修正完成後再進入 Checkpoint Plan。

▸ 回寫 `outline.md` 進度看板：**CP-0 → ✅**

---

## Checkpoint Plan · CP-1 —— 5 件事一次對齊（**硬節點**）

`script.md` + `outline.md` 寫完後必須停下來。**使用者在這一個節點同時確認
5 件事**。

### agent 此時要做的準備工作

1. 讀所有 `themes/*/theme.json` 拿 `nameZh` / `descriptionZh` / `bestFor`
   / `mood` —— **不要寫死清單**（目前內建只有一套，但照樣動態讀，
   將來加了主題不用改這裡）
2. 對照 `script.md` 的內容類型 / 語氣，說明這套主題**為什麼合適**
   （命中哪幾條 `bestFor`）；不合適就主動提議衍生新主題
3. 掃一遍 `outline.md` 末尾「素材清單」部分，把 `⚠️`（待使用者提供）和
   `🎨`（待圖片生成工具產出）兩類分開列

### 總結樣板（骨架，agent 依情況填充）

```
內容計畫寫完，產出檔案：
  📄 article.md     {若使用者給原文則保留}
  📄 script.md      {X} 字 / ~{T} 分鐘
  📄 outline.md     進度看板 + 封面 + {N} 章 / {M} 步
                    + 每章資訊池 + 末尾素材清單

章節速覽：
  0. 00-cover 封面           <S> 步 ~<T>s
  1. <id>     <章節標題>     <S> 步 ~<T>s
  2. ...

接下來一次對齊 5 件事：

  1. 稿子 (script.md) 要不要改？
     可以直接編輯檔案，或口頭告訴我修改方向。

  2. 開發計畫 (outline.md) 要不要改？重點看：
     - 章節切分 / step 數 / 估時是否合理（合理判斷：每章 30~60s）
     - 每步畫面內容是否清晰
     - 每章首段「資訊池」是否有足夠的 article 細節供畫面掛載
     - 「插圖描述」寫得對不對（哪些步真的需要一張具象圖）
     - 末尾素材清單是否完整

  3. 主題確認：<nameZh> (<id>)
     內建只有這一套。它命中你內容的 <bestFor 命中項>；<descriptionZh 摘要>。
     沿用這套 / 還是要我依 references/THEMES.md 幫你衍生一套新的？

  4. 真實素材怎麼準備？
     ⚠️ 需要你提供或我從現有素材挑：<列清單>
        a) 我從 <現有素材路徑> 幫你挑   b) 你自己提供   c) 全部 placeholder
     🎨 我用圖片生成工具產出（照主題 styleReference 的畫風）：<列 outline 裡的插圖描述>
        現在就可以改描述；開發到該章之前才會真的生成。

  5. 開發模式選哪個？

     **封面 + 第 1 章無論哪種模式都必須主執行緒做完 + 使用者驗收**（強制 anchor）。
     差異在第 2 章及之後：

     A) 預設 · 逐章確認（推薦）
        每章做完都暫停驗收 → 風險可控 / 節奏最穩
     B) 第 1 章後循序開發（不平行）
        第 2~N 章主執行緒循序做完後統一驗收 → 速度中等 / 適合 agent 不支援平行
     C) 第 1 章後平行開發（subagent）
        第 2~N 章用 subagent 平行 → 最快 / 使用者控制平行數（一次幾章）
        ⚠️ 風格各章會有差異（這是預期，主題禁區保底）
```

收到回饋後：
- 稿子 / outline 要改：直接編輯檔案，編輯完 ping 一次（或口頭描述讓 agent 改）
- **主題必須明確**才進入 Phase 2。使用者說「主題你決定」→ 用內建的
  `we-bare-bears`，**告訴使用者你用了什麼、為什麼**，給反悔機會
- 模式選定 → 進 Phase 2

▸ 回寫 `outline.md` 進度看板：**CP-1 → ✅**，備註欄記下「主題：<id> ／
開發模式：<A/B/C>」

---

## Phase 2 —— 網頁開發

### 2.1 scaffold

```bash
bash <path-to-web-video-presentation>/scripts/scaffold.sh \
  ./presentation \
  --theme=<確認的主題 id>

bash <path-to-web-video-presentation>/scripts/scaffold.sh --list-themes
```

套件管理器**自動偵測**（pnpm 優先，沒有才用 npm），結果寫進
`presentation/.pm` —— 之後所有指令都讀它。要強制指定就加 `--pm=pnpm` 或
`--pm=npm`。

> 自訂主題 → 先依 [`references/THEMES.md`](references/THEMES.md)
> 「建立新主題」流程做一個 `themes/<my-theme>/`，再 `--theme=<my-theme>`。

scaffold 附一個 `01-example` demo。在寫第一章真實內容前**刪掉**：

```bash
rm -rf presentation/src/chapters/01-example
```

並把 `presentation/src/registry/chapters.ts` 裡 `EXAMPLE_CHAPTER`
的 import 和陣列項移除。

scaffold 的 `ProgressBar` 預設採「試算表 sheet 導覽」：畫面底邊 hover
才出現橫向章節列；最左側固定清單 icon，hover / focus 後向上展開全部章節
總覽（章節名稱、段落數、目前位置、已走過狀態），可直接跳章。它是框架
控制項，但**顏色、字體、表面、邊框與陰影仍必須全部走當前主題 token**；
選定或衍生主題後要把這個控制項一併納入視覺驗收，不能保留通用播放器風格。

### 2.2 封面 + 第 1 章 —— 主執行緒 + 強制驗收（CP-2）

**交付範圍 = 兩個章節**：

| 章節 | 內容 |
|---|---|
| `src/chapters/00-cover/` | **簡報封面** —— 整片第一個畫面。規格見 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)「封面章節（00-cover）」 |
| `src/chapters/01-<id>/` | 內容第 1 章 |

**兩個都做完才進使用者驗收** —— 不允許「先做第 1 章，封面回頭補」。錄影第一
個畫面就是封面，它決定觀眾對整片調性的第一印象；跟第 1 章一起做，調性對不對
一次就能被看出來。

**核心**：都是完整版本一次到位（節奏 + 視覺 + 真實素材齊全）。
**沒有「骨架版」概念** —— 這一批就要做出**使用者能直接驗收**的樣板。

為什麼必須主執行緒：

- 它是 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) 這套指引在**當前
  主題 + 當前題材**下的第一次落地
- 如果指引有盲點 / 主題顏色 / 字體 token 不夠用，這一批一定會暴露 ——
  這時候有人類回饋就能修指引 / 調主題，**早改成本最低**
- 後續章節（無論循序 / 平行）都要參考第 1 章的程式碼模式，所以它 =
  這次專案的「風格錨點（不強求章節間一致，但單章自身得有完整說服力）」

**做完後必須停下來**等使用者驗收：

```
封面 + 第 1 章 <id> 做完了，dev server 在 localhost:5173 執行中。

驗收重點：
  □ 封面：主標題 / 副標 / 講者或出處齊全，第一個畫面就定調主題調性？
  □ 視覺調性對不對？符合 <theme nameZh> 的預期嗎？
  □ 節奏對不對？某些步太快 / 太慢 / 資訊太薄？
  □ 內容驅動動畫是否到位？還是有幾步是無腦進場動畫？
  □ 雙來源原則：畫面上有沒有「旁白沒唸但 article 能掛載」的細節？
  □ 生成插圖（若有）：畫風跟主題對得上嗎？圖裡有沒有跑出文字？
  □ 反 AI 味檢查：紫粉漸層 / 圓角彩色邊框 / 假插畫 / emoji 是否有？

有問題告訴我，我針對性修改。OK 了告訴我「繼續」，我依選定模式做第 2 章及之後。
```

▸ 使用者說 OK 後回寫 `outline.md` 進度看板：**CP-2 → ✅**，章節表
`00-cover` / `01-<id>` → ✅

### 2.3 第 2~N 章 —— 依選定模式

**所有模式下的共同規則**：每章獨立依 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
開發。**風格不強求章節間完全一致** —— 主題顏色 / 字體 token 保底維持視覺
統一，動畫 / 節奏 / 視覺演示由章節自由發揮是設計預期。

#### 模式 A · 預設 · 逐章確認

第 2 章做完 → 暫停驗收 → OK → 第 3 章 → 暫停 → ... → 第 N 章。**每章
獨立驗收**，有問題隨時改，**風險最低，節奏最穩**。**使用者不明確選模式時
預設走這個**。

▸ 每章驗收通過就回寫章節表該列 → ✅；全部 ✅ 後 **CP-3 → ✅**

#### 模式 B · 第 1 章後循序開發

第 2 章 → 第 3 章 → ... → 第 N 章 **主執行緒循序做完，最後統一驗收**。
速度中等，適合 agent 不支援平行任務的環境。

▸ 每章做完先記 🔵（待驗收），統一驗收通過後一次刷成 ✅ + **CP-3 → ✅**

#### 模式 C · 第 1 章後平行開發（subagent）

用 subagent 把第 2~N 章平行做完，最大平行數由使用者控制（「一次 4 章」
/「一次 2 章」）。**最快，但風格各章會有差異** —— 這是預期，因為：

1. 每個 subagent 看不到別的 subagent 產出，無法機械對齊
2. 章節程式碼物理分離（每章一個資料夾 / 自己的 CSS 前綴），不會互相
   破壞
3. 主題 token 保底維持視覺統一（顏色 / 字體 / hero 數字 / 卡片 / 分隔線
   個性 / 裝飾），調性不會跑偏
4. **風格不一致 = 人手寫影片的呼吸感**（多 voice / 多視角）

平行 subagent 的 prompt 必須包含：

- 當前章節 outline 段落（含資訊池 + **本章插圖描述**，若有）
- `references/CHAPTER-CRAFT.md` 的路徑（**單一必讀** —— 視覺演示要求 +
  逐步揭示 + 雙來源原則 + 反 AI 味 + 程式碼紅線 + 完工自我檢查全部在這一份裡）
- **本章有插圖描述時**：`references/ILLUSTRATIONS.md` 的路徑 + 主題
  `styleReference` 的實際檔案路徑（subagent 自己生成自己那幾張圖）
- 當前主題 `theme.json` 的 `descriptionZh` / `mood` / `bestFor`（參考調性
  即可，動畫 / 時長 / 字級 / emoji 由 chapter agent 自由決定）
- **第 1 章程式碼作為「程式碼風格」參考**（不是「視覺抄襲對象」）
- **進度看板當前狀態**（讓 subagent 知道整體進行到哪）
- 套件管理器：讀 `presentation/.pm`（本專案是 pnpm 還是 npm）
- 硬規則：每章獨立 CSS 前綴（`.cd-` / `.mg-` / `.wg-` / ...）；
  不修改 `chapters.ts`；**不寫 `outline.md`**（進度看板由主執行緒回寫，
  避免並行衝突）；完工跑 `pnpm exec tsc --noEmit`（或 `npx tsc --noEmit`）

▸ subagent 全部回報後由**主執行緒**統一回寫章節表 + **CP-3 → ✅**

**重要**：無論選哪種模式，**使用者隨時可以中途切換模式**。第 2 章 OK
後使用者說「剩下的平行」/「剩下的逐章」都行。

### 2.4 實作單章（每章必走）

#### 2.4.0 插圖素材準備（**只在本章 outline 寫了「插圖描述」時做**）

**動手寫章節程式碼之前**先把圖備齊：

1. 讀 [`references/ILLUSTRATIONS.md`](references/ILLUSTRATIONS.md)
2. 先查主題 `theme.json` 的 `illustrations` 有沒有現成的能命中，能用就用
3. 要生成的：以主題 `styleReference` 為畫風錨點，呼叫當前 agent 的圖片生成工具
   （Claude Code 用 ImageGen），產出到
   `presentation/public/illustrations/<chapter-id>/<slug>.png`
4. 呼叫不到工具 / 生成失敗 → 降級為 placeholder 佔位卡，**並在交付時明確
   告訴使用者哪張沒生成出來**
5. 回寫 `outline.md` 素材清單：`🎨` → `✓`（或降級後的 `⚠️`）

#### 2.4.1 章節實作

詳細指引見 [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) ——
**單一必讀入口**，涵蓋：封面規格 / 視覺演示要求 / 逐步揭示 / 內容取捨 /
雙來源原則 / 影片演示基本美感 / 反 AI 味 / 程式碼紅線 / 完工自我檢查。

**核心要點**（CHAPTER-CRAFT.md 詳述）：

- **每章必須有 CSS / SVG / Canvas / JS 視覺演示**，禁止純文字章節 ——
  **生成插圖不算數**，演示元素必須章節自己畫
- **逐步揭示**：清單 / 列表必須 1 項 = 1 step，禁止一次全部展示
- **雙來源原則**：節奏跟旁白稿（順序不能亂），細節回原文章抽（資訊池 +
  本章 article 段落）
- **主題角色素材**：`theme.json` 若宣告 `illustrations`，只在該 step 確實
  描述人物行動 / 分工 / 情緒 / 協作時穿插；每個 scene 最多一張，角色
  服務敘事而不是充當固定角標或背景裝飾
- **完工自我檢查逐項過**，不達標回去改 —— 依上文「強制自我檢查協定」執行
  （優先 Agent Teams → subAgent → 自我檢查），**改完再向使用者回報本章交付**

### 2.5 大改後 bump STORAGE_KEY

改動 `chapters.ts`（新增 / 刪除 / 重排章節，或某章 `narrations.ts`
長度變化）後，**bump** `presentation/src/hooks/useStepper.ts` 的
`STORAGE_KEY`（如 `v4` → `v5`），避免持久化的游標落到不存在的 step 上。

---

## Checkpoint Audio · CP-4 —— 是否合成音檔（**硬節點**）

Phase 2 結束後必須停下來，問使用者：

```
網頁做完，封面 + {N} 章 {M} 步，dev server 在 localhost:5173 跑著。

要不要合成音檔做「自動播放錄影」？
  ✓ 合成 → 掃描所有章節的 narrations.ts 出 audio-segments.json，
           呼叫 TTS provider 合成每步一個 mp3 到 public/audio/。
           合成完後用 ?auto=1 模式可以一鏡到底錄影（影音天然同步）。
           內建兩個 provider：
             • minimax (mmx-cli)    —— 預設，中文音色穩
             • openai  (OPENAI_API_KEY) —— curl-based，多數人已有 key
           其它後端 (ElevenLabs / edge-tts 免費 / macOS say 離線 /
           Azure / Google) 見 scripts/tts-providers/README.md 的現成片段。
  ✗ 不合成 → 跳過 Phase 3，直接 Phase 4 用手動錄影 + 後製配音。
```

要合成 → Phase 3。不合成 → 直接 Phase 4。

▸ 回寫 `outline.md` 進度看板：**CP-4 → ✅**（不合成記 **⏭️**）

---

## Phase 3 —— 音檔合成（選擇性）

詳細流程見 [`references/AUDIO.md`](references/AUDIO.md)。簡版
（`pnpm` 換成 `npm` 也行 —— 看 `presentation/.pm`）：

```bash
cd presentation
pnpm run extract-narrations   # 掃描所有 narrations.ts → audio-segments.json
# 讓使用者掃一眼 audio-segments.json 確認文字對
pnpm run synthesize-audio                       # 預設 minimax provider，增量
# 或用內建 openai (要 OPENAI_API_KEY):
PRESENTATION_TTS=openai pnpm run synthesize-audio
# 或自訂：寫一個 scripts/tts-providers/<name>.sh，見該目錄的 README.md
```

合成完告訴使用者：輸出位置 / 總段數 / 哪些段時長異常（太長 = 該 step 該拆
分；太短 = 文案太薄）—— 給最後一次校準節奏的機會。然後進入 Phase 4。

---

## Phase 4 —— 螢幕錄影 + 後製

詳見 [`references/RECORDING.md`](references/RECORDING.md)。兩種路徑：

| 情境 | 建議路徑 |
|---|---|
| Phase 3 已合成音檔 | **Auto 模式一鏡到底**：瀏覽器開 `localhost:5173/?auto=1` → 按 SPACE → 整片自動播完 → 停止錄影 → 裁掉頭尾即成片，**不需後製對音軌** |
| Phase 3 跳過 | 預設 Manual 模式手動點擊推進 → 後製用任意剪輯工具配音 |

> agent 在 Phase 3 / Checkpoint Audio 後**主動告訴使用者**適合的錄影路徑。

▸ 告知後回寫 `outline.md` 進度看板：**CP-5 → ✅**

---

## 十條原則（一句話清單）

完整展開見 [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
Part 0 —— **寫章節時回那裡查**，下面只是索引。

| # | 原則 | 一句話 |
|---|---|---|
| 1 | 16:9 固定舞台 | 內容 1920×1080 + transform scale，沒有響應式 |
| 2 | 全域 step 計數器 | 章節是 step 的純函式，無計時器 |
| 3 | 每步獨佔整個畫面 | `if (step === N) return <FullScene />` |
| 4 | 旁白節拍 = step | 一節拍 = 一 step = 一個聚焦的想法 |
| 5 | 隱藏的邊角控制項 | 進度列預設 opacity 0；底邊 hover 顯示橫向章節列，左側清單 icon 展開全部章節總覽 |
| 6 | 舞台無 chrome | 沒有 header / footer / 頁碼 / 品牌條 |
| 7 | **內容驅動動畫** | 先找內在動作，找不到才用進場動畫保底；持續微動慎用 |
| 8 | 多點逐個揭示 | 1 項 = 1 step，禁止同步 stagger 上 N 項 |
| 9 | 整片同一主題 | 章節間不換表面色；**顏色 / 字體走 token**，其它尺度章節自由 |
| 10 | 雙來源原則 | script 定節拍，**article 定畫面密度**（落到資訊池） |

---

## 常見使用者回饋速查

簡化表見 [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
Part 8「常見回饋速查」。**關鍵**：先定位是哪一層（節奏 / 視覺 / 內容
/ 程式碼），再改最小切片，**不要重做整章**。

---

## 相關資源

依「何時讀」標註，避免一次全部讀完：

| 檔案 | 何時讀 | 內容 |
|---|---|---|
| [`references/SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) | Phase 1.2 必讀 | 文章 → 旁白稿規則、平台變體 |
| [`references/OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md) | Phase 1.2 必讀 · **接手時查進度看板** | outline.md 欄位 spec、**進度看板**、`00-cover` 編號慣例、命名慣例、章節切分、資訊池、**插圖描述** |
| [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) | **Phase 2.4 每章單一必讀入口** | Part 0 十條原則 / Part 1 開工 5 問 / Part 2 關係→動作決策樹 / Part 3 視覺工具箱 / Part 4 時長 / Part 5 反 AI 味反模式 / Part 6 程式碼硬規則 / Part 7 完工自我檢查 / Part 8 回饋速查 / **封面章節（00-cover）規格** |
| [`references/ILLUSTRATIONS.md`](references/ILLUSTRATIONS.md) | **該章 outline 寫了「插圖描述」時必讀** | 該生成什麼 / 不該生成什麼、以主題 `styleReference` 為畫風錨點的 prompt 配方、輸出路徑、呼叫不到圖片生成工具時的 placeholder 降級 |
| [`references/EXAMPLES/`](references/EXAMPLES/) | **選擇性** —— 看結構 | 章節結構示意（hook / list-reveal / case-tech-review）；**不是抄襲樣板** |
| [`references/THEMES.md`](references/THEMES.md) | 選 / 做 / 換主題時 | 完整 token 契約 + 內建主題清單 + 建立流程 |
| [`references/AUDIO.md`](references/AUDIO.md) | Phase 3 才讀 | provider-agnostic 音檔合成流程、內建 minimax 用法、換 provider 路徑、疑難排解 |
| [`templates/scripts/tts-providers/README.md`](templates/scripts/tts-providers/README.md) | 換 / 加 TTS provider 時 | 三函式契約 + 內建 2 個 (minimax / openai) + 5 種現成程式碼片段（ElevenLabs / edge-tts / macOS say / Azure / Google） |
| [`references/RECORDING.md`](references/RECORDING.md) | Phase 4 才讀 | 螢幕錄影工具 + 後製合成 |
| [`themes/`](themes) | Checkpoint Plan / Phase 1.2 時翻 | 內建主題（含 `theme.json` + `tokens.css` + 選擇性 `assets/`）。目前只有 `we-bare-bears`，要別的調性照 THEMES.md 衍生 |
| [`scripts/scaffold.sh`](scripts/scaffold.sh) | Phase 2.1 跑一次 | 一鍵專案 scaffold（pnpm 優先 / npm 備援，`--pm=` 可強制指定） |
