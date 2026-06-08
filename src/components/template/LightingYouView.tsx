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
} from "./lightingYouLayout";
import styles from "./lightingYou.module.css";

function place({ top, left, width, rotation }: Placed): CSSProperties {
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${width}%`,
    ...(rotation ? { transform: `rotate(${rotation}deg)` } : {}),
  };
}

export function LightingYouView() {
  const [active, setActive] = useState<InfoId | null>(null);

  const triggerProps = (info: InfoId) => ({
    onMouseEnter: () => setActive(info),
    onMouseLeave: () => setActive((cur) => (cur === info ? null : cur)),
    onFocus: () => setActive(info),
    onBlur: () => setActive((cur) => (cur === info ? null : cur)),
    onClick: () => setActive((cur) => (cur === info ? null : info)),
  });

  return (
    <div className={styles.scene}>
      <div className={styles.hero} style={place(HERO)}>
        <AssetVideo folder={HERO.folder} name={HERO.name} />
      </div>

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
