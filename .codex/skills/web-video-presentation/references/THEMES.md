# 主題系統

每個簡報從頭到尾跑**一個主題**。我們**不**在章節間翻轉明暗 —— 那會
打斷影片的視覺連貫性，錄影時看起來像很硬的剪輯。如果想要「暗一點的氛圍」
段落，請在**同一調色盤內**降對比、收聚光，而不是翻轉表面色。

主題 = 一組 CSS 設計 token + 一個 `theme.json` metadata；需要情境角色或
品牌插圖時，可再附一個選擇性的 `assets/` 素材包。

**章節對 token 的使用分兩層**：

1. **必須用 token 的**（換主題不破的底線）—— 顏色 + 字體家族
2. **章節自由發揮的**（依內容設計）—— 字級 / 間距 / 動畫時長 / 緩動 /
   邊框寬度 / 一般圓角 / 字距等都可寫死

主題**不只管**顏色和字體，但其他面向（hero 數字、分隔線、卡片、舞台
裝飾）透過 **primitive class**（`.hero-num` / `.rule` / `.card` /
`.stage-frame`）自動接入，章節用 class 即可，不需要手動 `var()`。

主題管的面向：

| 面向                       | 主題怎麼管                                                        |
| -------------------------- | ----------------------------------------------------------------- |
| **調色盤**                 | shell / surface 階梯、text 階梯、accent + 透明度衍生              |
| **字體**                   | 中文 / 英文 / body / 等寬家族 + OpenType 特性集                     |
| **舞台 padding 密度**      | `--stage-pad-x/y` —— 精煉主題 140×100，密集主題 80×60              |
| **圓角個性**               | `--r-card` —— sharp (0) / refined (4) / soft (16) / keynote (32)  |
| **分隔線個性**             | `--rule-w` + `--rule-style` —— 細/粗 × 實/虛                       |
| **hero 數字風格**          | `--hero-num-*` —— 編輯級斜體 / 終端等寬 / 粗黑 / 手寫              |
| **舞台 / 卡片陰影**        | `--shadow-stage` / `--card-shadow` —— 紙浮 / 偏移實色 / 內陰影     |
| **裝飾層**                 | `--surface-pattern*` / `--surface-vignette` / `--text-shadow`     |
| **動態效果基線**           | `theme.json` 的 `mood` —— 電影感慢 / 彈簧 / 俐落 / 安靜            |

> **`mood` 不寫時長數值**。具體 ms / 緩動由 chapter agent 看 `mood`
> 自己決定（慢主題別寫 200ms 快動畫，僅此而已）。

每個主題約 25~35 個 token。完整契約見下方。

---

## 內建主題

**目前只內建一套**。要別的調性，照下方「建立新主題」從它衍生一套 ——
衍生成本很低（改一個 `tokens.css` + 一個 `theme.json`），比養一堆用不到
的主題清爽。

| id | 個性 |
| --- | --- |
| `we-bare-bears` | 熊熊遇見你式溫暖日常。奶油紙張 + 天空藍單一 accent + 蜂蜜木色中性色 + Nunito 圓體。**圓角紙卡 + 2px 炭黑手繪輪廓與淡藍錯位影**是簽名。附 `assets/` 素材包：三張角色圖 + 一張封面版型／插圖畫風參考圖。適合協作、Git、入門教學與輕鬆知識內容。 |

<details>
<summary>歷史主題（已移除）</summary>

早期版本內建 24 套主題（midnight-press / newsroom / bauhaus-bold / …）。
現已收斂為單一主題 —— 需要那種調性就照「建立新主題」自己衍生，
本檔案的 token 契約與設計規則完全適用。

</details>

### 主題該長什麼樣（衍生時的方向參考）

一套好主題 = **一個設計簽名 + 一個 accent + 一組字體配對**，不是三種
裝飾疊在一起。幾個可用的方向（不是清單，是思路）：

