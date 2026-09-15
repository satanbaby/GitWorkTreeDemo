import type { ChapterStepProps } from "../../registry/types";
import "./Scenes.css";

const illustration = (name: string) =>
  `${import.meta.env.BASE_URL}illustrations/scenes/${name}`;

export default function Scenes({ step }: ChapterStepProps) {
  if (step === 3) {
    return (
      <div className="sc-scene sc-opening scene-pad">
        <img
          className="sc-opening-backdrop"
          src={illustration("overloaded-dev-git-scene.png")}
          alt="熊熊開發者被多個 Git branch、stash、commit 與切換工作壓得手忙腳亂"
        />

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

      </div>
    );
  }

  // 情境一：hotfix 插隊 + 手上還有未 commit 的修改。原本拆成兩步，但插圖
  // 本身就同時畫了這兩件事（沒歸位的一整疊紙 + 砸下來的火警通知），拆開
  // 等於同一張圖講兩輪，因此併成一步。
  if (step === 0) {
    return (
      <div className="sc-scene sc-uncommitted scene-pad">
        <div className="sc-uncommitted-copy">
          <p className="sc-eyebrow">情境一</p>
          <h1>feature 寫到一半，<br /><span>production 出事。</span></h1>
          <p className="sc-uncommitted-lead">
            hotfix 插隊進來 —— 但本地還堆著
            <br />
            <strong>一整批未 commit 的修改。</strong>
          </p>
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

  if (step === 1) {
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

  if (step === 2) {
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

  return null;
}
