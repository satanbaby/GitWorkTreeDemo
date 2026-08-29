# Web Video Presentation Skill

**把文章或口播稿做成点击驱动的 16:9 网页演示，并通过录屏产出有电影感视频的 Agent Skill。**

[English](./README.md) · [返回集合首页](../../README.zh-CN.md)

![Web Video Presentation Skill](https://cdn.jsdelivr.net/gh/ConardLi/assets@main/imgs/web-video-presentation-skill.webp)

---

## 这是什么？

`web-video-presentation` 帮 Agent 构建一种 Vite + React + TypeScript 演示：它看起来不是传统幻灯片，而更像为录屏设计的视频舞台。每次点击推进一个口播节拍，每一步独占 1920×1080 舞台，进度 UI 平时隐藏，只有悬浮时出现，方便录出干净画面。

它适合：

- 把文章改写成 B 站 / YouTube / 视频号风格口播稿
- 把已有口播稿做成有节奏的网页演示
- 做产品演示、教程、keynote 式讲解、视觉 talk
- 做“动态 PPT，但不要像 PPT”的演示体验
- 在视觉 outline 对齐后，可选合成口播音频

这个 Skill 的核心是**方法论 + 协作流程**。脚手架提供 token、舞台原语、主题和示例，但每个项目仍然应该根据主题重新选择视觉语言。

---

## 核心理念

- **固定 16:9 舞台**：内容写在稳定的 1920×1080 坐标系里，再按视口缩放。
- **一个全局 step 游标**：点击或键盘推进 `(chapter, step)`，游标本地持久化。
- **一步一个想法**：每个节拍独占整屏，不堆叠项目符号。
- **口播节拍驱动结构**：讲述节奏直接映射为视觉 step。
- **隐藏 chrome**：进度控制悬浮才出现，录屏画面保持干净。
- **动效优先**：每一步都需要一个移动的视觉锚点，静态正文是坏味道。
- **主题 token**：视觉属性通过语义 token 驱动，换主题不只是换颜色。
- **可插拔 TTS**：provider-agnostic 音频 runner，**内置 2 个 provider**（MiniMax `mmx-cli` + OpenAI TTS via curl）；往 `tts-providers/` 丢一个 `.sh` 就能换成 ElevenLabs / edge-tts / Azure / Google Cloud / macOS `say` / 任何自部署 TTS。
- **硬 checkpoint + 状态外部化**：Agent 在固定节点停下来确认，且每个节点的状态都写在 **`outline.md` 顶部的「进度看板」** —— 换 session、续接、并行 subagent 都能看出流程走到哪。
- **封面章节是必须的**：`00-cover` 与第 1 章一起在主线程做完、一起验收；内容章节从 `01-` 起。
- **选填生成式插图**：某章可在 outline 写「插图描述」，开发该章之前 Agent 调生图工具产出素材，画风锚定主题的 `styleReference`，让全片插图属于同一套视觉语言。
- **pnpm 优先 / npm 后备**：脚手架自动探测包管理器，结果写进 `<project>/.pm`，`--pm=` 可强制指定。

---

## 工作流

```text
Phase 1.1  识别用户输入
Phase 1.2  文章 -> 口播稿 + outline.md（含进度看板）
   |
CP-0       script.md / outline.md 自检
   |
CP-1       Checkpoint Plan：稿子 / outline / 主题 / 素材 / 开发模式
   |
Phase 2.1  脚手架 Vite / React / TS 项目
Phase 2.2  封面 00-cover + 第 1 章（主线程）
   |
CP-2       用户验收封面 + 第 1 章  <- 不可跳过
   |
Phase 2.3  第 2~N 章（逐章 / 顺序 / 并行）
   |
CP-3       第 2~N 章验收
   |
CP-4       Checkpoint Audio：合成或跳过
   |
Phase 3    可选音频合成
Phase 4    录屏与后期 -> CP-5
```

这些 checkpoint 是 Skill 契约的一部分：Agent 不应该从原文一路闷头做到成品。每过一个节点就立刻回写 `outline.md` 的进度看板 —— 只存在于对话里的状态等于没有状态。

---

## 内含内容

```text
skills/web-video-presentation/
├── SKILL.md
├── README.md / README.zh-CN.md
├── references/
│   ├── CHAPTER-CRAFT.md       # 每章唯一必读入口
│   ├── OUTLINE-FORMAT.md      # 进度看板 + outline spec
│   ├── SCRIPT-STYLE.md
│   ├── ILLUSTRATIONS.md       # 生成式插图流程
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
│   │   └── tts-providers/            # 一个文件 = 一个 TTS 后端
│   │       ├── README.md             # 三函数契约 + ElevenLabs / edge-tts / Azure / Google / say 的现成片段
│   │       ├── minimax.sh            # 默认 provider（mmx-cli）
│   │       └── openai.sh             # 内置：OpenAI TTS（curl + OPENAI_API_KEY）
│   └── src/
└── themes/                    # 1 套内置主题（要别的气质从它派生）
    └── we-bare-bears/
        ├── theme.json         # 元数据 + illustrations + styleReference
        ├── tokens.css
        └── assets/            # 3 张角色图 + 1 张风格参考图
```

---

## 快速上手

把这个 Skill 复制到你的 Agent 会扫描的目录，然后让 Agent 把一篇文章或口播稿做成网页视频演示。

如果要手动脚手架：

```bash
bash skills/web-video-presentation/scripts/scaffold.sh ./presentation --theme=we-bare-bears
```

查看可用主题：

```bash
bash skills/web-video-presentation/scripts/scaffold.sh --list-themes
```

生成的 `presentation/` 是普通 Vite + React + TypeScript 项目。启动后用录屏工具录制 16:9 舞台即可。

---

## 主题

Skill **内置 1 套主题**。早期版本内置 24 套，现在刻意收敛成单一一套 ——
派生一套新的成本很低：复制目录、改 `tokens.css` 和 `theme.json`，完事。

### `we-bare-bears` · 熊熊遇見你

溫暖日常繪本感：奶油紙張、天空藍單一 accent、蜂蜜木色中性色、Nunito 圓體。
簽名是**圓角紙卡 + 2px 炭黑手繪輪廓與淡藍錯位影**。

**適合**：團隊協作 / Git 教學 · 入門技術分享 · 工作流程與工具解說 ·
友善知識科普 · 輕鬆文化生活內容。

另附 `assets/` 素材包：三張角色插圖，加一張**風格參考圖** —— 它同時是封面
版式藍圖，也是生成插圖的畫風錨點。

- 元数据：[`themes/we-bare-bears/theme.json`](themes/we-bare-bears/theme.json)
- Token：[`themes/we-bare-bears/tokens.css`](themes/we-bare-bears/tokens.css)
- 自创主题：[`references/THEMES.md`](references/THEMES.md)

---

## Reference Map

- [CHAPTER-CRAFT.md](./references/CHAPTER-CRAFT.md)：每章唯一必读入口 —— 封面规格、十条原则、视觉演示底线、反 AI 味、代码红线、完工自检
- [OUTLINE-FORMAT.md](./references/OUTLINE-FORMAT.md)：outline 结构 —— 进度看板、`00-cover` 编号、信息池、选填插图描述
- [SCRIPT-STYLE.md](./references/SCRIPT-STYLE.md)：文章转口播稿规则
- [ILLUSTRATIONS.md](./references/ILLUSTRATIONS.md)：什么该生成、以主题 `styleReference` 为锚的 prompt 配方、输出路径、placeholder 降级
- [THEMES.md](./references/THEMES.md)：完整 token 契约 + 派生新主题流程
- [EXAMPLES/](./references/EXAMPLES/)：可选的章节结构 anchor（不是抄袭模板）
- [AUDIO.md](./references/AUDIO.md)：可选口播音频合成流程（provider-agnostic）
- [tts-providers/README.md](./templates/scripts/tts-providers/README.md)：TTS provider 三函数契约 + 内置 2 个 (minimax / openai) + ElevenLabs / edge-tts / Azure / Google / macOS say 的现成代码片段
- [RECORDING.md](./references/RECORDING.md)：录屏与后期注意事项

