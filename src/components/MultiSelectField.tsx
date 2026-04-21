"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MultiSelectFieldProps = {
  label: string;
  name: string;
  options?: string[];
  placeholder?: string;
  initialValue?: string[];
  addLabel?: (value: string) => string;
};

const INPUT_BORDER = "1px solid rgba(0, 0, 0, 0.7)";

export function MultiSelectField({
  label,
  name,
  options = [],
  placeholder,
  initialValue = [],
  addLabel = (v) => `+ Add "${v}"`,
}: MultiSelectFieldProps) {
  const [selected, setSelected] = useState<string[]>(initialValue);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalized = useMemo(
    () => new Set(selected.map((s) => s.toLowerCase())),
    [selected],
  );

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    return options
      .filter((opt) => !normalized.has(opt.toLowerCase()))
      .filter((opt) => (q ? opt.toLowerCase().includes(q) : true))
      .slice(0, 8);
  }, [options, normalized, input]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const addValue = (value: string) => {
    const v = value.trim();
    if (!v) return;
    if (normalized.has(v.toLowerCase())) return;
    setSelected((prev) => [...prev, v]);
    setInput("");
  };

  const removeValue = (value: string) => {
    setSelected((prev) => prev.filter((s) => s !== value));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addValue(input);
    } else if (e.key === "Backspace" && input === "" && selected.length > 0) {
      setSelected((prev) => prev.slice(0, -1));
    }
  };

  const trimmedInput = input.trim();
  const addNewItem =
    trimmedInput &&
    !normalized.has(trimmedInput.toLowerCase()) &&
    !suggestions.some((s) => s.toLowerCase() === trimmedInput.toLowerCase()) ? (
      <li>
        <button
          type="button"
          className="w-full text-left px-[12px] py-[8px] text-[14px] hover:bg-[#f5f5f5]"
          style={{ color: "#333" }}
          onMouseDown={(e) => {
            e.preventDefault();
            addValue(trimmedInput);
            inputRef.current?.focus();
          }}
        >
          {addLabel(trimmedInput)}
        </button>
      </li>
    ) : null;

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
          {selected.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] text-[13px]"
              style={{ background: "#f0f0f0" }}
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeValue(value);
                }}
                className="text-[14px] leading-none"
                style={{ color: "#555" }}
              >
                ×
              </button>
              <input type="hidden" name={name} value={value} />
            </span>
          ))}
          <input
            id={`${name}-input`}
            ref={inputRef}
            type="text"
            value={input}
            placeholder={selected.length === 0 ? placeholder : undefined}
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

        {open && (suggestions.length > 0 || input.trim()) ? (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full mt-[4px] rounded-[6px] bg-white z-10 max-h-[220px] overflow-auto"
            style={{ border: INPUT_BORDER, boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}
          >
            {suggestions.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className="w-full text-left px-[12px] py-[8px] text-[14px] hover:bg-[#f5f5f5]"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addValue(opt);
                    inputRef.current?.focus();
                  }}
                >
                  {opt}
                </button>
              </li>
            ))}
            {addNewItem}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
