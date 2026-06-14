"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { AssetVideo } from "@/components/shared/AssetVideo";
import { KeepMovingCluster } from "./KeepMovingCluster";
import {
  BUBBLES,
  HERO,
  STICKERS,
  TOOLS,
  type InfoId,
  type Placed,
  type StickerEl,
} from "./danceLensLayout";
import { revealVars } from "./sceneReveal";
import styles from "./danceLens.module.css";

function place({ top, left, width, rotation }: Placed): CSSProperties {
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${width}%`,
    ...(rotation ? { transform: `rotate(${rotation}deg)` } : {}),
  };
}

export function DanceLensView() {
  const [active, setActive] = useState<InfoId | null>(null);

  const triggerProps = (info: InfoId) => ({
    onMouseEnter: () => setActive(info),
    onMouseLeave: () => setActive((cur) => (cur === info ? null : cur)),
    onFocus: () => setActive(info),
    onBlur: () => setActive((cur) => (cur === info ? null : cur)),
    onClick: () => setActive((cur) => (cur === info ? null : info)),
  });
  const styleHERO = { ...place(HERO), ...revealVars(0, HERO.delay) }
  return (
    <div className={styles.scene}>
      <div className={styles.hero} style={styleHERO}>
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

      {STICKERS.map((sticker, index) =>
        sticker.name === "keep_moving" ? (
          <KeepMovingCluster
            key={sticker.name}
            sticker={sticker}
            index={index}
            templateSlug="dance-lens"
          />
        ) : (
          <Sticker
            key={sticker.name}
            sticker={sticker}
            index={index}
            triggerProps={triggerProps}
          />
        )
      )}
    </div>
  );
}

function Sticker({
  sticker,
  index,
  triggerProps,
}: {
  sticker: StickerEl;
  index: number;
  triggerProps: (info: InfoId) => Record<string, () => void>;
}) {
  const media = <AssetVideo folder={sticker.folder} name={sticker.name} />;
  const style = { ...place(sticker), ...revealVars(index, sticker.delay) };

  if (sticker.href) {
    const isExternal = sticker.href.startsWith("http");
    return isExternal ? (
      <a
        href={sticker.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.sticker} scene-reveal`}
        style={style}
        aria-label={sticker.label}
      >
        {media}
      </a>
    ) : (
      <Link
        href={sticker.href}
        className={`${styles.sticker} scene-reveal`}
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
        className={`${styles.sticker} scene-reveal`}
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
      className={`${styles.sticker} scene-reveal`}
      style={style}
      role="img"
      aria-label={sticker.label}
    >
      {media}
    </div>
  );
}
