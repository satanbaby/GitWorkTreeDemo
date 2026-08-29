# TTS Providers

`synthesize-audio.sh` 是 provider-agnostic 的 runner —— 它自己不知道
怎麼呼叫任何 TTS，只知道迴圈跑 `audio-segments.json`、跳過已存在的檔案、
印出進度。

**每個 provider 是這個目錄下的一個 `.sh` 檔案**，定義一個
`tts_synthesize` 函式（必需），以及選擇性的 `tts_check` 和
`tts_install_help`。runner 依 `PRESENTATION_TTS` 環境變數載入對應檔案。

---

## 怎麼用

> 下面寫 `pnpm`；專案用 npm 就換成 `npm run`，參數完全一樣。

```bash
# 預設（minimax）
pnpm run synthesize-audio

# 換 provider
PRESENTATION_TTS=openai pnpm run synthesize-audio
pnpm run synthesize-audio -- --provider=elevenlabs

# 指定音色（每個 provider 自己解析）
PRESENTATION_TTS_VOICE=alloy pnpm run synthesize-audio
pnpm run synthesize-audio -- --voice=zh-CN-YunxiNeural

# 強制全部重新合成
pnpm run synthesize-audio -- --force
```

`--provider` 和 `--voice` 的命令列參數會覆蓋 env var。

---

## 內建 provider

| 檔案 | 後端 | 驗證方式 | 備註 |
|---|---|---|---|
| `minimax.sh` | MiniMax `mmx` CLI | `mmx auth login --api-key` | **預設**；中文旁白品質穩 |
| `openai.sh` | OpenAI Audio Speech API | `OPENAI_API_KEY` env var | curl-based；多數 agent 已有 key |

只內建這兩個 —— 我們不替你做更多技術選型。其它後端的程式碼片段在下面，
複製到 `tts-providers/<name>.sh` 即可啟用。

---

## 怎麼加你自己的 TTS

1. 在這個目錄建 `<name>.sh`（小寫、kebab-case）
2. 實作 `tts_synthesize text out_path [voice]`（必需）
3. 選擇性實作 `tts_check`（啟動前驗證環境）和 `tts_install_help`（失敗時印出怎麼修）
4. `PRESENTATION_TTS=<name> pnpm run synthesize-audio`

---

## 三函式契約

### `tts_synthesize <text> <out_path> [<voice>]` （required）

把一段文字寫成 mp3 / 任意 web 可播放的音檔到 `<out_path>`。

| 參數 | 說明 |
|---|---|
| `$1` | 要合成的文字（已是 UTF-8 字串，可能包含中英文混排和標點） |
| `$2` | 目標檔案絕對路徑（runner 已 `mkdir -p` 它的父目錄），副檔名 `.mp3` |
| `$3` | 音色 id（可能為空字串，provider 自行決定預設值） |

成功 → exit 0 並把音檔寫到 `$2`。失敗 → 非零結束（runner 會標記 FAILED 並繼續下一段，不會終止整體合成）。

> 如果 backend 只能出 wav / ogg，自己在函式末尾用 `ffmpeg` 轉一下：
> `ffmpeg -y -i tmp.wav -codec:a libmp3lame -qscale:a 2 "$out" >/dev/null 2>&1`

### `tts_check` （optional）

啟動時被 runner 呼叫一次（不是每段）。檢查 CLI 是否安裝、API key 是否設定、auth 是否通過。
未就緒 return 非零，runner 會立刻終止並印出 `tts_install_help`。

### `tts_install_help` （optional）

`tts_check` 失敗時被 runner 呼叫，往 stderr 印出怎麼安裝 / 怎麼登入 / 在哪拿 key。

---

## 常見 TTS 後端的現成片段

下面**不是**內建 provider —— 是你自己寫 `tts-providers/<name>.sh` 時
可以**直接抄過去**的程式碼片段。複製 → 存成 `<name>.sh` → 測通了
就 `PRESENTATION_TTS=<name>` 使用。

> 大多數雲端 TTS 的 API key 透過環境變數傳入（例如 `OPENAI_API_KEY`、
> `ELEVENLABS_API_KEY`）。把 `export` 加到你的 shell rc，或在
> 同目錄放一個 git-ignored 的 `.env` 檔案並 `set -a; source .env; set +a`。

### OpenAI TTS

**已內建** —— 直接看 [`openai.sh`](./openai.sh)。
該檔案也是寫 HTTP-based provider 的**官方參考實作**：jq 建構 JSON
payload、curl `-fsS` 送出、選擇性 base URL（接 Azure-OpenAI / proxy）、
選擇性 model env var、空音色 fallback 到預設值。新接 REST API 的
provider 直接抄它起手最快。

啟用：

```bash
export OPENAI_API_KEY=sk-...
PRESENTATION_TTS=openai pnpm run synthesize-audio
# 用 HD 模型 + 別的音色
OPENAI_TTS_MODEL=tts-1-hd pnpm run synthesize-audio -- --provider=openai --voice=nova
```

