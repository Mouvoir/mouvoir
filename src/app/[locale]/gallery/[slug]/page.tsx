import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { getAllGallerySlugs, getGalleryEntryBySlug } from "@/lib/gallery";
import { routing } from "@/i18n/routing";
import { cropImageUrl } from "@/sanity/imageUrl";

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const entry = await getGalleryEntryBySlug(slug);

  if (!entry) notFound();

  const t = await getTranslations("GalleryDetail");

  const thumbUrl = entry.thumbnail ? cropImageUrl(entry.thumbnail, 1200, 675) : null;

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <h1 className="h-page">{entry.vjName}</h1>
        {entry.date ? (
          <p className="font-mono text-[14px] m-0 mb-8">{entry.date}</p>
        ) : null}

        <div
          className="grid gap-14 items-start mt-6"
          style={{ gridTemplateColumns: "1.5fr 1fr" }}
        >
          <div className="w-full rounded-[6px] overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: "16 / 9" }}>
            {entry.mediaFileUrl ? (
              <video
                src={entry.mediaFileUrl}
                poster={thumbUrl ?? undefined}
                controls
                className="w-full h-full"
              />
            ) : thumbUrl ? (
              <img src={thumbUrl} alt={entry.vjName} className="w-full h-full object-cover" />
            ) : null}
          </div>

          <aside>
            {(entry.templateTitle || entry.eventType) ? (
              <h2 className="text-[22px] font-bold m-0 mb-2">
                {entry.templateTitle}
                {entry.templateTitle && entry.eventType ? " - " : ""}
                {entry.eventType ? (
                  <em className="italic font-normal">
                    {t("eventPrefix")} {entry.eventType}
                  </em>
                ) : null}
              </h2>
            ) : null}
            {entry.quote ? (
              <p className="text-[15px] leading-[1.5] m-0 mb-8">
                «{entry.quote}»
              </p>
            ) : null}
            {entry.templateTitle ? (
              <p className="font-mono text-[14px] m-0 mb-[14px]">
                {t("templateUsedLabel")} {entry.templateTitle}
              </p>
            ) : null}
            <div className="flex gap-3 flex-wrap">
              {entry.videoUrl ? (
                <a href={entry.videoUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  {t("watchButton")}
                </a>
              ) : null}
              {entry.templateDownloadUrl ? (
                <a href={entry.templateDownloadUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  {t("downloadButton")}
                </a>
              ) : (
                <button type="button" className="btn-outline" disabled>
                  {t("downloadButton")}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllGallerySlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}
