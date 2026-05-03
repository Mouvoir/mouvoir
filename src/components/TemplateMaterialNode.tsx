"use client";

import { motion } from "framer-motion";
import { forwardRef, type PointerEvent as ReactPointerEvent, type Ref } from "react";
import type { ScatterSlot } from "@/hooks/useScatterPositions";
import type { AnchorSide } from "@/hooks/useConnections";

export interface MaterialNodeData {
  id: string;
  label: string;
  imageUrl?: string;
  /** background gradient used as the polaroid fallback when imageUrl is absent */
  fallbackGradient: string;
}

interface TemplateMaterialNodeProps {
  material: MaterialNodeData;
  slot: ScatterSlot;
  index: number;
  isConnected: boolean;
  isDragSource: boolean;
  anchorRefs: { left: Ref<HTMLButtonElement>; right: Ref<HTMLButtonElement> };
  onAnchorPointerDown: (side: AnchorSide, e: ReactPointerEvent<HTMLButtonElement>) => void;
  onAnchorPointerUp: (side: AnchorSide, e: ReactPointerEvent<HTMLButtonElement>) => void;
  anchorAriaLabel: (side: AnchorSide) => string;
}

const POLAROID_RATIOS = ["16/10", "4/5", "16/9", "4/3", "1/1"] as const;

function pickRatio(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return POLAROID_RATIOS[Math.abs(h) % POLAROID_RATIOS.length];
}

export const TemplateMaterialNode = forwardRef<HTMLDivElement, TemplateMaterialNodeProps>(
  function TemplateMaterialNode(
    {
      material,
      slot,
      index,
      isConnected,
      isDragSource,
      anchorRefs,
      onAnchorPointerDown,
      onAnchorPointerUp,
      anchorAriaLabel,
    },
    ref,
  ) {
    const ratio = pickRatio(material.id);
    const leftAnchorRef = anchorRefs.left;
    const rightAnchorRef = anchorRefs.right;
    return (
      <motion.div
        ref={ref}
        className={`material-node${isConnected ? " material-node--connected" : ""}${isDragSource ? " material-node--drag-source" : ""}`}
        style={{
          left: `${slot.x}%`,
          top: `${slot.y}%`,
          ["--rot" as string]: `${slot.rotate}deg`,
        }}
        initial={{ opacity: 0, scale: 0.85, rotate: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, rotate: slot.rotate, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.06 * index,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <button
          // eslint-disable-next-line react-hooks/refs
          ref={leftAnchorRef}
          type="button"
          className="material-node__anchor material-node__anchor--left"
          aria-label={anchorAriaLabel("left")}
          onPointerDown={(e) => onAnchorPointerDown("left", e)}
          onPointerUp={(e) => onAnchorPointerUp("left", e)}
        >
          <span className="material-node__anchor-dot" aria-hidden="true" />
        </button>

        <figure className="material-node__card">
          <div
            className="material-node__media"
            style={{ aspectRatio: ratio, background: material.fallbackGradient }}
          >
            {material.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={material.imageUrl} alt="" className="material-node__image" />
            ) : null}
          </div>
          <figcaption className="material-node__caption">{material.label}</figcaption>
        </figure>

        <button
          // eslint-disable-next-line react-hooks/refs
          ref={rightAnchorRef}
          type="button"
          className="material-node__anchor material-node__anchor--right"
          aria-label={anchorAriaLabel("right")}
          onPointerDown={(e) => onAnchorPointerDown("right", e)}
          onPointerUp={(e) => onAnchorPointerUp("right", e)}
        >
          <span className="material-node__anchor-dot" aria-hidden="true" />
        </button>
      </motion.div>
    );
  },
);
