// Fixed catalogue of "flyers / liens" stickers for the /flyers-links page.
// Recreates the comp in docs/.../PAGE_LIEN_EXPLICATION.pdf: four neon title
// stickers (decorative) each sitting over a cluster of clickable stickers that
// open an external link in a new tab.
//
// Three kinds:
//   - "title": decorative `_anim`-style alpha video, no link.
//   - "video": alpha video sticker that links out (YouTube tutorials, VJ sites).
//   - "image": still alpha PNG that links out, animated with a gentle wiggle
//     (the plugin thumbnails).
//
// Positions are the asset FRAME box as a percentage of the single full-height
// `.screen` box (left/width = % of width, top = % of height). Each frame keeps
// its transparent padding, so the visible art lands where the comp shows it.
// Values are eyeballed from the comp and tuned against the rendered page.

export type FlyerKind = "title" | "video" | "image";

export interface FlyerSticker {
  /** public/<folder>/<folder>.{mov,webm,png} (video) or <folder>.png (image) */
  folder: string;
  kind: FlyerKind;
  /** Visible / a11y label */
  label: string;
  /** External destination opened in a new tab; omitted for decorative titles */
  href?: string;
  /** Left edge, % of screen width */
  left: number;
  /** Top edge, % of screen height */
  top: number;
  /** Width, % of screen width (height follows the asset aspect ratio) */
  width: number;
}

