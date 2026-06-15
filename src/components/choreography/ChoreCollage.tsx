"use client";

import { useState } from "react";
import { ChoreSticker } from "./ChoreSticker";
import { ChoreFilterDropdown } from "./ChoreFilterDropdown";
import { filterChoreStickers } from "./choreFilters";
import styles from "@/app/choreography-styles/collage.module.css";

export function ChoreCollage() {
  // null = no filter → the whole choreography catalogue is shown.
  const [filter, setFilter] = useState<string | null>(null);
  const stickers = filterChoreStickers(filter);

  return (
    <div className={styles.collage}>
      <section className={styles.screen}>
        <ChoreFilterDropdown selected={filter} onSelect={setFilter} />
        {stickers.map((sticker) => (
          <ChoreSticker key={sticker.slug} sticker={sticker} />
        ))}
      </section>
    </div>
  );
}
