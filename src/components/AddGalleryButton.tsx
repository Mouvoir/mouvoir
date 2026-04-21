"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AddEntryModal,
  ComboboxField,
  FileField,
  TextAreaField,
  TextField,
} from "./AddEntryModal";
import { EVENT_TYPES } from "@/lib/eventTypes";
import { createGalleryEntry } from "@/app/[locale]/gallery/actions";

export function AddGalleryButton({
  templateOptions = [],
}: {
  templateOptions?: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("GalleryAdd");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-outline"
      >
        <span aria-hidden="true">+</span> {t("cta")}
      </button>

      <AddEntryModal
        title={t("modalTitle")}
        open={open}
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
        submitLabel={t("submit")}
        pendingLabel={t("pending")}
        onSubmit={async (formData) => {
          setError(null);
          const result = await createGalleryEntry(formData);
          if (!result.ok) {
            switch (result.error) {
              case "missing-fields": setError(t("error_missing-fields")); break;
              case "file-too-large": setError(t("error_file-too-large")); break;
              case "generic": setError(t("error_generic")); break;
            }
            return false;
          }
          return true;
        }}
        footer={error ? <p style={{ color: "red", margin: 0 }}>{error}</p> : null}
        left={
          <>
            <TextField label={t("fieldCreator")} name="creator" />
            <TextField label={t("fieldDateLocation")} name="dateLocation" />
            <ComboboxField
              label={t("fieldTemplateName")}
              name="templateSlug"
              options={templateOptions}
            />
            <ComboboxField
              label={t("fieldEventType")}
              name="eventType"
              options={[...EVENT_TYPES]}
            />
          </>
        }
        right={
          <>
            <TextAreaField label={t("fieldComment")} name="comment" />
            <FileField label={t("fieldSetMedia")} name="setMedia" />
          </>
        }
      />
    </>
  );
}
