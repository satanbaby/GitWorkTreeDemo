# Web Video Presentation Skill

**A method-driven agent skill for turning scripts and articles into click-driven 16:9 web presentations that can be screen-recorded as cinematic videos.**

[中文文档](./README.zh-CN.md) · [Back to collection root](../../README.md)

![Web Video Presentation Skill](https://cdn.jsdelivr.net/gh/ConardLi/assets@main/imgs/web-video-presentation-skill.webp)

---

## What Is This?

`web-video-presentation` helps an agent build a Vite + React + TypeScript presentation that behaves like a video production surface rather than a slide deck. Each click advances one narration beat, each step owns the whole 1920×1080 stage, and the progress UI stays hidden unless hovered so the output is clean for screen recording.

It is designed for:

- Turning a written article into a Bilibili / YouTube / video-channel narration script
- Turning an existing voiceover script into a cinematic web presentation
- Building product demos, tutorials, keynote-style explainers, and visual talks
- Creating “dynamic PPT, but not PPT” experiences with strong motion and pacing
- Optionally synthesizing narration audio after the visual outline is approved

The skill is primarily a **methodology and collaboration workflow**. The scaffold supplies reusable tokens, stage primitives, themes, and examples, but each project should still choose a visual language that fits the topic.

---

## Core Ideas

- **Fixed 16:9 stage** — content is authored in a stable 1920×1080 coordinate system and scaled to the viewport.
- **One global step cursor** — click or keyboard advances `(chapter, step)`, with the cursor persisted locally.
- **One step, one idea** — every beat gets a focused full-screen scene instead of accumulating slide bullets.
- **Script beats drive structure** — narration rhythm maps directly to visual steps.
- **Hidden chrome** — progress controls are hover-only, keeping recordings clean.
- **Motion first** — each scene needs a moving visual anchor; static paragraphs are treated as a smell.
- **Theme tokens** — visual decisions flow through semantic tokens so themes can change the whole feel.
- **Pluggable TTS** — provider-agnostic audio runner ships **two built-in providers** (MiniMax `mmx-cli` and OpenAI TTS via curl); swap to ElevenLabs / edge-tts / Azure / Google Cloud / macOS `say` / any self-hosted TTS by dropping a single shell file into `tts-providers/`.
- **Hard checkpoints, externalized** — the agent pauses at fixed gates, and every gate's status lives in a **progress board at the top of `outline.md`** so a new session, a resumed session, or a parallel subagent can all tell where things stand.
- **Cover chapter is mandatory** — `00-cover` is built in the main thread together with chapter 1 and accepted as one batch; content chapters start at `01-`.
- **Optional generated illustrations** — a chapter can declare an illustration description in the outline; before that chapter is built the agent calls its image-generation tool, anchored to the theme's `styleReference` so every image shares one visual language.
- **pnpm first, npm fallback** — the scaffold detects the package manager, records the choice in `<project>/.pm`, and `--pm=` forces either one.

---

## Workflow

```text
Phase 1.1  Identify input
Phase 1.2  Article -> narration script + outline.md (with progress board)
   |
CP-0       Self-review of script.md / outline.md
   |
CP-1       Checkpoint Plan: script / outline / theme / assets / dev mode
   |
Phase 2.1  Scaffold the Vite / React / TS project
Phase 2.2  Cover (00-cover) + chapter 1, main thread
   |
CP-2       User accepts cover + chapter 1  <- cannot be skipped
   |
Phase 2.3  Chapters 2..N (per-chapter / sequential / parallel)
   |
CP-3       Chapters 2..N accepted
   |
CP-4       Checkpoint Audio: synthesize or skip
   |
Phase 3    Optional audio synthesis
Phase 4    Recording and post-production -> CP-5
```

The checkpoints are part of the skill contract: the agent should not silently rush from raw article to finished code. Each gate is written back to the progress board in `outline.md` the moment it is passed — status that only exists in the chat is treated as no status at all.

---

## What It Ships

```text
skills/web-video-presentation/
├── SKILL.md
├── README.md / README.zh-CN.md
├── references/
│   ├── CHAPTER-CRAFT.md       # single required read per chapter
│   ├── OUTLINE-FORMAT.md      # progress board + outline spec
│   ├── SCRIPT-STYLE.md
│   ├── ILLUSTRATIONS.md       # generated-illustration workflow
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
│   │   └── tts-providers/            # 1 file = 1 TTS backend
│   │       ├── README.md             # contract + ready-to-paste ElevenLabs / edge-tts / Azure / Google / say snippets
│   │       ├── minimax.sh            # default — uses mmx-cli
│   │       └── openai.sh             # built-in — uses OPENAI_API_KEY via curl
│   └── src/
└── themes/                    # 1 built-in theme (derive more from it)
    └── we-bare-bears/
        ├── theme.json         # metadata + illustrations + styleReference
        ├── tokens.css
        └── assets/            # 3 character images + 1 style reference
```

---

## Quick Start

Copy the skill into the directory your agent scans, then ask it to turn a script or article into a web-video presentation.

To scaffold manually from inside a project:

```bash
bash skills/web-video-presentation/scripts/scaffold.sh ./presentation --theme=we-bare-bears
```

List available themes:

```bash
bash skills/web-video-presentation/scripts/scaffold.sh --list-themes
```

The generated `presentation/` project is a normal Vite + React + TypeScript app. Run it like any other Vite project, then record the 16:9 stage with your screen recorder.

---

## Theme Gallery

The skill ships **1 built-in theme**. Earlier versions shipped 24; the set was
deliberately collapsed to a single well-maintained theme, because deriving a new
one is cheap — copy the folder, edit `tokens.css` and `theme.json`, done.

### `we-bare-bears`

Cozy storybook warmth: creamy paper, one sky-blue accent, honey-tan neutrals,
rounded Nunito type. The signature is **rounded paper cards with 2px charcoal
hand-inked outlines and an offset pale-blue shadow**.

**Best for** team collaboration / Git tutorials · beginner-friendly technical
talks · workflow and tooling explainers · approachable knowledge content.

It also ships an `assets/` pack: three character illustrations plus a
**style reference frame** that doubles as the cover layout blueprint and the
art-direction anchor for generated illustrations.

- Metadata: [`themes/we-bare-bears/theme.json`](themes/we-bare-bears/theme.json)
- Tokens: [`themes/we-bare-bears/tokens.css`](themes/we-bare-bears/tokens.css)
- Creating your own: [`references/THEMES.md`](references/THEMES.md)

---

## Reference Map

- [CHAPTER-CRAFT.md](./references/CHAPTER-CRAFT.md) — the single required read per chapter: cover spec, ten principles, visual-demo floor, anti-AI patterns, code red lines, completion checklist
- [OUTLINE-FORMAT.md](./references/OUTLINE-FORMAT.md) — outline structure: progress board, `00-cover` numbering, info pool, optional illustration descriptions
- [SCRIPT-STYLE.md](./references/SCRIPT-STYLE.md) — article-to-narration rewrite guidance
- [ILLUSTRATIONS.md](./references/ILLUSTRATIONS.md) — when to generate an illustration, prompt recipe anchored to the theme's `styleReference`, output paths, placeholder fallback
- [THEMES.md](./references/THEMES.md) — full token contract and how to derive a new theme
- [EXAMPLES/](./references/EXAMPLES/) — optional chapter structure anchors (not copy-paste templates)
- [AUDIO.md](./references/AUDIO.md) — optional narration synthesis workflow (provider-agnostic)
- [tts-providers/README.md](./templates/scripts/tts-providers/README.md) — TTS provider contract + 2 built-ins (minimax / openai) + ready-to-paste snippets for ElevenLabs / edge-tts / Azure / Google Cloud / macOS say
- [RECORDING.md](./references/RECORDING.md) — screen recording and post-production notes

