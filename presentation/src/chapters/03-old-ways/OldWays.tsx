import type { ChapterStepProps } from "../../registry/types";
import "./OldWays.css";

const illustration = (name: string) =>
  `${import.meta.env.BASE_URL}illustrations/old-ways/${name}`;

function Title({ method, label, tone = "good" }: { method: string; label: string; tone?: "good" | "cost" }) {
  return <div className={`ow-title ow-${tone}`}><p>{method}</p><h1>{label}</h1></div>;
}

/**
 * step 4 的三個未 commit 變更。dx / dy 是它們各自要飛進右側 stash 保險櫃的
 * 位移量 —— 卡片中心 (160/470/780, 195) 到櫃子中心 (1350, 340)，都在
 * .ow-stash-scene 這個 1600×640 的座標系裡量，所以動畫終點必定落在櫃子上。
 */
const DIRTY = [
  { flag: "M", name: "src/api/client.ts", dx: 1190, dy: 145 },
  { flag: "M", name: "src/pages/login.tsx", dx: 880, dy: 145 },
  { flag: "??", name: ".env.local", dx: 570, dy: 145 },
];

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
      <div className="ow-history ow-history-cost card">
        <svg className="ow-cost-svg" viewBox="0 0 1300 430" role="img" aria-label="WIP commit 卡在 branch history 中間，之後必須回頭改寫">
          <defs>
            <marker id="ow-arrowhead" viewBox="0 0 12 12" refX="10" refY="6" markerUnits="userSpaceOnUse" markerWidth="30" markerHeight="30" orient="auto">
              <path className="ow-head" d="M1 1 L11 6 L1 11 Z" />
            </marker>
          </defs>
          <line className="ow-track" x1="80" y1="300" x2="1220" y2="300" />
          {[150, 380, 840, 1070].map((x) => <circle className="ow-node" key={x} cx={x} cy="300" r="20" />)}
          <circle className="ow-wip-node" cx="610" cy="300" r="54" />
          <text className="ow-wip-text" x="610" y="300">WIP</text>
          <path className="ow-return" pathLength="1" markerEnd="url(#ow-arrowhead)" d="M1070 252 C1058 104 796 88 690 232" />
          <text className="ow-return-text" x="870" y="78">之後得回頭改寫</text>
        </svg>
        <div className="ow-rewrite"><b>切回</b><i>→</i><b>整理</b><i>→</i><b>重寫歷史</b></div>
      </div>
    </div>
  );
  if (step === 3) return (
    <div className="ow-scene ow-method scene-pad"><Title method="做法二 · STASH" label="working tree 立刻乾淨。" />
      {/* 分支線、節點、通往 stash 的虛線全部畫在同一個 viewBox（1600×640），
          HTML 元素也用同一套座標絕對定位 —— 卡片飛進櫃子的落點才對得準。 */}
      <div className="ow-stash-scene">
        <svg className="ow-stash-svg" viewBox="0 0 1600 640" aria-hidden="true">
          <line className="ow-branch-line" x1="60" y1="470" x2="900" y2="470" />
          {[120, 330, 540, 750].map((x, i) =>
            <circle className="ow-branch-node" key={x} cx={x} cy="470" r="21" style={{ animationDelay: `${i * 110}ms` }} />)}
          <path className="ow-stash-dash" pathLength="1" d="M750 470 C 900 470 1000 430 1136 356" />
        </svg>

        <div className="ow-wt">
          <span className="ow-wt-label">WORKING TREE</span>
          <div className="ow-wt-files">
            {DIRTY.map((f, i) =>
              <div className="ow-dirty card" key={f.name}
                   style={{ "--dx": `${f.dx}px`, "--dy": `${f.dy}px`, animationDelay: `${300 + i * 90}ms, ${1550 + i * 90}ms` } as React.CSSProperties}>
                <b>{f.flag}</b><span>{f.name}</span>
              </div>)}
          </div>
          <div className="ow-wt-clean">working tree clean</div>
        </div>

        <div className="ow-stash-cmd"><em>$</em> git stash push -u</div>

        <div className="ow-branch-name">feature/login</div>
        <div className="ow-branch-note">history 一行都沒動</div>

        <div className="ow-vault">
          <div className="ow-vault-lid" />
          <span>refs/stash</span>
          <strong>{"stash@{0}"}</strong>
          <div className="ow-vault-count"><b>3</b> 個未 commit 的異動收在裡面</div>
        </div>
      </div>
    </div>
  );
  if (step === 4) return (
    <div className="ow-scene ow-method scene-pad"><Title method="做法二 · 代價" label="套回會衝突，還可能拿錯。" tone="cost" />
      <div className="ow-stash-pile">{[0,1,2,3,4].map(i=><div className="ow-stash-card card" style={{"--ow-i":i} as React.CSSProperties} key={i}><span>stash@&#123;{i}&#125;</span><i/><i/>{i===4?<strong>CONFLICT · which one?</strong>:null}</div>)}</div>
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
