# Homepage Redesign — White Background + WebM Star Videos

**Date:** 2026-05-05
**Status:** Approved

## Goal

Replace the current pink hero homepage with a clean white layout featuring the "Partycule" brand name in a large italic serif font, surrounded by animated star-shaped WebM videos scattered across the page.

## Reference

Design comp shows: white background, Nav (white variant), large italic "Partycule" center text, 3–4 star video elements at varied sizes and rotations.

## Architecture

Single file change: `src/app/[locale]/page.tsx`

No new components needed. The star videos are inline `<video>` tags driven by a local config array.

## Layout

- `page-shell` without `--pink` modifier → white background, dark text
- Full-viewport hero section with `position: relative` to anchor absolute video elements
- Nav receives `variant="white"` (already the default — no change needed)

## Typography

- Font: **Playfair Display** (italic) loaded from Google Fonts via `<link>` in the page or via `next/font/google`
- Size: ~130px, centered horizontally and vertically in the hero
- Text: the brand name "Partycule" in italic

## Star Videos (data-driven)

A `STARS` constant array, each entry:

```ts
{ src: string; size: number; top: string; left: string; rotate: number }
```

Initial 3 instances using the two available WebM files:

| # | src | size | position | rotate |
|---|-----|------|----------|--------|
| 1 | anim01_vert.webm | 280px | top: 35%, left: 8% | −15° |
| 2 | anim01_orange.webm | 400px | top: 20%, left: 40% | 10° |
| 3 | anim01_vert.webm | 200px | top: 55%, left: 72% | 5° |

Each video: `autoPlay loop muted playsInline`, `position: absolute`, `pointer-events-none`, `z-index: 1`.

Adding a new WebM later = add one line to `STARS`. No JSX changes needed.

## What Does NOT Change

- Nav component and its links
- i18n setup (`[locale]` routing, `getTranslations`)
- All other pages

## Out of Scope

- Animation on mount (Framer Motion entrance) — not in the reference
- Responsive/mobile layout — not specified
- Nav logo star icon — the reference shows one but the current Nav uses plain text; leave Nav untouched
