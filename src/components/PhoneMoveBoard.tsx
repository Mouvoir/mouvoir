"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  CENTRAL,
  DECOR,
  TRIGGERS,
  type PhoneMoveItem,
} from "./phoneMoveLayout";
import styles from "./phoneMoveBoard.module.css";

function posStyle(item: PhoneMoveItem): CSSProperties {
  return {
    left: `${item.left}%`,
    top: `${item.top}%`,
    width: `${item.width}%`,
    zIndex: item.z,
  };
}

// One positioned video sticker. Folder names are ASCII snake_case
// (see .claude/rules/asset-conventions.md), so no URL-encoding is needed.
function StickerMedia({ folder, name }: Pick<PhoneMoveItem, "folder" | "name">) {
  const base = `/${folder}/${name}`;
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={`${base}.png`}
      className={styles.media}
    >
      {/* HEVC-with-alpha mov first for Safari, VP9 webm for the rest */}
      <source src={`${base}.mov`} type="video/quicktime" />
      <source src={`${base}.webm`} type="video/webm" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}.png`} alt="" className={styles.media} />
    </video>
  );
}

export function PhoneMoveBoard() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={styles.board}>
      {/* Back to the template collage */}
      <Link
        href="/template"
        aria-label="Retour aux templates"
        className={`${styles.sticker} ${styles.back}`}
        style={posStyle({
          key: "back",
          folder: "back",
          name: "back",
          label: "Retour",
          left: 0,
          top: 3,
          width: 5,
          z: 6,
        })}
      >
        <StickerMedia folder="back" name="back" />
      </Link>

      {/* Central tutorial scene (opaque, baked border + caption) */}
      <div
        className={styles.sticker}
        style={posStyle(CENTRAL)}
        aria-label={CENTRAL.label}
        role="img"
      >
        <StickerMedia folder={CENTRAL.folder} name={CENTRAL.name} />
      </div>

      {/* Decorative stickers */}
      {DECOR.map((item) => (
        <div
          key={item.key}
          className={styles.sticker}
          style={posStyle(item)}
          aria-label={item.label}
          role="img"
        >
          <StickerMedia folder={item.folder} name={item.name} />
        </div>
      ))}

      {/* Interactive triggers + their info bubbles */}
      {TRIGGERS.map((trigger) => {
        const isActive = active === trigger.key;
        const bubbleId = `phone-move-${trigger.bubble.key}`;
        return (
          <div key={trigger.key}>
            <button
              type="button"
              className={`${styles.sticker} ${styles.trigger}`}
              style={posStyle(trigger)}
              aria-label={trigger.label}
              aria-expanded={isActive}
              aria-controls={bubbleId}
              onMouseEnter={() => setActive(trigger.key)}
              onMouseLeave={() =>
                setActive((prev) => (prev === trigger.key ? null : prev))
              }
              onFocus={() => setActive(trigger.key)}
              onBlur={() =>
                setActive((prev) => (prev === trigger.key ? null : prev))
              }
              onClick={() =>
                setActive((prev) => (prev === trigger.key ? null : trigger.key))
              }
            >
              <StickerMedia folder={trigger.folder} name={trigger.name} />
            </button>

            <div
              id={bubbleId}
              className={`${styles.sticker} ${styles.bubble} ${
                isActive ? styles.visible : ""
              }`}
              style={posStyle(trigger.bubble)}
              aria-hidden={!isActive}
              role="img"
              aria-label={trigger.bubble.label}
            >
              <StickerMedia
                folder={trigger.bubble.folder}
                name={trigger.bubble.name}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
