// Shared staggered-entrance helper for the /template/* tutorial scenes
// (Phone Move, Lighting You, Fairy Hands, Dance Lens). Each scene's stickers
// fade in one after another; the CSS lives in the `.scene-reveal` class in
// globals.css and reads the per-element start time from `--reveal-delay`.

import type { CSSProperties } from "react";

/** Default gap (seconds) between consecutive stickers' entrance reveals when no
 *  explicit `delay` is set on the layout element. */
export const SCENE_STAGGER =0.2;

/** Inline CSS vars driving a single element's staggered entrance. An explicit
 *  per-element `delay` (seconds) overrides the automatic order-based stagger. */
export function revealVars(index: number, delay?: number): CSSProperties {
  const value = delay ?? index * SCENE_STAGGER;
  return { "--reveal-delay": `${value}s` } as CSSProperties;
}
