"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
}

export function TemplateMosaicCard({
  slug,
  title,
  description,
  materials,
  downloadUrl,
  resultVideoUrl,
  index,
}: TemplateMosaicCardProps) {
  const t = useTranslations("TemplateCard");
  const tCard = useTranslations("TemplateMosaicCard");

  return (
    <motion.article
      className="template-mosaic"
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
          ariaLabel={t("previewAria", { title })}
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
              {tCard("download")}
            </a>
          ) : (
            <button type="button" className="template-mosaic__btn" disabled>
              {tCard("download")}
            </button>
          )}
          <Link
            href={`/template/${slug}#tutorial`}
            className="template-mosaic__btn"
          >
            {tCard("tutorial")}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
