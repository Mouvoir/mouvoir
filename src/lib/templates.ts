import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/client";

export interface TemplateMaterial {
  id: string;
  label: string;
  image?: SanityImageSource;
}

export interface Template {
  id: string;
  slug: string;
  title: string;
  description?: string;
  materials: TemplateMaterial[];
  schemaImage?: SanityImageSource;
  videoTutorial?: string;
  resultVideoUrl?: string;
  downloadUrl?: string;
  tutorialAuthor?: string;
}

const TEMPLATE_PROJECTION = /* groq */ `
  "id": _id,
  "slug": slug.current,
  title,
  description,
  "materials": materials[]->{
    "id": _id,
    label,
    image
  },
  schemaImage,
  videoTutorial,
  "resultVideoUrl": resultVideo.asset->url,
  "downloadUrl": downloadFile.asset->url,
  tutorialAuthor
`;

function normalizeTemplate(tpl: Template): Template {
  return {
    ...tpl,
    materials: (tpl.materials ?? []).filter(Boolean),
  };
}

export async function getAllTemplates(): Promise<Template[]> {
  const result = await sanityClient.fetch<Template[]>(
    /* groq */ `*[_type == "template" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
      ${TEMPLATE_PROJECTION}
    }`,
    {},
    { next: { revalidate: 60, tags: ["template"] } },
  );
  return result.map(normalizeTemplate);
}

export async function getTemplateBySlug(
  slug: string,
): Promise<Template | null> {
  const result = await sanityClient.fetch<Template | null>(
    /* groq */ `*[_type == "template" && slug.current == $slug][0] {
      ${TEMPLATE_PROJECTION}
    }`,
    { slug },
    { next: { revalidate: 60, tags: ["template", `template:${slug}`] } },
  );
  return result ? normalizeTemplate(result) : null;
}

export async function getAllTemplateSlugs(): Promise<string[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "template" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: 300, tags: ["template"] } },
  );
}
