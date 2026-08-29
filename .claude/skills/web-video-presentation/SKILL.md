---
name: web-video-presentation
description: 把一篇文章或口播稿，做成"看起来像视频"的点击驱动 16:9 网页演示，可选合成口播音频。流程：原始文章 → **一次产出**口播稿 + outline 开发计划（含**跨 agent 进度看板**）→ 用户**一次对齐** 5 件事（稿子 / outline / 主题 / 素材 / 开发模式）→ 网页开发（**封面 00-cover + 第 1 章主线程强制验收**，其余逐章 / 顺序 / 并行）→ 可选音频合成（provider-agnostic：内置 MiniMax mmx-cli + OpenAI TTS，可换 ElevenLabs / edge-tts / Azure / 自带 TTS）。技术线 Vite + React + TS，包管理器 pnpm 优先 npm 后备。**outline 只规划节奏与信息密度，不规划动画** —— 动画由章节开发时按 PRINCIPLES + ANTI-AI 法则即时设计；outline 可选填**插图描述**，写了就在开发该章前调生图工具（ImageGen）按主题画风产出插图素材。每次点击推进口播稿的一个节拍，每一步独占整屏，进度条平时隐藏只在悬浮时出现。适用场景：用网页做视频（动态 PPT 但不像 PPT）、把口播稿 / 文章变成可交互的解说、为 B 站 / YouTube / 视频号录屏教程、做有电影感的产品 / talk demo。本 Skill 沉淀的是设计方法论 + 协作流程 —— 不绑定任何特定样式 / 字体 / 颜色 —— 因此能复用到任意主题与美学。
---

# Web Video Presentation

把一篇文章或口播稿，一步步做成可录屏的"伪装成视频的网页"，可选合成
口播音频。产出物 = Vite + React + TS 项目 + 按章节切分的音频。

## 适用场景

- "我有口播稿 / 一篇文章，帮我做成视频" —— 口播驱动的内容
- 想做 "动态 PPT"
- 16:9 横屏录屏，大字、留白、每屏都要有动效
- 教学 / 产品演示 / keynote 想要电影感
- B 站 / YouTube /抖音视频内容

本 Skill **以方法论 + 协作流程为核心**。脚手架模板提供 token 和原语，
但每个美学决策（配色、字型、动效气质）都应该针对你的主题重新设计 ——
不要照搬。

---

## 工作流总览

```
Phase 1   内容编写
   1.1  识别用户输入
   1.2  一次产出 script.md + outline.md
        （口播稿 + 开发计划 + 顶部进度看板）
   ▼
   [CP-0] 内容自检（script / outline）
   ▼
[Checkpoint Plan · CP-1]  ← 必须停。一次对齐 5 件事：
                            稿子 / outline / 主题 / 素材 / 开发模式
   ▼
Phase 2   网页开发
   2.1  脚手架（按确认的主题）
   2.2  封面 00-cover + 第 1 章 = 主线程 + 完整版本（强制 anchor）
        ▼
        [硬节点 · CP-2] 用户验收封面 + 第 1 章 ← 不可跳过
        ▼
   2.3  第 2~N 章（按选定模式：A 逐章 / B 顺序 / C 并行）
        ▼
        [CP-3] 第 2~N 章验收
   ▼
[Checkpoint Audio · CP-4] ← 必须停。是否合成音频
   ▼
Phase 3   音频合成（可选）
   ▼
Phase 4   录屏 + 后期 → [CP-5] 录屏路径确认
```

> **每个 CP 的状态都写在 `outline.md` 顶部「进度看板」里**，不是只存在
> 对话里。见下文「进度看板协议」。

工作目录约定（agent 在用户当前目录下创建 / 编辑）：

