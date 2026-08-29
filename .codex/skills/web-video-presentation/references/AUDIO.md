# 音檔合成

把每個章節 `narrations.ts` 裡的旁白文字依 **step 顆粒度**合成 mp3，
放到 `presentation/public/audio/<chapter-id>/<step-N>.mp3`。執行時
Auto 模式會自動依 step 播放並自動推進——錄影可以一鏡到底。

> **真相來源**：每個章節的 `src/chapters/<NN>-<id>/narrations.ts` 是 step
> 數 + 旁白文字的**唯一來源**。`outline.md` 不再參與音檔合成，章節程式碼
> 也不再手寫 `totalSteps`。這一改根除了「網頁 step 和音檔數對不上」
> 這個老問題。

合成器是 **provider-agnostic** 的：runner 本身不綁定任何 TTS 後端，每個
後端是 `scripts/tts-providers/<name>.sh` 一個檔案。**內建 2 個 provider**：

| Provider | 預設 | 何時用 |
|---|---|---|
| `minimax` | ✓ | 中文旁白首選（用 `mmx-cli`，要 MiniMax API key） |
| `openai`  | —— | 多數 agent 已有 `OPENAI_API_KEY`；curl-based、回應快 |

換 / 加 provider 見
[`scripts/tts-providers/README.md`](../templates/scripts/tts-providers/README.md)
（scaffold 跑完後路徑是 `presentation/scripts/tts-providers/README.md`）。
README 裡還附了 5 套**可直接貼上**的現成片段（ElevenLabs / edge-tts / macOS say /
Azure / Google Cloud）和寫自訂 provider 的三函式契約。

---

## 檔案命名慣例

```
presentation/public/audio/
├── coldopen/
│   ├── 1.mp3
│   ├── 2.mp3
│   └── ...
├── hook/
│   └── ...
└── ...
```

- 章節子目錄名 = `chapters.ts` 裡的 `id`
- 檔名 = `<step-N>.mp3`（**從 1 起算**，對齊 narrations 陣列的 index + 1）
- 格式預設 mp3。如果你寫的 provider 只能出 wav，在函式裡加一步 `ffmpeg`
  轉 mp3（參見 `tts-providers/README.md` 的 `say.sh` 範例）

---

## 標準流程

> 指令一律寫 `pnpm`。專案用的是哪個套件管理器看 `presentation/.pm`；
> 是 `npm` 就把 `pnpm run` 換成 `npm run`，其餘完全一樣。

### 1. 抽取 segments

```bash
cd presentation
pnpm run extract-narrations
```

這會掃描所有章節的 `narrations.ts`，依 `chapters.ts` 註冊順序產生
`audio-segments.json`：

```json
[
  { "chapter": "coldopen", "step": 1, "text": "...", "audio": "coldopen/1.mp3" },
  { "chapter": "coldopen", "step": 2, "text": "...", "audio": "coldopen/2.mp3" },
  ...
]
```

讓使用者**先掃一眼這個 json**，確認文字和切分都對，再開始燒 token 合成。

> 空字串的 narration 會被自動跳過（不燒 TTS token）——執行時 Auto 模式
> 依字數估時撐過這種「無聲過場」step。

### 2. 選 provider

```bash
ls scripts/tts-providers/    # 看本專案帶了哪些
```

