"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialChipImage } from "./MaterialChip";

export type MaterialOption = {
  id: string;
  label: string;
  imageUrl?: string;
};

type MaterialPickerFieldProps = {
  label: string;
  name: string;
  options: MaterialOption[];
  placeholder?: string;
  emptyHint?: string;
};

const INPUT_BORDER = "1px solid rgba(0, 0, 0, 0.7)";

export function MaterialPickerField({
  label,
  name,
  options,
  placeholder,
  emptyHint,
}: MaterialPickerFieldProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedSet = new Set(selectedIds);
  const selectedOptions = selectedIds
    .map((id) => options.find((o) => o.id === id))
    .filter((o): o is MaterialOption => !!o);

  const q = input.trim().toLowerCase();
  const suggestions = options
    .filter((opt) => !selectedSet.has(opt.id))
    .filter((opt) => (q ? opt.label.toLowerCase().includes(q) : true))
    .slice(0, 8);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const addId = (id: string) => {
    if (selectedSet.has(id)) return;
    setSelectedIds((prev) => [...prev, id]);
    setInput("");
  };

  const removeId = (id: string) => {
    setSelectedIds((prev) => prev.filter((s) => s !== id));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[0]) addId(suggestions[0].id);
    } else if (e.key === "Backspace" && input === "" && selectedIds.length > 0) {
      setSelectedIds((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-[8px]" ref={rootRef}>
      <label htmlFor={`${name}-input`} className="text-[20px] font-bold">
        {label}
      </label>

      <div
        className="relative rounded-[6px] bg-white"
        style={{ border: INPUT_BORDER }}
      >
        <div
          className="flex flex-wrap items-center gap-[6px] px-[10px] py-[8px] pr-[36px] cursor-text"
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
        >
          {selectedOptions.map((opt) => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-[6px] rounded-full pl-[4px] pr-[8px] py-[3px] text-[13px]"
              style={{ background: "#f0f0f0" }}
            >
              <MaterialChipImage imageUrl={opt.imageUrl} size={22} />
              {opt.label}
              <button
                type="button"
                aria-label={`Remove ${opt.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeId(opt.id);
                }}
                className="text-[14px] leading-none"
                style={{ color: "#555" }}
              >
                ×
              </button>
              <input type="hidden" name={name} value={opt.id} />
            </span>
          ))}
          <input
            id={`${name}-input`}
            ref={inputRef}
            type="text"
            value={input}
            placeholder={selectedIds.length === 0 ? placeholder : undefined}
            onChange={(e) => {
              setInput(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-[15px] py-[4px]"
          />
        </div>

        <button
          type="button"
          aria-label="Toggle options"
          onClick={() => {
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
          className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[12px]"
          style={{ color: "#555" }}
        >
          ▾
        </button>

        {open ? (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full mt-[4px] rounded-[6px] bg-white z-10 max-h-[260px] overflow-auto"
            style={{
              border: INPUT_BORDER,
              boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
            }}
          >
            {suggestions.length > 0 ? (
              suggestions.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    className="w-full flex items-center gap-[10px] text-left px-[12px] py-[8px] text-[14px] hover:bg-[#f5f5f5]"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addId(opt.id);
                      inputRef.current?.focus();
                    }}
                  >
                    {opt.imageUrl ? (
                      <MaterialChipImage imageUrl={opt.imageUrl} size={28} />
                    ) : (
                      <span
                        className="w-[28px] h-[28px] rounded-full flex-none"
                        style={{ background: "#eee" }}
                      />
                    )}
                    <span>{opt.label}</span>
                  </button>
                </li>
              ))
            ) : (
              <li
                className="px-[12px] py-[10px] text-[13px]"
                style={{ color: "#777" }}
              >
                {emptyHint ?? "No materials available."}
              </li>
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
