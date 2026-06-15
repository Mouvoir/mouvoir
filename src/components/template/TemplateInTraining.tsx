import Link from "next/link";
import styles from "./templateInTraining.module.css";

// Shared placeholder view for templates that don't have a finished detail page
// yet. Recreates doc/TEMPLATE_RIEN.pdf: the `still_in_training_thermal` neon
// title, two thermal dancer silhouettes on the sides, and the template's own
// `_anim` sticker in the centre. Only the centre clip changes between slugs.

const TITLE = "still_in_training_thermal";
const DANCER_LEFT = "dancer_thermal_left";
const DANCER_RIGHT = "dancer_thermal_right";
const BACK = "back_orange";

interface LayerProps {
  /** Base path relative to public/, without extension. Appends .mov/.webm/.png. */
  base: string;
  /** Position className from the module. */
  position: string;
  /** Compositing: `screen` for clips baked on black, `alpha` for true cutouts. */
  blend: "screen" | "alpha";
  /** a11y label (clips are decorative; text is baked into the video). */
  label: string;
  /** Whether a `<base>.png` first-frame still exists to use as poster. The
   *  `_anim` sticker folders don't ship one, so the centre layer opts out. */
  poster?: boolean;
}

function Layer({ base, position, blend, label, poster = true }: LayerProps) {
  const videoClass = blend === "screen" ? styles.screenVideo : styles.alphaVideo;
  return (
    <div
      className={`${styles.layer} ${position}`}
      role="img"
      aria-label={label}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster ? `/${base}.png` : undefined}
        className={videoClass}
      >
        {/* HEVC-with-alpha mov first for Safari, VP9 webm for the rest. */}
        <source src={`/${base}.mov`} type="video/quicktime" />
        <source src={`/${base}.webm`} type="video/webm" />
      </video>
    </div>
  );
}

interface TemplateInTrainingProps {
  /** public/ folder holding `<folder>/<folder>_anim.{mov,webm}`. */
  folder: string;
  /** Spoken label for the centre sticker (title is baked into the video). */
  title: string;
}

export function TemplateInTraining({ folder, title }: TemplateInTrainingProps) {
  return (
    <div className={styles.collage}>
      <section className={styles.screen}>
        {/* Back to the template landing — the orange variant, matching the
            scene layouts that ship a finished detail page. */}
        <Link
          href="/"
          className={`${styles.layer} ${styles.back}`}
          aria-label="Retour aux templates"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={`/${BACK}/${BACK}.png`}
            className={styles.screenVideo}
          >
            {/* HEVC-with-alpha mov first for Safari, VP9 webm for the rest. */}
            <source src={`/${BACK}/${BACK}.mov`} type="video/quicktime" />
            <source src={`/${BACK}/${BACK}.webm`} type="video/webm" />
          </video>
        </Link>
        <Layer
          base={`${TITLE}/${TITLE}`}
          position={styles.title}
          blend="screen"
          label="Still in training"
        />
        <Layer
          base={`${DANCER_LEFT}/${DANCER_LEFT}`}
          position={styles.dancerLeft}
          blend="alpha"
          label=""
        />
        <Layer
          base={`${folder}/${folder}_anim`}
          position={styles.center}
          blend="screen"
          label={title}
          poster={false}
        />
        <Layer
          base={`${DANCER_RIGHT}/${DANCER_RIGHT}`}
          position={styles.dancerRight}
          blend="alpha"
          label=""
        />
      </section>
    </div>
  );
}
