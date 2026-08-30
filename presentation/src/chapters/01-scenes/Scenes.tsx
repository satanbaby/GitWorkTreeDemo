import type { ChapterStepProps } from "../../registry/types";
import "./Scenes.css";

const illustration = (name: string) =>
  `${import.meta.env.BASE_URL}illustrations/scenes/${name}`;

export default function Scenes({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <div className="sc-scene sc-opening scene-pad">
        <svg className="sc-branch-canvas" viewBox="0 0 1920 1080" aria-hidden="true">
          <path className="sc-branch-main" pathLength="1" d="M120 900 C430 900 455 770 760 770 C1010 770 1130 930 1440 930 H1810" />
          <path className="sc-branch-side" pathLength="1" d="M500 840 C650 840 650 590 890 590 H1240" />
          <path className="sc-branch-side sc-branch-side-b" pathLength="1" d="M970 790 C1110 790 1120 665 1355 665 H1740" />
          {[260, 500, 760, 970, 1240, 1440, 1740].map((x, index) => (
            <circle key={x} cx={x} cy={index < 2 ? 900 : index === 2 ? 770 : index === 3 ? 790 : index === 4 ? 590 : index === 5 ? 930 : 665} r="11" />
          ))}
        </svg>

        <div className="sc-opening-copy">
          <p className="sc-eyebrow">日常開發的真實畫面</p>
          <h1>
            一個人，
            <span>好幾個工作</span>
            同時壓上來。
          </h1>
          <div className="sc-opening-count">
            <strong className="hero-num">03</strong>
            <span>種切換情境<br />正在排隊</span>
          </div>
        </div>

        <div className="sc-opening-visual">
          <div className="sc-pressure-ring sc-pressure-ring-a" />
          <div className="sc-pressure-ring sc-pressure-ring-b" />
          <img
            src={illustration("overloaded-dev.png")}
            alt="熊熊開發者在桌前同時抱著多份工作，神情忙亂"
          />
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="sc-scene sc-hotfix scene-pad">
        <div className="sc-hotfix-copy">
          <p className="sc-eyebrow">情境一</p>
          <h1>feature 寫到一半，</h1>
          <h1 className="sc-accent-text">production 出事。</h1>
          <p>原本的節奏還沒停，hotfix 已經插隊進來。</p>
        </div>

        <div className="sc-lane card">
          <div className="sc-lane-label">
            <span>feature</span>
            <strong>正在開發</strong>
          </div>
          <div className="sc-code-sheet">
            <i /><i /><i /><i />
          </div>
          <svg viewBox="0 0 820 230" aria-hidden="true">
            <path className="sc-lane-main" pathLength="1" d="M42 145 H770" />
            <path className="sc-lane-detour" pathLength="1" d="M330 145 C400 145 410 66 500 66 H744" />
            <circle cx="115" cy="145" r="13" />
            <circle cx="330" cy="145" r="13" />
            <circle cx="570" cy="66" r="13" />
            <circle cx="744" cy="66" r="13" />
          </svg>
          <div className="sc-hotfix-ticket">
            <span>PRODUCTION</span>
            <strong>hotfix</strong>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="sc-scene sc-uncommitted scene-pad">
        <div className="sc-uncommitted-copy">
          <p className="sc-eyebrow">切走之前，這個現場還沒收完</p>
          <h1>本地還堆著<br /><span>未 commit 的修改。</span></h1>
          <div className="sc-status-strip card">
            <span>git status</span>
            <strong>modified files</strong>
            <i /><i /><i /><i /><i />
          </div>
        </div>
        <div className="sc-uncommitted-visual">
          <div className="sc-hotfix-badge"><span>URGENT</span><strong>hotfix</strong></div>
          <img src={illustration("uncommitted-interruption.png")} alt="熊熊開發者正處理大量未提交修改，production hotfix 突然插入" />
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="sc-scene sc-review scene-pad">
        <div className="sc-review-copy">
          <p className="sc-eyebrow">情境二</p>
          <h1>PR 送審了，<br /><span>人不能停在原地。</span></h1>
        </div>

        <div className="sc-review-flow">
          <div className="sc-pr-card card">
            <div className="sc-pr-top">
              <span>PULL REQUEST</span>
              <i />
            </div>
            <strong>review 未結束</strong>
            <div className="sc-reviewers"><i /><i /><i /></div>
            <div className="sc-wait-line"><i /></div>
          </div>

          <div className="sc-track">
            <span className="sc-track-dot" />
            <span className="sc-track-line" />
            <span className="sc-track-arrow">→</span>
          </div>

          <div className="sc-next-task card">
            <span>NEXT</span>
            <strong>下一個工項</strong>
            <div className="sc-next-lines"><i /><i /><i /></div>
          </div>
        </div>

        <p className="sc-review-note">等待 review，和開始下一件事，必須同時成立。</p>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="sc-scene sc-versions scene-pad">
        <div className="sc-versions-heading">
          <p className="sc-eyebrow">情境三</p>
          <h1>同一個專案，兩個版本長期並存。</h1>
        </div>

        <div className="sc-branch-version-stage card">
          <div className="sc-branch-repo"><span>same project</span><strong>Git branches</strong></div>
          <svg viewBox="0 0 1300 520" aria-hidden="true">
            <path className="sc-history-main" pathLength="1" d="M90 260 H1210" />
            <path className="sc-history-live" pathLength="1" d="M340 260 C430 260 430 120 540 120 H1110" />
            <path className="sc-history-next" pathLength="1" d="M620 260 C700 260 710 410 820 410 H1210" />
            {[150,340,620,920,1210].map(x=><circle key={`m-${x}`} cx={x} cy="260" r="13" />)}
            {[540,820,1110].map(x=><circle className="sc-live-node" key={`l-${x}`} cx={x} cy="120" r="13" />)}
            {[820,1010,1210].map(x=><circle className="sc-next-node" key={`n-${x}`} cx={x} cy="410" r="13" />)}
          </svg>
          <article className="sc-branch-label sc-branch-label-live">
            <span>release / v1</span><strong>已上線 · 持續維護</strong>
          </article>
          <article className="sc-branch-label sc-branch-label-next">
            <span>contract / v2</span><strong>新合約 · 持續開發</strong>
          </article>
        </div>
      </div>
    );
  }

  if (step === 5) {
    const sites = [
      ["sc-site-a", "hotfix 插隊"],
      ["sc-site-b", "PR review"],
      ["sc-site-c", "雙版本維護"],
    ];

    return (
      <div className="sc-scene sc-converge scene-pad">
        <svg className="sc-converge-lines" viewBox="0 0 1920 1080" aria-hidden="true">
          <path pathLength="1" d="M390 290 C610 290 650 470 850 490" />
          <path pathLength="1" d="M1530 290 C1310 290 1270 470 1070 490" />
          <path pathLength="1" d="M390 790 C610 790 670 620 850 600" />
        </svg>

        {sites.map(([className, label], index) => (
          <div className={`sc-site card ${className}`} key={label}>
            <span>0{index + 1}</span>
            <strong>{label}</strong>
          </div>
        ))}

        <div className="sc-person-core">
          <strong className="hero-num">03</strong>
          <span>個工作現場</span>
          <i />
          <b>同一個人</b>
        </div>

        <div className="sc-converge-copy">
          <p>這些不是偶發例外。</p>
          <h1>是日常。</h1>
        </div>
      </div>
    );
  }

  return null;
}
