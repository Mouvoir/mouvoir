import { sanityWriteClient } from "@/sanity/writeClient";

export const MAX_FILE_BYTES = 200 * 1024 * 1024;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function uploadSanityAsset(
  file: File,
  kind: "file" | "image",
): Promise<{ _type: "reference"; _ref: string }> {
  const uploaded = await sanityWriteClient.assets.upload(kind, file, {
    filename: file.name,
    contentType: file.type,
  });
  return { _type: "reference", _ref: uploaded._id };
}
