import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function CharterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Charter");

  return (
    <main
      className="min-h-screen flex items-start justify-center"
      style={{ background: "var(--pink-bg)", padding: "80px" }}
    >
      <article
        className="w-full text-white"
        style={{
          background: "var(--pink-card)",
          borderRadius: "30px",
          maxWidth: "1400px",
          padding: "110px 120px 130px",
        }}
      >
        <h1 className="text-[96px] font-normal text-center tracking-[-0.01em] leading-[1.05] m-0 mb-7">
          {t("brand")}
        </h1>
        <h2 className="text-[60px] font-normal text-center tracking-[0.01em] leading-[1.05] m-0 mb-9">
          {t("title")}
        </h2>
        <p className="font-mono text-[17px] tracking-[0.04em] uppercase text-center mb-14 m-0">
          {t("preamble")}
        </p>

        <p className="text-[22px] leading-[1.45] mb-14 m-0">{t("body")}</p>

        <h3 className="font-mono text-[20px] tracking-[0.04em] uppercase mb-[18px] m-0">
          {t("sectionPresentation")}
        </h3>
        <p className="text-[17px] leading-[1.55] mb-[18px] m-0">
          {t("presentationWelcome")}
        </p>
        <p className="text-[17px] leading-[1.55] mb-[18px] m-0">
          {t("presentationBody")}
        </p>
        <p className="text-[17px] leading-[1.55] mb-[18px] m-0">
          {t("presentationInstructionsLineOne")}
          <br />
          {t("presentationInstructionsLineTwo")}
        </p>
      </article>
    </main>
  );
}
