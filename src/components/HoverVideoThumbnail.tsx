"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const PLAY_ICON = (
  <svg
    viewBox="0 0 80 80"
    fill="#000"
    aria-hidden="true"
    className="w-[80px] h-[80px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
  >
    <polygon points="22,14 66,40 22,66" />
  </svg>
);

const DEFAULT_BACKGROUND = "linear-gradient(135deg, #f6b0c8 0%, #a9e9db 100%)";

interface HoverVideoThumbnailProps {
  videoUrl?: string;
  posterUrl?: string;
  fallbackBackground?: string;
  href?: string;
  ariaLabel?: string;
}

export function HoverVideoThumbnail({
  videoUrl,
  posterUrl,
  fallbackBackground = DEFAULT_BACKGROUND,
  href,
  ariaLabel,
}: HoverVideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleEnter = () => {
    setIsHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    setIsHovered(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const inner = (
    <>
      {videoUrl ? (
        <video
          ref={videoRef}
          src={`${videoUrl}#t=0.1`}
          poster={posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      ) : posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={posterUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={{ background: fallbackBackground }} />
      )}
      {videoUrl && !isHovered ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {PLAY_ICON}
        </div>
      ) : null}
    </>
  );

  const containerClass =
    "w-full aspect-video rounded-[4px] overflow-hidden bg-[#111] relative";

  if (href) {
    return (
      <Link
        href={href}
        className={`block ${containerClass}`}
        aria-label={ariaLabel}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={containerClass}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {inner}
    </div>
  );
}