```
my-video/
├── article.md          # 用户给原文时必有 —— 不删！开发阶段画面信息源
├── script.md           # 必有：保持原文语言的平台化口播稿（决定节拍）
├── outline.md          # 必有：★ 进度看板 + 开发计划
│                       #   （章节切分 + 每步内容 + 信息池 + 选填插图描述）
└── presentation/       # 脚手架产出的 Vite + React + TS 项目
    ├── .theme / .pm          # 起步用的主题 id / 包管理器（pnpm 或 npm）
    ├── src/chapters/00-cover/    # ★ 封面固定第一章，内容章节从 01- 起
    ├── src/chapters/<NN>-<id>/
    │   ├── <Chapter>.tsx     # 视觉实现
    │   ├── <Chapter>.css
    │   └── narrations.ts     # ★ step 数 + 口播文本的唯一真相源
    ├── scripts/
    │   ├── extract-narrations.ts   # 扫所有 narrations.ts → audio-segments.json
    │   ├── synthesize-audio.sh     # provider-agnostic runner（循环 segments）
    │   └── tts-providers/          # 每 provider 一个 .sh（内置 2 个）
    │       ├── README.md           # 三函数契约 + 5 段现成代码片段（11labs / edge-tts / say / azure / gcloud）
    │       ├── minimax.sh          # 默认 provider，用 mmx-cli
    │       └── openai.sh           # 内置 OpenAI TTS（curl + OPENAI_API_KEY）
    ├── audio-segments.json         # extract 产出（合成前 review）
    └── public/audio/<id>/<N>.mp3   # 可选：合成的音频
```

> **关键**：`narrations.ts` 是 step 数和音频合成的**唯一真相源**。
> 章节 `.tsx` 里的 `if (step === N)` 出现的最大 N + 1 必须等于
> `narrations.length`。这保证 5 处地方（script / outline / 章节代码 /
> chapters.ts / 音频文件）永远不会漂。

---

## 技术线

| 项 | 用什么 | 说明 |
|---|---|---|
| 前端 | **Vite + React + TypeScript** | 脚手架用官方 `create-vite` 的 `react-ts` 模板 |
| **包管理器** | **pnpm 优先，npm 后备** | `scaffold.sh` 自动探测：有 `pnpm` 就用 pnpm，没有才退回 npm。`--pm=pnpm` / `--pm=npm` 可强制 |
| 包管理器记录 | `<project>/.pm` | 脚手架把选中的写进去。**后续所有命令（含 subagent、音频阶段）先读它，别猜** |
| 脚本运行时 | `tsx`（devDependency） | 跑 `scripts/extract-narrations.ts` |
| package.json 注入 | `node -e`（脚手架内） | 把 `extract-narrations` / `synthesize-audio` 挂进 scripts |
| TTS runner | `bash` + 每 provider 一个 `.sh` | 见 [`AUDIO.md`](references/AUDIO.md) |
| 生成插图 | 当前 agent 的生图工具 | 见 [`ILLUSTRATIONS.md`](references/ILLUSTRATIONS.md)，调不到就降级 placeholder |

命令写法（本 Skill 全文统一）：

```bash
pnpm run dev              # npm run dev 亦可
pnpm exec tsc --noEmit    # 或 npx tsc --noEmit
```

---

## 硬性自检协议（贯穿整个 Skill）

下面三个产出，每一个**完成后必须走自检 → 修复 → 再汇报 / 推进**：

| 产出 | 自检清单出处 |
|---|---|
| `script.md` | [`SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) 三层自检（形式 / 风骨 / 念出来） |
| `outline.md` | [`OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md) 自检 |
| 单章实现完成 | [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) 完工自检 |

**执行方式**（按能力降级，**优先用更隔离的方式**）：

1. **Agent Teams（最优）**：开一个独立的 reviewer agent，给它"产出文件
   路径 + 对应清单 + 关键上下文"，让它逐项核查并**严格汇报结论**
   （哪几条 pass / 哪几条 fail + 证据 + 改写建议）。
2. **subAgent（次优）**：没有 Teams 能力但能开 subagent 就用 subagent
   走同样流程。
3. **自检（兜底）**：当前 agent 都没有上述能力，就自己**严格逐项**
   核查 —— 不允许目测一遍就放行。

**铁律**：拿到结论后**先按 fail 项把产出改完**，再向用户汇报"做完了
+ 自检结论 + 改了什么"。**直接拿原始结论汇报但不修复 = 违规**。

---

## 进度看板协议（跨 agent 续接）

