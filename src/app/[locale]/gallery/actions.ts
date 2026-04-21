"use server";

import { revalidateTag } from "next/cache";
import { sanityWriteClient } from "@/sanity/writeClient";
import { MAX_FILE_BYTES, slugify, uploadSanityAsset } from "@/lib/upload";

export type CreateGalleryEntryResult =
  | { ok: true; slug: string }
  | { ok: false; error: "missing-fields" | "file-too-large" | "generic" };

export async function createGalleryEntry(
  formData: FormData,
): Promise<CreateGalleryEntryResult> {
  const vjName = (formData.get("creator") as string | null)?.trim() ?? "";
  const date = (formData.get("dateLocation") as string | null)?.trim() ?? "";
  const templateSlug = (formData.get("templateSlug") as string | null)?.trim() ?? "";
  const eventType = (formData.get("eventType") as string | null)?.trim() ?? "";
  const quote = (formData.get("comment") as string | null)?.trim() ?? "";
  const mediaFile = formData.get("setMedia");

  if (!vjName) {
    return { ok: false, error: "missing-fields" };
  }

  if (mediaFile instanceof File && mediaFile.size > MAX_FILE_BYTES) {
    return { ok: false, error: "file-too-large" };
  }

  try {
    const slugBase = slugify(vjName) || "set";
    const slug = `${slugBase}-${Math.random().toString(36).slice(2, 8)}`;

    let thumbnailRef: { _type: "reference"; _ref: string } | null = null;
    let mediaFileRef: { _type: "reference"; _ref: string } | null = null;

    if (mediaFile instanceof File && mediaFile.size > 0) {
      if (mediaFile.type.startsWith("image/")) {
        thumbnailRef = await uploadSanityAsset(mediaFile, "image");
      } else {
        mediaFileRef = await uploadSanityAsset(mediaFile, "file");
      }
    }

    await sanityWriteClient.create({
      _type: "galleryEntry",
      vjName,
      slug: { _type: "slug", current: slug },
      ...(date ? { date } : {}),
      ...(templateSlug ? { templateSlug } : {}),
      ...(eventType ? { eventType } : {}),
      ...(quote ? { quote } : {}),
      ...(thumbnailRef ? { thumbnail: { _type: "image", asset: thumbnailRef } } : {}),
      ...(mediaFileRef ? { mediaFile: { _type: "file", asset: mediaFileRef } } : {}),
      publishedAt: new Date().toISOString(),
    });

    revalidateTag("galleryEntry", {});

    return { ok: true, slug };
  } catch (err) {
    console.error("createGalleryEntry failed", err);
    return { ok: false, error: "generic" };
  }
}
