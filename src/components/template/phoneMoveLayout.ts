// Layout data for the bespoke /template/phone-move detail page.
// The page recreates doc/phone_move/PHONE_MOVE_PRESENTATION.pdf: a full-screen
// black collage of free-floating video stickers. Most are alpha cutouts; the
// central scene is opaque footage with its red border + caption baked in.
// Three stickers (phone, app, whisper) reveal an info bubble on hover/tap.
// Positions are percentages of the board box; tuned against the comp.

export interface PhoneMoveItem {
  /** stable key + a11y id */
  key: string;
  /** public/ folder holding `<name>.{mov,webm,png}` (may be nested) */
  folder: string;
  /** base file name inside the folder */
  name: string;
  /** spoken label (titles are baked into the videos) */
  label: string;
  /** left edge, % of board width */
  left: number;
  /** top edge, % of board height */
  top: number;
  /** width, % of board width (height follows the video aspect ratio) */
  width: number;
  /** stacking order (higher = in front) */
  z?: number;
  /** optional external destination — turns the sticker into a link */
  href?: string;
}

export interface PhoneMoveTrigger extends PhoneMoveItem {
  /** info bubble revealed while this sticker is hovered/focused/tapped */
  bubble: PhoneMoveItem;
}

// Central tutorial scene — opaque 16:9 footage, baked red border + caption.
export const CENTRAL: PhoneMoveItem = {
  key: "tuto",
  folder: "phone_move/phone_move_tuto",
  name: "phone_move_tuto",
  label: "Tutoriel Phone Move",
  left: 24,
  top: 27,
  width: 51,
  z: 1,
};

// Non-interactive stickers (no info asset, no destination).
export const DECOR: PhoneMoveItem[] = [
  {
    key: "pres",
    folder: "phone_move/phone_move_pres",
    name: "phone_move_pres",
    label: "Phone Move",
    left: 1,
    top: 6,
    width: 23,
    z: 4,
  },
  {
    key: "step_by_step",
    folder: "step_by_step_thermal",
    name: "step_by_step_thermal",
    label: "Step by step",
    left: 30,
    top: 14,
    width: 44,
    z: 3,
  },
  {
    key: "tool_kit",
    folder: "tool_kit_rose_thermal",
    name: "tool_kit_rose_thermal",
    label: "Tool kit",
    left: 84,
    top: 8,
    width: 14,
    z: 3,
  },
  {
    key: "touch",
    folder: "phone_move/phone_move_touch",
    name: "phone_move_touch",
    label: "Récepteur TouchDesigner",
    left: 85,
    top: 33,
    width: 13,
    z: 3,
  },
  {
    key: "follow_the_beats",
    folder: "follow_the_beats",
    name: "follow_the_beats",
    label: "Follow the beats — voir l'app TDLidar sur derivative.ca",
    left: 73,
    top: 52,
    width: 12,
    z: 3,
    href: "https://derivative.ca/community-post/tdlidar-%E2%80%94-turn-your-iphone-realtime-depth-tracking-and-audio-sensor-touchdesigner",
  },
  {
    key: "keep_moving",
    folder: "keep_moving",
    name: "keep_moving",
    label: "Keep moving",
    left: 84,
    top: 70,
    width: 11,
    z: 3,
  },
];

// Interactive stickers — each reveals its info bubble on hover/focus/tap.
export const TRIGGERS: PhoneMoveTrigger[] = [
  {
    key: "phone",
    folder: "phone_move/phone_move_phone",
    name: "phone_move_phone",
    label: "iPhone requis — afficher les détails",
    left: 68,
    top: 2,
    width: 15,
    z: 5,
    bubble: {
      key: "phoneinfo",
      folder: "phone_move/phone_move_phoneinfo",
      name: "phone_move_phoneinfo",
      label:
        "Il vous faut un iPhone X ou plus récent (iOS 18.6+). Le jeu complet de fonctions demande un modèle Pro (12 Pro+) pour le LiDAR arrière. Les autres suivis fonctionnent sur tout iPhone via la caméra TrueDepth avant.",
      left: 58,
      top: 3,
      width: 16,
      z: 20,
    },
  },
  {
    key: "app",
    folder: "phone_move/phone_move_app",
    name: "phone_move_app",
    label: "Application TDLidar — afficher les détails",
    left: 75,
    top: 34,
    width: 12,
    z: 5,
    bubble: {
      key: "appinfos",
      folder: "phone_move/phone_move_appinfos",
      name: "phone_move_appinfos",
      label:
        "L'app TDLidar transforme l'iPhone en hub de capteurs temps réel : vidéo de profondeur (NDI), suivi corps/visage/mains, mouvement, analyse audio et voix, diffusés en Wi-Fi local vers TouchDesigner, OBS, Resolume, Unity ou tout récepteur NDI/OSC. Sans câble, sans compte, sans cloud — tout est traité sur l'appareil.",
      left: 60,
      top: 34,
      width: 17,
      z: 20,
    },
  },
  {
    key: "whisper",
    folder: "whisper_thermal",
    name: "whisper_thermal",
    label: "Whisper — afficher les détails",
    left: 3,
    top: 76,
    width: 17,
    z: 5,
    bubble: {
      key: "whisperinfos",
      folder: "phone_move/phone_move_whisperinfos",
      name: "phone_move_whisperinfos",
      label:
        "À utiliser uniquement en Wi-Fi local, pas de cellulaire ni de streaming distant ! Fonctionne dans le noir : le LiDAR est un infrarouge actif, indépendant de la lumière !",
      left: 15,
      top: 64,
      width: 16,
      z: 20,
    },
  },
];
