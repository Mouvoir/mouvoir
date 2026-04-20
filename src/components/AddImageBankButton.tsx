"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  AddEntryModal,
  FileField,
  TextAreaField,
  TextField,
} from "./AddEntryModal";
import { createImageBankEntry } from "@/app/[locale]/image-bank/actions";

export function AddImageBankButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("ImageBankUpload");
  const router = useRouter();

  const errorMessage = (code: string) => {
    switch (code) {
      case "missing-fields":
        return t("errorMissingFields");
      case "file-type":
        return t("errorFileType");
      case "file-too-large":
        return t("errorFileTooLarge");
      default:
        return t("errorGeneric");
    }
  };

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
          const result = await createImageBankEntry(formData);
          if (result.ok) {
            router.refresh();
            return true;
          }
          setError(errorMessage(result.error));
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
            <TextField label={t("fieldCreator")} name="creator" />
            <TextField label={t("fieldVideoName")} name="videoName" />
            <TextField label={t("fieldCredit")} name="credit" />
          </>
        }
        right={
          <>
            <FileField
              label={t("fieldVideo")}
              name="video"
              accept="video/*"
            />
            <TextAreaField label={t("fieldComment")} name="comment" />
          </>
        }
      />
    </>
  );
}
