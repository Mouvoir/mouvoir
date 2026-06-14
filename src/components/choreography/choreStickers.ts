// Fixed catalogue of choreography ("choré") stickers for the
// /choreography-styles landing page. Each sticker is a self-contained `_anim`
// video (cutout + neon title + artist name baked in on a black background),
// positioned freely to recreate the comp in doc/PAGE_PROJET_EXPLICATION.pdf.
// Positions are percentages relative to the single full-height screen box.

export interface ChoreSticker {
  /** public/ folder holding `<folder>_anim.{mov,webm,png}` */
  folder: string;
  /** URL slug for the future detail page at /choreography-styles/<slug> */
  slug: string;
  /** Visible / spoken title (also baked into the video) */
  title: string;
  /** Credited choreographer(s) — baked into the video, surfaced for a11y */
  artist: string;
  /** Left edge, % of screen width */
  left: number;
  /** Top edge, % of screen height */
  top: number;
  /** Width, % of screen width (height follows the video aspect ratio) */
  width: number;
  /** Reserved slot with no `_anim` asset yet (renders a placeholder box) */
  placeholder?: boolean;
}

// Positions are the VIDEO FRAME box (not the visible cutout). Each `_anim`
// clip bakes its art onto a large black canvas with heavy transparent padding,
// so `left`/`width` (% of screen width) and `top` (% of screen height) place
// the whole frame — the screen-blended padding falls offscreen and the visible
// art lands where the comp shows it. Values are derived from the comp visible
// bounds combined with each poster's measured content-within-frame ratios.
export const CHORE_STICKERS: ChoreSticker[] = [
  { folder: "light", slug: "light", title: "Light", artist: "Lise", left: 15.8, top: 0, width: 20 },
  { folder: "quantu_motion", slug: "quantu-motion", title: "QUANTUMotion", artist: "Rozetta", left: 27.5, top: -10, width: 40 },
  { folder: "greyclub", slug: "greyclub", title: "Greyclub", artist: "Mathilde", left: 57.4, top: 0, width: 38.9 },
  { folder: "urbex", slug: "urbex", title: "Urbex 10.3", artist: "Rozetta", left: 14, top: 28, width: 35.1 },
  // yoyo nudged ~1.2% left so its right edge fits inside the 1760 screen box.
  { folder: "yoyo", slug: "yoyo", title: "Yoyo", artist: "Lise", left: 78.9, top: 25.6, width: 26.2 },
  { folder: "jam_ctrlf_f", slug: "jam-ctrl-f", title: "Jam Ctrl+F", artist: "Rozetta + Lise", left: 59.8, top: 40, width: 21.3 },
  // turfuzz/modul_aura nudged up so their bottoms clear the screen box bottom.
  { folder: "turfuzz", slug: "turfuzz", title: "Turfuzz", artist: "Rozetta", left: -0.9, top: 63.1, width: 20 },
  { folder: "modul_aura", slug: "modul-aura", title: "ModulAura", artist: "Rozetta", left: 25.1, top: 65.2, width: 20},
  { folder: "milas", slug: "milas", title: "Mila's", artist: "Lise", left: 76.4, top: 57.9, width: 23.4 },
  { folder: "brightness", slug: "brightness", title: "Brightness", artist: "Rozetta + Lise", left: -18, top: 8, width: 53.7 },
];
