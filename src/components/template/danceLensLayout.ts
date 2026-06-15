// Declarative layout for the "Dance Lens" template tutorial view
// (/template/dance-lens). Mirrors the comps in doc/dance_lens/DANCE_LENS_EXPLICATION.pdf.
// Shared types and rendering live in sceneTypes.ts / TemplateScene.tsx.

import type {
  HeroEl,
  InfoBubble,
  SceneLayout,
  StickerEl,
  ToolObject,
} from "./sceneTypes";

type InfoId = "camera" | "plugin" | "whisper" | "keepMoving";

const HERO: HeroEl = {
  folder: "dance_lens/dance_lens_tuto",
  name: "dance_lens_tuto",
  label: "Dance Lens — résultat",
  top: 20,
  left: 25,
  width: 50,
  step: 3,
};

const STICKERS: StickerEl<InfoId>[] = [
  { folder: "dance_lens/dance_lens_pres", name: "dance_lens_pres", label: "Dance Lens — présentation", top: -2, left: -7, width: 40, step: 0 },
  { folder: "tool_kit_rose_thermal", name: "tool_kit_rose_thermal", label: "Tool kit", top: 2, left: 83, width: 17, step: 1 },
  { folder: "step_by_step_thermal", name: "step_by_step_thermal", label: "Step by step", top: 1, left: 29, width: 50, step: 3 },
  { folder: "follow_the_beats", name: "follow_the_beats", label: "Follow the beats — plugin MediaPipe sur GitHub", href: "https://github.com/torinmb/mediapipe-touchdesigner", top: 53, left: 0, width: 16, step: 4 },
  { folder: "keep_moving", name: "keep_moving", label: "Keep moving — voir les projets", info: "keepMoving", top: 67, left: 10, width: 16, step: 4 },
  { folder: "keep_moving_thermal", name: "keep_moving_thermal", label: "Whisper", top: 71, left: 78, width: 16, info: "whisper", step: 2 },
  { folder: "back_orange", name: "back_orange", label: "Retour aux templates", href: "/", top: 0, left: 0, width: 6, delay: 0 },
];

const TOOLS: ToolObject<InfoId>[] = [
  { src: "/dance_lens/objet/objet_02.png", alt: "Phone", info: "camera", top: 10, left: 76, width: 12, step: 1 },
  { src: "/dance_lens/objet/objet_05.png", alt: "Disc", info: "camera", top: 20, left: 74, width: 11, step: 1 },
  { src: "/dance_lens/objet/objet_03.png", alt: "Webcam", info: "plugin", top: 23, left: 78, width: 12, step: 1 },
  { src: "/dance_lens/objet/objet_01.png", alt: "Device", info: "plugin", top: 29, left: 83, width: 12, step: 1 },
  { src: "/dance_lens/objet/objet_04.png", alt: "Plugin icon", info: "plugin", top: 29, left: 87, width: 14, step: 1 },
];

const BUBBLES: InfoBubble<InfoId>[] = [
  { id: "camera", folder: "dance_lens/dance_lens_camerainfo", name: "dance_lens_camerainfo", top: 18, left: 58, width: 24 },
  { id: "plugin", folder: "dance_lens/dance_lens_plugininfo", name: "dance_lens_plugininfo", top: 35, left: 58, width: 30 },
  { id: "whisper", folder: "dance_lens/dance_lens_whisperinfo", name: "dance_lens_whisperinfo", top: 68, left: 59, width: 21 },
  // Choreography projects made with this template — one bubble per link, each
  // positioned independently. They share id "keepMoving" so the keep_moving
  // sticker (top:67 left:10 w:16) reveals them all; keep them adjacent to it so
  // the pointer can bridge across. Tune positions visually.
  { id: "keepMoving", slug: "milas", folder: "milas", name: "milas_anim", title: "Mila's", top: 40, left: 10, width: 16 },
  { id: "keepMoving", slug: "modul-aura", folder: "modul_aura", name: "modul_aura_anim", title: "ModulAura", top: 60, left: 20, width: 16 },
  { id: "keepMoving", slug: "quantu-motion", folder: "quantu_motion", name: "quantu_motion_anim", title: "QUANTUMotion", top: 60, left: 0, width: 16 },
];

export const danceLensScene: SceneLayout<InfoId> = {
  slug: "dance-lens",
  hero: HERO,
  stickers: STICKERS,
  tools: TOOLS,
  bubbles: BUBBLES,
};
