import { GalleryMosaic } from "@/components/gallery/GalleryMosaic";
import { getAllGalleryEntries } from "@/lib/gallery";

export default async function ChoreographyStylesPage() {
  const entries = await getAllGalleryEntries();

  return <GalleryMosaic entries={entries} />;
}
