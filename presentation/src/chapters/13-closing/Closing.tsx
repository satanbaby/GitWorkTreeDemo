import type { ChapterStepProps } from "../../registry/types";
import { BrandIcon, FolderIcon, type BrandName } from "../../components/VisualIcons";
import "./Closing.css";

const parallelAgents: { task: string; brand: BrandName; name: string }[] = [
  { task: "TASK A", brand: "codex", name: "CODEX" },
  { task: "TASK B", brand: "claude", name: "CLAUDE" },
  { task: "TASK C", brand: "copilot", name: "COPILOT" },
];

export default function Closing({step}:ChapterStepProps){
 if(step===0)return <div className="cl-scene cl-not-always scene-pad"><div className="cl-hammer"><i/><b>WORKTREE</b></div><h1>不是每個任務<br/><span>都要用。</span></h1><div className="cl-line"/></div>;
 if(step===1)return <div className="cl-scene cl-branch-enough scene-pad"><p>SMALL · SEQUENTIAL</p><h1>小功能、沒並行？<br/><span>普通 branch 就夠。</span></h1><div className="cl-simple"><div className="cl-branch-line"><i/><i/><i/><i/></div><div className="cl-small-change card"><b>one small change</b><span>edit → commit → merge</span></div></div><div className="cl-enough">KEEP IT SIMPLE</div></div>;
 if(step===2)return <div className="cl-scene cl-signals scene-pad"><p>SIGNAL 01</p><h1>切換很貴，<span>現場要同時活著。</span></h1><div className="cl-env-row">{[["FEATURE","localhost:4100"],["HOTFIX","localhost:4200"],["REVIEW","localhost:4300"]].map(([a,b],i)=><article className="cl-env card" key={a} style={{animationDelay:`${i*140}ms`}}><b>{a}</b><div className="cl-screen"><i/><i/><i/></div><span>{b}</span></article>)}</div><div className="cl-live-wire"><i/><i/><i/></div></div>;
 if(step===3)return <div className="cl-scene cl-agent-value scene-pad"><p>SIGNAL 02</p><h1>Agent 要並行？<br/><span>一個 task 一個現場。</span></h1><div className="cl-agent-grid">{parallelAgents.map((agent,i)=><div className="cl-agent-unit" key={agent.task} style={{animationDelay:`${i*130}ms`}}><div className="cl-agent-head"><BrandIcon name={agent.brand}/></div><b>{agent.name} · {agent.task}</b><div className="cl-agent-tree card"><FolderIcon/><span>worktree</span></div></div>)}</div><div className="cl-shared-base"><b>ONE GIT HISTORY</b><i/></div></div>;
 if(step===4)return <div className="cl-scene cl-action scene-pad"><p>TRY IT ON REAL WORK</p><h1>挑一個手上的專案，<br/><span>開一棵 worktree。</span></h1><div className="cl-terminal card"><div><i/><i/><i/></div><code>$ git worktree add -b try/worktree ../project-try main</code><span>Preparing worktree (new branch 'try/worktree')</span><strong>HEAD is now ready</strong></div><div className="cl-path"><b>project/</b><i>→</i><b>project-try/</b></div><div className="cl-final-line">今天，就試一次。</div></div>;
 return null;
}
