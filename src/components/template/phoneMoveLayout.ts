// Declarative layout for the "Phone Move" template tutorial view
// (/template/phone-move). Mirrors the comps in doc/phone_move/PHONE_MOVE_PRESENTATION.pdf.
// Shared types and rendering live in sceneTypes.ts / TemplateScene.tsx.
// This scene has no tool-kit objects — all bubble triggers are stickers.

import type {
  HeroEl,
  InfoBubble,
  SceneLayout,
  StickerEl,
} from "./sceneTypes";

type InfoId = "phone" | "app" | "whisper" | "td" | "keepMoving";

// Central tutorial scene — opaque 16:9 footage, baked red border + caption.
const HERO: HeroEl = {
  folder: "phone_move/phone_move_tuto",
  name: "phone_move_tuto",
  label: "Tutoriel Phone Move",
  top: 20,
  left: 25,
  width: 50,
  step: 3,
};

// No `tools` array — the phone / touch / app trigger stickers ARE this scene's
// tool kit, so they share step 1 with the tool-kit title.
const STICKERS: StickerEl<InfoId>[] = [
  { folder: "phone_move/phone_move_pres2", name: "phone_move_pres2", label: "Phone Move", top: 2, left: 2, width: 24, step: 0 },
  { folder: "back", name: "back", label: "Retour aux templates", href: "/", top: 3, left: 0, width: 5, delay: 0 },
  { folder: "step_by_step_thermal", name: "step_by_step_thermal", label: "Step by step", top: 1, left: 29, width: 50, step: 3 },
  { folder: "keep_moving_thermal", name: "keep_moving_thermal", label: "Tool kit", top: 0, left: 82, width: 16, step: 1 },
  { folder: "phone_move/phone_move_phone", name: "phone_move_phone", label: "iPhone requis — afficher les détails", top: 8, left: 72, width: 15, info: "phone", step: 1 },
  { folder: "phone_move/phone_move_touch", name: "phone_move_touch", label: "Récepteur TouchDesigner", top: 28, left: 82.3, width: 13, info: "td", step: 1 },
  { folder: "phone_move/phone_move_app", name: "phone_move_app", label: "Application TDLidar — afficher les détails", top: 27, left: 76, width: 12, info: "app", step: 1 },
  { folder: "follow_the_beats", name: "follow_the_beats", label: "Follow the beats — voir l'app TDLidar sur derivative.ca", top: 60, left: 0, width: 12, href: "https://derivative.ca/community-post/tdlidar-%E2%80%94-turn-your-iphone-realtime-depth-tracking-and-audio-sensor-touchdesigner", step: 4 },
  { folder: "whisper_thermal", name: "whisper_thermal", label: "Whisper — afficher les détails", top: 70, left: 78, width: 17, info: "whisper", step: 2 },
  { folder: "keep_moving", name: "keep_moving", label: "Keep moving — voir les projets", info: "keepMoving", top: 70, left: 10, width: 11, step: 4 },
];

const BUBBLES: InfoBubble<InfoId>[] = [
  { id: "phone", folder: "phone_move/phone_move_phoneinfo", name: "phone_move_phoneinfo", top: 3, left: 60, width: 20 },
  { id: "app", folder: "phone_move/phone_move_appinfos", name: "phone_move_appinfos", top: 32, left: 65, width: 20 },
  { id: "td", folder: "phone_move/phone_move_td", name: "phone_move_td", top: 38, left: 70, width: 20 },
  { id: "whisper", folder: "phone_move/phone_move_whisperinfos", name: "phone_move_whisperinfos", top: 64, left: 70, width: 20 },
  // Choreography projects made with this template — one bubble per link, each
  // positioned independently. They share id "keepMoving" so the keep_moving
  // sticker (top:70 left:10 w:11) reveals them all; keep them adjacent to it so
  // the pointer can bridge across. Tune positions visually.
  { id: "keepMoving", slug: "greyclub", folder: "greyclub", name: "greyclub_anim", title: "Greyclub", top: 50, left: 16, width: 16 },
  { id: "keepMoving", slug: "urbex", folder: "urbex", name: "urbex_anim", title: "Urbex 10.3", top: 65, left: 16, width: 16 },
];

export const phoneMoveScene: SceneLayout<InfoId> = {
  slug: "phone-move",
  hero: HERO,
  stickers: STICKERS,
  bubbles: BUBBLES,
};
