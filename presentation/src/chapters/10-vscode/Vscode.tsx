import type { ReactNode } from "react";
import type { ChapterStepProps } from "../../registry/types";
import { BrandIcon } from "../../components/VisualIcons";
import "./Vscode.css";

const asset = (name: string) => `${import.meta.env.BASE_URL}screenshots/vscode/${name}`;

/**
 * Natural pixel size of every screenshot in this chapter.
 *
 * The shot box is locked to the image's own aspect ratio so `object-fit:
 * contain` fills it edge to edge with no letterboxing. That is the whole
 * trick behind the callouts below: once the box IS the image, an overlay
 * can be authored in the screenshot's own pixel coordinates and is
 * guaranteed to land on the thing it points at, at any stage scale.
 */
const SHOT_SIZE: Record<string, [number, number]> = {
  "extension.png": [1374, 1103],
  "step1.png": [1455, 900],
  "step2.png": [1455, 900],
  "step3.png": [1455, 900],
  "step4.png": [1459, 901],
  "step5.png": [1931, 1192],
  "step6.png": [1867, 1288],
  "step7.png": [1876, 1307],
  "step8.png": [1455, 900],
  "step9.png": [1455, 900],
};

function Shot({ name, alt, className = "", children }: {
  name: string; alt: string; className?: string; children?: ReactNode;
}) {
  const [w, h] = SHOT_SIZE[name] ?? [16, 9];
  return (
    <div className={`vs-shot card ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <img src={asset(name)} alt={alt} />
      {children ? <svg className="vs-marks" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">{children}</svg> : null}
    </div>
  );
}

export default function Vscode({ step }: ChapterStepProps) {
 if(step===0)return <div className="vs-scene vs-no-memory scene-pad"><div className="vs-command-cloud">{["list","add -b","remove","move","repair","prune","lock"].map((x,i)=><span key={x} style={{animationDelay:`${i*70}ms`}}>{x}</span>)}</div><div className="vs-editor-shape"><BrandIcon name="vscode" className="vs-editor-icon"/><b>VS CODE</b><span>WORKTREE MANAGER</span></div><h1><del>背指令</del><br/><span>交給擴充套件。</span></h1></div>;
 if(step===1)return <div className="vs-scene vs-market scene-pad"><div className="vs-market-copy"><p>EXTENSION</p><h1>Git Worktree<br/><span>Manager</span></h1><div className="vs-id">jackiotyu.git-worktree-manager</div><div className="vs-meta"><b>v3.25.0</b><b>MIT</b><b>44k downloads</b></div></div><Shot name="extension.png" alt="Git Worktree Manager 的 Visual Studio Marketplace 頁面"/></div>;
 if(step===2)return <div className="vs-scene vs-create scene-pad"><p>CREATE A WORKTREE</p><h1>新增 → 新分支 → <span>基準分支</span></h1><div className="vs-two-shots"><Shot name="step1.png" alt="在 Git Worktree Manager 選擇建立新分支"/><div className="vs-flow-arrow">→</div><Shot name="step2.png" alt="選擇建立新分支的基準分支"/></div><div className="vs-step-tags"><b>01 建立新分支</b><b>02 選 main / feature 基準</b></div></div>;

 // 目錄輸入框在 step3.png 裡的實際位置：x 303→1152, y 56→96（原圖 1455×900）。
 // 舊版是一個 position:absolute 的空 div，量的是「被 letterbox 過的容器」而不是
 // 圖片本身，所以框永遠落在截圖上方的空白處。改成畫在圖片座標系裡。
 if(step===3)return <div className="vs-scene vs-directory scene-pad"><div className="vs-directory-copy"><p>CHOOSE DIRECTORY</p><h1>放在專案同一層，<br/><span>&lt;repo&gt;.worktrees/</span></h1><div className="vs-path-parts"><b>Test</b><i>→</i><b>Test.worktrees</b><i>→</i><b>第一階段hotfix</b></div></div><Shot name="step3.png" alt="輸入 linked worktree 目錄的 VS Code 畫面，路徑輸入框被標示出來"><rect className="vs-mark-box" x="297" y="52" width="861" height="48" rx="8"/><path className="vs-mark-lead" pathLength="1" d="M727 108 V172"/><g className="vs-mark-chip"><rect x="512" y="172" width="430" height="70" rx="16"/><text x="727" y="219">worktree 要放的目錄</text></g></Shot></div>;

 if(step===4)return <div className="vs-scene vs-new-window scene-pad"><p>OPEN IT</p><h1>不是切過去，<br/><span>是另開一個視窗。</span></h1><Shot name="step4.png" alt="Git Worktree Manager 提示在新視窗開啟 worktree"/><div className="vs-window-pop"><div/><BrandIcon name="vscode" className="vs-window-icon"/><strong>NEW WINDOW</strong><span>feature stays · hotfix opens</span></div></div>;

 // step5.png 裡兩個視窗是「疊放」不是「左右對開」，所以中央那條垂直藍線沒有任何
 // 對應物。改成各自框出視窗範圍再掛標籤 —— 兩個視窗的邊界自己就說明了「兩個視窗」。
 if(step===5)return <div className="vs-scene vs-two-windows scene-pad"><p>PARALLEL WORKSPACES</p><h1>兩個視窗，<span>各自編輯、各自提交。</span></h1><Shot name="step5.png" alt="兩個 VS Code 視窗同時開啟 feature 與 hotfix worktree，各自被框出範圍">
   <rect className="vs-mark-win vs-mark-back" x="10" y="10" width="1452" height="885" rx="12"/>
   <rect className="vs-mark-win vs-mark-front" x="299" y="297" width="1622" height="885" rx="12"/>
   {/* 標籤改成兩行。原本一行「第二階段 · feature」量到 342px 寬，但底框只有
       272px，字左右各溢出 ~35px 被切掉；而後方視窗唯一的空白處（編輯區
       x 310~625）只有 315px，一行怎麼排都塞不下。拆成兩行後最寬的一行是
       "feature"（147px），底框 214px 綽綽有餘，字級也不必縮。 */}
   <g className="vs-mark-tag vs-mark-tag-a">
     <rect x="350" y="106" width="214" height="128" rx="16"/>
     <text x="457" y="156">第二階段</text>
     <text className="vs-tag-branch" x="457" y="206">feature</text>
   </g>
   <g className="vs-mark-tag vs-mark-tag-b">
     <rect x="700" y="370" width="214" height="128" rx="16"/>
     <text x="807" y="420">第一階段</text>
     <text className="vs-tag-branch" x="807" y="470">hotfix</text>
   </g>
 </Shot></div>;

 // step7.png 裡同一個 commit 出現兩次：主視窗 git graph（左上）與 hotfix 視窗
 // （左下）。舊版那條斜線是從右下拉到左上，兩端都沒有接到 commit。
 if(step===6)return <div className="vs-scene vs-history scene-pad"><p>SHARED HISTORY · PROOF</p><h1>hotfix 一提交，<span>主視窗立刻看見。</span></h1><Shot name="step7.png" alt="hotfix 提交後主視窗 Git graph 立即出現同一個 commit，兩處被連起來">
   <rect className="vs-mark-box" x="72" y="352" width="430" height="38" rx="8"/>
   <rect className="vs-mark-box vs-mark-box-b" x="240" y="938" width="480" height="42" rx="8"/>
   <path className="vs-mark-link" pathLength="1" markerEnd="url(#vs-head)" d="M240 959 C104 940 40 760 66 396"/>
   <defs><marker id="vs-head" viewBox="0 0 12 12" refX="10" refY="6" markerUnits="userSpaceOnUse" markerWidth="34" markerHeight="34" orient="auto"><path className="vs-head-fill" d="M1 1 L11 6 L1 11 Z"/></marker></defs>
   <g className="vs-mark-chip"><rect x="118" y="648" width="420" height="78" rx="16"/><text x="328" y="700">同一個 commit</text></g>
 </Shot><div className="vs-history-note">same commit · same repository</div></div>;

 if(step===7)return <div className="vs-scene vs-cleanup scene-pad"><p>CLEAN UP</p><h1>工作目錄移除，<span>commit 還在。</span></h1><div className="vs-clean-pair"><Shot name="step8.png" alt="Git Worktree Manager 的移除 Worktree 操作選單"/><div className="vs-clean-arrow">→</div><Shot name="step9.png" alt="移除 linked worktree 後 commit 仍留在 Git 歷史"/></div><div className="vs-clean-captions"><b>REMOVE WORKTREE</b><b>HISTORY PRESERVED</b></div></div>;
 return null;
}
