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
  /** Template consolidated to a single clip: use `<folder>/<folder>` as the
   *  sticker source instead of the default `<folder>/<folder>_anim`. */
  noAnim?: boolean;
  /** Override for the hover "_pres" info-card clip (path relative to public/,
   *  no extension). Defaults to `<folder>/<folder>_pres`; a few templates ship
   *  theirs nested in their own sub-folder instead — see asset audit notes in
   *  TemplateSticker.tsx. */
  presPath?: string;
}

export const TEMPLATE_STICKERS: TemplateSticker[] = [
  // --- Screen 1 ---
  { folder: "phone_move", slug: "phone-move", title: "Phone Move", screen: 1, left: 4, top: 18, width: 26, presPath: "phone_move/phone_move_pres/phone_move_pres" },
  { folder: "mirror_mirror", slug: "mirror-mirror", title: "Mirror Mirror", screen: 1, left: 33, top: 14, width: 26 },
  { folder: "it_has_to_shine", slug: "it-has-to-shine", title: "It Has To Shine", screen: 1, left: 64, top: 22, width: 32 },
  { folder: "lighting_you", slug: "lighting-you", title: "Lighting You", screen: 1, left: 22, top: 58, width: 30, noAnim: true, presPath: "lighting_you/lighting_you_pres/lighting_you_pres" },
  { folder: "shade_and_shape", slug: "shade-and-shape", title: "Shade & Shape", screen: 1, left: 54, top: 60, width: 26 },
  // --- Screen 2 ---
  { folder: "fairy_hands", slug: "fairy-hands", title: "Fairy Hands", screen: 2, left: 3, top: 18, width: 36, presPath: "fairy_hands/pres_fairy_hands/pres_fairy_hands" },
  { folder: "dance_lens", slug: "dance-lens", title: "Dance Lens", screen: 2, left: 39, top: 12, width: 35, presPath: "dance_lens/dance_lens_pres/dance_lens_pres" },
  { folder: "motion_skeleton", slug: "motion-skeleton", title: "Motion Skeleton", screen: 2, left: 26, top: 50, width: 33 },
  { folder: "body_canvas", slug: "body-canvas", title: "Body Canvas", screen: 2, left: 71, top: 22, width: 30 },
  // --- Screen 3 ---
  { folder: "brightness",    slug: "brightness",    title: "Brightness",   screen: 3, left: 0, top: 0, width: 0 },
  { folder: "greyclub",      slug: "greyclub",      title: "Greyclub",     screen: 3, left: 0, top: 0, width: 0 },
  { folder: "quantu_motion", slug: "quantu-motion", title: "QUANTUMotion", screen: 3, left: 0, top: 0, width: 0 },
  { folder: "urbex",         slug: "urbex",         title: "Urbex",        screen: 3, left: 0, top: 0, width: 0 },
  { folder: "jam_ctrlf_f",   slug: "jam-ctrlf-f",   title: "Jam Ctrl+F",   screen: 3, left: 0, top: 0, width: 0 },
  { folder: "turfuzz",       slug: "turfuzz",       title: "Turfuzz",      screen: 3, left: 0, top: 0, width: 0 },
  { folder: "yoyo",          slug: "yoyo",          title: "Yoyo",         screen: 3, left: 0, top: 0, width: 0 },
  { folder: "modul_aura",    slug: "modul-aura",    title: "ModulAura",    screen: 3, left: 0, top: 0, width: 0 },
  { folder: "light",         slug: "light",         title: "Light",        screen: 3, left: 0, top: 0, width: 0 },
];
