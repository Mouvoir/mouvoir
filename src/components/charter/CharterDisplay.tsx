"use client";

import {useEffect, useState} from "react";
import {CharterGrid} from "./CharterGrid";
import styles from "./CharterConsent.module.css";

// Read-only charter shown inline on a page (the about page). Same grid and
// rule-detail interaction as the consent modal, but without the "accept the
// charter" sticker and without locking page scroll.
export function CharterDisplay() {
  // When set, the grid collapses and that rule's detailed sticker layout shows.
  const [expanded, setExpanded] = useState<string | null>(null);

  // Escape closes the expanded rule back to the grid.
  useEffect(() => {
    if (expanded === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  return (
    <div className={styles.embed}>
      <CharterGrid
        expanded={expanded}
        onSelect={setExpanded}
        onBack={() => setExpanded(null)}
      />
    </div>
  );
}
