import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddGalleryButton } from "@/components/AddGalleryButton";
import { HoverVideoThumbnail } from "@/components/HoverVideoThumbnail";
import { Nav } from "@/components/Nav";
import { getAllGalleryEntries } from "@/lib/gallery";
import { getAllTemplates } from "@/lib/templates";
import { cropImageUrl } from "@/sanity/imageUrl";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Gallery");

  const [entries, templates] = await Promise.all([
    getAllGalleryEntries(),
    getAllTemplates(),
  ]);
  const templateOptions = templates.map((t) => ({ label: t.title, value: t.slug }));

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <div className="flex items-end justify-between gap-6 mb-3">
          <h1 className="h-page" style={{ marginBottom: 0 }}>
            {t("title")}
          </h1>
          <AddGalleryButton templateOptions={templateOptions} />
        </div>
        <p className="subline">{t("subline")}</p>

        <div className="grid grid-cols-3 gap-8 mt-8">
          {entries.map((entry) => {
            const thumbUrl = entry.thumbnail ? cropImageUrl(entry.thumbnail, 600, 338) : null;

            return (
              <article key={entry.slug} className="flex flex-col">
                <HoverVideoThumbnail
                  videoUrl={entry.mediaFileUrl ?? undefined}
                  posterUrl={thumbUrl ?? undefined}
                  href={`/gallery/${entry.slug}`}
                  ariaLabel={entry.vjName}
                />
                <h2 className="text-[20px] font-bold mt-4 mb-1">{entry.vjName}</h2>
                {entry.date ? (
                  <p className="font-mono text-[13px] m-0 mb-4">{entry.date}</p>
                ) : null}
                {(entry.templateTitle || entry.eventType) ? (
                  <p className="font-bold m-0 mb-[2px]">
                    {entry.templateTitle}
                    {entry.templateTitle && entry.eventType ? " - " : ""}
                    {entry.eventType ? (
                      <em className="italic font-normal">
                        {t("eventPrefix")} {entry.eventType}
                      </em>
                    ) : null}
                  </p>
                ) : null}
                {entry.quote ? (
                  <p className="text-[14px] m-0 mb-4 max-w-[48ch]">
                    «{entry.quote}»
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
