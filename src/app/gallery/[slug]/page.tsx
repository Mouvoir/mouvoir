import { notFound } from "next/navigation";
import { getAllGallerySlugs, getGalleryEntryBySlug } from "@/lib/gallery";
import { cropImageUrl } from "@/sanity/imageUrl";

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getGalleryEntryBySlug(slug);

  if (!entry) notFound();

  const mainPhotoUrl = entry.mainPhoto ? cropImageUrl(entry.mainPhoto, 1600, 1100) : null;
  const photoUrls = entry.photos
    .map((photo) => cropImageUrl(photo, 800, 600))
    .filter((url): url is string => Boolean(url));

  return (
    <>
      <div className="gallery-detail">
        <div className="gallery-detail__media">
          {mainPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mainPhotoUrl} alt={entry.title} />
          ) : null}
        </div>

        <div className="gallery-detail__info">
          <h1 className="gallery-detail__title">{entry.title}</h1>
          <p className="gallery-detail__author">{entry.author}</p>

          <dl className="gallery-detail__meta">
            <p className="gallery-detail__meta-row">TYPE:{entry.type}</p>
            <p className="gallery-detail__meta-row">DATE:{entry.date}</p>
            <p className="gallery-detail__meta-row">LIEU:{entry.place}</p>
            <p className="gallery-detail__meta-row">
              EVENEMENT:{entry.event}
            </p>
          </dl>

          <h2 className="gallery-detail__section-title">DESCRIPTION</h2>
          <p className="gallery-detail__description">{entry.description}</p>

          <div className="gallery-detail__actions">
            {entry.templateSlug ? (
              <a
                href={`/template/${entry.templateSlug}`}
                className="btn-iridescent"
              >
                VOIR COMMENT LE REALISER
              </a>
            ) : null}
            {entry.link ? (
              <a
                href={entry.link}
                target="_blank"
                rel="noreferrer"
                className="btn-blob"
              >
                LINK
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {photoUrls.length > 0 ? (
        <div className="mt-14">
          <div className="grid grid-cols-3 gap-4">
            {photoUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt={`${entry.title} — ${i + 1}`}
                className="w-full aspect-[4/3] object-cover rounded-[4px]"
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllGallerySlugs();
  return slugs.map((slug) => ({ slug }));
}
