import type { ChapterStepProps } from "../../registry/types";
import { BranchIcon, BrandIcon, FolderIcon, type BrandName } from "../../components/VisualIcons";
import "./AgentIsolation.css";

const screenshot = `${import.meta.env.BASE_URL}screenshots/agent/claude-worktree.png`;

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

  if (step === 3) return (
    <div className="ai-scene ai-claude scene-pad">
      <div className="ai-claude-copy"><BrandIcon name="claude" /><p>CLAUDE CODE</p><h1>建立任務時，<br /><span>直接勾 worktree。</span></h1><strong>Project + main branch 保留在原地</strong></div>
      <div className="ai-claude-right">
        {/* 標註畫在 viewBox = 截圖原生尺寸（934×637）的圖層裡，直接用截圖自己的
            像素座標下筆，才會真的落在工具列那顆「☑ worktree」上。 */}
        <div className="ai-shot card">
          <img src={screenshot} alt="Claude Code 建立任務畫面，工具列的 worktree 選項被標示出來" />
          <svg className="ai-marks" viewBox="0 0 934 637" preserveAspectRatio="none">
            <defs>
              <marker id="ai-head" viewBox="0 0 12 12" refX="10" refY="6" markerUnits="userSpaceOnUse" markerWidth="17" markerHeight="17" orient="auto">
                <path className="ai-head-fill" d="M1 1 L11 6 L1 11 Z" />
              </marker>
            </defs>
            <rect className="ai-mark-box" x="309" y="513" width="90" height="31" rx="7" />
            <path className="ai-mark-lead" pathLength="1" markerEnd="url(#ai-head)" d="M556 528 H410" />
            <g className="ai-mark-chip"><rect x="560" y="506" width="228" height="45" rx="11" /><text x="674" y="537">勾這一個</text></g>
          </svg>
        </div>
        {/* 那顆 checkbox 只有 90×31 原生像素，錄影時根本看不清楚 —— 用同一張圖
            放大 2.8 倍、只開一個工具列大小的視窗做局部放大鏡。 */}
        <div className="ai-zoom">
          <div className="ai-zoom-window"><img src={screenshot} alt="" aria-hidden="true" /></div>
          <span>建立任務時就能勾選</span>
        </div>
      </div>
    </div>
  );

  return null;
}
