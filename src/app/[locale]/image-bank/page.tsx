import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddImageBankButton } from "@/components/AddImageBankButton";
import { ImageBankCard } from "@/components/ImageBankCard";
import { fetchImageBankEntries } from "@/lib/imageBank";

export default async function ImageBankPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ImageBank");
  const tUpload = await getTranslations("ImageBankUpload");
  const entries = await fetchImageBankEntries();

  return (
    <>
      <div className="flex items-end justify-between gap-6 mb-3">
        <h1 className="h-page" style={{ marginBottom: 0 }}>
          {t("title")}
        </h1>
        <AddImageBankButton />
      </div>
      <p className="subline">{t("subline")}</p>

      {entries.length === 0 ? (
        <p className="text-[16px] mt-8">{tUpload("empty")}</p>
      ) : (
        <div className="grid grid-cols-3 gap-8 mt-8">
          {entries.map((entry) => (
            <ImageBankCard
              key={entry._id}
              entry={entry}
              downloadLabel={t("downloadButton")}
            />
          ))}
        </div>
      )}
    </>
  );
}
