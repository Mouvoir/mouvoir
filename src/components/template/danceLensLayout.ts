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

type InfoId = "camera" | "plugin" | "whisper";

const HERO: HeroEl = {
  folder: "dance_lens/dance_lens_tuto",
  name: "dance_lens_tuto",
  label: "Dance Lens — résultat",
  top: 20,
  left: 25,
  width: 50,
};

const STICKERS: StickerEl<InfoId>[] = [
  { folder: "dance_lens/dance_lens_pres", name: "dance_lens_pres", label: "Dance Lens — présentation", top: -2, left: -7, width: 40 },
  { folder: "tool_kit_rose_thermal", name: "tool_kit_rose_thermal", label: "Tool kit", top: 2, left: 83, width: 17 },
  { folder: "step_by_step_thermal", name: "step_by_step_thermal", label: "Step by step", top: 1, left: 29, width: 50 },
  { folder: "follow_the_beats", name: "follow_the_beats", label: "Follow the beats — plugin MediaPipe sur GitHub", href: "https://github.com/torinmb/mediapipe-touchdesigner", top: 53, left: 0, width: 16 },
  { folder: "keep_moving", name: "keep_moving", label: "Keep moving — voir les projets", href: "/choreography-styles", top: 67, left: 10, width: 16 },
  { folder: "whisper_thermal", name: "whisper_thermal", label: "Whisper", top: 71, left: 78, width: 16, info: "whisper" },
  { folder: "back_orange", name: "back_orange", label: "Retour aux templates", href: "/", top: 0, left: 0, width: 6, delay: 0 },
];

const TOOLS: ToolObject<InfoId>[] = [
  { src: "/dance_lens/objet/objet_02.png", alt: "Phone", info: "camera", top: 10, left: 76, width: 12 },
  { src: "/dance_lens/objet/objet_05.png", alt: "Disc", info: "camera", top: 20, left: 74, width: 11 },
  { src: "/dance_lens/objet/objet_03.png", alt: "Webcam", info: "plugin", top: 23, left: 78, width: 12 },
  { src: "/dance_lens/objet/objet_01.png", alt: "Device", info: "plugin", top: 29, left: 83, width: 12 },
  { src: "/dance_lens/objet/objet_04.png", alt: "Plugin icon", info: "plugin", top: 29, left: 87, width: 14 },
];

const BUBBLES: InfoBubble<InfoId>[] = [
  { id: "camera", folder: "dance_lens/dance_lens_camerainfo", name: "dance_lens_camerainfo", top: 18, left: 58, width: 24 },
  { id: "plugin", folder: "dance_lens/dance_lens_plugininfo", name: "dance_lens_plugininfo", top: 35, left: 58, width: 30 },
  { id: "whisper", folder: "dance_lens/dance_lens_whisperinfo", name: "dance_lens_whisperinfo", top: 68, left: 59, width: 21 },
];

export const danceLensScene: SceneLayout<InfoId> = {
  slug: "dance-lens",
  hero: HERO,
  stickers: STICKERS,
  tools: TOOLS,
  bubbles: BUBBLES,
};
