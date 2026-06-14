# Feature: choreography-detail-pages

## Decision

Implement `/choreography-styles/[slug]` as a static server-component route using a per-page layer-list data module co-located with `choreStickers.ts`, rendered by a single reusable `ChoreLayer` component — matching the fixture-map pattern of `src/lib/templates.ts` while staying inside the `choreography/` component cluster to avoid premature Sanity migration.

---

## Files to create

| File | Purpose |
|------|---------|
| `src/components/choreography/choreProjects.ts` | Per-page layer arrays + `getChoreProject(slug)` + `getAllChoreSlugs()` |
| `src/components/choreography/ChoreLayer.tsx` | Reusable component: renders one `video` or `image` layer, optionally wrapped in `<Link>` |
| `src/components/choreography/choreLayer.module.css` | `.layer` class: `position:absolute`, `mix-blend-mode:screen`, pointer-events rules |
| `src/app/choreography-styles/[slug]/page.tsx` | Dynamic detail route — `await params`, `notFound()`, `generateStaticParams` |

## Files to modify

| File | Change description |
|------|--------------------|
| `src/app/choreography-styles/collage.module.css` | No change — reused read-only by the detail page via `../collage.module.css` |

No existing files are modified. Blast radius = zero.

---

## Data model — `src/components/choreography/choreProjects.ts`

### Layer interface

```typescript
export interface ChoreLayerData {
  /**
   * Rendering mode:
   *   'video' — renders <video autoPlay muted loop playsInline> with mov→webm sources
   *             + png poster. `asset` is the base path WITHOUT extension,
   *             e.g. "greyclub/greyclub_infos01" → appends .mov / .webm / .png.
   *   'image' — renders <img>. `asset` is the FULL path INCLUDING extension,
   *             e.g. "greyclub/greyclub_jingle_titre00.png".
   */
  kind: "video" | "image";
  /** See `kind` doc-comment for the extension convention. Relative to public/ root. */
  asset: string;
  /** Left edge, % of the .screen box width */
  left: number;
  /** Top edge, % of the .screen box height */
  top: number;
  /** Width, % of the .screen box width */
  width: number;
  /**
   * When present, the layer is wrapped in a Next.js <Link href={href}>.
   * The media element inside always carries pointer-events:none so only
   * the Link wrapper is interactive.
   * When absent, the layer is purely decorative (.layer has pointer-events:none).
   */
  href?: string;
  /**
   * Accessible label used as aria-label on the <Link> wrapper.
   * Required when href is set; omit for decorative layers.
   */
  label?: string;
}
```

### Common constant layers (defined ONCE, reused by getChoreProject)

```typescript
// back_bleu link — returns user to the landing
const BACK_LAYER: ChoreLayerData = {
  kind: "video",
  asset: "back_bleu/back_bleu",
  left: 0, top: 2, width: 9,
  href: "/choreography-styles",
  label: "Back to choreography styles",
};

// keep_moving link — placeholder destination until route exists
const KEEP_MOVING_LAYER: ChoreLayerData = {
  kind: "video",
  asset: "keep_moving/keep_moving",
  left: 83, top: 72, width: 14,
  href: "/movement-rehearsal",
  label: "Keep Moving",
};
```

### Per-page layer arrays (unique layers only — commons added by getChoreProject)

`CHORE_PROJECTS` is a `Record<string, ChoreLayerData[]>` keyed by the **URL slug** (matching `choreStickers.ts`).

#### greyclub
```
{ kind:"video", asset:"greyclub/greyclub",                left:2,  top:22, width:58 },
{ kind:"image", asset:"greyclub/greyclub_jingle_titre00.png", left:62, top:14, width:33 },
{ kind:"video", asset:"greyclub/greyclub_infos01",         left:68, top:40, width:22 },
{ kind:"video", asset:"greyclub/greyclub_infos02",         left:70, top:48, width:24 },
```

#### urbex
```
{ kind:"video", asset:"urbex/urbex",                       left:1,  top:28, width:62 },
{ kind:"video", asset:"urbex/urbex_titre",                 left:72, top:25, width:24 },
{ kind:"video", asset:"urbex/urbex_infos01",               left:70, top:38, width:20 },
{ kind:"video", asset:"urbex/urbex_infos02",               left:70, top:50, width:24 },
{ kind:"image", asset:"urbex/urbex_jingle_020.png",        left:2,  top:30, width:18 },
{ kind:"image", asset:"urbex/urbex_jingle_030.png",        left:50, top:68, width:17 },
{ kind:"video", asset:"follow_the_beats_bleu/follow_the_beats_bleu", left:68, top:80, width:13, href:"/movement-rehearsal", label:"Follow the beats" },
```

