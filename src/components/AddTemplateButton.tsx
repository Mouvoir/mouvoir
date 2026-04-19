"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AddEntryModal,
  FileField,
  TextAreaField,
  TextField,
} from "./AddEntryModal";

export function AddTemplateButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("TemplateAdd");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-outline"
      >
        <span aria-hidden="true">+</span> {t("addTemplateCta")}
      </button>

      <AddEntryModal
        title={t("modalTitle")}
        open={open}
        onClose={() => setOpen(false)}
        submitLabel={t("submit")}
        left={
          <>
            <TextField label={t("fieldTitle")} name="title" />
            <TextField label={t("fieldCreator")} name="creator" />
            <TextAreaField label={t("fieldDescription")} name="description" />
            <FileField label={t("fieldMaterial")} name="material" />
          </>
        }
        right={
          <>
            <FileField label={t("fieldTemplate")} name="template" />
            <FileField label={t("fieldSchema")} name="schema" />
            <FileField label={t("fieldTutorial")} name="tutorial" />
            <FileField label={t("fieldResult")} name="result" />
          </>
        }
      />
    </>
  );
}