| 想要的調性 | 該怎麼調 |
| --- | --- |
| 電影感 / 編輯級暗底 | 暖色近黑（不用純黑）當 `--surface`，單一暖橘 accent，襯線斜體英文 + 中文襯線，慢節奏，只留 vignette 不加顆粒 |
| 報刊 / 紀錄片 | 報紙奶油底 + 墨黑襯線 + 單一旗紅，`--r-card: 0`（報紙不圓角），淡紙紋 |
| 終端機 / 技術 / 藍圖 | 全場等寬字，直角，虛線 rule + 網格 `--surface-pattern`，冷色 accent，俐落線性動態效果 |
| 現代主義 / 宣言 | 米白 + 墨黑 + 原色，`--r-card: 0` + 4px 實色厚邊 + 偏移實色陰影，900 字重 hero 數字 |
| 精煉 / 安靜 / 藝廊 | 單一中性墨色當 `--text`、幾乎無 accent，1px 髮絲 rule，**無裝飾**，極寬 `--stage-pad-*`，最慢節奏 |
| 手作 / 懷舊 / zine | 暖紙底 + 粗紙紋、虛線剪貼線、偏移彩色陰影，襯線斜體 + overshoot 彈簧動態效果 |
| 友善 / 入門 / 協作 | **就是 `we-bare-bears`** —— 直接用，別重造 |

規則永遠是那幾條（詳見下方「建立新主題 → 第 2 步」）：**一個** accent、
**一個** 設計簽名、`--text` 對 `--surface` ≥ 4.5:1。

隨時列出可用主題：

```bash
bash <path-to-web-video-presentation>/scripts/scaffold.sh --list-themes
```

---

## scaffold 時挑一個主題

```bash
# 預設（we-bare-bears）
bash scripts/scaffold.sh ./presentation

# 明確指定
bash scripts/scaffold.sh ./talk --theme=we-bare-bears
```

scaffold 會把所選主題的 `tokens.css` 複製到 `<project>/src/styles/tokens.css`，
並把主題 id 寫到 `<project>/.theme`，方便以後看是從哪個主題開始的。
若主題含 `assets/`，也會自動複製到 `<project>/public/theme-assets/`，並
附上 `theme.json` 供章節依 `illustrations` 的情境標籤挑圖。

---

## 之後切換主題

沒有素材包的主題，切換 = 一次檔案覆蓋：

```bash
cp <path-to-web-video-presentation>/themes/<id>/tokens.css \
   presentation/src/styles/tokens.css
```

重新整理 dev server。完成。章節程式碼一行沒動。

新主題若含 `assets/`，再同步素材包：

```bash
mkdir -p presentation/public/theme-assets
cp -R <path-to-web-video-presentation>/themes/<id>/assets/. \
  presentation/public/theme-assets/
```

如果切換後某章節看起來有問題，那是該章節在某處寫死了顏色 / 字體 /
尺寸，而不是用語意 token。去找出來 —— bug 在章節裡，不在主題裡。

---

## 完整 token 契約

`base.css` 給**個性 token 都準備了合理的預設值**。主題的 `tokens.css`
只需要覆蓋**調色盤 + 字體 + 個性旋鈕 + 裝飾**這四類。

> **base.css 裡的字級 / 間距 / 時長尺度只供 primitive class 自己用**
> （`.label-mono` / `.kicker` / `.scene-pad` 等）。**不是**章節必須使用
> 的契約——章節這一層要不要 `var(--t-h1)` 還是直接寫 `font-size: 96px`
> 完全自由。

### 必填（主題必須定義）

#### 表面色（4 個）

| token         | 作用                                                |
| ------------- | --------------------------------------------------- |
| `--shell`     | letterbox / 舞台外的頁面背景                        |
| `--surface`   | 舞台主背景                                          |
| `--surface-2` | 凸起 —— 卡片、程式碼區塊、嵌入面板                  |
| `--surface-3` | 最裡層 —— surface-2 裡再嵌一層時用                  |

#### 文字（4 個）

| token          | 作用                                  |
| -------------- | ------------------------------------- |
| `--text`       | 主                                    |
| `--text-2`     | 次（副標題、內文）                    |
| `--text-mute`  | 靜音 —— 標籤 / metadata               |
| `--text-faint` | 三級 —— 提示 / 停用                   |

#### 線條（1 個）

