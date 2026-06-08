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
  screen: 1 | 2 | 3;
  /** Left edge, % of screen width */
  left: number;
  /** Top edge, % of screen height */
  top: number;
  /** Width, % of screen width (height follows the video aspect ratio) */
  width: number;
  /** Override for the hover "_pres" info-card clip (path relative to public/,
   *  no extension). Defaults to `<folder>/<folder>_pres`; a few templates ship
   *  theirs nested in their own sub-folder instead — see asset audit notes in
   *  TemplateSticker.tsx. */
  presPath?: string;
}

export const TEMPLATE_STICKERS: TemplateSticker[] = [
  // --- Screen 1 ---
  { folder: "phone_move", slug: "phone-move", title: "Phone Move", screen: 1, left: -10, top: 10, width: 42, presPath: "phone_move/phone_move_pres/phone_move_pres" },
  { folder: "lighting_you", slug: "lighting-you", title: "Lighting You", screen: 1, left: 25, top: 10, width: 42, presPath: "lighting_you/lighting_you_pres/lighting_you_pres" },
  { folder: "dance_lens", slug: "dance-lens", title: "Dance Lens", screen: 1, left: 66, top: 5, width: 42, presPath: "dance_lens/dance_lens_pres/dance_lens_pres" },
  { folder: "motion_skeleton", slug: "motion-skeleton", title: "Motion Skeleton", screen: 1, left: 12, top: 50, width: 42 },
  { folder: "fairy_hands", slug: "fairy-hands", title: "Fairy Hands", screen: 1, left: 50, top: 55, width: 42, presPath: "fairy_hands/pres_fairy_hands/pres_fairy_hands" },
  // --- Screen 2 ---
  { folder: "shade_and_shape", slug: "shade-and-shape", title: "Shade & Shape", screen: 2, left: 15, top: 5, width: 42 },
  { folder: "body_canvas", slug: "body-canvas", title: "Body Canvas", screen: 2, left: 65, top: -2, width: 45 },
  { folder: "mirror_mirror", slug: "mirror-mirror", title: "Mirror Mirror", screen: 2, left: 0, top: 50, width: 42 },
  { folder: "it_has_to_shine", slug: "it-has-to-shine", title: "It Has To Shine", screen: 2, left: 40, top: 48, width: 42 },
];
