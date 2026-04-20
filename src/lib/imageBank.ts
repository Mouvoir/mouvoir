import { sanityClient } from "@/sanity/client";

export type ImageBankEntry = {
  _id: string;
  videoName: string;
  creator: string | null;
  credit: string | null;
  comment: string | null;
  videoUrl: string | null;
  slug: string | null;
};

const QUERY = `*[_type == "mediaAsset" && defined(video.asset)] | order(coalesce(publishedAt, _createdAt) desc){
  _id,
  videoName,
  creator,
  credit,
  comment,
  "videoUrl": video.asset->url,
  "slug": slug.current
}`;

export async function fetchImageBankEntries(): Promise<ImageBankEntry[]> {
  try {
    return await sanityClient.fetch<ImageBankEntry[]>(QUERY);
  } catch (err) {
    console.error("fetchImageBankEntries failed", err);
    return [];
  }
}
