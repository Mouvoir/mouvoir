"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AssetVideo } from "@/components/shared/AssetVideo";
import { ControlledVideo } from "@/components/shared/ControlledVideo";
import { revealVars } from "./sceneReveal";
import type { Placed, SceneLayout, StickerEl } from "./sceneTypes";
import styles from "./templateScene.module.css";

// Grace period before a bubble closes once its trigger is left, so the pointer
// can travel from the trigger to an interactive (links) bubble without the
// hover dropping. Re-entering the trigger or the bubble cancels the close.
const BUBBLE_CLOSE_DELAY_MS = 120;

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
  const { hero, stickers, tools = [], bubbles } = layout;
  const [active, setActive] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const open = (info: string) => {
    cancelClose();
    setActive(info);
  };
  // Defer closing so the pointer can reach an interactive bubble (see constant).
  const scheduleClose = (info: string) => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setActive((cur) => (cur === info ? null : cur));
      closeTimer.current = null;
    }, BUBBLE_CLOSE_DELAY_MS);
  };
  useEffect(() => cancelClose, []);

  // Hover reveals; click toggles (so touch devices can open a bubble too).
  const triggerProps = (info: string) => ({
    onMouseEnter: () => open(info),
    onMouseLeave: () => scheduleClose(info),
    onFocus: () => open(info),
    onBlur: () => scheduleClose(info),
    onClick: () => {
      cancelClose();
      setActive((cur) => (cur === info ? null : info));
    },
  });
  // Interactive (links) bubbles keep themselves open while hovered.
  const bubbleHoverProps = (info: string) => ({
    onMouseEnter: () => open(info),
    onMouseLeave: () => scheduleClose(info),
  });

  // DOM order is hero → bubbles → tools → stickers. The tools' `:nth-of-type`
  // wiggle offset (see CSS) counts by element type among siblings, so tools
  // must stay rendered before the sticker buttons to keep their animation phase.
  return (
    <div className={styles.scene}>
      {/* Hero result footage, lowest in the stack so neon titles read on top of
          it. Its entrance timing is driven by the layout's `step` (the result
          video reveals with "step by step"); falls back to last when untagged. */}
      <div
        className={`${styles.hero} scene-reveal`}
        style={{
          ...place(hero),
          ...revealVars(stickers.length + tools.length, hero.delay, hero.step),
        }}
      >
        <ControlledVideo srcBase={`${hero.folder}/${hero.name}`} label={hero.label} />
      </div>

      {/* Speech bubbles: every bubble whose id is active mounts (link bubbles
          share an id so one trigger reveals a whole set). Asset bubbles are
          pointer-events:none so hovering them never steals the trigger's hover;
          link bubbles opt back in (.bubbleLinks) and keep themselves open. */}
      <AnimatePresence>
        {bubbles
          .filter((b) => b.id === active)
          .map((bubble) => (
            <motion.div
              key={"slug" in bubble ? `${bubble.id}-${bubble.slug}` : bubble.id}
              className={`${styles.bubble} ${"slug" in bubble ? styles.bubbleLinks : ""}`}
              style={place(bubble)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              {...("slug" in bubble ? bubbleHoverProps(bubble.id) : {})}
            >
              {"slug" in bubble ? (
                <Link
                  href={`/choreography-styles/${bubble.slug}`}
                  className={styles.link}
                  aria-label={`${bubble.title} — voir le projet`}
                >
                  <AssetVideo folder={bubble.folder} name={bubble.name} />
                </Link>
              ) : (
                <AssetVideo folder={bubble.folder} name={bubble.name} />
              )}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Tool-kit objects (transparent PNGs) — hover targets. Their entrance is
          driven by the layout's `step` (the tool kit reveals as one group); the
          index fallback continues after the stickers when a tool is untagged. */}
      {tools.map((tool, index) => (
        <button
          key={tool.src}
          type="button"
          className={`${styles.tool} scene-reveal`}
          style={{ ...place(tool), ...revealVars(stickers.length + index, tool.delay, tool.step) }}
          aria-label={tool.alt}
          {...triggerProps(tool.info)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tool.src} alt={tool.alt} />
        </button>
      ))}

      {/* Static neon stickers (links / triggers / decorative). */}
      {stickers.map((sticker, index) => (
        <Sticker
          key={sticker.name}
          sticker={sticker}
          index={index}
          triggerProps={triggerProps}
        />
      ))}
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
  const style = { ...place(sticker), ...revealVars(index, sticker.delay, sticker.step) };

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
