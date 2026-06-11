import { fetchYoutubeMeta, type YoutubeMeta } from "@/lib/youtube";

interface YoutubeLink {
  youtubeId: string;
  duration?: string;
  title: string;
  author: string;
  description?: string;
  tags?: string[];
}

const PLAYLIST_AESTHETIC: YoutubeLink[] = [
  {
    youtubeId: "NnrWjQ_zO-s",
    duration: "31:33",
    title: "Interactive Particles using particlesGpu in Touch",
    author: "Par Function Store sur TOUCHDESIGNER",
    description:
      "Détecte le mouvement de la foule via webcam et génère des visuels réactifs en temps réel.",
    tags: ["Touchdesigner", "Camera/ Kinect"],
  },
  {
    youtubeId: "Jz-irdEYUZM",
    duration: "18:59",
    title: "Interactive Particles with Slamtec LiDAR",
    author: "Par anya maryina sur TOUCHDESIGNER",
    description:
      "Détecte le mouvement de la foule via webcam et génère des visuels réactifs en temps réel.",
    tags: ["Touchdesigner", "Camera/ Kinect"],
  },
  {
    youtubeId: "8ZgvxwmQGZw",
    duration: "11:50",
    title: "Audioreactive Kinect Dancer",
    author: "Par reflekkt sur TOUCHDESIGNER",
    description:
      "Détecte le mouvement de la foule via webcam et génère des visuels réactifs en temps réel.",
    tags: ["Touchdesigner", "Camera/ Kinect"],
  },
];

const PLAYLIST_INTERACTION: YoutubeLink[] = [
  {
    youtubeId: "HIn2IBBhxXk",
    duration: "5:16",
    title: "Tracking motion without a Kinect",
    author: "Par Benjamin Carrier sur TOUCHDESIGNER",
    description:
      "Détecte le mouvement de la foule via webcam et génère des visuels réactifs en temps réel.",
    tags: ["Touchdesigner", "Camera/ Kinect"],
  },
  {
    youtubeId: "8ZgvxwmQGZw",
    duration: "—:—",
    title: "Audioreactive Kinect Dancer",
    author: "Par reflekkt sur TOUCHDESIGNER",
  },
];

interface PluginItem {
  name: string;
  author: string;
  description: string;
  tags: string[];
  url: string;
}

const PLUGINS_TD: PluginItem[] = [
  {
    name: "Plugin Kinect",
    author: "Par stosumarte sur TOUCHDESIGNER",
    description:
      "Détecte le mouvement de la foule via webcam et génère des visuels réactifs en temps réel.",
    tags: ["Touchdesigner", "Kinect", "Mac"],
    url: "https://github.com/stosumarte/FreenectTD",
  },
  {
    name: "Media Pipe",
    author: "Par Torin Blankensmith sur TOUCHDESIGNER",
    description:
      "Détecte le mouvement de la foule via webcam et génère des visuels réactifs en temps réel.",
    tags: ["Touchdesigner", "Kinect"],
    url: "https://github.com/torinmb/mediapipe-touchdesigner",
  },
];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="80" height="80" fill="currentColor">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.14.08 1.74 1.17 1.74 1.17 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.3 3.15 1.18a10.8 10.8 0 0 1 5.73 0c2.19-1.48 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.82 1.18 3.08 0 4.43-2.7 5.4-5.27 5.69.41.36.77 1.05.77 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function YoutubeArticle({
  item,
  meta,
}: {
  item: YoutubeLink;
  meta?: YoutubeMeta;
}) {
  const url = `https://www.youtube.com/watch?v=${item.youtubeId}`;
  const duration = meta?.duration ?? item.duration ?? "—:—";
  const thumbnail =
    meta?.thumbnail ?? `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
  return (
    <article
      className="grid items-start py-4"
      style={{ gridTemplateColumns: "210px 1fr", gap: "24px" }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Regarder sur YouTube : ${item.title}`}
        className="rounded-[8px] overflow-hidden relative text-white flex items-end justify-end px-[10px] py-[6px] text-[13px] font-semibold bg-black"
        style={{
          aspectRatio: "16 / 9",
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {duration}
        </span>
      </a>
      <div>
        <h3 className="text-[20px] font-bold m-0 mb-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {item.title}
          </a>
        </h3>
        <p className="font-mono text-[13px] tracking-[0.02em] m-0 mb-2">
          {item.author}
        </p>
        {item.description && (
          <p className="text-[14px] m-0 mb-3 max-w-[48ch]">
            {item.description}
          </p>
        )}
        {item.tags && (
          <div className="flex gap-[10px] flex-wrap">
            {item.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function PluginArticle({ item }: { item: PluginItem }) {
  return (
    <article
      className="grid items-start py-[18px]"
      style={{ gridTemplateColumns: "80px 1fr", gap: "20px" }}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ouvrir ${item.name} sur GitHub`}
        className="w-20 h-20 flex items-center justify-center text-[#1a1a1a]"
      >
        <GithubIcon />
      </a>
      <div>
        <h3 className="text-[20px] font-bold m-0 mb-1">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {item.name}
          </a>
        </h3>
        <p className="font-mono text-[13px] tracking-[0.02em] m-0 mb-2">
          {item.author}
        </p>
        <p className="text-[14px] m-0 mb-3 max-w-[48ch]">{item.description}</p>
        <div className="flex gap-[10px] flex-wrap">
          {item.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default async function UsefulLinksPage() {
  const allIds = [...PLAYLIST_AESTHETIC, ...PLAYLIST_INTERACTION].map(
    (i) => i.youtubeId,
  );
  const metas = await fetchYoutubeMeta(allIds);

  return (
    <>
      <h1 className="h-page">Liens utiles</h1>

      <div
        className="grid mt-6"
        style={{ gridTemplateColumns: "1.4fr 1fr", gap: "80px" }}
      >
        <section>
          <h2 className="font-mono uppercase tracking-[0.05em] text-[14px] m-0 mb-[18px]">
            Tutoriel YouTube
          </h2>

          <p className="text-[14px] my-[22px] mb-[14px]">
            Playlist esthétique :
          </p>
          {PLAYLIST_AESTHETIC.map((item, idx) => (
            <YoutubeArticle
              key={`a-${item.youtubeId}-${idx}`}
              item={item}
              meta={metas[item.youtubeId]}
            />
          ))}

          <p className="text-[14px] my-[22px] mb-[14px]">
            Playlist intéraction :
          </p>
          {PLAYLIST_INTERACTION.map((item, idx) => (
            <YoutubeArticle
              key={`i-${item.youtubeId}-${idx}`}
              item={item}
              meta={metas[item.youtubeId]}
            />
          ))}
        </section>

        <section>
          <h2 className="font-mono uppercase tracking-[0.05em] text-[14px] m-0 mb-[18px]">
            Plugin
          </h2>

          <p className="text-[14px] my-[22px] mb-[14px]">
            Touchdesigner :
          </p>
          {PLUGINS_TD.map((item) => (
            <PluginArticle key={item.name} item={item} />
          ))}

          <p className="text-[14px] mt-12 mb-[14px]">Resolum :</p>
        </section>
      </div>
    </>
  );
}
