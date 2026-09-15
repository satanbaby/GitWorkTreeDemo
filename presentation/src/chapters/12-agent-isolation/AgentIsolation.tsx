import type { CSSProperties, ReactNode } from "react";
import type { ChapterStepProps } from "../../registry/types";
import { BranchIcon, BrandIcon, FolderIcon, type BrandName } from "../../components/VisualIcons";
import "./AgentIsolation.css";

const shot = (file: string) => `${import.meta.env.BASE_URL}screenshots/agent/${file}`;

const taskAgents: { task: string; folder: string; brand: BrandName }[] = [
  { task: "task 01", folder: "workitem-1/", brand: "codex" },
  { task: "task 02", folder: "workitem-2/", brand: "claude" },
  { task: "task 03", folder: "workitem-3/", brand: "copilot" },
];

function TaskFolder({ task, folder, brand, delay = 0 }: { task: string; folder: string; brand: BrandName; delay?: number }) {
  return (
    <article className="ai-task-folder card" style={{ animationDelay: `${delay}ms` }}>
      <div className="ai-task-agent"><BrandIcon name={brand} /><span>{task}</span></div>
      <FolderIcon className="ai-folder-icon" />
      <strong>{folder}</strong>
    </article>
  );
}

/**
 * 三家 coding agent 的「開任務時就選 worktree」都是同一種畫面：一張原始截圖
 * ＋ 一個標到那顆開關上的框 ＋ 一個局部放大鏡。差別只有截圖跟座標，所以做成
 * 一份 spec 餵同一個 <ToolShot>，不要複製三次 markup。
 *
 * 座標全部寫「截圖自己的原生像素」——標註 SVG 的 viewBox 就設成截圖尺寸，
 * 才能直接照著圖量、量到哪畫到哪，不用換算。
 */
type ToolShot = {
  brand: BrandName;
  kicker: string;
  headline: ReactNode;
  note: string;
  src: string;
  alt: string;
  /** 截圖原生尺寸，同時是標註 SVG 的 viewBox 與 .ai-shot 的 aspect-ratio */
  natural: { w: number; h: number };
  /** 框住那顆開關 */
  mark: { x: number; y: number; w: number; h: number };
  /** 指示線：從 chip 那頭畫到 mark 這頭，箭頭在 to 端 */
  lead: string;
  /** 說明標籤，text 置中在 rect 中央 */
  chip: { x: number; y: number; w: number; h: number; text: string };
  /** 局部放大鏡：擷取原圖 (x, y, w, h) 這塊，放大 scale 倍 */
  zoom: { x: number; y: number; w: number; h: number; scale: number; caption: string };
};

const TOOL_SHOTS: ToolShot[] = [
  {
    brand: "claude",
    kicker: "CLAUDE CODE",
    headline: <>建立任務時，<br /><span>直接勾 worktree。</span></>,
    note: "Project + main branch 保留在原地",
    src: shot("claude-worktree-hd.png"),
    alt: "Claude Code 建立任務畫面，工具列的 worktree 選項被標示出來",
    natural: { w: 934, h: 637 },
    mark: { x: 309, y: 513, w: 90, h: 31 },
    lead: "M556 528 H410",
    chip: { x: 560, y: 506, w: 228, h: 45, text: "勾這一個" },
    zoom: { x: 85, y: 508, w: 345, h: 40, scale: 2.8, caption: "建立任務時就能勾選" },
  },
  {
    brand: "codex",
    kicker: "CODEX",
    headline: <>工作位置選單，<br /><span>切成本機工作樹。</span></>,
    note: "同一個 repo，換一個資料夾落地",
    src: shot("codex-worktree-hd.png"),
    alt: "Codex 的工作位置選單，「新增本機工作樹」被標示出來",
    natural: { w: 663, h: 337 },
    mark: { x: 128, y: 93, w: 168, h: 27 },
    lead: "M400 107 H306",
    chip: { x: 404, y: 90, w: 112, h: 33, text: "選這一個" },
    zoom: { x: 118, y: 88, w: 188, h: 36, scale: 4.8, caption: "工作位置 → 新增本機工作樹" },
  },
  {
    brand: "copilot",
    kicker: "GITHUB COPILOT",
    headline: <>送出任務前，<br /><span>勾新增工作樹。</span></>,
    note: "Agent 動工前就先分到自己的資料夾",
    src: shot("copilot-worktree-hd.png"),
    alt: "GitHub Copilot 的輸入框，底下的「新增工作樹」勾選項被標示出來",
    natural: { w: 491, h: 218 },
    mark: { x: 332, y: 169, w: 86, h: 25 },
    lead: "M375 131 V159",
    chip: { x: 333, y: 100, w: 84, h: 27, text: "勾這一個" },
    zoom: { x: 280, y: 165, w: 205, h: 33, scale: 4.7, caption: "送出前先勾起來" },
  },
];

