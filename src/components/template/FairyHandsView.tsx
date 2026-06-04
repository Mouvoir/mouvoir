"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { AssetVideo } from "@/components/shared/AssetVideo";
import {
  BUBBLES,
  HERO,
  STICKERS,
  TOOLS,
  type InfoId,
  type Placed,
  type StickerEl,
} from "./fairyHandsLayout";
import styles from "./fairyHands.module.css";

// Inline style for an absolutely-placed scene layer.
function place({ top, left, width, rotation }: Placed): CSSProperties {
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${width}%`,
    ...(rotation ? { transform: `rotate(${rotation}deg)` } : {}),
  };
}

// Tutorial view for the "Fairy Hands" template. A black stage of free-floating
// neon stickers; hovering a tool-kit object (or the WHISPER sticker) reveals
// its red speech bubble. Layout lives in fairyHandsLayout.ts.
export function FairyHandsView() {
  const [active, setActive] = useState<InfoId | null>(null);

  // Hover reveals; click toggles (so touch devices can open a bubble too).
  const triggerProps = (info: InfoId) => ({
    onMouseEnter: () => setActive(info),
    onMouseLeave: () => setActive((cur) => (cur === info ? null : cur)),
    onFocus: () => setActive(info),
    onBlur: () => setActive((cur) => (cur === info ? null : cur)),
    onClick: () => setActive((cur) => (cur === info ? null : info)),
  });

  return (
    <div className={styles.scene}>
      {/* Hero result footage, lowest so neon titles read on top of it. */}
      <div className={styles.hero} style={place(HERO)}>
        <AssetVideo folder={HERO.folder} name={HERO.name} />
      </div>

      {/* Speech bubbles: only the active one is mounted. pointer-events:none so
          hovering the bubble itself never steals the trigger's hover. */}
      <AnimatePresence>
        {BUBBLES.filter((b) => b.id === active).map((bubble) => (
          <motion.div
            key={bubble.id}
            className={styles.bubble}
            style={place(bubble)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <AssetVideo folder={bubble.folder} name={bubble.name} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Tool-kit objects (transparent PNGs) — hover targets. */}
      {TOOLS.map((tool) => (
        <button
          key={tool.src}
          type="button"
          className={styles.tool}
          style={place(tool)}
          aria-label={tool.alt}
          {...triggerProps(tool.info)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tool.src} alt={tool.alt} />
        </button>
      ))}

      {/* Static neon stickers (links / triggers / decorative). */}
      {STICKERS.map((sticker) => (
        <Sticker key={sticker.name} sticker={sticker} triggerProps={triggerProps} />
      ))}
    </div>
  );
}

function Sticker({
  sticker,
  triggerProps,
}: {
  sticker: StickerEl;
  triggerProps: (info: InfoId) => Record<string, () => void>;
}) {
  const media = <AssetVideo folder={sticker.folder} name={sticker.name} />;
  const style = place(sticker);

  if (sticker.href) {
    return (
      <Link
        href={sticker.href}
        className={styles.sticker}
        style={style}
        aria-label={sticker.label}
      >
        {media}
      </Link>
    );
  }

  if (sticker.info) {
    return (
      <button
        type="button"
        className={styles.sticker}
        style={style}
        aria-label={sticker.label}
        {...triggerProps(sticker.info)}
      >
        {media}
      </button>
    );
  }

  return (
    <div
      className={styles.sticker}
      style={style}
      role="img"
      aria-label={sticker.label}
    >
      {media}
    </div>
  );
}
