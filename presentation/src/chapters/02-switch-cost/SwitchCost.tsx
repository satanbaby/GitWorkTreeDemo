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
          <div className="sw-slot">
            <span>CHECKOUT SLOT</span>
            <strong>1 / 1</strong>
          </div>
          <div className="sw-loop-legend">
            <span><i />feature</span>
            <b>git switch</b>
            <span><i />hotfix</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