// Render order is z-order (later = on top). Thumbnails first, neon titles last
// so the titles stay readable where they overlap their cluster.
export const FLYER_STICKERS: FlyerSticker[] = [
  // --- BODY MOVES cluster (left) : YouTube tutorials 01-05 ---
  // --- Neon titles (decorative, rendered on top) ---
  {
    folder: "body_moves",
    kind: "title",
    label: "Body Moves",
    left: 6.5,
    top: 21,
    width: 23,
  },
  {
    folder: "vj_crew",
    kind: "title",
    label: "VJ Crew",
    left: 42,
    top: 0,
    width: 20,
  },
  {
    folder: "glitter_moves",
    kind: "title",
    label: "Glitter Moves",
    left: 68.5,
    top: 17,
    width: 28,
  }, {
    folder: "youtube_02",
    kind: "video",
    label: "Wispy Pointclouds (Kinect / TouchDesigner)",
    href: "https://www.youtube.com/watch?v=Eztrogwaq0w&list=PLE23j_kIAOfnpWVdHlv-H7uPgBczoljbK&index=64",
    left: 3.5,
    top: 60,
    width: 18.5,
  }, {
    folder: "youtube_03",
    kind: "video",
    label: "DIY Theremin in less than 30 minutes (TouchDesigner)",
    href: "https://www.youtube.com/watch?v=rhxB8eq4r88&list=PLE23j_kIAOfnpWVdHlv-H7uPgBczoljbK&index=48",
    left: 3,
    top: 32,
    width: 13,
  },
  {
    folder: "youtube_01",
    kind: "video",
    label: "Free Motion Capture Plugin for TouchDesigner — Accelerated MediaPipe",
    href: "https://www.youtube.com/watch?v=Cx4Ellaj6kk&list=PLE23j_kIAOfnpWVdHlv-H7uPgBczoljbK&index=17",
    left: 14,
    top: 38,
    width: 17,
  },
  {
    folder: "youtube_04",
    kind: "video",
    label: "New Body Tracking Component for TouchDesigner",
    href: "https://www.youtube.com/watch?v=83StND-y4fY&list=PLE23j_kIAOfnpWVdHlv-H7uPgBczoljbK&index=40",
    left: 5,
    top: 46,
    width: 14,
  },
  {
    folder: "youtube_05",
    kind: "video",
    label: "Interactive Particle — Part 1 (TouchDesigner)",
    href: "https://www.youtube.com/watch?v=Jz-irdEYUZM&list=PLE23j_kIAOfnpWVdHlv-H7uPgBczoljbK&index=3",
    left: 12,
    top: 53,
    width: 18,
  },

  // --- GLITTER MOVES cluster (right) : YouTube tutorials 06-10 ---
  {
    folder: "youtube_07",
    kind: "video",
    label: "Motion-tracked dancers (TouchDesigner)",
    href: "https://www.youtube.com/watch?v=pgVBl3sABLs&list=PLE23j_kIAOfnpWVdHlv-H7uPgBczoljbK&index=34",
    left: 75,
    top: 56,
    width: 16,
  },{
    folder: "youtube_09",
    kind: "video",
    label: "Interactive Particles using particlesGpu (TouchDesigner)",
    href: "https://www.youtube.com/watch?v=NnrWjQ_zO-s&t=1275s",
    left: 67.5,
    top: 31,
    width: 14,
  },
  {
    folder: "youtube_06",
    kind: "video",
    label: "Real Time Datamosh — TouchDesigner Tutorial",
    href: "https://www.youtube.com/watch?v=w8c33t2CgtA&list=PLE23j_kIAOfnpWVdHlv-H7uPgBczoljbK&index=52",
    left: 83,
    top: 30,
    width: 14,
  },
  {
    folder: "youtube_10",
    kind: "video",
    label: "Thermal Vision Effect (TouchDesigner)",
    href: "https://www.youtube.com/watch?v=uvSpe4YiZDs&list=PLE23j_kIAOfnpWVdHlv-H7uPgBczoljbK&index=31",
    left: 66.5,
    top: 45,
    width: 15,
  },
  {
    folder: "youtube_08",
    kind: "video",
    label: "Quick Tips #2 — Tracking motion without a Kinect",
    href: "https://www.youtube.com/watch?v=HIn2IBBhxXk&list=PLE23j_kIAOfnpWVdHlv-H7uPgBczoljbK&index=5",
    left: 78,
    top: 43,
    width: 14,
  },

  // --- VJ CREW cluster (center top) : artist presentation videos ---
  {
    folder: "lise_pres",
    kind: "video",
    label: "Lise — portfolio Instagram",
    href: "https://www.instagram.com/lise_mndes/",
    left: 37,
    top: 14,
    width: 9,
  },
  {
    folder: "mathilde_pres",
    kind: "video",
    label: "Mathilde Schibler — site",
    href: "https://mathildeschibler.xyz/",
    left: 45,
    top: 14.5,
    width: 9,
  },
  {
    folder: "rozetta_pres",
    kind: "video",
    label: "Allie Rozetta — site",
    href: "https://www.allierozetta.com/",
    left: 52.5,
    top: 16,
    width: 9,
  },
  {
    folder: "elisalien_pres",
    kind: "video",
    label: "Elisalien — site",
    href: "https://www.elisalien.com/",
    left: 58.5,
    top: 21,
    width: 10,
  },

  // --- PLUGIN cluster (center) : plugin thumbnails (wiggle on hover-idle) ---
  {
    folder: "appli0",
    kind: "image",
    label: "TDLidar — turn your iPhone into a realtime depth tracker (derivative.ca)",
    href: "https://derivative.ca/community-post/tdlidar-%E2%80%94-turn-your-iphone-realtime-depth-tracking-and-audio-sensor-touchdesigner",
    left: 38.5,
    top: 63,
    width: 9,
  },
  {
    folder: "freenect0",
    kind: "image",
    label: "FreenectTD — Kinect plugin for TouchDesigner (GitHub)",
    href: "https://github.com/stosumarte/FreenectTD",
    left: 44.5,
    top: 67,
    width: 8.5,
  },
  {
    folder: "mediapipe0",
    kind: "image",
    label: "MediaPipe for TouchDesigner (GitHub)",
    href: "https://github.com/torinmb/mediapipe-touchdesigner",
    left: 50,
    top: 63,
    width: 9.5,
  },
  {
    folder: "plugin",
    kind: "title",
    label: "Plugin",
    left: 42,
    top: 56,
    width: 17,
  }
];
