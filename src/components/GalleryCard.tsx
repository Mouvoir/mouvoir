import { Link } from "@/i18n/navigation";
import type { GalleryEntry } from "@/lib/gallery";
import { cropImageUrl } from "@/sanity/imageUrl";

const FALLBACK_BACKGROUND = "linear-gradient(135deg, #f6b0c8 0%, #a9e9db 100%)";

interface GalleryCardProps {
  entry: GalleryEntry;
}

export function GalleryCard({ entry }: GalleryCardProps) {
  const photoUrl = entry.mainPhoto ? cropImageUrl(entry.mainPhoto, 900, 506) : null;

  return (
    <article className="flex flex-col">
      <Link
        href={`/gallery/${entry.slug}`}
        className="group relative block w-full aspect-video overflow-hidden rounded-[4px] bg-[#111]"
        aria-label={entry.title}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={entry.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full" style={{ background: FALLBACK_BACKGROUND }} />
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <h3 className="text-white text-[20px] font-bold m-0 leading-tight">
            {entry.title}
          </h3>
          <p className="text-white text-[14px] m-0 mt-1 opacity-90">
            {entry.author}
          </p>
        </div>
      </Link>

      <h2 className="text-[22px] font-bold mt-4 mb-2">{entry.title}</h2>
      {entry.description ? (
        <p className="text-[15px] leading-[1.5] m-0 max-w-[52ch]">
          {entry.description}
        </p>
      ) : null}
    </article>
  );
}
