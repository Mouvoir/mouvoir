# Template Material Graph — Design

**Date:** 2026-05-03
**Page:** `/template` (locale-prefixed, e.g. `/fr/template`, `/en/template`)
**Replaces:** `TemplateScatterBoard` (decorative polaroid scatter)

## Goal

Turn the hero of the `/template` page into an interactive material graph. The user connects materials together by drawing lines between blue anchor points; templates that use ALL connected materials surface in a fullscreen carousel modal.

## User flow

1. The user lands on `/template`. The hero shows every material in the system as a polaroid-style card scattered across the board, each with two small blue square anchors on its left and right sides.
2. The user drags from any anchor to another material's anchor to draw a curved connection line.
3. As connections accumulate, a floating CTA at the bottom of the board updates: `"Voir les N templates"`. The CTA is enabled only when every connected material belongs to a single connected component.
4. Clicking the CTA opens a modal styled like `AddEntryModal` (1100px white panel over a pink blurred overlay).
5. Inside, a carousel shows one larger `TemplateMosaicCard` at a time, navigable with arrow buttons, keyboard arrows, or swipe.
6. Closing the modal returns the user to the board with their connections intact.
7. A secondary `"Tout réinitialiser"` button clears all connections at once. Individual lines are removed by clicking them and pressing Delete (or via a popover on touch).

## Filter semantics

- **AND / intersection:** a template matches only if it uses every material currently connected.
- **Connected materials** = the union of `fromMaterialId` and `toMaterialId` across all connections (i.e. all materials touched by at least one line).
- **Single connected graph required:** if the user draws two isolated subgraphs, the CTA disables with the tooltip `"Connecte toutes tes grappes ensemble"`. Enforcement is permissive (lines are still drawable), not strict (no snap-back).
- Matching is computed entirely client-side: `templates.filter(t => connectedMaterialIds.every(mid => t.materials.some(m => m.id === mid)))`.

## Architecture

### File map

New files:

- `src/components/TemplateMaterialGraph.tsx` — orchestrator. `"use client"`. Owns state. Renders the SVG layer, all material nodes, the floating CTA, and the modal.
- `src/components/TemplateMaterialNode.tsx` — a single material card with two anchors.
- `src/components/TemplateConnectionLayer.tsx` — full-bleed `<svg>` rendering every persisted connection as a Bézier path, plus the in-progress drag draft.
- `src/components/TemplateCarouselModal.tsx` — modal wrapper around the carousel of large mosaic cards.
- `src/hooks/useScatterPositions.ts` — deterministic position generator keyed on material id.
- `src/hooks/useConnections.ts` — connections array + add/remove/select reducers.
- `src/hooks/useGraphConnectivity.ts` — derives `connectedMaterialIds`, `isGraphConnected`, `matchingTemplates`.

Modified files:

- `src/app/[locale]/template/page.tsx` — replaces `<TemplateScatterBoard />` with `<TemplateMaterialGraph materials={...} templates={...} />`.
- `src/app/globals.css` — removes `.template-scatter*` rules, adds `.material-graph*`, `.material-node*`, `.connection-line*`, `.carousel-modal*`, `.template-mosaic--lg`.
- `src/components/TemplateMosaicCard.tsx` — accepts an optional `size?: "default" | "lg"` prop that toggles the new `.template-mosaic--lg` modifier.

Removed files:

- `src/components/TemplateScatterBoard.tsx`.

### Layered structure inside `TemplateMaterialGraph`

```
<section class="material-graph" ref={containerRef}>
  <TemplateConnectionLayer ... />          {/* SVG, behind the nodes */}
  {materials.map(m => <TemplateMaterialNode ... />)}
  <div class="material-graph__cta">
    <button>Voir les N templates</button>
    <button>Tout réinitialiser</button>
  </div>
  <TemplateCarouselModal open={...} ... />
</section>
```

The container is `position: relative`. Material nodes are absolutely positioned. The SVG fills the container and uses `pointer-events: none` except on its `<path>` elements.

## Data model

```ts
interface MaterialNode {
  id: string;
  label: string;
  imageUrl?: string;
  x: number;       // percent of container width, deterministic
  y: number;       // percent of container height, deterministic
  rotate: number;  // degrees, deterministic
}

interface Connection {
  id: string;        // crypto.randomUUID() at creation time
  fromMaterialId: string;
  fromSide: "left" | "right";
  toMaterialId: string;
  toSide: "left" | "right";
}

interface DragState {
  fromMaterialId: string;
  fromSide: "left" | "right";
  cursorX: number;   // pixels relative to container
  cursorY: number;
}
```

State held by `TemplateMaterialGraph`:

- `connections: Connection[]`
- `selectedConnectionId: string | null`
- `drag: DragState | null`
- `isModalOpen: boolean`

Derived (`useMemo`):

- `connectedMaterialIds: Set<string>` — every material touched by ≥1 connection.
- `isGraphConnected: boolean` — true when BFS from any connected node visits every other connected node.
- `matchingTemplates: Template[]` — AND-filter result.

