import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/sanity/client";

export interface Material {
  id: string;
  label: string;
  image?: SanityImageSource;
}

export async function getAllMaterials(): Promise<Material[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "material"] | order(label asc) {
      "id": _id,
      label,
      image
    }`,
    {},
    { next: { revalidate: 60, tags: ["material"] } },
  );
}