**所有人工 Checkpoint 的状态都外部化在 `outline.md` 顶部的「进度看板」**
（格式 spec 见 [`OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md)）。
理由很实际：换 agent、续接 session、并行 subagent 都看不到之前的对话，
**只有文件里的状态是可靠的**。

| 规则 | 内容 |
|---|---|
| **接手先读** | 任何 agent（新 session / subagent / 续接）动手前**先读进度看板**，以看板判断从哪一步开始 —— 不靠对话记忆，也不靠"看起来做到哪了" |
| **过节点即回写** | 每过一个硬节点（含每章验收）**立刻**回写看板，回写完才准推进下一步 |
| **subagent 由主线程回写** | 模式 C 的 subagent prompt 必须带上看板当前状态；subagent **自己不写** `outline.md`（避免并发写冲突），完工回报后由主线程统一回写 |
| **状态词汇固定** | ⬜ 未开始 ／ 🟡 进行中 ／ 🔵 待用户验收 ／ ✅ 已通过 ／ ⏭️ 已跳过 |
| **禁止** | 看板未回写就进入下一阶段；用自创状态词；只在对话里说"第 3 章过了"却不落盘 |

六个 checkpoint：

| # | 含义 | 什么时候变 ✅ |
|---|---|---|
| CP-0 | 内容自检（script.md / outline.md） | 自检结论的 fail 项全部改完 |
| CP-1 | Checkpoint Plan（5 件事对齐） | 用户确认稿子 / outline / 主题 / 素材 / 模式 |
| CP-2 | 封面 + 第 1 章验收 | 用户明确说 OK / 继续 |
| CP-3 | 第 2~N 章验收 | 所有内容章节都 ✅（逐章模式下每章单独在章节表里更新） |
| CP-4 | Checkpoint Audio | 用户选了合成或不合成（不合成记 ⏭️） |
| CP-5 | Phase 4 录屏路径确认 | 已告知用户该走 Auto 还是 Manual 路径 |

---

## 各阶段文件读取指南

不同阶段读不同的文件。**长会话里 agent 容易遗忘原则**，特别是
Phase 2.4 的"实现单章"会重复 N 次 —— 每次都要回看核心约束。

| 阶段 | 必读（每次都看） | 一次性看完 / 按需查 |
|---|---|---|
| **任何阶段 · 接手时** | `outline.md` 顶部**进度看板**（判断从哪一步开始） | —— |
| Phase 1.1-1.2 内容编写 | `references/SCRIPT-STYLE.md` + `references/OUTLINE-FORMAT.md` + `article.md`（用户原文，如有） | —— |
| **Checkpoint Plan 确认主题** | —— | `themes/*/theme.json`（动态读全部，列清单 + `bestFor` + `descriptionZh`）；`references/THEMES.md`（用户想了解主题系统 / 想派生新主题时） |
| Phase 2.1 脚手架 | —— | SKILL.md 本节看一次 |
| **Phase 2.4 实现单章（×N 次，被 2.2 / 2.3 调用）** | **`references/CHAPTER-CRAFT.md`** 单一入口 —— Part 0 十条原则 / Part 1 开工 5 问 / Part 2 关系→动作决策树 / Part 3 视觉工具箱 / Part 4 时长参考 / Part 5 反 AI 味反模式 / Part 6 代码硬规则（**含 narrations.ts 强制约束**）/ Part 7 完工自检 / Part 8 反馈速查 + 封面章节规格（做 00-cover 时）+ 当前主题的 `themes/<id>/theme.json`（若有 `illustrations` 按情境挑选；若有 `styleReference` 按它定封面版式 / 插图画风）+ 当前章节的 outline.md 段落 + **`article.md` 本章对应段落** + 素材清单 | **`references/ILLUSTRATIONS.md`（该章 outline 写了「插图描述」时**必读**）**；`references/EXAMPLES/`（结构示意，不是抄袭模板）；`references/THEMES.md` 完整 token 契约 |
| Phase 3 音频合成 | `references/AUDIO.md`（含 narrations.ts → segments.json → 任意 provider 流程，内置 minimax + openai） | `templates/scripts/tts-providers/README.md`（换 provider / 自带 TTS 时） |
| Phase 4 录屏 + 后期 | `references/RECORDING.md`（含 `?auto=1` 自动录屏） | —— |
| 选 / 造 / 切主题 | —— | `references/THEMES.md` |

> **写章节时只读一份 `CHAPTER-CRAFT.md`**。十条原则 / 开工 self-prompting /
> 决策树 / 反 AI 味反模式 / 完工自检全部并入这一份单一入口。`EXAMPLES/`
> **不是必读** —— 先按内容自由设计，卡壳才翻（按 anchor 翻"形"，不要照搬）。

---

## Phase 1 —— 内容编写（一次产出）

### 1.1 识别用户输入

| 用户给的东西 | 该做的 |
|---|---|
| 原始文章（书面语 / 公众号 / 论文 / 博客） | 一次产出 `script.md` + `outline.md`（1.2），过 Checkpoint Plan |
| 直接的口播稿 / 视频脚本 | 落盘成 `script.md`，一次产出 `outline.md`（1.2 简化版），过 Checkpoint Plan |
| 啥都没有，只说"帮我做个 X 主题的视频" | **反问**：先给一段素材或大纲。Skill 不替用户构思内容 |

### 1.2 一次产出 script.md + outline.md

**两份产出物在一次思考中完成**：

1. **生成 `script.md`**：按 [`references/SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md)
   的规则把 article 转成保持原文语言的平台化口播稿。**保留 `article.md` 不删**——它是
   outline 写信息池和章节实现画面时的细节源（双源原则）。
2. **生成 `outline.md`**：按 [`references/OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md)
   规则建**进度看板** + 切章节（**第一个固定 `00-cover` 封面**）+ 切 step
   + 每章首段抽**信息池** + 需要具象图的章节写**插图描述**。

**outline 的边界**（关键）：

| outline 必须写 | outline 不要写 |
|---|---|
| 顶部**进度看板**（CP-0~CP-5 + 逐章状态，初始全 ⬜） | 具体动画类型（blur clear / wipe / 弹簧） |
| 章节切分（**含 `00-cover`**）/ 每章 step 数 / 估时 | CSS 实现手段（filter / SVG / clip-path） |
| 每步屏幕内容（hero / 数据 / 标语 / 列表项） | 时长数值（不写 ~2.5s / 80~120ms） |
| 章节级**信息池**：从 article 抽的数字 / 引用 / 案例 / 标签 | 持续微动 / 错峰量等微观节奏 |
| 章节级**插图描述**（选填，只写"画什么"） | 插图画风 / 生图 prompt（画风由主题 `styleReference` 定） |
| 步级关系名前缀（"反差对照" / "递进列表" / "金句" 等可选 hint） | —— |

> **outline 不写动画的理由**：写死动画 = chapter agent 退化为翻译机；
> 留白让 chapter agent 在每步开工时按 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
> 的"内容驱动决策树"自由设计，才有真正的视频感。详见
> [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) Part 0 原则 7。

**落盘后必须先走自检再进 Checkpoint Plan**：按上文「硬性自检协议」分别
对 `script.md` / `outline.md` 执行（优先 Agent Teams → subAgent → 自检），
按结论修复完成后再进入 Checkpoint Plan。

▸ 回写 `outline.md` 进度看板：**CP-0 → ✅**

---

## Checkpoint Plan · CP-1 —— 5 件事一次对齐（**硬节点**）

`script.md` + `outline.md` 写完后必须停下来。**用户在这一个节点同时确认
5 件事**。

### agent 此时要做的预备工作

1. 读所有 `themes/*/theme.json` 拿 `nameZh` / `descriptionZh` / `bestFor`
   / `mood` —— **不要硬编码清单**（当前内置只有一套，但照样动态读，
   将来加了主题不用改这里）
2. 对照 `script.md` 的内容类型 / 语气，说明这套主题**为什么合适**
   （命中哪几条 `bestFor`）；不合适就主动提议派生新主题
3. 扫一遍 `outline.md` 末尾"素材清单"部分，把 `⚠️`（待用户提供）和
   `🎨`（待生图工具产出）两类分开列

### 总结模板（骨架，agent 按情况填充）

```
内容计划写完，产出文件：
  📄 article.md     {若用户给原文则保留}
  📄 script.md      {X} 字 / ~{T} 分钟
  📄 outline.md     进度看板 + 封面 + {N} 章 / {M} 步
                    + 每章信息池 + 末尾素材清单

章节速览：
  0. 00-cover 封面           <S> 步 ~<T>s
  1. <id>     <章节标题>     <S> 步 ~<T>s
  2. ...

接下来一次对齐 5 件事：

  1. 稿子 (script.md) 要不要改？
     可以直接编辑文件，或口头告诉我修改方向。

  2. 开发计划 (outline.md) 要不要改？重点看：
     - 章节切分 / step 数 / 估时是否合理（合理判断：每章 30~60s）
     - 每步屏幕内容是否清晰
     - 每章首段「信息池」是否有足够的 article 细节供画面挂
     - 「插图描述」写得对不对（哪些步真的需要一张具象图）
     - 末尾素材清单是否完整

  3. 主题确认：<nameZh> (<id>)
     内置只有这一套。它命中你内容的 <bestFor 命中项>；<descriptionZh 摘要>。
     沿用这套 / 还是要我按 references/THEMES.md 帮你派生一套新的？

  4. 真素材怎么准备？
     ⚠️ 需要你提供或我从现有素材挑：<列清单>
        a) 我从 <现有素材路径> 帮你挑   b) 你自己提供   c) 全部 placeholder
     🎨 我用生图工具产出（照主题 styleReference 的画风）：<列 outline 里的插图描述>
        现在就可以改描述；开发到该章之前才会真的生成。

  5. 开发模式选哪个？

     **封面 + 第 1 章无论哪种模式都必须主线程做完 + 用户验收**（强制 anchor）。
     差异在第 2 章及之后：

     A) 默认 · 逐章确认（推荐）
        每章做完都暂停验收 → 风险可控 / 节奏最稳
     B) 第 1 章后顺序开发（不并行）
        第 2~N 章主线程顺序做完后统一验收 → 速度中 / 适合 agent 不支持并行
     C) 第 1 章后并行开发（subagent）
        第 2~N 章用 subagent 并行 → 最快 / 用户控并行数（一次几章）
        ⚠️ 风格各章会有差异（这是预期，主题禁区兜底）
