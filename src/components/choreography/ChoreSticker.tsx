import Link from "next/link";
import type { ChoreSticker as Sticker } from "./choreStickers";
import styles from "./choreSticker.module.css";

interface ChoreStickerProps {
  sticker: Sticker;
}

export function ChoreSticker({ sticker }: ChoreStickerProps) {
  const { folder, slug, title, artist, left, top, width, placeholder, anim } = sticker;
  const position = { left: `${left}%`, top: `${top}%`, width: `${width}%` };
  const label = artist ? `${title} — ${artist}` : title;

  // Reserved slot with no asset yet — render a labelled placeholder box.
  if (placeholder) {
    return (
      <div
        className={styles.placeholder}
        style={position}
        role="img"
        aria-label={`${label} (coming soon)`}
      >
        <span className={styles.placeholderTitle}>{title}</span>
        <span className={styles.placeholderArtist}>{artist}</span>
      </div>
    );
  }

  // Folder names are ASCII snake_case (see .claude/rules/asset-conventions.md),
  // so no URL-encoding is needed. The `_anim` clip bakes the cutout, neon title
  // and artist name onto black; `screen` blending drops the black backing.
  // Folders without an `_anim` variant (`anim: false`) source the base triple.
  const base = anim === false ? `${folder}/${folder}` : `${folder}/${folder}_anim`;

  return (
    <Link
      href={`/choreography-styles/${slug}`}
      aria-label={label}
      className={styles.sticker}
      style={position}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={`/${base}.png`}
        className={styles.video}
      >
        {/* HEVC-with-alpha-style mov first for Safari, VP9 webm for the rest */}
        <source src={`/${base}.mov`} type="video/quicktime" />
        <source src={`/${base}.webm`} type="video/webm" />
      </video>
    </Link>
  );
}