`useScatterPositions(materials)` returns positions/rotations from a string hash of `material.id`, mapped onto a jittered grid. Positions are stable between renders and identical between SSR and client (no `Math.random`).

## Component contracts

### `TemplateMaterialGraph`

- **Props:** `{ materials: ScatterMaterial[]; templates: Template[] }`.
- Mounts a `ResizeObserver` on its container ref to convert percent positions → pixel coords for SVG paths.
- Attaches global `pointermove`/`pointerup`/`keydown` listeners while a drag or selection is active. Detaches them otherwise.
- Cleans up `selectedConnectionId` when clicking outside any path or anchor.

### `TemplateMaterialNode`

- **Props:** `{ material: MaterialNode; isConnected: boolean; isDragSource: boolean; onAnchorPointerDown: (side, e) => void; onAnchorPointerEnter: (side) => void; onAnchorPointerUp: (side, e) => void }`.
- Wraps content in `motion.div` with the same enter animation as the current scatter (opacity/scale/rotate fade-in, staggered delay by index).
- Each anchor is a `<button class="material-node__anchor" aria-label="Connecter <label> (côté <side>)">`. Hit-area 28×28; visual square 16×16.
- `whileHover` does not zero the rotation when `isDragSource === true` (avoids jumping the source while a line is being drawn).

### `TemplateConnectionLayer`

- **Props:** `{ connections, anchorPositions: Map<materialId, { left: {x,y}, right: {x,y} }>, selectedId, dragState, onSelect }`.
- Renders, for each connection:
  - A wide invisible `<path>` (12px, `stroke="transparent"`, `pointer-events: visibleStroke`) for hit-testing.
  - A visible `<path>` (2.5px or 4px when selected, blue `#2563eb`).
  - A cubic Bézier with control points offset horizontally by `0.6 × |dx|` from each endpoint (slack-cable feel).
- During drag, an extra dashed path runs from the source anchor to `dragState.cursorX/Y`. Uses `stroke-dasharray: 6 4` and animates `stroke-dashoffset` for marching-ants feedback.

### `TemplateCarouselModal`

- **Props:** `{ open, onClose, templates: Template[], connectedMaterials: ScatterMaterial[] }`.
- Reuses the overlay/panel chrome from `AddEntryModal` (pink-tinted backdrop with blur, 1100px panel, escape/click-outside to close).
- Header: page title + a row of `MaterialChip` for each connected material.
- Carousel:
  - `motion.div drag="x"` + `dragConstraints={{ left: 0, right: 0 }}` for swipe detection. Threshold ±50px commits the next/previous index.
  - Arrow buttons left/right; `←`/`→` on keyboard.
  - Pagination indicator `N / total` plus clickable dots.
  - Empty state: when `templates.length === 0`, show centered message `"Aucun template ne combine ces matériaux. Essaie d'en retirer un."`.
- Renders `<TemplateMosaicCard ... size="lg" />` for the active index.

### `TemplateMosaicCard` modification

- New optional prop `size?: "default" | "lg"`. Defaults to `"default"`.
- When `"lg"`: adds class `.template-mosaic--lg` which scales up the title font, the media block (taller `aspect-ratio` or fixed `min-height`), and the action buttons. No duplication of markup or behavior.

## Interaction details

### Starting a connection

1. `pointerdown` on an anchor → `setDrag(...)`, `e.preventDefault()`, `e.currentTarget.setPointerCapture(e.pointerId)`.
2. Window `pointermove` updates `drag.cursorX/Y` (computed via `getBoundingClientRect()` of the container).
3. The connection layer redraws the draft path on every frame.

### Completing a connection

- `pointerup` over a different material's anchor → push a new `Connection`, clear `drag`.
- `pointerup` anywhere else → clear `drag` only.
- Same-material drop → ignored.
- Exact-duplicate connection (same two materials, same two sides) → ignored.

### Selecting and deleting

- `click` on a path → set `selectedConnectionId`; the line widens and saturates.
- `click` outside any path/anchor → clear selection.
- Desktop: `keydown` `Delete` or `Backspace` removes the selected connection.
- Touch: `tap` on a path opens an inline popover anchored near the line midpoint with `Supprimer` and `Annuler` buttons.

### CTA states

- `connectedMaterialIds.size === 0` → CTA disabled, text `"Connecte des matériaux pour voir les templates"`.
- `connectedMaterialIds.size > 0 && !isGraphConnected` → CTA disabled, text `"Connecte toutes tes grappes ensemble"`.
- `connectedMaterialIds.size > 0 && isGraphConnected` → CTA enabled, text `"Voir les N templates"` (or `"Voir le template"` when `N === 1`). Even when `matchingTemplates.length === 0`, the CTA stays enabled (the modal explains the empty result).
- Reset button is rendered only when `connections.length > 0`.

### Modal lifecycle

- Open: `setIsModalOpen(true)`. Body scroll lock comes from the overlay (same approach as `AddEntryModal`).
- Close: Escape, overlay click, or the close button.
- The board state is preserved across opens/closes.

## Styling

### CSS additions in `globals.css`

