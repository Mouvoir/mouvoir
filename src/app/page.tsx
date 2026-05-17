import { AddGalleryButton } from "@/components/AddGalleryButton";
import { GalleryMosaic } from "@/components/GalleryMosaic";
import { getAllGalleryEntries } from "@/lib/gallery";
import { getAllTemplates } from "@/lib/templates";

export default async function HomePage() {
  const [entries, templates] = await Promise.all([
    getAllGalleryEntries(),
    getAllTemplates(),
  ]);
  const templateOptions = templates.map((t) => ({ label: t.title, value: t.id }));

  return (
    <>
      <div className="flex justify-end mb-6">
        <AddGalleryButton templateOptions={templateOptions} />
      </div>

      <GalleryMosaic entries={entries} />
    </>
  );
}
