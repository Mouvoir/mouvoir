import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
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

  const mainPhotoUrl = entry.mainPhoto ? cropImageUrl(entry.mainPhoto, 1200, 675) : null;
  const photoUrls = entry.photos
    .map((photo) => cropImageUrl(photo, 800, 600))
    .filter((url): url is string => Boolean(url));

  return (
    <>
      <h1 className="h-page">{entry.title}</h1>
      <p className="font-mono text-[14px] m-0 mb-2">{entry.author}</p>
      <p className="font-mono text-[14px] m-0 mb-8">
        {entry.date} — {entry.place}
      </p>

      <div
        className="grid gap-14 items-start mt-6"
        style={{ gridTemplateColumns: "1.5fr 1fr" }}
      >
        <div className="w-full rounded-[6px] overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: "16 / 9" }}>
          {mainPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mainPhotoUrl} alt={entry.title} className="w-full h-full object-cover" />
          ) : null}
        </div>

        <aside>
          <h2 className="text-[22px] font-bold m-0 mb-2">
            {entry.event}
            {entry.type ? (
              <em className="italic font-normal"> — {entry.type}</em>
            ) : null}
          </h2>
          <p className="text-[15px] leading-[1.5] m-0 mb-8">
            {entry.description}
          </p>
          {entry.templateTitle ? (
            <p className="font-mono text-[14px] m-0 mb-[14px]">
              {t("templateUsedLabel")} {entry.templateTitle}
            </p>
          ) : null}
          <div className="flex gap-3 flex-wrap">
            {entry.templateDownloadUrl ? (
              <a href={entry.templateDownloadUrl} target="_blank" rel="noreferrer" className="btn-outline">
                {t("downloadButton")}
              </a>
            ) : null}
            {entry.link ? (
              <a href={entry.link} target="_blank" rel="noreferrer" className="btn-outline">
                {t("watchButton")}
              </a>
            ) : null}
          </div>
        </aside>
      </div>

      {photoUrls.length > 0 ? (
        <div className="mt-14">
          <div className="grid grid-cols-3 gap-4">
            {photoUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt={`${entry.title} — ${i + 1}`}
                className="w-full aspect-[4/3] object-cover rounded-[4px]"
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllGallerySlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}
