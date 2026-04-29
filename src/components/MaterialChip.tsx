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
      className="template-mosaic__tag-img"
      style={{ width: size, height: size }}
    />
  );
}

export function MaterialChip({ label, imageUrl, imageSize = 24 }: MaterialChipProps) {
  return (
    <span className="template-mosaic__tag">
      <MaterialChipImage imageUrl={imageUrl} size={imageSize} />
      {label}
    </span>
  );
}
