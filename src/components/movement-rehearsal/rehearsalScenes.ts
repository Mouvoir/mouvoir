// Declarative layout for the movement-rehearsal collage.
//
// The page mirrors the charter (mouvoir-anatomy) interaction: a landing collage
// of entry stickers; clicking one opens that scene's full composition. The extra
// level the research comps add is the info bubble — clicking a sticker that owns
// an `info` toggles its text-bubble video on top (one open at a time).
//
// All coordinates are percentages of the black stage: `top`/`left` place the
// element's top-left corner, `width` sizes it relative to the stage width (height
// follows the asset's intrinsic ratio). Folder names are the snake_case web
// triples under public/ (see scripts/encode_movement_rehearsal.sh). Values are
// eyeballed from the PAGE_RECHERCHE comps and meant to be fine-tuned live.

export interface InfoBubble {
  folder: string;
  top: number;
  left: number;
  width: number;
}

export interface SceneSticker {
  folder: string;
  top: number;
  left: number;
  width: number;
  label?: string;
  // When present, clicking the sticker toggles this info bubble. Omit for purely
  // decorative title/footage stickers.
  info?: InfoBubble;
}

export interface Scene {
  id: string;
  label: string;
  // The entry sticker on the landing collage (also % of the stage).
  entry: { folder: string; top: number; left: number; width: number };
  stickers: SceneSticker[];
  back: { top: number; left: number; width: number };
}

export const SCENES: Scene[] = [
  // CORE — blue scene (comps p.6-9). Each VIDEO_CORE blob carries a baked title
  // (VIZBIZ / BABYBLAZER / MADAME IPSUM / ANTOINE); clicking it opens its info.
  {
    id: "core",
    label: "Core",
    entry: { folder: "core", top: 14, left: 4, width: 30},
    back: { top: 0, left: 0, width: 5 },
    stickers: [
      { folder: "core",  top: 14, left: 4, width: 30, label: "Core" },
      {
        folder: "video_core_03b", top: 10, left: 28, width: 27, label: "Madame Ipsum",
        info: { folder: "madamipsum_infos", top: 60, left: 30, width: 33 },
      },
      {
        folder: "video_core_04b", top: 0, left: 65, width: 25, label: "Antoine",
        info: { folder: "antoine_infos", top: 25, left: 54, width: 40 },
      },
      {
        folder: "video_core_01b", top: 42, left: 11, width: 17, label: "Vizbiz",
        info: { folder: "vizbiz_infos", top: 66, left: 14, width: 30 },
      },
      {
        folder: "video_core_02b", top: 48, left: 60, width: 26, label: "Babyblazer",
        info: { folder: "babyblazer_infos", top: 58, left: 45, width: 30 },
      },
    ],
  },

  // ON THE FLOOR OF RIO — purple scene (comps p.10-12).
  {
    id: "rio",
    label: "On the floor of Rio",
    entry: { folder: "on_the_floor_of_rio", top: 38, left: 36, width: 26},
    back: { top: 0, left: 0, width: 5 },
    stickers: [
      {
        folder: "on_the_floor_of_rio", top: 38, left: 36, width: 26, label: "On the floor of Rio",
      },
      {
        folder: "beatroot_01", top: 0, left: 10, width: 22, label: "Beatroot",
        info: { folder: "beatroot_01_infos", top: 55, left: 15, width: 30 },
      },
      { folder: "party_br", top: 0, left: 62, width: 30, label: "Party BR" ,
        info: { folder: "video_rio_01_infos", top: 22, left: 50, width: 34 }
      },
      {
        folder: "vs_party_eur", top: 56, left: 60, width: 32, label: "VS Party EUR",
        info: { folder: "vs_party_eur_infos", top: 60, left: 45, width: 30 },
      },
    ],
  },

  // CONNEXIONS DE NUITS — pink/orange scene (comps p.2-5).
  {
    id: "connexions",
    label: "Connexions de nuits",
    entry: { folder: "party_party", top: 0, left: 68, width: 24},
    back: { top: 0, left: 0, width: 5 },
    stickers: [
      { folder: "party_party_titre", top: 0, left: 68, width: 24,  label: "Party Party" },
      {
        folder: "crtl_f_jam02", top: 28, left: 6, width: 20,  label: "Jam Ctrl+F",
        info: { folder: "crtl_f_jam_infos02", top: 50, left: 5, width: 32 },
      },
      {
        folder: "beatroot_02", top: 10, left: 36, width: 20, label: "Beatroot",
        info: { folder: "beatroot_02_infos", top: 45, left: 20, width: 32 },
      },
      {
        folder: "insolation_visuelle", top: 40, left: 56, width: 20, label: "Insolation Visuelle",
        info: { folder: "insolation_visuelle_infos", top: 55, left: 65, width: 30 },
      },
    ],
  },

  // CTRL+F — pink scene (comps p.13-16). allies_titre / allies_infos were not in
  // the delivered masters yet; they activate when their triples land under public/.
  {
    id: "ctrl_f",
    label: "Ctrl+F",
    entry: { folder: "ctrl_f", top: 62, left: 4, width: 30},
    back: { top: 0, left: 0, width: 5 },
    stickers: [
      {
        folder: "crtl_f_video", top: 0, left: 4, width: 30, label: "Association Ctrl+F",
        info: { folder: "crtl_f_infos", top: 20, left: 2, width: 34 },
      },
      {
        folder: "finta_titre", top: 5, left: 40, width: 25, label: "FINTA",
        info: { folder: "finta_infos", top: 30, left: 50, width: 34 },
      },
      {
        folder: "allies_titre", top: 56, left: 40, width: 22, label: "Allies",
        info: { folder: "allies_infos", top: 55, left: 10, width: 34 },
      },
      {
        folder: "crtl_f_jam", top: 0, left: 70, width: 32,  label: "Jam Ctrl+F",
        info: { folder: "crtl_f_jam_infos", top: 50, left: 60, width: 34 },
      },
      { folder: "ctrl_f", top: 62, left: 4, width: 30, label: "Ctrl+F" },
    ],
  },
];
