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
            <strong className="hero-num">04</strong>
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
      <div className="sc-scene sc-snapshot scene-pad">
        <div className="sc-snapshot-heading">
          <p className="sc-eyebrow">切走之前，這個現場還沒收完</p>
          <h1>你不是只在切一條 branch。</h1>
        </div>

        <div className="sc-snapshot-frame">
          <div className="sc-frame-corner sc-frame-tl" />
          <div className="sc-frame-corner sc-frame-tr" />
          <div className="sc-frame-corner sc-frame-bl" />
          <div className="sc-frame-corner sc-frame-br" />
          <div className="sc-snapshot-core">
            <span>WORKING</span>
            <strong>現場快照</strong>
            <small>四樣狀態必須一起留下</small>
          </div>

          <div className="sc-state sc-state-code card">
            <span className="sc-state-mark">01</span>
            <strong>未 commit 的修改</strong>
            <div className="sc-mini-lines"><i /><i /><i /></div>
          </div>
          <div className="sc-state sc-state-service card">
            <span className="sc-state-mark">02</span>
            <strong>跑到一半的服務</strong>
            <div className="sc-wave"><i /><i /><i /><i /><i /></div>
          </div>
          <div className="sc-state sc-state-deps card">
            <span className="sc-state-mark">03</span>
            <strong>剛裝好的依賴</strong>
            <div className="sc-dep-nodes"><i /><i /><i /><i /></div>
          </div>
          <div className="sc-state sc-state-ide card">
            <span className="sc-state-mark">04</span>
            <strong>IDE 追到一半的上下文</strong>
            <div className="sc-tabs"><i /><i /><i /></div>
          </div>
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

        <div className="sc-version-stage">
          <div className="sc-repo-spine">
            <span>同一個專案</span>
            <i /><i /><i />
          </div>

          <article className="sc-version-panel sc-version-live card">
            <span className="hero-num">01</span>
            <div>
              <p>第一階段</p>
              <h2>已經上線</h2>
              <strong>持續維護</strong>
            </div>
            <div className="sc-pulse"><i /><i /><i /></div>
          </article>

          <article className="sc-version-panel sc-version-build card">
            <span className="hero-num">02</span>
            <div>
              <p>第二階段</p>
              <h2>新合約</h2>
              <strong>持續開發</strong>
            </div>
            <div className="sc-build-bars"><i /><i /><i /><i /></div>
          </article>
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="sc-scene sc-dual scene-pad">
        <div className="sc-dual-heading">
          <p className="sc-eyebrow">情境四</p>
          <h1>前端 feature，後端 API，兩邊同時顧。</h1>
        </div>

        <div className="sc-dual-workspace">
          <article className="sc-window sc-window-front card">
            <div className="sc-window-bar"><i /><i /><i /><span>FRONTEND</span></div>
            <div className="sc-browser-layout">
              <aside><i /><i /><i /></aside>
              <main><div /><div /><div /></main>
            </div>
            <strong>feature</strong>
          </article>

          <div className="sc-connection" aria-hidden="true">
            <span className="sc-packet sc-packet-a" />
            <span className="sc-packet sc-packet-b" />
            <i />
          </div>

          <article className="sc-window sc-window-api card">
            <div className="sc-window-bar"><i /><i /><i /><span>BACKEND</span></div>
            <div className="sc-api-stack">
              <div><span>GET</span><i /></div>
              <div><span>POST</span><i /></div>
              <div><span>PATCH</span><i /></div>
            </div>
            <strong>API</strong>
          </article>
        </div>
      </div>
    );
  }

  if (step === 6) {
    const sites = [
      ["sc-site-a", "hotfix 插隊"],
      ["sc-site-b", "PR review"],
      ["sc-site-c", "雙版本維護"],
      ["sc-site-d", "前端 / API"],
    ];

    return (
      <div className="sc-scene sc-converge scene-pad">
        <svg className="sc-converge-lines" viewBox="0 0 1920 1080" aria-hidden="true">
          <path pathLength="1" d="M390 290 C610 290 650 470 850 490" />
          <path pathLength="1" d="M1530 290 C1310 290 1270 470 1070 490" />
          <path pathLength="1" d="M390 800 C610 800 650 620 850 600" />
          <path pathLength="1" d="M1530 800 C1310 800 1270 620 1070 600" />
        </svg>

        {sites.map(([className, label], index) => (
          <div className={`sc-site card ${className}`} key={label}>
            <span>0{index + 1}</span>
            <strong>{label}</strong>
          </div>
        ))}

        <div className="sc-person-core">
          <strong className="hero-num">04</strong>
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
