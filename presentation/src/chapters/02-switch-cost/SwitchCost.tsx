import type { ChapterStepProps } from "../../registry/types";
import "./SwitchCost.css";

export default function SwitchCost({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <div className="sw-scene sw-limit scene-pad">
        <div className="sw-copy">
          <p className="sw-kicker">真正的限制</p>
          <h1>一個 working directory</h1>
          <p>一次，只能呈現一個 checkout。</p>
        </div>
        <div className="sw-workdir card">
          <div className="sw-folder-tab">project/</div>
          <div className="sw-viewport">
            <div className="sw-checkout sw-checkout-feature">
              <span>feature</span>
              <div className="sw-file-grid">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
            </div>
            <div className="sw-checkout sw-checkout-hotfix">
              <span>hotfix</span>
              <div className="sw-file-grid">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
            </div>
          </div>
          {/* 這個 slot 要跟上方 viewport 的循環同步：兩個分支名疊在同一格上
              交叉淡入淡出，時間點與 sw-feature-loop / sw-hotfix-loop 完全一致，
              才看得出「同一個槽位，一次只裝得下一個 checkout」。 */}
          <div className="sw-slot">
            <span>CHECKOUT SLOT</span>
            <div className="sw-slot-now">
              <b className="sw-now-feature">feature</b>
              <b className="sw-now-hotfix">hotfix</b>
            </div>
            <strong>1 / 1</strong>
          </div>
          <div className="sw-loop-legend">
            <span className="sw-leg-feature"><i />feature</span>
            <b>git switch</b>
            <span className="sw-leg-hotfix"><i />hotfix</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
