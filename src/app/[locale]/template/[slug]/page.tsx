import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { getAllTemplateSlugs, getTemplateBySlug } from "@/lib/templates";
import { urlForImage } from "@/sanity/imageUrl";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { routing } from "@/i18n/routing";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [template, tDetail, tSchema, tTutorial] = await Promise.all([
    getTemplateBySlug(slug),
    getTranslations("TemplateDetail"),
    getTranslations("TemplateSchema"),
    getTranslations("TemplateTutorial"),
  ]);

  if (!template) notFound();

  const schemaImageUrl = template.schemaImage
    ? urlForImage(template.schemaImage).width(1600).fit("max").url()
    : null;
  const embedUrl = template.videoTutorial
    ? getYoutubeEmbedUrl(template.videoTutorial)
    : null;

  const downloadButton = template.downloadUrl ? (
    <a
      href={template.downloadUrl}
      className="btn-outline"
      target="_blank"
      rel="noreferrer"
    >
      {tDetail("downloadButton")}
    </a>
  ) : (
    <button className="btn-outline" type="button" disabled>
      {tDetail("downloadButton")}
    </button>
  );

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <div className="flex items-center gap-7 mb-2">
          <h1 className="h-page m-0">{template.title}</h1>
          {downloadButton}
        </div>
        {template.tutorialAuthor ? (
          <p className="text-[15px] mb-2">{template.tutorialAuthor}</p>
        ) : null}
        {template.description ? (
          <p className="subline">
            <span className="font-mono uppercase tracking-[0.02em] text-[14px]">
              {tDetail("descriptionLabel")}
            </span>{" "}
            {template.description}
          </p>
        ) : null}
        {template.materials.length > 0 ? (
          <p className="font-mono uppercase tracking-[0.02em] text-[14px] mt-2">
            {tSchema("materialLabel")} {template.materials.join(", ")}
          </p>
        ) : null}

        <div
          className="w-full mt-8 rounded-[6px] relative overflow-hidden flex items-center justify-center"
          style={{
            aspectRatio: "16 / 7",
            background: template.resultVideoUrl
              ? undefined
              : "radial-gradient(circle at 50% 50%, #a9e9db 0%, #a9e9db 40%, transparent 41%), linear-gradient(180deg, #f6b0c8 0%, #f2a3bd 100%)",
          }}
        >
          {template.resultVideoUrl ? (
            <video
              src={template.resultVideoUrl}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 80 80"
              fill="#000"
              aria-hidden="true"
              className="w-[120px] h-[120px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
            >
              <polygon points="20,12 68,40 20,68" />
            </svg>
          )}
        </div>

        <section id="schema" className="mt-20 scroll-mt-24">
          <div className="mt-14">
            <p className="font-mono uppercase tracking-[0.02em] text-[14px] mb-[18px]">
              {tSchema("touchDesignerSchema")}
            </p>

            <div className="relative">
              <div
                className="rounded-[6px] flex items-center justify-center text-[#888] overflow-hidden"
                style={{
                  background: "#191919",
                  aspectRatio: "21 / 9",
                }}
              >
                {schemaImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={schemaImageUrl}
                    alt={`${template.title} schema`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <svg
                    viewBox="0 0 120 200"
                    aria-hidden="true"
                    className="opacity-80 w-[320px]"
                  >
                    <g fill="#f3f3f3" stroke="#ccc" strokeWidth="0.5">
                      <path d="M60 6 C72 6 80 18 80 30 C80 38 76 44 70 50 L86 70 C92 78 96 94 96 110 L100 140 L96 160 L92 180 L82 196 L72 196 L74 170 L68 140 L60 140 L56 160 L58 196 L48 196 L40 180 L34 160 L30 140 L30 116 C30 96 34 82 42 72 L52 52 C46 46 42 38 42 30 C42 18 48 6 60 6 Z" />
                    </g>
                  </svg>
                )}
              </div>
              {template.downloadUrl ? (
                <a
                  href={template.downloadUrl}
                  className="btn-outline absolute top-6 right-6"
                  style={{ background: "#fff" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {tSchema("schemaButton")}
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <section id="tutorial" className="mt-20 scroll-mt-24">
          <p className="font-mono uppercase tracking-[0.02em] text-[14px] mb-6">
            {tTutorial("videoTutorialLabel")}
          </p>

          <div
            className="grid gap-12 mt-6"
            style={{ gridTemplateColumns: "1.5fr 1fr" }}
          >
            <div
              className="rounded-[6px] relative overflow-hidden flex items-center justify-center"
              style={{ background: "#1a1a1a", aspectRatio: "16 / 9" }}
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${template.title} tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : template.videoTutorial ? (
                <a
                  href={template.videoTutorial}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white underline"
                >
                  {template.videoTutorial}
                </a>
              ) : (
                <svg
                  viewBox="0 0 80 80"
                  fill="#fff"
                  aria-hidden="true"
                  className="w-[140px] h-[140px] opacity-60"
                >
                  <polygon points="22,14 66,40 22,66" />
                </svg>
              )}
            </div>

            <aside>
              <p className="m-0 text-[15px] leading-[1.5]">{tTutorial("tutorialOutro")}</p>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllTemplateSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}
