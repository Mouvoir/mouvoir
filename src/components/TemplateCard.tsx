import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { urlForImage } from "@/sanity/imageUrl";
import { HoverVideoThumbnail } from "@/components/HoverVideoThumbnail";

interface TemplateCardProps {
  slug: string;
  title: string;
  description?: string;
  materials: string[];
  thumbnail?: SanityImageSource;
  downloadUrl?: string;
  resultVideoUrl?: string;
}

export function TemplateCard({
  slug,
  title,
  description,
  materials,
  thumbnail,
  downloadUrl,
  resultVideoUrl,
}: TemplateCardProps) {
  const t = useTranslations("TemplateCard");
  const thumbnailUrl = thumbnail
    ? urlForImage(thumbnail).width(800).height(450).fit("crop").url()
    : null;

  return (
    <article className="flex flex-col">
      <HoverVideoThumbnail
        videoUrl={resultVideoUrl}
        posterUrl={thumbnailUrl ?? undefined}
        href={`/template/${slug}`}
        ariaLabel={t("previewAria", { title })}
      />

      <h2 className="text-[22px] font-bold mt-[18px] mb-[6px]">{title}</h2>
      {description ? (
        <p className="text-[15px] text-[#1a1a1a] max-w-[48ch] mb-[14px]">
          {description}
        </p>
      ) : null}
      {materials.length > 0 ? (
        <p className="font-mono text-[13px] tracking-[0.03em] mb-3">
          {t("materialLabel")} {materials.join(", ")}
        </p>
      ) : null}

      <div className="flex gap-3 flex-wrap mt-3">
        <Link href={`/template/${slug}#tutorial`} className="btn-outline">
          {t("tutorialButton")}
        </Link>
        <Link href={`/template/${slug}#schema`} className="btn-outline">
          {t("schemaButton")}
        </Link>
        {downloadUrl ? (
          <a
            href={downloadUrl}
            className="btn-outline"
            target="_blank"
            rel="noreferrer"
          >
            {t("downloadButton")}
          </a>
        ) : (
          <button className="btn-outline" type="button" disabled>
            {t("downloadButton")}
          </button>
        )}
      </div>
    </article>
  );
}
