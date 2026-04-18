import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TEMPLATES } from "@/lib/templates";
import { routing } from "@/i18n/routing";

export default async function TemplateSchemaPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const template = TEMPLATES[slug];

  if (!template) notFound();

  const t = await getTranslations("TemplateSchema");

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
        <p className="font-mono uppercase tracking-[0.02em] text-[14px] mb-6">
          {t("materialLabel")} {template.material}
        </p>

        <div
          className="grid gap-8 items-start mt-6"
          style={{ gridTemplateColumns: "auto 1fr" }}
        >
          <figure className="w-[180px] m-0">
            <svg viewBox="0 0 180 140" aria-hidden="true" className="w-[180px]">
              <rect x="0" y="0" width="180" height="140" fill="#f1f1f1" rx="4" />
              <ellipse cx="90" cy="110" rx="62" ry="16" fill="#dcdcdc" />
              <path d="M32,102 Q90,30 148,102 Z" fill="#eee" stroke="#bbb" />
              <circle cx="90" cy="90" r="22" fill="#222" />
              <circle cx="90" cy="90" r="14" fill="#4a4a4a" />
              <circle cx="90" cy="90" r="6" fill="#ccc" />
              <text
                x="46"
                y="88"
                fill="#b22"
                fontFamily="Arial"
                fontSize="8"
                fontWeight="700"
              >
                HIKVISION
              </text>
            </svg>
          </figure>
          <p className="text-[15px] max-w-[620px]">{template.hardwareTip}</p>
        </div>

        <div className="mt-14">
          <p className="font-mono uppercase tracking-[0.02em] text-[14px] mb-[18px]">
            {t("touchDesignerSchema")}
          </p>

          <div className="relative">
            <div
              className="rounded-[6px] flex items-center justify-center text-[#888]"
              style={{ background: "#191919", aspectRatio: "21 / 9" }}
            >
              <svg
                viewBox="0 0 120 200"
                aria-hidden="true"
                className="opacity-80 w-[320px]"
              >
                <g fill="#f3f3f3" stroke="#ccc" strokeWidth="0.5">
                  <path d="M60 6 C72 6 80 18 80 30 C80 38 76 44 70 50 L86 70 C92 78 96 94 96 110 L100 140 L96 160 L92 180 L82 196 L72 196 L74 170 L68 140 L60 140 L56 160 L58 196 L48 196 L40 180 L34 160 L30 140 L30 116 C30 96 34 82 42 72 L52 52 C46 46 42 38 42 30 C42 18 48 6 60 6 Z" />
                </g>
              </svg>
            </div>
            <button
              type="button"
              className="btn-outline absolute top-6 right-6"
              style={{ background: "#fff" }}
            >
              {t("schemaButton")}
            </button>
          </div>
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