```

收到反馈后：
- 稿子 / outline 要改：直接编辑文件，编辑完 ping 一次（或口头描述 agent 改）
- **主题必须明确**才进入 Phase 2。用户说"主题你决定" → 用内置的
  `we-bare-bears`，**告诉用户你用了什么、为什么**，给反悔机会
- 模式选定 → 进 Phase 2

▸ 回写 `outline.md` 进度看板：**CP-1 → ✅**，备注栏记下「主题：<id> ／
开发模式：<A/B/C>」

---

## Phase 2 —— 网页开发

### 2.1 脚手架

```bash
bash <path-to-web-video-presentation>/scripts/scaffold.sh \
  ./presentation \
  --theme=<确认的主题 id>

bash <path-to-web-video-presentation>/scripts/scaffold.sh --list-themes
```

包管理器**自动探测**（pnpm 优先，没有才用 npm），结果写进
`presentation/.pm` —— 之后所有命令都读它。要强制指定加 `--pm=pnpm` 或
`--pm=npm`。

> 自定义主题 → 先按 [`references/THEMES.md`](references/THEMES.md)
> "创作新主题"流程做一个 `themes/<my-theme>/`，再 `--theme=<my-theme>`。

脚手架带一个 `01-example` demo。在写第一章真实内容前**删掉**：

```bash
rm -rf presentation/src/chapters/01-example
```

并把 `presentation/src/registry/chapters.ts` 里 `EXAMPLE_CHAPTER`
的 import 和数组项移除。

### 2.2 封面 + 第 1 章 —— 主线程 + 强制验收（CP-2）

**交付范围 = 两个章节**：

| 章节 | 内容 |
|---|---|
| `src/chapters/00-cover/` | **简报封面** —— 整片第一帧。规格见 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)「封面章节（00-cover）」 |
| `src/chapters/01-<id>/` | 内容第 1 章 |

**两个都做完才进用户验收** —— 不允许"先做第 1 章，封面回头补"。录屏第一
帧就是封面，它决定观众对整片气质的第一印象；跟第 1 章一起做，气质对不对
一次就能被看出来。

**核心**：都是完整版本一次到位（节奏 + 视觉 + 真素材齐全）。
**没有"骨架版"概念** —— 这一批就要做出**用户能直接验收**的样板。

为什么必须主线程：

- 它是 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) 这套指引在**当前
  主题 + 当前题材**下的第一次落地
- 如果指引有盲区 / 主题颜色 / 字体 token 不够用，这一批一定会暴露 ——
  这时候有人类反馈就能修指引 / 调主题，**早改成本最低**
- 后续章节（无论顺序 / 并行）都要参考第 1 章的代码模式，所以它 =
  当次项目的"风格锚点（不强求章节间一致，但单章自身得有完整说服力）"

**做完后必须停下来**等用户验收：

```
封面 + 第 1 章 <id> 做完了，dev server 在 localhost:5173 运行。

