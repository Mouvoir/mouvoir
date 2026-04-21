import type { ImageBankEntry } from "@/lib/imageBank";
import { HoverVideoThumbnail } from "@/components/HoverVideoThumbnail";

type Props = {
  entry: ImageBankEntry;
  downloadLabel: string;
};

export function ImageBankCard({ entry, downloadLabel }: Props) {
  return (
    <article className="flex flex-col">
      <HoverVideoThumbnail videoUrl={entry.videoUrl ?? undefined} />

      <h2 className="text-[22px] font-bold mt-[18px] mb-[6px]">
        {entry.videoName}
      </h2>
      {entry.credit || entry.creator ? (
        <p className="text-[15px] max-w-[48ch] mb-[14px]">
          {entry.credit || entry.creator}
        </p>
      ) : null}
      <div className="flex gap-3 flex-wrap mt-3">
        {entry.videoUrl ? (
          <a
            href={`${entry.videoUrl}?dl=`}
            className="btn-outline"
            rel="noopener"
          >
            {downloadLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}
