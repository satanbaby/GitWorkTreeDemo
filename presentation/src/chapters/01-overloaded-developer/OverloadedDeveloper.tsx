import type { ChapterStepProps } from "../../registry/types";
import "./OverloadedDeveloper.css";

/**
 * 01 · overloaded-developer —— 分支切換不是例外，是日常
 *
 * 五個節拍各自一種主導動作：
 *   0 翻牌（分支名跳動）+ 四角飛入
 *   1 進度條生長 → 被 hotfix 砸停（凍結）
 *   2 SVG 連線自繪 + 節點依次點亮 + 佇列推入
 *   3 中縫落下 → 左右對半展開
 *   4 角色單獨在場 → 三份工作現場聚攏包圍
 */

/** step 0 —— 翻牌帶過的分支名，落點停在 hotfix 為下一拍鋪路 */
const FLIP_BRANCHES = [
  "feature/account-page",
  "release/phase-1",
  "feature/phase-2",
  "pr/review-fix",
  "hotfix/payment-timeout",
];

/** step 0 —— 四面八方飛來的工作（來源 article §典型困境、§實務情境） */
const INBOUND = [
  { text: "production hotfix", corner: "tl" },
  { text: "PR review 回饋", corner: "tr" },
  { text: "新合約需求", corner: "bl" },
  { text: "spike 實驗", corner: "br" },
];

/** step 1 —— feature 現場裡必須被保留的東西（來源 article §典型困境） */
const LIVE_CONTEXT = [
  "未提交的修改",
  "跑到一半的服務",
  "已裝好的依賴",
  "IDE 裡的上下文",
];

/** step 2 —— 排在 PR 後面的下一批工項 */
const QUEUE = [
  { branch: "feature/phase-2", note: "新合約需求", hot: true },
  { branch: "api/report-export", note: "排程中", hot: false },
  { branch: "bugfix/login-redirect", note: "排程中", hot: false },
];

/** step 4 —— 同時背著的三個工作現場（來源 article §典型困境） */
const WORKSITES = [
  {
    title: "插隊的 hotfix",
    branch: "hotfix/payment-timeout",
    keeps: ["未提交的修改", "執行中的服務"],
  },
  {
    title: "PR 之後的工項",
    branch: "feature/phase-2",
    keeps: ["IDE 裡的上下文", "已裝好的依賴"],
  },
  {
    title: "上線版的維護",
    branch: "release/phase-1",
    keeps: ["本機環境設定", "build 產物"],
  },
];

