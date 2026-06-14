"use client";

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import type {CSSProperties} from "react";
import {AssetVideo} from "@/components/shared/AssetVideo";
import type {Scene} from "./rehearsalScenes";
import styles from "./RehearsalCollage.module.css";

interface RehearsalSceneProps {
  scene: Scene;
  onBack: () => void;
}

// Transparent overlay holding an open scene's stickers + the BACK button. Each
// sticker that owns an `info` reveals its text bubble on hover (or keyboard
// focus); only one bubble shows at a time (the comps' bubbles overlap and can't
// coexist).
export function RehearsalScene({scene, onBack}: RehearsalSceneProps) {
  const [openInfo, setOpenInfo] = useState<string | null>(null);

  return (
    <motion.div
      className={styles.overlay}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.25, ease: "easeOut"}}
    >
      {scene.stickers.map((sticker, index) => {
        const hasInfo = Boolean(sticker.info);
        const isOpen = openInfo === sticker.folder;
        return (
          <div key={sticker.folder}>
            <motion.button
              type="button"
              className={`${styles.sticker} ${hasInfo ? "" : styles.stickerStatic}`}
              style={{
                top: `${sticker.top}%`,
                left: `${sticker.left}%`,
                width: `${sticker.width}%`,
              } as CSSProperties}
              onClick={hasInfo ? () => setOpenInfo(isOpen ? null : sticker.folder) : undefined}
              disabled={!hasInfo}
              aria-label={sticker.label ?? sticker.folder}

            >
              <AssetVideo folder={sticker.folder}/>
            </motion.button>

            <AnimatePresence>
              {hasInfo && isOpen && sticker.info ? (
                <motion.div
                  className={styles.info}
                  style={{
                    top: `${sticker.info.top}%`,
                    left: `${sticker.info.left}%`,
                    width: `${sticker.info.width}%`,
                  } as CSSProperties}
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 0.9}}
                  transition={{duration: 0.25, ease: "easeOut"}}
                >
                  <AssetVideo folder={sticker.info.folder}/>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}

      <motion.button
        type="button"
        className={styles.backBtn}
        style={{
          top: `${scene.back.top}%`,
          left: `${scene.back.left}%`,
          width: `${scene.back.width}%`,
        }}
        onClick={onBack}
        aria-label="Revenir au collage"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.3, delay: 0.12}}
      >
        <AssetVideo folder="back_bleu"/>
      </motion.button>
    </motion.div>
  );
}
