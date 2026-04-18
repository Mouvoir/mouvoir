import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { GALLERY_ENTRIES } from "@/lib/gallery";
import { routing } from "@/i18n/routing";

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const entry = GALLERY_ENTRIES[slug];

  if (!entry) notFound();

  const t = await getTranslations("GalleryDetail");

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <h1 className="h-page">{entry.vjName}</h1>
        <p className="font-mono text-[14px] m-0 mb-8">{entry.date}</p>

        <div
          className="grid gap-14 items-start mt-6"
          style={{ gridTemplateColumns: "1.5fr 1fr" }}
        >
          <div
            className="rounded-[6px] relative overflow-hidden flex items-center justify-center"
            style={{ aspectRatio: "16 / 11", background: "#1a1a1a" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #1a1612 0%, #2b2420 45%, #3c322a 100%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 35% 40%, rgba(220, 180, 60, 0.35), transparent 45%), radial-gradient(circle at 20% 65%, rgba(60, 60, 60, 0.8), transparent 35%)",
              }}
            />
            <svg
              viewBox="0 0 80 80"
              fill="#000"
              aria-hidden="true"
              className="w-[140px] h-[140px] relative z-[2]"
            >
              <polygon points="22,14 66,40 22,66" />
            </svg>
          </div>

          <aside>
            <h2 className="text-[22px] font-bold m-0 mb-2">
              {entry.template} - {entry.party}
            </h2>
            <p className="text-[15px] leading-[1.5] m-0 mb-8">
              «{entry.quote}»
            </p>
            <p className="font-mono text-[14px] m-0 mb-[14px]">
              {t("templateUsedLabel")} {entry.template}
            </p>
            <button type="button" className="btn-outline">
              {t("downloadButton")}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(GALLERY_ENTRIES).map((slug) => ({ locale, slug })),
  );
}
