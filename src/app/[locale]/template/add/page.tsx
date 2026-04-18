import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";

export default async function AddTemplatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TemplateAdd");

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />

        <h1 className="h-page">{t("title")}</h1>

        <div className="grid grid-cols-3 gap-12 mt-8">
          <article className="flex flex-col">
            <div className="w-full aspect-video rounded-[4px] border-[1.5px] border-[#1a1a1a] bg-white relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span
                  aria-hidden="true"
                  className="text-[180px] leading-none font-bold text-[#1a1a1a]"
                >
                  +
                </span>
                <span className="text-[20px] font-semibold text-[#1a1a1a]">
                  {t("addTemplateCta")}
                </span>
              </div>
            </div>
            <h2 className="text-[22px] font-bold mt-7 mb-[6px]">
              {t("cardTitle")}
            </h2>
            <p className="text-[15px] text-[#1a1a1a] max-w-[48ch]">
              {t("cardBody")}
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