### ElevenLabs — `tts-providers/elevenlabs.sh`

```bash
# Docs:   https://elevenlabs.io/docs/api-reference/text-to-speech
# Env:    ELEVENLABS_API_KEY=...
# Voice:  pass voice ID; "Rachel" default is 21m00Tcm4TlvDq8ikWAM
# Model:  eleven_multilingual_v2 supports Chinese; eleven_turbo_v2_5 cheaper

tts_check() {
  command -v curl >/dev/null || { echo "✗ curl not found" >&2; return 1; }
  command -v jq   >/dev/null || { echo "✗ jq not found"   >&2; return 1; }
  [[ -n "${ELEVENLABS_API_KEY:-}" ]] || { echo "✗ ELEVENLABS_API_KEY not set" >&2; return 1; }
}

tts_install_help() {
  cat <<'EOF' >&2
Set your ElevenLabs key first:
  export ELEVENLABS_API_KEY=...       # get one at https://elevenlabs.io
EOF
}

tts_synthesize() {
  local text="$1" out="$2" voice="${3:-21m00Tcm4TlvDq8ikWAM}"
  local payload
  payload=$(jq -n --arg t "$text" \
    '{text:$t, model_id:"eleven_multilingual_v2"}')

  curl -fsS -o "$out" -X POST \
    "https://api.elevenlabs.io/v1/text-to-speech/$voice" \
    -H "xi-api-key: $ELEVENLABS_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload"
}
```

### edge-tts — `tts-providers/edge-tts.sh`（免費 / 無 API key）

```bash
# Docs:   https://github.com/rany2/edge-tts
# Install: pip install edge-tts
# Voices: edge-tts --list-voices
#   zh-TW-YunJheNeural    (台灣中文男聲)
#   zh-TW-HsiaoChenNeural (台灣中文女聲)
#   zh-CN-YunxiNeural     (中國中文男聲)
#   en-US-AriaNeural      (英文女聲)
#   en-US-GuyNeural       (英文男聲)

tts_check() {
  command -v edge-tts >/dev/null || { echo "✗ edge-tts not found" >&2; return 1; }
}

tts_install_help() {
  cat <<'EOF' >&2
Install edge-tts (free, uses Microsoft Edge's TTS backend, no API key):
  pip install edge-tts
List available voices:
  edge-tts --list-voices | less
EOF
}

tts_synthesize() {
  local text="$1" out="$2" voice="${3:-zh-CN-YunxiNeural}"
  edge-tts --text "$text" --voice "$voice" --write-media "$out" >/dev/null 2>&1
}
```

### macOS `say` — `tts-providers/say.sh`（離線 / 保底）

```bash
# 系統內建，零相依，適合 CI 測通流程 / 離線預覽。
# 中文音色：Tingting / Sinji / Meijia（看 `say -v ?` 完整清單）
# 輸出是 aiff，要 ffmpeg 轉 mp3（Auto 模式 audio 標籤預設認 mp3）。

tts_check() {
  command -v say     >/dev/null || { echo "✗ 'say' not available (macOS only)" >&2; return 1; }
  command -v ffmpeg  >/dev/null || { echo "✗ ffmpeg not found (brew install ffmpeg)" >&2; return 1; }
}

tts_install_help() {
  cat <<'EOF' >&2
macOS-only provider. Needs ffmpeg for aiff→mp3:
  brew install ffmpeg
List voices:  say -v ?
EOF
}

tts_synthesize() {
  local text="$1" out="$2" voice="${3:-Tingting}"
  local tmp
  tmp=$(mktemp -t tts).aiff
  say -v "$voice" -o "$tmp" "$text" \
    && ffmpeg -y -i "$tmp" -codec:a libmp3lame -qscale:a 2 "$out" >/dev/null 2>&1
  local code=$?
  rm -f "$tmp"
  return $code
}
```

### Azure Speech — `tts-providers/azure.sh`

```bash
# Docs:    https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech
# Env:     AZURE_SPEECH_KEY=...   AZURE_SPEECH_REGION=eastus
# SSML payload — Azure requires SSML, not plain JSON

tts_check() {
  command -v curl >/dev/null || { echo "✗ curl not found" >&2; return 1; }
  [[ -n "${AZURE_SPEECH_KEY:-}"    ]] || { echo "✗ AZURE_SPEECH_KEY not set"    >&2; return 1; }
  [[ -n "${AZURE_SPEECH_REGION:-}" ]] || { echo "✗ AZURE_SPEECH_REGION not set" >&2; return 1; }
}

tts_install_help() {
  cat <<'EOF' >&2
Set Azure Speech credentials:
  export AZURE_SPEECH_KEY=...
  export AZURE_SPEECH_REGION=eastus   # or your resource's region
EOF
}

tts_synthesize() {
  local text="$1" out="$2" voice="${3:-zh-CN-YunxiNeural}"
  local lang="${voice%%-*}-${voice#*-}"; lang="${lang%%-*}-${lang#*-}"  # "zh-CN"
  local ssml="<speak version='1.0' xml:lang='$lang'><voice xml:lang='$lang' name='$voice'>$(printf '%s' "$text" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')</voice></speak>"

  curl -fsS -o "$out" -X POST \
    "https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1" \
    -H "Ocp-Apim-Subscription-Key: $AZURE_SPEECH_KEY" \
    -H "Content-Type: application/ssml+xml" \
    -H "X-Microsoft-OutputFormat: audio-24khz-48kbitrate-mono-mp3" \
    -H "User-Agent: web-video-presentation" \
    --data-binary "$ssml"
}
```

