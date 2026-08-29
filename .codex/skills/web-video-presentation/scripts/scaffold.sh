#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# scaffold.sh —— 一键脚手架，创建一个 video-presentation 项目。
#
# 用法：
#   bash scripts/scaffold.sh <target-dir> [--theme=<id>] [--pm=<pnpm|npm>]
#   bash scripts/scaffold.sh --list-themes
#
# 例子：
#   bash <path-to-web-video-presentation>/scripts/scaffold.sh ./presentation
#   bash <path-to-web-video-presentation>/scripts/scaffold.sh ./talk --theme=we-bare-bears
#   bash <path-to-web-video-presentation>/scripts/scaffold.sh ./talk --pm=npm
#   bash <path-to-web-video-presentation>/scripts/scaffold.sh --list-themes
#
# 包管理器：pnpm 优先、npm 后备（自动探测）。--pm= 可强制指定。
# 选中的那个会写进 <project>/.pm，后续阶段照着用。
#
# 跑完后，看 SKILL.md "Phase 2.4 实现单章" + references/CHAPTER-CRAFT.md
# 了解每章怎么写。卡壳时翻 references/EXAMPLES/ 找完整章节 anchor。
#
# 之后切换主题，覆盖一个文件即可：
#   cp <path-to-web-video-presentation>/themes/<id>/tokens.css \
#      <project>/src/styles/tokens.css
# ─────────────────────────────────────────────────────────────
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATES="$SKILL_DIR/templates"
THEMES_DIR="$SKILL_DIR/themes"
DEFAULT_THEME="we-bare-bears"

list_themes() {
  echo "可用主题（来自 ${THEMES_DIR}）:"
  echo
  for dir in "$THEMES_DIR"/*/; do
    [[ -d "$dir" ]] || continue
    local meta="$dir/theme.json"
    [[ -f "$meta" ]] || continue
    # 没有 jq，简单 grep + sed 提字段
    local id name desc
    id=$(grep -E '"id"' "$meta" | head -n1 | sed -E 's/.*"id":[[:space:]]*"([^"]+)".*/\1/')
    name=$(grep -E '"nameZh"' "$meta" | head -n1 | sed -E 's/.*"nameZh":[[:space:]]*"([^"]+)".*/\1/')
    desc=$(grep -E '"descriptionZh"' "$meta" | head -n1 | sed -E 's/.*"descriptionZh":[[:space:]]*"([^"]+)".*/\1/')
    printf "  • %-18s %s\n      %s\n\n" "$id" "$name" "$desc"
  done
  echo "用 --theme=<id> 选定一个。默认：${DEFAULT_THEME}。"
}