验收重点：
  □ 封面：主标题 / 副标 / 讲者或出处齐全，第一帧就定调主题气质？
  □ 视觉气质对不对？符合 <theme nameZh> 的预期吗？
  □ 节奏对不对？某些步太快 / 太慢 / 信息太薄？
  □ 内容驱动动画是否到位？还是有几步是无脑入场动画？
  □ 双源原则：屏幕画面有没有"口播没念但 article 能挂"的细节？
  □ 生成插图（若有）：画风跟主题对得上吗？图里有没有跑出文字？
  □ 反 AI 味检查：紫粉渐变 / 圆角彩色边框 / 假插画 / emoji 是否有？

问题告诉我，我针对性改。OK 了告诉我"继续"，我按选定模式做第 2 章及之后。
```

▸ 用户说 OK 后回写 `outline.md` 进度看板：**CP-2 → ✅**，章节表
`00-cover` / `01-<id>` → ✅

### 2.3 第 2~N 章 —— 按选定模式

**所有模式下的共同规则**：每章独立按 [`CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
开发。**风格不强求章节间完全一致** —— 主题颜色 / 字体 token 兜底视觉
统一，动画 / 节奏 / 视觉演示由章节自由发挥是设计预期。

#### 模式 A · 默认 · 逐章确认

第 2 章做完 → 暂停验收 → OK → 第 3 章 → 暂停 → ... → 第 N 章。**每章
独立验收**，问题随时改，**风险最低，节奏最稳**。**用户不明确选模式时
默认走这个**。

