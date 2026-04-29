"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AddEntryModal, FileField, TextAreaField, TextField } from "./AddEntryModal";
import { MaterialPickerField, type MaterialOption } from "./MaterialPickerField";
import { createTemplate } from "@/app/[locale]/template/actions";

export function AddTemplateButton({
  materialOptions = [],
}: {
  materialOptions?: MaterialOption[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("TemplateAdd");
  const router = useRouter();

  const errorMessage = (code: string) => {
    switch (code) {
      case "missing-fields":
        return t("errorMissingFields");
      case "file-too-large":
        return t("errorFileTooLarge");
      case "schema-must-be-image":
        return t("errorSchemaType");
      case "result-must-be-video":
        return t("errorResultType");
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
        <span aria-hidden="true">+</span> {t("addTemplateCta")}
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
          const result = await createTemplate(formData);
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
            <TextField label={t("fieldTitle")} name="title" />
            <TextField label={t("fieldCreator")} name="creator" />
            <TextAreaField label={t("fieldDescription")} name="description" />
            <MaterialPickerField
              label={t("fieldMaterial")}
              name="material"
              options={materialOptions}
              placeholder={t("fieldMaterialPlaceholder")}
              emptyHint={t("fieldMaterialEmpty")}
            />
          </>
        }
        right={
          <>
            <FileField label={t("fieldTemplate")} name="template" />
            <FileField
              label={t("fieldSchema")}
              name="schema"
              accept="image/*"
            />
            <TextField label={t("fieldTutorial")} name="tutorial" />
            <FileField
              label={t("fieldResult")}
              name="result"
              accept="video/*"
            />
          </>
        }
      />
    </>
  );
}
