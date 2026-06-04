"use client";

import {motion} from "framer-motion";
import type {CSSProperties} from "react";
import {AssetVideo} from "@/components/shared/AssetVideo";
import type {CharterRule} from "./charterRules";
import styles from "./CharterConsent.module.css";

interface CharterDetailProps {
  rule: CharterRule;
  onBack: () => void;
}

// Transparent overlay holding the open rule's secondary stickers + the BACK
// button. It sits on top of the grid so the rule's main sticker (left in place
// in its grid cell) shows through untouched.
export function CharterDetail({rule, onBack}: CharterDetailProps) {
  return (
    <motion.div
      className={styles.overlay}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.25, ease: "easeOut"}}
    >
      {rule.detail.map((stickerLayer, index) => (
        <motion.div
          key={stickerLayer.name}
          className={styles.layer}
          style={{
            top: `${stickerLayer.top}%`,
            left: `${stickerLayer.left}%`,
            width: `${stickerLayer.width}%`,
          } as CSSProperties}
          initial={{opacity: 0, scale: 0.8, rotate: stickerLayer.rotation}}
          animate={{opacity: 1, scale: 1, rotate: stickerLayer.rotation}}
          transition={{duration: 0.35, delay: index * 0.08, ease: "easeOut"}}
        >
          <AssetVideo folder={stickerLayer.folder} name={stickerLayer.name}/>
        </motion.div>
      ))}

      <motion.button
        type="button"
        className={styles.backBtn}
        style={{
          top: `${rule.back.top}%`,
          left: `${rule.back.left}%`,
          width: `${rule.back.width}%`,
        }}
        onClick={onBack}
        aria-label="Revenir à la charte"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.3, delay: 0.12}}
      >
        <AssetVideo folder="back" name="back"/>
      </motion.button>
    </motion.div>
  );
}
