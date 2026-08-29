import type { ChapterDef } from "./types";
import Cover from "../chapters/00-cover/Cover";
import { narrations as coverNarrations } from "../chapters/00-cover/narrations";
import Scenes from "../chapters/01-scenes/Scenes";
import { narrations as scenesNarrations } from "../chapters/01-scenes/narrations";
import SwitchCost from "../chapters/02-switch-cost/SwitchCost";
import { narrations as switchCostNarrations } from "../chapters/02-switch-cost/narrations";
import OldWays from "../chapters/03-old-ways/OldWays";
import { narrations as oldWaysNarrations } from "../chapters/03-old-ways/narrations";
import Concept from "../chapters/04-concept/Concept";
import { narrations as conceptNarrations } from "../chapters/04-concept/narrations";
import VsClone from "../chapters/05-vs-clone/VsClone";
import { narrations as vsCloneNarrations } from "../chapters/05-vs-clone/narrations";
import Esim from "../chapters/06-esim/Esim";
import { narrations as esimNarrations } from "../chapters/06-esim/narrations";
import CmdCreate from "../chapters/07-cmd-create/CmdCreate";
import { narrations as cmdCreateNarrations } from "../chapters/07-cmd-create/narrations";
import CmdManage from "../chapters/08-cmd-manage/CmdManage";
import { narrations as cmdManageNarrations } from "../chapters/08-cmd-manage/narrations";
import Traps from "../chapters/09-traps/Traps";
import { narrations as trapsNarrations } from "../chapters/09-traps/narrations";
import Vscode from "../chapters/10-vscode/Vscode";
import { narrations as vscodeNarrations } from "../chapters/10-vscode/narrations";
import AgentRisk from "../chapters/11-agent-risk/AgentRisk";
import { narrations as agentRiskNarrations } from "../chapters/11-agent-risk/narrations";
import AgentIsolation from "../chapters/12-agent-isolation/AgentIsolation";
import { narrations as agentIsolationNarrations } from "../chapters/12-agent-isolation/narrations";
import Closing from "../chapters/13-closing/Closing";
import { narrations as closingNarrations } from "../chapters/13-closing/narrations";

/**
 * Order = order of presentation.
 *
 * Each chapter MUST provide a `narrations: Narration[]` array. Its length
 * is the chapter's step count — there is no `totalSteps` to maintain
 * separately. This guarantees the audio synthesis pipeline, the runtime
 * stepper, and the chapter `.tsx` switch on `step` cannot drift apart.
 *
 * Visual styling (color, fonts) comes entirely from the active theme —
 * chapters never hard-code palette / font names. See THEMES.md.
 */
export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "Git Worktree",
    narrations: coverNarrations,
    Component: Cover,
  },
  {
    id: "scenes",
    title: "日常就有這麼多切換現場",
    narrations: scenesNarrations,
    Component: Scenes,
  },
  {
    id: "switch-cost",
    title: "切換到底貴在哪",
    narrations: switchCostNarrations,
    Component: SwitchCost,
  },
  {
    id: "old-ways",
    title: "舊做法三種",
    narrations: oldWaysNarrations,
    Component: OldWays,
  },
  {
    id: "concept",
    title: "worktree 的概念",
    narrations: conceptNarrations,
    Component: Concept,
  },
  {
    id: "vs-clone",
    title: "跟多 clone 的差異",
    narrations: vsCloneNarrations,
    Component: VsClone,
  },
  {
    id: "esim",
    title: "手機與 eSIM 的比喻",
    narrations: esimNarrations,
    Component: Esim,
  },
  {
    id: "cmd-create",
    title: "指令：查看與建立",
    narrations: cmdCreateNarrations,
    Component: CmdCreate,
  },
  {
    id: "cmd-manage",
    title: "指令：移除與維護",
    narrations: cmdManageNarrations,
    Component: CmdManage,
  },
  {
    id: "traps",
    title: "共用帶來的坑",
    narrations: trapsNarrations,
    Component: Traps,
  },
  {
    id: "vscode",
    title: "VS Code 擴充套件",
    narrations: vscodeNarrations,
    Component: Vscode,
  },
  {
    id: "agent-risk",
    title: "Coding Agent 的共享目錄風險",
    narrations: agentRiskNarrations,
    Component: AgentRisk,
  },
  {
    id: "agent-isolation",
    title: "一個 task 一棵 worktree",
    narrations: agentIsolationNarrations,
    Component: AgentIsolation,
  },
  {
    id: "closing",
    title: "什麼時候不該用",
    narrations: closingNarrations,
    Component: Closing,
  },
];
