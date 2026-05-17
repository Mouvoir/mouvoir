"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AddEntryModal,
  FileField,
  TextAreaField,
  TextField,
} from "./AddEntryModal";
import { createImageBankEntry } from "@/app/image-bank/actions";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields":
    "Merci de renseigner un nom de vidéo et de joindre un fichier vidéo.",
  "file-type": "Le fichier envoyé doit être une vidéo.",
  "file-too-large": "La vidéo est trop lourde (max 200 Mo).",
  generic: "Une erreur est survenue. Merci de réessayer.",
};

export function AddImageBankButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="btn-outline"
      >
        <span aria-hidden="true">+</span> Ajouter une vidéo
      </button>

      <AddEntryModal
        title="Ajouter une vidéo dans la banque à images"
        open={open}
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
        submitLabel="Ajouter à la banque"
        pendingLabel="Envoi en cours…"
        onSubmit={async (formData) => {
          setError(null);
          const result = await createImageBankEntry(formData);
          if (result.ok) {
            router.refresh();
            return true;
          }
          setError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.generic);
          return false;
        }}
        footer={
          <>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            {error ? (
              <p
                role="alert"
                className="text-[14px]"
                style={{ color: "#b4003c" }}
              >
                {error}
              </p>
            ) : null}
          </>
        }
        left={
          <>
            <TextField label="Nom créateurice" name="creator" />
            <TextField label="Nom de la vidéo" name="videoName" />
            <TextField label="Mention / crédit" name="credit" />
          </>
        }
        right={
          <>
            <FileField label="Vidéo" name="video" accept="video/*" />
            <TextAreaField label="Commentaire" name="comment" />
          </>
        }
      />
    </>
  );
}