#### quantu-motion  (slug "quantu-motion", folder "quantu_motion")
```
{ kind:"video", asset:"quantu_motion/quantu_motion",       left:2,  top:25, width:62 },
{ kind:"video", asset:"quantu_motion/quantu_motion_titre", left:72, top:14, width:24 },
{ kind:"video", asset:"quantu_motion/quantu_motion_infos01", left:70, top:32, width:22 },
{ kind:"video", asset:"quantu_motion/quantu_motion_infos02", left:70, top:46, width:24 },
{ kind:"image", asset:"quantu_motion/quantu_motion_jingle020.png",  left:0,  top:38, width:24 },
{ kind:"image", asset:"quantu_motion/quantu_motion_jingle0300.png", left:45, top:26, width:20 },
{ kind:"image", asset:"quantu_motion/quantu_motion_jingle010.png",  left:60, top:64, width:12 },
{ kind:"video", asset:"follow_the_beats_bleu/follow_the_beats_bleu", left:66, top:80, width:13, href:"/movement-rehearsal", label:"Follow the beats" },
```

#### brightness
```
{ kind:"video", asset:"brightness/brightness",             left:17, top:36, width:38 },
{ kind:"image", asset:"brightness/brightness_jingle_titre00.png", left:70, top:14, width:26 },
{ kind:"video", asset:"brightness/brightness_infos01",     left:70, top:40, width:22 },
{ kind:"video", asset:"brightness/brightness_infos02",     left:70, top:52, width:22 },
{ kind:"image", asset:"jam_ctrlf_f/jam_ctrlf_f_020.png",   left:2,  top:32, width:16 },
{ kind:"image", asset:"jam_ctrlf_f/jam_ctrlf_f_010.png",   left:40, top:24, width:22 },
{ kind:"image", asset:"jam_ctrlf_f/jam_ctrlf_f_030.png",   left:63, top:68, width:12 },
```

#### light  (Type B — still in training)
```
{ kind:"video", asset:"still_in_training_bleu/still_in_training_bleu", left:30, top:18, width:38 },
{ kind:"video", asset:"light/light_anim",                  left:28, top:38, width:30 },
```

#### yoyo  (Type B)
```
{ kind:"video", asset:"still_in_training_bleu/still_in_training_bleu", left:30, top:18, width:38 },
{ kind:"video", asset:"yoyo/yoyo_anim",                    left:28, top:38, width:30 },
```

#### turfuzz  (Type B)
```
{ kind:"video", asset:"still_in_training_bleu/still_in_training_bleu", left:30, top:18, width:38 },
{ kind:"video", asset:"turfuzz/turfuzz_anim",              left:28, top:38, width:30 },
```

#### modul-aura  (slug "modul-aura", folder "modul_aura")  (Type B)
```
{ kind:"video", asset:"still_in_training_bleu/still_in_training_bleu", left:30, top:18, width:38 },
{ kind:"video", asset:"modul_aura/modul_aura_anim",        left:28, top:38, width:30 },
```

#### jam-ctrl-f  (slug "jam-ctrl-f", folder "jam_ctrlf_f")  (Type B)
```
{ kind:"video", asset:"still_in_training_bleu/still_in_training_bleu", left:30, top:18, width:38 },
{ kind:"video", asset:"jam_ctrlf_f/jam_ctrlf_f_anim",      left:28, top:38, width:30 },
```

#### milas  (Type B — no public folder, no central sticker, banner + commons only)
```
{ kind:"video", asset:"still_in_training_bleu/still_in_training_bleu", left:30, top:18, width:38 },
```

### Exported functions

```typescript
/**
 * Returns [BACK_LAYER, ...uniqueLayers, KEEP_MOVING_LAYER]
 * or null if slug is not in CHORE_PROJECTS.
 */
export function getChoreProject(slug: string): ChoreLayerData[] | null

/**
 * Returns the list of all detail slugs. Used by generateStaticParams.
 * Must return exactly the same 10 slugs as the landing CHORE_STICKERS array.
 */
export function getAllChoreSlugs(): string[]
```