# ── 解析参数 ──
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
      echo "✗ 未知参数: $arg" >&2
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
  echo "✗ 找不到主题 '${THEME}'。可用主题：" >&2
  echo >&2
  for dir in "$THEMES_DIR"/*/; do
    [[ -d "$dir" ]] || continue
    echo "    • $(basename "$dir")" >&2
  done
  exit 1
fi

if [[ -d "$TARGET" && -n "$(ls -A "$TARGET" 2>/dev/null || true)" ]]; then
  echo "✗ 目标目录 '${TARGET}' 已存在且非空，已中止。" >&2
  exit 1
fi

# ── 选包管理器：pnpm 优先、npm 后备，--pm= 可强制 ──
pick_pm() {
  case "$1" in
    pnpm)
      command -v pnpm >/dev/null || { echo "✗ 指定了 --pm=pnpm，但 PATH 里没有 pnpm。" >&2; exit 1; }
      PM="pnpm"; PM_EXEC="pnpm exec"; PM_DLX="pnpm dlx"
      ;;
    npm)
      command -v npm >/dev/null || { echo "✗ 指定了 --pm=npm，但 PATH 里没有 npm。" >&2; exit 1; }
      PM="npm"; PM_EXEC="npx"; PM_DLX="npx"
      ;;
    "")
      if command -v pnpm >/dev/null; then
        PM="pnpm"; PM_EXEC="pnpm exec"; PM_DLX="pnpm dlx"
      elif command -v npm >/dev/null; then
        PM="npm"; PM_EXEC="npx"; PM_DLX="npx"
      else
        echo "✗ 需要 pnpm 或 npm，但两个都不在 PATH 里。" >&2
        exit 1
      fi
      ;;
    *)
      echo "✗ --pm 只支持 pnpm / npm，收到：$1" >&2
      exit 1
      ;;
  esac
}
pick_pm "$PM_FORCED"

echo "▸ 在 $TARGET 创建 Vite + React + TS 项目"
echo "▸ 使用主题：$THEME"
echo "▸ 包管理器：$PM"
$PM_DLX create-vite@latest "$TARGET" --template react-ts >/dev/null

cd "$TARGET"

if [[ "$PM" == "pnpm" ]]; then
  # pnpm 10+ 默认拦截依赖的 build script。撞上就以 ERR_PNPM_IGNORED_BUILDS
  # 退出 1，而且 esbuild 的原生二进制真的装不上（tsx / vite 会跑不起来），
  # 修复要跑交互式 `pnpm approve-builds` —— 脚本里没法交互。所以先白名单。
  #
  # 白名单写哪里跟版本有关：
  #   pnpm 11+ → pnpm-workspace.yaml 的 allowBuilds
  #   pnpm 10  → package.json 的 pnpm.onlyBuiltDependencies
  echo "▸ 允许必要依赖执行 build script（esbuild 原生二进制）..."
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

echo "▸ 安装依赖（可能要等一会）..."
$PM install >/dev/null 2>&1

echo "▸ 安装 tsx（用于 extract-narrations 脚本）..."
if [[ "$PM" == "pnpm" ]]; then
  # pnpm install -D 不装包，必须用 pnpm add
  pnpm add -D tsx >/dev/null 2>&1
else
  npm install -D tsx >/dev/null 2>&1
fi

echo "▸ 用演示骨架替换默认 boilerplate"

# 干掉我们不要的 Vite 默认 boilerplate
rm -f \
  src/App.tsx src/App.css \
  src/main.tsx src/index.css \
  src/assets/react.svg \
  public/vite.svg \
  README.md
rmdir src/assets 2>/dev/null || true

# 把脚手架文件拷到项目根
mkdir -p \
  src/styles src/hooks src/components src/registry \
  src/chapters/01-example \
  public/illustrations scripts

cp "$TEMPLATES/vite.config.ts" .
cp "$TEMPLATES/index.html" .

cp "$TEMPLATES/src/main.tsx" src/main.tsx
cp "$TEMPLATES/src/App.tsx"  src/App.tsx

# tokens.css 来自所选主题
cp "$THEME_TOKENS"                          src/styles/tokens.css
cp "$TEMPLATES/src/styles/base.css"         src/styles/base.css
cp "$TEMPLATES/src/styles/animations.css"   src/styles/animations.css
cp "$TEMPLATES/src/styles/fonts.css"        src/styles/fonts.css

# 主题可选素材包。统一落到 public/theme-assets，theme.json 可直接声明
# /theme-assets/<filename> 给章节使用。
if [[ -d "$THEME_ASSETS" && -n "$(ls -A "$THEME_ASSETS" 2>/dev/null || true)" ]]; then
  mkdir -p public/theme-assets
  cp -R "$THEME_ASSETS"/. public/theme-assets/
  cp "$THEME_DIR/theme.json" public/theme-assets/theme.json
fi

cp "$TEMPLATES/src/hooks/useStageScale.ts"   src/hooks/useStageScale.ts
cp "$TEMPLATES/src/hooks/useStepper.ts"      src/hooks/useStepper.ts
cp "$TEMPLATES/src/hooks/useAudioPlayer.ts"  src/hooks/useAudioPlayer.ts
cp "$TEMPLATES/src/hooks/useAutoMode.ts"     src/hooks/useAutoMode.ts

cp "$TEMPLATES/src/components/Stage.tsx"          src/components/Stage.tsx
cp "$TEMPLATES/src/components/MaskReveal.tsx"     src/components/MaskReveal.tsx
cp "$TEMPLATES/src/components/ProgressBar.tsx"    src/components/ProgressBar.tsx
cp "$TEMPLATES/src/components/ProgressBar.css"    src/components/ProgressBar.css
cp "$TEMPLATES/src/components/AutoStartGate.tsx"  src/components/AutoStartGate.tsx
cp "$TEMPLATES/src/components/AutoStartGate.css"  src/components/AutoStartGate.css
cp "$TEMPLATES/src/components/AutoToggle.tsx"     src/components/AutoToggle.tsx
cp "$TEMPLATES/src/components/AutoToggle.css"     src/components/AutoToggle.css

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

# 章节生成插图的落点（ImageGen 产出 → /illustrations/<chapter-id>/<slug>.png）
touch public/illustrations/.gitkeep

# 留个标记，以后能查这个项目从哪个主题 / 哪个包管理器起步的
{
  echo "$THEME"
} > .theme
{
  echo "$PM"
} > .pm

# 跑一次 typecheck 确认接线 OK
echo "▸ 跑 typecheck ..."
if $PM_EXEC tsc --noEmit; then
  echo "✓ typecheck 通过"
else
  echo "✗ typecheck 失败 —— 请看上面的错误" >&2
  exit 1
fi

cat <<EOF

✓ 完成。下一步：

  1. cd $TARGET
  2. $PM run dev      # 默认 http://localhost:5174（被占会自动换端口）

当前主题：${THEME}（见 .theme）
当前包管理器：${PM}（见 .pm —— 后续所有命令都用它）
主题素材（若有）：public/theme-assets/（用途与 alt 见 theme.json 的 illustrations；
                 若 theme.json 有 styleReference，那是封面版式 + 全片插图画风的基准）
生成插图落点：public/illustrations/<chapter-id>/<slug>.png（见 references/ILLUSTRATIONS.md）

然后：

  • 点舞台任意位置推进全局 step 计数器。
  • 鼠标移到底部边缘可显出进度条；鼠标移到右上角可显出播放模式切换。
  • 第一个章节固定是封面 src/chapters/00-cover/，内容章节从 01- 起。
  • 把 src/chapters/01-example/ 替换成你自己的章节
    （流程见 SKILL.md "Phase 2.4 实现单章" —— 每章一次到位完整版本，
     不分骨架 / 精修两步；动画选型由 chapter agent 按 CHAPTER-CRAFT.md
     Part 0 原则 7 + Part 1 五问决定）。
  • 在 src/registry/chapters.ts 注册每个新章节。
  • **每章必须有 narrations.ts**（与 Example.tsx 同目录），
    数组长度 = step 数，是音频合成 + Auto 模式的唯一真相源。
  • 章节改了就 bump src/hooks/useStepper.ts 的 STORAGE_KEY 末尾版本号。

录制：

  • 手动模式：直接打开 http://localhost:5174（点击 / 方向键推进）
  • 半自动：URL 加 ?audio=1 — 音频跟 step 切，但你手动推进
  • 全自动录屏：URL 加 ?auto=1 — 按一次 SPACE 启动，整片自动播 + 推进
                按 M 键随时切换三种模式。

音频合成（可选，录制前做）：

  $PM run extract-narrations    # 扫所有章节 narrations.ts → audio-segments.json
  $PM run synthesize-audio      # 默认 minimax provider 合成 → public/audio/<id>/<step>.mp3
                                # 换 provider：PRESENTATION_TTS=<name> $PM run synthesize-audio
                                # 自定义 / 没装 mmx 见 scripts/tts-providers/README.md

写章节时必读（单一入口，路径在 SKILL 仓库内）：

  • $SKILL_DIR/references/CHAPTER-CRAFT.md
      Part 0 十条原则 / Part 1 开工 5 问 / Part 2 关系→动作决策树 /
      Part 3 视觉工具箱 / Part 4 时长 / Part 5 反 AI 味反模式 /
      Part 6 代码硬规则 / Part 7 完工自检 / Part 8 反馈速查
  • $SKILL_DIR/themes/$THEME/theme.json
      看 descriptionZh / mood / bestFor —— 参考主题气质；若有 illustrations，
      只在内容情境吻合时从 public/theme-assets/ 选图穿插；若有 styleReference，
      封面照它的 layoutNote 定版式、生成插图照它的 styleNote 定画风
      （动画 / 时长 / 字号 / emoji 由 chapter agent 在每章自由决定）
  • $SKILL_DIR/references/ILLUSTRATIONS.md
      仅当 outline 该章写了「插图描述」时读 —— 生图 prompt 配方 + 输出路径 +
      调不到生图工具时的 placeholder 降级

卡壳时可翻：

  • $SKILL_DIR/references/EXAMPLES/
      完整章节 anchor（钩子型 / 列举型）—— 看"形"，不要照搬

要换一个主题，覆盖 tokens.css；若新主题有 assets，也同步素材：
  cp $SKILL_DIR/themes/<id>/tokens.css src/styles/tokens.css
  cp -R $SKILL_DIR/themes/<id>/assets/. public/theme-assets/   # 可选

想自创主题，看 $SKILL_DIR/references/THEMES.md。

EOF
