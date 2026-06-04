# Static Asset Conventions (`public/`)

How videos, posters and images are organised under `public/`. This is the
single source of truth — when you add or rename an asset, follow it exactly so
the code can build paths from a name alone (no per-file wiring, no URL-encoding).

## Golden rules

1. **One folder per asset unit.** A "unit" is whatever the UI references as a
   whole (a template sticker, a logo, a UI control, a charter rule).
2. **Folder name = base file name.** Every file inside repeats the folder name
   as its base: `public/<unit>/<unit>.<ext>`. Variants append a suffix to that
   base (`<unit>_anim.webm`). Never invent unrelated file names.
3. **ASCII `snake_case` only.** Folder and base names use `[a-z0-9_]`. No
   spaces, no `&`, no accents, no uppercase. This is what lets the code write
   `` `/${folder}/${folder}.webm` `` without `encodeURIComponent`. The visible
   title (with `&`, capitals, accents) lives in code/CMS, not in the path —
   e.g. folder `shade_and_shape`, title `"Shade & Shape"`.
4. **Video = three files, always together:** `.mov`, `.webm`, `.png`.
   - `.mov` — QuickTime container, HEVC, alpha preserved. Served **first**
     (Safari/WebKit path).
   - `.webm` — VP9, alpha preserved. Fallback for everyone else.
   - `.png` — first-frame still, used as `<video poster>` and as the final
     `<img>` fallback.
5. **`<source>` order is `.mov` then `.webm`.** Safari ignores VP9 webm with
   alpha; listing the mov first lets it pick the working source. Keep this order
   in every `<video>`.
6. **No raw editing leftovers.** No `.DS_Store`, no `_2`/`_final`/`_copy`
   suffixes, no orphan stray files at a category root. Encoding source material
   stays in `doc/`, never in `public/`.

## Categories

`public/` mixes several asset families. Each follows the golden rules; they
differ only in which files exist and whether they nest.

### 1. Template stickers — `public/<template>/`

The primary case. `<template>` matches the `folder` key in
`src/components/templateStickers.ts`. Each template ships **two** video sets:

| File | Role | Consumed by |
| --- | --- | --- |
| `<template>.mov` / `.webm` / `.png` | plain result clip + poster | `AssetVideo` (`src/components/AssetVideo.tsx`) |
| `<template>_anim.mov` / `.webm` | self-contained animated sticker — cutout + neon title + tools baked on black | `TemplateSticker` (`src/components/TemplateSticker.tsx`) |

Example:

```
public/dance_lens/
  dance_lens.mov
  dance_lens.webm
  dance_lens.png
  dance_lens_anim.mov
  dance_lens_anim.webm
```

To add a template: create the folder, drop the five files, then add one row to
`TEMPLATE_STICKERS` with `folder: "<template>"`. No path strings elsewhere.

### 2. Charter rules — `public/regle_0N/`

Charter stickers nest one level: a rule folder holds the main sticker plus its
`a`/`b`/`c` secondary layers, each in its own sub-folder named by the suffix.

```
public/regle_03/
  regle_03/   regle_03.mov  regle_03.webm  regle_03.png   ← main layer
  regle_03a/  regle_03a.mov regle_03a.webm regle_03a.png  ← secondary layers
  regle_03b/  …
  regle_03c/  …
```

The rule id is zero-padded two digits (`regle_01` … `regle_05`); layer suffix is
a single lowercase letter. Paths are derived in
`src/components/charterRules.ts` (`layer()` helper) — keep the
`<rule>/<rule><suffix>` shape so that helper keeps working.

### 3. Brand / logo videos — `public/mouvoir_<variant>/`

Logo loops. Video pair only, **no `.png` poster** (always on-screen, no poster
needed). Referenced in `src/components/Nav.tsx` as
`` `/mouvoir_${logo}/mouvoir_${logo}.{webm,mov}` ``.

```
public/mouvoir_orange/        mouvoir_orange.mov        mouvoir_orange.webm
public/mouvoir_bleu_orange/   mouvoir_bleu_orange.mov   mouvoir_bleu_orange.webm
```

### 4. UI controls — `public/<control>/`

Small interface clips (e.g. `accept`, `back`). Full video triple
(`.mov`/`.webm`/`.png`), consumed through `AssetVideo` like a template but they
are not templates — keep them out of `TEMPLATE_STICKERS`.

### 5. Loose design tokens — `public/assets/`, `public/button_bg/`

Static SVG/GIF that are not videos and not per-unit (shared decorative pieces,
button backgrounds). These stay flat inside their bucket folder; the
folder-per-unit rule does not apply to them.

## Legacy — do not extend

- **`public/video/`** — old exports (`anim01_*`, `video_logo_02_*`) using
  inconsistent `_alpha` / `_hevc` suffixes. **Frozen.** Do not add files here.
  When a consumer of one of these is touched, migrate it to a category folder
  above and delete the legacy file in the same change.

## Checklist when adding an asset

- [ ] Folder + base name are ASCII `snake_case`.
- [ ] Video ships `.mov` + `.webm` + `.png` (poster optional only for logos).
- [ ] `<source>` order is `.mov` then `.webm` in the consuming component.
- [ ] Visible title lives in code/CMS, not in the file name.
- [ ] No `.DS_Store` / `_2` / `_copy` / source files committed under `public/`.
- [ ] Path is derived from the name (`/${folder}/${folder}.ext`), not hardcoded.
