// Template-based filters for the /choreography-styles landing page.
// The "Threshold Thermal" sticker becomes a custom dropdown whose options are
// the templates; picking one shows only the choreographies made with it.
//
// This is a deliberately separate map from choreProjects.ts#PROJECT_LINKS:
//   - PROJECT_LINKS    — chore → the single template it was MADE WITH ("keep moving")
//   - CHORE_FILTERS    — template → the (many) choreographies tagged under it (landing filter)
// They answer different questions, so they are not merged. Keep them in sync.

import { CHORE_STICKERS } from "./choreStickers";

export interface ChoreFilter {
  /** Template slug (matches /template/<slug>). */
  slug: string;
  /** Visible template title shown in the dropdown. */
  title: string;
  /** Choreography slugs (from CHORE_STICKERS) shown when this filter is active. */
  choreSlugs: string[];
}

export const CHORE_FILTERS: ChoreFilter[] = [
  { slug: "phone-move", title: "Phone Move", choreSlugs: ["urbex", "greyclub"] },
  { slug: "motion-skeleton", title: "Motion Skeleton", choreSlugs: ["jam-ctrl-f", "modul-aura"] },
  { slug: "lighting-you", title: "Lighting You", choreSlugs: ["brightness", "light", "yoyo"] },
  { slug: "fairy-hands", title: "Fairy Hands", choreSlugs: ["brightness"] },
  { slug: "dance-lens", title: "Dance Lens", choreSlugs: ["quantu-motion", "modul-aura", "milas"] },
  { slug: "it-has-to-shine", title: "It Has To Shine", choreSlugs: ["brightness", "yoyo"] },
  { slug: "body-canvas", title: "Body Canvas", choreSlugs: ["greyclub", "turfuzz"] },
];

// The dropdown trigger reuses the threshold sticker's asset + collage position
// so it sits exactly where the sticker used to. `anim: false` → base triple.
export const FILTER_TRIGGER = {
  folder: "threshold_thermal_bleu",
  left: 5,
  top: 0,
  width: 10,
} as const;

/**
 * Returns the choreography stickers visible for the active filter.
 * `null` (no filter) shows the whole catalogue.
 */
export function filterChoreStickers(filterSlug: string | null) {
  if (!filterSlug) return CHORE_STICKERS;
  const filter = CHORE_FILTERS.find((f) => f.slug === filterSlug);
  if (!filter) return CHORE_STICKERS;
  const allowed = new Set(filter.choreSlugs);
  return CHORE_STICKERS.filter((sticker) => allowed.has(sticker.slug));
}
