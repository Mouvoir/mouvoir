// Shared types for the /template/* tutorial scenes (Dance Lens, Fairy Hands,
// Lighting You, Phone Move). Each scene is a black stage of absolutely-placed,
// alpha-cutout video stickers plus tool-kit objects that reveal speech bubbles
// on hover. The per-scene data lives in the matching `*Layout.ts`; the rendering
// is shared in TemplateScene.tsx.
//
// Coordinates are percentages of the scene (the black stage below the nav):
// `top`/`left` place the element's top-left corner, `width` sizes it relative
// to the scene width (height follows the asset's intrinsic ratio).

// An absolutely-placed scene layer.
export interface Placed {
  top: number;
  left: number;
  width: number;
  rotation?: number;
  /** Entrance reveal delay (seconds). Omit to auto-stagger by render order
   *  (see sceneReveal.ts / SCENE_STAGGER). */
  delay?: number;
}

// A neon/thermal video sticker (AssetVideo). `href` turns it into a link
// (external `http(s)` opens in a new tab); `info` makes hovering it reveal the
// matching speech bubble.
export interface StickerEl<Info extends string = string> extends Placed {
  folder: string;
  name: string;
  label: string;
  href?: string;
  info?: Info;
}

// A tool-kit object (transparent PNG) that reveals its bubble on hover.
export interface ToolObject<Info extends string = string> extends Placed {
  src: string;
  alt: string;
  info: Info;
}

// A speech bubble that fades in while its trigger is hovered.
export interface InfoBubble<Info extends string = string> extends Placed {
  id: Info;
  folder: string;
  name: string;
}

// Central result footage (opaque, border baked in). Sits lowest in the stack so
// the neon titles read on top of it.
export interface HeroEl extends Placed {
  folder: string;
  name: string;
  label: string;
}

// The full declarative layout for one tutorial scene.
export interface SceneLayout<Info extends string = string> {
  /** /template/<slug> this scene belongs to — keys into KEEP_MOVING_PROJECTS. */
  slug: string;
  hero: HeroEl;
  stickers: StickerEl<Info>[];
  /** Optional tool-kit objects (some scenes have none, e.g. Phone Move). */
  tools?: ToolObject<Info>[];
  bubbles: InfoBubble<Info>[];
}
