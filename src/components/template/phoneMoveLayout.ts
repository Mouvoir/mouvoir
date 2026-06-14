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

export type InfoId = "phone" | "app" | "whisper" | "td";

// Central tutorial scene — opaque 16:9 footage, baked red border + caption.
export const HERO: Placed & { folder: string; name: string; label: string } = {
  folder: "phone_move/phone_move_tuto",
  name: "phone_move_tuto",
  label: "Tutoriel Phone Move",
  top: 20,
  left: 25,
  width: 50,
};

export const STICKERS: StickerEl[] = [
  { folder: "phone_move/phone_move_pres", name: "phone_move_pres", label: "Phone Move", top: 0, left: -5, width: 35 },
  { folder: "back", name: "back", label: "Retour aux templates", href: "/", top: 3, left: 0, width: 5 },
  { folder: "step_by_step_thermal", name: "step_by_step_thermal", label: "Step by step", top: 1, left: 29, width: 50 },
  { folder: "tool_kit_rose_thermal", name: "tool_kit_rose_thermal", label: "Tool kit", top: 0, left: 82, width: 16 },
  { folder: "phone_move/phone_move_phone", name: "phone_move_phone", label: "iPhone requis — afficher les détails", top: 8, left: 72, width: 15, info: "phone" },
  { folder: "phone_move/phone_move_touch", name: "phone_move_touch", label: "Récepteur TouchDesigner", top: 28, left: 82.3, width: 13,info: "td" },
  { folder: "phone_move/phone_move_app", name: "phone_move_app", label: "Application TDLidar — afficher les détails", top: 27, left: 76, width: 12, info: "app" },
  { folder: "follow_the_beats", name: "follow_the_beats", label: "Follow the beats — voir l'app TDLidar sur derivative.ca", top: 52, left: 0, width: 12, href: "https://derivative.ca/community-post/tdlidar-%E2%80%94-turn-your-iphone-realtime-depth-tracking-and-audio-sensor-touchdesigner" },
  { folder: "whisper_thermal", name: "whisper_thermal", label: "Whisper — afficher les détails", top: 70, left: 78, width: 17, info: "whisper" },
  { folder: "keep_moving", name: "keep_moving", label: "Keep moving — voir les projets", href: "/choreography-styles", top: 70, left: 10, width: 11 },
];

export const BUBBLES: InfoBubble[] = [
  { id: "phone", folder: "phone_move/phone_move_phoneinfo", name: "phone_move_phoneinfo", top: 3, left: 54, width: 28 },
  { id: "app", folder: "phone_move/phone_move_appinfos", name: "phone_move_appinfos", top: 32, left: 60, width: 28 },
  { id: "td", folder: "phone_move/phone_move_td", name: "phone_move_td", top: 34, left: 64, width: 28 },
  { id: "whisper", folder: "phone_move/phone_move_whisperinfos", name: "phone_move_whisperinfos", top: 64, left: 70, width: 28 },
];
