# 熊熊視覺系統

這個 Skill 的視覺識別**固定為 `we-bare-bears`**。主題機制只是 scaffold 與
token 的實作管線，不是每支簡報重新選風格的選單。除非使用者明確要求建立另一個
Skill，否則不得衍生、切換或混入第二套美學。

---

## 一致性契約

所有章節，不論由主執行緒或平行 agent 開發，都必須共享：

1. 奶油紙張舞台、天空藍單一 accent、蜂蜜木色中性色；
2. 圓潤無襯線字、炭黑手繪輪廓；
3. 圓角紙卡、2px 炭黑輪廓、淡藍錯位影；
4. 熊熊角色固定比例、臉部、輪廓粗細與平塗方式；
5. 大字、大留白、資訊文字由 HTML 呈現；
6. 插圖只作為透明角色／情境圖層，圖內零文字。

章節可以依內容選不同動畫與視覺演示，但不能把「自由發揮」解讀成改用不同
調色盤、插畫畫風、卡片材質、字體個性或寫實照片風。風格一致、內容動作不同。

禁止：

- 中途翻成深色主題或另一套表面色；
- 紫粉漸層、玻璃擬態、3D 算圖、寫實照片風插圖；
- 第二個飽和 accent；
- 章節 CSS 寫死 hex / rgb / 顏色名或字體名；
- 把角色當每頁固定貼紙；
- 用帶字的生成圖當整張投影片。

---

## `theme.json` 的三種參考

`themes/we-bare-bears/theme.json` 把用途分開，禁止再用一張圖同時管版型與生圖：

| 欄位 | 用途 | 規則 |
|---|---|---|
| `layoutReference` | 封面 HTML 版型 | 只看 `layoutNote` 與樣張，禁止餵給 ImageGen |
| `illustrationStyle.goldenReference` | 多角色情境、留白與畫風基準 | ImageGen 的第一參考圖 |
| `illustrationStyle.characterReferences` | 角色比例、輪廓、臉部與配色 | 只餵本次會出現的角色 |
| `illustrations` | 可直接重用的角色 PNG | 依 `bestFor` 命中情境才使用 |

`scene-conflict-reference-clean.png` 是多角色情境的 golden reference：它定義的是
「透明角色層 + 一個明確物件焦點 + 可讀的互動動作」，不是固定版面。完整生圖
流程見 [`ILLUSTRATIONS.md`](ILLUSTRATIONS.md)。

---

## Token 契約

章節的**顏色與字體家族必須使用 token**；字級、間距、動畫時長與一般版面尺寸
可依內容決定。主題個性用 primitive class 接入，不在章節重定義。

### 必須使用的顏色

| token | 用途 |
|---|---|
| `--shell` | 舞台外 letterbox |
| `--surface` | 舞台奶油底 |
| `--surface-2` / `--surface-3` | 紙卡與內層表面 |
| `--text` / `--text-2` | 主次文字 |
| `--text-mute` / `--text-faint` | metadata 與弱化文字 |
| `--rule` | 炭黑／中性線條 |
| `--accent` | 唯一天空藍強調色 |
| `--accent-soft` / `--accent-glow` | 同色相透明衍生 |

### 必須使用的字體

| token | 用途 |
|---|---|
| `--font-display-cn` | 中文大標 |
| `--font-display-en` | 英文大標 |
| `--font-body` | 內文 |
| `--font-mono` | 指令、metadata、技術標籤 |

### 必須重用的 primitive

- `.stage-frame`：舞台底色、紙張質感、邊框與陰影；
- `.card`：熊熊紙卡材質；
- `.rule`：手繪分隔線；
- `.hero-num`：hero 數字個性；
- 章節導覽使用 `--nav-*` token，不保留通用播放器樣式。

若缺少語意色，先擴充 `tokens.css` 並保持同一調色盤；不得在章節裡臨時寫
第二套色彩。

---

## 封面

封面先讀 `layoutReference.path`，用 HTML / CSS 復刻其結構：

- 左上大標題、副標與天空藍短線；
- 左下重點清單紙卡；
- 右側熊熊角色場景；
- 底部總結條。

樣張內的文字只作版型提示，不能直接當背景圖片。封面仍要依當次內容重新排字，
並至少有一處乾淨的動態效果。

---

## 插圖

- outline 先走 Illustration Pass，再由 CP-1 確認哪些情境值得生成。
- ImageGen 只產透明角色／情境層，圖內零文字；HTML 負責所有資訊。
- 先查三張現成角色素材，命中就重用。
- 新圖必須使用 golden reference + 本次角色 reference，並做生成後 QA。
- 每個 scene 最多一張；插圖不能取代 CSS / SVG / Canvas / JS 視覺演示。

scaffold 會將整個 `assets/` 複製到
`presentation/public/theme-assets/`，章節只能引用 `/theme-assets/...`，
不得引用 Skill repo 的絕對路徑。

---

## 驗收

把封面、第 1 章與任一後續章節並排檢查：

- 表面色、accent、字體、紙卡、輪廓與陰影是否像同一支片；
- 角色比例與插畫線條是否一致；
- 沒有全頁生成圖、圖內文字或另一套插畫風；
- 章節雖有不同動作，但沒有改變視覺識別；
- 導覽控制項也符合熊熊紙卡語言。

最後執行：

```bash
node <path-to-web-video-presentation>/scripts/validate-project.mjs <project-root>
```

validator 的 error 必須修完；風格與插圖語意仍需人工目視驗收。
