// Maps each template tutorial page to the choreography projects that were made
// with it. Hovering the "Keep Moving" sticker on a template page reveals these
// projects' presentation clips (the same `_anim` sticker shown on
// /choreography-styles), each linking to its detail page.
//
// Keyed by template slug (the /template/<slug> segment). Each project's
// `folder`/`name` feed AssetVideo (`/<folder>/<name>.{mov,webm,png}`); `slug`
// targets /choreography-styles/<slug>. The default presentation asset is the
// project's `<folder>_anim` clip; a template-specific override is used where one
// exists (e.g. Brightness ships a dedicated clip for the Fairy Hands page).

export interface KeepMovingProject {
  /** Detail page slug at /choreography-styles/<slug> (must exist in choreProjects). */
  slug: string;
  /** public/ folder holding the presentation clip. */
  folder: string;
  /** Base file name (no extension) of the presentation clip. */
  name: string;
  /** Visible / spoken project title, surfaced for a11y. */
  title: string;
}

export const KEEP_MOVING_PROJECTS: Record<string, KeepMovingProject[]> = {
  "phone-move": [
    { slug: "greyclub", folder: "greyclub", name: "greyclub_anim", title: "Greyclub" },
    { slug: "urbex", folder: "urbex", name: "urbex_anim", title: "Urbex 10.3" },
  ],
  "lighting-you": [
    { slug: "brightness", folder: "brightness", name: "brightness_anim", title: "Brightness" },
    { slug: "light", folder: "light", name: "light_anim", title: "Light" },
    { slug: "yoyo", folder: "yoyo", name: "yoyo_anim", title: "Yoyo" },
  ],
  "fairy-hands": [
    // Dedicated presentation clip authored for this page.
    { slug: "brightness", folder: "brightness", name: "brightness_fairy_hands", title: "Brightness" },
  ],
  "dance-lens": [
    { slug: "milas", folder: "milas", name: "milas_anim", title: "Mila's" },
    { slug: "modul-aura", folder: "modul_aura", name: "modul_aura_anim", title: "ModulAura" },
    { slug: "quantu-motion", folder: "quantu_motion", name: "quantu_motion_anim", title: "QUANTUMotion" },
  ],
};
