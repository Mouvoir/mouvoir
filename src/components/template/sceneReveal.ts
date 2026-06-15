// Shared staggered-entrance helper for the /template/* tutorial scenes
// (Phone Move, Lighting You, Fairy Hands, Dance Lens). Each scene's stickers
// fade in one after another; the CSS lives in the `.scene-reveal` class in
// globals.css and reads the per-element start time from `--reveal-delay`.

import type { CSSProperties } from "react";

/** Default gap (seconds) between consecutive stickers' entrance reveals when no
 *  explicit `delay` is set on the layout element. */
export const SCENE_STAGGER =0.5;

/** Gap (seconds) between consecutive semantic reveal steps (see `step` in
 *  sceneTypes.ts): title → tool kit → whisper → result video → related links.
 *  Slightly under the 0.55s fade so the groups read as one flowing sequence. */
export const REVEAL_STEP_GAP = 0.5;

/** Inline CSS vars driving a single element's staggered entrance. Precedence:
 *  an explicit `delay` wins; otherwise a semantic `step` places the element in
 *  its group's slot; otherwise it auto-staggers by render `index`. */
export function revealVars(
  index: number,
  delay?: number,
  step?: number,
): CSSProperties {
  const value =
    delay ??
    (step !== undefined ? step * REVEAL_STEP_GAP : index * SCENE_STAGGER);
  return { "--reveal-delay": `${value}s` } as CSSProperties;
}