- `.material-graph` — container, `position: relative`, `min-height: 520px` desktop / `720px` mobile, full hero width.
- `.material-graph--empty` — placeholder rendered when `materials.length === 0`.
- `.material-graph__cta` — flex row pinned `position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);`. Above `.template-scroll-cue`.
- `.material-node` — polaroid card visuals carried over from `.template-scatter__item`/`__media`/`__caption`. Includes `--connected` modifier (blue drop-shadow halo, slight lift).
- `.material-node__anchor` — 16px blue square, 2px white border, blue glow shadow, hit-area 28px via padding/positioning. Hover/focus: scale + brighter glow.
- `.connection-line` — base 2.5px stroke, blue `#2563eb`, `stroke-linecap: round`. `--selected` variant 4px + saturated + outer SVG `<filter>` glow. `--draft` variant dashed with marching-ants animation.
- `.carousel-modal*` — overlay, panel, header, dots, navigation buttons. Reuses tokens from `AddEntryModal` (pink overlay color, blur amount, panel width, border radius).
- `.template-mosaic--lg` — scales title to ~36px, media min-height ~480px, larger action buttons.

### CSS removals

- All `.template-scatter*` rules (lines 384–432 of current `globals.css`).

### Animation tokens

- All transitions reuse the existing easing `[0.22, 1, 0.36, 1]` and durations of 0.5–0.6s. Carousel slides use `AnimatePresence` with `x: ±100%`.

## Accessibility

- Section landmark: `<section aria-label="Filtre de templates par matériaux">` (label translated via `next-intl`).
- Anchors are real `<button>` elements with `aria-label`.
- Connection paths get an overlaid `<rect>` per line with `tabindex="0"` and `role="button"` to be keyboard-reachable; `aria-label` describes the link (e.g. `"Connexion entre Ruban et Papier"`).
- Keyboard connection mode: focus an anchor, `Enter`/`Space` arms it; the next anchor focused + `Enter` commits the connection. `Escape` cancels.
- An `aria-live="polite"` region announces add/remove operations and the current match count.
- Focus trap inside the carousel modal; focus returns to the CTA on close.

## Mobile / touch

- All pointer interactions go through Pointer Events for unified mouse + touch.
- Anchor hit-area is 28×28 to compensate for finger imprecision.
- Below 600px viewport: the scatter switches to a 2-column compact layout (anchors stay on left/right). Bézier paths recompute against the new positions automatically.
- Carousel: full-bleed on mobile (`padding-inline: 0`, panel becomes `100vw`); horizontal swipe via `motion.div drag="x"`; reduced media height.

## Performance

- `useMemo` for `connectedMaterialIds`, `isGraphConnected`, `matchingTemplates`.
- `useScatterPositions` runs once per `materials` array identity.
- During drag, the only state that changes per frame is `drag.cursorX/Y`. The connection layer re-renders, but persistent connection paths are stable references and React reconciles them as no-ops.
- `ResizeObserver` recomputes pixel coordinates only when the container resizes — anchor positions are derived from the container rect, not measured per node.

## Out of scope

- URL-state persistence (shareable graph links).
- Cross-session persistence (localStorage).
- Frequent-pair suggestions or auto-layouts based on co-occurrence.
- Side-by-side comparison of multiple connected components (we explicitly chose to forbid that).
- "Add to favorites" / cart actions inside the carousel.

## Manual verification plan

There is no test runner in this project. Verify by hand in the browser:

1. **Single connection happy path.** Connect two materials. CTA reads `"Voir le template"` if exactly one match exists, otherwise `"Voir les N templates"`. Open modal — first card shows. Arrows navigate. Close modal — connection persists.
2. **Empty state.** Connect a combination not covered by any template. CTA stays enabled; modal opens to the empty-state message.
3. **Disconnected graph.** Make two isolated pairs. CTA disables and shows `"Connecte toutes tes grappes ensemble"` tooltip on hover.
4. **Selection + delete (desktop).** Click a line; it widens. Press `Delete`; the line vanishes; selection clears.
5. **Selection + delete (touch / DevTools touch emulation).** Tap a line; popover appears; tap `Supprimer`; line vanishes.
6. **Reset.** Make 3 connections; click `Tout réinitialiser`. All disappear; CTA reverts to disabled.
7. **Reload determinism.** Reload the page; all material positions and rotations are identical.
8. **Resize.** Drag the browser edge; lines stay aligned with anchors.
9. **Carousel keyboard.** Open the modal; press `←`/`→`; the active card advances. `Escape` closes. Focus returns to the CTA.
10. **Keyboard connection mode.** Tab to an anchor; `Enter`; tab to a different material's anchor; `Enter`. Connection appears.
11. **Locale parity.** Repeat steps 1, 3, 9 on `/fr/template` and `/en/template`.

## Open questions for implementation

- Confirm there is no existing `--color-primary-blue` (or similar) token in `@theme inline` of `globals.css`. If there is, prefer it over the hardcoded `#2563eb`.
- Determine whether the existing `templates` list returned by `getAllTemplates()` is small enough (current dataset) that filtering in the browser is comfortable. If it ever grows >500 entries, revisit (debounce, indexed lookup).
