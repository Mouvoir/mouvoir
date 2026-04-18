import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface TemplateCardProps {
  slug: string;
  title: string;
  description: string;
  material: string;
  thumbnail?: React.ReactNode;
}

export function TemplateCard({
  slug,
  title,
  description,
  material,
  thumbnail,
}: TemplateCardProps) {
  const t = useTranslations("TemplateCard");
  return (
    <article className="flex flex-col">
      <Link
        href={`/template/${slug}`}
        className="block w-full aspect-video rounded-[4px] overflow-hidden bg-[#111] relative"
        aria-label={t("previewAria", { title })}
      >
        {thumbnail}
      </Link>

      <h2 className="text-[22px] font-bold mt-[18px] mb-[6px]">{title}</h2>
      <p className="text-[15px] text-[#1a1a1a] max-w-[48ch] mb-[14px]">
        {description}
      </p>
      <p className="font-mono text-[13px] tracking-[0.03em] mb-3">
        {t("materialLabel")} {material}
      </p>

      <div className="flex gap-3 flex-wrap mt-3">
        <Link href={`/template/${slug}/tutorial`} className="btn-outline">
          {t("tutorialButton")}
        </Link>
        <Link href={`/template/${slug}/schema`} className="btn-outline">
          {t("schemaButton")}
        </Link>
        <button className="btn-outline" type="button">
          {t("downloadButton")}
        </button>
      </div>
    </article>
  );
}
