import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Nav");

  return (
    <div className="page-shell">
      <div className="page-content">
        <Nav />
        <h1 className="h-page">{t("contact")}</h1>
      </div>
    </div>
  );
}
