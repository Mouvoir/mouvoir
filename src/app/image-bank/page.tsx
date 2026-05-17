import { AddImageBankButton } from "@/components/AddImageBankButton";
import { ImageBankCard } from "@/components/ImageBankCard";
import { fetchImageBankEntries } from "@/lib/imageBank";

export default async function ImageBankPage() {
  const entries = await fetchImageBankEntries();

  return (
    <>
      <div className="flex items-end justify-between gap-6 mb-3">
        <h1 className="h-page" style={{ marginBottom: 0 }}>
          Banque d&apos;images
        </h1>
        <AddImageBankButton />
      </div>
      <p className="subline">Images que vous pouvez télécharger pour vos VJing !</p>

      {entries.length === 0 ? (
        <p className="text-[16px] mt-8">
          Aucune vidéo pour le moment. Sois la première à en ajouter une !
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-8 mt-8">
          {entries.map((entry) => (
            <ImageBankCard
              key={entry._id}
              entry={entry}
              downloadLabel="Télécharger ↓"
            />
          ))}
        </div>
      )}
    </>
  );
}