▸ 每章验收通过就回写章节表该行 → ✅；全部 ✅ 后 **CP-3 → ✅**

#### 模式 B · 第 1 章后顺序开发

第 2 章 → 第 3 章 → ... → 第 N 章 **主线程顺序做完，最后统一验收**。
速度中等，适合 agent 不支持并行任务的环境。

▸ 每章做完先记 🔵（待验收），统一验收通过后一次刷成 ✅ + **CP-3 → ✅**

#### 模式 C · 第 1 章后并行开发（subagent）

用 subagent 把第 2~N 章并行做完，最大并行数由用户控制（"一次 4 章"
/ "一次 2 章"）。**最快，但风格各章会有差异** —— 这是预期，因为：

1. 每个 subagent 看不到别的 subagent 产出，无法机械对齐
2. 章节代码物理分离（每章一个文件夹 / 自己的 CSS 前缀），不会互相
   破坏
3. 主题 token 兜底视觉统一（颜色 / 字体 / hero 数字 / 卡片 / 分割线
   性格 / 装饰），气质不会跑偏
4. **风格不一致 = 人手写视频的呼吸感**（多 voice / 多视角）

并行 subagent 的 prompt 必须包含：

- 当前章节 outline 段落（含信息池 + **本章插图描述**，若有）
- `references/CHAPTER-CRAFT.md` 的路径（**单一必读** —— 视觉演示要求 +
  逐步揭示 + 双源原则 + 反 AI 味 + 代码红线 + 完工自检全部在这一份里）
- **本章有插图描述时**：`references/ILLUSTRATIONS.md` 的路径 + 主题
  `styleReference` 的实际文件路径（subagent 自己生成自己那几张图）
- 当前主题 `theme.json` 的 `descriptionZh` / `mood` / `bestFor`（参考气质
  即可，动画 / 时长 / 字号 / emoji 由 chapter agent 自由决定）
- **第 1 章代码作为"代码风格"参考**（不是"视觉抄袭对象"）
- **进度看板当前状态**（让 subagent 知道整体进行到哪）
- 包管理器：读 `presentation/.pm`（本项目是 pnpm 还是 npm）
- 硬规则：每章独立 CSS 前缀（`.cd-` / `.mg-` / `.wg-` / ...）；
  不修改 `chapters.ts`；**不写 `outline.md`**（进度看板由主线程回写，
  避免并发冲突）；完工跑 `pnpm exec tsc --noEmit`（或 `npx tsc --noEmit`）

▸ subagent 全部回报后由**主线程**统一回写章节表 + **CP-3 → ✅**

**重要**：无论选哪种模式，**用户随时可以中途切换模式**。第 2 章 OK
后用户说"剩下的并行" / "剩下的逐章" 都行。

### 2.4 实现单章（每章必走）

#### 2.4.0 插图素材准备（**只在本章 outline 写了「插图描述」时做**）

**动手写章节代码之前**先把图备齐：

1. 读 [`references/ILLUSTRATIONS.md`](references/ILLUSTRATIONS.md)
2. 先查主题 `theme.json` 的 `illustrations` 有没有现成的能命中，能用就用
3. 要生成的：以主题 `styleReference` 为画风锚，调当前 agent 的生图工具
   （Claude Code 用 ImageGen），产出到
   `presentation/public/illustrations/<chapter-id>/<slug>.png`
