"use server";

import { revalidateTag } from "next/cache";
import { sanityWriteClient } from "@/sanity/writeClient";
import { MAX_FILE_BYTES, slugify } from "@/lib/upload";

export type CreateTemplateResult =
  | { ok: true; slug: string }
  | {
      ok: false;
      error:
        | "missing-fields"
        | "file-too-large"
        | "schema-must-be-image"
        | "result-must-be-video"
        | "generic";
    };

function extractMaterials(formData: FormData): string[] {
  const values = formData.getAll("material");
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    if (typeof v !== "string") continue;
    const trimmed = v.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out;
}

async function uploadFile(
  file: File,
  kind: "file" | "image",
): Promise<{ _type: "reference"; _ref: string }> {
  const uploaded = await sanityWriteClient.assets.upload(kind, file, {
    filename: file.name,
    contentType: file.type,
  });
  return { _type: "reference", _ref: uploaded._id };
}

export async function createTemplate(
  formData: FormData,
): Promise<CreateTemplateResult> {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true, slug: "" };
  }

  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const creator = (formData.get("creator") as string | null)?.trim() ?? "";
  const description =
    (formData.get("description") as string | null)?.trim() ?? "";
  const materials = extractMaterials(formData);
  const tutorialUrl =
    (formData.get("tutorial") as string | null)?.trim() ?? "";

  const templateFile = formData.get("template");
  const schemaFile = formData.get("schema");
  const resultFile = formData.get("result");

  if (!title) {
    return { ok: false, error: "missing-fields" };
  }

  const files: File[] = [];
  if (templateFile instanceof File && templateFile.size > 0) files.push(templateFile);
  if (schemaFile instanceof File && schemaFile.size > 0) files.push(schemaFile);
  if (resultFile instanceof File && resultFile.size > 0) files.push(resultFile);
  for (const f of files) {
    if (f.size > MAX_FILE_BYTES) return { ok: false, error: "file-too-large" };
  }

  if (
    schemaFile instanceof File &&
    schemaFile.size > 0 &&
    !schemaFile.type.startsWith("image/")
  ) {
    return { ok: false, error: "schema-must-be-image" };
  }

  if (
    resultFile instanceof File &&
    resultFile.size > 0 &&
    !resultFile.type.startsWith("video/")
  ) {
    return { ok: false, error: "result-must-be-video" };
  }

  try {
    const slugBase = slugify(title) || "template";
    const slugSuffix = Math.random().toString(36).slice(2, 8);
    const slug = `${slugBase}-${slugSuffix}`;

    const [downloadRef, schemaRef, resultRef] = await Promise.all([
      templateFile instanceof File && templateFile.size > 0
        ? uploadFile(templateFile, "file")
        : null,
      schemaFile instanceof File && schemaFile.size > 0
        ? uploadFile(schemaFile, "image")
        : null,
      resultFile instanceof File && resultFile.size > 0
        ? uploadFile(resultFile, "file")
        : null,
    ]);

    await sanityWriteClient.create({
      _type: "template",
      title,
      slug: { _type: "slug", current: slug },
      ...(description ? { description } : {}),
      ...(creator ? { tutorialAuthor: creator } : {}),
      ...(tutorialUrl ? { videoTutorial: tutorialUrl } : {}),
      materials,
      ...(downloadRef
        ? { downloadFile: { _type: "file", asset: downloadRef } }
        : {}),
      ...(schemaRef
        ? { schemaImage: { _type: "image", asset: schemaRef } }
        : {}),
      ...(resultRef
        ? { resultVideo: { _type: "file", asset: resultRef } }
        : {}),
      publishedAt: new Date().toISOString(),
    });

    revalidateTag("template");

    return { ok: true, slug };
  } catch (err) {
    console.error("createTemplate failed", err);
    return { ok: false, error: "generic" };
  }
}
