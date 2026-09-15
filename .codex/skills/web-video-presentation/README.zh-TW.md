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

這個 Skill 固定產出**熊熊遇見你式溫暖繪本風**。內容動作可依題材設計，但
調色盤、字體、紙卡材質、手繪輪廓、角色比例與插圖畫風必須跨章一致。

---

## 核心理念

- **固定 16:9 舞台**：內容寫在穩定的 1920×1080 座標系裡，再依視窗大小縮放。
- **一個全域 step 游標**：點擊或鍵盤推進 `(chapter, step)`，游標在本機持久化。
- **一步一個想法**：每個節拍獨佔整個畫面，不堆疊項目符號。
- **旁白節拍驅動結構**：講述節奏直接對應到視覺 step。
- **隱藏 chrome**：進度控制項滑鼠停留才出現，錄影畫面保持乾淨。
- **動態效果優先**：每一步都需要一個會動的視覺錨點，靜態內文是壞味道。
- **固定熊熊 token**：視覺屬性透過語意 token 驅動，避免各章風格漂移。
- **可插拔 TTS**：provider-agnostic 音檔 runner，**內建 2 個 provider**（MiniMax `mmx-cli` + OpenAI TTS via curl）；往 `tts-providers/` 丟一個 `.sh` 就能換成 ElevenLabs / edge-tts / Azure / Google Cloud / macOS `say` / 任何自架 TTS。
- **硬 checkpoint + 狀態外部化**：Agent 在固定節點停下來確認，且每個節點的狀態都寫在 **`outline.md` 頂部的「進度看板」** —— 換 session、接續、平行 subagent 都能看出流程走到哪。
- **封面章節是必須的**：`00-cover` 與第 1 章一起在主執行緒做完、一起驗收；內容章節從 `01-` 起。
- **Illustration Pass**：outline 先替每個 step 標記情境插圖 / 程式演示 /
  真實素材 / 文字構圖，並提出具體插圖建議供 CP-1 確認。
- **零文字情境插圖**：ImageGen 只產透明角色／情境層，使用 golden reference
  與角色參考圖；所有標題、數字與說明留在 HTML。
- **機械驗證**：檢查 outline / step / narrations / 素材 / CSS / 圖片大小漂移。
- **pnpm 優先 / npm 備援**：scaffold 自動偵測套件管理器，結果寫進 `<project>/.pm`，`--pm=` 可強制指定。

---

## 工作流

```text
Phase 1.1  辨識使用者輸入
Phase 1.2  文章 -> 旁白稿 + outline.md（含進度看板）
   |
CP-0       script.md / outline.md 自我檢查
   |
CP-1       Checkpoint Plan：稿子 / outline / 插圖建議 / 素材 / 開發模式
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
│   ├── scaffold.sh
│   └── validate-project.mjs
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
└── themes/                    # 固定熊熊視覺系統
    └── we-bare-bears/
        ├── theme.json         # layout / golden scene / character references
        ├── tokens.css
        └── assets/            # 角色圖 + 封面版型 + 情境 golden reference
```

---

## 快速上手

把這個 Skill 複製到你的 Agent 會掃描的目錄，然後讓 Agent 把一篇文章或旁白稿做成網頁影片簡報。

如果要手動執行 scaffold：

```bash
bash skills/web-video-presentation/scripts/scaffold.sh ./presentation --theme=we-bare-bears
```

機械驗證：

```bash
node skills/web-video-presentation/scripts/validate-project.mjs <project-root>
```

產生的 `presentation/` 是一般的 Vite + React + TypeScript 專案。啟動後用螢幕錄影工具錄製 16:9 舞台即可。

---

## 主題

Skill 的輸出契約固定為 `we-bare-bears`，不在每個專案重新選擇主題。

### `we-bare-bears` · 熊熊遇見你

溫暖日常繪本感：奶油紙張、天空藍單一 accent、蜂蜜木色中性色、Nunito 圓體。
簽名是**圓角紙卡 + 2px 炭黑手繪輪廓與淡藍錯位影**。

**適合**：團隊協作 / Git 教學 · 入門技術分享 · 工作流程與工具解說 ·
友善知識科普 · 輕鬆文化生活內容。

另附 `assets/` 素材包：三張角色插圖、獨立封面 layout reference，以及
Coding Agent 衝突情境 golden reference。封面參考禁止餵給 ImageGen。

- metadata：[`themes/we-bare-bears/theme.json`](themes/we-bare-bears/theme.json)
- Token：[`themes/we-bare-bears/tokens.css`](themes/we-bare-bears/tokens.css)
- 視覺一致性契約：[`references/THEMES.md`](references/THEMES.md)

---

## Reference Map

- [CHAPTER-CRAFT.md](./references/CHAPTER-CRAFT.md)：每章唯一必讀入口 —— 封面規格、十條原則、視覺演示底線、反 AI 味、程式碼紅線、完工自我檢查
- [OUTLINE-FORMAT.md](./references/OUTLINE-FORMAT.md)：outline 結構 —— 進度看板、每步視覺類型、Illustration Pass、插圖建議
- [SCRIPT-STYLE.md](./references/SCRIPT-STYLE.md)：文章轉旁白稿規則
- [ILLUSTRATIONS.md](./references/ILLUSTRATIONS.md)：零文字透明情境層、參考圖、穩定 prompt、QA / 重試 / 降級
- [THEMES.md](./references/THEMES.md)：固定熊熊視覺一致性與 token 契約
- [EXAMPLES/](./references/EXAMPLES/)：選擇性的章節結構 anchor（不是抄襲樣板）
- [AUDIO.md](./references/AUDIO.md)：選擇性旁白音檔合成流程（provider-agnostic）
- [tts-providers/README.md](./templates/scripts/tts-providers/README.md)：TTS provider 三函式契約 + 內建 2 個 (minimax / openai) + ElevenLabs / edge-tts / Azure / Google / macOS say 的現成程式碼片段
- [RECORDING.md](./references/RECORDING.md)：螢幕錄影與後製注意事項
