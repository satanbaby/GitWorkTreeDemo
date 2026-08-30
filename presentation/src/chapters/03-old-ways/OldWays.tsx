import type { ChapterStepProps } from "../../registry/types";
import "./OldWays.css";

const illustration = (name: string) =>
  `${import.meta.env.BASE_URL}illustrations/old-ways/${name}`;

function Title({ method, label, tone = "good" }: { method: string; label: string; tone?: "good" | "cost" }) {
  return <div className={`ow-title ow-${tone}`}><p>{method}</p><h1>{label}</h1></div>;
}

export default function OldWays({ step }: ChapterStepProps) {
  if (step === 0) return (
    <div className="ow-scene ow-overview scene-pad">
      <p className="ow-kicker">頻繁切換時，過去怎麼做？</p><h1>三種舊做法。</h1>
      <div className="ow-ticket-row">
        {["WIP commit", "stash", "再 clone 一份"].map((x,i)=><div className="ow-ticket card" style={{"--ow-i":i} as React.CSSProperties} key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}
      </div>
      <div className="ow-route"><i/><i/><i/></div>
    </div>
  );
  if (step === 1) return (
    <div className="ow-scene ow-method scene-pad"><Title method="做法一 · WIP COMMIT" label="東西不會丟，切得快。" />
      <div className="ow-history card"><div className="ow-branch"><i/><i/><i/><i/></div><div className="ow-wip-good"><span>WIP</span><strong>save</strong></div><p>未完成狀態先落到 branch history</p></div>
    </div>
  );
  if (step === 2) return (
    <div className="ow-scene ow-method scene-pad"><Title method="做法一 · 代價" label="半成品寫進歷史。" tone="cost" />
      <div className="ow-history ow-history-cost card"><div className="ow-branch"><i/><i/><i/><i/><i/></div><div className="ow-wip-bad"><span>WIP</span></div><div className="ow-rewrite"><b>切回</b><b>整理</b><b>重寫歷史</b></div><svg viewBox="0 0 900 260"><path pathLength="1" d="M110 150 C290 20 570 20 760 145"/></svg></div>
    </div>
  );
  if (step === 3) return (
    <div className="ow-scene ow-method scene-pad"><Title method="做法二 · STASH" label="working tree 立刻乾淨。" />
      <div className="ow-stash-stage"><div className="ow-files">{["modified","new file","local config"].map(x=><div key={x}>{x}<i/><i/></div>)}</div><div className="ow-funnel">↓</div><div className="ow-stash-box card"><span>refs/stash</span><strong>暫存</strong></div><div className="ow-clean">CLEAN</div></div>
    </div>
  );
  if (step === 4) return (
    <div className="ow-scene ow-method scene-pad"><Title method="做法二 · 代價" label="套回會衝突，還可能拿錯。" tone="cost" />
      <div className="ow-stash-pile">{[0,1,2,3,4].map(i=><div className="ow-stash-card card" style={{"--ow-i":i} as React.CSSProperties} key={i}><span>stash@&#123;{i}&#125;</span><i/><i/><strong>{i===4?"CONFLICT · which one?":"which one?"}</strong></div>)}</div>
    </div>
  );
  if (step === 5) return (
    <div className="ow-scene ow-method scene-pad"><Title method="做法三 · CLONE AGAIN" label="隔離最完整，互不影響。" />
      <div className="ow-clone-pair"><div className="ow-repo card"><span>repo A</span><strong>feature</strong><div className="ow-tree"><i/><i/><i/></div></div><div className="ow-wall"/><div className="ow-repo card"><span>repo B</span><strong>hotfix</strong><div className="ow-tree"><i/><i/><i/></div></div></div>
    </div>
  );
  if (step === 6) return (
    <div className="ow-scene ow-method scene-pad"><Title method="做法三 · 代價" label="每一份 clone，都帶整套 repository。" tone="cost" />
      <div className="ow-repo-waste">
        <img src={illustration("duplicate-repositories-v2.png")} alt="三個完整 repository 容器各自包住相同專案資料夾，重複占用磁碟空間" />
        {["clone A","clone B","clone C"].map((name,index)=><div className={`ow-size-label ow-size-${index}`} key={name}><span>{name}</span><strong>1 GB</strong></div>)}
        <div className="ow-space-total card"><span>GIT OBJECTS ONLY</span><strong className="hero-num">3 GB</strong><i /></div>
      </div>
    </div>
  );
  if (step === 7) return (
    <div className="ow-scene ow-exchange scene-pad"><div className="ow-exchange-copy"><p className="ow-kicker">你在這邊 commit</p><h1>另一邊的 git log<br/><span>看不到。</span></h1></div>
      <div className="ow-exchange-demo"><div className="ow-terminal card"><span>clone A</span><code>$ git commit</code><strong>new commit</strong></div><div className="ow-bridge"><b>fetch</b><i/><b>push</b></div><div className="ow-terminal card"><span>clone B</span><code>$ git log</code><strong>still old</strong></div></div>
    </div>
  );
  return null;
}
