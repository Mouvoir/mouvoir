import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TEMPLATES } from "@/lib/templates";
import { routing } from "@/i18n/routing";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const template = TEMPLATES[slug];

  if (!template) notFound();

  const t = await getTranslations("TemplateDetail");

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <div className="flex items-center gap-7 mb-2">
          <h1 className="h-page m-0">{template.title}</h1>
          <button className="btn-outline" type="button">
            {t("downloadButton")}
          </button>
        </div>
        <p className="subline">
          <span className="font-mono uppercase tracking-[0.02em] text-[14px]">
            {t("descriptionLabel")}
          </span>{" "}
          {template.description}
        </p>

        <div
          className="w-full mt-8 rounded-[6px] relative overflow-hidden flex items-center justify-center"
          style={{
            aspectRatio: "16 / 7",
            background:
              "radial-gradient(circle at 50% 50%, #a9e9db 0%, #a9e9db 40%, transparent 41%), linear-gradient(180deg, #f6b0c8 0%, #f2a3bd 100%)",
          }}
        >
          <svg
            viewBox="0 0 80 80"
            fill="#000"
            aria-hidden="true"
            className="w-[120px] h-[120px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
          >
            <polygon points="20,12 68,40 20,68" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(TEMPLATES).map((slug) => ({ locale, slug })),
  );
}
