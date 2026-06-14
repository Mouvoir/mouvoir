import { TemplateSticker } from "@/components/template/TemplateSticker";
import { TEMPLATE_STICKERS } from "@/components/template/templateStickers";
import styles from "./choreography-styles/template.module.css";

const SCREENS = [1, 2] as const;

const DANCEFLOOR_BANNER =
  "/choose_your_dancefloor_thermal/choose_your_dancefloor_thermal";

export default function HomePage() {
  return (
    <div className={styles.collage}>
      {SCREENS.map((screen) => (
        <section key={screen} className={styles.screen}>
          {screen === 1 && (
            <div
              className={styles.banner}
              style={{ left: "30%", top: "4%", width: "44%" }}
              role="img"
              aria-label="Choose your dancefloor !"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={`${DANCEFLOOR_BANNER}.png`}
                className={styles.bannerVideo}
              >
                <source src={`${DANCEFLOOR_BANNER}.mov`} type="video/quicktime" />
                <source src={`${DANCEFLOOR_BANNER}.webm`} type="video/webm" />
              </video>
            </div>
          )}
          {TEMPLATE_STICKERS.filter((s) => s.screen === screen).map((sticker, index) => (
            <TemplateSticker key={sticker.slug} sticker={sticker} index={index} />
          ))}
        </section>
      ))}
    </div>
  );
}
