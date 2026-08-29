import type { ChapterStepProps } from "../../registry/types";
import "./Cover.css";

const themeAsset = (name: string) =>
  `${import.meta.env.BASE_URL}theme-assets/${name}`;

export default function Cover({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <div className="cv-scene scene-pad">
        <div className="cv-wash cv-wash-a" />
        <div className="cv-wash cv-wash-b" />

        <section className="cv-copy">
          <p className="cv-kicker">同一份歷史，多個工作現場</p>
          <h1 className="cv-title">
            <span>Git</span>
            <span>Worktree</span>
          </h1>
          <div className="cv-title-rule" />
          <p className="cv-subtitle">一個 repo，同時開好幾個工作現場</p>

          <div className="cv-meta" aria-label="講者與日期">
            <span>莊詠翔</span>
            <span className="cv-meta-rule" />
            <span>2026.08.29</span>
          </div>

          <div className="cv-preview card">
            <p className="cv-preview-title">這次會拆六件事</p>
            <div className="cv-preview-grid">
              {[
                "卡住的現場",
                "舊做法的代價",
                "worktree 概念",
                "建立與維護",
                "VS Code 實作",
                "Coding Agent",
              ].map((item, index) => (
                <div className="cv-preview-item" key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cv-visual" aria-label="三隻熊在同一份 Git 歷史上協作">
          <div className="cv-orbit cv-orbit-a" />
          <div className="cv-orbit cv-orbit-b" />
          <img
            className="cv-bear cv-bear-grizzly"
            src={themeAsset("grizzly-presenting.png")}
            alt="灰熊開心講解"
          />
          <img
            className="cv-bear cv-bear-ice"
            src={themeAsset("ice-bear-coding.png")}
            alt="白熊專注使用筆電"
          />
          <img
            className="cv-bear cv-bear-panda"
            src={themeAsset("panda-reviewing.png")}
            alt="熊貓閱讀筆記"
          />
          <div className="cv-desk">
            <svg className="cv-git" viewBox="0 0 760 150" role="img" aria-label="多條分支共用同一份歷史">
              <path className="cv-git-main" pathLength="1" d="M35 83 H718" />
              <path className="cv-git-feature" pathLength="1" d="M195 83 C245 83 244 35 305 35 H505 C555 35 548 83 602 83" />
              <path className="cv-git-hotfix" pathLength="1" d="M410 83 C450 83 448 124 500 124 H645" />
              {[90, 195, 305, 410, 505, 602, 718].map((x) => (
                <circle key={x} cx={x} cy="83" r="9" />
              ))}
              <circle cx="360" cy="35" r="9" />
              <circle cx="505" cy="35" r="9" />
              <circle cx="500" cy="124" r="9" />
              <circle cx="645" cy="124" r="9" />
            </svg>
          </div>
        </section>

        <div className="cv-summary card">
          <span className="cv-summary-mark">→</span>
          <strong>看完能自己建立、切換、檢查與移除 worktree</strong>
          <span>也知道什麼時候不該用</span>
        </div>
      </div>
    );
  }

  return null;
}
