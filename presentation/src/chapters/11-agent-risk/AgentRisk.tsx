import type { ChapterStepProps } from "../../registry/types";
import "./AgentRisk.css";

const themeAsset=(name:string)=>`${import.meta.env.BASE_URL}theme-assets/${name}`;
const Agent=({name,className=""}:{name:string;className?:string})=><div className={`ar-agent ${className}`}><div className="ar-head"><i/><i/></div><b>{name}</b><div className="ar-body"><i/><i/><i/></div></div>;

export default function AgentRisk({step}:ChapterStepProps){
 if(step===0)return <div className="ar-scene ar-intro scene-pad"><img src={themeAsset("ice-bear-coding.png")} alt="白熊專注使用筆電執行 Coding Agent 任務"/><div className="ar-cursor"><i/><i/></div><p>REAL-WORLD USE CASE</p><h1>Coding<br/><span>Agent</span></h1><div className="ar-enter">讀取　→　修改　→　執行</div></div>;
 if(step===1)return <div className="ar-scene ar-pipeline scene-pad"><p>AGENT DOES MORE THAN READ</p><h1>它會真的<span>動你的專案。</span></h1><div className="ar-conveyor">{[["EDIT","app.ts"],["FORMAT","prettier"],["TEST","vitest"],["BUILD","dist/"]].map(([a,b],i)=><div className="ar-action card" key={a} style={{animationDelay:`${i*140}ms`}}><strong>{a}</strong><span>{b}</span><i/></div>)}</div><div className="ar-belt"><i/><i/><i/><i/><i/><i/></div></div>;
 if(step===2)return <div className="ar-scene ar-crowded scene-pad"><p>ONE WORKING DIRECTORY</p><h1>兩個 agent，<span>擠進同一個現場。</span></h1><div className="ar-collision"><Agent name="AGENT A" className="ar-left-agent"/><Agent name="AGENT B" className="ar-right-agent"/><div className="ar-directory card"><b>project/</b>{["app.ts","HEAD","dist/"].map(x=><div key={x}><span>{x}</span><i/><i/></div>)}</div><svg viewBox="0 0 1500 580"><path pathLength="1" d="M180 150 C400 150 430 290 660 290"/><path pathLength="1" d="M1320 430 C1100 430 1050 290 830 290"/></svg></div><div className="ar-three">同時改檔　·　同時切 branch　·　同時清輸出</div></div>;
 if(step===3)return <div className="ar-scene ar-polluted scene-pad"><div className="ar-glitch"><span>WHO?</span><span>WHO?</span><span>WHO?</span></div><p>COLLISION RESULT</p><h1>互相覆蓋，<br/><span>測試結果被污染。</span></h1><div className="ar-result"><div className="ar-diff card"><b>app.ts</b><div><i className="ar-del"/><i className="ar-add"/><i className="ar-del"/><i className="ar-add"/></div><strong>last writer wins</strong></div><div className="ar-test card"><b>TEST RUN</b>{["pass","fail","pass","?"].map((x,i)=><span key={`${x}-${i}`}>{x}</span>)}<strong>owner: unknown</strong></div></div><div className="ar-verdict">你分不出來，是誰改壞的。</div></div>;
 return null;
}
