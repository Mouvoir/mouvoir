"use client";

import type { FormEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

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

type ComboboxOption = string | { label: string; value: string };
const optLabel = (o: ComboboxOption) => (typeof o === "string" ? o : o.label);
const optValue = (o: ComboboxOption) => (typeof o === "string" ? o : o.value);

export function ComboboxField({
  label,
  name,
  options,
  multiple = false,
}: {
  label: string;
  name: string;
  options: ComboboxOption[];
  multiple?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [selected, setSelected] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const filtered = useMemo(
    () =>
      options.filter(
        (opt) =>
          !selectedSet.has(optValue(opt)) &&
          optLabel(opt).toLowerCase().includes(query.toLowerCase()),
      ),
    [options, selectedSet, query],
  );

  const labelFor = useMemo(() => {
    const map = new Map<string, string>();
    for (const opt of options) map.set(optValue(opt), optLabel(opt));
    return map;
  }, [options]);

  const add = (opt: ComboboxOption) => {
    const val = optValue(opt);
    setSelected((s) => (multiple ? (s.includes(val) ? s : [...s, val]) : [val]));
    setQuery("");
    setOpen(false);
    setHighlighted(-1);
    inputRef.current?.focus();
  };

  const remove = (value: string) => {
    setSelected((s) => s.filter((v) => v !== value));
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && query === "" && selected.length > 0) {
      remove(selected[selected.length - 1]);
      return;
    }
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        setHighlighted(0);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlighted((h) => Math.max(h - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter" && highlighted >= 0) {
      add(filtered[highlighted]);
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-[8px]" ref={containerRef}>
      <label htmlFor={`${name}-input`} className="text-[20px] font-bold">
        {label}
      </label>
      <input type="hidden" name={name} value={multiple ? selected.join(",") : (selected[0] ?? "")} />
      <div className="relative">
        <div
          className="w-full rounded-[6px] px-3 py-[8px] bg-white flex flex-wrap gap-[6px] items-center cursor-text"
          style={{ border: INPUT_BORDER, minHeight: 48 }}
          onClick={() => inputRef.current?.focus()}
        >
          {selected.map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-[6px] pl-[10px] pr-[6px] py-[4px] bg-[#1a1a1a] text-white text-[13px] rounded-full leading-none"
            >
              {labelFor.get(val) ?? val}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  remove(val);
                }}
                className="flex items-center justify-center w-[16px] h-[16px] rounded-full hover:bg-white/20 transition-colors"
                aria-label={`Remove ${labelFor.get(val) ?? val}`}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                  <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            id={`${name}-input`}
            type="text"
            value={query}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setHighlighted(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 outline-none text-[15px] bg-transparent py-[4px]"
            style={{ minWidth: selected.length === 0 ? "100%" : 100 }}
          />
        </div>
        {open && filtered.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-50 w-full bg-white mt-[3px] rounded-[6px] overflow-auto"
            style={{
              border: INPUT_BORDER,
              boxShadow: "0 8px 28px rgba(0,0,0,0.10)",
              maxHeight: 200,
            }}
          >
            {filtered.map((opt, i) => (
              <li
                key={optValue(opt)}
                role="option"
                aria-selected={i === highlighted}
                onMouseDown={() => add(opt)}
                onMouseEnter={() => setHighlighted(i)}
                className="px-3 py-[10px] text-[15px] cursor-pointer"
                style={{ background: i === highlighted ? "#f5f5f5" : "transparent" }}
              >
                {optLabel(opt)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function FileField({
  label,
  name,
  accept,
  multiple = false,
}: {
  label: string;
  name: string;
  accept?: string;
  multiple?: boolean;
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
          multiple={multiple}
          className="text-[14px] w-full outline-none"
        />
      </div>
    </div>
  );
}
