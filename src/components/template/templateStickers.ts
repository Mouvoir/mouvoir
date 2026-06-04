// Fixed catalogue of template stickers for the /template landing page.
// Each sticker is a self-contained `_anim` video (cutout + neon title + tools,
// baked in on a black background) positioned freely to recreate the comp.
// Positions are percentages relative to their screen box; tuned against
// doc/01_TEMPLATE_BIEN_MISE.pdf.

export interface TemplateSticker {
  /** public/ folder holding `<folder>_anim.{webm,mov}` */
  folder: string;
  /** URL slug for the future detail page at /template/<slug> */
  slug: string;
  /** Spoken label for a11y (title is baked into the video) */
  title: string;
  /** Which full-height screen the sticker belongs to */
  screen: 1 | 2;
  /** Left edge, % of screen width */
  left: number;
  /** Top edge, % of screen height */
  top: number;
  /** Width, % of screen width (height follows the video aspect ratio) */
  width: number;
  /** Template consolidated to a single clip: use `<folder>/<folder>` as the
   *  sticker source instead of the default `<folder>/<folder>_anim`. */
  noAnim?: boolean;
}

export const TEMPLATE_STICKERS: TemplateSticker[] = [
  // --- Screen 1 ---
  { folder: "phone_move", slug: "phone-move", title: "Phone Move", screen: 1, left: 4, top: 18, width: 26 },
  { folder: "mirror_mirror", slug: "mirror-mirror", title: "Mirror Mirror", screen: 1, left: 33, top: 14, width: 26 },
  { folder: "it_has_to_shine", slug: "it-has-to-shine", title: "It Has To Shine", screen: 1, left: 64, top: 22, width: 32 },
  { folder: "lighting_you", slug: "lighting-you", title: "Lighting You", screen: 1, left: 22, top: 58, width: 30, noAnim: true },
  { folder: "shade_and_shape", slug: "shade-and-shape", title: "Shade & Shape", screen: 1, left: 54, top: 60, width: 26 },
  // --- Screen 2 ---
  { folder: "fairy_hands", slug: "fairy-hands", title: "Fairy Hands", screen: 2, left: 3, top: 18, width: 36 },
  { folder: "dance_lens", slug: "dance-lens", title: "Dance Lens", screen: 2, left: 39, top: 12, width: 35 },
  { folder: "motion_skeleton", slug: "motion-skeleton", title: "Motion Skeleton", screen: 2, left: 26, top: 50, width: 33 },
  { folder: "body_canvas", slug: "body-canvas", title: "Body Canvas", screen: 2, left: 71, top: 22, width: 30 },
];
