import { notFound } from "next/navigation";
import { getAllGallerySlugs, getGalleryEntryBySlug } from "@/lib/gallery";
import { cropImageUrl } from "@/sanity/imageUrl";
import styles from "./gallery-detail.module.css";

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
      <div className={styles.detail}>
        <div className={styles.media}>
          {mainPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mainPhotoUrl} alt={entry.title} />
          ) : null}
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{entry.title}</h1>
          <p className={styles.author}>{entry.author}</p>

          <dl className={styles.meta}>
            <p className={styles.metaRow}>TYPE:{entry.type}</p>
            <p className={styles.metaRow}>DATE:{entry.date}</p>
            <p className={styles.metaRow}>LIEU:{entry.place}</p>
            <p className={styles.metaRow}>
              EVENEMENT:{entry.event}
            </p>
          </dl>

          <h2 className={styles.sectionTitle}>DESCRIPTION</h2>
          <p className={styles.description}>{entry.description}</p>

          <div className={styles.actions}>
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