`getAllChoreSlugs()` implementation: `return Object.keys(CHORE_PROJECTS)`.

---

## Component — `src/components/choreography/ChoreLayer.tsx`

### Props

```typescript
interface ChoreLayerProps {
  layer: ChoreLayerData;
}
```

### Rendering logic

1. Compute inline style: `{ left: '${layer.left}%', top: '${layer.top}%', width: '${layer.width}%' }`.
2. Build the media element:
   - If `layer.kind === 'video'`: render `<video autoPlay muted loop playsInline preload="auto" poster={`/${layer.asset}.png`} className={styles.layerMedia}>` with two `<source>` children:
     - `<source src={`/${layer.asset}.mov`} type="video/quicktime" />`
     - `<source src={`/${layer.asset}.webm`} type="video/webm" />`
   - If `layer.kind === 'image'`: render `<img src={`/${layer.asset}`} alt="" aria-hidden="true" className={styles.layerMedia} />`
3. Wrap media with a `<div className={styles.layer} style={positionStyle}>`:
   - If `layer.href` is set: wrap that div's **contents** in a `<Link href={layer.href} aria-label={layer.label} className={styles.layerLink}>`. The `<div className={styles.layer}>` is still the outermost element (for positioning); the Link is inside it and fills it.
   - If no `href`: no Link wrapper. The div is non-interactive (`.layer` has `pointer-events:none` — clicks pass through to links beneath).
4. The component is a pure server component (no `"use client"`). `Link` from `next/link` works in server components.

### CSS — `src/components/choreography/choreLayer.module.css`

```css
/* A single composited layer in a choreography detail page.
   Absolutely positioned within the .screen context box.
   mix-blend-mode:screen drops the black backing so layers overlay cleanly.
   pointer-events:none on the wrapper means decorative layers never intercept
   clicks — only .layerLink re-enables interactivity for linked layers. */

.layer {
  position: absolute;
  pointer-events: none;
}

/* The actual media element — fills its parent and blends */
.layerMedia {
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
}

/* Link wrapper fills the layer box so the whole sticker is clickable.
   Re-enables pointer-events so the link fires even when nudging overlaps. */
.layerLink {
  display: block;
  line-height: 0;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.25s ease;
}

.layerLink:hover {
  transform: scale(1.04);
}
```

---

## Route — `src/app/choreography-styles/[slug]/page.tsx`

### Structure (server component, no `"use client"`)

```typescript
import { notFound } from "next/navigation";
import { getChoreProject, getAllChoreSlugs } from "@/components/choreography/choreProjects";
import { ChoreLayer } from "@/components/choreography/ChoreLayer";
import styles from "../collage.module.css";

export default async function ChoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const layers = getChoreProject(slug);
  if (!layers) notFound();

  return (
    <div className={styles.collage}>
      <section className={styles.screen}>
        {layers.map((layer, index) => (
          <ChoreLayer key={`${layer.asset}-${index}`} layer={layer} />
        ))}
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return getAllChoreSlugs().map((slug) => ({ slug }));
}
```

Notes:
- `generateStaticParams` is synchronous (no async data fetch needed — data is in-module).
- Key: `${layer.asset}-${index}` is stable — asset strings are unique within a page's list; index disambiguates common layers that share the same asset across pages.
- No `export const dynamic` needed — `generateStaticParams` triggers static generation by default.

---

## Data flow

1. Browser navigates to `/choreography-styles/greyclub`.
2. Next.js matches `src/app/choreography-styles/[slug]/page.tsx`.
3. `await params` resolves `{ slug: "greyclub" }`.
4. `getChoreProject("greyclub")` looks up `CHORE_PROJECTS["greyclub"]`, prepends `BACK_LAYER`, appends `KEEP_MOVING_LAYER`, returns `ChoreLayerData[]`.
5. Page renders `<div class="collage"><section class="screen">` (reusing landing CSS).
6. Each `ChoreLayer` receives one `ChoreLayerData` item; renders either `<video>` or `<img>` absolutely positioned inside `.screen`, blended with `mix-blend-mode:screen`.
7. Decorative layers have `pointer-events:none` on their `.layer` wrapper — clicks pass through to any linked layer beneath them regardless of position nudges.
8. Layers with `href` have a `.layerLink` wrapper that re-enables `pointer-events:auto` — `back_bleu` and `keep_moving` are always clickable.
9. Static export pre-renders all 10 slugs via `generateStaticParams`.

---

