import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";
import { Link } from "@/i18n/navigation";
import { GALLERY_ENTRIES } from "@/lib/gallery";

const THUMBS: Record<string, React.CSSProperties> = {
  "vj-babyblazer": {
    background:
      "linear-gradient(135deg, #1d1d1d 0%, #2f2628 50%, #3a2d30 100%)",
  },
  "vj-carla": {
    background:
      "linear-gradient(135deg, #0b1322 0%, #0e1a33 60%, #142a55 100%)",
  },
};

const THUMB_OVERLAY: Record<string, string> = {
  "vj-babyblazer":
    "radial-gradient(circle at 30% 50%, rgba(255, 210, 80, 0.3) 0%, transparent 40%)",
  "vj-carla":
    "radial-gradient(circle at 30% 50%, rgba(255, 80, 90, 0.35), transparent 20%), radial-gradient(circle at 32% 56%, rgba(80, 200, 255, 0.4), transparent 12%), radial-gradient(circle at 26% 62%, rgba(120, 255, 120, 0.35), transparent 12%), radial-gradient(circle at 36% 48%, rgba(255, 200, 60, 0.4), transparent 12%), radial-gradient(circle at 42% 56%, rgba(180, 100, 255, 0.35), transparent 12%)",
};

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Gallery");

  const entries = Object.values(GALLERY_ENTRIES);

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <div className="flex items-end justify-between gap-6 mb-3">
          <h1 className="h-page" style={{ marginBottom: 0 }}>
            {t("title")}
          </h1>
          <button type="button" className="btn-outline">
            <span aria-hidden="true">+</span> {t("addEntryTitle")}
          </button>
        </div>
        <p className="subline">{t("subline")}</p>

        <div className="grid grid-cols-3 gap-8 mt-8">
          {entries.map((entry) => (
            <article key={entry.slug} className="flex flex-col">
              <Link
                href={`/gallery/${entry.slug}`}
                className="block w-full aspect-video rounded-[4px] overflow-hidden bg-[#111] relative"
              >
                <div
                  className="w-full h-full relative"
                  style={THUMBS[entry.slug]}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: THUMB_OVERLAY[entry.slug] }}
                  />
                </div>
              </Link>
              <h2 className="text-[20px] font-bold mt-4 mb-1">{entry.vjName}</h2>
              <p className="font-mono text-[13px] m-0 mb-4">{entry.date}</p>
              <p className="font-bold m-0 mb-[2px]">
                {entry.template} -{" "}
                <em className="italic font-normal">{entry.party}</em>
              </p>
              <p className="text-[14px] m-0 mb-4 max-w-[48ch]">
                «{entry.quote}»
              </p>
              <div className="flex gap-3 flex-wrap mt-3">
                <button type="button" className="btn-outline">
                  {t("videoButton")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