- 用預設 `minimax` → 走 [2.A](#2a-用內建-minimax-合成)
- 用內建 `openai` → 走 [2.B](#2b-用內建-openai-合成)
- 想用別的 TTS / 自備 TTS → 走 [2.C](#2c-換-provider--加自訂-provider)
- 一個都沒裝好 → 走 [2.D](#2d-退化路徑)

#### 2.A 用內建 minimax 合成

```bash
pnpm run synthesize-audio              # 增量：跳過已存在的 mp3
pnpm run synthesize-audio -- --force   # 全部重新合成
pnpm run synthesize-audio -- --voice=<voice-id>  # 指定音色
```

啟動時 runner 會先呼叫 provider 的 `tts_check`：

- mmx 未安裝 → 報 `mmx CLI not found in PATH`，並印出安裝說明
- mmx 未登入 → 報 `mmx is not authenticated`，並提示登入指令

修完再跑。每條段落印出進度：

```
[  3/24] coldopen/3.mp3   ✓ 4s
[  4/24] coldopen/4.mp3   skip (exists)
```

合成採序列執行（避免 rate limit），**自動跳過已存在檔案**（斷點續合，不燒
重複 token）。

#### 2.B 用內建 openai 合成

```bash
export OPENAI_API_KEY=sk-...                   # 在 platform.openai.com 取得
PRESENTATION_TTS=openai pnpm run synthesize-audio
# 換音色 + HD 模型
OPENAI_TTS_MODEL=tts-1-hd PRESENTATION_TTS=openai \
  pnpm run synthesize-audio -- --voice=nova
```

選擇性 env：

| 變數 | 預設 | 作用 |
|---|---|---|
| `OPENAI_API_KEY` | —— **必須** | API key |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | 切 proxy / Azure-OpenAI |
| `OPENAI_TTS_MODEL` | `tts-1` | `tts-1` 快 / `tts-1-hd` 高品質約 2× 價 |
| `--voice=` / `PRESENTATION_TTS_VOICE` | `alloy` | 可選 alloy / echo / fable / onyx / nova / shimmer |

`tts_check` 會檢查 curl / jq / `OPENAI_API_KEY` 三件套，缺哪個報哪個。

#### 2.C 換 provider / 加自訂 provider

內建之外的常見後端在 `scripts/tts-providers/README.md` 裡有 5 段
**可直接貼上**的程式碼片段（ElevenLabs / edge-tts / macOS `say` / Azure / Google
Cloud）。

挑一個 → 複製 README 裡的程式碼區塊 → 存成
`scripts/tts-providers/<name>.sh` → 設好環境變數 → 切換 provider 跑：

```bash
PRESENTATION_TTS=elevenlabs pnpm run synthesize-audio
# 或
pnpm run synthesize-audio -- --provider=edge-tts
```

如果使用者的 TTS 完全自研，**依三函式契約**寫一個 `<name>.sh` 即可：

| 函式 | 必需 | 作用 |
|---|---|---|
| `tts_synthesize <text> <out_path> [<voice>]` | ✓ | 把一段文字寫成 mp3 到指定路徑 |
| `tts_check` | 選填 | 啟動時驗證環境（CLI / key / auth），未就緒 return 非零 |
| `tts_install_help` | 選填 | `tts_check` 失敗時印出怎麼修 |

抄 `openai.sh`（HTTP-based）或 `minimax.sh`（CLI-based）起手最快。
詳細規範在 `scripts/tts-providers/README.md`。

#### 2.D 退化路徑

如果兩個內建 provider 都沒就緒（沒裝 mmx 也沒有 OpenAI key）告訴使用者：

```
我可以：

  1. 用內建 openai provider（如果你已有 OpenAI key）
     export OPENAI_API_KEY=sk-...
     PRESENTATION_TTS=openai pnpm run synthesize-audio

  2. 幫你裝 MiniMax CLI（預設 provider，中文音色更穩）
     pnpm add -g mmx-cli && mmx auth login --api-key sk-xxxxx
     API key 在 https://platform.minimaxi.com 取得

  3. 換其它 provider
     scripts/tts-providers/README.md 裡有 5 種現成程式碼片段：
       • ElevenLabs  (要 ELEVENLABS_API_KEY，英文音色最佳)
       • edge-tts    (免費 / 無 key / pip install edge-tts)
       • macOS say   (零相依離線，品質普通，適合預覽)
       • Azure       (要 AZURE_SPEECH_KEY)
       • Google      (要 gcloud auth)
     複製一段存成 tts-providers/<name>.sh，
     再 PRESENTATION_TTS=<name> pnpm run synthesize-audio

  4. 暫時跳過
     稿子和 narrations 都在，你自己用任意 TTS 錄製即可——檔案
     依 audio-segments.json 的 audio 欄位命名就行。
```

不要假裝合成成功。

---

## 驗證時長

合成完後跑：

```bash
for f in public/audio/*/*.mp3; do
  d=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$f")
  echo "$f  ${d}s"
done
```

把每條的實際秒數彙總告訴使用者。**重點關注 ≥ 15s 的項目**——旁白太長意味
著該 step 的 narration 寫得過密，或者 step 沒拆夠。讓使用者決定**改稿子
重新合成**還是**回章節程式碼拆 step**。

---

## 執行時如何使用合成的音檔

合成完成後，**不需要任何額外設定**——scaffold 的 `App.tsx` 已經接好：

| 模式 | 觸發方式 | 行為 |
|---|---|---|
| **Manual**（預設） | 直接開啟頁面 | 不播音檔，點擊 / 方向鍵推進 |
| **Audio**（半自動） | URL `?audio=1` 或按 `M` 鍵 | 進入 step 自動播音檔，但你手動推進（點滑鼠） |
| **Auto**（全自動） | URL `?auto=1` 或按兩次 `M` 鍵 | 進入 step 播音檔 → 播完自動 next() → 進下個 step → ... |

Auto 模式首次需要按一次 `Space` 啟動（繞過瀏覽器自動播放限制），之後
全自動跑。**錄影時打開螢幕錄影 → 按 Space → 整片自動跑完 → stop**。

> **Auto 模式的推進規則就一句話**：每段音檔播完 + 200ms 緩衝 → 自動 next。
> **沒有「等動畫跑完」的保底**——如果你寫的視覺動畫比旁白長，會被當場切。
> 解決辦法：寫更長旁白 / 拆 step / 調動畫速度（詳見
> [`CHAPTER-CRAFT.md`](CHAPTER-CRAFT.md)「程式碼層最小限制」）。
>
> 音檔缺失（還沒合成 / 404）或 narration 是空字串 → 退化到字數估時
> （`max(1500ms, 字數 × 250ms)`），保證預覽也能整片跑通。

---

## 疑難排解

通用：

| 現象 | 原因 / 修法 |
|---|---|
| `chapter id "X" registered but no matching folder found` | 章節資料夾應命名為 `NN-<id>`；id 必須等於 chapters.ts 裡註冊的 |
| `narrations.ts in X must export an array named "narrations"` | 該章節的 narrations.ts 沒 export 名為 narrations 的陣列 |
| `TTS provider 'X' not found` | `scripts/tts-providers/X.sh` 不存在；列出來看哪些可用，或抄 README 加一個 |
| `provider 'X' does not define tts_synthesize` | 你的 `<X>.sh` 沒定義必需的函式。看 README 的契約部分 |
| 中間斷了幾條沒合成 | `pnpm run synthesize-audio` 重跑 —— 已存在檔案會跳過 |
| 瀏覽器沒播音檔 | Auto / Audio 模式下首次需要使用者手勢——確認你按了 SPACE 啟動 Auto，或者點過頁面 |
| 音檔 404 但 Auto 模式還能跑 | 找不到 mp3 時 useAudioPlayer 退化到字數估時（4 字/秒），保證預覽不中斷 |

minimax 專屬：

| 現象 | 原因 / 修法 |
|---|---|
| `mmx: command not found` | `pnpm add -g mmx-cli`（或 `npm install -g mmx-cli`）；全域 bin 不在 PATH 時 `pnpm bin -g` / `npm config get prefix` 看一下 |
| `mmx is not authenticated` | `mmx auth login --api-key sk-xxxxx` 重新登入 |
| 中文音色不自然 | mmx 預設音色未必最佳；查 `mmx speech --help` 看 `--voice` 可選項，傳 `--voice=<id>` |
| 整段合成被截斷 | 單段過長（mmx 預設上限約 5000 字元）。在 narrations.ts 裡把這條拆成兩條（也意味著該 step 應該拆成兩個 step） |

openai 專屬：

| 現象 | 原因 / 修法 |
|---|---|
| `OPENAI_API_KEY is not set` | `export OPENAI_API_KEY=sk-...`，或者把它加到 shell rc / `.env` |
| 全部段落 FAILED + key 是對的 | 多半 model / voice 名字錯。`--voice=alloy` 試預設值；`OPENAI_TTS_MODEL=tts-1` 試預設模型；用 `bash -x scripts/synthesize-audio.sh` 看 request body |
| 走 proxy / 走 Azure-OpenAI | `export OPENAI_BASE_URL=https://your-proxy/v1` |
| HD 太慢 | 改成 `OPENAI_TTS_MODEL=tts-1`（預設）；HD 大約慢 2 倍 |
| 中文音色不像真人 | OpenAI 6 種音色都偏英語；中文角色用 `minimax` 更合適 |

換其它（自訂）provider 之後：

| 現象 | 原因 / 修法 |
|---|---|
| `<X>_API_KEY not set` | 你的 provider 需要 API key，但 env 裡沒設。`export <X>_API_KEY=...` 或寫到 `.env` 再 `set -a; source .env; set +a` |
| 合成的 mp3 瀏覽器播不了 | 檢查 provider 是否真的出了 mp3（不是 wav / opus / aac）。`file public/audio/*/*.mp3` 看 magic header |
| 一切看起來都對，但全部 FAILED | `bash -x scripts/synthesize-audio.sh` 看每段實際呼叫了什麼 |

---

## 相關連結

- Provider 契約 + 現成片段：[`scripts/tts-providers/README.md`](../templates/scripts/tts-providers/README.md)
- mmx-cli repo：<https://github.com/MiniMax-AI/cli>
- mmx 官方文件：<https://platform.minimaxi.com/docs/token-plan/minimax-cli>
- mmx 參數 / 音色查詢：`mmx speech --help`
