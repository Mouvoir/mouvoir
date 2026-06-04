# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start Next.js dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

There is no test runner configured.

## Stack

- **Next.js 16.2.4** (App Router) + **React 19.2.4**. APIs in this Next.js version differ from older training data — consult `node_modules/next/dist/docs/` (especially `01-app/`) before writing route/server-component code.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. Theme tokens (colors, fonts, radii) are declared in `src/app/globals.css` inside `@theme inline { … }`; do not reintroduce a `tailwind.config.*` file.
- **Sanity v5** embedded in-app via `next-sanity`.
- **framer-motion** is installed and available for page transitions/animations.
- TS path alias `@/*` → `./src/*`.

## Environment variables

Set in `.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` — consumed by `src/sanity/client.ts`. Both have placeholder fallbacks, so missing values won't crash at import time but will break real fetches.
- `YOUTUBE_API_KEY` — used by `src/lib/youtube.ts#fetchYoutubeMeta` to enrich gallery entries with title/duration/thumbnail from the YouTube Data API v3. 24h `revalidate`; silently returns `{}` when the key is missing or the request fails, so callers must tolerate empty metadata.
- `SANITY_WRITE_TOKEN` — server-only Sanity token with write permissions, consumed by `src/sanity/writeClient.ts` for mutations (e.g. the image-bank submission server action). Not prefixed with `NEXT_PUBLIC_` so it stays out of the browser bundle. Without it, write operations will fail at runtime.

## Architecture

### Routing layout (App Router)
- `src/app/layout.tsx` is the single root layout: it loads the font, renders `<Nav>` and `<CharterConsent>`, and wraps children in `.page-shell` / `.page-content`. The app is French-only — no i18n, no locale segment.
- Page routes: `/`, `/template`, `/template/[slug]`, `/gallery/[slug]`, `/image-bank`, `/useful-links`, `/about`, `/contact`. The charter is not a route — it's rendered in full as a first-visit consent modal (`CharterConsent`).
- `[slug]` pages receive `params` as a **Promise** — must `await` it (Next 15+ behavior). See `src/app/template/[slug]/page.tsx` for the pattern, including `generateStaticParams`.

### Sanity Studio (embedded)
- Studio is mounted at `/studio` through the optional catch-all route `src/app/studio/[[...tool]]/page.tsx`, which renders `<SanityStudio />` from `src/sanity/studio.tsx` (a `"use client"` wrapper around `NextStudio`). The page sets `export const dynamic = "force-dynamic"`.
- Root `sanity.config.ts` spreads `sanityConfig` from `src/sanity/config.ts` and registers `schemaTypes` from `src/sanity/schemaTypes.ts`. To add a schema, create it under `src/sanity/schemas/` and append to the `schemaTypes` array.
- Existing schemas: `template`, `galleryEntry`, `mediaAsset`, `usefulLink`.
- Sanity client (`src/sanity/client.ts`) reads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`; both fall back to placeholders, so set them in `.env.local` before any real fetch.

### Content data flow
- `src/lib/templates.ts` and `src/lib/gallery.ts` are **hardcoded fixture maps** keyed by slug, currently used by the public pages while the Sanity content model is being wired up. The Sanity schemas in `src/sanity/schemas/` mirror the same domain (template / gallery entry) but are not yet consumed by the pages. When migrating a page from fixtures to Sanity, replace the `TEMPLATES[slug]` / `GALLERY_ENTRIES` lookups with a GROQ query through `sanityClient`.

### Styling conventions
- Shared layout primitives are CSS classes in `globals.css`, not Tailwind components: `.page-shell` (with `--pink` modifier), `.page-content`, `.h-page`, `.subline`, `.btn-outline`, `.btn-cta`, `.tag`. Reuse these instead of re-deriving the same Tailwind clusters.
- Pages otherwise use Tailwind utilities directly (often arbitrary values like `text-[22px]`, `gap-[72px]`) to match the design comps — keep that style for new pages rather than adding bespoke CSS.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **mouvoir** (537 symbols, 787 relationships, 25 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/mouvoir/context` | Codebase overview, check index freshness |
| `gitnexus://repo/mouvoir/clusters` | All functional areas |
| `gitnexus://repo/mouvoir/processes` | All execution flows |
| `gitnexus://repo/mouvoir/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
