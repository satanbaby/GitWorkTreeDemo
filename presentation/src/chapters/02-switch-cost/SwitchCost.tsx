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
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="sw-scene sw-flip scene-pad">
        <div className="sw-flip-title">
          <p className="sw-kicker">git switch 的瞬間</p>
          <h1>整批檔案，全部跟著換。</h1>
        </div>
        <div className="sw-file-wall">
          {Array.from({ length: 18 }, (_, i) => (
            <div className="sw-file" style={{ "--sw-i": i } as React.CSSProperties} key={i}>
              <span>{i < 9 ? "feature" : "hotfix"}</span>
              <i /><i /><i />
            </div>
          ))}
          <div className="sw-sweep"><span>switch</span></div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="sw-scene sw-drift scene-pad">
        <div className="sw-drift-copy">
          <p className="sw-kicker">檔案換了，環境沒有一起歸零</p>
          <h1>三個東西開始錯位。</h1>
        </div>
        <div className="sw-axis">
          <div className="sw-axis-label"><span>目前分支</span><strong>hotfix</strong></div>
          <div className="sw-axis-line"><i /></div>
        </div>
        <div className="sw-drift-items">
          <article className="sw-drift-item card sw-drift-a">
            <span>BUILD</span><strong>cache</strong><i className="sw-offset" />
          </article>
          <article className="sw-drift-item card sw-drift-b">
            <span>OUTPUT</span><strong>generated files</strong><i className="sw-offset" />
          </article>
          <article className="sw-drift-item card sw-drift-c">
            <span>DEPS</span><strong>node_modules</strong><i className="sw-offset" />
          </article>
        </div>
        <p className="sw-drift-note">檔案內容屬於 hotfix，殘留狀態還停在 feature。</p>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="sw-scene sw-service scene-pad">
        <div className="sw-service-copy">
          <p className="sw-kicker">最容易被忘記的第四樣</p>
          <h1>服務還在跑，<br /><span>環境已經不是原來那個。</span></h1>
        </div>
        <div className="sw-runtime card">
          <div className="sw-process">
            <span>RUNNING</span>
            <strong>localhost</strong>
            <div className="sw-wave"><i /><i /><i /><i /><i /><i /></div>
          </div>
          <div className="sw-wire"><i /><span>context lost</span></div>
          <div className="sw-branch-target">
            <small>CURRENT FILES</small>
            <strong>hotfix</strong>
          </div>
          <div className="sw-old-context">feature context</div>
        </div>
      </div>
    );
  }

  return null;
}
