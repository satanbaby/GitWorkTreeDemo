#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# scaffold.sh —— 一鍵 scaffold，建立一個 video-presentation 專案。
#
# 用法：
#   bash scripts/scaffold.sh <target-dir> [--theme=<id>] [--pm=<pnpm|npm>]
#   bash scripts/scaffold.sh --list-themes
#
# 範例：
#   bash <path-to-web-video-presentation>/scripts/scaffold.sh ./presentation
#   bash <path-to-web-video-presentation>/scripts/scaffold.sh ./talk --theme=we-bare-bears
#   bash <path-to-web-video-presentation>/scripts/scaffold.sh ./talk --pm=npm
#   bash <path-to-web-video-presentation>/scripts/scaffold.sh --list-themes
#
# 套件管理器：pnpm 優先、npm 備援（自動偵測）。--pm= 可強制指定。
# 選中的那個會寫進 <project>/.pm，後續階段照著用。
#
# 跑完後，看 SKILL.md "Phase 2.4 實作單章" + references/CHAPTER-CRAFT.md
# 了解每章怎麼寫。卡住時翻 references/EXAMPLES/ 找完整章節 anchor。
#
# 之後切換主題，覆蓋一個檔案即可：
#   cp <path-to-web-video-presentation>/themes/<id>/tokens.css \
#      <project>/src/styles/tokens.css
# ─────────────────────────────────────────────────────────────
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATES="$SKILL_DIR/templates"
THEMES_DIR="$SKILL_DIR/themes"
DEFAULT_THEME="we-bare-bears"

list_themes() {
  echo "可用主題（來自 ${THEMES_DIR}）:"
  echo
  for dir in "$THEMES_DIR"/*/; do
    [[ -d "$dir" ]] || continue
    local meta="$dir/theme.json"
    [[ -f "$meta" ]] || continue
    # 沒有 jq，用簡單的 grep + sed 取欄位
    local id name desc
    id=$(grep -E '"id"' "$meta" | head -n1 | sed -E 's/.*"id":[[:space:]]*"([^"]+)".*/\1/')
    name=$(grep -E '"nameZh"' "$meta" | head -n1 | sed -E 's/.*"nameZh":[[:space:]]*"([^"]+)".*/\1/')
    desc=$(grep -E '"descriptionZh"' "$meta" | head -n1 | sed -E 's/.*"descriptionZh":[[:space:]]*"([^"]+)".*/\1/')
    printf "  • %-18s %s\n      %s\n\n" "$id" "$name" "$desc"
  done
  echo "用 --theme=<id> 選定一個。預設：${DEFAULT_THEME}。"
}

# ── 解析參數 ──
TARGET=""
THEME="$DEFAULT_THEME"
PM_FORCED=""
for arg in "$@"; do
  case "$arg" in
    --list-themes)
      list_themes
      exit 0
      ;;
    --theme=*)
      THEME="${arg#--theme=}"
      ;;
    --pm=*)
      PM_FORCED="${arg#--pm=}"
      ;;
    --*)
      echo "✗ 未知參數: $arg" >&2
      exit 1
      ;;
    *)
      if [[ -z "$TARGET" ]]; then TARGET="$arg"; fi
      ;;
  esac
done

TARGET="${TARGET:-presentation}"
THEME_DIR="$THEMES_DIR/$THEME"
THEME_TOKENS="$THEME_DIR/tokens.css"
THEME_ASSETS="$THEME_DIR/assets"

