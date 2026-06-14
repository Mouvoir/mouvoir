import type { FlyerSticker as Sticker } from "./flyerStickers";
import styles from "./flyerSticker.module.css";

interface FlyerStickerProps {
  sticker: Sticker;
}

// A single flyer sticker. Folder names are ASCII snake_case (see
// .claude/rules/asset-conventions.md) so paths need no URL-encoding. Video
// assets ship the alpha triple (.mov for Safari, .webm for the rest, .png
// poster); image assets are a single alpha .png.
export function FlyerSticker({ sticker }: FlyerStickerProps) {
  const { folder, kind, label, href, left, top, width } = sticker;
  const position = { left: `${left}%`, top: `${top}%`, width: `${width}%` };
  const base = `${folder}/${folder}`;

  const media =
    kind === "image" ? (
      // eslint-disable-next-line @next/next/no-img-element -- alpha sticker, no layout shift to optimize
      <img
        src={`/${base}.png`}
        alt=""
        className={`${styles.media} ${styles.wiggle}`}
      />
    ) : (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={`/${base}.png`}
        className={styles.media}
      >
        {/* HEVC-with-alpha mov first for Safari, VP9 webm for everyone else */}
        <source src={`/${base}.mov`} type="video/quicktime" />
        <source src={`/${base}.webm`} type="video/webm" />
      </video>
    );

  // Decorative titles carry no link.
  if (!href) {
    return (
      <div className={styles.sticker} style={position} role="img" aria-label={label}>
        {media}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`${styles.sticker} ${styles.link}`}
      style={position}
    >
      {media}
    </a>
  );
}