4. 调不到工具 / 生成失败 → 降级 placeholder 占位卡，**并在交付时明确
   告诉用户哪张没生成出来**
5. 回写 `outline.md` 素材清单：`🎨` → `✓`（或降级后的 `⚠️`）

#### 2.4.1 章节实现

详细指引见 [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) ——
**单一必读入口**，覆盖：封面规格 / 视觉演示要求 / 逐步揭示 / 内容取舍 /
双源原则 / 视频演示基本审美 / 反 AI 味 / 代码红线 / 完工自检。

**核心要点**（CHAPTER-CRAFT.md 详述）：

- **每章必须有 CSS / SVG / Canvas / JS 视觉演示**，禁纯文字章节 ——
  **生成插图不算数**，演示元素必须章节自己画
- **逐步揭示**：清单 / 列表必须 1 项 = 1 step，禁一次全展示
- **双源原则**：节奏跟口播稿（顺序不能乱），细节回原文章抽（信息池 +
  本章 article 段落）
- **主题角色素材**：`theme.json` 若声明 `illustrations`，只在该 step 确实
  描述人物行动 / 分工 / 情绪 / 协作时穿插；每个 scene 最多一张，角色
  服务叙事而不是充当固定角标或背景装饰
- **完工自检逐项过**，不达标回去改 —— 按上文「硬性自检协议」执行
  （优先 Agent Teams → subAgent → 自检），**改完再向用户汇报本章交付**

### 2.5 大改后 bump STORAGE_KEY

改动 `chapters.ts`（增加 / 删除 / 重排章节，或某章 `narrations.ts`
长度变化）后，**bump** `presentation/src/hooks/useStepper.ts` 的
`STORAGE_KEY`（如 `v4` → `v5`），避免持久化游标落到不存在的 step 上。

---

## Checkpoint Audio · CP-4 —— 是否合成音频（**硬节点**）

Phase 2 结束后必须停下来，问用户：

```
网页做完，封面 + {N} 章 {M} 步，dev server 在 localhost:5173 跑着。

要不要合成音频做"自动播放录屏"？
  ✓ 合成 → 扫所有章节的 narrations.ts 出 audio-segments.json，
           调 TTS provider 合成每步一个 mp3 到 public/audio/。
           合成完后用 ?auto=1 模式可以一镜到底录屏（音视频天然同步）。
           内置两个 provider：
             • minimax (mmx-cli)    —— 默认，中文音色稳
             • openai  (OPENAI_API_KEY) —— curl-based，多数已有 key
           其它后端 (ElevenLabs / edge-tts 免费 / macOS say 离线 /
           Azure / Google) 见 scripts/tts-providers/README.md 的现成片段。
  ✗ 不合成 → 跳过 Phase 3，直接 Phase 4 用手动录屏 + 后期配音。
```

要合成 → Phase 3。不合成 → 直接 Phase 4。

▸ 回写 `outline.md` 进度看板：**CP-4 → ✅**（不合成记 **⏭️**）

---

## Phase 3 —— 音频合成（可选）

详细流程见 [`references/AUDIO.md`](references/AUDIO.md)。简版
（`pnpm` 换成 `npm` 也行 —— 看 `presentation/.pm`）：

```bash
cd presentation
pnpm run extract-narrations   # 扫所有 narrations.ts → audio-segments.json
# 让用户扫一眼 audio-segments.json 确认文本对
pnpm run synthesize-audio                       # 默认 minimax provider，增量
# 或用内置 openai (要 OPENAI_API_KEY):
PRESENTATION_TTS=openai pnpm run synthesize-audio
# 或自定义：写一个 scripts/tts-providers/<name>.sh，见该目录的 README.md
```

合成完告诉用户：输出位置 / 总段数 / 哪些段时长异常（太长 = 该 step 拆
分；太短 = 文案太薄）—— 给最后一次校准节奏的机会。然后进入 Phase 4。

---

## Phase 4 —— 录屏 + 后期

详见 [`references/RECORDING.md`](references/RECORDING.md)。两种路径：

| 场景 | 推荐路径 |
|---|---|
| Phase 3 已合成音频 | **Auto 模式一镜到底**：浏览器开 `localhost:5173/?auto=1` → 按 SPACE → 整片自动播完 → 停录 → 裁头尾即成片，**无需后期对音轨** |
| Phase 3 跳过 | 默认 Manual 模式手动点击推进 → 后期任意剪辑工具配音 |

