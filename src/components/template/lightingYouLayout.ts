// Declarative layout for the "Lighting You" template tutorial view
// (/template/lighting-you). Mirrors the comps in doc/lighting_you/LIGHTING_YOU_EXPLICATION.pdf.
// Shared types and rendering live in sceneTypes.ts / TemplateScene.tsx.
//
// Note: lighting_you_anim.mov/.webm ship without a .png poster — AssetVideo's poster
// 404s harmlessly since the clip autoplays.

import type {
  HeroEl,
  InfoBubble,
  SceneLayout,
  StickerEl,
  ToolObject,
} from "./sceneTypes";

type InfoId = "tape" | "makeup" | "flash" | "camera" | "whisper" | "keepMoving";

const HERO: HeroEl = {
  folder: "lighting_you/lighting_you_tuto",
  name: "lighting_you_tuto",
  label: "Lighting You — résultat",
  top: 20,
  left: 25,
  width: 50,
};

const STICKERS: StickerEl<InfoId>[] = [
  { folder: "lighting_you/lighting_you_pres", name: "lighting_you_pres", label: "Lighting You — présentation", top: -10, left: 0, width: 35 },
  { folder: "back", name: "back", label: "Retour aux templates", href: "/", top: 0, left: 0, width: 6 },
  { folder: "step_by_step_thermal", name: "step_by_step_thermal", label: "Step by step", top: 1, left: 29, width: 50 },
  { folder: "tool_kit_rose_thermal", name: "tool_kit_rose_thermal", label: "Tool kit", top: 1, left: 83, width: 16 },
  { folder: "whisper_thermal", name: "whisper_thermal", label: "Whisper", top: 65, left: 80, width: 20, info: "whisper" },
  { folder: "keep_moving", name: "keep_moving", label: "Keep moving — voir les projets", info: "keepMoving", top: 60, left: 0, width: 15 },
];

const TOOLS: ToolObject<InfoId>[] = [
  { src: "/lighting_you/objet/objet_02.png", alt: "Tape", info: "tape", top: 4, left: 73, width: 16 },
  { src: "/lighting_you/objet/objet_01.png", alt: "Lipstick / makeup", info: "makeup", top: 13, left: 77, width: 16 },
  { src: "/lighting_you/objet/objet_04.png", alt: "Phone", info: "camera", top: 20, left: 79, width: 16 },
  { src: "/lighting_you/objet/objet_03.png", alt: "Marker", info: "camera", top: 25, left: 83, width: 16 },
  { src: "/lighting_you/objet/objet_05.png", alt: "Flash / lamp", info: "flash", top: 28, left: 90, width: 12 },
];

const BUBBLES: InfoBubble<InfoId>[] = [
  { id: "tape", folder: "lighting_you/lighting_you_tapeinfos", name: "lighting_you_tapeinfos", top: 4, left: 62, width: 18 },
  { id: "makeup", folder: "lighting_you/lighting_you_makeupinfos", name: "lighting_you_makeupinfos", top: 18, left: 64, width: 18 },
  { id: "flash", folder: "lighting_you/lighting_you_flashinfos", name: "lighting_you_flashinfos", top: 34, left: 68, width: 18 },
  { id: "camera", folder: "lighting_you/lighting_you_camerainfos", name: "lighting_you_camerainfos", top: 26, left: 66, width: 19 },
  { id: "whisper", folder: "lighting_you/lighting_you_whisperinfos", name: "lighting_you_whisperinfos", top: 63, left: 70, width: 21 },
  // Choreography projects made with this template — one bubble per link, each
  // positioned independently. They share id "keepMoving" so the keep_moving
  // sticker (top:60 left:0 w:15) reveals them all; keep them adjacent to it so
  // the pointer can bridge across. Tune positions visually.
  { id: "keepMoving", slug: "brightness", folder: "brightness", name: "brightness_anim", title: "Brightness", top: 32, left: 14, width: 14 },
  { id: "keepMoving", slug: "light", folder: "light", name: "light_anim", title: "Light", top: 46, left: 14, width: 14 },
  { id: "keepMoving", slug: "yoyo", folder: "yoyo", name: "yoyo_anim", title: "Yoyo", top: 60, left: 14, width: 14 },
];

export const lightingYouScene: SceneLayout<InfoId> = {
  slug: "lighting-you",
  hero: HERO,
  stickers: STICKERS,
  tools: TOOLS,
  bubbles: BUBBLES,
};
