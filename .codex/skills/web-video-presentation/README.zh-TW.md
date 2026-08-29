# Web Video Presentation Skill

**把文章或旁白稿做成點擊驅動的 16:9 網頁簡報，並透過螢幕錄影產出有電影感影片的 Agent Skill。**

[English](./README.md) · [回到集合首頁](../../README.md)

![Web Video Presentation Skill](https://cdn.jsdelivr.net/gh/ConardLi/assets@main/imgs/web-video-presentation-skill.webp)

---

## 這是什麼？

`web-video-presentation` 幫 Agent 建構一種 Vite + React + TypeScript 簡報：它看起來不是傳統投影片，而更像為螢幕錄影設計的影片舞台。每次點擊推進一個旁白節拍，每一步獨佔 1920×1080 舞台，進度 UI 平時隱藏，只有滑鼠停留時出現，方便錄出乾淨畫面。

它適合：

- 把文章改寫成 YouTube / Instagram Reels / TikTok 風格旁白稿
- 把已有旁白稿做成有節奏的網頁簡報
- 做產品展示、教學、keynote 式講解、視覺 talk
- 做「動態簡報，但不要像簡報」的展示體驗
- 在視覺 outline 對齊後，可選擇合成旁白音檔

這個 Skill 的核心是**方法論 + 協作流程**。scaffold 提供 token、舞台原語、主題和範例，但每個專案仍然應該依主題重新選擇視覺語言。

---

## 核心理念

- **固定 16:9 舞台**：內容寫在穩定的 1920×1080 座標系裡，再依視窗大小縮放。
- **一個全域 step 游標**：點擊或鍵盤推進 `(chapter, step)`，游標在本機持久化。
- **一步一個想法**：每個節拍獨佔整個畫面，不堆疊項目符號。
- **旁白節拍驅動結構**：講述節奏直接對應到視覺 step。
- **隱藏 chrome**：進度控制項滑鼠停留才出現，錄影畫面保持乾淨。
- **動態效果優先**：每一步都需要一個會動的視覺錨點，靜態內文是壞味道。
- **主題 token**：視覺屬性透過語意 token 驅動，換主題不只是換顏色。
- **可插拔 TTS**：provider-agnostic 音檔 runner，**內建 2 個 provider**（MiniMax `mmx-cli` + OpenAI TTS via curl）；往 `tts-providers/` 丟一個 `.sh` 就能換成 ElevenLabs / edge-tts / Azure / Google Cloud / macOS `say` / 任何自架 TTS。
- **硬 checkpoint + 狀態外部化**：Agent 在固定節點停下來確認，且每個節點的狀態都寫在 **`outline.md` 頂部的「進度看板」** —— 換 session、接續、平行 subagent 都能看出流程走到哪。
- **封面章節是必須的**：`00-cover` 與第 1 章一起在主執行緒做完、一起驗收；內容章節從 `01-` 起。
- **選填生成式插圖**：某章可在 outline 寫「插圖描述」，開發該章之前 Agent 呼叫圖片生成工具產出素材，畫風錨定主題的 `styleReference`，讓全片插圖屬於同一套視覺語言。
- **pnpm 優先 / npm 備援**：scaffold 自動偵測套件管理器，結果寫進 `<project>/.pm`，`--pm=` 可強制指定。

---

## 工作流

```text
Phase 1.1  辨識使用者輸入
Phase 1.2  文章 -> 旁白稿 + outline.md（含進度看板）
   |
CP-0       script.md / outline.md 自我檢查
   |
CP-1       Checkpoint Plan：稿子 / outline / 主題 / 素材 / 開發模式
   |
Phase 2.1  scaffold Vite / React / TS 專案
Phase 2.2  封面 00-cover + 第 1 章（主執行緒）
   |
CP-2       使用者驗收封面 + 第 1 章  <- 不可跳過
   |
Phase 2.3  第 2~N 章（逐章 / 循序 / 平行）
   |
CP-3       第 2~N 章驗收
   |
CP-4       Checkpoint Audio：合成或跳過
   |
Phase 3    選擇性音檔合成
Phase 4    螢幕錄影與後製 -> CP-5
```

這些 checkpoint 是 Skill 契約的一部分：Agent 不應該從原文一路悶頭做到成品。每過一個節點就立刻回寫 `outline.md` 的進度看板 —— 只存在於對話裡的狀態等於沒有狀態。

---

## 內含內容

```text
skills/web-video-presentation/
├── SKILL.md
├── README.md / README.zh-TW.md
├── references/
│   ├── CHAPTER-CRAFT.md       # 每章唯一必讀入口
│   ├── OUTLINE-FORMAT.md      # 進度看板 + outline spec
│   ├── SCRIPT-STYLE.md
│   ├── ILLUSTRATIONS.md       # 生成式插圖流程
│   ├── THEMES.md
│   ├── AUDIO.md
│   ├── RECORDING.md
│   └── EXAMPLES/
├── scripts/
│   └── scaffold.sh
├── templates/
│   ├── index.html
│   ├── vite.config.ts
│   ├── scripts/
│   │   ├── extract-narrations.ts
│   │   ├── synthesize-audio.sh       # provider-agnostic runner
│   │   └── tts-providers/            # 一個檔案 = 一個 TTS 後端
│   │       ├── README.md             # 三函式契約 + ElevenLabs / edge-tts / Azure / Google / say 的現成片段
│   │       ├── minimax.sh            # 預設 provider（mmx-cli）
│   │       └── openai.sh             # 內建：OpenAI TTS（curl + OPENAI_API_KEY）
│   └── src/
└── themes/                    # 1 套內建主題（要別的調性從它衍生）
    └── we-bare-bears/
        ├── theme.json         # metadata + illustrations + styleReference
        ├── tokens.css
        └── assets/            # 3 張角色圖 + 1 張風格參考圖
```

---

## 快速上手

把這個 Skill 複製到你的 Agent 會掃描的目錄，然後讓 Agent 把一篇文章或旁白稿做成網頁影片簡報。

如果要手動執行 scaffold：

```bash
bash skills/web-video-presentation/scripts/scaffold.sh ./presentation --theme=we-bare-bears
```

查看可用主題：

```bash
bash skills/web-video-presentation/scripts/scaffold.sh --list-themes
```

產生的 `presentation/` 是一般的 Vite + React + TypeScript 專案。啟動後用螢幕錄影工具錄製 16:9 舞台即可。

---

## 主題

Skill **內建 1 套主題**。早期版本內建 24 套，現在刻意收斂成單一一套 ——
衍生一套新的成本很低：複製目錄、改 `tokens.css` 和 `theme.json`，完成。

### `we-bare-bears` · 熊熊遇見你

溫暖日常繪本感：奶油紙張、天空藍單一 accent、蜂蜜木色中性色、Nunito 圓體。
簽名是**圓角紙卡 + 2px 炭黑手繪輪廓與淡藍錯位影**。

**適合**：團隊協作 / Git 教學 · 入門技術分享 · 工作流程與工具解說 ·
友善知識科普 · 輕鬆文化生活內容。

另附 `assets/` 素材包：三張角色插圖，加一張**風格參考圖** —— 它同時是封面
版型藍圖，也是生成插圖的畫風錨點。

- metadata：[`themes/we-bare-bears/theme.json`](themes/we-bare-bears/theme.json)
- Token：[`themes/we-bare-bears/tokens.css`](themes/we-bare-bears/tokens.css)
- 自建主題：[`references/THEMES.md`](references/THEMES.md)

---

## Reference Map

- [CHAPTER-CRAFT.md](./references/CHAPTER-CRAFT.md)：每章唯一必讀入口 —— 封面規格、十條原則、視覺演示底線、反 AI 味、程式碼紅線、完工自我檢查
- [OUTLINE-FORMAT.md](./references/OUTLINE-FORMAT.md)：outline 結構 —— 進度看板、`00-cover` 編號、資訊池、選填插圖描述
- [SCRIPT-STYLE.md](./references/SCRIPT-STYLE.md)：文章轉旁白稿規則
- [ILLUSTRATIONS.md](./references/ILLUSTRATIONS.md)：什麼該生成、以主題 `styleReference` 為錨點的 prompt 配方、輸出路徑、placeholder 降級
- [THEMES.md](./references/THEMES.md)：完整 token 契約 + 衍生新主題流程
- [EXAMPLES/](./references/EXAMPLES/)：選擇性的章節結構 anchor（不是抄襲樣板）
- [AUDIO.md](./references/AUDIO.md)：選擇性旁白音檔合成流程（provider-agnostic）
- [tts-providers/README.md](./templates/scripts/tts-providers/README.md)：TTS provider 三函式契約 + 內建 2 個 (minimax / openai) + ElevenLabs / edge-tts / Azure / Google / macOS say 的現成程式碼片段
- [RECORDING.md](./references/RECORDING.md)：螢幕錄影與後製注意事項
