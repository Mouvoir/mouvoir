// Declarative layout for the "Fairy Hands" template tutorial view
// (/template/fairy-hands). Mirrors the comps in doc/fairy_hand/SITE_*.pdf.
// Shared types and rendering live in sceneTypes.ts / TemplateScene.tsx.
//
// All thermal/neon clips here are real-alpha cutouts (see ALPHA_REPORT.md:
// min alpha = 0), so they composite normally — no `mix-blend-mode: screen`.
// The only opaque clip is the central hero `fairy_hands.mov`.

import type {
  HeroEl,
  InfoBubble,
  SceneLayout,
  StickerEl,
  ToolObject,
} from "./sceneTypes";

type InfoId =
  | "glitter"
  | "camera"
  | "light"
  | "controller"
  | "whisper"
  | "keepMoving";

const HERO: HeroEl = {
  folder: "fairy_hands/fairy_hands_tuto",
  name: "fairy_hands_tuto",
  label: "Fairy Hands — résultat",
  top: 20,
  left: 26,
  width: 50,
};

// Static stickers. `back` returns to the template landing; `lighting_you`
// cross-links to its own tutorial; `whisper` doubles as a bubble trigger.
const STICKERS: StickerEl<InfoId>[] = [
  { folder: "fairy_hands/pres_fairy_hands", name: "pres_fairy_hands", label: "Fairy Hands — présentation", top: -2, left: -1, width: 40 },
  { folder: "back", name: "back", label: "Retour aux templates", href: "/", top: 0, left: 0, width: 7 },
  { folder: "step_by_step_thermal", name: "step_by_step_thermal", label: "Step by step", top: 5, left: 31, width: 42 },
  { folder: "tool_kit_rose_thermal", name: "tool_kit_rose_thermal", label: "Tool kit", top: 1, left: 83, width: 16 },
  { folder: "whisper_thermal", name: "whisper_thermal", label: "Whisper", top: 60, left: 78, width: 22, info: "whisper" },
  { folder: "keep_moving", name: "keep_moving", label: "Keep moving — voir les projets", info: "keepMoving", top: 54, left: 10, width: 15 },
  { folder: "lighting_you", name: "lighting_you", label: "Lighting you", href: "/template/lighting-you", top: 70, left: 80, width: 16 },
];

// Tool-kit objects on the right, top to bottom. Each reveals one bubble.
const TOOLS: ToolObject<InfoId>[] = [
  { src: "/fairy_hands/objet/objet_01.png", alt: "Paillettes en flacon", info: "glitter", top: 8, left: 73, width: 12 },
  { src: "/fairy_hands/objet/objet_02.png", alt: "Paillettes en coupelle", info: "glitter", top: 12, left: 78, width: 10 },
  { src: "/fairy_hands/objet/objet_04.png", alt: "Webcam", info: "camera", top: 26, left: 79, width: 11 },
  { src: "/fairy_hands/objet/objet_03.png", alt: "Lampe torche", info: "light", top: 30, left: 85, width: 11 },
  { src: "/fairy_hands/objet/objet_05.png", alt: "Contrôleur MIDI", info: "controller", top: 32, left: 89, width: 12 },
];

// Speech bubbles, keyed by the trigger that reveals them.
const BUBBLES: InfoBubble<InfoId>[] = [
  { id: "glitter", folder: "fairy_hands/fairy_hands_glitterinfos", name: "fairy_hands_glitterinfos", top: 4, left: 62, width: 21 },
  { id: "camera", folder: "fairy_hands/fairy_hands_camerainfos", name: "fairy_hands_camerainfos", top: 25, left: 66, width: 20 },
  { id: "light", folder: "fairy_hands/fairy_hands_lightinfos", name: "fairy_hands_lightinfos", top: 35, left: 69, width: 22 },
  { id: "controller", folder: "fairy_hands/fairy_hands_controllerinfos", name: "fairy_hands_controllerinfos", top: 40, left: 80, width: 19 },
  { id: "whisper", folder: "fairy_hands/fairy_hands_whisperinfos", name: "fairy_hands_whisperinfos", top: 68, left: 70, width: 21 },
  // Choreography projects made with this template — one bubble per link, each
  // positioned independently (id "keepMoving" ties them to the keep_moving
  // sticker, top:54 left:10 w:15). Keep adjacent so the pointer can bridge; tune
  // positions visually. Brightness ships a dedicated clip for this page.
  { id: "keepMoving", slug: "brightness", folder: "brightness", name: "brightness_fairy_hands", title: "Brightness", top: 48, left: 24, width: 15 },
];

export const fairyHandsScene: SceneLayout<InfoId> = {
  slug: "fairy-hands",
  hero: HERO,
  stickers: STICKERS,
  tools: TOOLS,
  bubbles: BUBBLES,
};
