import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityConfig } from "./config";

const builder = createImageUrlBuilder(sanityConfig);

function hasAsset(source: SanityImageSource | null | undefined): source is SanityImageSource {
  if (!source || typeof source !== "object") return false;
  const asset = (source as { asset?: unknown }).asset;
  return !!asset;
}

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

export function safeImageUrl(
  source: SanityImageSource | null | undefined,
  build: (b: ReturnType<typeof builder.image>) => ReturnType<typeof builder.image>,
): string | undefined {
  if (!hasAsset(source)) return undefined;
  try {
    return build(builder.image(source)).url();
  } catch {
    return undefined;
  }
}

export function cropImageUrl(source: SanityImageSource, width: number, height: number): string {
  return builder.image(source).width(width).height(height).fit("crop").url();
}
