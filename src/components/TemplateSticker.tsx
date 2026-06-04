"use client";

import Link from "next/link";
import type { TemplateSticker as Sticker } from "./templateStickers";
import styles from "./templateSticker.module.css";

interface TemplateStickerProps {
  sticker: Sticker;
}

export function TemplateSticker({ sticker }: TemplateStickerProps) {
  const { folder, slug, title, left, top, width, noAnim } = sticker;
  // Folder names are ASCII snake_case (see .claude/rules/asset-conventions.md),
  // so no URL-encoding is needed for the public path. Most templates ship a
  // dedicated `<folder>_anim` sticker clip; consolidated ones (noAnim) reuse
  // their single `<folder>` clip instead.
  const base = noAnim ? `${folder}/${folder}` : `${folder}/${folder}_anim`;

  return (
    <Link
      href={`/template/${slug}`}
      aria-label={title}
      className={styles.sticker}
      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%` }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={styles.video}
      >
        {/* HEVC-with-alpha-style mov first for Safari, VP9 webm for the rest */}
        <source src={`/${base}.mov`} type="video/quicktime" />
        <source src={`/${base}.webm`} type="video/webm" />
      </video>
    </Link>
  );
}
