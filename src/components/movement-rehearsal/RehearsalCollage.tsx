"use client";

import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import type {CSSProperties} from "react";
import {AssetVideo} from "@/components/shared/AssetVideo";
import {SCENES} from "./rehearsalScenes";
import {RehearsalScene} from "./RehearsalScene";
import styles from "./RehearsalCollage.module.css";

// Landing collage of scene-entry stickers. Clicking one fades the others away
// and overlays that scene's full composition (mirrors the charter grid → detail
// interaction on mouvoir-anatomy). Escape closes the open scene.
export function RehearsalCollage() {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (openId === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  const open = openId ? SCENES.find((scene) => scene.id === openId) ?? null : null;

  return (
    <div className={styles.stage}>
      {SCENES.map((scene) => (
        <motion.button
          key={scene.id}
          type="button"
          className={styles.entry}
          style={{
            top: `${scene.entry.top}%`,
            left: `${scene.entry.left}%`,
            width: `${scene.entry.width}%`,
          } as CSSProperties}
          onClick={() => setOpenId(scene.id)}
          disabled={openId !== null}
          aria-label={`Ouvrir : ${scene.label}`}
          animate={{opacity: openId !== null ? 0 : 1}}
        >
          <AssetVideo folder={scene.entry.folder}/>
        </motion.button>
      ))}

      <AnimatePresence>
        {open ? (
          <RehearsalScene key={open.id} scene={open} onBack={() => setOpenId(null)}/>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
