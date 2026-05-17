"use server";

import { revalidateTag } from "next/cache";
import { sanityWriteClient } from "@/sanity/writeClient";
import { MAX_FILE_BYTES, slugify, uploadSanityAsset } from "@/lib/upload";

export type CreateGalleryEntryResult =
  | { ok: true; slug: string }
  | {
      ok: false;
      error:
        | "missing-fields"
        | "file-too-large"
        | "invalid-image"
        | "generic";
    };

type ImageRef = { _type: "image"; asset: { _type: "reference"; _ref: string } };

async function uploadImage(file: File): Promise<ImageRef> {
  const asset = await uploadSanityAsset(file, "image");
  return { _type: "image", asset };
}

export async function createGalleryEntry(
  formData: FormData,
): Promise<CreateGalleryEntryResult> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const author = (formData.get("author") as string | null)?.trim() ?? "";
  const type = (formData.get("type") as string | null)?.trim() ?? "";
  const date = (formData.get("date") as string | null)?.trim() ?? "";
  const place = (formData.get("place") as string | null)?.trim() ?? "";
  const event = (formData.get("event") as string | null)?.trim() ?? "";
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  const link = (formData.get("link") as string | null)?.trim() ?? "";
  const templateId = (formData.get("templateId") as string | null)?.trim() ?? "";

  const mainPhoto = formData.get("mainPhoto");
  const photos = formData.getAll("photos").filter((p): p is File => p instanceof File && p.size > 0);

  if (!title || !author || !type || !date || !place || !event || !description) {
    return { ok: false, error: "missing-fields" };
  }

  if (!(mainPhoto instanceof File) || mainPhoto.size === 0) {
    return { ok: false, error: "missing-fields" };
  }

  const allFiles = [mainPhoto, ...photos];

  for (const file of allFiles) {
    if (file.size > MAX_FILE_BYTES) {
      return { ok: false, error: "file-too-large" };
    }
    if (!file.type.startsWith("image/")) {
      return { ok: false, error: "invalid-image" };
    }
  }

  try {
    const slugBase = slugify(title) || "set";
    const slug = `${slugBase}-${Math.random().toString(36).slice(2, 8)}`;

    const mainPhotoRef = await uploadImage(mainPhoto);
    const photoRefs = await Promise.all(photos.map(uploadImage));

    await sanityWriteClient.create({
      _type: "galleryEntry",
      title,
      author,
      slug: { _type: "slug", current: slug },
      type,
      date,
      place,
      event,
      description,
      ...(link ? { link } : {}),
      ...(templateId
        ? { template: { _type: "reference", _ref: templateId } }
        : {}),
      mainPhoto: mainPhotoRef,
      photos: photoRefs.map((ref, i) => ({ ...ref, _key: `photo-${i}-${Math.random().toString(36).slice(2, 8)}` })),
      publishedAt: new Date().toISOString(),
    });

    revalidateTag("galleryEntry", {});

    return { ok: true, slug };
  } catch (err) {
    console.error("createGalleryEntry failed", err);
    return { ok: false, error: "generic" };
  }
}
