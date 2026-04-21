import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/client";

export interface GalleryEntry {
  slug: string;
  vjName: string;
  date: string | null;
  templateTitle: string | null;
  templateDownloadUrl: string | null;
  party: string | null;
  quote: string | null;
  thumbnail: SanityImageSource | null;
  videoUrl: string | null;
  mediaFileUrl: string | null;
}

const GALLERY_PROJECTION = /* groq */ `
  "slug": slug.current,
  vjName,
  date,
  "templateTitle": *[_type == "template" && slug.current == ^.templateSlug][0].title,
  "templateDownloadUrl": *[_type == "template" && slug.current == ^.templateSlug][0].downloadFile.asset->url,
  party,
  quote,
  thumbnail,
  videoUrl,
  "mediaFileUrl": mediaFile.asset->url
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
