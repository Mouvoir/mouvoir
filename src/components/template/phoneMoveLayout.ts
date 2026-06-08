// Declarative layout for the "Phone Move" template tutorial view
// (/template/phone-move). Mirrors the comps in doc/phone_move/PHONE_MOVE_PRESENTATION.pdf.
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

export interface InfoBubble extends Placed {
  id: InfoId;
  folder: string;
  name: string;
}

export type InfoId = "phone" | "app" | "whisper";

// Central tutorial scene — opaque 16:9 footage, baked red border + caption.
export const HERO: Placed & { folder: string; name: string; label: string } = {
  folder: "phone_move/phone_move_tuto",
  name: "phone_move_tuto",
  label: "Tutoriel Phone Move",
  top: 27,
  left: 24,
  width: 51,
};

export const STICKERS: StickerEl[] = [
  { folder: "phone_move/phone_move_pres", name: "phone_move_pres", label: "Phone Move", top: 6, left: 1, width: 23 },
  { folder: "back", name: "back", label: "Retour aux templates", href: "/template", top: 3, left: 0, width: 5 },
  { folder: "step_by_step_thermal", name: "step_by_step_thermal", label: "Step by step", top: 14, left: 30, width: 44 },
  { folder: "tool_kit_rose_thermal", name: "tool_kit_rose_thermal", label: "Tool kit", top: 8, left: 84, width: 14 },
  { folder: "phone_move/phone_move_phone", name: "phone_move_phone", label: "iPhone requis — afficher les détails", top: 2, left: 68, width: 15, info: "phone" },
  { folder: "phone_move/phone_move_touch", name: "phone_move_touch", label: "Récepteur TouchDesigner", top: 33, left: 85, width: 13 },
  { folder: "phone_move/phone_move_app", name: "phone_move_app", label: "Application TDLidar — afficher les détails", top: 34, left: 75, width: 12, info: "app" },
  { folder: "follow_the_beats", name: "follow_the_beats", label: "Follow the beats — voir l'app TDLidar sur derivative.ca", top: 52, left: 73, width: 12, href: "https://derivative.ca/community-post/tdlidar-%E2%80%94-turn-your-iphone-realtime-depth-tracking-and-audio-sensor-touchdesigner" },
  { folder: "whisper_thermal", name: "whisper_thermal", label: "Whisper — afficher les détails", top: 76, left: 3, width: 17, info: "whisper" },
  { folder: "keep_moving", name: "keep_moving", label: "Keep moving", top: 70, left: 84, width: 11 },
];

export const BUBBLES: InfoBubble[] = [
  { id: "phone", folder: "phone_move/phone_move_phoneinfo", name: "phone_move_phoneinfo", top: 3, left: 58, width: 16 },
  { id: "app", folder: "phone_move/phone_move_appinfos", name: "phone_move_appinfos", top: 34, left: 60, width: 17 },
  { id: "whisper", folder: "phone_move/phone_move_whisperinfos", name: "phone_move_whisperinfos", top: 64, left: 15, width: 16 },
];
