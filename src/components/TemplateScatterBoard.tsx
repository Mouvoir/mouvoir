"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

interface ScatterItem {
  slug: string;
  title: string;
  resultVideoUrl?: string;
  schemaUrl?: string;
}

interface TemplateScatterBoardProps {
  items: ScatterItem[];
}

const SCATTER_LAYOUT = [
  { left: "3%", top: "4%", rotate: -7, width: 320, ratio: "16/10" },
  { left: "26%", top: "16%", rotate: 4, width: 260, ratio: "4/5" },
  { left: "47%", top: "2%", rotate: -3, width: 360, ratio: "16/9" },
  { left: "74%", top: "10%", rotate: 9, width: 240, ratio: "4/5" },
  { left: "10%", top: "55%", rotate: 6, width: 280, ratio: "1/1" },
  { left: "36%", top: "62%", rotate: -10, width: 320, ratio: "16/10" },
  { left: "62%", top: "55%", rotate: 5, width: 260, ratio: "4/3" },
  { left: "82%", top: "60%", rotate: -6, width: 220, ratio: "4/5" },
] as const;

const POLAROID_PALETTE = [
  "linear-gradient(135deg, #ffd4e8 0%, #ff8ad1 100%)",
  "linear-gradient(135deg, #c4f0e1 0%, #6cd9b8 100%)",
  "linear-gradient(135deg, #d6e2ff 0%, #88a8ff 100%)",
  "linear-gradient(135deg, #ffe6c7 0%, #ffb079 100%)",
  "linear-gradient(135deg, #e9d4ff 0%, #c975e8 100%)",
  "linear-gradient(135deg, #ffd1d1 0%, #e1212a 100%)",
];

export function TemplateScatterBoard({ items }: TemplateScatterBoardProps) {
  const slots = SCATTER_LAYOUT.map((slot, i) => ({
    ...slot,
    item: items[i % Math.max(items.length, 1)],
    fallback: POLAROID_PALETTE[i % POLAROID_PALETTE.length],
  })).filter((slot) => slot.item);

  if (slots.length === 0) {
    return <div className="template-scatter template-scatter--empty" aria-hidden="true" />;
  }

  return (
    <div className="template-scatter" aria-hidden="false">
      {slots.map((slot, i) => (
        <motion.div
          key={`${slot.item.slug}-${i}`}
          className="template-scatter__item"
          style={{
            left: slot.left,
            top: slot.top,
            width: slot.width,
            ["--rot" as string]: `${slot.rotate}deg`,
          }}
          initial={{ opacity: 0, scale: 0.85, rotate: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: slot.rotate, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.06 * i,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            rotate: 0,
            scale: 1.04,
            zIndex: 20,
            transition: { duration: 0.25 },
          }}
        >
          <Link
            href={`/template/${slot.item.slug}`}
            className="template-scatter__link"
            aria-label={slot.item.title}
          >
            <div
              className="template-scatter__media"
              style={{ aspectRatio: slot.ratio, background: slot.fallback }}
            >
              {slot.item.resultVideoUrl ? (
                <video
                  src={`${slot.item.resultVideoUrl}#t=0.1`}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="template-scatter__video"
                />
              ) : slot.item.schemaUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slot.item.schemaUrl}
                  alt=""
                  className="template-scatter__video"
                />
              ) : null}
            </div>
            <span className="template-scatter__caption">{slot.item.title}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
