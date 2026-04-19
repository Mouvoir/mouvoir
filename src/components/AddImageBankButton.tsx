"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AddEntryModal,
  FileField,
  TextAreaField,
  TextField,
} from "./AddEntryModal";

export function AddImageBankButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("ImageBankUpload");

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
            <TextField label={t("fieldVideoName")} name="videoName" />
            <TextField label={t("fieldCredit")} name="credit" />
          </>
        }
        right={
          <>
            <FileField label={t("fieldVideo")} name="video" />
            <TextAreaField label={t("fieldComment")} name="comment" />
          </>
        }
      />
    </>
  );
}