export default function OverloadedDeveloper({ step }: ChapterStepProps) {
  // ── step 0 ── 冷開場：分支名翻牌，工作從四角飛進來
  if (step === 0) {
    return (
      <div className="od od-s0 scene-pad" key={step}>
        {INBOUND.map((c, i) => (
          <span
            key={c.text}
            className={`od-fly od-fly-${c.corner} card`}
            style={{ animationDelay: `${3600 + i * 300}ms` }}
          >
            {c.text}
          </span>
        ))}

        <div className="od-s0-core">
          <h1 className="od-s0-hero serif-cn">
            你每天都在<em>切換分支</em>
          </h1>

          <div className="od-s0-term card">
            <span className="od-s0-prompt mono">$</span>
            <span className="od-s0-cmd mono">git switch</span>
            <span className="od-s0-flipwrap mono">
              <span className="od-s0-fliptrack">
                {FLIP_BRANCHES.map((b) => (
                  <span className="od-s0-flipitem" key={b}>
                    {b}
                  </span>
                ))}
              </span>
            </span>
            <span className="od-s0-caret" aria-hidden />
          </div>

          <p className="od-s0-lede">不是因為你愛切</p>
        </div>
      </div>
    );
  }

  // ── step 1 ── feature 做到一半，被 production hotfix 砸停
  if (step === 1) {
    return (
      <div className="od od-s1 scene-pad" key={step}>
        <div className="od-s1-stack">
          <article className="od-s1-work card">
            <div className="od-s1-head">
              <span className="od-s1-branch mono">feature/account-page</span>
              <span className="od-s1-state-slot">
                <span className="od-s1-state od-s1-state-run">開發中</span>
                <span className="od-s1-state od-s1-state-hold">已暫停</span>
              </span>
            </div>

            <h2 className="od-s1-title serif-cn">做到一半的 feature</h2>

            <div className="od-s1-bar" aria-hidden>
              <span className="od-s1-bar-fill" />
              <span className="od-s1-bar-hatch" />
            </div>

            <p className="od-s1-keeplabel">這些都得原封不動留在原地</p>
            <ul className="od-s1-chips">
              {LIVE_CONTEXT.map((c, i) => (
                <li
                  key={c}
                  className="od-s1-chip"
                  style={{ animationDelay: `${2300 + i * 170}ms` }}
                >
                  {c}
                </li>
              ))}
            </ul>
          </article>

          <aside className="od-s1-hotfix card">
            <span className="od-s1-hotfix-tag mono">production</span>
            <h3 className="od-s1-hotfix-title serif-cn">插隊</h3>
            <span className="od-s1-hotfix-branch mono">
              hotfix/payment-timeout
            </span>
          </aside>
        </div>

        <p className="od-s1-verdict serif-cn">
          原本的工作，<em>只能先停住</em>
        </p>
      </div>
    );
  }

  // ── step 2 ── PR 卡在 review，下一個工項已經推到手上
  if (step === 2) {
    return (
      <div className="od od-s2 scene-pad" key={step}>
        <div className="od-s2-pipe">
          <svg
            className="od-s2-svg"
            viewBox="0 0 1400 140"
            aria-hidden
          >
            <line className="od-s2-seg-done" x1="156" y1="70" x2="654" y2="70" />
            <line className="od-s2-seg-open" x1="746" y1="70" x2="1244" y2="70" />
            <circle className="od-s2-halo" cx="700" cy="70" r="36" />
            <circle className="od-s2-node od-s2-n1" cx="110" cy="70" r="36" />
            <circle className="od-s2-node od-s2-n2" cx="700" cy="70" r="36" />
            <circle className="od-s2-node od-s2-n3" cx="1290" cy="70" r="36" />
          </svg>

          <div className="od-s2-labels">
            <div className="od-s2-label od-s2-l1">
              <span className="od-s2-label-t">送出 PR</span>
              <span className="od-s2-label-s mono">done</span>
            </div>
            <div className="od-s2-label od-s2-l2">
              <span className="od-s2-label-t">等待 review</span>
              <span className="od-s2-label-s mono">還沒結束</span>
            </div>
            <div className="od-s2-label od-s2-l3">
              <span className="od-s2-label-t">合併</span>
              <span className="od-s2-label-s mono">未定</span>
            </div>
          </div>
        </div>

        <div className="od-s2-queue">
          <span className="od-s2-queue-label">下一個工項</span>
          <div className="od-s2-tickets">
            {QUEUE.map((q, i) => (
              <div
                key={q.branch}
                className={`od-s2-ticket card${q.hot ? " is-now" : ""}`}
                style={{ animationDelay: `${3200 + i * 260}ms` }}
              >
                <span className="od-s2-ticket-branch mono">{q.branch}</span>
                <span className="od-s2-ticket-note">{q.note}</span>
                {q.hot && <span className="od-s2-ticket-now">已排到你手上</span>}
              </div>
            ))}
          </div>
        </div>

        <p className="od-s2-verdict serif-cn">
          你<em>不能停在原地</em>
        </p>
      </div>
    );
  }

  // ── step 3 ── 同一專案，兩個必須同時活著的版本
  if (step === 3) {
    return (
      <div className="od od-s3 scene-pad" key={step}>
        <div className="od-s3-shared">
          <span className="od-s3-shared-label mono">同一個 repository</span>
        </div>

        <div className="od-s3-split">
          <span className="od-s3-seam" aria-hidden />

          <section className="od-s3-panel od-s3-left card">
            <span className="od-s3-eyebrow mono">release/phase-1</span>
            <h2 className="od-s3-title serif-cn">第一階段</h2>
            <div className="od-s3-status od-s3-status-live">
              <span className="dot-accent" />
              已上線
            </div>
            <ul className="od-s3-lines">
              <li style={{ animationDelay: "3000ms" }}>持續維護中</li>
              <li style={{ animationDelay: "3220ms" }}>只進 hotfix，不進新功能</li>
            </ul>
          </section>

          <section className="od-s3-panel od-s3-right card">
            <span className="od-s3-eyebrow mono">feature/phase-2</span>
            <h2 className="od-s3-title serif-cn">第二階段</h2>
            <div className="od-s3-status od-s3-status-wip">
              <span className="od-s3-ring" />
              開發中
            </div>
            <ul className="od-s3-lines">
              <li style={{ animationDelay: "5400ms" }}>依新合約開發</li>
              <li style={{ animationDelay: "5620ms" }}>功能持續進版</li>
            </ul>
          </section>
        </div>

        <p className="od-s3-verdict serif-cn">
          兩個版本，<em>同時都要活著</em>
        </p>
      </div>
    );
  }

  // ── step 4 ── 一位開發者，身邊堆著三份各自要保留的工作現場
  return (
    <div className="od od-s4 scene-pad" key={step}>
      <div className="od-s4-body">
        <div className="od-s4-figure">
          <img
            className="od-s4-bear"
            src="/theme-assets/ice-bear-coding.png"
            alt="白熊坐著使用筆記型電腦"
          />
          <span className="od-s4-figure-cap">只有一位開發者</span>
        </div>

        <div className="od-s4-sites">
          {WORKSITES.map((w, i) => (
            <article
              key={w.branch}
              className="od-s4-site card"
              style={{ animationDelay: `${1800 + i * 800}ms` }}
            >
              <div className="od-s4-site-head">
                <h3 className="od-s4-site-title serif-cn">{w.title}</h3>
                <span className="od-s4-site-branch mono">{w.branch}</span>
              </div>
              <ul className="od-s4-keeps">
                {w.keeps.map((k, j) => (
                  <li
                    key={k}
                    style={{ animationDelay: `${5000 + i * 380 + j * 180}ms` }}
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <p className="od-s4-verdict serif-cn">
        每一份，都要保留<em>自己的現場</em>
      </p>
    </div>
  );
}