| token    | 作用              |
| -------- | ----------------- |
| `--rule` | 髮絲分隔線顏色    |

#### Accent（3 個）

| token           | 作用                                          |
| --------------- | --------------------------------------------- |
| `--accent`      | accent 本體（一個品牌強色）                   |
| `--accent-soft` | 低透明度疊層 —— pill 背景、滑鼠停留光暈        |
| `--accent-glow` | 中透明度疊層 —— text shadow、圓點發光          |

#### 字體家族（4 個）

| token               | 作用                                       |
| ------------------- | ------------------------------------------ |
| `--font-display-cn` | 中文顯示家族                               |
| `--font-display-en` | 拉丁顯示家族（斜體強調聲音）               |
| `--font-body`       | 內文 / 段落家族                            |
| `--font-mono`       | 等寬家族（終端機、mono caps、badge）        |

### 選擇性的個性覆蓋（主題應該定義來表達自己的個性）

這些有 base 預設值；主題重新定義來表達個性。

| token              | base 預設           | 作用                                                  |
| ------------------ | ------------------- | ----------------------------------------------------- |
| `--font-features`  | `"tnum","ss01"`     | body 上的 OpenType 特性堆疊                           |
| `--r-card`         | `--r-md`            | 預設卡片圓角（sharp / refined / keynote）              |
| `--r-stage`        | `0`                 | 直接加在舞台本身的圓角                                 |
| `--rule-w`         | `1px`               | rule 粗細（1=髮絲，2=中等，4=厚重）                    |
| `--rule-style`     | `solid`             | rule 樣式（`solid` / `dashed` / `dotted`）             |
| `--hero-num-font`  | `--font-display-en` | `.hero-num` 用什麼字體（主題決定個性）                 |
| `--hero-num-style` | `italic`            | `italic` / `normal`                                   |
| `--hero-num-weight`| `400`               | 400（編輯級）/ 500（等寬）/ 900（粗黑）                |
| `--hero-num-track` | `--track-tight`     | hero 數字的字距                                       |
| `--stage-pad-x`    | `96px`              | 舞台橫向內距（密度旋鈕）                              |
| `--stage-pad-y`    | `80px`              | 舞台縱向內距                                          |
| `--card-shadow`    | none                | `.card` 的 box-shadow                                 |
| `--card-glass-bg`  | `rgba(255,255,255,0.06)` | `.card-glass` 的背景                            |
| `--card-glass-border` | `rgba(255,255,255,0.12)` | `.card-glass` 的邊框                            |
| `--nav-face-bg`    | `--surface-3`       | 左右 step 導覽按鈕的表面色                           |
| `--nav-face-bg-hover` | `--accent`       | 導覽按鈕 hover / focus 的表面色                       |
| `--nav-face-bg-active` | hover 表面色    | 導覽按鈕按下時的表面色                                |
| `--nav-arrow`      | `--surface-2`       | 導覽箭頭顏色                                          |
| `--nav-arrow-hover` | `--surface-2`      | 導覽箭頭 hover / focus 顏色                            |
| `--nav-face-shadow` | accent soft 偏移影 | 導覽按鈕的一般陰影                                    |
| `--nav-face-shadow-hover` | accent soft 偏移影 | 導覽按鈕 hover / focus 陰影                       |
| `--nav-face-shadow-active` | accent soft 偏移影 | 導覽按鈕按下時陰影                                |
| `--shadow-stage`   | dark drop           | 舞台的 box-shadow                                     |
| `--stage-border`   | `none`              | 舞台的選擇性邊框（如粗黑畫框 `4px solid black`）       |

### 選擇性的裝飾層（主題可選用，給質感加簽名）

這些預設是 no-op；主題選擇性啟用。裝飾畫**在舞台上**（pattern 用
`stage-frame::after`，vignette 用 `stage-frame::before`），所以會被螢幕
錄影程式擷取到。

