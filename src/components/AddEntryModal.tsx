"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

type AddEntryModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  left: ReactNode;
  right: ReactNode;
  submitLabel: string;
  onSubmit?: (formData: FormData) => Promise<boolean>;
  pendingLabel?: string;
  footer?: ReactNode;
};

export function AddEntryModal({
  title,
  open,
  onClose,
  left,
  right,
  submitLabel,
  onSubmit,
  pendingLabel,
  footer,
}: AddEntryModalProps) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, pending]);

  useEffect(() => {
    if (!open) setPending(false);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    if (!onSubmit) {
      onClose();
      return;
    }
    const formData = new FormData(e.currentTarget);
    setPending(true);
    try {
      const shouldClose = await onSubmit(formData);
      if (shouldClose) onClose();
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => {
        if (!pending) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style={{
        background: "rgba(255, 213, 232, 0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white"
        style={{
          width: "min(1100px, 92vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "14px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.18)",
          padding: "36px 48px 44px",
        }}
      >
        <h2 className="text-[26px] font-bold m-0 mb-[28px] pl-[6px]">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-x-[60px]">
          <div className="flex flex-col gap-[22px]">{left}</div>
          <div className="flex flex-col gap-[22px]">{right}</div>
        </div>
        {footer ? <div className="mt-[24px]">{footer}</div> : null}
        <div className="mt-[32px] flex justify-center">
          <button
            type="submit"
            className="btn-cta"
            style={{ width: "auto", minWidth: 240, opacity: pending ? 0.6 : 1 }}
            disabled={pending}
          >
            {pending && pendingLabel ? pendingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

const INPUT_BORDER = "1px solid rgba(0, 0, 0, 0.7)";

export function TextField({ label, name }: { label: string; name: string }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={name} className="text-[20px] font-bold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        className="w-full rounded-[6px] px-3 py-[12px] text-[15px] bg-white"
        style={{ border: INPUT_BORDER }}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  minHeight = 96,
}: {
  label: string;
  name: string;
  minHeight?: number;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={name} className="text-[20px] font-bold">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className="w-full rounded-[6px] px-3 py-[12px] text-[15px] bg-white resize-y"
        style={{ border: INPUT_BORDER, minHeight }}
      />
    </div>
  );
}

export function FileField({
  label,
  name,
  accept,
}: {
  label: string;
  name: string;
  accept?: string;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={name} className="text-[20px] font-bold">
        {label}
      </label>
      <div
        className="rounded-[6px] px-[12px] py-[12px] text-[14px] bg-white"
        style={{ border: INPUT_BORDER }}
      >
        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          className="text-[14px] w-full outline-none"
        />
      </div>
    </div>
  );
}
