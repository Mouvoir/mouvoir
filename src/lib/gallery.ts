import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/client";

export interface GalleryEntry {
  slug: string;
  title: string;
  author: string;
  type: string;
  date: string;
  place: string;
  event: string;
  description: string;
  link: string | null;
  mainPhoto: SanityImageSource | null;
  photos: SanityImageSource[];
  templateTitle: string | null;
  templateSlug: string | null;
}

const GALLERY_PROJECTION = /* groq */ `
  "slug": slug.current,
  title,
  author,
  type,
  date,
  place,
  event,
  description,
  link,
  mainPhoto,
  "photos": coalesce(photos, []),
  "templateTitle": template->title,
  "templateSlug": template->slug.current
`;

export async function getAllGalleryEntries(): Promise<GalleryEntry[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "galleryEntry" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
      ${GALLERY_PROJECTION}
    }`,
    {},
    { next: { revalidate: 60, tags: ["galleryEntry"] } },
  );
}

export async function getGalleryEntryBySlug(
  slug: string,
): Promise<GalleryEntry | null> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "galleryEntry" && slug.current == $slug][0] {
      ${GALLERY_PROJECTION}
    }`,
    { slug },
    { next: { revalidate: 60, tags: ["galleryEntry", `galleryEntry:${slug}`] } },
  );
}

export async function getAllGallerySlugs(): Promise<string[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "galleryEntry" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: 300, tags: ["galleryEntry"] } },
  );
}
