import { useMemo } from "react";

export interface ScatterSlot {
  x: number;       // percent, 0..100
  y: number;       // percent, 0..100
  rotate: number;  // degrees
}

// Deterministic 32-bit hash on a string. Stable, fast, no deps.
function hash32(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

// Returns a value in [-1, 1) deterministically derived from input.
function jitter(input: string): number {
  const h = hash32(input);
  return ((h & 0xffff) / 0x10000) * 2 - 1;
}

interface LayoutOptions {
  cols: number;
  rows: number;
  /** Top/bottom padding inside container, in percent (avoids overflow at the edges). */
  paddingY: number;
  /** Left/right padding inside container, in percent. */
  paddingX: number;
  /** Maximum jitter inside each cell, as fraction of cell size. 0 = grid, 1 = touches neighbor. */
  jitterAmount: number;
}

const DESKTOP_LAYOUT: LayoutOptions = {
  cols: 4,
  rows: 2,
  paddingY: 8,
  paddingX: 6,
  jitterAmount: 0.35,
};

const MOBILE_LAYOUT: LayoutOptions = {
  cols: 2,
  rows: 4,
  paddingY: 4,
  paddingX: 4,
  jitterAmount: 0.15,
};

function computeSlots(ids: string[], opts: LayoutOptions): Map<string, ScatterSlot> {
  const cells = opts.cols * opts.rows;
  const visible = ids.slice(0, cells);
  const cellW = (100 - 2 * opts.paddingX) / opts.cols;
  const cellH = (100 - 2 * opts.paddingY) / opts.rows;
  const result = new Map<string, ScatterSlot>();
  for (let i = 0; i < visible.length; i++) {
    const id = visible[i];
    const col = i % opts.cols;
    const row = Math.floor(i / opts.cols);
    const cx = opts.paddingX + cellW * (col + 0.5);
    const cy = opts.paddingY + cellH * (row + 0.5);
    const jx = jitter(`${id}:x`) * cellW * opts.jitterAmount * 0.5;
    const jy = jitter(`${id}:y`) * cellH * opts.jitterAmount * 0.5;
    const rot = jitter(`${id}:r`) * 10; // ±10 degrees
    result.set(id, { x: cx + jx, y: cy + jy, rotate: rot });
  }
  return result;
}

export function useScatterPositions(materialIds: string[]): {
  desktop: Map<string, ScatterSlot>;
  mobile: Map<string, ScatterSlot>;
} {
  return useMemo(
    () => ({
      desktop: computeSlots(materialIds, DESKTOP_LAYOUT),
      mobile: computeSlots(materialIds, MOBILE_LAYOUT),
    }),
    // Memoize on the joined ids — array identity is unstable but content is deterministic.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [materialIds.join("|")],
  );
}
