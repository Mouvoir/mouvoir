"use client";

import { useState } from "react";
import {
  AddEntryModal,
  ComboboxField,
  FileField,
  TextAreaField,
  TextField,
} from "@/components/shared/AddEntryModal";
import { EVENT_TYPES } from "@/lib/eventTypes";
import { createGalleryEntry } from "@/app/gallery/actions";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields":
    "Tous les champs sont obligatoires sauf le lien, le template et la liste de photos.",
  "file-too-large": "Une des images est trop volumineuse (max 200 Mo).",
  "invalid-image": "Les fichiers envoyés doivent être des images.",
  generic: "Une erreur est survenue, veuillez réessayer.",
};

export function AddGalleryButton({
  templateOptions = [],
}: {
  templateOptions?: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <span aria-hidden="true">+</span> Ajouter une choré
      </button>

      <AddEntryModal
        title="Ajouter une choré"
        open={open}
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
        submitLabel="Envoyer la choré"
        pendingLabel="Envoi en cours…"
        onSubmit={async (formData) => {
          setError(null);
          const result = await createGalleryEntry(formData);
          if (!result.ok) {
            setError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.generic);
            return false;
          }
          return true;
        }}
        footer={error ? <p style={{ color: "red", margin: 0 }}>{error}</p> : null}
        left={
          <>
            <TextField label="Titre" name="title" />
            <TextField label="Auteurice" name="author" />
            <ComboboxField
              label="Type"
              name="type"
              options={[...EVENT_TYPES]}
            />
            <TextField label="Date" name="date" />
            <TextField label="Lieu" name="place" />
            <TextField label="Évènement" name="event" />
          </>
        }
        right={
          <>
            <TextAreaField label="Description" name="description" />
            <TextField label="Lien (optionnel)" name="link" />
            <ComboboxField
              label="Template (optionnel)"
              name="templateId"
              options={templateOptions}
            />
            <FileField label="Photo principale" name="mainPhoto" accept="image/*" />
            <FileField
              label="Liste de photos (optionnel)"
              name="photos"
              accept="image/*"
              multiple
            />
          </>
        }
      />
    </>
  );
}
