import type { ChapterStepProps } from "../../registry/types";
import "./CmdManage.css";

const Cmd=({children}:{children:React.ReactNode})=><div className="cm-cmd">$ {children}</div>;
const Folder=({label,className=""}:{label:string;className?:string})=><div className={`cm-folder card ${className}`}><b>{label}</b><div><i/><i/><i/></div></div>;

export default function CmdManage({step}:ChapterStepProps){
 if(step===0)return <div className="cm-scene cm-index scene-pad"><h1>用完要收。</h1><p>兩個動作，一個一個看。</p><div className="cm-wheel">{["worktree remove","branch -d"].map((x,i)=><div key={x} style={{transform:`rotate(${i*180}deg) translateY(-250px) rotate(${-i*180}deg)`,animationDelay:`${i*100}ms`}}>{x}</div>)}<b>worktree</b></div></div>;
 if(step===1)return <div className="cm-scene cm-remove scene-pad"><p>01 · REMOVE</p><h1>先確認<span>變更已保存。</span></h1><Cmd>git worktree remove ../project-hotfix</Cmd><div className="cm-remove-demo"><Folder label="project-hotfix/"/><div className="cm-gate"><strong>REFUSED</strong><span>modified files<br/>untracked files</span><i/></div><div className="cm-clean"><b>CLEAN</b><span>commit or stash first</span></div></div></div>;
 if(step===2)return <div className="cm-scene cm-branch scene-pad"><p>02 · TWO SEPARATE ACTIONS</p><h1>移除 worktree<br/><span>不等於刪 branch。</span></h1><div className="cm-two-actions"><div><Folder label="../project-hotfix" className="cm-fade-folder"/><Cmd>git worktree remove</Cmd><strong>WORKTREE　GONE</strong></div><div className="cm-not-equal">≠</div><div><div className="cm-branch-line"><i/><b>hotfix/payment-timeout</b></div><Cmd>git branch -d</Cmd><strong>MERGED FIRST</strong></div></div></div>;
 return null;
}
