"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { AssetVideo } from "@/components/shared/AssetVideo";
import { KeepMovingCluster } from "./KeepMovingCluster";
import { revealVars } from "./sceneReveal";
import type { Placed, SceneLayout, StickerEl } from "./sceneTypes";
import styles from "./templateScene.module.css";

// Inline style for an absolutely-placed scene layer.
function place({ top, left, width, rotation }: Placed): CSSProperties {
  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${width}%`,
    ...(rotation ? { transform: `rotate(${rotation}deg)` } : {}),
  };
}

// Shared tutorial view for a /template/* scene: a black stage of free-floating
// neon stickers over an opaque hero clip. Hovering a tool-kit object (or a
// sticker flagged with `info`) reveals its speech bubble. All scene data comes
// from the `layout` (see the matching `*Layout.ts` and sceneTypes.ts).
export function TemplateScene({ layout }: { layout: SceneLayout }) {
  const { hero, stickers, tools = [], bubbles, slug } = layout;
  const [active, setActive] = useState<string | null>(null);

  // Hover reveals; click toggles (so touch devices can open a bubble too).
  const triggerProps = (info: string) => ({
    onMouseEnter: () => setActive(info),
    onMouseLeave: () => setActive((cur) => (cur === info ? null : cur)),
    onFocus: () => setActive(info),
    onBlur: () => setActive((cur) => (cur === info ? null : cur)),
    onClick: () => setActive((cur) => (cur === info ? null : info)),
  });

  // DOM order is hero → bubbles → tools → stickers. The tools' `:nth-of-type`
  // wiggle offset (see CSS) counts by element type among siblings, so tools
  // must stay rendered before the sticker buttons to keep their animation phase.
  return (
    <div className={styles.scene}>
      {/* Hero result footage, lowest so neon titles read on top of it. */}
      <div className={styles.hero} style={place(hero)}>
        <AssetVideo folder={hero.folder} name={hero.name} />
      </div>

      {/* Speech bubbles: only the active one is mounted. pointer-events:none so
          hovering the bubble itself never steals the trigger's hover. */}
      <AnimatePresence>
        {bubbles
          .filter((b) => b.id === active)
          .map((bubble) => (
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
      {tools.map((tool) => (
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
      {stickers.map((sticker, index) =>
        sticker.name === "keep_moving" ? (
          <KeepMovingCluster
            key={sticker.name}
            sticker={sticker}
            index={index}
            templateSlug={slug}
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
  triggerProps: (info: string) => Record<string, () => void>;
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
