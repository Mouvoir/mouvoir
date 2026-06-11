"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddEntryModal, FileField, TextAreaField, TextField } from "@/components/shared/AddEntryModal";
import { MaterialPickerField, type MaterialOption } from "@/components/shared/MaterialPickerField";
import { createTemplate } from "@/app/choreography-styles/actions";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields": "Le titre est obligatoire.",
  "file-too-large": "Un des fichiers dépasse la taille maximale (200 Mo).",
  "schema-must-be-image": "Le schéma doit être une image.",
  "result-must-be-video": "La vidéo résultat doit être un fichier vidéo.",
  generic: "Une erreur est survenue, réessaie.",
};

export function AddTemplateButton({
  materialOptions = [],
}: {
  materialOptions?: MaterialOption[];
}) {
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
        <span aria-hidden="true">+</span> Ajouter un template
      </button>

      <AddEntryModal
        title="Ajouter un template"
        open={open}
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
        submitLabel="Envoyer le template"
        pendingLabel="Envoi en cours…"
        onSubmit={async (formData) => {
          setError(null);
          const result = await createTemplate(formData);
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
            <TextField label="Titre" name="title" />
            <TextField label="Nom créateurice" name="creator" />
            <TextAreaField label="Description" name="description" />
            <MaterialPickerField
              label="Matériel / Logiciel"
              name="material"
              options={materialOptions}
              placeholder="Rechercher du matériel…"
              emptyHint="Aucun matériel disponible. Créez-en dans le Studio."
            />
          </>
        }
        right={
          <>
            <FileField label="Template" name="template" />
            <FileField label="Schéma / Mise en place" name="schema" accept="image/*" />
            <TextField label="Vidéo Tutoriel" name="tutorial" />
            <FileField label="Vidéo résultat" name="result" accept="video/*" />
          </>
        }
      />
    </>
  );
}
