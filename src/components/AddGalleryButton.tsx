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
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
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
              case "invalid-image": setError(t("error_invalid-image")); break;
              default: setError(t("error_generic")); break;
            }
            return false;
          }
          return true;
        }}
        footer={error ? <p style={{ color: "red", margin: 0 }}>{error}</p> : null}
        left={
          <>
            <TextField label={t("fieldTitle")} name="title" />
            <TextField label={t("fieldAuthor")} name="author" />
            <ComboboxField
              label={t("fieldType")}
              name="type"
              options={[...EVENT_TYPES]}
            />
            <TextField label={t("fieldDate")} name="date" />
            <TextField label={t("fieldPlace")} name="place" />
            <TextField label={t("fieldEvent")} name="event" />
          </>
        }
        right={
          <>
            <TextAreaField label={t("fieldDescription")} name="description" />
            <TextField label={t("fieldLink")} name="link" />
            <ComboboxField
              label={t("fieldTemplate")}
              name="templateSlug"
              options={templateOptions}
            />
            <FileField label={t("fieldMainPhoto")} name="mainPhoto" accept="image/*" />
            <FileField label={t("fieldPhotos")} name="photos" accept="image/*" multiple />
          </>
        }
      />
    </>
  );
}
