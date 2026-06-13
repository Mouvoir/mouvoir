# Choreography-styles detail pages — input spec

Goal: implement the dynamic detail route `/choreography-styles/[slug]` for the 10
choreography stickers already listed in `src/components/choreography/choreStickers.ts`.
Each detail page is a full-screen black collage of `mix-blend-mode: screen` video/image
layers — the SAME compositing technique as the landing page — recreating the comp in the
project's `doc/swisstransfer_*/PAGE_*.pdf` (page 1 = final design, page 2 = annotated asset map).

## Hard facts (verified)

- Container: NO special layout. Pages render inside the root `.page-shell` (20px pad) →
  `.page-content` (max-width 1760px, centered) which already renders `<Nav>`. So the page
  body is just the collage block, same as the landing `page.tsx`. The 1760px content column
  IS the "screen box"; positions are % of it. Reuse `collage.module.css` (`.collage`,`.screen`).
- The MOUVOIR logo + nav tabs in the comps = the global `<Nav>`. Do NOT re-render them.
  Only `back_bleu` (BACK button, top-left of the screen box) is page content.
- All assets already exist in `public/<folder>/` as `.mov` + `.webm` + `.png` triples.
  `<source>` order MUST be `.mov` (quicktime) then `.webm` (per asset-conventions.md).
- Slugs/folders already defined in `choreStickers.ts`. Detail data SHOULD reuse those slugs;
  slug→folder mapping: quantu-motion→quantu_motion, jam-ctrl-f→jam_ctrlf_f, modul-aura→modul_aura.
- There is NO uniform "full" archetype — asset sets differ per page (see table). The data
  model must be per-page flexible (optional title video vs PNG, variable jingle stills,
  conditional follow_the_beats, cross-folder assets).
- `keep_moving` and `follow_the_beats_bleu` are decorative LINK stickers. Default keep_moving
  link → `/movement-rehearsal` (the "Keep Moving" tutorials section, renamed). follow_the_beats
  also → `/movement-rehearsal` for now. User will retune; make the href a data field.
- Positions below are ROUGH eyeball estimates from the comps and WILL be hand-tuned by the
  user later (cf. the "nudged" comments in choreStickers.ts). Get them approximately right;
  do not agonize. All values are % (left/top/width of the screen box).

## Common to every detail page
- `back_bleu` link sticker → `/choreography-styles`: left 0, top 2, width 9.
- `keep_moving` link sticker → href (default `/movement-rehearsal`): left 83, top 72, width 14.

## Page type A — full project pages (4)

### greyclub  (doc/swisstransfer_59a97f85…/PAGE_PROJET_GREYCLUB…pdf)
- main VIDEO `greyclub/greyclub`            left 2,  top 22, width 58
- title IMAGE `greyclub/greyclub_jingle_titre00.png`  left 62, top 14, width 33  (GREYCLUB+MATHILDE baked)
- info VIDEO `greyclub/greyclub_infos01`    left 68, top 40, width 22
- info VIDEO `greyclub/greyclub_infos02`    left 70, top 48, width 24
- (no secondary video, no jingle stills, no follow_the_beats)

### urbex  (doc/swisstransfer_f3b1917f…/PAGE_PROJET_URBEX…pdf)
- main VIDEO `urbex/urbex`                  left 1,  top 28, width 62
- title VIDEO `urbex/urbex_titre`           left 72, top 25, width 24  (URBEX 10.3 + ROZETTA)
- info VIDEO `urbex/urbex_infos01`          left 70, top 38, width 20
- info VIDEO `urbex/urbex_infos02`          left 70, top 50, width 24
- jingle IMAGE `urbex/urbex_jingle_020.png` left 2,  top 30, width 18  (two people standing, top-left of main)
- jingle IMAGE `urbex/urbex_jingle_030.png` left 50, top 68, width 17  (close-up face, bottom-right of main)
- follow_the_beats_bleu LINK               left 68, top 80, width 13

### quantu_motion  (doc/swisstransfer_ca8b8f75…/PAGE_PROJET_QUANTUMotion…pdf)
- main VIDEO `quantu_motion/quantu_motion`  left 2,  top 25, width 62
- title VIDEO `quantu_motion/quantu_motion_titre`  left 72, top 14, width 24  (QUANTUMotion + ROZETTA)
- info VIDEO `quantu_motion/quantu_motion_infos01`  left 70, top 32, width 22
- info VIDEO `quantu_motion/quantu_motion_infos02`  left 70, top 46, width 24
- jingle IMAGE `quantu_motion/quantu_motion_jingle020.png`  left 0,  top 38, width 24  (left blob)
- jingle IMAGE `quantu_motion/quantu_motion_jingle0300.png` left 45, top 26, width 20  (top-mid-right blob)
- jingle IMAGE `quantu_motion/quantu_motion_jingle010.png`  left 60, top 64, width 12  (bottom-mid tall person)
- follow_the_beats_bleu LINK               left 66, top 80, width 13

### brightness  (doc/swisstransfer_9a370cc4…/PAGE_PROJET_BRIGHTNESS.pdf)
- main VIDEO `brightness/brightness`        left 17, top 36, width 38
- title IMAGE `brightness/brightness_jingle_titre00.png`  left 70, top 14, width 26  (BRIGHTNESS + ROZETTA+LISE)
- info VIDEO `brightness/brightness_infos01`  left 70, top 40, width 22
- info VIDEO `brightness/brightness_infos02`  left 70, top 52, width 22
- jingle IMAGE `jam_ctrlf_f/jam_ctrlf_f_020.png` left 2,  top 32, width 16  (CROSS-FOLDER, left blob)
- jingle IMAGE `jam_ctrlf_f/jam_ctrlf_f_010.png` left 40, top 24, width 22  (CROSS-FOLDER, DJ hands top-mid)
- jingle IMAGE `jam_ctrlf_f/jam_ctrlf_f_030.png` left 63, top 68, width 12  (CROSS-FOLDER, bottom-right)
- (no follow_the_beats)

## Page type B — "still in training" placeholder pages (6)
Layout (doc/swisstransfer_48062ba2…/PAGE_PAS_FAIT_EXPLICATION.pdf):
- banner VIDEO `still_in_training_bleu/still_in_training_bleu`  left 30, top 18, width 38  (STILL IN TRAINING…)
- central VIDEO `<folder>/<folder>_anim`  left 28, top 38, width 30  (cutout + title + artist baked)
- (+ common back + keep_moving)

Pages and their central `_anim` folder:
- light     → light/light_anim
- yoyo      → yoyo/yoyo_anim
- turfuzz   → turfuzz/turfuzz_anim
- modul-aura→ modul_aura/modul_aura_anim
- jam-ctrl-f→ jam_ctrlf_f/jam_ctrlf_f_anim
- milas     → NO public folder/asset → render banner + keep_moving only (central sticker omitted)

## Notes for data model / components
- A layer is `{ kind: 'video' | 'image', asset, left, top, width, href? }`. Video layer
  renders `<video autoPlay muted loop playsInline>` with mov→webm sources + png poster
  (`${asset}.png`); image layer renders `<img src={asset}>`. All layers get
  `mix-blend-mode: screen`, absolute %-positioned. A layer with `href` is wrapped in `<Link>`.
- Reuse the landing's screen-blend approach; consider a single `ChoreLayer` component used by
  both archetypes. Keep blast radius small — do not rewrite the landing `ChoreSticker`.
- `[slug]/page.tsx`: `await params`, `notFound()` for unknown slug, `generateStaticParams`
  over the 10 detail slugs.
