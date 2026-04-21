import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "@/sanity/client";

export interface Template {
  slug: string;
  title: string;
  description?: string;
  materials: string[];
  thumbnail?: SanityImageSource;
  schemaImage?: SanityImageSource;
  videoTutorial?: string;
  resultVideoUrl?: string;
  downloadUrl?: string;
  tutorialAuthor?: string;
  tutorialDescription?: string;
  hardwareTip?: string;
}

const TEMPLATE_PROJECTION = /* groq */ `
  "slug": slug.current,
  title,
  description,
  "materials": coalesce(materials, []),
  thumbnail,
  schemaImage,
  videoTutorial,
  "resultVideoUrl": resultVideo.asset->url,
  "downloadUrl": downloadFile.asset->url,
  tutorialAuthor,
  tutorialDescription,
  hardwareTip
`;

export async function getAllTemplates(): Promise<Template[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "template" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
      ${TEMPLATE_PROJECTION}
    }`,
    {},
    { next: { revalidate: 60, tags: ["template"] } },
  );
}

export async function getTemplateBySlug(
  slug: string,
): Promise<Template | null> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "template" && slug.current == $slug][0] {
      ${TEMPLATE_PROJECTION}
    }`,
    { slug },
    { next: { revalidate: 60, tags: ["template", `template:${slug}`] } },
  );
}

export async function getAllTemplateSlugs(): Promise<string[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "template" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: 300, tags: ["template"] } },
  );
}
