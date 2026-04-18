import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TEMPLATES } from "@/lib/templates";
import { routing } from "@/i18n/routing";

export default async function TemplateTutorialPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const template = TEMPLATES[slug];

  if (!template) notFound();

  const t = await getTranslations("TemplateTutorial");

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
          {t("videoTutorialLabel")}
        </p>

        <div
          className="grid gap-12 mt-6"
          style={{ gridTemplateColumns: "1.5fr 1fr" }}
        >
          <div
            className="rounded-[6px] relative overflow-hidden flex items-center justify-center"
            style={{ background: "#1a1a1a", aspectRatio: "16 / 9" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  "repeating-conic-gradient(from 0deg at 0 0, #2a2a2a 0deg 90deg, #1d1d1d 90deg 180deg) 0 0 / 20px 20px, #111",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute flex gap-[18px]"
              style={{ left: "6%", top: "40%" }}
            >
              {["#444", "#333", "#555", "#2b2b2b"].map((bg, i) => (
                <div
                  key={i}
                  className="rounded-[3px]"
                  style={{
                    width: 48,
                    height: 40,
                    background: bg,
                    border: "2px solid #7a3fa8",
                  }}
                />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="absolute rounded-[4px]"
              style={{
                right: "3%",
                bottom: "4%",
                width: "14%",
                aspectRatio: "4 / 3",
                background:
                  "linear-gradient(135deg, #3b2a2a 0%, #1a1010 100%)",
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
            <p className="m-0 mb-3">{template.tutorialAuthor}</p>
            <p className="m-0 text-[15px] leading-[1.5]">
              {template.tutorialDescription}
              <br />
              <br />
              {t("tutorialOutro")}
            </p>
          </aside>
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
