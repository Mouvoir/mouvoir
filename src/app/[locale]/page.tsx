import { setRequestLocale } from "next-intl/server";
import { AddGalleryButton } from "@/components/AddGalleryButton";
import { GalleryCard } from "@/components/GalleryCard";
import { getAllGalleryEntries } from "@/lib/gallery";
import { getAllTemplates } from "@/lib/templates";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [entries, templates] = await Promise.all([
    getAllGalleryEntries(),
    getAllTemplates(),
  ]);
  const templateOptions = templates.map((t) => ({ label: t.title, value: t.slug }));

  return (
    <>
      <div className="flex justify-end mb-6">
        <AddGalleryButton templateOptions={templateOptions} />
      </div>

      <div className="grid grid-cols-2 gap-10 mt-2">
        {entries.map((entry) => (
          <GalleryCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </>
  );
}