function ToolShot({ spec }: { spec: ToolShot }) {
  const { natural, mark, chip, zoom } = spec;
  // 三張截圖原生寬度差很多（934 / 663 / 491），但在版面上都是同一個欄寬。
  // 線寬與字級寫在 viewBox 座標裡會跟著縮放，所以統一除以基準寬換算回
  // 「畫面上看起來一樣粗」。
  const k = natural.w / 934;
  const markStyle = {
    "--k": k,
    "--mark-origin": `${mark.x + mark.w / 2}px ${mark.y + mark.h / 2}px`,
  } as CSSProperties;
  // PrintView 會把每一步同時掛在同一份 document 裡，三張圖的 marker 不能共用
  // 同一個 id，否則後兩張會沿用第一張的箭頭尺寸。
  const headId = `ai-head-${spec.brand}`;
  const zoomStyle = {
    "--zoom-w": `${zoom.w * zoom.scale}px`,
    "--zoom-h": `${zoom.h * zoom.scale}px`,
    "--zoom-img-w": `${natural.w * zoom.scale}px`,
    "--zoom-left": `${-zoom.x * zoom.scale}px`,
    "--zoom-top": `${-zoom.y * zoom.scale}px`,
  } as CSSProperties;

  return (
    <div className="ai-scene ai-claude scene-pad">
      <div className="ai-claude-copy">
        <BrandIcon name={spec.brand} />
        <p>{spec.kicker}</p>
        <h1>{spec.headline}</h1>
        <strong>{spec.note}</strong>
      </div>
      <div className="ai-claude-right">
        <div className="ai-shot card" style={{ aspectRatio: `${natural.w} / ${natural.h}` }}>
          <img src={spec.src} alt={spec.alt} />
          <svg className="ai-marks" style={markStyle} viewBox={`0 0 ${natural.w} ${natural.h}`} preserveAspectRatio="none">
            <defs>
              <marker id={headId} viewBox="0 0 12 12" refX="10" refY="6" markerUnits="userSpaceOnUse" markerWidth={17 * k} markerHeight={17 * k} orient="auto">
                <path className="ai-head-fill" d="M1 1 L11 6 L1 11 Z" />
              </marker>
            </defs>
            <rect className="ai-mark-box" x={mark.x} y={mark.y} width={mark.w} height={mark.h} rx={7 * k} />
            <path className="ai-mark-lead" pathLength="1" markerEnd={`url(#${headId})`} d={spec.lead} />
            <g className="ai-mark-chip">
              <rect x={chip.x} y={chip.y} width={chip.w} height={chip.h} rx={11 * k} />
              <text x={chip.x + chip.w / 2} y={chip.y + chip.h / 2 + 9 * k}>{chip.text}</text>
            </g>
          </svg>
        </div>
        {/* 那顆開關在原生像素下只有幾十 px 寬，錄影時根本看不清楚 ——
            用同一張圖放大、只開一個開關大小的視窗做局部放大鏡。 */}
        <div className="ai-zoom" style={zoomStyle}>
          <div className="ai-zoom-window"><img src={spec.src} alt="" aria-hidden="true" /></div>
          <span>{zoom.caption}</span>
        </div>
      </div>
    </div>
  );
}

export default function AgentIsolation({ step }: ChapterStepProps) {
  if (step === 0) return (
    <div className="ai-scene ai-solution scene-pad">
      <p>THE ISOLATION UNIT</p>
      <h1>1 個 task，<span>1 顆 worktree。</span></h1>
      <div className="ai-task-grid">
        {taskAgents.map((item, index) => <TaskFolder {...item} delay={index * 130} key={item.task} />)}
      </div>
      <div className="ai-rule"><i /><strong>每個 agent，都落在自己的資料夾</strong><i /></div>
    </div>
  );

  if (step === 1) return (
    <div className="ai-scene ai-layers scene-pad">
      <p>ISOLATED FOLDERS · SHARED HISTORY</p>
      <h1>現場各自隔離，<span>歷史仍是同一份。</span></h1>
      <div className="ai-layer-demo">
        <div className="ai-worktree-row">
          {taskAgents.map((item, index) => <TaskFolder {...item} delay={index * 120} key={item.task} />)}
        </div>
        <div className="ai-shared-history card">
          <BrandIcon name="git" />
          <div><b>SHARED GIT HISTORY</b><span>objects · refs</span></div>
          <div className="ai-commits"><i /><i /><i /><i /><i /></div>
        </div>
        <svg viewBox="0 0 1500 520" aria-hidden="true"><path pathLength="1" d="M230 70 V220 H750 M750 70 V420 M1270 70 V220 H750" /></svg>
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="ai-scene ai-discard scene-pad">
      <p>REMOVE WORKTREE ≠ DELETE BRANCH</p>
      <h1>資料夾移掉，<span>branch 還在。</span></h1>
      <div className="ai-separate-demo">
        <article className="ai-folder-removal card">
          <span>WORKTREE FOLDER</span>
          <FolderIcon />
          <strong>failed-task/</strong>
          <b>REMOVED</b>
        </article>
        <div className="ai-separate-link"><i /><strong>≠</strong><i /></div>
        <article className="ai-branch-remains card">
          <span>BRANCH REF</span>
          <BranchIcon />
          <strong>failed/task</strong>
          <b>STILL HERE</b>
        </article>
      </div>
      <div className="ai-main-safe"><strong>main worktree</strong><span>clean · untouched</span></div>
    </div>
  );

  const toolShot = TOOL_SHOTS[step - 3];
  if (toolShot) return <ToolShot spec={toolShot} key={toolShot.brand} />;

  return null;
}
