export function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (parsed.pathname.startsWith("/embed/")) return url;
    }
    return null;
  } catch {
    return null;
  }
}

export interface YoutubeMeta {
  duration: string;
  thumbnail: string;
  title: string;
  channel: string;
}

interface YoutubeApiThumbnail {
  url: string;
  width: number;
  height: number;
}

interface YoutubeApiItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default?: YoutubeApiThumbnail;
      medium?: YoutubeApiThumbnail;
      high?: YoutubeApiThumbnail;
      standard?: YoutubeApiThumbnail;
      maxres?: YoutubeApiThumbnail;
    };
  };
  contentDetails: {
    duration: string;
  };
}

function parseIsoDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "—:—";
  const h = parseInt(match[1] ?? "0", 10);
  const m = parseInt(match[2] ?? "0", 10);
  const s = parseInt(match[3] ?? "0", 10);
  const ss = String(s).padStart(2, "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${ss}`;
  return `${m}:${ss}`;
}

function pickBestThumbnail(thumbs: YoutubeApiItem["snippet"]["thumbnails"]): string {
  return (
    thumbs.maxres?.url ??
    thumbs.standard?.url ??
    thumbs.high?.url ??
    thumbs.medium?.url ??
    thumbs.default?.url ??
    ""
  );
}

export async function fetchYoutubeMeta(
  ids: string[],
): Promise<Record<string, YoutubeMeta>> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || ids.length === 0) return {};

  const uniqueIds = [...new Set(ids)];
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${uniqueIds.join(",")}&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return {};

  const data = (await res.json()) as { items?: YoutubeApiItem[] };
  const result: Record<string, YoutubeMeta> = {};
  for (const item of data.items ?? []) {
    result[item.id] = {
      duration: parseIsoDuration(item.contentDetails.duration),
      thumbnail: pickBestThumbnail(item.snippet.thumbnails),
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
    };
  }
  return result;
}
