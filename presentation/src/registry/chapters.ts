import type { ChapterDef } from "./types";
import OverloadedDeveloper from "../chapters/01-overloaded-developer/OverloadedDeveloper";
import { narrations as overloadedDeveloperNarrations } from "../chapters/01-overloaded-developer/narrations";

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
    id: "overloaded-developer",
    title: "分支切換不是例外，是日常",
    narrations: overloadedDeveloperNarrations,
    Component: OverloadedDeveloper,
  },
];
