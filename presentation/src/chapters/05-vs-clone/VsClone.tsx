import type { ChapterStepProps } from "../../registry/types";
import "./VsClone.css";

const Phone = ({ label = "PHONE", children }: { label?: string; children?: React.ReactNode }) => (
  <div className="es-phone"><i className="es-speaker"/><div className="es-screen"><b>{label}</b>{children}</div><i className="es-home"/></div>
);

/**
 * 每一份 clone 都得原封不動再存一套的三樣東西。
 *
 * 原本這是獨立一步（旁白「各自的 object database、各自的 remote 設定、各自的
 * refs。」）。eSIM 段落併進來之後，那一步跟「每支手機都有一整套自己的系統跟
 * 資料」講的是同一件事，所以旁白收掉，三個詞改成刻在手機螢幕裡 —— 比喻跟
 * Git 術語同框，不必分兩步講兩次。
 */
const OWN_SET = ["objects", "remote", "refs"];

export default function VsClone({ step }: ChapterStepProps) {
  // ── 比喻：手機與 eSIM（原第 7 章，整段併入，現為本章開場） ────────
  if (step === 0) return <div className="es-scene es-intro scene-pad"><div className="es-signal"><i/><i/><i/><i/></div><Phone label="eSIM"/><h1>用一支手機，<br/><span>把 worktree 想懂。</span></h1></div>;
  if (step === 1) return <div className="es-scene es-clones scene-pad"><p>MULTIPLE CLONES</p><h1>一個門號，<span>買一支手機。</span></h1><div className="es-phone-row">{["0912 · repo A","0935 · repo B","0988 · repo C"].map((x,i)=><div className="es-device" key={x} style={{animationDelay:`${i*150}ms`}}><Phone label={x}><div className="es-os">{OWN_SET.map((t,j)=><i key={t} style={{animationDelay:`${420+i*150+j*110}ms`}}>{t}</i>)}</div></Phone><small>system ＋ data</small></div>)}</div></div>;
  if (step === 2) return <div className="es-scene es-many scene-pad"><div><p>GIT WORKTREE</p><h1>一支手機，<br/><span>裝多個 eSIM。</span></h1></div><Phone label="ONE DEVICE"><div className="es-sim-stack">{["FEATURE","HOTFIX","RELEASE"].map((x,i)=><div key={x} style={{animationDelay:`${i*140}ms`}}><i/>{x}<small>ACTIVE</small></div>)}</div></Phone></div>;
  if (step === 3) return <div className="es-scene es-one scene-pad"><p>shared foundation</p><h1>底層裝置<span>只有一套</span></h1><div className="es-device-map"><div className="es-sim-row">{["0912","0935","0988"].map(x=><b key={x}>{x}</b>)}</div><svg viewBox="0 0 1200 400"><path pathLength="1" d="M200 40 V160 H600 M600 40 V320 M1000 40 V160 H600"/></svg><div className="es-hardware card"><strong>ONE DEVICE</strong><span>CPU · storage · operating system</span></div></div></div>;
  if (step === 4) return <div className="es-scene es-git scene-pad"><p>map it back to Git</p><h1>共用 repository 的<br/><span>歷史與物件。</span></h1><div className="es-git-map"><div className="es-checkouts">{["feature/","hotfix/","release/"].map(x=><div className="card" key={x}><b>{x}</b><i/><i/></div>)}</div><div className="es-repository card"><strong>repository</strong><span>commits · trees · blobs · refs</span><div className="es-object-row"><i/><i/><i/><i/></div></div></div></div>;

  // ── 兩個只有 worktree 做得到的證據 ────────────────────────────────
  if (step === 5) return <div className="vc-scene vc-speed scene-pad"><div className="vc-speed-copy"><p>create another workspace</p><h1>不必再抓一次<br/><span>完整歷史。</span></h1></div><div className="vc-race"><div className="vc-track"><b>git clone</b><div className="vc-bar vc-slow"><i/></div><span>download history again</span></div><div className="vc-track"><b>git worktree add</b><div className="vc-bar vc-fast"><i/></div><span>reuse local objects</span></div></div></div>;
  if (step === 6) return <div className="vc-scene vc-instant scene-pad"><p>shared object database</p><h1>這邊 commit，<span>那邊立刻看見。</span></h1><div className="vc-live"><div className="vc-window card"><b>feature/</b><div className="vc-file">app.ts　＋12</div><div className="vc-terminal">$ git commit -m "finish"<br/><strong>[feature a31f9c2]</strong></div></div><div className="vc-pulse"><i/><b>a31f9c2</b></div><div className="vc-window card"><b>main / graph</b><div className="vc-graph"><i/><i/><i/><strong>a31f9c2</strong></div></div></div></div>;

  // ── 比喻的邊界（原第 7 章結尾兩步） ───────────────────────────────
  if (step === 7) return <div className="es-scene es-boundary scene-pad"><div className="es-metaphor"><Phone label="METAPHOR"/><div className="es-bracket">shared foundation<br/>separate use</div></div><div className="es-limit"><div className="es-stop">只到這裡</div><h1>實體檔案<br/><span>還是各有一份。</span></h1></div></div>;
  if (step === 8) return <div className="es-scene es-cost scene-pad"><p>EACH WORKTREE PREPARES ITS OWN</p><h1>不是<span>零磁碟成本。</span></h1><div className="es-file-row">{[["node_modules","dependencies"],["build output","dist / cache"],[".env","local secrets"],["port","runtime binding"]].map(([a,b],i)=><article className="es-file card" key={a} style={{animationDelay:`${i*110}ms`}}><b>{a}</b><span>{b}</span><div className="es-space"><i/><i/><i/></div></article>)}</div><div className="es-equals">checkout 分開　＝　環境也要分開準備</div></div>;

  // ── 收束 ─────────────────────────────────────────────────────────
  if (step === 9) return <div className="vc-scene vc-verdict scene-pad"><div className="vc-half vc-clone-half"><p>MULTIPLE CLONES</p><h2>各過各的</h2><div className="vc-mini-islands"><i/><i/><i/></div><span>獨立 repo · 各自同步</span></div><div className="vc-half vc-worktree-half"><p>WORKTREES</p><h2>同一份歷史，<br/>多個現場</h2><div className="vc-mini-hub"><i/><i/><i/><b/></div><span>共享 objects / refs · checkout 分開</span></div><div className="vc-divider"/></div>;
  return null;
}