### Google Cloud TTS — `tts-providers/gcloud.sh`

```bash
# Docs:   https://cloud.google.com/text-to-speech/docs/reference/rest
# Auth:   easiest is `gcloud auth application-default login`
#         (or set GOOGLE_APPLICATION_CREDENTIALS to a service-account json)
# Voices: zh-TW-Wavenet-A / zh-CN-Wavenet-A / en-US-Neural2-J etc.

tts_check() {
  command -v curl   >/dev/null || { echo "✗ curl not found" >&2; return 1; }
  command -v jq     >/dev/null || { echo "✗ jq not found" >&2; return 1; }
  command -v base64 >/dev/null || { echo "✗ base64 not found" >&2; return 1; }
  command -v gcloud >/dev/null || { echo "✗ gcloud not found" >&2; return 1; }
  gcloud auth application-default print-access-token >/dev/null 2>&1 || {
    echo "✗ gcloud is not authenticated (run: gcloud auth application-default login)" >&2
    return 1
  }
}

tts_install_help() {
  cat <<'EOF' >&2
Install gcloud SDK and authenticate:
  https://cloud.google.com/sdk/docs/install
  gcloud auth application-default login
  gcloud services enable texttospeech.googleapis.com
EOF
}

tts_synthesize() {
  local text="$1" out="$2" voice="${3:-zh-CN-Wavenet-A}"
  local lang="${voice%-*}"; lang="${lang%-*}"  # "zh-CN"
  local token
  token=$(gcloud auth application-default print-access-token)

  local payload
  payload=$(jq -n --arg t "$text" --arg v "$voice" --arg l "$lang" \
    '{input:{text:$t}, voice:{languageCode:$l, name:$v}, audioConfig:{audioEncoding:"MP3"}}')

  curl -fsS -X POST https://texttospeech.googleapis.com/v1/text:synthesize \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    | jq -r '.audioContent' | base64 -d > "$out"
}
```

---

## 設計要點（自己寫 provider 時記住）

1. **`set -e` 友善**：runner 用 `set -euo pipefail`，所以你的函式裡要嘛明確處理失敗，要嘛讓指令自然以非零結束。不要吞掉錯誤。

2. **安靜成功，大聲失敗**：成功時不要印任何東西到 stdout（runner 自己印進度）；失敗時往 stderr 印詳細原因。把 CLI 工具的 stdout 重導到 `/dev/null`，stderr 留著看。

3. **mp3 輸出**：瀏覽器裡 `<audio>` 標籤最穩吃 mp3。能直接出 mp3 就出 mp3；非 mp3 後端在函式末尾加一步 ffmpeg。

4. **音色 fallback**：`$3` 可能是空字串。給一個合理的預設值（你最常用的中文音色 / 英文音色），不要因為沒傳音色就報錯。

5. **不要做並行**：runner 是序列執行的（避免 rate limit）。provider 函式也別在內部 fork 多執行緒。

6. **不要修改全域狀態**：provider 檔案被 `source` 進 runner 的 shell。別 `cd`、別改 `IFS`、別 `set -e/+e` 切換，否則會汙染 runner。把區域變數都宣告成 `local`。

   ⚠️ 一個坑：runner 用 `set -u`，**macOS 預設的 bash 3.2 在 `"${arr[@]}"` 展開空陣列時會炸 `unbound variable`**。如果你的 provider 需要「選擇性 --voice 參數」，**不要**用 `local args=(); [[ -n $voice ]] && args=(--voice $v); cmd "${args[@]}"` —— 直接寫兩個 if 分支呼叫指令（看 `minimax.sh` 的寫法）。

7. **API 長度上限**：單段大多數 API 都有上限（OpenAI ~4096 chars / MiniMax ~5000 / ElevenLabs ~5000）。Skill 的 narrations 單段一般 < 200 字元，正常不會撞到。如果你的 narration 撞到了，**先回去拆 step**——一個 step 的旁白本來就不該這麼長。

---

## 除錯

```bash
# 看 runner 怎麼呼叫你的 provider
bash -x scripts/synthesize-audio.sh

# 跑單段試試，不動 audio-segments.json
source scripts/tts-providers/<name>.sh
tts_check && tts_synthesize "測試一下" /tmp/test.mp3 ""
afplay /tmp/test.mp3   # macOS 播一下聽聽
```

測通了再 `pnpm run synthesize-audio`。