| token                        | 作用                                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `--surface-pattern`          | 疊在舞台上的 `background-image`。SVG 雜訊 / 網格 / 掃描線。                                                |
| `--surface-pattern-size`     | 配套的 `background-size`。可平鋪漸層必填。                                                                  |
| `--surface-pattern-blend`    | pattern 層的 `mix-blend-mode`（`normal` / `multiply` / `overlay`）。                                       |
| `--surface-pattern-opacity`  | pattern 層的整體透明度乘數。                                                                                |
| `--surface-vignette`         | vignette 疊層的 `background`（黑板 / 電影感邊角的放射狀漸層）。                                            |
| `--text-shadow`              | 套用在 `.serif-cn` / `.serif-it` / `.display-en` 上。如粉筆暈 / 磷光。                                      |

如果你需要的裝飾找不到對應插槽，那就跨過「主題契約」邊界進入「章節自訂
CSS」領域 —— 在那裡解決，別擴充主題契約。

---

## 建立新主題

### 1. 從 `we-bare-bears` 複製一份作為起點

內建只有這一套，所以起點就是它。它是淺色 / 單一 accent / 圓角 / 有素材包
的結構 —— 結構完整，改起來比從空檔案寫快。

上方「主題該長什麼樣」給了幾個方向的調法；真正決定調性的是第 2 步那幾個
旋鈕，不是起點是哪一套。

```bash
cd <path-to-web-video-presentation>/themes
cp -r we-bare-bears my-theme
```

### 2. 改 `my-theme/tokens.css`

依契約由上而下走一遍：調色盤 → 字體 → 個性旋鈕（`--r-card` /
`--rule-*` / `--hero-num-*` / `--stage-pad-*`）→ 陰影 → 裝飾。
**不要**碰字級 / 間距 / 時長尺度 —— 那些是 base.css 給 primitive class
用的內部預設值，不是主題契約的一部分。

**幾條不那麼顯而易見的規則：**

- 深色主題裡 `--shell` **比 `--surface` 更深 / 更飽和**；淺色主題裡
  `--shell` **比 `--surface` 略灰一點** —— 這樣舞台讀起來是「主體」，
  外圍會退後。
- 維持 `--text` 與 `--surface` **至少 4.5:1 對比度**。96px+ 的標題
  可以放寬到 3:1，body / cue 必須 ≥ 4.5:1。
- `--accent` 是**唯一的**飽和色。第二個飽和色會跟第一個打架。
- `--accent-glow` 和 `--accent-soft` 是 `--accent` **同色相的透明度
  疊層**，永遠不要用別的色相。
- `--text-faint` 在 `--surface` 上 13px 大寫時**仍然要可讀**。
- 挑**一個設計簽名**重重發力：虛線 rule、粗黑邊、掃描線、紙紋、glass
  slab。別同時疊三個。