## Build sequence

- [ ] Step 1: Create `src/components/choreography/choreProjects.ts`. Define the `ChoreLayerData` interface (named `ChoreLayerData` to avoid collision with the `ChoreLayer` component name), the `BACK_LAYER` and `KEEP_MOVING_LAYER` constants, the `CHORE_PROJECTS` Record with all 10 entries exactly as specified in the data model section above (filenames verbatim, no normalization), and the `getChoreProject` and `getAllChoreSlugs` functions.
- [ ] Step 2: Create `src/components/choreography/choreLayer.module.css` with the `.layer`, `.layerMedia`, `.layerLink`, and `.layerLink:hover` rules exactly as specified in the CSS section above. Pay attention: `.layer` carries `pointer-events:none`; `.layerLink` carries `pointer-events:auto`.
- [ ] Step 3: Create `src/components/choreography/ChoreLayer.tsx` implementing the rendering logic specified above. Import `Link` from `next/link`, `styles` from `./choreLayer.module.css`, and `ChoreLayerData` from `./choreProjects`.
- [ ] Step 4: Create the directory `src/app/choreography-styles/[slug]/` and the file `page.tsx` within it, implementing the route as specified above.
- [ ] Step 5: Run `npm run build` to verify all 10 static paths generate without error and that `notFound()` is reachable for unknown slugs.

---

## Constraints for the implementer

- **Do NOT edit** `collage.module.css`, `ChoreSticker.tsx`, `choreSticker.module.css`, or `choreStickers.ts`. The landing page must be untouched.
- **Filename verbatim:** `quantu_motion_jingle020.png`, `quantu_motion_jingle0300.png`, `quantu_motion_jingle010.png` (no underscore before digits, `0300` not `030`). `urbex_jingle_020.png` and `urbex_jingle_030.png` (with underscore). Do not normalize these names.
- **Cross-folder asset:** the brightness page jingle images come from `jam_ctrlf_f/` folder, not `brightness/`. This is correct and intentional — do not change it.
- **`asset` field convention:** for `kind:"video"` the value is a base path WITHOUT extension (e.g. `"greyclub/greyclub_infos01"`). For `kind:"image"` the value is the full path WITH `.png` extension (e.g. `"greyclub/greyclub_jingle_titre00.png"`). The component appends `.mov` / `.webm` / `.png` only for video layers.
- **Source order:** `.mov` FIRST, `.webm` SECOND in every `<video>` element. Never invert.
- **Pointer-events layering:** `.layer` must have `pointer-events:none`; `.layerLink` must have `pointer-events:auto`. Without this, large decorative video boxes silently eat clicks on link stickers beneath them when positions are nudged.
- **Server components only:** no `"use client"` in any of the four new files. `Link` and `video` with `autoPlay` work correctly in Next.js server components.
- **`await params`:** the `params` prop type is `Promise<{ slug: string }>` — must be awaited before accessing `.slug`. Mirror the exact signature from `src/app/template/[slug]/page.tsx`.
- **CSS modules, not globals:** all detail-page-specific styles in `choreLayer.module.css`. The page imports `collage.module.css` from one directory up (`../collage.module.css`) — use that relative path, not the `@/*` alias, because the CSS module is relative to the page file.
- **No Tailwind in ChoreLayer:** use only the CSS module. Positions are inline styles (percentages).
- **milas page:** no `milas/` folder exists in `public/`. Its entry in `CHORE_PROJECTS` contains only the `still_in_training_bleu` video layer. `getChoreProject` adds `BACK_LAYER` and `KEEP_MOVING_LAYER` — the page renders three layers total.
- **Interface naming:** the data interface is `ChoreLayerData` (in `choreProjects.ts`); the React component is `ChoreLayer` (in `ChoreLayer.tsx`). Do not rename either.
- **No new routes, no new nav links:** the `/movement-rehearsal` route referenced in `href` does not need to exist for this blueprint — links will 404 until that route is built separately.

---

## Out of scope

- Tuning the `left`/`top`/`width` position values — user will adjust manually after seeing pages in the browser.
- Creating the `/movement-rehearsal` route referenced by `keep_moving` and `follow_the_beats_bleu` hrefs.
- Adding assets to `public/milas/` — that is a separate production task.
- Migrating choreography data to Sanity CMS.
- Transition/animation between the landing sticker click and the detail page.
- Any changes to the global `Nav` or `CharterConsent`.
