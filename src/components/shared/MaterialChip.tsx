import styles from "./mosaicCard.module.css";

type MaterialChipProps = {
  label: string;
  imageUrl?: string;
  imageSize?: number;
};

export function MaterialChipImage({
  imageUrl,
  size = 24,
}: {
  imageUrl?: string;
  size?: number;
}) {
  if (!imageUrl) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt=""
      className={styles.tagImg}
      style={{ width: size, height: size }}
    />
  );
}

export function MaterialChip({ label, imageUrl, imageSize = 24 }: MaterialChipProps) {
  return (
    <span className={styles.tag}>
      <MaterialChipImage imageUrl={imageUrl} size={imageSize} />
      {label}
    </span>
  );
}
