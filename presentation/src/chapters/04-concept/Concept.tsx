import type { ChapterStepProps } from "../../registry/types";
import { BrandIcon, FolderIcon } from "../../components/VisualIcons";
import "./Concept.css";

export default function Concept({step}:ChapterStepProps){
  if(step===0)return <div className="ct-scene ct-hook scene-pad"><div className="ct-folder-stack"><i/><i/><i/></div><p>剛剛那些切換代價</p><h1>worktree<br/><span>就是為了這件事。</span></h1><div className="ct-underline"/></div>;
  if(step===1)return <div className="ct-scene ct-definition scene-pad"><div className="ct-def-copy"><p>Git 官方定義</p><h1>一個 repository<br/>管理<span>多個 working tree</span></h1><small>git-scm.com/docs/git-worktree</small></div><div className="ct-horizontal"><div className="ct-repo-core card"><BrandIcon name="git"/><span>repository</span></div><svg viewBox="0 0 1050 500"><path pathLength="1" d="M280 250 H470 M470 80 V420 M470 80 H620 M470 250 H620 M470 420 H620"/></svg><div className="ct-folder-row">{["main","feature","hotfix"].map((x,i)=><div className="ct-tree card" style={{animationDelay:`${i*130}ms`}} key={x}><FolderIcon/><span>{x}</span><small>working tree</small></div>)}</div></div></div>;
  if(step===2)return <div className="ct-scene ct-concept-overview scene-pad"><img className="ct-concept-art" src={`${import.meta.env.BASE_URL}illustrations/concept/worktree-concept-overview.png`} alt="一份共享的 .git 延伸出 main、feature/login、hotfix 三個獨立 worktree 工作目錄"/></div>;
  if(step===3)return <div className="ct-scene ct-materialize scene-pad"><p>好懂的心智模型</p><h1>把分支<br/><span>實體化成另一個資料夾。</span></h1><div className="ct-material-demo"><div className="ct-ref">feature/login<i/></div><div className="ct-arrow">→</div><div className="ct-big-folder card"><span>project-feature/</span><i/><i/><i/><i/></div></div></div>;
  if(step===4)return <div className="ct-scene ct-correction scene-pad"><div className="ct-correction-title"><p>但不要把比喻當成嚴格定義</p><h1>branch 仍是 ref；worktree 是工作目錄＋獨立狀態。</h1></div><div className="ct-correct-grid"><article><span>BRANCH</span><strong>一個 ref</strong><div className="ct-pointer"><i/><b>commit</b></div></article><article><span>WORKTREE</span><strong>working directory</strong><div className="ct-equation"><b>檔案</b><em>＋</em><b>HEAD</b><em>＋</em><b>index</b></div></article></div></div>;
  return null;
}