> agent 在 Phase 3 / Checkpoint Audio 后**主动告诉用户**适合的录屏路径。

▸ 告知后回写 `outline.md` 进度看板：**CP-5 → ✅**

---

## 十条原则（一句话清单）

完整展开见 [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
Part 0 —— **写章节时回那里查**，下面只是索引。

| # | 原则 | 一句话 |
|---|---|---|
| 1 | 16:9 固定舞台 | 内容 1920×1080 + transform scale，没有响应式 |
| 2 | 全局 step 计数器 | 章节是 step 的纯函数，无定时器 |
| 3 | 每步独占整屏 | `if (step === N) return <FullScene />` |
| 4 | 口播节拍 = step | 一节拍 = 一 step = 一聚焦想法 |
| 5 | 隐藏的边角控件 | 进度条 / 翻页器默认 opacity 0 |
| 6 | 舞台无 chrome | 没有 header / footer / 页码 / 品牌条 |
| 7 | **内容驱动动画** | 先找内在动作，找不到才入场动画兜底；持续微动慎用 |
| 8 | 多点逐个揭示 | 1 项 = 1 step，禁同步 stagger 上 N 项 |
| 9 | 整片同一主题 | 章节间不翻表面色；**颜色 / 字体走 token**，其它尺度章节自由 |
| 10 | 双源原则 | script 定节拍，**article 定画面密度**（落到信息池） |

---

## 常见用户反馈速查

简化表见 [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md)
Part 8「常见反馈速查」。**关键**：先定位是哪一层（节奏 / 视觉 / 内容
/ 代码），再改最小切片，**不要重做整章**。

---

## 相关资源

按"何时读"标注，避免一次性全读：

| 文件 | 何时读 | 内容 |
|---|---|---|
| [`references/SCRIPT-STYLE.md`](references/SCRIPT-STYLE.md) | Phase 1.2 必读 | 文章 → 口播稿规则、平台变体 |
| [`references/OUTLINE-FORMAT.md`](references/OUTLINE-FORMAT.md) | Phase 1.2 必读 · **接手时查进度看板** | outline.md 字段 spec、**进度看板**、`00-cover` 编号约定、命名约定、章节切分、信息池、**插图描述** |
| [`references/CHAPTER-CRAFT.md`](references/CHAPTER-CRAFT.md) | **Phase 2.4 每章单一必读入口** | Part 0 十条原则 / Part 1 开工 5 问 / Part 2 关系→动作决策树 / Part 3 视觉工具箱 / Part 4 时长 / Part 5 反 AI 味反模式 / Part 6 代码硬规则 / Part 7 完工自检 / Part 8 反馈速查 / **封面章节（00-cover）规格** |
| [`references/ILLUSTRATIONS.md`](references/ILLUSTRATIONS.md) | **该章 outline 写了「插图描述」时必读** | 该生成什么 / 不该生成什么、以主题 `styleReference` 为画风锚的 prompt 配方、输出路径、调不到生图工具时的 placeholder 降级 |
| [`references/EXAMPLES/`](references/EXAMPLES/) | **可选** —— 看结构 | 章节结构示意（hook / list-reveal / case-tech-review）；**不是抄袭模板** |
| [`references/THEMES.md`](references/THEMES.md) | 选 / 造 / 切主题时 | 完整 token 契约 + 内置主题清单 + 创作流程 |
| [`references/AUDIO.md`](references/AUDIO.md) | Phase 3 才读 | provider-agnostic 音频合成流程、内置 minimax 用法、换 provider 路径、故障排查 |
| [`templates/scripts/tts-providers/README.md`](templates/scripts/tts-providers/README.md) | 换 / 加 TTS provider 时 | 三函数契约 + 内置 2 个 (minimax / openai) + 5 种现成代码片段（ElevenLabs / edge-tts / macOS say / Azure / Google） |
| [`references/RECORDING.md`](references/RECORDING.md) | Phase 4 才读 | 录屏工具 + 后期合成 |
| [`themes/`](themes) | Checkpoint Plan / Phase 1.2 时翻 | 内置主题（含 `theme.json` + `tokens.css` + 可选 `assets/`）。当前只有 `we-bare-bears`，要别的气质照 THEMES.md 派生 |
| [`scripts/scaffold.sh`](scripts/scaffold.sh) | Phase 2.1 跑一次 | 一键项目脚手架（pnpm 优先 / npm 后备，`--pm=` 可强制） |