### 3. 改 `my-theme/theme.json`

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "nameZh": "我的主題",
  "description": "一句英文描述它的氣質。",
  "descriptionZh": "一句中文描述它的調性。",
  "mood": ["dark", "moody", "futuristic"],
  "bestFor": ["<適配情境 1>", "<適配情境 2>"],
  "preview": {
    "shell": "#080808",
    "surface": "#101010",
    "text": "#f0f0f0",
    "accent": "#ffd54a"
  }
}
```

`id` 必須等於目錄名。

### 主題 metadata 欄位說明

| 欄位 | 必填 | 取值 | 決定什麼 |
|---|---|---|---|
| `id` / `name` / `nameZh` | ✓ | 字串 | 主題識別 |
| `description` / `descriptionZh` | ✓ | 一句話 | Checkpoint Plan 列清單時的簡介 |
| `mood` | ✓ | 標籤陣列 | 模糊比對用 |
| `bestFor` | ✓ | 情境陣列 | Checkpoint Plan 智慧推薦時的命中點 |
| `preview` | ✓ | 4 色物件 | Checkpoint Plan 列清單時的視覺預覽 |
| `illustrationGuidance` | 選填 | 字串 | 主題素材的節制使用原則 |
| `illustrations` | 選填 | 物件陣列 | `path` / `character` / `bestFor` / `altZh` 素材索引 |
| `styleReference` | 選填 | 物件 | `path` / `layoutNote` / `styleNote` —— **一張圖管兩件事**：`layoutNote` 給封面章節（`00-cover`）定版型，`styleNote` 給生成插圖定畫風 |

> **主題不再限制動畫選型 / 時長 / 字級 / emoji**。視覺風格由 `tokens.css`
> 的顏色 / 字體 / 字級 token 決定，動畫 / 節奏 / 視覺演示完全交給 chapter
> agent 在每章實作時依內容自由發揮，避免主題欄位過早限制創造力。
>
> 風格美感限制（不要紫粉漸層、不要 emoji 裝飾、不要假資料等）由
> [`CHAPTER-CRAFT.md`](CHAPTER-CRAFT.md) 統一規定，與具體主題無關。

### 選擇性主題素材包

把可重複使用的點陣圖放在 `themes/<id>/assets/`，並在 `theme.json` 的
`illustrations` 裡登記 `/theme-assets/<filename>`、適用情境和 alt。角色
素材必須服務具體敘事：只有 step 在講人物行動、分工、情緒或協作時才用；
每個 scene 最多一張，避免把角色變成每頁固定貼紙。scaffold 會自動複製素材，
章節不應直接引用 Skill repo 的絕對路徑。

### 選擇性風格參考圖（`styleReference`）

素材包裡還可以放**一張風格參考圖**（一張成品版型的樣張），在 `theme.json`
的 `styleReference` 裡登記。它同時餵給兩個流程：

| 欄位 | 誰讀 | 用來做什麼 |
|---|---|---|
| `layoutNote` | 封面章節 `00-cover`（[`CHAPTER-CRAFT.md`](CHAPTER-CRAFT.md)） | 照它的版型用 **HTML** 復刻封面 —— 不是把圖貼上去 |
| `styleNote` | 生成插圖流程（[`ILLUSTRATIONS.md`](ILLUSTRATIONS.md)） | 當畫風錨點：圖片生成工具支援參考圖就直接餵這張圖，不支援就用 `styleNote` 當文字前綴 |

`we-bare-bears` 的 `title-page-style-reference.png` 就是範例。做新主題時
這張圖**選填** —— 沒有的話封面和插圖都依 `descriptionZh` / `mood` 自己發揮。

### 4. 用所有 demo 章節測試一遍

```bash
bash scripts/scaffold.sh /tmp/test-theme --theme=my-theme
cd /tmp/test-theme
pnpm run dev              # 或 npm run dev
```

把 demo 每一步點完。檢查：

- 標題襯線在舞台上很清晰。
- accent 圓點在發光但不爆。
- 斜體強調有可讀的背景。
- 章節導覽（滑鼠停留在底邊時）能看到，橫向章節列和左側全部章節總覽
  都像這套主題的控制項；active 狀態使用 accent，但不能像通用播放器。
- masthead 列（`.masthead`）讀起來像編輯 chrome，不像 navbar。
- hero 數字（`.hero-num`）感覺**和整體字體同源**，不像貼上去的。
- 卡片（`.card`）感覺是合適的材質（紙 / 玻璃 / cell）。
- 裝飾**被注意到一次然後被忘掉** —— 永遠不打擾。

哪裡不對就改 `tokens.css`，重新整理即可。無需重新建置。

### 5. 加到文件裡

在本檔案頂部「內建主題」表裡追加一列。

---

## 反模式

- **章節 CSS 寫死 hex 顏色 / 字體名** —— 缺哪個色彩 / 字體語意就在
  契約裡補一個，給所有主題加上（注意：**字級 / 間距 / 時長**寫死不算
  反模式，章節依內容自由設計）
- **簡報中途切換主題** —— 選一個，一以貫之
- **第二個 accent 色** —— 只能有一個。用尺度 + 字重做層級
- **在元件層 override 主題 token**（顏色 / 字體 / 個性簽名）—— 只在
  `:root` 裡覆蓋。一次性的顏色需求 = 提一個衍生 token，讓所有主題都
  提供自己的值
- **相依主題的 TSX 條件分支** —— 章節必須與主題無關。版面相依亮 vs 暗
  = 版面脆弱，修版面
- **一個主題疊三個設計簽名** —— 選 ONE 個（虛線 rule / 掃描線 /
  glass slab / 紙紋 / 粗邊），三個會自己打架
