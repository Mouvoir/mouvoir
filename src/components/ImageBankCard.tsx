"use client";

import { useRef, useState } from "react";
import type { ImageBankEntry } from "@/lib/imageBank";

type Props = {
  entry: ImageBankEntry;
  downloadLabel: string;
};

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

const CARD_BACKGROUND = "linear-gradient(135deg, #f6b0c8 0%, #a9e9db 100%)";

export function ImageBankCard({ entry, downloadLabel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleEnter = () => {
    setIsHovered(true);
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setIsHovered(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <article className="flex flex-col">
      <div
        className="w-full aspect-video rounded-[4px] overflow-hidden bg-[#111] relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {entry.videoUrl ? (
          <video
            ref={videoRef}
            src={`${entry.videoUrl}#t=0.1`}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: CARD_BACKGROUND }}
          />
        )}
        {!isHovered ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {PLAY_ICON}
          </div>
        ) : null}
      </div>
      <h2 className="text-[22px] font-bold mt-[18px] mb-[6px]">
        {entry.videoName}
      </h2>
      {entry.credit || entry.creator ? (
        <p className="text-[15px] max-w-[48ch] mb-[14px]">
          {entry.credit || entry.creator}
        </p>
      ) : null}
      <div className="flex gap-3 flex-wrap mt-3">
        {entry.videoUrl ? (
          <a
            href={`${entry.videoUrl}?dl=`}
            className="btn-outline"
            rel="noopener"
          >
            {downloadLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}
