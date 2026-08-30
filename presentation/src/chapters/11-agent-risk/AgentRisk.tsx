import type { ChapterStepProps } from "../../registry/types";
import { BrandIcon, FolderIcon, type BrandName } from "../../components/VisualIcons";
import "./AgentRisk.css";

const illustration = (name: string) =>
  `${import.meta.env.BASE_URL}illustrations/agent-risk/${name}`;

const agents: { name: string; brand: BrandName; workitem: string }[] = [
  { name: "CODEX 1", brand: "codex", workitem: "workitem 1" },
  { name: "CODEX 2", brand: "codex", workitem: "workitem 2" },
  { name: "CLAUDE", brand: "claude", workitem: "workitem 3" },
  { name: "COPILOT", brand: "copilot", workitem: "workitem 4" },
];

export default function AgentRisk({ step }: ChapterStepProps) {
  if (step === 0) return (
    <div className="ar-scene ar-brand-intro scene-pad">
      <div className="ar-brand-copy">
        <p>PARALLEL CODING</p>
        <h1>Coding<br /><span>Agent</span></h1>
        <strong>不同 agent，同一個並行問題。</strong>
      </div>
      <div className="ar-brand-stage">
        {(["claude", "codex", "copilot"] as BrandName[]).map((brand, index) => (
          <article className="ar-brand-mark card" style={{ animationDelay: `${index * 140}ms` }} key={brand}>
            <BrandIcon name={brand} />
            <span>{brand === "copilot" ? "COPILOT" : brand.toUpperCase()}</span>
          </article>
        ))}
        <svg viewBox="0 0 920 690" aria-hidden="true"><path pathLength="1" d="M140 470 C300 560 630 560 790 470" /></svg>
      </div>
    </div>
  );

  if (step === 1) return (
    <div className="ar-scene ar-many scene-pad">
      <p>FOUR AGENTS · ONE DIRECTORY</p>
      <h1>各自接任務，<span>最後卻寫進同一個現場。</span></h1>
      <div className="ar-agent-grid">
        {agents.map((agent, index) => (
          <article className="ar-agent-card card" style={{ animationDelay: `${index * 110}ms` }} key={agent.name}>
            <BrandIcon name={agent.brand} />
            <strong>{agent.name}</strong>
            <span>{agent.workitem}</span>
          </article>
        ))}
      </div>
      <div className="ar-shared-target card">
        <FolderIcon />
        <div><span>SHARED</span><strong>project/</strong></div>
      </div>
      <svg className="ar-agent-lines" viewBox="0 0 1500 500" aria-hidden="true">
        <path pathLength="1" d="M170 80 C250 260 600 260 680 410" />
        <path pathLength="1" d="M550 80 C570 260 680 300 720 410" />
        <path pathLength="1" d="M950 80 C930 260 820 300 780 410" />
        <path pathLength="1" d="M1330 80 C1250 260 900 260 820 410" />
      </svg>
    </div>
  );

  if (step === 2) return (
    <div className="ar-scene ar-conflict scene-pad">
      <div className="ar-conflict-copy">
        <p>COLLISION RESULT</p>
        <h1>互相覆蓋，<br /><span>測試結果被污染。</span></h1>
        <div className="ar-conflict-badges"><strong>same folder</strong><strong>mixed output</strong></div>
      </div>
      <img src={illustration("shared-folder-conflict.png")} alt="四位熊熊 coding agent 同時修改中央同一個專案資料夾，造成檔案覆蓋與測試混亂" />
      <div className="ar-owner card"><span>OWNER</span><strong>unknown</strong><i /></div>
    </div>
  );

  return null;
}
