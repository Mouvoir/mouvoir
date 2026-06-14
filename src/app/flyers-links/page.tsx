import {FlyerSticker} from "@/components/flyers/FlyerSticker";
import {FLYER_STICKERS} from "@/components/flyers/flyerStickers";
import styles from "./collage.module.css";

export default function FlyersLinksPage() {
  return (
    <div className={styles.collage}>
      <section className={styles.screen}>
        {FLYER_STICKERS.map((sticker) => (
          <FlyerSticker key={sticker.folder} sticker={sticker}/>
        ))}
      </section>
    </div>
  );
}
