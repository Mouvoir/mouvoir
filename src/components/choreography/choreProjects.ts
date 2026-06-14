export interface ChoreLayerData {
  /**
   * Rendering mode:
   *   'video' — renders <video autoPlay muted loop playsInline> with mov→webm sources
   *             + png poster. `asset` is the base path WITHOUT extension,
   *             e.g. "greyclub/greyclub_infos01" → appends .mov / .webm / .png.
   *   'image' — renders <img>. `asset` is the FULL path INCLUDING extension,
   *             e.g. "greyclub/greyclub_jingle_titre00.png".
   */
  kind: "video" | "image";
  /** See `kind` doc-comment for the extension convention. Relative to public/ root. */
  asset: string;
  /** Left edge, % of the .screen box width */
  left: number;
  /** Top edge, % of the .screen box height */
  top: number;
  /** Width, % of the .screen box width */
  width: number;
  /**
   * When present, the layer is wrapped in a Next.js <Link href={href}>.
   * The media element inside always carries pointer-events:none so only
   * the Link wrapper is interactive.
   * When absent, the layer is purely decorative (.layer has pointer-events:none).
   */
  href?: string;
  /**
   * Accessible label used as aria-label on the <Link> wrapper.
   * Required when href is set; omit for decorative layers.
   */
  label?: string;
}

const BACK_LAYER: ChoreLayerData = {
  kind: "video",
  asset: "back_bleu/back_bleu",
  left: 0,
  top: 0,
  width: 5,
  href: "/choreography-styles",
  label: "Back to choreography styles",
};

interface ProjectLinks {
  /** Template detail page the "keep moving" sticker links to. */
  keepMovingHref: string;
}

// Per-project cross-link targets. "keep moving" bridges a choreography project
// back to the template it was made with. "follow the beats" (the external VJ
// link) is declared inline in CHORE_PROJECTS below, since only some projects
// ship that layer and each is positioned individually.
const PROJECT_LINKS: Record<string, ProjectLinks> = {
  greyclub: { keepMovingHref: "/template/phone-move" },
  urbex: { keepMovingHref: "/template/phone-move" },
  "quantu-motion": { keepMovingHref: "/template/motion-skeleton" },
  brightness: { keepMovingHref: "/template/fairy-hands" },
  light: { keepMovingHref: "/template/lighting-you" },
  yoyo: { keepMovingHref: "/template/lighting-you" },
  turfuzz: { keepMovingHref: "/template/body-canvas" },
  "modul-aura": { keepMovingHref: "/template/dance-lens" },
  "jam-ctrl-f": { keepMovingHref: "/template/motion-skeleton" },
  milas: { keepMovingHref: "/template/dance-lens" },
};

function keepMovingLayer(slug: string): ChoreLayerData {
  return {
    kind: "video",
    asset: "keep_moving/keep_moving",
    left: 83,
    top: 60,
    width: 14,
    href: PROJECT_LINKS[slug]?.keepMovingHref ?? "/choreography-styles",
    label: "Keep Moving",
  };
}

