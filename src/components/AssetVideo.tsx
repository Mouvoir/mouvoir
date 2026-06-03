"use client";

interface AssetVideoProps {
  folder: string;
  name?: string;
  className?: string;
}

export function AssetVideo({folder, name, className}: AssetVideoProps) {
  const base = name ?? folder;
  const movUrl = `/${folder}/${base}.mov`;
  const webmUrl = `/${folder}/${base}.webm`;
  const pngUrl = `/${folder}/${base}.png`;

  const classes = ["w-full h-full object-cover", className].filter(Boolean).join(" ");
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={pngUrl}
      className={classes}
    >
      <source src={movUrl} type="video/quicktime"/>
      <source src={webmUrl} type="video/webm"/>
      <img src={pngUrl} alt="" className={classes}/>
    </video>
  );
}
