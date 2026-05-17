"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HoverVideoThumbnail } from "@/components/HoverVideoThumbnail";
import { MaterialChip } from "@/components/MaterialChip";

interface MosaicMaterial {
  id: string;
  label: string;
  imageUrl?: string;
}

interface TemplateMosaicCardProps {
  slug: string;
  title: string;
  description?: string;
  materials: MosaicMaterial[];
  downloadUrl?: string;
  resultVideoUrl?: string;
  index: number;
  size?: "default" | "lg";
}

export function TemplateMosaicCard({
  slug,
  title,
  description,
  materials,
  downloadUrl,
  resultVideoUrl,
  index,
  size = "default",
}: TemplateMosaicCardProps) {
  return (
    <motion.article
      className={`template-mosaic${size === "lg" ? " template-mosaic--lg" : ` template-mosaic--c${(index % 4) + 1}`}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="template-mosaic__title">{title}</h2>

      {materials.length > 0 ? (
        <div className="template-mosaic__tags">
          {materials.map((m) => (
            <MaterialChip key={m.id} label={m.label} imageUrl={m.imageUrl} />
          ))}
        </div>
      ) : null}

      {description ? (
        <p className="template-mosaic__desc">{description}</p>
      ) : null}

      <div className="template-mosaic__media">
        <HoverVideoThumbnail
          videoUrl={resultVideoUrl}
          href={`/template/${slug}`}
          ariaLabel={`Aperçu de ${title}`}
        />
      </div>

      <div className="template-mosaic__footer">
        <div className="template-mosaic__actions">
          {downloadUrl ? (
            <a
              href={downloadUrl}
              className="template-mosaic__btn"
              target="_blank"
              rel="noreferrer"
            >
              Télécharger
            </a>
          ) : (
            <button type="button" className="template-mosaic__btn" disabled>
              Télécharger
            </button>
          )}
          <Link
            href={`/template/${slug}#tutorial`}
            className="template-mosaic__btn"
          >
            Tutoriel
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
