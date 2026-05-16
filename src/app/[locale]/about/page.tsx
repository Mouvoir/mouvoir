import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <>
      <h1 className="h-page">{t("title")}</h1>
      <p
        className="text-[17px] leading-[1.5]"
        style={{ maxWidth: "1200px" }}
      >
        {t("body")}
      </p>

      <div className="flex justify-around gap-10 mt-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/giphy-12.gif"
          alt=""
          aria-hidden="true"
          className="w-[300px] h-auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/giphy-12.gif"
          alt=""
          aria-hidden="true"
          className="w-[300px] h-auto"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/giphy-12.gif"
          alt=""
          aria-hidden="true"
          className="w-[300px] h-auto"
        />
      </div>
    </>
  );
}
