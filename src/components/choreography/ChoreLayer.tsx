import Link from "next/link";
import { ControlledVideo } from "@/components/shared/ControlledVideo";
import styles from "./choreLayer.module.css";
import type { ChoreLayerData } from "./choreProjects";

// Blue scrubber accent for the choreography result clips, matching the section's
// blue theme (back_bleu, still_in_training_bleu, …).
const CHORE_ACCENT = "var(--color-cyan-blue)";

interface ChoreLayerProps {
  layer: ChoreLayerData;
}

export function ChoreLayer({ layer }: ChoreLayerProps) {
  const positionStyle: React.CSSProperties = {
    left: `${layer.left}%`,
    top: `${layer.top}%`,
    width: `${layer.width}%`,
    ...(layer.rotate ? { transform: `rotate(${layer.rotate}deg)` } : {}),
  };

  const isExternal = layer.href?.startsWith("http");

  const media =
    layer.kind === "video" && layer.controls ? (
      <ControlledVideo
        srcBase={layer.asset}
        label={layer.label}
        accent={CHORE_ACCENT}
      />
    ) : layer.kind === "video" ? (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={`/${layer.asset}.png`}
        className={styles.layerMedia}
      >
        <source src={`/${layer.asset}.mov`} type="video/quicktime" />
        <source src={`/${layer.asset}.webm`} type="video/webm" />
      </video>
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/${layer.asset}`}
        alt=""
        aria-hidden="true"
        className={styles.layerMedia}
      />
    );

  return (
    <div className={styles.layer} style={positionStyle}>
      {layer.href ? (
        <Link
          href={layer.href}
          aria-label={layer.label}
          className={styles.layerLink}
          {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {media}
        </Link>
      ) : (
        media
      )}
    </div>
  );
}
