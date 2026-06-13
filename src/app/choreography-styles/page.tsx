import { ChoreSticker } from "@/components/choreography/ChoreSticker";
import { CHORE_STICKERS } from "@/components/choreography/choreStickers";
import styles from "./collage.module.css";

export default function ChoreographyStylesPage() {
  return (
    <div className={styles.collage}>
      <section className={styles.screen}>
        {CHORE_STICKERS.map((sticker) => (
          <ChoreSticker key={sticker.slug} sticker={sticker} />
        ))}
      </section>
    </div>
  );
}
