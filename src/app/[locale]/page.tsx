import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <div className="page-shell page-shell--pink">
      <div className="page-content">
        <Nav variant="pink" />

        <section className="relative min-h-[75vh] flex items-center justify-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/dancer-red-1.svg"
            alt=""
            aria-hidden="true"
            className="absolute top-1/2 left-[4%] -translate-y-1/2 w-[520px] opacity-95 pointer-events-none z-[1]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/dancer-red-2.svg"
            alt=""
            aria-hidden="true"
            className="absolute top-1/2 right-[2%] -translate-y-1/2 w-[460px] opacity-95 pointer-events-none z-[1]"
          />

          <div className="relative z-[2] text-white">
            <h1 className="text-[72px] font-normal leading-[1.05] mb-14">
              {t("welcome")}
            </h1>
            <h2 className="text-[72px] font-normal leading-[1.05] max-w-[1100px] mx-auto">
              {t("tagline")}
            </h2>
          </div>
        </section>
      </div>
    </div>
  );
}
