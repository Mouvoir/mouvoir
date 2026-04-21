import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityConfig } from "./config";

const builder = imageUrlBuilder(sanityConfig);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

export function cropImageUrl(source: SanityImageSource, width: number, height: number): string {
  return builder.image(source).width(width).height(height).fit("crop").url();
}
