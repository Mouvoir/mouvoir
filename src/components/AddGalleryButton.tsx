"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AddEntryModal,
  FileField,
  TextAreaField,
  TextField,
} from "./AddEntryModal";

export function AddGalleryButton() {
  const [open, setOpen] = useState(false);
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
        onClose={() => setOpen(false)}
        submitLabel={t("submit")}
        left={
          <>
            <TextField label={t("fieldCreator")} name="creator" />
            <TextField label={t("fieldDateLocation")} name="dateLocation" />
            <TextField label={t("fieldTemplateName")} name="templateName" />
            <TextAreaField label={t("fieldEventType")} name="eventType" />
          </>
        }
        right={
          <>
            <TextAreaField label={t("fieldComment")} name="comment" />
            <FileField label={t("fieldTemplateLink")} name="templateLink" />
            <FileField label={t("fieldSetMedia")} name="setMedia" />
          </>
        }
      />
    </>
  );
}
