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
      <div className="ai-shot card"><img src={screenshot} alt="Claude Code 建立任務畫面，顯示 worktree 選項" /><div className="ai-focus"><i /><span>worktree</span></div></div>
    </div>
  );

  return null;
}
