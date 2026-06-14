// Declarative layout for the "Dance Lens" template tutorial view
// (/template/dance-lens). Mirrors the comps in doc/dance_lens/DANCE_LENS_EXPLICATION.pdf.
//
// Coordinates are percentages of the scene (the black stage below the nav):
// `top`/`left` place the element's top-left corner, `width` sizes it relative
// to the scene width (height follows the asset's intrinsic ratio).

export interface Placed {
  top: number;
  left: number;
  width: number;
  rotation?: number;
}

export interface StickerEl extends Placed {
  folder: string;
  name: string;
  label: string;
  href?: string;
  info?: InfoId;
}

export interface ToolObject extends Placed {
  src: string;
  alt: string;
  info: InfoId;
}

export interface InfoBubble extends Placed {
  id: InfoId;
  folder: string;
  name: string;
}

export type InfoId = "camera" | "plugin" | "whisper";

export const HERO: Placed & { folder: string; name: string; label: string } = {
  folder: "dance_lens/dance_lens_tuto",
  name: "dance_lens_tuto",
  label: "Dance Lens — résultat",
  top: 20,
  left: 25,
  width: 50,
};

export const STICKERS: StickerEl[] = [
  { folder: "dance_lens/dance_lens_pres", name: "dance_lens_pres", label: "Dance Lens — présentation", top: -2, left: -7, width: 40 },
  { folder: "back_orange", name: "back_orange", label: "Retour aux templates", href: "/", top: 0, left: 0, width: 6 },
  { folder: "step_by_step_thermal", name: "step_by_step_thermal", label: "Step by step", top: 1, left: 29, width: 50 },
  { folder: "tool_kit_rose_thermal", name: "tool_kit_rose_thermal", label: "Tool kit", top: 2, left: 83, width: 17 },
  { folder: "follow_the_beats", name: "follow_the_beats", label: "Follow the beats — plugin MediaPipe sur GitHub", href: "https://github.com/torinmb/mediapipe-touchdesigner", top: 53, left: 0, width: 16 },
  { folder: "keep_moving", name: "keep_moving", label: "Keep moving — voir les projets", href: "/choreography-styles", top: 67, left: 10, width: 16 },
  { folder: "whisper_thermal", name: "whisper_thermal", label: "Whisper", top: 71, left: 78, width: 16, info: "whisper" },
];

export const TOOLS: ToolObject[] = [
  { src: "/dance_lens/objet/objet_02.png", alt: "Phone", info: "camera", top: 10, left: 76, width: 12},
  { src: "/dance_lens/objet/objet_05.png", alt: "Disc", info: "camera", top: 20, left: 74, width: 11 },
  { src: "/dance_lens/objet/objet_03.png", alt: "Webcam", info: "plugin", top: 23, left: 78, width: 12 },
  { src: "/dance_lens/objet/objet_01.png", alt: "Device", info: "plugin", top: 29, left: 83, width: 12 },
  { src: "/dance_lens/objet/objet_04.png", alt: "Plugin icon", info: "plugin", top: 29, left: 87, width: 14 },
];

export const BUBBLES: InfoBubble[] = [
  { id: "camera", folder: "dance_lens/dance_lens_camerainfo", name: "dance_lens_camerainfo", top: 18, left: 58, width: 24 },
  { id: "plugin", folder: "dance_lens/dance_lens_plugininfo", name: "dance_lens_plugininfo", top: 35, left: 58, width: 30 },
  { id: "whisper", folder: "dance_lens/dance_lens_whisperinfo", name: "dance_lens_whisperinfo", top: 68, left: 59, width: 21 },
];
