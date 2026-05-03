"use client";

import type { AnchorSide, Connection } from "@/hooks/useConnections";

export interface AnchorPoint {
  x: number;
  y: number;
}

export interface NodeAnchors {
  left: AnchorPoint;
  right: AnchorPoint;
}

interface DragSnapshot {
  fromMaterialId: string;
  fromSide: AnchorSide;
  cursorX: number;
  cursorY: number;
}

interface TemplateConnectionLayerProps {
  width: number;
  height: number;
  connections: Connection[];
  anchorPositions: Map<string, NodeAnchors>;
  selectedConnectionId: string | null;
  drag: DragSnapshot | null;
  onSelect: (id: string) => void;
}

function buildPath(x1: number, y1: number, fromSide: AnchorSide, x2: number, y2: number, toSide: AnchorSide): string {
  const sideMul = (s: AnchorSide) => (s === "right" ? 1 : -1);
  const dist = Math.max(60, Math.abs(x2 - x1) * 0.6);
  const cp1x = x1 + sideMul(fromSide) * dist;
  const cp2x = x2 + sideMul(toSide) * dist;
  return `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;
}

export function TemplateConnectionLayer({
  width,
  height,
  connections,
  anchorPositions,
  selectedConnectionId,
  drag,
  onSelect,
}: TemplateConnectionLayerProps) {
  return (
    <svg
      className="connection-layer"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="connection-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((c) => {
        const fromAnchors = anchorPositions.get(c.fromMaterialId);
        const toAnchors = anchorPositions.get(c.toMaterialId);
        if (!fromAnchors || !toAnchors) return null;
        const from = fromAnchors[c.fromSide];
        const to = toAnchors[c.toSide];
        const d = buildPath(from.x, from.y, c.fromSide, to.x, to.y, c.toSide);
        const isSelected = c.id === selectedConnectionId;
        return (
          <g key={c.id} className={`connection-line${isSelected ? " connection-line--selected" : ""}`}>
            <path
              d={d}
              className="connection-line__hit"
              onClick={() => onSelect(c.id)}
            />
            <path
              d={d}
              className="connection-line__visible"
              filter={isSelected ? "url(#connection-glow)" : undefined}
            />
          </g>
        );
      })}

      {drag
        ? (() => {
            const fromAnchors = anchorPositions.get(drag.fromMaterialId);
            if (!fromAnchors) return null;
            const from = fromAnchors[drag.fromSide];
            const d = buildPath(from.x, from.y, drag.fromSide, drag.cursorX, drag.cursorY, drag.fromSide === "right" ? "left" : "right");
            return <path d={d} className="connection-line__draft" />;
          })()
        : null}
    </svg>
  );
}