if [[ ! -d "$THEME_DIR" || ! -f "$THEME_TOKENS" ]]; then
  echo "✗ 找不到主題 '${THEME}'。可用主題：" >&2
  echo >&2
  for dir in "$THEMES_DIR"/*/; do
    [[ -d "$dir" ]] || continue
    echo "    • $(basename "$dir")" >&2
  done
  exit 1
fi

if [[ -d "$TARGET" && -n "$(ls -A "$TARGET" 2>/dev/null || true)" ]]; then
  echo "✗ 目標目錄 '${TARGET}' 已存在且非空，已中止。" >&2
  exit 1
fi

# ── 選套件管理器：pnpm 優先、npm 備援，--pm= 可強制 ──
pick_pm() {
  case "$1" in
    pnpm)
      command -v pnpm >/dev/null || { echo "✗ 指定了 --pm=pnpm，但 PATH 裡沒有 pnpm。" >&2; exit 1; }
      PM="pnpm"; PM_EXEC="pnpm exec"; PM_DLX="pnpm dlx"
      ;;
    npm)
      command -v npm >/dev/null || { echo "✗ 指定了 --pm=npm，但 PATH 裡沒有 npm。" >&2; exit 1; }
      PM="npm"; PM_EXEC="npx"; PM_DLX="npx"
      ;;
    "")
      if command -v pnpm >/dev/null; then
        PM="pnpm"; PM_EXEC="pnpm exec"; PM_DLX="pnpm dlx"
      elif command -v npm >/dev/null; then
        PM="npm"; PM_EXEC="npx"; PM_DLX="npx"
      else
        echo "✗ 需要 pnpm 或 npm，但兩個都不在 PATH 裡。" >&2
        exit 1
      fi
      ;;
    *)
      echo "✗ --pm 只支援 pnpm / npm，收到：$1" >&2
      exit 1
      ;;
  esac
}
pick_pm "$PM_FORCED"

echo "▸ 在 $TARGET 建立 Vite + React + TS 專案"
echo "▸ 使用主題：$THEME"
echo "▸ 套件管理器：$PM"
$PM_DLX create-vite@latest "$TARGET" --template react-ts >/dev/null

cd "$TARGET"

if [[ "$PM" == "pnpm" ]]; then
  # pnpm 10+ 預設攔截相依套件的 build script。撞上就以 ERR_PNPM_IGNORED_BUILDS
  # 結束並回傳 1，而且 esbuild 的原生二進位真的裝不上（tsx / vite 會跑不起來），
  # 修復要跑互動式 `pnpm approve-builds` —— 指令碼裡沒法互動。所以先加白名單。
  #
  # 白名單寫哪裡跟版本有關：
  #   pnpm 11+ → pnpm-workspace.yaml 的 allowBuilds
  #   pnpm 10  → package.json 的 pnpm.onlyBuiltDependencies
  echo "▸ 允許必要相依套件執行 build script（esbuild 原生二進位）..."
  PNPM_MAJOR="$(pnpm --version | cut -d. -f1)"
  if [[ "$PNPM_MAJOR" -ge 11 ]]; then
    node -e '
const fs = require("fs");
const f = "pnpm-workspace.yaml";
let s = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
if (!/^allowBuilds:/m.test(s)) {
  s = (s.trim() ? s.replace(/\s*$/, "\n\n") : "") + "allowBuilds:\n";
}
for (const dep of ["esbuild"]) {
  const line = new RegExp("^\\s+" + dep + ":.*$", "m");
  if (line.test(s)) s = s.replace(line, "  " + dep + ": true");
  else s = s.replace(/^allowBuilds:.*$/m, "allowBuilds:\n  " + dep + ": true");
}
fs.writeFileSync(f, s);
'
  else
    node -e '
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
p.pnpm = p.pnpm || {};
const allow = new Set(p.pnpm.onlyBuiltDependencies || []);
["esbuild"].forEach((d) => allow.add(d));
p.pnpm.onlyBuiltDependencies = [...allow].sort();
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");
'
  fi
fi

echo "▸ 安裝相依套件（可能要等一下）..."
$PM install >/dev/null 2>&1

echo "▸ 安裝 tsx（用於 extract-narrations 指令碼）..."
if [[ "$PM" == "pnpm" ]]; then
  # pnpm install -D 不會裝套件，必須用 pnpm add
  pnpm add -D tsx >/dev/null 2>&1
else
  npm install -D tsx >/dev/null 2>&1
fi

echo "▸ 用範例骨架取代預設 boilerplate"

# 移除我們不要的 Vite 預設 boilerplate
rm -f \
  src/App.tsx src/App.css \
  src/main.tsx src/index.css \
  src/assets/react.svg \
  public/vite.svg \
  README.md
rmdir src/assets 2>/dev/null || true

# 把 scaffold 檔案複製到專案根目錄
mkdir -p \
  src/styles src/hooks src/components src/registry \
  src/chapters/01-example \
  public/illustrations scripts

cp "$TEMPLATES/vite.config.ts" .
cp "$TEMPLATES/index.html" .

cp "$TEMPLATES/src/main.tsx" src/main.tsx
cp "$TEMPLATES/src/App.tsx"  src/App.tsx

# tokens.css 來自所選主題
cp "$THEME_TOKENS"                          src/styles/tokens.css
cp "$TEMPLATES/src/styles/base.css"         src/styles/base.css
cp "$TEMPLATES/src/styles/animations.css"   src/styles/animations.css
cp "$TEMPLATES/src/styles/fonts.css"        src/styles/fonts.css

# 主題的選擇性素材包。統一放到 public/theme-assets，theme.json 可直接宣告
# /theme-assets/<filename> 給章節使用。
if [[ -d "$THEME_ASSETS" && -n "$(ls -A "$THEME_ASSETS" 2>/dev/null || true)" ]]; then
  mkdir -p public/theme-assets
  cp -R "$THEME_ASSETS"/. public/theme-assets/
  cp "$THEME_DIR/theme.json" public/theme-assets/theme.json
fi

cp "$TEMPLATES/src/hooks/useStageScale.ts"   src/hooks/useStageScale.ts
cp "$TEMPLATES/src/hooks/useStepper.ts"      src/hooks/useStepper.ts
cp "$TEMPLATES/src/hooks/useAudioPlayer.ts"  src/hooks/useAudioPlayer.ts
cp "$TEMPLATES/src/hooks/useAutoMode.ts"     src/hooks/useAutoMode.ts
cp "$TEMPLATES/src/hooks/useFullscreen.ts"   src/hooks/useFullscreen.ts

cp "$TEMPLATES/src/components/Stage.tsx"          src/components/Stage.tsx
cp "$TEMPLATES/src/components/MaskReveal.tsx"     src/components/MaskReveal.tsx
cp "$TEMPLATES/src/components/ProgressBar.tsx"    src/components/ProgressBar.tsx
cp "$TEMPLATES/src/components/ProgressBar.css"    src/components/ProgressBar.css
cp "$TEMPLATES/src/components/AutoStartGate.tsx"  src/components/AutoStartGate.tsx
cp "$TEMPLATES/src/components/AutoStartGate.css"  src/components/AutoStartGate.css
cp "$TEMPLATES/src/components/AutoToggle.tsx"     src/components/AutoToggle.tsx
cp "$TEMPLATES/src/components/AutoToggle.css"     src/components/AutoToggle.css
cp "$TEMPLATES/src/components/PrefetchAhead.tsx"  src/components/PrefetchAhead.tsx

cp "$TEMPLATES/src/registry/types.ts"    src/registry/types.ts
cp "$TEMPLATES/src/registry/chapters.ts" src/registry/chapters.ts

cp "$TEMPLATES/src/chapters/01-example/Example.tsx"     src/chapters/01-example/Example.tsx
cp "$TEMPLATES/src/chapters/01-example/Example.css"     src/chapters/01-example/Example.css
cp "$TEMPLATES/src/chapters/01-example/narrations.ts"   src/chapters/01-example/narrations.ts

# Audio pipeline scripts (extract-narrations + synthesize-audio runner +
# pluggable TTS providers under tts-providers/).
cp "$TEMPLATES/scripts/extract-narrations.ts"  scripts/extract-narrations.ts
cp "$TEMPLATES/scripts/synthesize-audio.sh"    scripts/synthesize-audio.sh
chmod +x scripts/synthesize-audio.sh

mkdir -p scripts/tts-providers
cp "$TEMPLATES/scripts/tts-providers/README.md"   scripts/tts-providers/README.md
cp "$TEMPLATES/scripts/tts-providers/minimax.sh"  scripts/tts-providers/minimax.sh
cp "$TEMPLATES/scripts/tts-providers/openai.sh"   scripts/tts-providers/openai.sh

# Wire the audio scripts into package.json so contributors don't have to remember
# the exact command. Uses node to merge into the existing package.json.
node -e '
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
p.scripts = Object.assign({}, p.scripts, {
  "extract-narrations": "tsx scripts/extract-narrations.ts",
  "synthesize-audio":   "bash scripts/synthesize-audio.sh",
});
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");
'

# 章節生成插圖的落點（ImageGen 產出 → /illustrations/<chapter-id>/<slug>.png）
touch public/illustrations/.gitkeep

# 留個標記，以後能查這個專案從哪個主題 / 哪個套件管理器起步的
{
  echo "$THEME"
} > .theme
{
  echo "$PM"
} > .pm

# 跑一次 typecheck 確認接線 OK
echo "▸ 跑 typecheck ..."
if $PM_EXEC tsc --noEmit; then
  echo "✓ typecheck 通過"
else
  echo "✗ typecheck 失敗 —— 請看上面的錯誤" >&2
  exit 1
fi

cat <<EOF

✓ 完成。下一步：

  1. cd $TARGET
  2. $PM run dev      # 預設 http://localhost:5174（被佔用會自動換 port）

目前主題：${THEME}（見 .theme）
目前套件管理器：${PM}（見 .pm —— 後續所有指令都用它）
主題素材（若有）：public/theme-assets/（用途與 alt 見 theme.json 的 illustrations；
                 若 theme.json 有 styleReference，那是封面版型 + 全片插圖畫風的基準）
生成插圖落點：public/illustrations/<chapter-id>/<slug>.png（見 references/ILLUSTRATIONS.md）

然後：

  • 點舞台任意位置推進全域 step 計數器。
  • 滑鼠移到底部邊緣可顯示進度條、全螢幕與原始碼按鈕；
    滑鼠移到右上角可顯示播放模式切換。
  • 第一個章節固定是封面 src/chapters/00-cover/，內容章節從 01- 起。
  • 把 src/chapters/01-example/ 換成你自己的章節
    （流程見 SKILL.md "Phase 2.4 實作單章" —— 每章一次到位完整版本，
     不分骨架 / 精修兩步；動畫選型由 chapter agent 依 CHAPTER-CRAFT.md
     Part 0 原則 7 + Part 1 五問決定）。
  • 在 src/registry/chapters.ts 註冊每個新章節。
  • **每章必須有 narrations.ts**（與 Example.tsx 同目錄），
    陣列長度 = step 數，是音檔合成 + Auto 模式的唯一真相來源。
  • 章節改了就 bump src/hooks/useStepper.ts 的 STORAGE_KEY 末尾版本號。

錄製：

  • 手動模式：直接開啟 http://localhost:5174（點擊 / 方向鍵推進）
  • 半自動：URL 加 ?audio=1 — 音檔跟著 step 切，但你手動推進
  • 全自動錄影：URL 加 ?auto=1 — 按一次 SPACE 啟動，整片自動播 + 推進
                按 M 鍵隨時切換三種模式。

音檔合成（選擇性，錄製前做）：

  $PM run extract-narrations    # 掃描所有章節 narrations.ts → audio-segments.json
  $PM run synthesize-audio      # 預設 minimax provider 合成 → public/audio/<id>/<step>.mp3
                                # 換 provider：PRESENTATION_TTS=<name> $PM run synthesize-audio
                                # 自訂 / 沒裝 mmx 見 scripts/tts-providers/README.md

寫章節時必讀（單一入口，路徑在 SKILL repo 內）：

  • $SKILL_DIR/references/CHAPTER-CRAFT.md
      Part 0 十條原則 / Part 1 開工 5 問 / Part 2 關係→動作決策樹 /
      Part 3 視覺工具箱 / Part 4 時長 / Part 5 反 AI 味反模式 /
      Part 6 程式碼硬規則 / Part 7 完工自我檢查 / Part 8 回饋速查
  • $SKILL_DIR/themes/$THEME/theme.json
      看 descriptionZh / mood / bestFor —— 參考主題調性；若有 illustrations，
      只在內容情境吻合時從 public/theme-assets/ 選圖穿插；若有 styleReference，
      封面照它的 layoutNote 定版型、生成插圖照它的 styleNote 定畫風
      （動畫 / 時長 / 字級 / emoji 由 chapter agent 在每章自由決定）
  • $SKILL_DIR/references/ILLUSTRATIONS.md
      僅當 outline 該章寫了「插圖描述」時讀 —— 生圖 prompt 配方 + 輸出路徑 +
      呼叫不到圖片生成工具時的 placeholder 降級

卡住時可翻：

  • $SKILL_DIR/references/EXAMPLES/
      完整章節 anchor（鉤子型 / 列舉型）—— 看「形」，不要照搬

要換一個主題，覆蓋 tokens.css；若新主題有 assets，也同步素材：
  cp $SKILL_DIR/themes/<id>/tokens.css src/styles/tokens.css
  cp -R $SKILL_DIR/themes/<id>/assets/. public/theme-assets/   # 選擇性

想自建主題，看 $SKILL_DIR/references/THEMES.md。

EOF
