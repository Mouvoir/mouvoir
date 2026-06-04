"use client";

import {AnimatePresence, motion} from "framer-motion";
import type {CSSProperties} from "react";
import {AssetVideo} from "./AssetVideo";
import {CharterDetail} from "./CharterDetail";
import {RULES} from "./charterRules";
import styles from "./CharterConsent.module.css";

interface CharterGridProps {
  expanded: string | null;
  onSelect: (id: string) => void;
  // Optional: when omitted, the "accept the charter" sticker is hidden (e.g. the
  // read-only charter shown on the about page).
  onAccept?: () => void;
  onBack: () => void;
}

// A rule sticker in the grid. The selected rule stays exactly in place (never
// moves); the other rules fade away while a rule is open.
function RuleCell({
  id,
  expanded,
  onSelect,
}: {
  id: string;
  expanded: string | null;
  onSelect: (id: string) => void;
}) {
  const rule = RULES[id];
  const isOther = expanded !== null && expanded !== id;
  return (
    <motion.button
      type="button"
      className={`${styles.cell} ${styles.wide} ${styles.ruleButton}`}
      style={{"--rot": `${rule.grid.rot}deg`, "--scale": `${rule.grid.scale}`} as CSSProperties}
      onClick={() => onSelect(id)}
      disabled={expanded !== null}
      aria-label={`Voir la règle : ${rule.label}`}
      animate={{opacity: isOther ? 0 : 1}}
      transition={{duration: 0.3, ease: "easeOut"}}
    >
      <AssetVideo folder={`${id}/${id}`} name={id}/>
    </motion.button>
  );
}

export function CharterGrid({expanded, onSelect, onAccept, onBack}: CharterGridProps) {
  const isExpanded = expanded !== null;
  return (
    <div className={styles.gridWrap}>
      {/* Row 1: rule 1, the mouvoir/accept stack, rule 5 */}
      <div className={styles.gridRow}>
        <RuleCell id="regle_01" expanded={expanded} onSelect={onSelect}/>
        <motion.div
          className={styles.stack}
          style={{pointerEvents: isExpanded ? "none" : "auto"}}
          animate={{opacity: isExpanded ? 0 : 1}}
          transition={{duration: 0.3, ease: "easeOut"}}
        >
          <div className={`${styles.cell} ${styles.mouvoirCell}`}>
            <AssetVideo folder="mouvoir_bleu_orange" name="mouvoir_bleu_orange"/>
          </div>
          {onAccept ? (
            <button
              type="button"
              className={`${styles.cell} ${styles.accept} ${styles.acceptCell}`}
              onClick={onAccept}
              disabled={isExpanded}
              aria-label="Accepter la charte"
            >
              <AssetVideo folder="accept" name="accept"/>
            </button>
          ) : null}
        </motion.div>
        <RuleCell id="regle_05" expanded={expanded} onSelect={onSelect}/>
      </div>

      {/* Row 2: rules 2, 3 & 4 */}
      <div className={styles.gridRow}>
        <RuleCell id="regle_02" expanded={expanded} onSelect={onSelect}/>
        <RuleCell id="regle_03" expanded={expanded} onSelect={onSelect}/>
        <RuleCell id="regle_04" expanded={expanded} onSelect={onSelect}/>
      </div>

      {/* Secondary stickers of the open rule, overlaid without moving the main one. */}
      <AnimatePresence>
        {isExpanded ? (
          <CharterDetail key={expanded} rule={RULES[expanded]} onBack={onBack}/>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
