"use server";

import { revalidatePath } from "next/cache";
import { sanityWriteClient } from "@/sanity/writeClient";

const MAX_FILE_BYTES = 200 * 1024 * 1024;

export type CreateImageBankEntryResult =
  | { ok: true }
  | { ok: false; error: "missing-fields" | "file-type" | "file-too-large" | "generic" };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createImageBankEntry(
  formData: FormData,
): Promise<CreateImageBankEntryResult> {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true };
  }

  const videoName = (formData.get("videoName") as string | null)?.trim() ?? "";
  const creator = (formData.get("creator") as string | null)?.trim() ?? "";
  const credit = (formData.get("credit") as string | null)?.trim() ?? "";
  const comment = (formData.get("comment") as string | null)?.trim() ?? "";
  const video = formData.get("video");

  if (!videoName || !(video instanceof File) || video.size === 0) {
    return { ok: false, error: "missing-fields" };
  }

  if (!video.type.startsWith("video/")) {
    return { ok: false, error: "file-type" };
  }

  if (video.size > MAX_FILE_BYTES) {
    return { ok: false, error: "file-too-large" };
  }

  try {
    const buffer = Buffer.from(await video.arrayBuffer());
    const uploaded = await sanityWriteClient.assets.upload("file", buffer, {
      filename: video.name || `${slugify(videoName)}.mp4`,
      contentType: video.type,
    });

    const slugBase = slugify(videoName) || "video";
    const slugSuffix = Math.random().toString(36).slice(2, 8);

    await sanityWriteClient.create({
      _type: "mediaAsset",
      videoName,
      slug: { _type: "slug", current: `${slugBase}-${slugSuffix}` },
      ...(creator ? { creator } : {}),
      ...(credit ? { credit } : {}),
      ...(comment ? { comment } : {}),
      video: {
        _type: "file",
        asset: { _type: "reference", _ref: uploaded._id },
      },
      publishedAt: new Date().toISOString(),
    });

    revalidatePath("/fr/image-bank");
    revalidatePath("/en/image-bank");

    return { ok: true };
  } catch (err) {
    console.error("createImageBankEntry failed", err);
    return { ok: false, error: "generic" };
  }
}
