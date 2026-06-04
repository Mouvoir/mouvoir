import { TemplateSticker } from "@/components/TemplateSticker";
import { TEMPLATE_STICKERS } from "@/components/templateStickers";
import styles from "./template.module.css";

const SCREENS = [1, 2] as const;

export default function TemplateListPage() {
  return (
    <div className={styles.collage}>
      {SCREENS.map((screen) => (
        <section key={screen} className={styles.screen}>
          {TEMPLATE_STICKERS.filter((s) => s.screen === screen).map((sticker) => (
            <TemplateSticker key={sticker.slug} sticker={sticker} />
          ))}
        </section>
      ))}
    </div>
  );
}
