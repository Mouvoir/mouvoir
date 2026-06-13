import Link from "next/link";
import styles from "./choreLayer.module.css";
import type { ChoreLayerData } from "./choreProjects";

interface ChoreLayerProps {
  layer: ChoreLayerData;
}

export function ChoreLayer({ layer }: ChoreLayerProps) {
  const positionStyle: React.CSSProperties = {
    left: `${layer.left}%`,
    top: `${layer.top}%`,
    width: `${layer.width}%`,
  };

  const media =
    layer.kind === "video" ? (
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
        >
          {media}
        </Link>
      ) : (
        media
      )}
    </div>
  );
}