const CHORE_PROJECTS: Record<string, ChoreLayerData[]> = {
  greyclub: [
    { kind: "video", asset: "greyclub/greyclub", left: 72, top: 0, width: 24 },
    { kind: "video", asset: "phone_move/phone_move_video", left: 2, top: 10, width: 65 },
    { kind: "image", asset: "phone_move/phone_move_jingle/phone_move_jingle_3.png", left: 45, top: 14, width: 25},
    { kind: "image", asset: "phone_move/phone_move_jingle/phone_move_jingle_2.png", left: -3, top: 10, width: 33 },
    { kind: "video", asset: "greyclub/greyclub_infos01", left: 67, top: 20, width: 22 },
    { kind: "video", asset: "greyclub/greyclub_infos02", left: 77, top: 32, width: 24 },
  ],
  urbex: [
    { kind: "video", asset: "urbex/urbex", left: 1, top: 10, width: 65 },
    { kind: "video", asset: "urbex/urbex_titre", left: 72, top: 0, width: 24 },
    { kind: "video", asset: "urbex/urbex_infos02", left: 70, top: 36, width: 24 },
    { kind: "video", asset: "urbex/urbex_infos01", left: 65, top: 19, width: 20 },
    { kind: "image", asset: "urbex/urbex_jingle_020.png", left: -9, top: 6, width: 40 },
    { kind: "image", asset: "urbex/urbex_jingle_030.png", left: 42, top: 53, width: 30 },
    { kind: "video", asset: "follow_the_beats_bleu/follow_the_beats_bleu", left: 68, top: 68, width: 16, href: "https://www.allierozetta.com/all/vjart/urbex-10-3/", label: "Follow the beats" },
  ],
  "quantu-motion": [
    { kind: "video", asset: "quantu_motion/quantu_motion", left: 2, top: 10, width: 65 },
    { kind: "video", asset: "quantu_motion/quantu_motion_titre", left: 72, top: 0, width: 24 },
    { kind: "video", asset: "quantu_motion/quantu_motion_infos01", left: 65, top: 20, width: 22 },
    { kind: "video", asset: "quantu_motion/quantu_motion_infos02", left: 73, top: 35, width: 20 },
    { kind: "image", asset: "quantu_motion/quantu_motion_jingle020.png", left: -10, top: 18, width: 30 },
    { kind: "image", asset: "quantu_motion/quantu_motion_jingle0300.png", left: 40, top: 0, width: 30 },
    { kind: "image", asset: "quantu_motion/quantu_motion_jingle010.png", left: 40, top: 40, width: 30 },
    { kind: "video", asset: "follow_the_beats_bleu/follow_the_beats_bleu", left: 66, top: 70, width: 13, href: "https://www.allierozetta.com/all/vjart/quantumotion/", label: "Follow the beats" },
  ],
  brightness: [
    { kind: "video", asset: "jam_ctrlf_f/jam_ctrlf_f_fairy_hands", left: 2, top: 10, width: 65 },
    { kind: "video", asset: "brightness/brightness", left: 72, top: 0, width: 24 },
    { kind: "video", asset: "brightness/brightness_infos01", left: 65, top: 20, width: 22 },
    { kind: "video", asset: "brightness/brightness_infos02", left: 73, top: 32, width: 22 },
    { kind: "image", asset: "jam_ctrlf_f/jam_ctrlf_f_020.png", left: 2, top: 5, width: 20 },
    { kind: "image", asset: "jam_ctrlf_f/jam_ctrlf_f_010.png", left: 35, top: 5, width: 22 },
    { kind: "image", asset: "jam_ctrlf_f/jam_ctrlf_f_030.png", left: 54, top: 52, width: 20 },
  ],
  light: [
    { kind: "video", asset: "still_in_training_bleu/still_in_training_bleu", left: 30, top: 0, width: 35 },
    { kind: "video", asset: "two_pers_dansent_thermal_bleu/two_pers_dansent_thermal_bleu", left: 0, top: 18, width: 35 },
    { kind: "video", asset: "light/light_anim", left: 28, top: 38, width: 40 },
  ],
  yoyo: [
    { kind: "video", asset: "still_in_training_bleu/still_in_training_bleu", left: 30, top: 0, width: 35 },
    { kind: "video", asset: "two_pers_dansent_thermal_bleu/two_pers_dansent_thermal_bleu", left: 0, top: 18, width: 35 },
    { kind: "video", asset: "yoyo/yoyo_anim", left: 28, top: 38, width: 40 },
  ],
  turfuzz: [
    { kind: "video", asset: "still_in_training_bleu/still_in_training_bleu", left: 30, top: 0, width: 35 },
    { kind: "video", asset: "two_pers_dansent_thermal_bleu/two_pers_dansent_thermal_bleu", left: 0, top: 18, width: 35 },
    { kind: "video", asset: "turfuzz/turfuzz_anim", left: 28, top: 38, width: 40 },
    { kind: "video", asset: "follow_the_beats_bleu/follow_the_beats_bleu", left: 10, top: 72, width: 16, href: "https://www.allierozetta.com/all/filmphoto/turfuzz-ft-pumpum-paradise/", label: "Follow the beats" },
  ],
  "modul-aura": [
    { kind: "video", asset: "still_in_training_bleu/still_in_training_bleu", left: 30, top: 0, width: 35 },
    { kind: "video", asset: "two_pers_dansent_thermal_bleu/two_pers_dansent_thermal_bleu", left: 0, top: 18, width: 35 },
    { kind: "video", asset: "modul_aura/modul_aura_anim", left: 30, top: 35, width: 40 },
    { kind: "video", asset: "follow_the_beats_bleu/follow_the_beats_bleu", left: 10, top: 72, width: 16, href: "https://www.allierozetta.com/all/vjart/modulaura/", label: "Follow the beats" },
  ],
  "jam-ctrl-f": [
    { kind: "video", asset: "still_in_training_bleu/still_in_training_bleu", left: 30, top: 0, width: 35 },
    { kind: "video", asset: "two_pers_dansent_thermal_bleu/two_pers_dansent_thermal_bleu", left: 0, top: 18, width: 35 },
    { kind: "video", asset: "jam_ctrlf_f/jam_ctrlf_f_anim",left: 28, top: 11, width: 40 },
  ],
  milas: [
    { kind: "video", asset: "still_in_training_bleu/still_in_training_bleu", left: 30, top: 0, width: 35 },
    { kind: "video", asset: "two_pers_dansent_thermal_bleu/two_pers_dansent_thermal_bleu", left: 0, top: 18, width: 35 },
    { kind: "video", asset: "milas/milas_anim",left: 28, top: 25, width: 40 },
  ],
};

/**
 * Returns [BACK_LAYER, ...uniqueLayers, keepMovingLayer]
 * or null if slug is not in CHORE_PROJECTS. The "keep moving" sticker links
 * back to the template this project was made with (see PROJECT_LINKS).
 */
export function getChoreProject(slug: string): ChoreLayerData[] | null {
  const unique = CHORE_PROJECTS[slug];
  if (!unique) return null;
  return [ ...unique, keepMovingLayer(slug),BACK_LAYER];
}

/**
 * Returns the list of all detail slugs. Used by generateStaticParams.
 * Must return exactly the same 10 slugs as the landing CHORE_STICKERS array.
 */
export function getAllChoreSlugs(): string[] {
  return Object.keys(CHORE_PROJECTS);
}
