"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { STICKER_STAGGER, type TemplateSticker as Sticker } from "./templateStickers";
import styles from "./templateSticker.module.css";

interface TemplateStickerProps {
  sticker: Sticker;
  /** Render order within its screen, used for the automatic entrance stagger
   *  when the sticker has no explicit `delay`. */
  index?: number;
}

export function TemplateSticker({ sticker, index = 0 }: TemplateStickerProps) {
  const { folder, slug, title, left, top, width, presPath, delay } = sticker;
  // Entrance reveal delay: an explicit per-sticker `delay` wins, otherwise the
  // sticker fades in staggered by its render order.
  const revealDelay = delay ?? index * STICKER_STAGGER;
  // Folder names are ASCII snake_case (see .claude/rules/asset-conventions.md),
  // so no URL-encoding is needed for the public path. Most templates ship a
  // dedicated `<folder>_anim` sticker clip; consolidated ones (noAnim) reuse
  // their single `<folder>` clip instead.
  const base =  `${folder}/${folder}_anim`;
  // The hover reveal swaps in a `_pres` clip — a self-contained info-card
  // sticker (shape + title + tagline + description baked in, same alpha/screen
  // composition as `_anim`). Most templates ship it as `<folder>/<folder>_pres`;
  // a few nest it in its own sub-folder instead, hence the override.
  const presBase = presPath ?? `${folder}/${folder}_pres`;

  const presRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleEnter = () => {
    setIsHovered(true);
    presRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    setIsHovered(false);
    const v = presRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <Link
      href={`/template/${slug}`}
      aria-label={title}
      className={styles.sticker}
      style={
        {
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}%`,
          "--reveal-delay": `${revealDelay}s`,
        } as CSSProperties
      }
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className={styles.stage}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`${styles.video} ${styles.base} ${isHovered ? styles.baseHidden : ""}`}
        >
          {/* HEVC-with-alpha-style mov first for Safari, VP9 webm for the rest */}
          <source src={`/${base}.mov`} type="video/quicktime" />
          <source src={`/${base}.webm`} type="video/webm" />
        </video>
        <video
          ref={presRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className={`${styles.video} ${styles.presentation} ${isHovered ? styles.presentationVisible : ""}`}
        >
          <source src={`/${presBase}.mov`} type="video/quicktime" />
          <source src={`/${presBase}.webm`} type="video/webm" />
        </video>
      </div>
    </Link>
  );
}
