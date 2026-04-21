const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const isValidProjectId =
  !!rawProjectId && /^[a-z0-9-]+$/.test(rawProjectId);

export const sanityConfig = {
  projectId: isValidProjectId ? (rawProjectId as string) : "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-03-04",
  useCdn: true,
  perspective: "published",
} as const;
