// Declarative layout for the charter consent screen.
//
// Each rule has two layouts:
//  - `grid`  : the tilt/scale applied to its sticker in the 3x2 landing grid.
//  - `detail`: the full-screen "expanded" composition shown when the rule is
//              clicked, mirroring the comps in doc/SITE_entier.pdf (pages 2-6).
//
// Detail layer coordinates are percentages of the scene (viewport): `top`/`left`
// place the layer's top-left corner, `width` sizes it relative to the viewport
// width (height follows the sticker's intrinsic ratio). `detail` holds ONLY the
// rule's secondary stickers (the a/b/c variants) — the main sticker stays put in
// its grid cell when the rule is opened, it does not move. Values are eyeballed
// from the PDF and meant to be fine-tuned live.

export interface StickerLayer {
  folder: string;
  name: string;
  top: number;
  left: number;
  width: number;
  rotation: number;
}

export interface CharterRule {
  id: string;
  label: string;
  grid: { rot: number; scale: number };
  back: { top: number; left: number; width: number };
  detail: StickerLayer[];
}

// Helper to keep the asset path/name pair consistent with the public/ layout.
function layer(
  name: string,
  pos: { top: number; left: number; width: number; rotation?: number },
): StickerLayer {
  const dir = name.slice(0, "regle_00".length); // "regle_01a" -> "regle_01"
  return {
    folder: `${dir}/${name}`,
    name,
    top: pos.top,
    left: pos.left,
    width: pos.width,
    rotation: pos.rotation ?? 0,
  };
}

export const RULES: Record<string, CharterRule> = {
  // AUDIENCE AWARENESS — PDF p.2
  regle_01: {
    id: "regle_01",
    label: "Audience awareness",
    grid: { rot: -4, scale: 1.12 },
    back: { top: 5, left: 85, width: 11 },
    detail: [
      layer("regle_01b", {top: 8, left: 38, width: 60}), // PUBLIC NOTICE / By attending
      layer("regle_01a", {top: 42, left: 2, width: 43, rotation: -2}), // Before each use
    ],
  },

  // NO RECORD — PDF p.3
  regle_02: {
    id: "regle_02",
    label: "No record",
    grid: { rot: -2.5, scale: 1.12 },
    back: { top: 5, left: 3, width: 11 },
    detail: [
      layer("regle_02b", {top: 13, left: 27, width: 60}), // Filmed moments
      layer("regle_02a", {top: 64, left: 42, width: 45}), // Mouvoir prioritises
    ],
  },

  // THE ANONYMITY OF DANCERS — PDF p.4
  regle_03: {
    id: "regle_03",
    label: "The anonymity of dancers",
    grid: { rot: 2.5, scale: 1.12 },
    back: { top: 7, left: 4, width: 9 },
    detail: [
      layer("regle_03a", {top: 19.5, left: 0.5, width: 40.5}), // CAMERA captures ENERGY
      layer("regle_03b", {top: 5.5, left: 32, width: 38.5}), // Videos must never be broadcast
      layer("regle_03c", {top: 21.5, left: 65, width: 34}), // This guarantees
    ],
  },

  // RADICAL BODY INCLUSION — PDF p.5
  regle_04: {
    id: "regle_04",
    label: "Radical body inclusion",
    grid: { rot: 4, scale: 1.12 },
    back: { top: 4.5, left: 3.7, width: 10 },
    detail: [
      layer("regle_04b", {top: 4, left: 3, width: 63}), // NO body type
      layer("regle_04a", {top: -8, left: 60, width: 41, rotation: 3}), // Visuals must celebrate diversity
      layer("regle_04c", {top: 53, left: 5, width: 61}), // This rule means avoiding
    ],
  },

  // DIGITAL CARE — PDF p.6
  regle_05: {
    id: "regle_05",
    label: "Digital care",
    grid: { rot: 3.5, scale: 1.12 },
    back: { top: 7.5, left: 3.6, width: 10 },
    detail: [
      layer("regle_05a", {top: 16.5, left: 9, width: 33}), // NEVER TARGET ISOLATE HARASS
      layer("regle_05b", {top: 52.5, left: 40, width: 52}), // Zooming intrusively
    ],
  },
};
